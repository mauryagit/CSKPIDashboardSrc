import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import {ICommonProps} from './IKpiInputFormProps';
import { extend } from '@microsoft/sp-lodash-subset';
import {IKPILocationEventIncidentItem} from '../service/IKPIItem';
export interface ILocationEventFeedbackProperty extends ICommonProps {
    informationType: string;
    onAdd(val:IKPILocationEventIncidentItem):void;
   // onDelete(val:IKPILocationEventIncidentItem):void;
   // onUpdate(val:IKPILocationEventIncidentItem):void;
}

export class LocationEventFeedback extends React.Component<ILocationEventFeedbackProperty, {}>{
    constructor(props: ILocationEventFeedbackProperty) {
        super(props);
        this.handleAdd= this.handleAdd.bind(this);
       // this.onDelete= this.onAdd.bind(this);
       // this.onUpdate= this.onAdd.bind(this);
    }
    
    protected handleAdd(e:any):void{       
       
        e.preventDefault();
        const comment = e.target.parentNode.parentElement.firstChild.value;
        this.props.onAdd({
            Comment: comment,
            EventIncidentID:0,
            IncidentType: this.props.informationType,
            Week:this.props.week,
            Year:this.props.year,
            LocationTitle:this.props.locationName,
            LocationID:2
        });
    }
    public render() {
        var $this = this;
        return (
            <div className="container ">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Major {this.props.informationType}</legend>                   
                    <div className="input-group mb-3">                      
                        <textarea className="form-control" aria-label="Comment" aria-describedby="basic-addon2" name="comment" id="comment" placeholder="Enter Comment"></textarea>
                        <div className="input-group-append">
                            <button className="btn btn-outline-primary" type="button" onClick={this.handleAdd}>Save</button>
                        </div>
                    </div>
                    <table className="table table-hover">
                        <thead> <tr>
                            <th>ID</th>
                            <th>Comment</th>
                        </tr>
                        </thead>
                        <tbody>
                            {$this.props.items.map((val, index) => {
                                return (
                                    <tr key={val.EventIncidentID}>
                                        <td>{index + 1}</td>
                                        <td id="operationarea" data-id={val.EventIncidentID} >
                                            {val.Comment}
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