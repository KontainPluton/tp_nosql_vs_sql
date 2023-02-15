import {IDatabase} from "./IDatabase";

const {Client} = require('pg');

export class Postgree implements IDatabase {

    client: any;

    constructor(host: string, port: number, user: string, password: string) {
        this.client = new Client({
            host: host,
            port: port,
            user: user,
            password: password,
        });

    }

    async connect(): Promise<void> {
        this.client.connect();
    }

    async disconnect(): Promise<void> {
        this.client.end();
    }

    request(query: string, args: any[], callback: any): any {

        this.client.query(query, args)
            .then((result: any) => {
                callback(result);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

}