FROM mhart/alpine-node
LABEL owner="bmotlagh@unitedeffects.com"

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN mv /app/src/config_changeme.js /app/src/config.js
RUN yarn --production

EXPOSE 4050

CMD ["yarn", "start"]