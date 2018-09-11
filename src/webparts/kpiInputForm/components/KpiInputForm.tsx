import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import { IKpiInputFormProps } from './IKpiInputFormProps';
import * as lodash from '@microsoft/sp-lodash-subset';
import { IKpiInputFormState } from './IKpiInputFormState';
import { LocationInvetory } from './LocationInventory';
import { OperationalMetric } from './OperationalMetric';
import { LocationEventFeedback } from './LocationEventFeedback';
import { IKPIInputFormDataProvider } from '../service/DataProvider/IKPIInputFormDataProvider';
import { IKPIItem, IKPILocationEventIncidentItem } from '../service/IKPIItem';
import { ILocationInventory } from '../service/ILocationInventory';
import { IOperationMetric } from '../service/IOperationMetric';
export default class KpiInputForm extends React.Component<IKpiInputFormProps, IKpiInputFormState> {

  private _dataProvider: IKPIInputFormDataProvider;
  private _locationinventory: ILocationInventory = {
    Areainacres: "",
    Builtupofficespacearea: "",
    Cabininventory: "", Cabinoccupied: "",
    Cubicleinventory: "", Cubicleoccupied: "",
    Dailybuses: "", Employee: "",
    GETaccommodation: "", GHtransitaccommodation: "",
    ID: 0, LocationId: 0, LocationTitle: "", Mealserved: "",
    Monthlyhirecar: "", Title: "", Totalstaff: "", Townshipaccommodation: "",
    Week: ""
  };
  constructor(props: IKpiInputFormProps) {
    super(props);
    this.state = {
      location: { id: 0, name: "" },
      locationList: [],
      week: "",
      operationMetric: [],
      locationInventoryrefresh: this._locationinventory,
      eventIncident: [],
      newEventIncident: [],
      newOperationMetric: [],
      weekDateRange: ""
    };
    this._dataProvider = this.props.dataprovider;
    this._loadKPIEventIncident();

    this.handleAddEventIncident = this.handleAddEventIncident.bind(this);
    this.handleUpdateEventIncident = this.handleUpdateEventIncident.bind(this);
    this.handleDeleteEventIncident = this.handleDeleteEventIncident.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  public componentDidMount() {
    this._getLocationList();
  }

  private _getLocationList() {
    this._dataProvider.getLocation()
      .then((res: any[]) => {
        //  this.properties.location=JSON.stringify(res);      
        this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
          previousState.locationList = res;
          return previousState;
        });
      });
  }

  private _loadKPIEventIncident(): Promise<IKPILocationEventIncidentItem[]> {
    return this._dataProvider.getKPIEventIncidentForTheWeekOfLocation({
      location: this.state.location,
      week: this.state.week, year: this.props.year
    })
      .then((items: IKPILocationEventIncidentItem[]) => {
        this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
          previousState.eventIncident = items;
          return previousState;
        });
        return items;
      });
  }

  protected handleChange(e): void {

    let target = e.target;
    this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
      if (target["name"] === "week") {
        previousState.week = target.value;
        previousState.weekDateRange = this.getDateRangeOfWeek(target.value);
      } else {
        previousState.location.name = target.value;
        previousState.location.id = target.options[target.selectedIndex].id;
      }
      return previousState;
    }, () => {
      this.reloadKPIEventIncident();
    });

  }

  private reloadKPIEventIncident() {
    if (this.state.location.name !== "" && this.state.week !== "") {
      this._loadKPIEventIncident();
      /* this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
        previousState.locationInventoryrefresh= !(this.state.locationInventoryrefresh);
         return previousState;
       });*/
    }
  }


  private _getWeek(d: Date): number {
    let target: any = new Date(d.valueOf());
    //var dayNr = (this.getDay() + 6) % 7;
    var dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
  }
  private getDateRangeOfWeek(weekNo): string {
    var d1 = new Date();
    let numOfdaysPastSinceLastMonday: any = (d1.getDay() - 1);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    let weekNoToday = this._getWeek(d1);
    let weeksInTheFuture: any = (weekNo - weekNoToday);
    d1.setDate(d1.getDate() + (7 * weeksInTheFuture));
    let rangeIsFrom: any = (d1.getMonth() + 1) + "-" + d1.getDate() + "-" + d1.getFullYear();
    d1.setDate(d1.getDate() + 6);
    let rangeIsTo: any = (d1.getMonth() + 1) + "-" + d1.getDate() + "-" + d1.getFullYear();
    return rangeIsFrom + " to " + rangeIsTo;
  };

  protected handleAddEventIncident(e: IKPILocationEventIncidentItem): void {

    let newItem: IKPILocationEventIncidentItem = e;

    this._dataProvider.AddKPIEventIncident(newItem)
      .then((resolve) => {
        this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
          previousState.eventIncident = resolve;
          return previousState;
        });
      });

  }
  protected handleUpdateEventIncident(e: IKPILocationEventIncidentItem): void {

    let udpatedItem: IKPILocationEventIncidentItem = e;
    this._dataProvider.UpdateKPIEventIncident(udpatedItem)
      .then((resolve) => {
        this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
          previousState.eventIncident = resolve;
          return previousState;
        });
      });
  }
  protected handleDeleteEventIncident(e: IKPILocationEventIncidentItem): void {

    let deletedItem: IKPILocationEventIncidentItem = e;
    this._dataProvider.DeleteKPIEventIncident(deletedItem)
      .then((resolve) => {
        this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
          previousState.eventIncident = resolve;
          return previousState;
        });
      });
  }
  public render(): React.ReactElement<IKpiInputFormProps> {

    return (
      <div className={styles.kpiInputForm}>
        <fieldset className={styles["fieldset-scheduler-border"]}>
          <legend className={styles["legend-scheduler-border"]}>Add Details For Date :         {this.state.weekDateRange}</legend>
          <div className="row">
            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
              <div className="input-group input-group-sm mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-sm">Location</span>
                </div>

                <select id="location" className="form-control" name="location" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={this.state.location.name}
                  onChange={this.handleChange} >
                  <option id="0">--Select--</option>
                  {this.state.locationList.map((item) => {
                    return <option id={item["ID"]} key={item["ID"]} >{item["Title"]}</option>;
                  })}

                </select>
              </div>
            </div>
            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6" style={styles}>
              <div className="input-group input-group-sm mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-sm">Week</span>
                </div>
                <select id="week" name="week" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={this.state.week}
                  onChange={this.handleChange}   >
                  <option id="0" >--Select--</option>
                  {Array.apply(null, { length: 52 }).map((e, i) => (
                    <option id={i + 1} key={i + 1} value={i + 1}>Week{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
          <div className="row">
            <LocationInvetory location={this.state.location} week={this.state.week} year={this.props.year}
              locationInventoryrefresh={this.state.locationInventoryrefresh}
              dataprovider={this._dataProvider} />

            <OperationalMetric location={this.state.location} week={this.state.week} year={this.props.year}
              items={this.state.operationMetric} dataprovider={this._dataProvider} />

            <LocationEventFeedback location={this.state.location} week={this.state.week} year={this.props.year} informationType="Event" onAdd={this.handleAddEventIncident}
              onUpdate={this.handleUpdateEventIncident} onDelete={this.handleDeleteEventIncident}
              items={this.state.eventIncident.filter((val, index) => {
                return val["IncidentType"] == "Event";

              })} />

            <LocationEventFeedback location={this.state.location} week={this.state.week} year={this.props.year} informationType="Incident" onAdd={this.handleAddEventIncident}
              onUpdate={this.handleUpdateEventIncident} onDelete={this.handleDeleteEventIncident}
              items={this.state.eventIncident.filter((val, index) => {
                return val["IncidentType"] == "Incident";

              })} />
          </div>
        </fieldset>
      </div>
    );
  }
}