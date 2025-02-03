export interface SaleItem {
    id: number;
    sku: string;
    name: string;
    qty: number;
    price: number;
    discount: number;
    discountPercent: number;
    tax: number;
    total: number;
}


export interface PurchaseItem {
    id: Number;
    code: string;
    name: string;
    qty: number;
    price: number;
    discount: number;
    discountPercent: number;
    total: number;
}
