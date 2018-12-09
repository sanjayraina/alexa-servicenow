const Alexa = require('ask-sdk-core');
const https = require('https');
const constants = require('./constants');

var accessToken = "";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the ServiceNow skill, how can I help?';

    accessToken = handlerInput.requestEnvelope.session.user.accessToken;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const ServiceNowIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ServiceNowIntent';
  },
  async handle(handlerInput) {
    
    if (accessToken) {

      const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
      const ticketType = filledSlots.Tickets.value;
      let snowTable = '';
      if (ticketType.indexOf('incident') == 0) {
        snowTable = 'incident';
      }
      else if (ticketType.indexOf('change') == 0) {
        snowTable = 'change_request';
      }
      else if (ticketType.indexOf('request') == 0) {
        snowTable = 'sc_req_item';
      }
      else if (ticketType.indexOf('problem') == 0) {
        snowTable = 'problem';
      }
      else if (ticketType.indexOf('approval') == 0) {
        snowTable = 'sysapproval_approver';
      }

      const records = await getRecords(snowTable);       // Get the records

      let speechText =  "Here are the 5 most recent " + ticketType + ": ";
      for (let i = 0; i < 5; i++) {
          var rec_number = i + 1;

          speechText += "Record " + (i+1) + '<break time=".5s"/>' + records.result[i].short_description + ". ";
        }
      speechText += '<break time=".5s"/>' + "End of " + ticketType + ".";

      return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Hello World', speechText)
          .getResponse();
        
    }
  }
};

function getRecords(recType) {
  const hdrAuth = "Bearer " + accessToken;

  return new Promise(((resolve, reject) => {
    const snowInstance = constants.servicenow.instance;

    const options = {
      hostname: snowInstance,
      port: 443,
      path: '/api/now/table/' + recType + '?sysparm_query=ORDERBYDESCsys_updated_on&sysparm_limit=5',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: hdrAuth
      }
    };

    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
      }

      response.on('data', (chunk) => {

        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
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
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {

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
