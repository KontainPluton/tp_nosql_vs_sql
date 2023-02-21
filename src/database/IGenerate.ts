export interface IGenerate {
    generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>;
    generateProduct(insertQuantity: number, batchQuantity: number): Promise<number>;
    generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number>;
    findProductsInFollowGroup(depth: number, username: string): Promise<string>;
    purgePerson(): Promise<void>;
    purgeProduct(): Promise<void>;
    purgePurchase(): Promise<void>;
}