import {Database, IDatabase, Neo4j, Postgree} from "../database";

const express = require('express');
const router = express.Router();

const { routes, endpoint } = require('./generate');
router.use('/' + endpoint, routes);

router.get('/', (req: any, res: any) => {
    res.send('Bienvenue sur l\'API');
});

router.get('/database/', (req: any, res: any) => {
    if (req.query.name === 'neo4j') {
        Database.setDatabase(new Neo4j("localhost:7474", "neo4j", "neo4j"));
        res.send("Changement de la bdd courante en neo4j validé");
    }
    else if (req.query.name === 'postgree') {
        Database.setDatabase(new Postgree("localhost", "tp_database", 5432, "postgres", "postgres"));
        res.send("Changement de la bdd courante en postgree validé");
    }
    else {
        res.send("La base de données " + req.query.name + " n'existe pas");
    }
});

router.get('/query/', (req: any, res: any) => {
    let db: IDatabase = Database.getDatabase();
    db.connect();
    db.request("INSERT INTO Person (username) VALUES ('test')", [], (result: any) => {
        console.log(result);
        db.disconnect();
        res.send("OK");
    });
});

router.get('/query2/', (req: any, res: any) => {
    let db: IDatabase = Database.getDatabase();
    db.connect();
    db.request("SELECT * from Person", [], (result: any) => {
        db.disconnect();
        res.send(result);
    });
});

module.exports = router;