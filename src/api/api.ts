import {Database, IDatabase, Neo4j, Postgres} from "../database";
import generate from './generate';
import { checkEnv } from './../utils';

const express = require('express');
const router = express.Router();

const env = process.env;

router.use('/generate/', generate);

router.get('/', (req: any, res: any) => {
    res.send('Bienvenue sur l\'API');
});

router.get('/database/', (req: any, res: any) => {

    if (checkEnv()) {
        if (req.query.name === 'neo4j') {
            Database.setDatabase(new Neo4j(`${env.URL_NEO4J!}:${env.PORT_NEO4J!}`, env.USER_NEO4J!, env.PASSWORD_NEO4J!));
            res.send("Changement de la bdd courante en neo4j validé");
        }
        else if (req.query.name === 'postgres') {
            Database.setDatabase(new Postgres(env.URL_POSTGRES!, env.DB_POSTGRES!, parseInt(env.PORT_POSTGRES!), 
                                              env.USER_POSTGRES!, env.PASSWORD_POSTGRES!));
            res.send("Changement de la bdd courante en postgree validé");
        }
        else {
            res.send("La base de données " + req.query.name + " n'existe pas");
        }
    }
});

router.get('/query/', async(req: any, res: any) => {
    let db: IDatabase = Database.getDatabase();
    await db.connect();
    await db.request("INSERT INTO Person (username) VALUES ('test')", []);
    await db.disconnect();
    res.send("OK");
});

router.get('/query2/', async(req: any, res: any) => {
    let db: IDatabase = Database.getDatabase();
    await db.connect();
    let result = await db.request("SELECT COUNT(*) from Person", []);
    res.send(result);
    await db.disconnect();
});

module.exports = router;