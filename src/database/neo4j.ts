import {IDatabase} from "./IDatabase";
import {Driver, Session} from "neo4j-driver";

const neo4j = require('neo4j-driver');

export class Neo4j implements IDatabase {

    private readonly uri: string;
    private readonly user: string;
    private readonly password: string;
    private driver: Driver;

    constructor(uri: string, user: string, password: string) {
        this.uri = uri;
        this.user = user;
        this.password = password;
        this.driver = neo4j.driver(this.uri, neo4j.auth.basic(this.user, this.password));
    }

    async connect(): Promise<any> {
        await this.driver.verifyConnectivity();
    }

    async disconnect() {
        await this.driver.close();
    }

    async request(query: string, args: any[]): Promise<any> {
        let session: Session = this.driver.session();

        let result = await session.run(query, args)
        await session.close();
        return result.records;
    }


}