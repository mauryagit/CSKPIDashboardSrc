import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version ,Environment,EnvironmentType} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField, IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'KpiMetricsWebPartStrings';
import KpiMetrics from './components/KpiMetrics';
import { IKpiMetricsProps } from './components/IKpiMetricsProps';
import {SPComponentLoader} from '@microsoft/sp-loader';

import { IKPIMatrixDataProvider } from '../kpiMetrics/service/DataProvider/IKPIMatrixDataProvider';
import {MockKPIMatrix} from '../kpiMetrics/service/MockKPIMatrix'; 
import {SharePointDataProvider} from '../kpiMetrics/service/DataProvider/SharePointDataProvider';
SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css");
export interface IKpiMetricsWebPartProps {
  description: string;
  oprationarea:string;
}

export default class KpiMetricsWebPart extends BaseClientSideWebPart<IKpiMetricsWebPartProps> {
  private _dataProvider: IKPIMatrixDataProvider;
  
 public constructor(context:IWebPartContext){
  super();  
}

public onInit():Promise<void>{
 
  if(DEBUG &&  Environment.type == EnvironmentType.Local){   
    this._dataProvider = new MockKPIMatrix();
    this.properties.oprationarea=JSON.stringify([{"Title": "HSEF","Sequence": 1,"ID": 1},{"Title": "Loreum","Sequence": 2,"ID": 2}]);
  } else {
    this._dataProvider = new SharePointDataProvider();
    this._dataProvider.webPartContext = this.context;   
  }
  this._dataProvider.getOperationArea()
  .then((res:any[]) => {
    debugger;
    this.properties.oprationarea=JSON.stringify(res);
    
  });
  return Promise.resolve<void>();
 }
  public render(): void {
    const element: React.ReactElement<IKpiMetricsProps > = React.createElement(
      KpiMetrics,
      {
        description: this.properties.description,
        dataprovider: this._dataProvider,
        operationAreas:this.properties.oprationarea
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
