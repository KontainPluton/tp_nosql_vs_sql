import {Router} from "express";
import { Database } from './../database/IDatabase';

const express = require('express');
const router: Router = express.Router();

router.post('/', async(req: any, res: any) => {
    if (req.body.table === 'person') {
        let time = await Database.getGenerateScript().generatePerson(req.body.insertQuantity, req.body.batchQuantity);
        res.json({time: time});
    }
    else if (req.body.table === 'product') {
        let time = await Database.getGenerateScript().generateProduct(req.body.insertQuantity, req.body.batchQuantity);
        res.json({time: time});
    }
    else {
        console.log("Erreur");
        res.send("Le type " + req.body.type + " n'existe pas");
    }
});

router.delete('/', async(req: any, res: any) => {
    if (req.body.table === 'person') {
        await Database.getGenerateScript().purgePerson();
        res.json({response: "OK"});
    }
    else if (req.body.table === 'product') {
        //TODO
    }
    else {
        console.log("Erreur");
        res.send("Le type " + req.body.type + " n'existe pas");
    }
});

export default router;