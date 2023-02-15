import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {Database, Postgres} from "./database";
import { GeneratePostgres } from './database/generatePostgres';
import { checkEnv } from './utils';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const env = process.env;

app.use(express.static('public'));

app.use(express.json())

const api = require('./api/api');
app.use('/api', api);

checkEnv();
Database.setDatabase(new Postgres(env.URL_POSTGRES!, env.DB_POSTGRES!, parseInt(env.PORT_POSTGRES!), 
                                  env.USER_POSTGRES!, env.PASSWORD_POSTGRES!));
Database.setGenerateScript(new GeneratePostgres());

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});