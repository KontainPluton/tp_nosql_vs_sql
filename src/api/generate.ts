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
    else if (req.body.table === 'purchase') {
        let time = await Database.getGenerateScript().generatePurchase(req.body.insertQuantity, req.body.batchQuantity);
        res.json({time: time});
    }
    else {
        res.send("Le type " + req.body.type + " n'existe pas");
    }
});

router.post('/tpData', async(req: any, res: any) => {
    let times = await Database.getGenerateScript().generateTPData();
    res.json({times: times});
});

router.post('/testData', async(req: any, res: any) => {
    let times = await Database.getGenerateScript().generateTestData();
    res.json({times: times});
});

router.get('/listProduct', async(req: any, res: any) => {
    let result = await Database.getGenerateScript().findProductsInFollowGroup(req.query.depth, req.query.username);
    res.json(result);
});

router.get('/listOfAProduct', async(req: any, res: any) => {
    let result = await Database.getGenerateScript().findNumberOfAProductInFollowGroup(req.query.depth, req.query.username, req.query.reference);
    res.json(result);
});

router.delete('/', async(req: any, res: any) => {
    if (req.body.table === 'person') {
        await Database.getGenerateScript().purgePerson();
        res.json({response: "OK"});
    }
    else if (req.body.table === 'product') {
        await Database.getGenerateScript().purgeProduct();
        res.json({response: "OK"});
    }
    else if (req.body.table === 'purchase') {
        await Database.getGenerateScript().purgePurchase();
        res.json({response: "OK"});
    }
    else {
        console.log("Erreur");
        res.send("Le type " + req.body.type + " n'existe pas");
    }
});

export default router;