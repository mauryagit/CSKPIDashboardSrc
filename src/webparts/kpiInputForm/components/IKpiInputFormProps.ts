import {IKPIInputFormDataProvider} from '../service/DataProvider/IKPIInputFormDataProvider';
export interface IKpiInputFormProps {
  description: string;
  dataprovider:IKPIInputFormDataProvider;
}

export interface ICommonProps{
  locationName: string;
  year: string;
  week: string;
  items:any[];
}