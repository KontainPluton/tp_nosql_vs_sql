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

    connect() {

    }

    disconnect() {
        this.driver.close();
    }

    request(query: string, args: any[], callback: any): any {
        let session: Session = this.driver.session();

        session.run(query, args)
            .then((result: any) => {
                callback(result);
            })
            .catch((error: any) => {
                console.log(error);
            })
            .finally(() => {
                session.close();
            });
    }


}