export function updateHistory(userID: any, barcode: any, product: any): Promise<void>;
export function cleanDublicateHistory(userID: any, barcode: any): Promise<void>;
export function updateHistoryElement(userID: any, barcode: any, product: any): Promise<void>;
export function insertIntoHistory(userID: any, barcode: any, product: any): Promise<void>;
export function deleteElementFromHistory(req: any, res: any): Promise<void>;
export function getElementsFromHistory(req: any, res: any): Promise<void>;
