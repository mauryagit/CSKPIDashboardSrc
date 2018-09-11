import { IKPIInputFormDataProvider } from '../DataProvider/IKPIInputFormDataProvider';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientBatch } from '@microsoft/sp-http';
import { IKPILocationEventIncidentItem, IKPIItem, ICSKPIProps } from '../IKPIItem';
import { ILocationInventory } from '../ILocationInventory';
import { IOperationMetric } from '../IOperationMetric';

import * as lodash from '@microsoft/sp-lodash-subset';
export class SharePointDataProvider implements IKPIInputFormDataProvider {
    private _webpartContext: IWebPartContext;
    private _listurl: string;
    private _inventoryLocation: string = "LocationInventory";
    private _inventoryLocationlistItemName: string = "SP.Data.LocationInventoryListItem";
    private _locationEventIncident: string = "LocationEventIncident";
    private _locationEventIncidentlistItemName: string = "SP.Data.LocationEventIncidentListItem";
    private _transactionmetric: string = "Transactionmetric";
    private _transactionmetriclistItemName: string = "SP.Data.TransactionmetricListItem";

    private _locationinventoryDefault: ILocationInventory = {
        Areainacres: "",
        Builtupofficespacearea: "",
        Cabininventory: "", Cabinoccupied: "",
        Cubicleinventory: "", Cubicleoccupied: "",
        Dailybuses: "", Employee: "",
        GETaccommodation: "", GHtransitaccommodation: "",
        ID: 0, LocationId: 1, LocationTitle: "", Mealserved: "",
        Monthlyhirecar: "", Title: "", Totalstaff: "", Townshipaccommodation: "",
        Week: ""
    };


    private weekTargetList: IKPIItem[] = [];
    private weekEventIncident: IKPILocationEventIncidentItem[] = [];
    private weekLocationInventory: ILocationInventory[] = [];

    private weekOperationMetric: IOperationMetric[] = [];

