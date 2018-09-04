import {IItemLocation} from '../IItemLocation';
import {  
    IWebPartContext
  } from '@microsoft/sp-webpart-base';
export interface ILocationDataProvider {
    webPartContext: IWebPartContext;
    getLocationList(): Promise<IItemLocation[]>;
    updateLocation(updatedItem: IItemLocation): Promise<IItemLocation[]>;
    deleteLocation(deleteItem: IItemLocation): Promise<IItemLocation[]>;
    createLocation(newItem: IItemLocation): Promise<IItemLocation[]>;
  }