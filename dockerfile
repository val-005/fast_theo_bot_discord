FROM node:latest

# Creation du repertoire
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copie du package.json
COPY package.json /usr/src/bot
RUN npm install

# Copie du bot
COPY . /usr/src/bot

# Start me!
CMD ["node", "bot.js"]