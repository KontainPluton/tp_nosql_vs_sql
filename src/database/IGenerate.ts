export interface IGenerate {
    generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>;
    generateProduct(insertQuantity: number, batchQuantity: number): Promise<number>;
    generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number>;
    findProductsInFollowGroup(depth: number, username: string): Promise<any>;
    findNumberOfAProductInFollowGroup(depth: number, username: string, reference: string): Promise<any>;
    purgePerson(): Promise<void>;
    purgeProduct(): Promise<void>;
    purgePurchase(): Promise<void>;
}