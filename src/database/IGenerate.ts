export interface IGenerate {
    generateTPData(): Promise<number[]>;
    generateTestData(): Promise<number[]>;

    generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>;
    generateProduct(insertQuantity: number, batchQuantity: number): Promise<number>;
    generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number>;

    findProductsInFollowGroup(depth: number, username: string): Promise<any>;
    findNumberOfAProductInFollowGroup(depth: number, username: string, reference: string): Promise<any>;
    findNumberOfPersonsThatOrderSpecificProduct(depth: number, username: string, reference: string): Promise<any>;
    count(table: string): Promise<number>;
    purgePerson(): Promise<void>;
    purgeProduct(): Promise<void>;
    purgePurchase(): Promise<void>;
}