import {IWebPartContext}  from '@microsoft/sp-webpart-base';
import {IKPIItem,IKPILocationEventIncidentItem,ICSKPIProps} from '../IKPIItem';
import {ILocationInventory} from '../ILocationInventory';
import {IOperationMetric} from '../IOperationMetric';

export interface IKPIInputFormDataProvider{
    webPartContext: IWebPartContext;
    getLocation(): Promise<any[]>;
    //#region EventIncident
    getKPIEventIncidentForTheWeekOfLocation(parameter:ICSKPIProps):Promise<IKPILocationEventIncidentItem[]>;
    AddKPIEventIncident(newitem:IKPILocationEventIncidentItem):Promise<IKPILocationEventIncidentItem[]>;
    UpdateKPIEventIncident(updateitem:IKPILocationEventIncidentItem):Promise<IKPILocationEventIncidentItem[]>;
    DeleteKPIEventIncident(updateitem:IKPILocationEventIncidentItem):Promise<IKPILocationEventIncidentItem[]>;
    //#endregion

    //#region Location Inventory
    getKPILocationInventoryForTheWeekOfLocation(parameter:ICSKPIProps):Promise<ILocationInventory>;
    AddKPILocationInventory(newItem:ILocationInventory):Promise<ILocationInventory>;
    UpdateKPILocationInventory(newItem:ILocationInventory):Promise<ILocationInventory>;
   
    //#endregion

    //#region Operational Metric
    getKPIMatric():Promise<IKPIItem[]>;
    getKPIOperationalMertic(parameter:ICSKPIProps):Promise<IOperationMetric[]>;

    DMLKPIOperationalMetric(items:IOperationMetric[]):Promise<any>;
    //#endregion
}