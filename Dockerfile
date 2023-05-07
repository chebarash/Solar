FROM node:latest

WORKDIR .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]