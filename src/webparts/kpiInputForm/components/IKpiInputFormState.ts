import {ILocationInventory} from '../service/ILocationInventory';
import {IKPIItem,IKPILocationEventIncidentItem} from '../service/IKPIItem';
export interface IKpiInputFormState{
    location:string;
    locationInventory:string ;//ILocationInventory;
    operationMetric:IKPIItem[];
    newOperationMetric:any;
    eventIncident:IKPILocationEventIncidentItem[];
    newEventIncident:any;
  }