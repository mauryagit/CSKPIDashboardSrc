import {IWebPartContext} from '@microsoft/sp-webpart-base';
import {IItemLocation} from './IItemLocation';
import {ILocationDataProvider} from '../service/DataProvider/ILocationDataProvider';
import * as lodash from '@microsoft/sp-lodash-subset';
  export class MockLocationData implements ILocationDataProvider {
    public locations: IItemLocation[] = [];
  
    private _webPartContext: IWebPartContext;
    
  public set webPartContext(value: IWebPartContext) {
    this._webPartContext = value;
  }

  public get webPartContext(): IWebPartContext {
    return this._webPartContext;
  }
    constructor() {
     
      const this1 = this;
      let items: any = this.getLocation();    
      items.d.results.map((val,index) =>{
        this1.locations.push({
            Title: val.Title,
            ID: val.ID
          });
      });
    }
    public addOperationArea(obj: any) {

      this.locations.push({
        ID: this.locations.length + 1,
        Title: obj["Title"]        
      });   
    }
  
  
    public createLocation(newItem: IItemLocation): Promise<IItemLocation[]> {
     
      this.addOperationArea(newItem);
      return this.getLocationList();
    }
    public updateLocation(updatedItem: IItemLocation): Promise<IItemLocation[]> {
     
      const index: number =
        lodash.findIndex(
          this.locations, (o) => { return o.ID == updatedItem.ID; }
        );
      if (index !== -1) {
        this.locations[index] = updatedItem;
        return this.getLocationList();
      } else {
        return Promise.reject(new Error(`Item to update doesn't exist`));
      }
    }
    public deleteLocation(deleteItem: IItemLocation): Promise<IItemLocation[]> {    
      this.locations = this.locations.filter((item: IItemLocation) => {
        return item.ID !== deleteItem.ID;
      });
      return this.getLocationList();
    }
    public getLocationList(): Promise<IItemLocation[]> {
      const localitem: IItemLocation[] = this.locations;
      return new Promise<IItemLocation[]>((resolve) => {
        setTimeout(() => {
          resolve(localitem);
        }, 500);
      });
    }
    public getLocation(): any {
      return {
        d: {
          results: [
            {             
              FileSystemObjectType: 0,
              Id: 1,
              ContentTypeId: "0x01005AE223F7327561418DF124BD52613CFB",
              Title: "DMD",
              ID: 1,
              Modified: "2018-08-22T09:25:44Z",
              Created: "2018-08-22T09:25:44Z",
              AuthorId: 2,
              EditorId: 2,
              OData__UIVersionString: "1.0",
              Attachments: false,
              GUID: "c7c5b84f-3c46-4d90-bc7d-1ec7702c7647"
            },
            {             
              FileSystemObjectType: 0,
              Id: 2,
              ContentTypeId: "0x01005AE223F7327561418DF124BD52613CFB",
              Title: "SMD",
              ID: 2,
              Modified: "2018-08-23T09:19:12Z",
              Created: "2018-08-23T09:19:12Z",
              AuthorId: 2,
              EditorId: 2,
              OData__UIVersionString: "1.0",
              Attachments: false,
              GUID: "e90c3f7a-4184-4f9c-b115-da3e078e61b6"
            },
            {             
              FileSystemObjectType: 0,
              Id: 3,
              ContentTypeId: "0x01005AE223F7327561418DF124BD52613CFB",
              Title: "NMD",
              ID: 3,
              Modified: "2018-08-23T09:19:12Z",
              Created: "2018-08-23T09:19:12Z",
              AuthorId: 2,
              EditorId: 2,
              OData__UIVersionString: "1.0",
              Attachments: false,
              GUID: "e90c3f7a-4184-4f9c-b115-da3e078e61b6"
            }
          ]
        }
      };
    }
  }
  