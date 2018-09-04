import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import {ICommonProps} from './IKpiInputFormProps';

export interface ILocationInventoryProperty extends ICommonProps {
   
}
export class LocationInvetory extends React.Component<ILocationInventoryProperty, {}>{

    constructor(props: ILocationInventoryProperty) {
        super(props);
    }

    
    public render() {
        return (
            <div className="container ">
                Location Inventory : {JSON.stringify(this.props)}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Location Overview</legend>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Area In Acres</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Built-up Office Space Area</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Office Space Inventory</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Office Space Occupied</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">RIL Employees </span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Total Staff (Including Contract Staff)</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Township Accommodations</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            </div>
                            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                    <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">GET Accommodations</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            </div>

                            
                        
                    </div>
                    <div className="row">
                    <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                    <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">GH/Transit Accommodations</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            </div>
                    
                            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Meals Served</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            </div>
                    </div>
                    <div className="row">
                        
                            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Daily Buses</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            </div>
                            <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Monthly Hired Cars</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                            </div>
                        
                    </div>
                </fieldset>
            </div>
        );
    }

}