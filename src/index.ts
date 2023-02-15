import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {Database, Postgres} from "./database";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static('public'));

app.use(express.json())

const api = require('./api/api');
app.use('/api', api);

Database.setDatabase(new Postgres("localhost", "tp_database", 5432, "postgres", "postgres"));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});