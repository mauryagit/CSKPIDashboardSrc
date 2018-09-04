import {IKPIMatrixDataProvider} from '../service/DataProvider/IKPIMatrixDataProvider';
export interface IKpiMetricsProps {
  description: string;
  dataprovider :IKPIMatrixDataProvider;
  operationAreas:string;
}
