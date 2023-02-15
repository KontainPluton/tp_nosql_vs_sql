import {Database, IDatabase, Neo4j, Postgres} from "../database";
import generate from './generate';

const express = require('express');
const router = express.Router();

router.use('/generate/', generate);

router.get('/', (req: any, res: any) => {
    res.send('Bienvenue sur l\'API');
});

router.get('/database/', (req: any, res: any) => {
    if (req.query.name === 'neo4j') {
        Database.setDatabase(new Neo4j("localhost:7474", "neo4j", "neo4j"));
        res.send("Changement de la bdd courante en neo4j validé");
    }
    else if (req.query.name === 'postgree') {
        Database.setDatabase(new Postgres("localhost", "tp_database", 5432, "postgres", "postgres"));
        res.send("Changement de la bdd courante en postgree validé");
    }
    else {
        res.send("La base de données " + req.query.name + " n'existe pas");
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