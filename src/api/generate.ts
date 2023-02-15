import {GenerateScript} from "../database";

const express = require('express');
const router = express.Router();

router.post('/generate/', (req: any, res: any) => {
    if (req.body.type === 'person') {
        GenerateScript.generatePerson(req.body.quantity);
        res.send("OK");
    }
    else if (req.body.type === 'product') {
        GenerateScript.generateProduct(req.body.quantity);
        res.send("OK");
    }
    else {
        res.send("Le type " + req.body.type + " n'existe pas");
    }
});

module.exports = router;