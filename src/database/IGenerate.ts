export interface IGenerate {
    generatePerson(insertQuantity: number, batchQuantity: number): Promise<number>;
    generateProduct(insertQuantity: number, batchQuantity: number): Promise<number>;
    generatePurchase(insertQuantity: number, batchQuantity: number): Promise<number>;
    purgePerson(): Promise<void>;
    purgeProduct(): Promise<void>;
    purgePurchase(): Promise<void>;
}