import {Database, IDatabase} from "./IDatabase";

export class GenerateScript {

    public static async generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>{
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();
        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let script: string = "INSERT INTO Person (username) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Person " + i + "')";
                if (j + 1 < batchQuantity) {
                    script += ",";
                }
            }


            await db.request(script, []);
        }
        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public static async generateProduct(insertQuantity: number, batchQuantity: number) {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let script: string = "INSERT INTO Person (username) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Product " + i + "','A-" + i + "')";
                if (j + 1 < batchQuantity) {
                    script += ",";
                }
            }

            await db.request(script, []);
        }
        await db.disconnect();
    }
}