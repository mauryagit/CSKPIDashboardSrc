import { IKPIMatrixDataProvider } from './IKPIMatrixDataProvider';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientBatch, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { IIteamKPI } from '../IItemKPI';

export class SharePointDataProvider implements IKPIMatrixDataProvider {
    private _webpartContext: IWebPartContext;
    private _listurl: string;
    private _listNamekpi: string = "KPI";
    private _listNamekpitarget: string = "KPITarget";
    private _listKPIItemName: string = "SP.Data.KPIListItem";
    private _listKPITargetItemName: string = "SP.Data.KPITargetListItem";
    public get webPartContext(): IWebPartContext {
        return this._webpartContext;
    }
    public set webPartContext(value: IWebPartContext) {

        this._webpartContext = value;
        this._listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/`;
    }

    public getKPIMatrixList(): Promise<IIteamKPI[]> {
        return this._getKPIMatixList(this._webpartContext.spHttpClient);
    }
    public updateKPIMatrix(updateItem: IIteamKPI): Promise<IIteamKPI[]> {
        const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._updateKPI(batch, updateItem),
            this._updateKPITarget(batch, updateItem),
            this._getItemsBatched(batch)
        ];

        return this._resolveBatch(batch, batchPromises);
    }

    private _updateKPI(batch: SPHttpClientBatch, item: IIteamKPI): Promise<SPHttpClientResponse> {
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listNamekpi}')/items`;
        const itemUpdatedUrl: string = `${listurl}(${item.KPIID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');

        const body: {} = {
            '@data.type': this._listKPIItemName,
            'Title': item.Title,
            'Metric': item.Metric,
            'Sequence': item.Sequence,
            'AreaofoperationId': item.OperationAreaID
        };

        return batch.fetch(itemUpdatedUrl,
            SPHttpClientBatch.configurations.v1,
            {
                body: JSON.stringify(body),
                headers,
                method: 'PATCH'
            }
        );
    }

    private _updateKPITarget(batch: SPHttpClientBatch, item: IIteamKPI): Promise<SPHttpClientResponse> {
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listNamekpitarget}')/items`;
        const itemUpdatedUrl: string = `${listurl}(${item.KPIMatrixID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');

        const body: {} = {
            '@data.type': this._listKPITargetItemName,
            'Title': item.Target,
            'OperationareaId': item.OperationAreaID,
            'KPIId': item.KPIID
        };

        return batch.fetch(itemUpdatedUrl,
            SPHttpClientBatch.configurations.v1,
            {
                body: JSON.stringify(body),
                headers,
                method: 'PATCH'
            }
        );
    }
    public deleteKPIMatrix(deleteItem: IIteamKPI): Promise<IIteamKPI[]> {
        const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._deleteKPITarget(batch, deleteItem),
            this._deleteKPI(batch, deleteItem),          
            this._getItemsBatched(batch)
        ];
        return this._resolveBatch(batch, batchPromises);
    }
    private _deleteKPI(batch: SPHttpClientBatch, item: IIteamKPI): Promise<SPHttpClientResponse> {
      
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listNamekpi}')/items`;
        const itemDeletedUrl: string = `${listurl}(${item.KPIID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');

        return batch.fetch(itemDeletedUrl,
            SPHttpClientBatch.configurations.v1,
            {
                headers,
                method: 'DELETE'
            }
        );
    }
    private _deleteKPITarget(batch: SPHttpClientBatch, item: IIteamKPI): Promise<SPHttpClientResponse> {
   
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listNamekpitarget}')/items`;
        const itemDeletedUrl: string = `${listurl}(${item.KPIMatrixID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');

        return batch.fetch(itemDeletedUrl,
            SPHttpClientBatch.configurations.v1,
            {
                headers,
                method: 'DELETE'
            }
        );
    }
    public createKPIMatrix(newItem: IIteamKPI): Promise<IIteamKPI[]> {
        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromise: Promise<{}>[] = [
            this._createKPI(batch, newItem)
        ];
        return this._resolveBatch(batch, batchPromise)
            .then((res: any) => {
              
                return res.json();
                // return   this.cretsome(newItem, res);
            }).then((json: IIteamKPI[]) => {
              
                return this._createKPITarget(newItem, json);
            });
    }

    private _createKPI(batch: SPHttpClientBatch, item: IIteamKPI): Promise<SPHttpClientResponse> {
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listNamekpi}')/items`;
        const body: {} = {
            '@data.type': this._listKPIItemName,
            'Title': item.Title,
            'Metric': item.Metric,
            'Sequence': item.Sequence,
            'AreaofoperationId': item.OperationAreaID
        };

        return batch.post(
            listurl,
            SPHttpClientBatch.configurations.v1,
            { body: JSON.stringify(body) }
        );

    }
    private _createKPITarget(newItem: IIteamKPI, newKPI: any): Promise<IIteamKPI[]> {
       
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listNamekpitarget}')/items`;
        //'@data.type': this._listKPITargetItemName,
        const body: string = JSON.stringify({

            '__metadata': { "type": `${this._listKPITargetItemName}` },
            'Title': newItem.Target,
            'Configtype': newItem.KPITargetConfig,
            'OperationareaId': newItem.OperationAreaID,
            'KPIId': parseInt(newKPI["ID"])
        });
        return (
            this._webpartContext.spHttpClient.post(listurl, SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'Content-type': 'application/json;odata=verbose',
                        'odata-version': ''
                    },
                    body: body
                })
                .then((res: SPHttpClientResponse) => {
                    return res.json();
                })
                .then((json: any) => {
                    return this._getKPIMatixList(this._webpartContext.spHttpClient);
                })
        );
    }

    private _getItemsBatched(requester: SPHttpClientBatch): Promise<IIteamKPI[]> {
        const listpath = `GetByTitle('${this._listNamekpitarget}')/items`;
        const queryString = "?$select=ID,Title,Configtype,KPI/Title,KPI/Metric,KPI/Sequence,KPI/ID,Operationarea/Title,Operationarea/ID&$expand=KPI,Operationarea";
        const queryUrl = this._listurl + listpath + queryString;

        return requester.get(queryUrl, SPHttpClientBatch.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IIteamKPI[] }) => {
                return json.value.map((item: any) => {
                    return {
                        KPIID: item["KPI"].ID,
                        Title: item["KPI"].Title,
                        Metric: item["KPI"].Metric,
                        Sequence: item["KPI"].Sequence,
                        OperationAreaID: item["Operationarea"].ID,
                        OperationAreaTitle: item["Operationarea"].Title,
                        KPITargetConfig: item["Configtype"],
                        Target: item["Title"],
                        KPIMatrixID: item["ID"]
                    };
                });
            });
    }
    private _getKPIMatixList(req: SPHttpClient): Promise<IIteamKPI[]> {
        const listpath = `GetByTitle('${this._listNamekpitarget}')/items`;
        const queryString = "?$select=ID,Title,Configtype,KPI/Title,KPI/Metric,KPI/Sequence,KPI/ID,Operationarea/Title,Operationarea/ID&$expand=KPI,Operationarea";
        const queryUrl = this._listurl + listpath + queryString;

        return req.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IIteamKPI[] }) => {
                return json.value.map((item: any) => {
                    return {
                        KPIID: item["KPI"].ID,
                        Title: item["KPI"].Title,
                        Metric: item["KPI"].Metric,
                        Sequence: item["KPI"].Sequence,
                        OperationAreaID: item["Operationarea"].ID,
                        OperationAreaTitle: item["Operationarea"].Title,
                        KPITargetConfig: item["Configtype"],
                        Target: item["Title"],
                        KPIMatrixID: item["ID"]
                    };
                });
            });
    }


    public getOperationArea(): Promise<any[]> {
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Operationarea')/items`;
        const querystring = `?$Select=ID,Title,Sequence`;
        const queryUrl = listurl + querystring;
        return this._webpartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: any[] }) => {
                return json.value;
            });
    }


    private _resolveBatch(batch: SPHttpClientBatch, promises: Promise<{}>[]): Promise<IIteamKPI[]> {

        return batch.execute()
            .then(() => {
                return Promise.all(promises);
            }).then((values: any) => {
                return Promise.resolve(values[values.length - 1]);
            }).catch((ex) => {
                throw ex;
            });
    }
}