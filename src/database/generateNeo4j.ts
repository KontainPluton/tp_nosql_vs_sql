import {Database, IDatabase} from "./IDatabase";
import { IGenerate } from './IGenerate';
import {randomDate, randomInt} from "../utils/utils";

export class GenerateNeo4j implements IGenerate {

    //============================================================
    // GENERATE SAMPLES (TP & TESTS)
    //============================================================

    generateTPData(): Promise<number[]> {
        throw new Error("Method not implemented.");
    }
    
    generateTestData(): Promise<number[]> {
        throw new Error("Method not implemented.");
    }

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
                "CREATE (n1:Person) " +
                "SET n1 += row " +
                "RETURN n1";

            let result = await db.request(request, data);

            let data2 : { batch: { idFollower: number, idFollowed: number }[]} = {batch: []};
            for (const element of result) {
                let maxNumber: number = result.length > 20 ? 20 : result.length;
                let maxFollow: number = randomInt(0, maxNumber);
                let alreadyFollowed: number[] = [];
                alreadyFollowed.push(element.get('n1').identity.low);
                for (let k = 0; k < maxFollow; k++) {
                    let rand = randomInt(0, result.length);
                    while (alreadyFollowed.includes(result[rand].get('n1').identity.low)) {
                        rand = randomInt(0, result.length);
                    }
                    alreadyFollowed.push(result[rand].get('n1').identity.low);
                    let obj: { idFollower: number, idFollowed: number } = {idFollower: element.get('n1').identity.low, idFollowed: result[rand].get('n1').identity.low};
                    data2.batch.push(obj);
                }
            }

            request = "UNWIND $batch as row " +
                "MATCH (n1:Person), (n2:Person) " +
                "WHERE id(n1) = row.idFollower AND id(n2) = row.idFollowed " +
                "CREATE (n1)-[:follow]->(n2)";

            await db.request(request, data2);
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
            let data: { batch: { productName: string, reference: string }[]} = {batch: []};

            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let obj: { productName: string, reference: string } = {productName: "Product " + (i + j), reference: "A-" + (i + j)};
                data.batch.push(obj);
            }

            let request = "UNWIND $batch as row " +
                "CREATE (n1:Product) " +
                "SET n1 += row " +
                "RETURN n1";

            await db.request(request, data);;
        }

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public async generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let data: { batch: { date: string }[]} = {batch: []};

            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let date: Date = randomDate(new Date(2023, 0, 1), new Date());;
                let obj: { date: string } = {date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()};
                data.batch.push(obj);
            }

            let request = "UNWIND $batch as row " +
                "CREATE (n1:Purchase) " +
                "SET n1 += row " +
                "RETURN n1";

            let result = await db.request(request, data);

            request = "MATCH (n1:Person) " +
                "WITH n1, rand() as r " +
                "RETURN n1 " +
                "ORDER BY r " +
                "LIMIT 5000";
            let persons = await db.request(request, null);

            let data2 : { batch: { idPerson: number, idPurchase: number }[]} = {batch: []};
            for (const element of result) {
                for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                    let rand: number = randomInt(0, persons.length);
                    let obj: { idPerson: number, idPurchase: number } = {idPerson: persons[rand].get('n1').identity.low, idPurchase: element.get('n1').identity.low};
                    data2.batch.push(obj);
                }
            }

            request = "UNWIND $batch as row " +
                "MATCH (person:Person), (purchase:Purchase) " +
                "WHERE id(person) = row.idPerson AND id(purchase) = row.idPurchase " +
                "CREATE (person)-[:ordered]->(purchase)";

            await db.request(request, data2);

            request = "MATCH (n1:Product) " +
                "WITH n1, rand() as r " +
                "RETURN n1 " +
                "ORDER BY r " +
                "LIMIT 5000";
            let products = await db.request(request, null);

            let data3 : { batch: { idPurchase: number, idProduct: number, quantity: number }[]} = {batch: []};
            for (const element of result) {
                for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                    let nbProduit = randomInt(0, 5);
                    for (let k = 0; k < nbProduit; k++) {
                        let rand: number = randomInt(0, products.length);
                        let obj: { idPurchase: number, idProduct: number, quantity: number } = {idPurchase: element.get('n1').identity.low, idProduct: products[rand].get('n1').identity.low, quantity: randomInt(1, 10)};
                        data3.batch.push(obj);
                    }
                }
            }

            request = "UNWIND $batch as row " +
                "MATCH (purchase:Purchase), (product:Product) " +
                "WHERE id(purchase) = row.idPurchase AND id(product) = row.idProduct " +
                "CREATE (purchase)-[c:contains]->(product) " +
                "SET c.quantity = row.quantity";

            await db.request(request, data3);
        }

        await db.disconnect();
        let endTime: number = new Date().getTime();
        return endTime - time;
    }

    public async findProductsInFollowGroup(depth: number, username: string): Promise<string> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let request = "MATCH (person1:Person { name:\"" + username + "\"})-[:follow *1.." + depth + "]->(follower:Person) " +
            "WITH DISTINCT follower " +
            "MATCH (follower)-[:ordered]->(order:Purchase) " +
            "MATCH (order)-[c:contains]->(product:Product) " +
            "RETURN follower.name, product.productName, c.quantity " +
            "ORDER BY follower.name";

        console.log(request);

        let result = await db.request(request, null);
        await db.disconnect();
        let endTime: number = new Date().getTime();
        console.log(result);
        console.log(endTime - time);
        return "";
    }

    public async findNumberOfAProductInFollowGroup(depth: number, username: string, reference: string): Promise<any> {
        throw new Error("not Implemented");
    }

    // purge table person
    public async purgePerson(): Promise<void>{
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("MATCH (n:Person) DETACH delete n", null);
        await db.disconnect();
    }

    public async purgeProduct(): Promise<void> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("MATCH (n:Product) DETACH delete n", null);
        await db.disconnect();
    }
    public async purgePurchase(): Promise<void> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("MATCH (n:Purchase) DETACH delete n", null);
        await db.disconnect();
    }
}