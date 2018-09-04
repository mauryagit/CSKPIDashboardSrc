import { IOperationDataProvider } from './IOperationDataProvider';
import { IItemOperationarea } from '../IItemOperationarea';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientBatch } from '@microsoft/sp-http';

export class SharePointDataProvider implements IOperationDataProvider {

    private _webpartContext: IWebPartContext;
    private _listurl: string;
    private _listName: string = "Operationarea";
    private _listItemName: string = "SP.Data.OperationareaListItem";
    public get webPartContext(): IWebPartContext {
        return this._webpartContext;
    }
    public set webPartContext(value: IWebPartContext) {

        this._webpartContext = value;
        this._listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listName}')/items`;
    }
    public getOperationAreaList(): Promise<IItemOperationarea[]> {

        return this._getOperationAreaList(this._webpartContext.spHttpClient);
        //#region 

        // return new Promise<IItemOperationarea[]>((resolve, reject) => {

        /*     const listName: string = "Operationarea";
             const querystring = `?$Select=ID,Title,Sequence`;
             const queryUrl = this._listurl + querystring;
 
             const spHttpClient: SPHttpClient = this._webpartContext.spHttpClient;
             const currentWebUrl: string = this._webpartContext.pageContext.web.absoluteUrl;
             const spBatchCreationOpts: ISPHttpClientBatchCreationOptions = { webUrl: currentWebUrl };
             const spBatch: SPHttpClientBatch = spHttpClient.beginBatch(spBatchCreationOpts);
 
             const getItems: Promise<SPHttpClientResponse> = spBatch.get(queryUrl, SPHttpClientBatch.configurations.v1);
             return this._webpartContext.spHttpClient.get(queryUrl,SPHttpClient.configurations.v1)
             .then((res:SPHttpClientResponse)=>{
                 return res.json();
             })
             .then((json :{ value: IItemOperationarea[] }) => {
                 return this._operationList = json.value;
             });*/

        /*
                    spBatch.execute()
                        .then(() => {
                            getItems.then((res: SPHttpClientResponse) => {
                                return res.json();
                            }).then((json: { value: IItemOperationarea[] }) => {
                                    this._operationList = [];
                                    json.value.map((val, index) => {
                                        this._operationList.push({ ID: val["ID"], Title: val["Title"], Sequence: val["Sequence"] });
                                    });
                                 
                                     json.value.map((arealst:IItemOperationarea)=>{
                                        //return arealst;
                                       return  this._operationList.push({ID: arealst.ID, Title: arealst.Title, Sequence: arealst.Sequence });
                                    })
                                   // resolve(this._operationList);
                                });
                        });*/
        //});
        //#endregion
    }
    private _getOperationAreaList(req: SPHttpClient): Promise<IItemOperationarea[]> {
        const querystring: string = "?$Select=ID,Title,Sequence";
        const queryUrl: string = this._listurl + querystring;

        return req.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IItemOperationarea[] }) => {
                return json.value.map((item: IItemOperationarea) => {
                    return item;
                });
            });
    }
    public createOperationArea(item: IItemOperationarea): Promise<IItemOperationarea[]> {
        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromise: Promise<{}>[] = [
            this._createOperationArea(batch, item),
            this._getItemsBatched(batch)
        ];
        return this._resolveBatch(batch, batchPromise);
    }
    private _createOperationArea(batch: SPHttpClientBatch, item: IItemOperationarea): Promise<SPHttpClientResponse> {
        const body: {} = {
            '@data.type': this._listItemName,
            'Title': item.Title,
            'Sequence': item.Sequence
        };

        return batch.post(
            this._listurl,
            SPHttpClientBatch.configurations.v1,
            { body: JSON.stringify(body) }
        );
    }
    public updateOperationArea(updatedItem: IItemOperationarea): Promise<IItemOperationarea[]> {
        const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._updateOperationArea(batch, updatedItem),
            this._getItemsBatched(batch)
        ];

        return this._resolveBatch(batch, batchPromises);
    }

    private _updateOperationArea(batch: SPHttpClientBatch, item: IItemOperationarea): Promise<SPHttpClientResponse> {

        const itemUpdatedUrl: string = `${this._listurl}(${item.ID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');

        const body: {} = {
            '@data.type': this._listItemName,
            'Title': item.Title,
            'Sequence': item.Sequence
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

    public deleteOperationArea(Itemdeleted: IItemOperationarea): Promise<IItemOperationarea[]> {

        const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._deleteOperationArea(batch, Itemdeleted),
            this._getItemsBatched(batch)
        ];
        return this._resolveBatch(batch, batchPromises);

    }
    private _deleteOperationArea(batch: SPHttpClientBatch, item: IItemOperationarea): Promise<SPHttpClientResponse> {
        const itemDeletedUrl: string = `${this._listurl}(${item.ID})`;
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
    private _getItemsBatched(requester: SPHttpClientBatch): Promise<IItemOperationarea[]> {
        const querystring = `?$Select=ID,Title,Sequence`;
        const queryUrl: string = this._listurl + querystring;

        return requester.get(queryUrl, SPHttpClientBatch.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                debugger;
                return response.json();
            })
            .then((json: { value: IItemOperationarea[] }) => {
                return json.value.map((task: IItemOperationarea) => {
                    return task;
                });
            });
    }
    private _resolveBatch(batch: SPHttpClientBatch, promises: Promise<{}>[]): Promise<IItemOperationarea[]> {
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