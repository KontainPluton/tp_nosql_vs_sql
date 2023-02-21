import {Database, IDatabase} from "./IDatabase";
import { IGenerate } from './IGenerate';

export class GenerateNeo4j implements IGenerate {
    public async generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>{
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let data: { batch: { name: string }[]} = {batch: []};
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let obj: { name: string } = {name: "Person " + (i + j)};
                data.batch.push(obj);
            }

            let request = "UNWIND $batch as row " +
                "CREATE (n:Person) " +
                "SET n += row " +
                "RETURN n";

            let result = await db.request(request, data);
            result.map((element: any) => {
                console.log(element.get("n"));
            });
        }

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

    public async findProductsInFollowGroup(depth: number, username: string): Promise<string> {
        throw new Error("not Implemented");
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

    purgeProduct(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    purgePurchase(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}