import * as lodash from '@microsoft/sp-lodash-subset';
import {IOperationDataProvider} from '../service/DataProvider/IOperationDataProvider';
import {IItemOperationarea} from './IItemOperationarea';
import {IWebPartContext} from '@microsoft/sp-webpart-base';
export class MockOperationarea implements IOperationDataProvider {
  public operationarea: IItemOperationarea[] = [];
  private _webPartContext: IWebPartContext;
  constructor() {
    let items: any = this.getList();
    items.d.results.map((val, index) => {
      this.addOperationArea({ ID: val["ID"], Title: val["Title"], Order: val["Order0"] });
    });
  }

  public set webPartContext(value: IWebPartContext) {
    this._webPartContext = value;
  }

  public get webPartContext(): IWebPartContext {
    return this._webPartContext;
  }

  public addOperationArea(obj: any) {

    this.operationarea.push({
      ID: this.operationarea.length + 1,
      Title: obj["Title"],
      Sequence: obj["Sequence"]
    });   
  }


  public createOperationArea(newItem: IItemOperationarea): Promise<IItemOperationarea[]> {
    this.addOperationArea(newItem);
    return this.getOperationAreaList();
  }
  public updateOperationArea(updatedItem: IItemOperationarea): Promise<IItemOperationarea[]> {
    const index: number =
      lodash.findIndex(
        this.operationarea, (o) => { return o.ID == updatedItem.ID; }
      );
    if (index !== -1) {
      this.operationarea[index] = updatedItem;
      return this.getOperationAreaList();
    } else {
      return Promise.reject(new Error(`Item to update doesn't exist`));
    }
  }
  public deleteOperationArea(deleteItem: IItemOperationarea): Promise<IItemOperationarea[]> {
    this.operationarea = this.operationarea.filter((item: IItemOperationarea) => {
      return item.ID !== deleteItem.ID;
    });
    return this.getOperationAreaList();
  }
  public getOperationAreaList(): Promise<IItemOperationarea[]> {
    const localitem: IItemOperationarea[] = this.operationarea;
    return new Promise<IItemOperationarea[]>((resolve) => {
      setTimeout(() => {
        resolve(localitem);
      }, 500);
    });
  }
  public getList(): any {
    return {
      d: {
        results: [
          {
            Title: "HSEF",
            Order0: 1,
            ID: 1
          },
          {
            Title: "Loreum",
            Order0: 2,
            ID: 2
          }
        ]
      }
    };
  }
}
