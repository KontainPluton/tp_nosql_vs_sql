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
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    request(query: string, args: any[]): Promise<any>;
}