//https://github.com/SharePoint/sp-dev-fx-webparts/blob/master/samples/react-todo-basic/src/webparts/todo/tests/MockDataProvider.ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'CskpiDashboardWebPartStrings';
import CskpiDashboard from './components/CskpiDashboard';
import { ICskpiDashboardProps } from './components/ICskpiDashboardProps';

export interface ICskpiDashboardWebPartProps {
  description: string;
}

export default class CskpiDashboardWebPart extends BaseClientSideWebPart<ICskpiDashboardWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICskpiDashboardProps > = React.createElement(
      CskpiDashboard,
      {
        description: this.properties.description
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
