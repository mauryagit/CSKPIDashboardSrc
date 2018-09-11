export interface IKPIItem {
    KPIID:number;
    Title:string;
    Metric:string;
    Sequence:any;
    OperationAreaTitle:string;
    OperationAreaID:number;
    KPITargetConfig:string;
    Target:string;
    KPIMatrixID:number;
}

export interface IKPIInputCriteria{
    Year:string;
    Week:string;
}
export interface IKPILocationEventIncidentItem extends IKPIInputCriteria{
    EventIncidentID:number;
    IncidentType:string;
    Comment:string;
    LocationTitle:string;
    LocationID:number;
}

export interface ICSKPIProps{
    location:Location;
    year: string;
    week: string;
  }

  export interface Location{
    id:number;
    name:string;
  }