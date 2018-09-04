//https://github.com/SharePoint/sp-dev-fx-webparts/blob/master/samples/react-todo-basic/src/webparts/todo/tests/MockDataProvider.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version,Environment,EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'CskpiDashboardWebPartStrings';
import Location from './components/Location';
import { ILocationProps } from './components/ILocationProps';
import {SPComponentLoader} from '@microsoft/sp-loader';
import {SharePointDataProvider} from '../Location/service/DataProvider/SharePointDataProvider';
import {ILocationDataProvider} from '../location/service/DataProvider/ILocationDataProvider';
import {MockLocationData} from '../location/service/MockData';

SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css");
export interface ILocationWebPartProps {
  description: string;
}

export default class CskpiDashboardWebPart extends BaseClientSideWebPart<ILocationWebPartProps> {
private _dataProvider:ILocationDataProvider;

public onInit():Promise<void>{
  
  if(DEBUG &&  Environment.type == EnvironmentType.Local){   
    this._dataProvider = new MockLocationData();
  } else {
    this._dataProvider = new SharePointDataProvider();
    this._dataProvider.webPartContext = this.context;   
  }
  return Promise.resolve<void>();
 }
  public render(): void {
    const element: React.ReactElement<ILocationProps > = React.createElement(
      Location,
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
