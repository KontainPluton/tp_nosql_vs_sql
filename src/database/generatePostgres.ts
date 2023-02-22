import {Database, IDatabase} from "./IDatabase";
import { IGenerate } from './IGenerate';
import {random, randomDate, randomInt} from "../utils/utils";

export class GeneratePostgres implements IGenerate {

    //============================================================
    // GENERATE SAMPLES (TP & TESTS)
    //============================================================

    public async generateTPData(): Promise<number[]> {
        throw new Error("Method not implemented.");
    }

    public async generateTestData(): Promise<number[]> {
        
        await this.purgePurchase();
        await this.purgePerson();
        await this.purgeProduct();

        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let persons: { username: string, id: number|null, follow: (number|null)[], 
            idOrder: number|null, ordered: {idProduct: (number|null), quantity: number}[]}[] = [
             {"username":"Influenceur", "id":null, "follow":[], "ordered":[], "idOrder": null},

             {"username":"P1", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P2", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P3", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P4", "id":null, "follow":[], "ordered":[], "idOrder": null}, 

             {"username":"P01", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P02", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P03", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P04", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P05", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P06", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P07", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P08", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P09", "id":null, "follow":[], "ordered":[], "idOrder": null},

             {"username":"P001", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P002", "id":null, "follow":[], "ordered":[], "idOrder": null},

             {"username":"P0001", "id":null, "follow":[], "ordered":[], "idOrder": null},
             {"username":"P0002", "id":null, "follow":[], "ordered":[], "idOrder": null}
        ]

        let script: string = "INSERT INTO Person (username) VALUES ";
        persons.forEach((elem, idx, array) => {
            script += "('"+ elem.username +"')";
            if (idx < array.length - 1) {
                script += ",";
            } 
        })
        script += " RETURNING idperson";
        let resultInsertPersons = await db.request(script, []);

        for(let i =0; i< resultInsertPersons.length; i++) {
            persons[i].id = resultInsertPersons[i].idperson; 
        }

        //Links - Follows
        persons[0].follow.push(persons[4].id,persons[5].id); //Influenceur
        persons[1].follow.push(persons[0].id); //P1
        persons[2].follow.push(persons[0].id, persons[9].id, persons[10].id); //P2
        persons[3].follow.push(persons[0].id); //P3
        persons[4].follow.push(persons[0].id); //P4
        persons[5].follow.push(persons[1].id); //P01
        persons[6].follow.push(persons[0].id, persons[1].id, persons[7].id); //P02
        persons[7].follow.push(persons[0].id, persons[2].id, persons[6].id); //P03
        persons[8].follow.push(persons[2].id); //P04
        persons[9].follow.push(persons[2].id); //P05
        persons[10].follow.push(persons[2].id); //P06
        persons[11].follow.push(persons[4].id, persons[12].id); //P07
        persons[12].follow.push(persons[4].id, persons[13].id); //P08
        persons[13].follow.push(persons[4].id, persons[11].id); //P09
        persons[14].follow.push(persons[8].id); //P001
        persons[15].follow.push(persons[9].id); //P002
        persons[16].follow.push(persons[17].id); //P0001
        persons[17].follow.push(persons[16].id); //P0002

        script = "INSERT INTO Follow (idFollower, idFollowed) VALUES ";
        persons.forEach((elem, idx, array) => {
            elem.follow.forEach((elem2, idx2, array2) => {
                script += "(" + elem2 + " , " + elem.id + ")";
                if (idx2 < array2.length - 1) {
                    script += ",";
                } 
            })
            if (idx < array.length - 1) {
                script += ",";
            } 
        })
        await db.request(script, []);

        script = "INSERT INTO Purchase (datePurchase, idPerson) VALUES ";
        persons.forEach((elem, idx, array) => {
            let date: Date = randomDate(new Date(2023, 0, 1), new Date());
            script += "('" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            script += "'," + elem.id + ")";
            if (idx < array.length - 1) {
                script += ",";
            } 
        })
        script += " RETURNING idpurchase";
        let resultInsertPurchase = await db.request(script, []);

        for(let i =0; i< resultInsertPurchase.length; i++) {
            persons[i].idOrder = resultInsertPurchase[i].idpurchase; 
        }

        let products: {productName: string, reference: string, id: number|null}[] = [
            {"productName":"Prod1", "id":null, "reference":"Prod1"},
            {"productName":"Prod2", "id":null, "reference":"Prod2"},
            {"productName":"Prod3", "id":null, "reference":"Prod3"},
            {"productName":"Prod4", "id":null, "reference":"Prod4"},
       ]

       script = "INSERT INTO Product (productName, reference) VALUES ";
       products.forEach((elem, idx, array) => {
            script += "('" + elem.productName + "','" + elem.reference + "')";
            if (idx < array.length - 1) {
               script += ",";
            } 
       })
       script += " RETURNING idproduct";
       let resultInsertProducts = await db.request(script, []);

        for(let i =0; i< resultInsertProducts.length; i++) {
           products[i].id = resultInsertProducts[i].idproduct; 
        }

        //Links - Purchase
        persons[0].ordered.push({idProduct: products[0].id, quantity: 2}, {idProduct: products[2].id, quantity: 5}); //Influenceur
        persons[1].ordered.push({idProduct: products[0].id, quantity: 1}); //P1
        persons[2].ordered.push({idProduct: products[0].id, quantity: 3}, {idProduct: products[3].id, quantity: 2}); //P2
        persons[3].ordered.push({idProduct: products[2].id, quantity: 6}); //P3
        persons[4].ordered.push(); //P4
        persons[5].ordered.push({idProduct: products[2].id, quantity: 1}); //P01
        persons[6].ordered.push({idProduct: products[0].id, quantity: 3}); //P02
        persons[7].ordered.push({idProduct: products[0].id, quantity: 4}, {idProduct: products[3].id, quantity: 1}); //P03
        persons[8].ordered.push({idProduct: products[0].id, quantity: 1}); //P04
        persons[9].ordered.push({idProduct: products[0].id, quantity: 2}); //P05
        persons[10].ordered.push(); //P06
        persons[11].ordered.push({idProduct: products[0].id, quantity: 1}, {idProduct: products[3].id, quantity: 1}); //P07
        persons[12].ordered.push({idProduct: products[0].id, quantity: 2}); //P08
        persons[13].ordered.push({idProduct: products[0].id, quantity: 1}); //P09
        persons[14].ordered.push(); //P001
        persons[15].ordered.push({idProduct: products[0].id, quantity: 1}); //P002
        persons[16].ordered.push({idProduct: products[0].id, quantity: 2}); //P0001
        persons[17].ordered.push({idProduct: products[0].id, quantity: 1}); //P0002

        script = "INSERT INTO Purchase_content (idProduct, idPurchase, quantity) VALUES ";
        persons.forEach((elem, idx, array) => {
            elem.ordered.forEach((elem2, idx2, array2) => {
                script += "(" + elem2.idProduct + "," + elem.idOrder + ", " + elem2.quantity + ")";
                if (idx2 < array2.length - 1) {
                    script += ",";
                } 
            })
            if (idx < array.length - 1 && elem.ordered.length > 0) {
                script += ",";
            } 
        })
        await db.request(script, []);

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return [endTime - time];
    }

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

    public async findProductsInFollowGroup(depth: number, username: string): Promise<any> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();
                                        
        let result = await db.request("WITH RECURSIVE followers (idPerson, username, depth, is_cycle, path) AS ( " + 
                                        "SELECT p1.idPerson, p1.username, 1, false, ARRAY[p1.idPerson] " +
                                        "FROM PERSON p1 " + 
                                        "WHERE p1.username = $1::text " +
                                        "UNION ALL " +
                                        "SELECT p2.idPerson, p2.username, depth+1, p2.idPerson = ANY(path), path || p2.idPerson " + 
                                        "FROM PERSON p2 " +
                                        "INNER JOIN FOLLOW f ON f.idFollowed = p2.idPerson " +
                                        "INNER JOIN followers ON followers.idPerson = f.idFollower " +
                                        "WHERE depth < $2 AND NOT p2.idPerson = ANY(path) ), " +
                                    "distinctFollowers AS ( " + 
                                        "SELECT DISTINCT f.idPerson, f.username " +
                                        "FROM followers f) " +
                                    "SELECT reference, SUM(quantity) " +
                                    "FROM distinctFollowers df " + 
                                    "INNER JOIN PURCHASE pur ON pur.idPerson = df.idPerson " + 
                                    "INNER JOIN PURCHASE_CONTENT purCt ON purCt.idPurchase = pur.idPurchase " + 
                                    "INNER JOIN PRODUCT pro ON pro.idProduct = purCt.idProduct " +
                                    "GROUP BY reference "
                                    , [username,depth]);                                

        await db.disconnect();
        let endTime: number = new Date().getTime();
        let resultTime = endTime - time;
        return {result: result, time: resultTime};
    }

    public async findNumberOfAProductInFollowGroup(depth: number, username: string, reference: string): Promise<any> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();
                                        
        let result = await db.request("WITH RECURSIVE followers (idPerson, username, depth, is_cycle, path) AS ( " + 
                                        "SELECT p1.idPerson, p1.username, 1, false, ARRAY[p1.idPerson] " +
                                        "FROM PERSON p1 " + 
                                        "WHERE p1.username = $1::text " +
                                        "UNION ALL " +
                                        "SELECT p2.idPerson, p2.username, depth+1, p2.idPerson = ANY(path), path || p2.idPerson " + 
                                        "FROM PERSON p2 " +
                                        "INNER JOIN FOLLOW f ON f.idFollowed = p2.idPerson " +
                                        "INNER JOIN followers ON followers.idPerson = f.idFollower " +
                                        "WHERE depth < $2 AND NOT p2.idPerson = ANY(path) ), " +
                                    "distinctFollowers AS ( " + 
                                        "SELECT DISTINCT f.idPerson, f.username " +
                                        "FROM followers f) " +
                                    "SELECT SUM(quantity) " +
                                    "FROM distinctFollowers df " + 
                                    "INNER JOIN PURCHASE pur ON pur.idPerson = df.idPerson " + 
                                    "INNER JOIN PURCHASE_CONTENT purCt ON purCt.idPurchase = pur.idPurchase " + 
                                    "INNER JOIN PRODUCT pro ON pro.idProduct = purCt.idProduct " +
                                    "WHERE reference = $3"
                                    , [username,depth,reference]);                                

        await db.disconnect();
        let endTime: number = new Date().getTime();
        let resultTime = endTime - time;
        return {result: result, time: resultTime};
    }

    public async findNumberOfPersonsThatOrderSpecificProduct(depth: number, username: string, reference: string): Promise<any> {
        return Promise.resolve(undefined);
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
        await db.request("DELETE FROM Purchase", []);
        await db.request("ALTER SEQUENCE Purchase_idpurchase_seq RESTART WITH 1", []);
        await db.disconnect();
    }

    public async count(table: string): Promise<number> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        let result = await db.request("SELECT COUNT(*) from " + table, []);
        return result[0].count;
    }
}