import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import { IKpiInputFormProps } from './IKpiInputFormProps';
import * as lodash from '@microsoft/sp-lodash-subset';
import {IKpiInputFormState} from './IKpiInputFormState';
import {LocationInvetory} from './LocationInventory';
import {OperationalMetric} from './OperationalMetric';
import {LocationEventFeedback} from './LocationEventFeedback';
import {IKPIInputFormDataProvider} from '../service/DataProvider/IKPIInputFormDataProvider';
import {IKPIItem,IKPILocationEventIncidentItem} from '../service/IKPIItem';
import {ILocationInventory} from '../service/ILocationInventory';
export default class KpiInputForm extends React.Component<IKpiInputFormProps, IKpiInputFormState> {

  private _dataProvider:IKPIInputFormDataProvider;
  //private _locationinventory:ILocationInventory =[];
  constructor(props:IKpiInputFormProps){
    super(props);
    this._dataProvider=this.props.dataprovider;
    this._loadKPIItems();
    this._loadKPIEventIncident();
    this.state={
      location:"",
      operationMetric:[],
      locationInventory:"",
      eventIncident:[],
      newEventIncident:[],
      newOperationMetric:[]
    };

    this.handleAddEventIncident =this.handleAddEventIncident.bind(this);
  }

  private _loadKPIItems(): Promise<IKPIItem[]> {
    return this._dataProvider.getKPIMatric()
      .then((items: IKPIItem[]) => {       
        this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {          
          previousState.operationMetric = items;
          return previousState;
        });
        return items;
      });
  }
  private _loadKPIEventIncident(): Promise<IKPILocationEventIncidentItem[]> {
    return this._dataProvider.getKPIEventIncidentForTheWeekOfLocation("DMD")
      .then((items: IKPILocationEventIncidentItem[]) => {       
        this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {          
          previousState.eventIncident = items;
          return previousState;
        });
        return items;
      });
  }

  protected handleAddEventIncident(e:IKPILocationEventIncidentItem):void{
    
    let newItem: IKPILocationEventIncidentItem = e;
    debugger;
      this._dataProvider.AddKPIEventIncident(newItem)
        .then((resolve) => {
          this.setState((previousState: IKpiInputFormState, props: IKpiInputFormProps): IKpiInputFormState => {
            previousState.eventIncident = resolve;
            return previousState;
          });
        });
    
  }
  public render(): React.ReactElement<IKpiInputFormProps> {
    return (
      <div className={ styles.kpiInputForm }>
      
       <LocationEventFeedback locationName="DMD" week="1" year="2018" informationType="Event" onAdd={this.handleAddEventIncident} items={this.state.eventIncident.filter((val,index) => {         
          return val["IncidentType"] == "Event";

       })}/>
        <LocationEventFeedback locationName="DMD" week="1" year="2018" informationType="Feedback" onAdd={this.handleAddEventIncident} items={this.state.eventIncident.filter((val,index) => {         
          return val["IncidentType"] == "Incident";

       })}/>
      
      </div>
    );
  }
}
