import {Database, IDatabase} from "./IDatabase";
import {IGenerate} from './IGenerate';
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
        let persons = {batch: [
            {username: "Influenceur"},
            {username: "P1"},
            {username: "P2"},
            {username: "P3"},
            {username: "P4"},
            {username: "P01"},
            {username: "P02"},
            {username: "P03"},
            {username: "P04"},
            {username: "P05"},
            {username: "P06"},
            {username: "P07"},
            {username: "P08"},
            {username: "P09"},
            {username: "P001"},
            {username: "P002"},
            {username: "P0001"},
            {username: "P0002"},
        ]}

        let request = "UNWIND $batch as row " +
            "CREATE (n1:Person {username: row.username}) " +
            "RETURN n1";

        let times: number[] = [];
        let db: IDatabase = Database.getDatabase();
        await db.connect();

        await this.purgePerson();
        await this.purgeProduct();
        await this.purgePurchase();

        let resultPerson = await db.request(request, persons);

        let followers: { batch: {}[]} = {batch: []};

        // Influenceur
        followers.batch.push({idFollower: resultPerson[1].get('n1').identity.low, idFollowed: resultPerson[0].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[2].get('n1').identity.low, idFollowed: resultPerson[0].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[3].get('n1').identity.low, idFollowed: resultPerson[0].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[4].get('n1').identity.low, idFollowed: resultPerson[0].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[6].get('n1').identity.low, idFollowed: resultPerson[0].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[7].get('n1').identity.low, idFollowed: resultPerson[0].get('n1').identity.low});
        // P1
        followers.batch.push({idFollower: resultPerson[5].get('n1').identity.low, idFollowed: resultPerson[1].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[6].get('n1').identity.low, idFollowed: resultPerson[1].get('n1').identity.low});
        // P2
        followers.batch.push({idFollower: resultPerson[7].get('n1').identity.low, idFollowed: resultPerson[2].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[8].get('n1').identity.low, idFollowed: resultPerson[2].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[9].get('n1').identity.low, idFollowed: resultPerson[2].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[10].get('n1').identity.low, idFollowed: resultPerson[2].get('n1').identity.low});
        // P4
        followers.batch.push({idFollower: resultPerson[0].get('n1').identity.low, idFollowed: resultPerson[4].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[11].get('n1').identity.low, idFollowed: resultPerson[4].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[12].get('n1').identity.low, idFollowed: resultPerson[4].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[13].get('n1').identity.low, idFollowed: resultPerson[4].get('n1').identity.low});
        // P01
        followers.batch.push({idFollower: resultPerson[0].get('n1').identity.low, idFollowed: resultPerson[5].get('n1').identity.low});
        // P02
        followers.batch.push({idFollower: resultPerson[7].get('n1').identity.low, idFollowed: resultPerson[6].get('n1').identity.low});
        // P03
        followers.batch.push({idFollower: resultPerson[6].get('n1').identity.low, idFollowed: resultPerson[7].get('n1').identity.low});
        // P04
        followers.batch.push({idFollower: resultPerson[14].get('n1').identity.low, idFollowed: resultPerson[8].get('n1').identity.low});
        // P05
        followers.batch.push({idFollower: resultPerson[2].get('n1').identity.low, idFollowed: resultPerson[9].get('n1').identity.low});
        followers.batch.push({idFollower: resultPerson[15].get('n1').identity.low, idFollowed: resultPerson[9].get('n1').identity.low});
        // P06
        followers.batch.push({idFollower: resultPerson[2].get('n1').identity.low, idFollowed: resultPerson[10].get('n1').identity.low});
        // P07
        followers.batch.push({idFollower: resultPerson[13].get('n1').identity.low, idFollowed: resultPerson[11].get('n1').identity.low});
        // P08
        followers.batch.push({idFollower: resultPerson[11].get('n1').identity.low, idFollowed: resultPerson[12].get('n1').identity.low});
        // P09
        followers.batch.push({idFollower: resultPerson[12].get('n1').identity.low, idFollowed: resultPerson[13].get('n1').identity.low});
        // P001
        followers.batch.push({idFollower: resultPerson[17].get('n1').identity.low, idFollowed: resultPerson[16].get('n1').identity.low});
        // P002
        followers.batch.push({idFollower: resultPerson[16].get('n1').identity.low, idFollowed: resultPerson[17].get('n1').identity.low});

        request = "UNWIND $batch as row " +
            "MATCH (n1:Person), (n2:Person) " +
            "WHERE id(n1) = row.idFollower AND id(n2) = row.idFollowed " +
            "CREATE (n1)-[:follow]->(n2) ";

        await db.request(request, followers);

        let products: { batch: { productName: string, reference: string }[]} = {batch: []};

        products.batch.push({productName: "Prod1", reference: "Prod1"});
        products.batch.push({productName: "Prod2", reference: "Prod2"});
        products.batch.push({productName: "Prod3", reference: "Prod3"});
        products.batch.push({productName: "Prod4", reference: "Prod4"});

        request = "UNWIND $batch as row " +
            "CREATE (n1:Product {productName: row.productName, reference: row.reference}) " +
            "RETURN n1";
        let resultProduct = await db.request(request, products);

        let purchases: { batch: { date: string }[]} = {batch: []};

        purchases.batch.push({date: "2017-01-01"});
        purchases.batch.push({date: "2017-01-02"});
        purchases.batch.push({date: "2017-01-03"});
        purchases.batch.push({date: "2017-01-04"});
        purchases.batch.push({date: "2017-01-05"});
        purchases.batch.push({date: "2017-01-06"});
        purchases.batch.push({date: "2017-01-07"});
        purchases.batch.push({date: "2017-01-08"});
        purchases.batch.push({date: "2017-01-09"});
        purchases.batch.push({date: "2017-01-10"});
        purchases.batch.push({date: "2017-01-11"});
        purchases.batch.push({date: "2017-01-12"});
        purchases.batch.push({date: "2018-01-01"});
        purchases.batch.push({date: "2018-01-02"});
        purchases.batch.push({date: "2018-01-03"});

        request = "UNWIND $batch as row " +
            "CREATE (n1:Purchase {date: row.date}) " +
            "RETURN n1";
        let resultOrder = await db.request(request, purchases);

        let ordereds: { batch: { idPurchase: number, idPerson: number, idProduct: number, quantity: number }[]} = {batch: []};

        // Influenceur
        ordereds.batch.push({idPurchase: resultOrder[0].get('n1').identity.low, idPerson: resultPerson[0].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 2});
        ordereds.batch.push({idPurchase: resultOrder[0].get('n1').identity.low, idPerson: resultPerson[0].get('n1').identity.low, idProduct: resultProduct[2].get('n1').identity.low, quantity: 5});
        // P1
        ordereds.batch.push({idPurchase: resultOrder[1].get('n1').identity.low, idPerson: resultPerson[1].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 1});
        // P2
        ordereds.batch.push({idPurchase: resultOrder[2].get('n1').identity.low, idPerson: resultPerson[2].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 3});
        ordereds.batch.push({idPurchase: resultOrder[2].get('n1').identity.low, idPerson: resultPerson[2].get('n1').identity.low, idProduct: resultProduct[3].get('n1').identity.low, quantity: 2});
        // P3
        ordereds.batch.push({idPurchase: resultOrder[3].get('n1').identity.low, idPerson: resultPerson[3].get('n1').identity.low, idProduct: resultProduct[2].get('n1').identity.low, quantity: 6});
        // P01
        ordereds.batch.push({idPurchase: resultOrder[4].get('n1').identity.low, idPerson: resultPerson[5].get('n1').identity.low, idProduct: resultProduct[2].get('n1').identity.low, quantity: 1});
        // P02
        ordereds.batch.push({idPurchase: resultOrder[5].get('n1').identity.low, idPerson: resultPerson[6].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 3});
        // P03
        ordereds.batch.push({idPurchase: resultOrder[6].get('n1').identity.low, idPerson: resultPerson[7].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 4});
        ordereds.batch.push({idPurchase: resultOrder[6].get('n1').identity.low, idPerson: resultPerson[7].get('n1').identity.low, idProduct: resultProduct[3].get('n1').identity.low, quantity: 1});
        // P04
        ordereds.batch.push({idPurchase: resultOrder[7].get('n1').identity.low, idPerson: resultPerson[8].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 1});
        // P05
        ordereds.batch.push({idPurchase: resultOrder[8].get('n1').identity.low, idPerson: resultPerson[9].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 2});
        // P07
        ordereds.batch.push({idPurchase: resultOrder[9].get('n1').identity.low, idPerson: resultPerson[11].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 1});
        ordereds.batch.push({idPurchase: resultOrder[9].get('n1').identity.low, idPerson: resultPerson[11].get('n1').identity.low, idProduct: resultProduct[3].get('n1').identity.low, quantity: 1});
        // P08
        ordereds.batch.push({idPurchase: resultOrder[10].get('n1').identity.low, idPerson: resultPerson[12].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 2});
        // P09
        ordereds.batch.push({idPurchase: resultOrder[11].get('n1').identity.low, idPerson: resultPerson[13].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 1});
        // P002
        ordereds.batch.push({idPurchase: resultOrder[12].get('n1').identity.low, idPerson: resultPerson[15].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 1});
        // P0001
        ordereds.batch.push({idPurchase: resultOrder[13].get('n1').identity.low, idPerson: resultPerson[16].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 2});
        // P0002
        ordereds.batch.push({idPurchase: resultOrder[14].get('n1').identity.low, idPerson: resultPerson[17].get('n1').identity.low, idProduct: resultProduct[0].get('n1').identity.low, quantity: 1});

        request = "UNWIND $batch as row " +
            "MATCH (n1:Purchase) WHERE ID(n1) = row.idPurchase " +
            "MATCH (n2:Person) WHERE ID(n2) = row.idPerson " +
            "MATCH (n3:Product) WHERE ID(n3) = row.idProduct " +
            "MERGE (n2)-[:ordered]->(n1) " +
            "CREATE (n1)-[c:contains]->(n3) " +
            "SET c.quantity = row.quantity " +
            "RETURN n1, n2, n3";
        await db.request(request, ordereds);

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
            let data: { batch: { username: string }[]} = {batch: []};

            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let obj: { username: string } = {username: "Person " + (i + j)};
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
                let randQuantity = randomInt(1, 5);
                let obj: { idPurchase: number, idProduct: number, quantity: number } = {idPurchase: purchase.get('n1').identity.low, idProduct: products[rand].get('n1').identity.low, quantity: randQuantity};
                data5.batch.push(obj);
            }

            request = "UNWIND $batch as row " +
                "MATCH (purchase:Purchase), (product:Product) " +
                "WHERE id(purchase) = row.idPurchase AND id(product) = row.idProduct " +
                "CREATE (purchase)-[c:contains]->(product) " +
                "SET c.quantity = row.quantity"

            await db.request(request, data5);
        }
        return new Date().getTime() - time;
    }

    public async generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>{
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        for (let i = 0; i < insertQuantity; i+= batchQuantity) {
            let data: { batch: { username: string }[]} = {batch: []};

            for (let j = 0; j < batchQuantity && i + j < insertQuantity; j++) {
                let obj: { username: string } = {username: "Person " + (i + j)};
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

    public async findProductsInFollowGroup(depth: number, username: string): Promise<any> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let request = "MATCH (follower:Person)-[:follow *0.." + (depth-1) + "]->(person1:Person { username:\"" + username + "\"}) " +
            "WITH DISTINCT follower " +
            "MATCH (follower)-[:ordered]->(order:Purchase) " +
            "MATCH (order)-[c:contains]->(product:Product) " +
            "RETURN product.productName, sum(c.quantity) as sum " +
            "ORDER BY product.productName";

        let result = await db.request(request, null);

        console.log(result);
        let endTime: number = new Date().getTime();

        console.log(result);

        let s: { time: number; result: { productName: string, sum: number}[]} = {time: -1, result: []};
        for (let element of result) {
            s.result.push(
                {
                    productName: element.get('product.productName'),
                    sum: element.get('sum').low
                }
            );
        }
        s.time = endTime - time;
        return s;
    }

    public async findNumberOfAProductInFollowGroup(depth: number, username: string, reference: string): Promise<any> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let request = "MATCH (follower:Person)-[:follow *0.." + (depth-1) + "]->(person1:Person { username:\"" + username + "\"}) " +
            "WITH DISTINCT follower " +
            "MATCH (follower)-[:ordered]->(order:Purchase) " +
            "MATCH (order)-[c:contains]->(product:Product {reference: \"" + reference + "\"}) " +
            "RETURN sum(c.quantity) as sum";

        let result = await db.request(request, null);
        let endTime: number = new Date().getTime();

        return {
            time: endTime - time,
            result: {
                sum: result[0].get('sum').low
            }
        };
    }

    public async findNumberOfPersonsThatOrderSpecificProduct(depth: number, username: string, reference: string): Promise<any> {
        let db: IDatabase = Database.getDatabase();
        let time: number = new Date().getTime();
        await db.connect();

        let request = "MATCH (follower:Person)-[:follow *0.." + (depth-1) + "]->(person1:Person { username:\"" + username + "\"}) " +
            "WITH DISTINCT follower " +
            "MATCH (follower)-[:ordered]->(order:Purchase) " +
            "MATCH (order)-[c:contains]->(product:Product {reference: \"" + reference + "\"}) " +
            "RETURN count(follower) as count "

        let result = await db.request(request, null);
        let endTime: number = new Date().getTime();

        return {
            time: endTime - time,
            result: {
                count: result[0].get('count').low
            }
        };
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
        table = table.charAt(0).toUpperCase() + table.slice(1);
        let res = await db.request("MATCH (n:" + table + ") RETURN count(*) as count", null);
        return res[0].get('count').low;
    }
}