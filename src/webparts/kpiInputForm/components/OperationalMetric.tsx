import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import { ICommonProps } from './IKpiInputFormProps';
import { IKPIInputFormDataProvider } from '../service/DataProvider/IKPIInputFormDataProvider';
import { IOperationMetric } from '../service/IOperationMetric';

export interface IOpertionalMetrixState {
    operationMetric: IOperationMetric[];
}
export interface IOpertionalMetrixProp extends ICommonProps {
    dataprovider: IKPIInputFormDataProvider;
}
export class OperationalMetric extends React.Component<IOpertionalMetrixProp, IOpertionalMetrixState>{
    private _dataProvider: IKPIInputFormDataProvider;
    private _localCheck ={week:"",year:"",location:""};
    private command: string = "save";
    constructor(props: IOpertionalMetrixProp) {
        super(props);
        this.state = { operationMetric: [] };
        this._dataProvider = this.props.dataprovider;
        this._loadKPIItems();
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    private _loadKPIItems(): Promise<IOperationMetric[]> {
        return this._dataProvider.getKPIOperationalMertic({
            location:{name:this.props.location.name, id:this.props.location.id},
             week:this.props.week,year:this.props.year})
            .then((items: IOperationMetric[]) => {            
                this.setState((previousState: IOpertionalMetrixState, props: IOpertionalMetrixProp): IOpertionalMetrixState => {
                    previousState.operationMetric = items;
                    return previousState;
                });
                return items;
            });
    }

    protected handleChange(e): void {
        let targetval = e.target.value;
        let targetattri = e.target.name;
        let idtoupdate = e.target.getAttribute("data-opid");
        this.setState((previousState: IOpertionalMetrixState, props: IOpertionalMetrixProp): IOpertionalMetrixState => {
            previousState.operationMetric.filter((val, index) => {
                if (val.KPIID == parseInt(idtoupdate)) {
                    val[targetattri] = targetval;
                }
            });
            return previousState;
        });

    }
    protected handleClick(): void {
        this._dataProvider.DMLKPIOperationalMetric(this.state.operationMetric)
        .then((res:any) => {       
            this.setState((previousState: IOpertionalMetrixState, props: IOpertionalMetrixProp): IOpertionalMetrixState => {
                previousState.operationMetric = res;
                return previousState;
            });
        });
    }
    protected  shouldComponentUpdate(nextProps){    
        if(this.props.location.name !== "" && this.props.week !=="" && this.props.year !== ""){
            if(this._localCheck["week"] !== this.props.week ||
                 this._localCheck["year"] !== this.props.year ||
                  this._localCheck["location"]  !==this.props.location.name)
            {
                this._loadKPIItems();
                this._localCheck={
                    week:this.props.week,
                    year:this.props.year,
                    location:this.props.location.name
                };
            }
        }      
       return true;
    }   
    public render() {
        var $this = this;
        const isActive = ((this.props.location.name !=="" && this.props.location.name !== '--Select--' ) && this.props.week !=="" && this.props.year !=="");
        return (
            <div className="container ">
                <fieldset className={styles["fieldset-scheduler-border"]}>
                    <legend className={styles["legend-scheduler-border"]}>Operational Metrics</legend>
                    <table className="table table-sm">
                        <thead> <tr>
                            <th>Area Of Operation</th>
                            <th >SN</th>
                            <th>KPI</th>
                            <th >Metric</th>
                            <th >Target</th>
                            <th >Current Week</th>
                            <th >YTD</th>
                            <th >Remark</th>
                        </tr>
                        </thead>
                        <tbody>
                            {$this.state.operationMetric.map((val, index) => {

                                return (
                                    <tr key={index}>
                                        <td id="operationarea" data-id={val.KPIID} data-kpimatirxid={val.KPIMatrixID} data-operationareaID={val.OperationAreaID} >
                                            {val.OperationAreaTitle}
                                        </td>
                                        <td   id="sequence" data-name="order">
                                            {val.Sequence}
                                        </td>
                                        <td  id="kpititle" data-id={val.KPIID} data-name="Title">
                                            {val.Title}
                                        </td>
                                        <td  id="metric" data-id={val.KPIID} data-name="Metrix">
                                            {val.Metric}
                                        </td>
                                        <td id="target" data-name="target">
                                            {val.Target}
                                        </td>
                                        <td >
                                            <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                                                value={val.CurrentWeekValue} onChange={this.handleChange} data-opid={val.KPIID} name="CurrentWeekValue" />
                                        </td>
                                        <td ></td>
                                        <td >
                                            <textarea className="form-control" data-opid={val.KPIID} id="Remark" aria-label="Small" placeholder="Enter Remark"
                                                value={val.Remark} onChange={this.handleChange} name="Remark"
                                            ></textarea>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody></table>
                    <button type="button" className="btn btn-default btn-sm btn-primary" disabled={!isActive}  data-command={this.command} onClick={this.handleClick}>Save</button>
                </fieldset>
            </div>
        );
    }
}