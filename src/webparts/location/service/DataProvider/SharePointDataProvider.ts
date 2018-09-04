import { ILocationDataProvider } from './ILocationDataProvider';
import { IItemLocation } from '../IItemLocation';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientBatch } from '@microsoft/sp-http';

export class SharePointDataProvider implements ILocationDataProvider {

   
    private _webpartContext: IWebPartContext;
    private _listurl: string;
    private _listName: string = "Location";
    private _listItemName: string = "SP.Data.LocationListItem";
    public get webPartContext(): IWebPartContext {
        return this._webpartContext;
    }
    public set webPartContext(value: IWebPartContext) {

        this._webpartContext = value;
        this._listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this._listName}')/items`;
    }
    public getLocationList(): Promise<IItemLocation[]> {

        return this._getLocationList(this._webpartContext.spHttpClient);

    }
    private _getLocationList(req: SPHttpClient): Promise<IItemLocation[]> {
        const querystring: string = "?$Select=ID,Title";
        const queryUrl: string = this._listurl + querystring;

        return req.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IItemLocation[] }) => {
                return json.value.map((item: IItemLocation) => {
                    return item;
                });
            });
    }
    public createLocation(item: IItemLocation): Promise<IItemLocation[]> {
        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromise: Promise<{}>[] = [
            this._createLocation(batch, item),
            this._getItemsBatched(batch)
        ];
        return this._resolveBatch(batch, batchPromise);
    }

    private _createLocation(batch: SPHttpClientBatch, item: IItemLocation): Promise<SPHttpClientResponse> {
        const body: {} = {
            '@data.type': this._listItemName,
            'Title': item.Title
        };

        return batch.post(
            this._listurl,
            SPHttpClientBatch.configurations.v1,
            { body: JSON.stringify(body) }
        );
    }
    public updateLocation(updatedItem: IItemLocation): Promise<IItemLocation[]> {
        const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._updateLocation(batch, updatedItem),
            this._getItemsBatched(batch)
        ];

        return this._resolveBatch(batch, batchPromises);
    }

    private _updateLocation(batch: SPHttpClientBatch, item: IItemLocation): Promise<SPHttpClientResponse> {
        const itemUpdatedUrl: string = `${this._listurl}(${item.ID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');

        const body: {} = {
            '@data.type': this._listItemName,
            'Title': item.Title
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

    public deleteLocation(Itemdeleted: IItemLocation): Promise<IItemLocation[]> {

        const batch: SPHttpClientBatch = this.webPartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._deleteLocation(batch, Itemdeleted),
            this._getItemsBatched(batch)
        ];
        return this._resolveBatch(batch, batchPromises);

    }
    private _deleteLocation(batch: SPHttpClientBatch, item: IItemLocation): Promise<SPHttpClientResponse> {
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
    private _getItemsBatched(requester: SPHttpClientBatch): Promise<IItemLocation[]> {
        const querystring = `?$Select=ID,Title`;
        const queryUrl: string = this._listurl + querystring;

        return requester.get(queryUrl, SPHttpClientBatch.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IItemLocation[] }) => {
                return json.value.map((task: IItemLocation) => {
                    return task;
                });
            });
    }
    private _resolveBatch(batch: SPHttpClientBatch, promises: Promise<{}>[]): Promise<IItemLocation[]> {  

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