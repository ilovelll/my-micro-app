FROM node:11-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

WORKDIR /home/node/app

# RUN npm install ncc -g

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npx", "micro"]