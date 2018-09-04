import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version,Environment,EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'KpiInputFormWebPartStrings';
import KpiInputForm from './components/KpiInputForm';
import { IKpiInputFormProps } from './components/IKpiInputFormProps';
import {SPComponentLoader} from '@microsoft/sp-loader';
import {IKPIInputFormDataProvider} from '../kpiInputForm/service/DataProvider/IKPIInputFormDataProvider';
import {MockData} from '../kpiInputForm/service/MockData';
SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css");
export interface IKpiInputFormWebPartProps {
  description: string;
}

export default class KpiInputFormWebPart extends BaseClientSideWebPart<IKpiInputFormWebPartProps> {

  private _dataProvider : IKPIInputFormDataProvider;
  public render(): void {
    const element: React.ReactElement<IKpiInputFormProps > = React.createElement(
      KpiInputForm,
      {
        description: this.properties.description,
        dataprovider:this._dataProvider
      }
    );

    ReactDom.render(element, this.domElement);
  }
  public onInit():Promise<void>{
 
    if(DEBUG &&  Environment.type == EnvironmentType.Local){   
      this._dataProvider = new MockData();     
    } else {
     // this._dataProvider = new SharePointDataProvider();
     // this._dataProvider.webPartContext = this.context;   
    }
    /*this._dataProvider.getOperationArea()
    .then((res:any[]) => {
      debugger;
      this.properties.oprationarea=JSON.stringify(res);
      
    });*/
    return Promise.resolve<void>();
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
