import {ILocationInventory} from '../service/ILocationInventory';
import {IKPIItem,IKPILocationEventIncidentItem,Location} from '../service/IKPIItem';
import {IOperationMetric} from '../service/IOperationMetric';
export interface IKpiInputFormState{
    location:Location;
    locationList:Location[];
    week:string;
    locationInventoryrefresh:ILocationInventory;
    operationMetric:IOperationMetric[];
    newOperationMetric:any;
    eventIncident:IKPILocationEventIncidentItem[];
    newEventIncident:any;
    weekDateRange:string;
  }

  