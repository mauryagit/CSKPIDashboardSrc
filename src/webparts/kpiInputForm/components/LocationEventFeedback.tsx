import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import { ICommonProps } from './IKpiInputFormProps';
import { extend, times } from '@microsoft/sp-lodash-subset';

import { IKPILocationEventIncidentItem } from '../service/IKPIItem';
export interface ILocationEventFeedbackProperty extends ICommonProps {
    informationType: string;
    onAdd(val: IKPILocationEventIncidentItem): void;
    onDelete(val: IKPILocationEventIncidentItem): void;
    onUpdate(val: IKPILocationEventIncidentItem): void;
}

export interface ILocationEventFeedbackState {
    commentValue: string;
    Id: number;
}

export class LocationEventFeedback extends React.Component<ILocationEventFeedbackProperty, ILocationEventFeedbackState>{

    private command: string = "save";

    constructor(props: ILocationEventFeedbackProperty) {
        super(props);

        this.state = { commentValue: "", Id: 0 };
        this.handleAdd = this.handleAdd.bind(this);
        // this.onDelete= this.onAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handelDelete = this.handelDelete.bind(this);
    }

    protected handelDelete(e: any): void {
        e.preventDefault();
        const comment = e.target.parentNode.parentElement.getElementsByTagName("td").eventincidentid.textContent;
        const commentID = e.target.parentNode.parentElement.getElementsByTagName("td").eventincidentid.getAttribute("data-id");
        let item: IKPILocationEventIncidentItem = {
            Comment: comment,
            EventIncidentID: parseInt(commentID),
            IncidentType: this.props.informationType,
            Week: this.props.week,
            Year: this.props.year,
            LocationTitle: this.props.location.name,
            LocationID: this.props.location.id
        };
        this.props.onDelete(item);
    }
    protected handleEdit(e: any): void {
        e.preventDefault();
        const comment = e.target.parentNode.parentElement.getElementsByTagName("td").eventincidentid.textContent;
        const commentID = e.target.parentNode.parentElement.getElementsByTagName("td").eventincidentid.getAttribute("data-id");
        this.setState((previousState: ILocationEventFeedbackState, props: ILocationEventFeedbackProperty): ILocationEventFeedbackState => {
            previousState.commentValue = comment;
            previousState.Id = parseInt(commentID);
            return previousState;
        });
        this.command = "update";
    }
    protected handleChange(e): void {
        let value = e.target.value;
        this.setState((previousState: ILocationEventFeedbackState, props: ILocationEventFeedbackProperty): ILocationEventFeedbackState => {
            previousState.commentValue = value;
            return previousState;
        });
    }
    protected handleAdd(e: any): void {
        e.preventDefault();
        let item: IKPILocationEventIncidentItem = {
            Comment: this.state.commentValue,
            EventIncidentID: this.state.Id,
            IncidentType: this.props.informationType,
            Week: this.props.week,
            Year: this.props.year,
            LocationTitle: this.props.location.name,
            LocationID: this.props.location.id
        };
        switch (this.command) {
            case "save":
                this.props.onAdd(item);
                break;
            case "update":
                this.props.onUpdate(item);
                break;
        }
        this.reset();
    }

    private reset(): void {
        this.setState((previousState: ILocationEventFeedbackState, props: ILocationEventFeedbackProperty): ILocationEventFeedbackState => {
            previousState.commentValue = "";
            previousState.Id = 0;
            return previousState;
        });
        this.command = "save";
    }
    protected validate(): boolean {
        let returnval: boolean = false;
        let comment = this.state.commentValue;
        if (this.checkRequired(comment)) {
            if((this.props.location.name !=="" && this.props.location.name !== '--Select--' ) && this.props.week !=="" && this.props.year !== ""){
            returnval = true;
            }
        }
        return returnval;
    }

    protected checkRequired(val: string): boolean {
        return val.length > 0;
    }
    public render() {
        const isActive = this.validate();
        var $this = this;
        return (
            <div className="container ">
                <fieldset className={styles["fieldset-scheduler-border"]}>
                    <legend className={styles["legend-scheduler-border"]}>Major {this.props.informationType}</legend>
                    <div className="input-group mb-3">
                        <textarea className="form-control" value={this.state.commentValue} onChange={this.handleChange} aria-label="Comment" aria-describedby="basic-addon2" name="comment" id="comment" placeholder="Enter Comment"></textarea>
                        <div className="input-group-append">
                            <button className="btn btn-outline-primary" type="button" disabled={!isActive} data-command={$this.command} onClick={this.handleAdd}>Save</button>
                        </div>
                    </div>
                    <table className="table table-hover">
                        <thead> <tr>
                            <th className="span1">ID</th>
                            <th className="span7">Comment</th>
                            <th className="span2"></th>
                            <th className="span2"></th>
                        </tr>
                        </thead>
                        <tbody>
                            {$this.props.items.map((val, index) => {
                                return (
                                    <tr key={val.EventIncidentID}>
                                        <td>{index + 1}</td>
                                        <td id="eventincidentid" data-id={val.EventIncidentID}  >
                                            {val.Comment}
                                        </td>
                                        <td >
                                            <button type="button" className="btn btn-default btn-sm btn-dark" onClick={this.handleEdit} >
                                                Edit
                                            </button>
                                        </td>
                                        <td >
                                            <button type="button" className="btn btn-default btn-sm btn-danger" onClick={this.handelDelete}>
                                                Delete
                                            </button>
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