    public get webPartContext(): IWebPartContext {
        return this._webpartContext;
    }
    public set webPartContext(value: IWebPartContext) {

        this._webpartContext = value;
        this._listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/`;
    }

    //#region Location Inventory
    public getKPILocationInventoryForTheWeekOfLocation(locationName: ICSKPIProps): Promise<ILocationInventory> {
        return this._getKPILocationInventoryForTheWeekOfLocation(this._webpartContext.spHttpClient, locationName);
    }

    private _getKPILocationInventoryForTheWeekOfLocation(req: SPHttpClient, props: ICSKPIProps): Promise<ILocationInventory> {
        const querystring: string = `?$Select=ID,Title,Week,Areainacres,Builtupofficespacearea,Cubicleinventory,Cabininventory,
                                        Cubicleoccupied,Cabinoccupied,Employee,Totalstaff,Townshipaccommodation,GHtransitaccommodation,
                                        GETaccommodation,Mealserved,Dailybuses,Monthlyhirecar,Location/ID,Location/Title&$expand=Location
                                        &$Filter=Location/Title eq '${props.location.name}' and Week eq '${props.week}' and LinkTitle eq '${props.year}'`;
        const queryUrl: string = this._listurl + `GetByTitle('${this._inventoryLocation}')/items` + querystring;

        return req.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: ILocationInventory }) => {

                if (lodash.isEmpty(json.value)) {
                    return this._locationinventoryDefault;
                }
                return ({
                    Areainacres: json.value[0]["Areainacres"],
                    Builtupofficespacearea: json.value[0]["Builtupofficespacearea"],
                    Cabininventory: json.value[0]["Cabininventory"],
                    Cabinoccupied: json.value[0]["Cabinoccupied"],
                    Cubicleinventory: json.value[0]["Cubicleinventory"],
                    Cubicleoccupied: json.value[0]["Cubicleoccupied"],
                    Dailybuses: json.value[0]["Dailybuses"],
                    Employee: json.value[0]["Employee"],
                    GETaccommodation: json.value[0]["GETaccommodation"],
                    GHtransitaccommodation: json.value[0]["GHtransitaccommodation"],
                    ID: json.value[0]["ID"],
                    LocationId: json.value[0]["Location"].ID,
                    LocationTitle: json.value[0]["Location"].Title,
                    Mealserved: json.value[0]["Mealserved"],
                    Monthlyhirecar: json.value[0]["Monthlyhirecar"],
                    Title: json.value[0]["Title"],
                    Totalstaff: json.value[0]["Totalstaff"],
                    Townshipaccommodation: json.value[0]["Townshipaccommodation"],
                    Week: json.value[0]["Week"]
                });
            });
    }

    private _UpdateKPILocationInventory(batch: SPHttpClientBatch, updateitem: ILocationInventory): Promise<SPHttpClientResponse> {
        const listurl = this._listurl + `GetByTitle('${this._inventoryLocation}')/items(${updateitem.ID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');
        const body: {} = {
            '@data.type': this._inventoryLocationlistItemName,
            'Areainacres': updateitem.Areainacres,
            'Builtupofficespacearea': updateitem.Builtupofficespacearea,
            'Cabininventory': updateitem.Cabininventory,
            'Cabinoccupied': updateitem.Cabinoccupied,
            'Cubicleinventory': updateitem.Cubicleinventory,
            'Cubicleoccupied': updateitem.Cubicleoccupied,
            'Dailybuses': updateitem.Dailybuses,
            'Employee': updateitem.Employee,
            'GETaccommodation': updateitem.GETaccommodation,
            'GHtransitaccommodation': updateitem.GHtransitaccommodation,
            'Mealserved': updateitem.Mealserved,
            'Monthlyhirecar': updateitem.Monthlyhirecar,
            'Totalstaff': updateitem.Totalstaff,
            'Townshipaccommodation': updateitem.Townshipaccommodation
        };
        return batch.fetch(listurl,
            SPHttpClientBatch.configurations.v1,
            {
                body: JSON.stringify(body),
                headers,
                method: 'PATCH'
            }
        );
    }
    private _AddKPILocationInventory(batch: SPHttpClientBatch, updateitem: ILocationInventory): Promise<SPHttpClientResponse> {

        const listurl = this._listurl + `GetByTitle('${this._inventoryLocation}')/items`;
        const body: {} = {
            '@data.type': this._inventoryLocationlistItemName,
            'Title': updateitem.Title,
            'Week': updateitem.Week,
            'LocationId': updateitem.LocationId,
            'Areainacres': updateitem.Areainacres,
            'Builtupofficespacearea': updateitem.Builtupofficespacearea,
            'Cabininventory': updateitem.Cabininventory,
            'Cabinoccupied': updateitem.Cabinoccupied,
            'Cubicleinventory': updateitem.Cubicleinventory,
            'Cubicleoccupied': updateitem.Cubicleoccupied,
            'Dailybuses': updateitem.Dailybuses,
            'Employee': updateitem.Employee,
            'GETaccommodation': updateitem.GETaccommodation,
            'GHtransitaccommodation': updateitem.GHtransitaccommodation,
            'Mealserved': updateitem.Mealserved,
            'Monthlyhirecar': updateitem.Monthlyhirecar,
            'Totalstaff': updateitem.Totalstaff,
            'Townshipaccommodation': updateitem.Townshipaccommodation
        };

        return batch.post(
            listurl,
            SPHttpClientBatch.configurations.v1,
            { body: JSON.stringify(body) }
        );
    }
    private _getLocationInventoryItemsBatched(requester: SPHttpClientBatch, props: ICSKPIProps): Promise<ILocationInventory> {
        const querystring: string = `?$Select=ID,Title,Week,Areainacres,Builtupofficespacearea,Cubicleinventory,Cabininventory,
        Cubicleoccupied,Cabinoccupied,Employee,Totalstaff,Townshipaccommodation,GHtransitaccommodation,
        GETaccommodation,Mealserved,Dailybuses,Monthlyhirecar,Location/ID,Location/Title&$expand=Location
        &$Filter=Location/Title eq '${props.location.name}' and Week eq '${props.week}' and LinkTitle eq '${props.year}'`;
        const queryUrl: string = this._listurl + `GetByTitle('${this._inventoryLocation}')/items` + querystring;

        return requester.get(queryUrl, SPHttpClientBatch.configurations.v1)
            .then((response: SPHttpClientResponse) => {

                return response.json();
            })
            .then((json: { value: ILocationInventory }) => {
                return ({
                    Areainacres: json.value[0]["Areainacres"],
                    Builtupofficespacearea: json.value[0]["Builtupofficespacearea"],
                    Cabininventory: json.value[0]["Cabininventory"],
                    Cabinoccupied: json.value[0]["Cabinoccupied"],
                    Cubicleinventory: json.value[0]["Cubicleinventory"],
                    Cubicleoccupied: json.value[0]["Cubicleoccupied"],
                    Dailybuses: json.value[0]["Dailybuses"],
                    Employee: json.value[0]["Employee"],
                    GETaccommodation: json.value[0]["GETaccommodation"],
                    GHtransitaccommodation: json.value[0]["GHtransitaccommodation"],
                    ID: json.value[0]["ID"],
                    LocationId: json.value[0]["Location"].ID,
                    LocationTitle: json.value[0]["Location"].Title,
                    Mealserved: json.value[0]["Mealserved"],
                    Monthlyhirecar: json.value[0]["Monthlyhirecar"],
                    Title: json.value[0]["Title"],
                    Totalstaff: json.value[0]["Totalstaff"],
                    Townshipaccommodation: json.value[0]["Townshipaccommodation"],
                    Week: json.value[0]["Week"]
                });
            });
    }
    public AddKPILocationInventory(newItem: ILocationInventory): Promise<ILocationInventory> {

        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._AddKPILocationInventory(batch, newItem),
            this._getLocationInventoryItemsBatched(batch, {
                location:{name:newItem.LocationTitle, id:newItem.LocationId},
                 week: newItem.Week, year: newItem.Title
            })
        ];
        return this._resolveBatch_LI(batch, batchPromises);
    }
    public UpdateKPILocationInventory(updateItem: ILocationInventory): Promise<ILocationInventory> {
        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._UpdateKPILocationInventory(batch, updateItem),
            this._getLocationInventoryItemsBatched(batch, {
                location:{name:updateItem.LocationTitle, id:updateItem.LocationId} ,
                 week: updateItem.Week, year: updateItem.Title
            })
        ];
        return this._resolveBatch_LI(batch, batchPromises);
    }
    private _resolveBatch_LI(batch: SPHttpClientBatch, promises: Promise<{}>[]): Promise<ILocationInventory> {
        return batch.execute()
            .then(() => {
                return Promise.all(promises);
            }).then((values: any) => {
                return Promise.resolve(values[values.length - 1]);
            }).catch((ex) => {
                throw ex;
            });
    }
    //#endregion

