import { IKPIInputFormDataProvider } from './DataProvider/IKPIInputFormDataProvider';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { IKPIItem,IKPILocationEventIncidentItem } from './IKPIItem';

export class MockData implements IKPIInputFormDataProvider {
    private _webPartContext: IWebPartContext;
    private weekTargetList: IKPIItem[] = [];
    private weekEventIncident:IKPILocationEventIncidentItem[]=[];

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

        let incidentItem:any= this.getDummyLocationEventIncidentlist();
        incidentItem.d.results.map((val, index) => {
            this.AddEventIncident({
                EventIncidentID: val["ID"],
                Comment:val["Comment"],
                IncidentType:val["Commenttype"],
                Week:"1",
                Year:"2018",
                LocationTitle:val["Location"].Title,
                LocationID:val["Location"].ID
            });
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

    private AddEventIncident(item:IKPILocationEventIncidentItem):void{
        this.weekEventIncident.push({
            EventIncidentID: (item.EventIncidentID !== 0 ? item.EventIncidentID : this.weekEventIncident.length + 1),
            Comment:item.Comment,
            IncidentType:item.IncidentType,
            Week:item.Week,
            Year:item.Year,
            LocationTitle:item.LocationTitle,
            LocationID:item.LocationID
        });
    }
    public set webPartContext(value: IWebPartContext) {
        this._webPartContext = value;
    }
    public get webPartContext(): IWebPartContext {
        return this._webPartContext;
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
            }};
    }

    private getDummyLocationEventIncidentlist():any{
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

    public AddKPIEventIncident(newItem:IKPILocationEventIncidentItem):Promise<IKPILocationEventIncidentItem[]>{     
        this.AddEventIncident(newItem);
        return this.getKPIEventIncidentForTheWeekOfLocation(newItem.LocationTitle);
    }
    public getKPIEventIncidentForTheWeekOfLocation(locationName:string):Promise<IKPILocationEventIncidentItem[]>{
        let item= this.weekEventIncident.filter((val , index) => {
            return val["LocationTitle"] == locationName;
        });      
        return new Promise<IKPILocationEventIncidentItem[]>((resolve) => {
            setTimeout(() => {
               resolve(item); 
            }, 500);
        });
    }
    public getKPIMatric():Promise<IKPIItem[]>{
        let item = this.weekTargetList;
        return new Promise<IKPIItem[]>((resolve) => {
            setTimeout(() => {
                resolve(item);
            }, 500);
        });
    }
}


