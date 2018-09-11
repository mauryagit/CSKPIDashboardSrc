import { IKPIInputFormDataProvider } from './DataProvider/IKPIInputFormDataProvider';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { IKPIItem, IKPILocationEventIncidentItem, ICSKPIProps } from './IKPIItem';
import * as lodash from '@microsoft/sp-lodash-subset';
import { ILocationInventory } from '../service/ILocationInventory';
import { IOperationMetric } from './IOperationMetric';
export class MockData implements IKPIInputFormDataProvider {
    private _webPartContext: IWebPartContext;
    private weekTargetList: IKPIItem[] = [];
    private weekEventIncident: IKPILocationEventIncidentItem[] = [];
    private weekLocationInventory: ILocationInventory[] = [];

    private weekOperationMetric: IOperationMetric[] = [];

    constructor() {
        let items: any = this.getDummyKpiMatriclist();
        items.d.results.map((val, index) => {

            this.AddIKPIItem({
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

        let incidentItem: any = this.getDummyLocationEventIncidentlist();
        incidentItem.d.results.map((val, index) => {
            this.AddEventIncident({
                EventIncidentID: val["ID"],
                Comment: val["Comment"],
                IncidentType: val["Commenttype"],
                Week: "1",
                Year: "2018",
                LocationTitle: val["Location"].Title,
                LocationID: val["Location"].ID
            });
        });

        let locationInventoryItem: any = this.getDummyLocationInventorylist();
        locationInventoryItem.d.results.map((val, index) => {

            this.AddLocationInventory({
                Areainacres: val["Areainacres"],
                Builtupofficespacearea: val["Builtupofficespacearea"],
                Cabininventory: val["Cabininventory"],
                Cabinoccupied: val["Cabinoccupied"],
                Cubicleinventory: val["Cubicleinventory"],
                Cubicleoccupied: val["Cubicleoccupied"],
                Dailybuses: val["Dailybuses"],
                Employee: val["Employee"],
                GETaccommodation: val["GETaccommodation"],
                GHtransitaccommodation: val["GHtransitaccommodation"],
                ID: val["ID"],
                LocationId: val["Location"].ID,
                LocationTitle: val["Location"].Title,
                Mealserved: val["Mealserved"],
                Monthlyhirecar: val["Monthlyhirecar"],
                Title: val["Title"],
                Totalstaff: val["Totalstaff"],
                Townshipaccommodation: val["Townshipaccommodation"],
                Week: val["Week"]
            });
        });

        let opreationMetric = this.getDummyKPIMatircCurrentWeekData();
        opreationMetric.d.results.map((outerVal, i) => {
            items.d.results.map((innerVal, index) => {
                let item: IOperationMetric;
                if (outerVal["KPITarget"].ID == innerVal["ID"]) {
                    item = {
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
                } else {
                    item = {
                        CurrentWeekValue: 0,
                        KPITargetId: 0,
                        KPITargetTitle: "",
                        Remark: "",
                        transactionMetricId: this.weekOperationMetric.length,
                        transactionMetricTitle: "",
                        Week: "",
                        LocationId: 0,
                        LocationTitle: "",
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
                this.AddKPIOprationMetric(item);
            });
        });
    }

    private AddKPIOprationMetric(item: IOperationMetric): void {
        this.weekOperationMetric.push({
            CurrentWeekValue: item.CurrentWeekValue,
            KPIID: item.KPIID,
            KPIMatrixID: item.KPIMatrixID,
            KPITargetConfig: item.KPITargetConfig,
            KPITargetId: item.KPITargetId,
            KPITargetTitle: item.KPITargetTitle,
            LocationId: item.LocationId,
            LocationTitle: item.LocationTitle,
            status: item.status,
            Metric: item.Metric,
            OperationAreaID: item.OperationAreaID,
            OperationAreaTitle: item.OperationAreaTitle,
            Remark: item.Remark,
            Sequence: item.Sequence,
            Target: item.Target,
            Title: item.Title,
            transactionMetricId: item.transactionMetricId,
            transactionMetricTitle: item.transactionMetricTitle,
            Week: item.Week
        });
    }

    private AddIKPIItem(item: IKPIItem): void {
        this.weekTargetList.push({
            KPIID: (item.KPIID !== 0 ? item.KPIID : this.weekTargetList.length + 1),
            KPITargetConfig: item.KPITargetConfig,
            Metric: item.Metric,
            Sequence: item.Sequence,
            Target: item.Target,
            Title: item.Title,
            OperationAreaID: item.OperationAreaID,
            OperationAreaTitle: item.OperationAreaTitle,
            KPIMatrixID: item.KPIMatrixID
        });
    }

    private AddEventIncident(item: IKPILocationEventIncidentItem): void {
        this.weekEventIncident.push({
            EventIncidentID: (item.EventIncidentID !== 0 ? item.EventIncidentID : this.weekEventIncident.length + 1),
            Comment: item.Comment,
            IncidentType: item.IncidentType,
            Week: item.Week,
            Year: item.Year,
            LocationTitle: item.LocationTitle,
            LocationID: item.LocationID
        });
    }

    private AddLocationInventory(item: ILocationInventory): void {
        this.weekLocationInventory.push({
            Areainacres: item.Areainacres,
            Builtupofficespacearea: item.Builtupofficespacearea,
            Cabininventory: item.Cabininventory,
            Cabinoccupied: item.Cabinoccupied,
            Cubicleinventory: item.Cubicleinventory,
            Cubicleoccupied: item.Cubicleoccupied,
            Dailybuses: item.Dailybuses,
            Employee: item.Employee,
            GETaccommodation: item.GETaccommodation,
            GHtransitaccommodation: item.GHtransitaccommodation,
            ID: item.ID,
            LocationId: item.LocationId,
            LocationTitle: item.LocationTitle,
            Mealserved: item.Mealserved,
            Monthlyhirecar: item.Monthlyhirecar,
            Title: item.Title,
            Totalstaff: item.Totalstaff,
            Townshipaccommodation: item.Townshipaccommodation,
            Week: item.Week
        });
    }
    private UpdateLocationInventory(updateditem: ILocationInventory): void {
        const index: number =
            lodash.findIndex(
                this.weekLocationInventory, (o) => {
                    return o.LocationTitle == updateditem.LocationTitle && o.Week == updateditem.Week;
                }
            );
        if (index !== -1) {
            this.weekLocationInventory[index] = updateditem;
        }
    }
    private UpdateEventIncident(updateditem: IKPILocationEventIncidentItem): void {
        const index: number =
            lodash.findIndex(
                this.weekEventIncident, (o) => { return o.EventIncidentID == updateditem.EventIncidentID; }
            );
        if (index !== -1) {
            this.weekEventIncident[index] = updateditem;
        }
    }
    private DeleteEventIncident(deleteitem: IKPILocationEventIncidentItem): void {
        this.weekEventIncident = this.weekEventIncident.filter((val: IKPILocationEventIncidentItem) => {
            return val.EventIncidentID !== deleteitem.EventIncidentID;
        });
    }
    public set webPartContext(value: IWebPartContext) {
        this._webPartContext = value;
    }
    public get webPartContext(): IWebPartContext {
        return this._webPartContext;
    }



    private getDummyKPIMatircCurrentWeekData(): any {
        return {
            "d": {
                "results": [
                    {
                        "__metadata": {
                            "id": "dd3187c7-32ae-4ecf-a1b7-7017ae123f69",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'5ed2dbc8-f092-4df6-9c39-9f1189cfa064')/Items(1)",
                            "etag": "\"1\"",
                            "type": "SP.Data.TransactionmetricListItem"
                        },
                        "Location": {
                            "__metadata": {
                                "id": "001e781e-bb16-48c1-af7a-783c604cd9e1",
                                "type": "SP.Data.LocationListItem"
                            },
                            "Title": "DMD",
                            "ID": 1
                        },
                        "KPITarget": {
                            "__metadata": {
                                "id": "f05ff97f-6ff2-4aab-ab53-03cead7f42f6",
                                "type": "SP.Data.KPITargetListItem"
                            },
                            "Title": "0",
                            "ID": 1
                        },
                        "Title": "2018",
                        "Week": "1",
                        "Metricvalue": 0,
                        "Remark": "NA"
                    }
                ]
            }
        };
    }

    private getDummyKpiMatriclist(): any {
        return {
            "d": {
                "results": [
                    {
                        "__metadata": {
                            "id": "cbe0c254-098c-4ad3-a79a-936ea4ddef9f",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'277b7b53-b034-4681-844e-20f91e15dc2e')/Items(1)",
                            "etag": "\"10\"",
                            "type": "SP.Data.KPITargetListItem"
                        },
                        "Operationarea": {
                            "__metadata": {
                                "id": "8ee8bc57-003a-4405-a7ed-3c0d49ee1e77",
                                "type": "SP.Data.OperationareaListItem"
                            },
                            "Title": "HSEF",
                            "ID": 1
                        },
                        "KPI": {
                            "__metadata": {
                                "id": "ee2a96a0-fe6f-44f1-866f-0f71f11054c8",
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
                    },
                    {
                        "__metadata": {
                            "id": "1f039659-c2ed-41e7-9245-a71ff796b1c2",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'277b7b53-b034-4681-844e-20f91e15dc2e')/Items(17)",
                            "etag": "\"1\"",
                            "type": "SP.Data.KPITargetListItem"
                        },
                        "Operationarea": {
                            "__metadata": {
                                "id": "6c9cb254-4453-41dc-b211-8662213491ba",
                                "type": "SP.Data.OperationareaListItem"
                            },
                            "Title": "Helpdesk Portal",
                            "ID": 3
                        },
                        "KPI": {
                            "__metadata": {
                                "id": "a185b44a-964a-405b-9d3d-8432f0e5a1f1",
                                "type": "SP.Data.KPIListItem"
                            },
                            "Title": "Complaint Management Resolution through CS Portal",
                            "Metric": "% Resolution within SLA",
                            "Sequence": 2,
                            "ID": 50
                        },
                        "Id": 17,
                        "Title": ">90",
                        "Configtype": "Generic",
                        "ID": 17
                    },
                    {
                        "__metadata": {
                            "id": "ec39d9d6-1f50-460c-b728-680f0d785d6c",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'277b7b53-b034-4681-844e-20f91e15dc2e')/Items(18)",
                            "etag": "\"1\"",
                            "type": "SP.Data.KPITargetListItem"
                        },
                        "Operationarea": {
                            "__metadata": {
                                "id": "eeb73856-3272-4457-9495-1318b346a003",
                                "type": "SP.Data.OperationareaListItem"
                            },
                            "Title": "Township / Housing",
                            "ID": 4
                        },
                        "KPI": {
                            "__metadata": {
                                "id": "72074e96-92ff-428d-9e19-de07741dea34",
                                "type": "SP.Data.KPIListItem"
                            },
                            "Title": "Complaint Management Resolution through CS Portal",
                            "Metric": "Percentage",
                            "Sequence": 3,
                            "ID": 51
                        },
                        "Id": 18,
                        "Title": ">90",
                        "Configtype": "Generic",
                        "ID": 18
                    },
                    {
                        "__metadata": {
                            "id": "09642ece-8f1a-403a-a563-f79143f26c19",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'277b7b53-b034-4681-844e-20f91e15dc2e')/Items(19)",
                            "etag": "\"1\"",
                            "type": "SP.Data.KPITargetListItem"
                        },
                        "Operationarea": {
                            "__metadata": {
                                "id": "84200a62-8b6b-45aa-ad1b-01441b239bab",
                                "type": "SP.Data.OperationareaListItem"
                            },
                            "Title": "Guest House",
                            "ID": 5
                        },
                        "KPI": {
                            "__metadata": {
                                "id": "77c9d1b5-04e9-4846-99b5-868cd8058411",
                                "type": "SP.Data.KPIListItem"
                            },
                            "Title": "Needs improvement points reported through checkout survey.",
                            "Metric": "Percentage",
                            "Sequence": 4,
                            "ID": 52
                        },
                        "Id": 19,
                        "Title": "<5",
                        "Configtype": "Generic",
                        "ID": 19
                    }
                ]
            }
        };
    }

    private getDummyLocationEventIncidentlist(): any {
        return {
            "d": {
                "results": [
                    {
                        "__metadata": {
                            "id": "ba09f652-5bbc-46e9-b083-17c21d0b93ce",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'332ed641-f740-46a0-9d90-3223062405db')/Items(1)",
                            "etag": "\"1\"",
                            "type": "SP.Data.LocationEventIncidentListItem"
                        },
                        "Location": {
                            "__metadata": {
                                "id": "cdfa98a4-16f0-47b4-8747-b7af3c8b2445",
                                "type": "SP.Data.LocationListItem"
                            },
                            "Title": "DMD",
                            "ID": 1
                        },
                        "Id": 1,
                        "Title": "2018",
                        "Commenttype": "Event",
                        "Comment": "Some thing coming up this Diwali",
                        "ID": 1
                    },
                    {
                        "__metadata": {
                            "id": "00f52846-4660-4555-aea8-250fa307cedd",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'332ed641-f740-46a0-9d90-3223062405db')/Items(2)",
                            "etag": "\"1\"",
                            "type": "SP.Data.LocationEventIncidentListItem"
                        },
                        "Location": {
                            "__metadata": {
                                "id": "bf9c0bd0-e722-4cfb-af63-819e8208dfa5",
                                "type": "SP.Data.LocationListItem"
                            },
                            "Title": "DMD",
                            "ID": 1
                        },
                        "Id": 2,
                        "Title": "2018",
                        "Commenttype": "Incident",
                        "Comment": "Fire Incident in the premise, But every thing under control.",
                        "ID": 2
                    },
                    {
                        "__metadata": {
                            "id": "d373ca35-2f20-4d51-934a-dc4138ed9c7b",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'332ed641-f740-46a0-9d90-3223062405db')/Items(3)",
                            "etag": "\"1\"",
                            "type": "SP.Data.LocationEventIncidentListItem"
                        },
                        "Location": {
                            "__metadata": {
                                "id": "7b44bcf3-ae56-4ee0-84cb-3b2672a4d38a",
                                "type": "SP.Data.LocationListItem"
                            },
                            "Title": "BMD",
                            "ID": 9
                        },
                        "Id": 3,
                        "Title": "2018",
                        "Commenttype": "Event",
                        "Comment": "Some thing happen in another location",
                        "ID": 3
                    }
                ]
            }
        };
    }

    private getDummyLocationInventorylist(): any {

        //$Select=Title,Week,Areainacres,Builtupofficespacearea,Cubicleinventory,Cabininventory,Cubicleoccupied,Cabinoccupied,Employee,            Totalstaff,Townshipaccommodation,GHtransitaccommodation,GETaccommodation,Mealserved,Dailybuses,Monthlyhirecar,ID,Location/ID,Location/Title&$expand=Location
        return {
            "d": {
                "results": [
                    {
                        "__metadata": {
                            "id": "785be541-a722-49e8-b7eb-183c05b57bc3",
                            "uri": "http://sidcitspqaapp02:8080/sites/CSKPI/_api/Web/Lists(guid'1fd018e9-b4fe-4fa5-a832-6975c3ca1b6d')/Items(1)",
                            "etag": "\"2\"",
                            "type": "SP.Data.LocationInventoryListItem"
                        },
                        "Location": {
                            "__metadata": {
                                "id": "02201a56-1956-4dba-9128-54adeb8ab2a1",
                                "type": "SP.Data.LocationListItem"
                            },
                            "ID": 1,
                            "Title": "DMD"
                        },
                        "Id": 1,
                        "Title": "2018",
                        "Week": "27",
                        "Areainacres": "1620",
                        "Builtupofficespacearea": "262000",
                        "Cubicleinventory": "353",
                        "Cabininventory": "90",
                        "Cubicleoccupied": "353",
                        "Cabinoccupied": "88",
                        "Employee": "2017",
                        "Totalstaff": "5278",
                        "Townshipaccommodation": "1280",
                        "GHtransitaccommodation": "82",
                        "GETaccommodation": "95",
                        "Mealserved": "1337",
                        "Dailybuses": "25",
                        "Monthlyhirecar": "42",
                        "ID": 1
                    }
                ]
            }
        };
    }

    public DMLKPIOperationalMetric(items: IOperationMetric[]): Promise<any> {

        items.map((val: IOperationMetric) => {
            /* if(val.status =="save"){
             //this.AddKPIOprationMetric(val);
             this.weekOperationMetric.push(val);
             }else{
                 this.UpdateKPIOperationMetric(val);
             }*/
            this.UpdateKPIOperationMetric(val);
        });
        return new Promise<any>((resolve) => {
            setTimeout(() => {
                resolve(items);
            }, 500);
        });


    }

    private UpdateKPIOperationMetric(item: IOperationMetric): void {
        const index: number =
            lodash.findIndex(
                this.weekOperationMetric, (o) => { return o.transactionMetricId == item.transactionMetricId; }
            );
        if (index !== -1) {
            this.weekOperationMetric[index] = item;
        }
    }

    public AddKPIEventIncident(newItem: IKPILocationEventIncidentItem): Promise<IKPILocationEventIncidentItem[]> {
        this.AddEventIncident(newItem);
        return this.getKPIEventIncidentForTheWeekOfLocation(
        { location:{name:newItem.LocationTitle, id:newItem.LocationID},
        week:newItem.Week,
         year:newItem.Year
        }       
    );
    }
    public UpdateKPIEventIncident(updateitem: IKPILocationEventIncidentItem): Promise<IKPILocationEventIncidentItem[]> {
        this.UpdateEventIncident(updateitem);
        return this.getKPIEventIncidentForTheWeekOfLocation({
            location:{name:updateitem.LocationTitle, id:updateitem.LocationID},
            week: updateitem.Week, year: updateitem.Year
        });
    }

    public DeleteKPIEventIncident(updateitem: IKPILocationEventIncidentItem): Promise<IKPILocationEventIncidentItem[]> {

        this.DeleteEventIncident(updateitem);
        return this.getKPIEventIncidentForTheWeekOfLocation(
        {
            location: { id: updateitem.LocationID, name: updateitem.LocationTitle },
            week: updateitem.Week, year: updateitem.Year
        }
    );
    }

    public AddKPILocationInventory(newItem: ILocationInventory): Promise<ILocationInventory> {
        this.AddLocationInventory(newItem);
        return this.getKPILocationInventoryForTheWeekOfLocation(
        {
            location: { id: newItem.LocationId, name: newItem.LocationTitle },
            week: newItem.Week, year: ''
        }
    );
    }
    public UpdateKPILocationInventorys(updateItem: ILocationInventory): void {

    }
    public UpdateKPILocationInventory(updateItem: ILocationInventory): Promise<ILocationInventory> {
        this.UpdateLocationInventory(updateItem);
        return this.getKPILocationInventoryForTheWeekOfLocation(
            {
                location: { id: updateItem.LocationId, name: updateItem.LocationTitle },
                week: updateItem.Week, year: ''
            });
    }
    public getKPIEventIncidentForTheWeekOfLocation(locationName: ICSKPIProps): Promise<IKPILocationEventIncidentItem[]> {
        let item = this.weekEventIncident.filter((val, index) => {
            return val["LocationTitle"] == locationName.location.name;
        });
        return new Promise<IKPILocationEventIncidentItem[]>((resolve) => {
            setTimeout(() => {
                resolve(item);
            }, 500);
        });
    }
    public getKPIMatric(): Promise<IKPIItem[]> {
        let item = this.weekTargetList;
        return new Promise<IKPIItem[]>((resolve) => {
            setTimeout(() => {
                resolve(item);
            }, 500);
        });
    }

    public getKPILocationInventoryForTheWeekOfLocation(locationName: ICSKPIProps): Promise<ILocationInventory> {
        let item: ILocationInventory;
        const index: number =
            lodash.findIndex(
                this.weekLocationInventory, (o) => { return o.LocationTitle == locationName.location.name; }
            );
        if (index !== -1) {
            item = this.weekLocationInventory[index];
        }
        /*      let item = this.weekLocationInventory.filter((val, index) => {
            return val["LocationTitle"] == locationName;
        });*/
        return new Promise<ILocationInventory>((resolve) => {
            setTimeout(() => {
                resolve(item);
            }, 500);
        });
    }

    public getKPIOperationalMertic(locationName: ICSKPIProps): Promise<IOperationMetric[]> {
        let item = this.weekOperationMetric;
        return new Promise<IOperationMetric[]>((resolve) => {
            setTimeout(() => {
                resolve(item);
            }, 500);
        });
    }

    public getLocation(): Promise<any[]> {
        let location: any = this.getList();
        return new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve(location);
            }, 500);
        });

    }

    public getList(): any {
        return [{ "Title": "DMD", "ID": 1 }, { "Title": "SMD", "ID": 2 }];

    }
}


