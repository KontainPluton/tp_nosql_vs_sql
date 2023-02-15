export class Database {

    private static database: IDatabase;

    public static setDatabase(database: IDatabase) {
        this.database = database;
    }

    public static getDatabase(): IDatabase {
        if (this.database === undefined || this.database === null) {
            throw new Error("Database not set");
        }
        return this.database;
    };
}

export interface IDatabase {
    connect(): void;
    disconnect(): void;
    request(query: string, args: any[], callback: any): any;
}