# Alexa ServiceNow Skill Example

This Alexa Skill queries a ServiceNow instance for most recent tickets and plays them back.

## You will need...

- NodeJS and ```npm``` installed.  

- An AWS account. CAUTION: You will incur charges, unless you are using the free-tier.

- IAM user with appropriate roles.

- An Amazon developer account

- A ServiceNow developer account and instance.

- AWS CLI

- ASK CLI


## How to deploy

Download the skill dependencies:
```bash
$ cd lambda/custom; npm install
```

Deploy the skill and lambda function with ASK CLI:
```bash
$ ask deploy
```

Create OAuth API Endpoint in ServiceNow.
- Name: Alexa ServiceNow
- Redirect URL: https://layla.amazon.com/api/skill/link/M26D1D2CM95YM6

Link the skill with ServiceNow

- Log into Alexa developer console and navigate to the skill
- Select the Account Linking tab and enter the following details:

## Take it for a spin

You:  "Alexa, open ServiceNow"

Alexa: "Welcome to the ServiceNow skill. How can I help?"

You: "Tell me the recent incidents"

Alexa: "Here are the 5 most recent incidents..."

## Tidy up

It's a good idea to clean up.

- delete the lambda function (ask-custom-alexa-servicenow)
- delete the IAM execution role (ask-lambda-alexa-servicenow)
- delete the skill 
