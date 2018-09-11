import * as React from 'react';
import styles from './KpiMetrics.module.scss';
import { IKpiMetricsProps } from './IKpiMetricsProps';
import * as lodash from '@microsoft/sp-lodash-subset';
import { KPIMartixlist } from './KpiMatricList';
import { IKPIMatrixDataProvider } from '../service/DataProvider/IKPIMatrixDataProvider';
import { IIteamKPI } from '../service/IItemKPI';
import { JsonUtilities } from '@microsoft/sp-core-library';
export interface IKPIMatrixState {
  items: any[];
  newKPI: IIteamKPI;
  oprationareas: any[];
}
export default class KpiMetrics extends React.Component<IKpiMetricsProps, IKPIMatrixState> {
  private _dataProvider: IKPIMatrixDataProvider;
  private oldKPIMatrixvalue: IIteamKPI;
  private command: string = "submit";
  constructor(props: IKpiMetricsProps) {
    super(props);
    this._dataProvider = this.props.dataprovider;
    this._loadKPIMatrix();
    this.state = {
      items: [],
      newKPI: { KPIID: 0, Title: "", Sequence: 0, Metric: "", OperationAreaTitle: "", OperationAreaID: 0, KPITargetConfig: "Generic", Target: "", KPIMatrixID: 0 },
      oprationareas: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  protected handleChange(e: any): void {
    var tar = e.target;
    var val = e.target.value;
    switch (e.target.id) {
      case "kpioperationarea":
        this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
          previousState.newKPI.OperationAreaTitle = val;
          previousState.newKPI.OperationAreaID = parseInt(tar.selectedOptions[0].getAttribute("id"));
          return previousState;
        });
        break;
      case "kpiorder":
        if (!e.target.validity.valid) {
          this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
            previousState.newKPI.Sequence = "";
            return previousState;
          });
        } else {
          this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
            previousState.newKPI.Sequence = (val.length > 0 ? parseInt(val) : val);
            return previousState;
          });
        }
        break;
      case "kpitext":
        this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
          previousState.newKPI.Title = val;
          return previousState;
        });
        break;
      case "kpimatrix":
        this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
          previousState.newKPI.Metric = val;
          return previousState;
        });
        break;
      case "kpitarget":
        this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
          previousState.newKPI.Target = val;
          return previousState;
        });
        break;
    }
  }

  private _loadKPIMatrix(): Promise<IIteamKPI[]> {
    return this._dataProvider.getKPIMatrixList()
      .then((items: IIteamKPI[]) => {
        this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
          previousState.items = items;
          return previousState;
        });
        return items;
      });
  }
  protected handleEdit(e: any): void {
    this.oldKPIMatrixvalue = e;
    this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
      previousState.newKPI = e;
      return previousState;
    });
    this.command = "update";
  }
  protected validate(): boolean {
    let returnval: boolean = false;
    let title = this.state.newKPI.Title;
    let Sequence = this.state.newKPI.Sequence;
    let target = this.state.newKPI.Target;
    let operation = this.state.newKPI.OperationAreaID;
    let metric = this.state.newKPI.Metric;
    if (this.checkRequired(title)) {
      if (this.checkRequired(Sequence.toString())) {
        if (this.checkRequired(target.toString())) {
          if (this.checkRequired(operation.toString())) {
            if (this.checkRequired(metric.toString())) {
              returnval = true;
            }
          }
        }
      }
    }
    return returnval;
  }
  protected checkRequired(val: string): boolean {
    return val.length > 0;
  }
  protected addKPIMatrix(): void {
    let newItem: any = this.state.newKPI;
    if (this.checkDuplicate) {
      this._dataProvider.createKPIMatrix(newItem)
        .then((resolve) => {
          this._loadKPIMatrix(); //Not an optimise way
          this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
            previousState.items = resolve;
            return previousState;
          });
        });
    }
  }

  protected updateKPIMatrix(): void {
    let previousitemvalue: any = this.oldKPIMatrixvalue;
    let updateoperationvalue: IIteamKPI = {
      KPIID: this.state.newKPI.KPIID,
      Title: this.state.newKPI.Title,
      Sequence: this.state.newKPI.Sequence,
      Metric: this.state.newKPI.Metric,
      OperationAreaID: this.state.newKPI.OperationAreaID,
      OperationAreaTitle: this.state.newKPI.OperationAreaTitle,
      KPITargetConfig: this.state.newKPI.KPITargetConfig,
      Target: this.state.newKPI.Target,
      KPIMatrixID: this.state.newKPI.KPIMatrixID

    };
    if (this.checkDuplicate) {
      this._dataProvider.updateKPIMatrix(updateoperationvalue)
        .then((resolve) => {
          this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
            previousState.items = resolve;
            return previousState;
          });
        }
          , (reject) => {
            console.log(reject);
          });
    }
  }
  private checkDuplicate(): boolean {
    let bool: boolean = false;
    const index: number = lodash.findIndex(this.state.items, (item) => {
      return item.Title == this.state.newKPI.Title;
    });
    if (index == -1) {
      bool = true;
    }
    return bool;
  }

  protected handleSubmit(e: any): void {
    e.preventDefault();
    let commandvalue: string = this.command;
    switch (commandvalue) {
      case "submit":
        this.addKPIMatrix();
        break;
      case "update":
        this.updateKPIMatrix();
        break;
    }
    this.resetControl();
  }
  protected resetControl(): void {
    this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
      previousState.newKPI = { KPIID: 0, Title: "", Sequence: 0, Metric: "", OperationAreaTitle: "", OperationAreaID: 0, KPITargetConfig: "Generic", Target: "", KPIMatrixID: 0 };
      return previousState;
    });
    this.command = "submit";
  }
  protected handleDelete(e: IIteamKPI): void {
    this.deleteKPIMatrix(e);
  }

  private _getOperationArea() {
    this._dataProvider.getOperationArea()
      .then((res: any[]) => {
        //this.properties.oprationarea=JSON.stringify(res);
        this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
          previousState.oprationareas = res;
          return previousState;
        });
      });
  }
  public componentDidMount() {
    this._getOperationArea();
  }
  private deleteKPIMatrix(item: IIteamKPI): void {
    this._dataProvider.deleteKPIMatrix(item)
      .then((resolve) => {
        this.setState((previousState: IKPIMatrixState, props: IKpiMetricsProps): IKPIMatrixState => {
          previousState.items = resolve;
          return previousState;
        });
      }, (reject) => {
        console.log(reject);
      });
  }
  public render(): React.ReactElement<IKpiMetricsProps> {
    const isActive = this.validate();
    return (
      <div className="container">
        <p className="h4 mb-4"  >Add KPI Information</p>
        <form onSubmit={this.handleSubmit}>

          <div className="row">
            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6" style={styles}>
              <label htmlFor="kpioperationarea">
                Select Operation Area
            </label>
              <select id="kpioperationarea" className="form-control" value={this.state.newKPI.OperationAreaTitle} onChange={this.handleChange} >
                <option id="0">--Select--</option>
                {this.state.oprationareas.map((item) => {
                  return <option id={item["ID"]} key={item["ID"]}>{item["Title"]}</option>;
                })}
              </select>
            </div>
            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6" style={styles}>
              <label htmlFor="kpiorder">Enter Sequence</label>
              <input
                type="text"
                id="kpiorder"
                name="kpiorder"
                className="form-control mb-4"
                pattern="[0-9]*"
                placeholder="Only Number Allowed"
                value={this.state.newKPI.Sequence}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-xs-10 col-sm-12 col-md-12 col-lg-12" style={styles}>
              <label htmlFor="kpitext">Enter KPI</label>
              <textarea className="form-control" name="kpitext"
                value={this.state.newKPI.Title} id="kpitext" placeholder="Enter KPI"
                onChange={this.handleChange}></textarea>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6" style={styles}>
              <label htmlFor="kpimatrix">
                Select KPI Matrix
            </label>
              <select id="kpimatrix" className="form-control" value={this.state.newKPI.Metric} onChange={this.handleChange}>
                <option id="0">--Select--</option>
                <option id="1">Number</option>
                <option id="2">Percentage</option>
                <option id="3">% Resolution within SLA </option>
                <option id="4">% Schedule Compliance</option>
                <option id="5">Deviation Instances</option>
                <option id="6">Number of Incident</option>
                <option id="7">% Score</option>
              </select>
            </div>
            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6" style={styles}>
              <label htmlFor="kpitarget">Enter Target</label>
              <input
                type="text"
                id="kpitarget"
                name="kpitarget"
                className="form-control mb-4"
                placeholder="Enter Target"
                value={this.state.newKPI.Target}
                onChange={this.handleChange}
              />
            </div>

          </div>
          <button className="btn btn-info  btn-block "
            type="submit" data-command={this.command} disabled={!isActive}
          >
            Save
          </button>
          <KPIMartixlist items={this.state.items} edit={this.handleEdit} delete={this.handleDelete} />
        </form>
      </div>

    );
  }
}
