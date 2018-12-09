# Alexa ServiceNow Skill Example

This Alexa Skill queries a ServiceNow instance for most recent tickets and plays them back.

## You will need...

1. NodeJS and ```npm``` installed.  

2. An AWS account. CAUTION: You will incur charges, unless you are using the free-tier.

3. IAM user with appropriate roles.

4. An Amazon developer account

5. A ServiceNow developer account and instance.

6. The AWS CLI

7. The ASK CLI


## How to deploy

Download the skill dependencies:
```bash
$ (cd lambda && npm install)
```

Deploy the skill and lambda function with ASK CLI:
```bash
$ ask deploy
```

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
