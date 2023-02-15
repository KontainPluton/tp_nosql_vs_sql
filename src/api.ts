import {IDatabase, Neo4j, Postgree} from "./database";

const express = require('express');
const router = express.Router();

let db: IDatabase;

router.get('/', (req: any, res: any) => {
    res.send('Bienvenue sur l\'API');
});

router.get('/database/', (req: any, res: any) => {
    if (req.query.name === 'neo4j') {
        db = new Neo4j("localhost:7474", "neo4j", "neo4j");
        res.send("Changement de la bdd courante en neo4j validé");
    }
    else if (req.query.name === 'postgree') {
        db = new Postgree("localhost", 5432, "postgres", "postgres");
        res.send("Changement de la bdd courante en postgree validé");
    }
    else {
        res.send("La base de données " + req.query.name + " n'existe pas");
    }
});

router.post('/query/', (req: any, res: any) => {
    res.json({request: req.body});
});

module.exports = router;