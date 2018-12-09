const Alexa = require('ask-sdk-core');
const request = require('request');
const constants = require('./constants');

var access_token = "";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speech_text = 'Welcome to the ServiceNow app, how can I help?';
    console.log("LaunchRequest: request = ", handlerInput.requestEnvelope);
    access_token = handlerInput.requestEnvelope.session.user.accessToken;
    
    return handlerInput.responseBuilder
      .speak(speech_text)
      .reprompt(speech_text)
      .getResponse();
  },
};

const ServiceNowIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ServiceNowIntent';
  },
  handle(handlerInput) {
    
    if (access_token) {
      console.log("Found access_token, sending request to ServiceNow");

      // const filledSlots = handlerInput.requestEnvelope.request.intent.slots;

      // const filled_slots = handlerInput.requestEnvelope.request.intent.slots;
      // const ticket_type = filled_slots.Ticket.value;
      const snow_ep = constants.snow_url + 'incident';

      request({
        url: snow_ep,
        auth: {'bearer': access_token}
      }, function(err, res) {
        var records = JSON.parse(res.body);
        var speech_text = 'Here are your top 5 records. ';
        for (var i = 0; i < 5; i++) {
          var rec_number = i + 1;
          
          speech_text += "Record " + rec_number + " " + records.result[i].short_description + ". ";
        }
        console.log("speech_text: ", speech_text);

        return handlerInput.responseBuilder
          .speak(speech_text)
          .withSimpleCard('Hello World', speech_text)
          .getResponse();
        
      });
    
    }
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speech_text = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speech_text)
      .reprompt(speech_text)
      .withSimpleCard('Hello World', speech_text)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speech_text = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speech_text)
      .withSimpleCard('Hello World', speech_text)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ServiceNowIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
