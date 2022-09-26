FROM node:16.15.0 as builder

RUN npm set strict-ssl false
#RUN npm update

WORKDIR /usr/src/app

RUN mkdir -p /dist

COPY ["package.json", "package-lock.json", "./"]

RUN npm install
COPY . .

RUN ls
RUN npm run build
#COPY /usr/src/app/dist ./dist
EXPOSE 3000

CMD npm run start
