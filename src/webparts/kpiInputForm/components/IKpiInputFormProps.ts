import {IKPIInputFormDataProvider} from '../service/DataProvider/IKPIInputFormDataProvider';
import {ICSKPIProps} from '../service/IKPIItem';
export interface IKpiInputFormProps {
  description: string;
  dataprovider:IKPIInputFormDataProvider;
 // location:any;
  year:string;
}


export interface ICommonProps extends ICSKPIProps {
 
  items:any[];
  
}