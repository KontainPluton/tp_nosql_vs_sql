import {IDatabase} from "./IDatabase";

const {Client} = require('pg');

export class Postgres implements IDatabase {

    private host: string;
    private database: string;
    private port: number;
    private user: string;
    private password: string;
    client: any;

    constructor(host: string, database: string, port: number, user: string, password: string) {
        this.host = host;
        this.database = database;
        this.port = port;
        this.user = user;
        this.password = password;
    }

    async connect(): Promise<void> {
        this.client = new Client({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database
        });
        await this.client.connect();
    }

    async disconnect(): Promise<void> {
        await this.client.end();
    }

    async request(query: string, args: any[]): Promise<any> {
        let result = await this.client.query(query, args)
            .catch((err: any) => {
                console.error(err);
            });
        return result !== undefined ? result.rows : null;
    }

}