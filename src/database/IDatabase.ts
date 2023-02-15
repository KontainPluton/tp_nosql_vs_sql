import { IGenerate } from './IGenerate';
export class Database {

    private static database: IDatabase;
    private static generateScript: IGenerate;

    public static setDatabase(database: IDatabase) {
        this.database = database;
    }

    public static setGenerateScript(generateScript: IGenerate) {
        this.generateScript = generateScript;
    }

    public static getDatabase(): IDatabase {
        if (this.database === undefined || this.database === null) {
            throw new Error("Database not set");
        }
        return this.database;
    };

    public static getGenerateScript(): IGenerate {
        if (this.generateScript === undefined || this.generateScript === null) {
            throw new Error("GenerateScript not set");
        }
        return this.generateScript;
    };
}

export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    request(query: string, args: any[]): Promise<any>;
}