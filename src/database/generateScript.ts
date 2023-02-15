import {Database, IDatabase} from "./IDatabase";

export class GenerateScript {

    public static generatePerson(quantity: number) {
        let script: string = "INSERT INTO Person (username) VALUES ";
        for (let i = 0; i < quantity; i++) {
            script += "('Person " + i + "')";
            if (i + 1 < quantity) {
                script += ",";
            }
        }
        let db: IDatabase = Database.getDatabase();
        db.connect();
        db.request(script, [], (result: any) => {
            console.log(result);
            db.disconnect();
        });
    }

    public static generateProduct(quantity: number) {
        let script: string = "INSERT INTO Product (productName, reference) VALUES ";
        for (let i = 0; i < quantity; i++) {
            script += "('Product " + i + "','A-" + i + "')";
            if (i + 1 < quantity) {
                script += ",";
            }
        }
        let db: IDatabase = Database.getDatabase();
        db.connect();
        db.request(script, [], (result: any) => {
            console.log(result);
            db.disconnect();
        });
    }
}