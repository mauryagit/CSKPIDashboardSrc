import {IItemOperationarea} from '../IItemOperationarea';
import {  
    IWebPartContext
  } from '@microsoft/sp-webpart-base';
export interface IOperationDataProvider {
    webPartContext: IWebPartContext;
    getOperationAreaList(): Promise<IItemOperationarea[]>;
    updateOperationArea(updatedItem: IItemOperationarea): Promise<IItemOperationarea[]>;
    deleteOperationArea(deleteItem: IItemOperationarea): Promise<IItemOperationarea[]>;
    createOperationArea(newItem: IItemOperationarea): Promise<IItemOperationarea[]>;
  }