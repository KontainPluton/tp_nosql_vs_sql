export interface IDatabase {
    connect(): void;
    disconnect(): void;
    request(query: string, args: any[], callback: any): any;
}