import { IIteamKPI } from '../service/IItemKPI';
import { IKPIMatrixDataProvider } from '../service/DataProvider/IKPIMatrixDataProvider';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import * as lodash from '@microsoft/sp-lodash-subset';
export class MockKPIMatrix implements IKPIMatrixDataProvider {
    public kpimatix: IIteamKPI[] = [];
    private _webPartContext: IWebPartContext;
    public set webPartContext(value: IWebPartContext) {
        this._webPartContext = value;
    }
    public get webPartContext(): IWebPartContext {
        return this._webPartContext;
    }

    constructor() {
        let items: any = this.getKPIDataFromList();
        items.d.results.map((val, index) => {
            this.addKPIMatrix({
                KPIID: val["KPI"].ID,
                Title: val["KPI"].Title,
                Metric: val["KPI"].Metric,
                Sequence: val["KPI"].Sequence,
                OperationAreaID: val["Operationarea"].ID,
                OperationAreaTitle: val["Operationarea"].Title,
                KPITargetConfig: val["Configtype"],
                Target: val["Title"],
                KPIMatrixID: val["ID"]
            });
        });
    }

    private addKPIMatrix(item: IIteamKPI): void {
        this.kpimatix.push({
            KPIID: (item.KPIID !== 0 ? item.KPIID : this.kpimatix.length + 1),
            KPITargetConfig: item.KPITargetConfig,
            Metric: item.Metric,
            Sequence: item.Sequence,
            Target: item.Target,
            Title: item.Title,
            OperationAreaID: item.OperationAreaID,
            OperationAreaTitle:item.OperationAreaTitle,
            KPIMatrixID: item.KPIMatrixID
        });
    }

    public getKPIMatrixList(): Promise<IIteamKPI[]> {
        const localitem: IIteamKPI[] = this.kpimatix;
        return new Promise<IIteamKPI[]>((resolve) => {
            setTimeout(() => {
                resolve(localitem);
            }, 500);
        });
    }

    public getOperationArea(): Promise<any[]> {
        let operationarea: any = this.getList();
        return new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve(operationarea);
            }, 500);
        });
       
    }

    public getList(): any {
        return  [{"Title": "HSEF","Sequence": 1,"ID": 1},{"Title": "Loreum","Sequence": 2,"ID": 2}];
                 
      }
    public createKPIMatrix(item: IIteamKPI): Promise<IIteamKPI[]> {
        this.addKPIMatrix(item);
        return this.getKPIMatrixList();
    }
    public updateKPIMatrix(updatedItem: IIteamKPI): Promise<IIteamKPI[]> {
        debugger;
        const index: number =
            lodash.findIndex(
                this.kpimatix, (o) => { return o.KPIID == updatedItem.KPIID; }
            );
        if (index !== -1) {
            this.kpimatix[index] = updatedItem;
            return this.getKPIData();
        } else {
            return Promise.reject(new Error(`Item to update doesn't exist`));
        }
    }
    public deleteKPIMatrix(deleteItem: IIteamKPI): Promise<IIteamKPI[]> {
        this.kpimatix = this.kpimatix.filter((item: IIteamKPI) => {
            return item.KPIID !== deleteItem.KPIID;
        });
        return this.getKPIData();
    }

    public getKPIData(): Promise<IIteamKPI[]> {
        const localitem: IIteamKPI[] = this.kpimatix;
        return new Promise<IIteamKPI[]>((resolve) => {
            setTimeout(() => {
                resolve(localitem);
            }, 500);
        });
    }
    private getKPIDataFromList(): any {
        return {
            "d": {
                "results": [
                    {
                        "Operationarea": {
                            "__metadata": {
                                "id": "7835d5ab-6ee8-4271-be4f-87c7503bd563",
                                "type": "SP.Data.OperationareaListItem"
                            },
                            "Title": "HSEF",
                            "ID": 1
                        },
                        "KPI": {
                            "__metadata": {
                                "id": "0d55ff54-c617-4ca9-94cf-2df4c0a14a80",
                                "type": "SP.Data.KPIListItem"
                            },
                            "Title": "HSEF incidents related to Corporate Services.",
                            "Metric": "Number",
                            "Sequence": 1,
                            "ID": 1
                        },
                        "Id": 1,
                        "Title": "0",
                        "Configtype": "Generic",
                        "ID": 1
                    }
                ]
            }
        };
        /* const KPI ={
             "d": {
                 "results": [
                     {                   
                         "Areaofoperation": {
                             "__metadata": {
                                 "id": "a64bc8fb-e86f-46a1-9d13-fbaecc78b61b",
                                 "type": "SP.Data.OperationareaListItem"
                             },
                             "Title": "HSEF",
                             "ID": 1
                         },
                         "Id": 1,
                         "Title": "HSEF incidents related to Corporate Services.",
                         "Metric": "Number",
                         "Sequence": 1,
                         "ID": 1
                     }
                 ]
             }
         }*/
    }
}

