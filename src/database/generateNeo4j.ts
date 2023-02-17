import {Database, IDatabase} from "./IDatabase";
import { IGenerate } from './IGenerate';

export class GenerateNeo4j implements IGenerate {
    public async generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>{
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let data = {batch: [{name:"Alice",age:32},{name:"Bob",age:42}]};

        let request = "UNWIND $batch as row" + 
                      "CREATE (n:Label)" + 
                      "SET n += row";

        console.log(request);

        await db.request(request, [data]);

        /*for (let i = 0; i < insertQuantity; i+= batchQuantity) {

            let script: string = "INSERT INTO Person (username) VALUES ";

            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Person " + i + "')";
                if (j + 1 < batchQuantity) {
                    script += ",";
                }
            }



            await db.request(script, []);
        }*/
        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public async generateProduct(insertQuantity: number, batchQuantity: number): Promise<number> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();
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

    generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number> {
        throw new Error("Method not implemented.");
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