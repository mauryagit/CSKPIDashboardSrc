import {IWebPartContext}  from '@microsoft/sp-webpart-base';
import {IKPIItem,IKPILocationEventIncidentItem} from '../IKPIItem';
import { fromPairs } from '@microsoft/sp-lodash-subset';
export interface IKPIInputFormDataProvider{
    webPartContext: IWebPartContext;
    getKPIMatric():Promise<IKPIItem[]>;
    getKPIEventIncidentForTheWeekOfLocation(locationName:string):Promise<IKPILocationEventIncidentItem[]>;
    AddKPIEventIncident(IKPILocationEventIncidentItem):Promise<IKPILocationEventIncidentItem[]>;
}