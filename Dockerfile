FROM node:11-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# RUN npm install ncc -g

COPY package*.json ./

RUN apt-get update && apt-get install -y build-essential python\
  &&npm install --only=production

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npx", "micro"]