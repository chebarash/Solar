FROM node:latest

RUN mkdir /root/app
WORKDIR /root/app
COPY . /root/app

RUN npm install
RUN npm run build

EXPOSE 3000

CMD npm start