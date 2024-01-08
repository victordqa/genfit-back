## Description

[Genfit](https://genfit-frony.onrender.com/) is a web application that helps crossfit coaches create, balance and analyse their trainnings. The app makes smart and complete trainning suggestions based on the exercises history.

## Features

-Coach authorization and authentication
-Coach may create multiple boxes/classes
-For each box, the coach recieves pesonalized suggetions that can be easily adapted
-Graphic visualization of muscle loads resulting from previous accumulated trainnings

## Main Technologies

-TypeScript
-NestJs
-passport
-express
-TypeORM
-json web token
-jest
-supertest

## Installation

```bash
$ npm install
```

After installing the dependencies and creating a local postgres DB,
fill you .env file according to example.env and run the migrations:

```bash
$ "typeorm:migrate"
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
