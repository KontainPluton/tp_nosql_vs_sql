import {Database, IDatabase} from "./IDatabase";

export class GenerateScript {

    public static async generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>{
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let maxId: number = await db.request("SELECT MAX(idperson) FROM Person", []);
        insertQuantity += maxId;

        for (let i = maxId; i < insertQuantity; i+= batchQuantity) {
            let script: string = "INSERT INTO Person (username) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Person " + i + "')";
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
                        rand = Math.floor(Math.random() * (result.length));
                        while (rand === j) {
                            rand = Math.floor(Math.random() * (result.length));
                        }
                        script += "(" + result[j].idperson + "," + result[rand].idperson + ")";
                    }
                }
                await db.request(script, []);
            }
        }
        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public static async generateProduct(insertQuantity: number, batchQuantity: number) {
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

    public static async purgePerson() {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("DELETE FROM Follow", []);
        await db.request("DELETE FROM Person", []);
        await db.request("ALTER SEQUENCE Person_idperson_seq RESTART WITH 1", []);
        await db.disconnect();
    }
}