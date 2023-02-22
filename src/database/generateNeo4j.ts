import {Database, IDatabase} from "./IDatabase";
import { IGenerate } from './IGenerate';
import {randomDate, randomInt} from "../utils/utils";

export class GenerateNeo4j implements IGenerate {

    //============================================================
    // GENERATE SAMPLES (TP & TESTS)
    //============================================================

    public async generateTPData(): Promise<number[]> {
        let times: number[] = [];
        let db: IDatabase = Database.getDatabase();
        await db.connect();

        await this.purgePerson();
        await this.purgeProduct();
        await this.purgePurchase();

        let time = await this.generateProduct(10000, 1000);
        times.push(time);

        time = await this.generateTPPersonAndOrder(1000000, 100000);
        times.push(time);

        return times;
    }

    public async generateTestData(): Promise<number[]> {
        let times: number[] = [];
        let db: IDatabase = Database.getDatabase();
        await db.connect();

        return times;
    }

    //============================================================
    // INSERTS / GENERATE
    //============================================================

    private async generateTPPersonAndOrder(insertQuantity: number, batchQuantity: number): Promise<number> {
        let db: IDatabase = Database.getDatabase();

        let request = "MATCH (n1:Product) " +
            "RETURN n1 " +
            "LIMIT 10000";
        let products = await db.request(request, null);

        let time = new Date().getTime();
        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let data: { batch: { name: string }[]} = {batch: []};

            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let obj: { name: string } = {name: "Person " + (i + j)};
                data.batch.push(obj);
            }

            request = "UNWIND $batch as row " +
                "CREATE (n1:Person) " +
                "SET n1 += row " +
                "RETURN n1";

            let persons = await db.request(request, data);

            let data2 : { batch: { idFollower: number, idFollowed: number }[]} = {batch: []};
            for (const element of persons) {
                let maxNumber: number = persons.length > 20 ? 20 : persons.length;
                let maxFollow: number = randomInt(0, maxNumber);
                let alreadyFollowed: number[] = [];
                alreadyFollowed.push(element.get('n1').identity.low);
                for (let k = 0; k < maxFollow; k++) {
                    let rand = randomInt(0, persons.length);
                    while (alreadyFollowed.includes(persons[rand].get('n1').identity.low)) {
                        rand = randomInt(0, persons.length);
                    }
                    alreadyFollowed.push(persons[rand].get('n1').identity.low);
                    let obj: { idFollower: number, idFollowed: number } = {idFollower: element.get('n1').identity.low, idFollowed: persons[rand].get('n1').identity.low};
                    data2.batch.push(obj);
                }
            }

            request = "UNWIND $batch as row " +
                "MATCH (n1:Person), (n2:Person) " +
                "WHERE id(n1) = row.idFollower AND id(n2) = row.idFollowed " +
                "CREATE (n1)-[:follow]->(n2)";

            await db.request(request, data2);

            let data3: { batch: { date: string }[]} = {batch: []};
            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let date: Date = randomDate(new Date(2023, 0, 1), new Date());;
                let obj: { date: string } = {date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()};
                data3.batch.push(obj);
            }

            request = "UNWIND $batch as row " +
                "CREATE (n1:Purchase) " +
                "SET n1 += row " +
                "RETURN n1";
            let purchases = await db.request(request, data3);

            let data4 : { batch: { idPerson: number, idPurchase: number }[]} = {batch: []};
            for (let j = 0; j < persons.length; j++) {
                let obj: { idPerson: number, idPurchase: number } = {idPerson: persons[j].get('n1').identity.low, idPurchase: purchases[j].get('n1').identity.low};
                data4.batch.push(obj);
            }

            request = "UNWIND $batch as row " +
                "MATCH (person:Person), (purchase:Purchase) " +
                "WHERE id(person) = row.idPerson AND id(purchase) = row.idPurchase " +
                "CREATE (person)-[:ordered]->(purchase)";

            await db.request(request, data4);

            let data5 : { batch: { idPurchase: number, idProduct: number }[]} = {batch: []};
            for (const purchase of purchases) {
                let rand = randomInt(0, products.length);
                let obj: { idPurchase: number, idProduct: number } = {idPurchase: purchase.get('n1').identity.low, idProduct: products[rand].get('n1').identity.low};
                data5.batch.push(obj);
            }

            request = "UNWIND $batch as row " +
                "MATCH (purchase:Purchase), (product:Product) " +
                "WHERE id(purchase) = row.idPurchase AND id(product) = row.idProduct " +
                "CREATE (purchase)-[c:contains]->(product) " +
                "SET c.quantity = 1";

            await db.request(request, data5);
        }
        return new Date().getTime() - time;
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

        let request = "MATCH (person1:Person { name:\"" + username + "\"})-[:follow *0.." + (depth-1) + "]->(follower:Person) " +
            "WITH DISTINCT follower " +
            "MATCH (follower)-[:ordered]->(order:Purchase) " +
            "MATCH (order)-[c:contains]->(product:Product) " +
            "RETURN follower.name, product.productName, c.quantity " +
            "ORDER BY follower.name";

        let result = await db.request(request, null);

        let endTime: number = new Date().getTime();
        console.log(result);
        console.log(endTime - time);
        return "";
    }

    public async findNumberOfAProductInFollowGroup(depth: number, username: string, reference: string): Promise<any> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let request = "MATCH (person1:Person { name:\"" + username + "\"})-[:follow *0.." + (depth-1) + "]->(follower:Person) " +
            "WITH DISTINCT follower " +
            "MATCH (follower)-[:ordered]->(order:Purchase) " +
            "MATCH (order)-[c:contains]->(product:Product {reference: \"" + reference + "\") " +
            "RETURN follower.name, c.quantity " +
            "ORDER BY follower.name";

        let result = await db.request(request, null);

        let endTime: number = new Date().getTime();
        console.log(result);
        console.log(endTime - time);
        return "";
    }

    //============================================================
    // DELETES / PURGE
    //============================================================

    public async purgePerson(): Promise<void>{
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("call apoc.periodic.iterate(\"MATCH (n:Person) return id(n) as id\", \"MATCH (n) WHERE id(n) = id DETACH DELETE n\", {batchSize:10000})\n" +
            "yield batches, total return batches, total", null);
    }

    public async purgeProduct(): Promise<void> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("call apoc.periodic.iterate(\"MATCH (n:Product) return id(n) as id\", \"MATCH (n) WHERE id(n) = id DETACH DELETE n\", {batchSize:10000})\n" +
            "yield batches, total return batches, total", null);
    }
    public async purgePurchase(): Promise<void> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        await db.request("call apoc.periodic.iterate(\"MATCH (n:Purchase) return id(n) as id\", \"MATCH (n) WHERE id(n) = id DETACH DELETE n\", {batchSize:10000})\n" +
            "yield batches, total return batches, total", null);
    }

    public async count(table: string): Promise<number> {
        let db: IDatabase = Database.getDatabase();
        await db.connect();
        let res = await db.request("MATCH (n:" + table + ") RETURN count(n)", null);
        console.log(res);
        return res;
    }
}