    //#region KPI Weekly Event / Feedback

    private _getKPIEventIncident(req: SPHttpClient, props: ICSKPIProps): Promise<IKPILocationEventIncidentItem[]> {
       
        const querystring: string = `?$Select=ID,Title,Commenttype,Comment,Location/ID,Location/Title&$expand=Location
        &$Filter=Location/Title eq '${props.location.name}' and Week eq '${props.week}' and LinkTitle eq '${props.year}'`;
        const queryUrl: string = this._listurl + `GetByTitle('${this._locationEventIncident}')/items` + querystring;

        return req.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IKPILocationEventIncidentItem[] }) => {
                return json.value.map((item: IKPILocationEventIncidentItem) => {
                    return {
                        EventIncidentID: item["ID"],
                        Comment: item["Comment"],
                        IncidentType: item["Commenttype"],
                        Week: props.week,
                        Year: props.year,
                        LocationTitle: item["Location"].Title,
                        LocationID: item["Location"].ID
                    };
                });
            });
    }
    private _getKPIEventIncidentItemsBatched(requester: SPHttpClientBatch, props: ICSKPIProps): Promise<IKPILocationEventIncidentItem[]> {
        const querystring: string = `?$Select=ID,Title,Commenttype,Comment,Location/ID,Location/Title&$expand=Location
        &$Filter=Location/Title eq '${props.location.name}' and Week eq '${props.week}' and LinkTitle eq '${props.year}'`;
        const queryUrl: string = this._listurl + `GetByTitle('${this._locationEventIncident}')/items` + querystring;

        return requester.get(queryUrl, SPHttpClientBatch.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IKPILocationEventIncidentItem[] }) => {
                return json.value.map((item: IKPILocationEventIncidentItem) => {
                    return {
                        EventIncidentID: item["ID"],
                        Comment: item["Comment"],
                        IncidentType: item["Commenttype"],
                        Week: props.week,
                        Year: props.year,
                        LocationTitle: item["Location"].Title,
                        LocationID: item["Location"].ID
                    };
                });
            });
    }
    private _AddKPIEventIncident(batch: SPHttpClientBatch, newItem: IKPILocationEventIncidentItem): Promise<SPHttpClientResponse> {
        const listurl = this._listurl + `GetByTitle('${this._locationEventIncident}')/items`;
        const body: {} = {
            '@data.type': this._locationEventIncidentlistItemName,
            'Title': newItem.Year,
            'Week': newItem.Week,
            'LocationId': newItem.LocationID,
            'Commenttype': newItem.IncidentType,
            'Comment': newItem.Comment
        };
        return batch.post(
            listurl,
            SPHttpClientBatch.configurations.v1,
            { body: JSON.stringify(body) }
        );

    }
    private _UpdateKPIEventIncident(batch: SPHttpClientBatch, updateitem: IKPILocationEventIncidentItem): Promise<SPHttpClientResponse> {
        const listurl = this._listurl + `GetByTitle('${this._locationEventIncident}')/items(${updateitem.EventIncidentID})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');
        const body: {} = {
            '@data.type': this._getKPIEventIncidentItemsBatched,
            'Commenttype': updateitem.IncidentType,
            'Comment': updateitem.Comment
        };
        return batch.fetch(listurl,
            SPHttpClientBatch.configurations.v1,
            {
                body: JSON.stringify(body),
                headers,
                method: 'PATCH'
            }
        );
    }

    private _DeleteKPIEventIncident(batch: SPHttpClientBatch, item: IKPILocationEventIncidentItem): Promise<SPHttpClientResponse> {
        const itemDeletedUrl = this._listurl + `GetByTitle('${this._locationEventIncident}')/items(${item.EventIncidentID})`;
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
    public getKPIEventIncidentForTheWeekOfLocation(props: ICSKPIProps): Promise<IKPILocationEventIncidentItem[]> {
        return this._getKPIEventIncident(this._webpartContext.spHttpClient, props);
    }

    public AddKPIEventIncident(newItem: IKPILocationEventIncidentItem): Promise<IKPILocationEventIncidentItem[]> {
        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._AddKPIEventIncident(batch, newItem),
            this._getKPIEventIncidentItemsBatched(batch, {
                location:{name:newItem.LocationTitle, id:newItem.LocationID},
                 week: newItem.Week, year: newItem.Year
            })
        ];
        return this._resolveBatch_EI(batch, batchPromises);
    }
    private _resolveBatch_EI(batch: SPHttpClientBatch, promises: Promise<{}>[]): Promise<IKPILocationEventIncidentItem[]> {
        return batch.execute()
            .then(() => {
                return Promise.all(promises);
            }).then((values: any) => {
                return Promise.resolve(values[values.length - 1]);
            }).catch((ex) => {
                throw ex;
            });
    }

    public UpdateKPIEventIncident(updateitem: IKPILocationEventIncidentItem): Promise<IKPILocationEventIncidentItem[]> {
        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._UpdateKPIEventIncident(batch, updateitem),
            this._getKPIEventIncidentItemsBatched(batch, {
                location:{name:updateitem.LocationTitle, id:updateitem.LocationID},
                 week: updateitem.Week, year: updateitem.Year
            })
        ];
        return this._resolveBatch_EI(batch, batchPromises);
    }
    public DeleteKPIEventIncident(updateitem: IKPILocationEventIncidentItem): Promise<IKPILocationEventIncidentItem[]> {

        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [
            this._DeleteKPIEventIncident(batch, updateitem),
            this._getKPIEventIncidentItemsBatched(batch, {
                location:{name:updateitem.LocationTitle, id:updateitem.LocationID},
                 week: updateitem.Week, year: updateitem.Year
            })
        ];
        return this._resolveBatch_EI(batch, batchPromises);
    }

    //#endregion

    //#region Operation Metric
    private _getKpiMatric(req: SPHttpClient): Promise<IKPIItem[]> {
        const querystring: string = "?$Select=ID,Title,Configtype,Operationarea/ID,Operationarea/Title,KPI/ID,KPI/Title,KPI/Metric,KPI/Sequence,Operationarea/Sequence&$expand=Operationarea,KPI";
        const queryUrl: string = this._listurl + `GetByTitle('KPITarget')/items` + querystring;

        return req.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IKPIItem[] }) => {
                return json.value.map((item: IKPIItem) => {
                    return item;
                });
            });
    }
    private _getKPIOperationalMertic(req: SPHttpClient, props: ICSKPIProps): Promise<IOperationMetric[]> {
        const querystring: string = `?$Select=ID,Title,Week,Metricvalue,Remark,
                                    KPITarget/ID,KPITarget/Title,Location/ID,Location/Title&$expand=KPITarget,Location
                                    &$Filter=Location/Title eq '${props.location.name}' and Week eq '${props.week}' and LinkTitle eq '${props.year}'`;
        const queryUrl: string = this._listurl + `GetByTitle('${this._transactionmetric}')/items` + querystring;

        return req.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: IOperationMetric[] }) => {
                return json.value.map((item: IOperationMetric) => {
                    return item;
                });
            });
    }

    private __getKPIOperationalMerticItemsBatched(requester: SPHttpClientBatch, props: ICSKPIProps): Promise<IOperationMetric[]> {
        return this.getKPIOperationalMertic(props);
    }
    public getKPIOperationalMertic(props: ICSKPIProps): Promise<IOperationMetric[]> {

        return (Promise.all([this.getKPIMatric(), this._getKPIOperationalMertic(this._webpartContext.spHttpClient, props)])
            .then((arr) => {
                let items: IOperationMetric[] = [];
                if (arr[1].length > 0) {

                    arr[0].map((innerVal, index) => {
                        let item: IOperationMetric;
                        let outerVal: number = lodash.findIndex(arr[1], (i) => {                           
                            return i["KPITarget"].ID == innerVal["ID"];
                        });
                        if (outerVal !== -1) {
                            item = this._buildOperationMetricItem(arr[1][outerVal], innerVal);
                        }
                        else {
                            item = this._buildBlankOperationMetricItem(outerVal, innerVal, props);
                        }
                        items.push(item);
                    });

                } else {
                    arr[0].map((innerVal, index) => {
                        let item: IOperationMetric;
                        item = this._buildBlankOperationMetricItem([], innerVal, props);
                        items.push(item);
                    });

                }
                return items;
            }));
    }

    private _AddKPIOperationMetric(batch: SPHttpClientBatch, newItem: IOperationMetric): Promise<SPHttpClientResponse> {

        const listurl = this._listurl + `GetByTitle('${this._transactionmetric}')/items`;
        const body: {} = {
            '@data.type': this._transactionmetriclistItemName,
            'Title': newItem.transactionMetricTitle,
            'Week': newItem.Week,
            'Metricvalue': newItem.CurrentWeekValue,
            'Remark': newItem.Remark,
            'LocationId': newItem.LocationId,
            'KPITargetId': newItem.KPITargetId

        };
        return batch.post(
            listurl,
            SPHttpClientBatch.configurations.v1,
            { body: JSON.stringify(body) }
        );
    }
    private _UpdateKPIOperationMetric(batch: SPHttpClientBatch, updateitem: IOperationMetric): Promise<SPHttpClientResponse> {
     
        const listurl = this._listurl + `GetByTitle('${this._transactionmetric}')/items(${updateitem.transactionMetricId})`;
        const headers: Headers = new Headers();
        headers.append('If-Match', '*');
        const body: {} = {
            '@data.type': this._transactionmetriclistItemName,
            'Metricvalue': updateitem.CurrentWeekValue,
            'Remark': updateitem.Remark,
        };
        return batch.fetch(listurl,
            SPHttpClientBatch.configurations.v1,
            {
                body: JSON.stringify(body),
                headers,
                method: 'PATCH'
            }
        );
    }
    public DMLKPIOperationalMetric(items: IOperationMetric[]): Promise<any> {
        const batch: SPHttpClientBatch = this._webpartContext.spHttpClient.beginBatch();
        const batchPromises: Promise<{}>[] = [];        
        items.map((val: IOperationMetric) => {
            if (val.status == "save") {
                batchPromises.push(
                    this._AddKPIOperationMetric(batch, val)
                );
            }else{
                batchPromises.push(
                    this._UpdateKPIOperationMetric(batch,val)
                );

            }
        });
        batchPromises.push(this.__getKPIOperationalMerticItemsBatched(batch, {
            location:{name:items[0]["LocationTitle"], id:items[0]["LocationID"]} ,
             week: items[0]["Week"], year: items[0]["transactionMetricTitle"]
        }));
        return this._resolveBatch_OM(batch, batchPromises);
    }

    private _buildBlankOperationMetricItem(outerVal: any, innerVal: any, props: ICSKPIProps): IOperationMetric {
        return {
            CurrentWeekValue: 0,
            KPITargetId: innerVal["ID"],
            KPITargetTitle: "",
            Remark: "",
            transactionMetricId: 0,
            transactionMetricTitle: props.year,
            Week: props.week,
            LocationId: props.location.id,
            LocationTitle:props.location.name,
            status: "save",

            Title: innerVal["KPI"].Title,
            KPIID: innerVal["KPI"].ID,
            KPIMatrixID: innerVal["ID"],
            KPITargetConfig: innerVal["Configtype"],

            Metric: innerVal["KPI"].Metric,
            OperationAreaID: innerVal["Operationarea"].ID,
            OperationAreaTitle: innerVal["Operationarea"].Title,
            Sequence: innerVal["KPI"].Sequence,
            Target: innerVal["Title"]
        };
    }
    private _buildOperationMetricItem(outerVal: any, innerVal: any): IOperationMetric {
     
        return {
            CurrentWeekValue: outerVal["Metricvalue"],
            KPITargetId: outerVal["KPITarget"].ID,
            KPITargetTitle: outerVal["KPITarget"].Title,
            Remark: outerVal["Remark"],
            transactionMetricId: outerVal["ID"],
            transactionMetricTitle: outerVal["Title"],
            Week: outerVal["Week"],
            LocationId: outerVal["Location"].ID,
            LocationTitle: outerVal["Location"].Title,
            status: "udpate",

            Title: innerVal["KPI"].Title,
            KPIID: innerVal["KPI"].ID,
            KPIMatrixID: innerVal["ID"],
            KPITargetConfig: innerVal["Configtype"],

            Metric: innerVal["KPI"].Metric,
            OperationAreaID: innerVal["Operationarea"].ID,
            OperationAreaTitle: innerVal["Operationarea"].Title,
            Sequence: innerVal["KPI"].Sequence,
            Target: innerVal["Title"]
        };
    }
    private _resolveBatch_OM(batch: SPHttpClientBatch, promises: Promise<{}>[]): Promise<IOperationMetric[]> {
        return batch.execute()
            .then(() => {
                return Promise.all(promises);
            }).then((values: any) => {
                return Promise.resolve(values[values.length - 1]);
            }).catch((ex) => {
                throw ex;
            });
    }
    public getKPIMatric(): Promise<IKPIItem[]> {
        return this._getKpiMatric(this._webpartContext.spHttpClient);
    }
    //#endregion

    public getLocation(): Promise<any[]> {
        let listurl = `${this._webpartContext.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Location')/items`;
        const querystring = `?$Select=ID,Title`;
        const queryUrl = listurl + querystring;
        return this._webpartContext.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            })
            .then((json: { value: any[] }) => {
                return json.value;
            });
    }


}