import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version,Environment,EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,  
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'OperationAreaWebPartStrings';
import OperationArea from './components/OperationArea';
import { IOperationAreaProps } from './components/IOperationAreaProps';
import {SharePointDataProvider} from '../operationArea/service/DataProvider/SharePointDataProvider';
import {IOperationDataProvider} from '../operationArea/service/DataProvider/IOperationDataProvider';
import {MockOperationarea} from '../operationArea/service/Operationarea';

import {SPComponentLoader} from '@microsoft/sp-loader';

SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css");
export interface IOperationAreaWebPartProps {
  description: string;
}

export default class OperationAreaWebPart extends BaseClientSideWebPart<IOperationAreaWebPartProps> {
  private _dataProvider: IOperationDataProvider;
 public constructor(context:IWebPartContext){
   super();

   
 }
  
 public onInit():Promise<void>{
  
  if(DEBUG &&  Environment.type == EnvironmentType.Local){   
    this._dataProvider = new MockOperationarea();
  } else {
    this._dataProvider = new SharePointDataProvider();
    this._dataProvider.webPartContext = this.context;   
  }
  return Promise.resolve<void>();
 }
  public render(): void {
    const element: React.ReactElement<IOperationAreaProps > = React.createElement(
      OperationArea,
      {
        description: this.properties.description,
        dataprovider:this._dataProvider
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
