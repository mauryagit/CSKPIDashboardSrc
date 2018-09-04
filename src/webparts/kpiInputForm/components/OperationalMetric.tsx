import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import { ILocationInventoryProperty } from './LocationInventory';
import { extend } from '@microsoft/sp-lodash-subset';
import { IKPIInputFormDataProvider } from '../service/DataProvider/IKPIInputFormDataProvider';
export class OperationalMetric extends React.Component<ILocationInventoryProperty, {}>{
    private _dataProvider: IKPIInputFormDataProvider;
    constructor(props: ILocationInventoryProperty) {
        super(props);
        //this._dataProvider=this.props.dataprovider;
    }
    public render() {
        var $this = this;

        return (
            <div className="container ">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Operational Metrics</legend>
                    <table className="table table-hover">
                        <thead> <tr>
                            <th>Area Of Operation</th>
                            <th>SN</th>
                            <th>KPI</th>
                            <th>Metric</th>
                            <th>Target</th>
                            <th>Current Week</th>
                            <th>YTD</th>
                            <th>Remark</th>
                        </tr>
                        </thead>
                        <tbody>
                            {$this.props.items.map((val, index) => {
                                console.log(val);
                                return (
                                    <tr key={val.KPIID}>
                                        <td id="operationarea" data-id={val.KPIID} data-kpimatirxid={val.KPIMatrixID} data-operationareaID={val.OperationAreaID} >
                                            {val.OperationAreaTitle}
                                        </td>
                                        <td id="sequence" data-name="order">
                                            {val.Sequence}
                                        </td>
                                        <td id="kpititle" data-id={val.ID} data-name="Title">
                                            {val.Title}
                                        </td>
                                        <td id="metric" data-id={val.ID} data-name="Metrix">
                                            {val.Metric}
                                        </td>
                                        <td id="target" data-name="target">
                                            {val.Target}
                                        </td>
                                        <td>
                                            <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                        </td>
                                        <td></td>
                                        <td>
                                            <textarea className="form-control" name="kpitext"
                                                id="kpitext" placeholder="Enter KPI"
                                            ></textarea>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody></table>
                </fieldset>
            </div>
        );
    }
}