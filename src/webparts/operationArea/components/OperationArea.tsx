import * as React from 'react';
import styles from './OperationArea.module.scss';
import { IOperationAreaProps } from './IOperationAreaProps';
import * as lodash from '@microsoft/sp-lodash-subset';
import { MockOperationarea } from '../service/Operationarea';
import { IItemOperationarea } from '../service/IItemOperationarea';
import { IOperationDataProvider } from '../service/DataProvider/IOperationDataProvider';
import { OperationList } from './OperationList';

export interface IOperationAreaState {
  items: any[];
  newItem: IItemOperationarea;
}
export default class OperationArea extends React.Component<IOperationAreaProps, IOperationAreaState> {
  private command: string = "submit";
  private _dataProvider: IOperationDataProvider;
  private oldoperationvalue: any;
  constructor(props: IOperationAreaProps, state: IOperationAreaState) {
    super(props);
    this._dataProvider = this.props.dataprovider;// new MockOperationarea();
    //Call Get
    this._loadOperationArea();
    this.state = {
      items: [],
      newItem: { ID: 0, Title: "", Sequence: "" }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  private _loadOperationArea(): Promise<IItemOperationarea[]> {
    return this._dataProvider.getOperationAreaList()
      .then((items: IItemOperationarea[]) => {

        this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
          previousState.items = items;
          return previousState;
        });
        return items;
      });
  }

  protected handleEdit(e: any): void {
    this.oldoperationvalue = JSON.parse(JSON.stringify(e));
    this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
      previousState.newItem = e;
      return previousState;
    });
    this.command = "update";
  }
  protected handleDelete(e: IItemOperationarea): void {
    this.deleteOperationArea(e);
  }

  protected handleSubmit(e: any): void {
    e.preventDefault();
    let commandvalue: string = this.command;
    switch (commandvalue) {
      case "submit":
        this.addOperationArea();
        break;
      case "update":
        this.updateOperationArea();
        break;
    }
    this.resetControl();
  }
  protected addOperationArea(): void {
    let newItem: any = this.state.newItem;
    if (this.checkDuplicate) {
      this._dataProvider.createOperationArea(newItem)
        .then((resolve) => {
          this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
            previousState.items = resolve;
            return previousState;
          });
        });
    }
  }

  private checkDuplicate(): boolean {
    let bool: boolean = false;
    const index: number = lodash.findIndex(this.state.items, (item) => {
      return item.Title == this.state.newItem.Title;
    });
    if (index == -1) {
      bool = true;
    }
    return bool;
  }
  protected updateOperationArea(): void {
    let previousitemvalue: any = this.oldoperationvalue;
    let updateoperationvalue: any = {
      ID: parseInt(previousitemvalue["ID"]),
      Title: this.state.newItem.Title,
      Sequence: this.state.newItem.Sequence
    };
    this._dataProvider.updateOperationArea(updateoperationvalue)
      .then((resolve) => {
        this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
          previousState.items = resolve;
          return previousState;
        });
      }
        , (reject) => {
          console.log(reject);
        });
  }

  protected deleteOperationArea(item: IItemOperationarea): void {

    this._dataProvider.deleteOperationArea(item)
      .then((resolve) => {
        this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
          previousState.items = resolve;
          return previousState;
        });
      }, (reject) => {
        console.log(reject);
      });
  }
  protected resetControl(): void {
    this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
      previousState.newItem = { ID: 0, Title: "", Sequence: 0 };
      return previousState;
    });
    this.command = "submit";
  }

  protected handleChange(e: any): void {

    var val = e.target.value;
    switch (e.target.id) {
      case "operationareatitle":
        this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
          previousState.newItem.Title = val;
          return previousState;
        });
        break;
      case "operationareatitleorder":
        if (!e.target.validity.valid) {
          this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
            previousState.newItem.Sequence = "";
            return previousState;
          });
        } else {
          this.setState((previousState: IOperationAreaState, props: IOperationAreaProps): IOperationAreaState => {
            previousState.newItem.Sequence = (val.length > 0 ? parseInt(val) : val);
            return previousState;
          });
        }
        break;
    }
  }

  protected validate(): boolean {
    let returnval: boolean = false;
    let title = this.state.newItem.Title;
    let order = this.state.newItem.Sequence;
    if (this.checkRequired(title)) {
      if (this.checkRequired(order.toString())) {
        returnval = true;
      }
    }
    return returnval;
  }
  protected checkRequired(val: string): boolean {
    return val.length > 0;
  }
  public render(): React.ReactElement<IOperationAreaProps> {
    const isActive = this.validate();
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <p className="h4 mb-4">Add Operation Area</p>
          <div className="form-group" style={styles}>
            <label htmlFor="operationareatitle">
              Enter Opertaion Area Title
            </label>
            <input
              type="text"
              id="operationareatitle"
              name="operationareatitle"
              className="form-control mb-4"
              placeholder="Required"
              value={this.state.newItem.Title}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group" style={styles}>
            <label htmlFor="operationareatitleorder">Enter Sequence</label>
            <input
              type="text"
              id="operationareatitleorder"
              name="operationareatitleorder"
              className="form-control mb-4"
              pattern="[0-9]*"
              placeholder="Only Number Allowed"
              value={this.state.newItem.Sequence}
              onChange={this.handleChange}
            />
          </div>
          <button
            className="btn btn-info  btn-block "
            disabled={!isActive}
            type="submit"
            data-command={this.command}
          >
            Save
          </button>
          <hr />
          <OperationList
            items={this.state.items}
            edit={this.handleEdit}
            delete={this.handleDelete}
          />
        </form>
      </div>
    );
  }
}
