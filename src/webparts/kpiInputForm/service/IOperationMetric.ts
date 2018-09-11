import {IKPIItem} from './IKPIItem';
export interface IOperationMetric extends IKPIItem{
    transactionMetricTitle:string;
    transactionMetricId:number;
    Week:string;
    CurrentWeekValue:number;
    LocationId:number;
    LocationTitle:string;
    KPITargetId:number;
    KPITargetTitle:string;
    Remark:string;
    status:string;
    Sequence:number;
}

