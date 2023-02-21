import {Database, IDatabase} from "./IDatabase";
import { IGenerate } from './IGenerate';
import {random, randomDate, randomInt} from "../utils/utils";

export class GeneratePostgres implements IGenerate {

    //============================================================
    // INSERTS / GENERATE
    //============================================================

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
                for (const element of result) {
                    let rand: number = random();
                    if (rand > 0.6) {
                        let maxNumber: number = result.length > 20 ? 20 : result.length;
                        let maxFollow: number = randomInt(0, maxNumber);
                        let alreadyFollowed: number[] = [];
                        alreadyFollowed.push(element.idperson);
                        for (let k = 0; k < maxFollow; k++) {
                            rand = randomInt(0, result.length);
                            while (alreadyFollowed.includes(result[rand].idperson)) {
                                rand = randomInt(0, result.length);
                            }
                            alreadyFollowed.push(result[rand].idperson);
                            script += "(" + element.idperson + "," + result[rand].idperson + "),";
                        }
                    }
                }

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
            let script: string = "INSERT INTO Product (productName, reference) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                script += "('Product " + (i + j) + "','A-" + (i + j) + "')";
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

    public async generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let result = await db.request("SELECT MAX(idPurchase) FROM Purchase", []);
        if (result.max == null) {
            result.max = 0;
        }
        insertQuantity += result.max;

        let persons = await db.request("SELECT idPerson FROM Person LIMIT 5000", []);
        let products = await db.request("SELECT idProduct FROM Product LIMIT 5000", []);

        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let script: string = "INSERT INTO Purchase (datePurchase, idPerson) VALUES ";
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let rand: number = randomInt(0, persons.length);
                let date: Date = randomDate(new Date(2023, 0, 1), new Date());
                script += "('" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                script += "'," + persons[rand].idperson + ")";
                if (j + 1 < batchQuantity) {
                    script += ",";
                }
            }
            script += " RETURNING idpurchase";

            let result = await db.request(script, []);

            if (batchQuantity > 1) {
                script = "INSERT INTO Purchase_content (idProduct, idPurchase, quantity) VALUES ";
                for (const element of result) {
                    let maxProduct: number = randomInt(1, 5);
                    let alreadyPurchased: number[] = [];
                    for (let k = 0; k < maxProduct; k++) {
                        let rand = randomInt(0, products.length);
                        while (alreadyPurchased.includes(products[rand].idproduct)) {
                            rand = randomInt(0, products.length);
                        }
                        alreadyPurchased.push(products[rand].idproduct);
                        let quantity: number = randomInt(1, 10);
                        script += "(" + products[rand].idproduct + "," + element.idpurchase + ", " + quantity + "),";
                    }
                }

                script = script.substring(0, script.length - 1);
                await db.request(script, []);
            }
        }

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }
    
    //============================================================
    // SELECTS / FIND
    //============================================================

    public async findProductsInFollowGroup(depth: number, username: string): Promise<string> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        /*let products = await db.request("SELECT reference, COUNT(1) " + 
                                        "FROM PRODUCT " + 
                                        "INNER JOIN PURCHASE_CONTENT ON PRODUCT.idProduct = PURCHASE_CONTENT.idProduct " +
                                        "INNER JOIN PURCHASE ON PURCHASE_CONTENT.idPurchase = PURCHASE.idPurchase " + 
                                        "GROUP BY reference ", []);*/

        /*let products = await db.request("SELECT p2.idPerson, p2.username " + 
                                        "FROM PERSON p1 " + 
                                        "INNER JOIN FOLLOW f ON p1.idPerson = f.idFollowed " +
                                        "INNER JOIN PERSON p2 ON p2.idPerson = f.idFollower " +
                                        "WHERE p1.username = $1::text", [username]);*/
                                        
        let products = await db.request("WITH RECURSIVE followers (root, parent, depth) AS ( " + 
                                        "SELECT p1.idPerson, p1.username " +
                                        "FROM PERSON p1 " + 
                                        "WHERE p1.username = $1::text " +
                                        "UNION " +
                                        "SELECT p2.idPerson, p2.username, depth+1" + 
                                        "FROM PERSON p2 " +
                                        "INNER JOIN FOLLOW f ON f.idFollower = p2.idPerson " +
                                        "INNER JOIN followers ON followers.idPerson = f.idFollowed) " +
                                        "WHERE depth < 3 " +
                                    "SELECT * " +
                                    "FROM followers", [username]);                                

        await db.disconnect();
        let endTime: number = new Date().getTime();
        //return endTime - time;
        return products;
    }

    //============================================================
    // DELETES / PURGE
    //============================================================

    public async purgePerson(): Promise<void>{
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("DELETE FROM Follow", []);
        await db.request("DELETE FROM Person", []);
        await db.request("ALTER SEQUENCE Person_idperson_seq RESTART WITH 1", []);
        await db.disconnect();
    }

    public async purgeProduct(): Promise<void> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("DELETE FROM Purchase_content", []);
        await db.request("DELETE FROM Product", []);
        await db.request("ALTER SEQUENCE Product_idproduct_seq RESTART WITH 1", []);
        await db.disconnect();
    }

    public async purgePurchase(): Promise<void> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("DELETE FROM Purchase_content", []);
        await db.request("DELETE FROM Product", []);
        await db.request("ALTER SEQUENCE Purchase_idpurchase_seq RESTART WITH 1", []);
        await db.disconnect();
    }
}