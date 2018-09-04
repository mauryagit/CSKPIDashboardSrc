import {IIteamKPI} from '../IItemKPI';
import {IWebPartContext}  from '@microsoft/sp-webpart-base';
export interface IKPIMatrixDataProvider{
    webPartContext: IWebPartContext;
    getKPIMatrixList(): Promise<IIteamKPI[]>;
    updateKPIMatrix(updatedItem: IIteamKPI): Promise<IIteamKPI[]>;
    deleteKPIMatrix(deleteItem: IIteamKPI): Promise<IIteamKPI[]>;
    createKPIMatrix(newItem: IIteamKPI): Promise<IIteamKPI[]>;
    getOperationArea(): Promise<any[]>;
}