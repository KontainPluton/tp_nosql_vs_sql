import {Database, IDatabase} from "./IDatabase";
import { IGenerate } from './IGenerate';

export class GeneratePostgres implements IGenerate {
    public async generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>{
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let result = await db.request("SELECT MAX(idperson) FROM Person", []);
        if (result.max == null) {
            result.max = 0;
        }
        insertQuantity += result.max;

        for (let i = result.max; i < insertQuantity; i+= batchQuantity) {
            let script: string = "INSERT INTO Person (username) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Person " + (i + j) + "')";
                if (j + 1 < batchQuantity) {
                    script += ",";
                }
            }
            script += " RETURNING idperson";
            let result = await db.request(script, []);
            if (batchQuantity > 1) {
                script = "INSERT INTO Follow (idFollower, idFollowed) VALUES ";
                for (let j = 0; j < result.length; j++) {
                    let rand = Math.random();
                    if (rand > 0.6) {
                        let maxNumber = result.length > 20 ? 20 : result.length;
                        let maxFollow = Math.floor(Math.random() * maxNumber);
                        let alreadyFollowed = [];
                        alreadyFollowed.push(result[j].idperson);
                        for (let k = 0; k < maxFollow; k++) {
                            rand = Math.floor(Math.random() * (result.length));
                            while (alreadyFollowed.includes(result[rand].idperson)) {
                                rand = Math.floor(Math.random() * (result.length));
                            }
                            alreadyFollowed.push(result[rand].idperson);
                            script += "(" + result[j].idperson + "," + result[rand].idperson + "),";
                        }
                    }
                }
                console.log(script);
                // delete last index of script
                script = script.substring(0, script.length - 1);
                await db.request(script, []);
            }
        }

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public async generateProduct(insertQuantity: number, batchQuantity: number): Promise<number> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let result = await db.request("SELECT MAX(idproduct) FROM Product", []);
        if (result.max == null) {
            result.max = 0;
        }
        insertQuantity += result.max;

        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let script: string = "INSERT INTO Person (username) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Product " + i + "','A-" + i + "')";
                if (j + 1 < batchQuantity) {
                    script += ",";
                }
            }
            script += " RETURNING idproduct";
            await db.request(script, []);
        }

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public async generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let result = await db.request("SELECT MAX(idPurchase) FROM Purchase", []);
        if (result.max == null) {
            result.max = 0;
        }
        insertQuantity += result.max;

        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let script: string = "INSERT INTO Purchase (username) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Product " + i + "','A-" + i + "')";
                if (j + 1 < batchQuantity) {
                    script += ",";
                }
            }
            script += " RETURNING idproduct";
            await db.request(script, []);
        }

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public static async generatePersonNoSQL(insertQuantity: number, batchQuantity: number): Promise<number>{
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let data = [{name:"Alice",age:32},{name:"Bob",age:42}];

        let request = data + "UNWIND $batch as row" + 
                      "CREATE (n:Label)" + 
                      "SET n += row";

        await db.request(request, []);

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }


    // purge table person
    public async purgePerson(): Promise<void>{
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("DELETE FROM Follow", []);
        await db.request("DELETE FROM Person", []);
        await db.request("ALTER SEQUENCE Person_idperson_seq RESTART WITH 1", []);
        await db.disconnect();
    }
}