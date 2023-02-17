import {Database, IDatabase, Neo4j, Postgres} from "../database";
import generate from './generate';
import { checkEnv } from './../utils';
import { GeneratePostgres } from './../database/generatePostgres';
import { GenerateNeo4j } from './../database/generateNeo4j';

const express = require('express');
const router = express.Router();

const env = process.env;

router.use('/generate/', generate);

router.get('/', (req: any, res: any) => {
    res.send('Bienvenue sur l\'API');
});

router.get('/database/', (req: any, res: any) => {
    if (Database.getDatabase() instanceof Neo4j) {
        res.json({database: "neo4j"});
    }
    else if (Database.getDatabase() instanceof Postgres) {
        res.json({database: "postgres"});
    }
});

router.post('/database/', (req: any, res: any) => {
    if (checkEnv()) {
        if (req.body.database === 'neo4j') {
            Database.setGenerateScript(new GenerateNeo4j());
            Database.setDatabase(new Neo4j(`${env.URL_NEO4J!}:${env.PORT_NEO4J!}`, env.USER_NEO4J!, env.PASSWORD_NEO4J!));
            res.send("Changement de la bdd courante en neo4j validé");
        }
        else if (req.body.database === 'postgres') {
            Database.setGenerateScript(new GeneratePostgres());
            Database.setDatabase(new Postgres(env.URL_POSTGRES!, env.DB_POSTGRES!, parseInt(env.PORT_POSTGRES!), 
                                              env.USER_POSTGRES!, env.PASSWORD_POSTGRES!));
            res.send("Changement de la bdd courante en postgree validé");
        } else {
            res.send("La base de données " + req.body.database + " n'existe pas");
        }
    }
});

router.get('/count/', async(req: any, res: any) => {
    let db: IDatabase = Database.getDatabase();
    await db.connect();
    let result = await db.request("SELECT COUNT(*) from " + req.query.table, []);
    if (result === null) {
        res.send("La table " + req.query.table + " n'existe pas");
    }
    else {
        res.send(result);
    }
    await db.disconnect();
});

module.exports = router;