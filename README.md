# UE-Civic-API_Srvc

A wrapper with caching for the googleapi civic service to allow you to respond quickly and also to enforce https despite the fact that some of the civic api content provided by google is only http. I do modify the return slightly to make it easier to reference officials and titles together.

## Documentation

https://civicqa.mailmyvoice.com

## Local Dev

* clone this repo
* yarn
* cp src/config_changeme.js src/config.js
* modify config.js with appropriate values
* yarn run dev

Alternatively, you can build with bable and run form dist

* yarn build
* yarn run dist

Available at http://localhost:4050

## Lambda

This is an express service wrapped as a lambda function. You can find an example and details here: https://medium.com/@theBoEffect/porting-node-express-k8-service-to-lambda-with-serverless-a-few-extra-lessons-learned-a9dded3e6d11

* Ensure you have the serverless.com framework installed
* Ensure you have an aws account and configured with serverless
* change the directory .env_changeme to .env
* change the json file values in .env/env.qa.json to match your config.js file
* in aws, make sure you've created an SLS certificate for your route53 domain
* SLS_ENV=qa sls create_domain (if this is the first time)
* SLS_ENV=qa yarn deploy

It may take up to 40 minutes for the domain you create to be available.

## Docker

This service can also be used as a docker container. Dockerfile provided.

* docker build -t you/civic .
* set all env parameters from config.js or just create a docker-compose file (not provided)
* if you manually set parameters: docker run -p 4050:4050 you/civic
* otherwise, if you created the compose file: docker-compose up

Available at http://localhost:4050

## Todo

* <strike>update configs
* get logs with swagger running
* convert code base and update swagger
* update role based access
* update auth requirements for anon users
* implement and test
* deploy to QA
* merge v2
* fix README</strike>
* push to prod