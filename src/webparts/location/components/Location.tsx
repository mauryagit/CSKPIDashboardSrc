import * as React from 'react';
import styles from './Location.module.scss';
import { ILocationProps } from './ILocationProps';
import * as lodash from '@microsoft/sp-lodash-subset';
import { MockLocationData } from '../service/MockData';
import { ILocationDataProvider } from '../service/DataProvider/ILocationDataProvider';
import { IItemLocation } from '../service/IItemLocation';
import { LocationList } from "./LocationList";

export interface ILocationState {
  items: any[];
  locationName: IItemLocation;
}

export default class Location extends React.Component<ILocationProps, ILocationState> {
  private t: any;
  private command: string = "submit";
  private _dataProvider: ILocationDataProvider;
  private oldlocationvalue: any;
  constructor(props: ILocationProps) {
    super(props);
    this._dataProvider = this.props.dataprovider;
    const itemss = this._loadLocation();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.t = new MockLocationData();
    const items = this.t.locations;
    this.state = {
      items: items,
      locationName: { ID: 0, Title: "" }
    };
  }

  private _loadLocation(): Promise<IItemLocation[]> {
    return this._dataProvider.getLocationList()
      .then((items: IItemLocation[]) => {

        this.setState((previousState: ILocationState, props: ILocationProps): ILocationState => {
          previousState.items = items;
          return previousState;
        });
        return items;
      });
  }
  protected handleChange(e: any): void {
    let input = e.target;
    this.setState((previousState: ILocationState, props: ILocationProps): ILocationState => {
      previousState.locationName.Title = input.value.toUpperCase();
      return previousState;
    });
  }

  protected handleSubmit(e: any): void {
    e.preventDefault();
    debugger;
    let commandvalue: string = this.command;
    switch (commandvalue) {
      case "submit":
        this.addLocationtoRemote();
        break;
      case "update":
        this.updateLocationRemote();
        break;
    }
    this.resetControl();
  }


  protected addLocationtoRemote(): void {
    let newItem: any = this.state.locationName;
    if (this.checkDuplicate()) {
      this._dataProvider.createLocation(newItem)
        .then((resolve) => {
          this.setState((previousState: ILocationState, props: ILocationProps): ILocationState => {
            previousState.items = resolve;
            return previousState;
          });
        });
    }
  }

  private checkDuplicate(): boolean {  
    let bool: boolean = false;
    const index: number = lodash.findIndex(this.state.items, (item) => {
      return item.Title == this.state.locationName.Title;
    });
    if (index == -1){
      bool=true;
    }
    return bool;
  }
  protected updateLocationRemote(): void {
    let previousLocation: any = this.oldlocationvalue;
    let udpateLocation: any = {
      ID: previousLocation["ID"],
      Title: this.state.locationName.Title
    };
    this._dataProvider.updateLocation(udpateLocation)
      .then((resolve) => {
        this.setState((previousState: ILocationState, props: ILocationProps): ILocationState => {
          previousState.items = resolve;
          return previousState;
        });
      }
        , (reject) => {
          console.log(reject);
        });
  }

  protected resetControl(): void {

    this.setState((previousState: ILocationState, props: ILocationProps): ILocationState => {
      previousState.locationName = { ID: 0, Title: "" };
      return previousState;
    });
    this.command = "submit";

  }

  protected onEdit(e: any): void {
    this.oldlocationvalue = e;
    this.setState((previousState: ILocationState, props: ILocationProps): ILocationState => {
      previousState.locationName = e;
      return previousState;
    });
    this.command = "update";
  }
  protected onDelete(e: IItemLocation): void {
    this.deleteLocation(e);
  }

  protected deleteLocation(item: IItemLocation): void {

    this._dataProvider.deleteLocation(item)
      .then((resolve) => {
        this.setState((previousState: ILocationState, props: ILocationProps): ILocationState => {
          previousState.items = resolve;
          return previousState;
        });
      }, (reject) => {
        console.log(reject);
      });
  }
  protected validate(): boolean {
    return (this.state.locationName.Title.length > 0);
  }
  public render(): React.ReactElement<ILocationProps> {

    const isActive = this.validate();
    return (
      <div className="container">
        <form
          className="text-center border border-light p-5"
          onSubmit={this.handleSubmit}
        >
          <p className="h4 mb-4">Add Location</p>
          <input
            type="text"
            id="locationName"
            className="form-control mb-4"
            placeholder="Location Name"
            value={this.state.locationName.Title}
            onChange={this.handleChange}
          />
          <button
            className="btn btn-info btn-block"
            type="submit"
            data-command={this.command}
            disabled={!isActive}
          >
            Save
          </button>
          <hr />
          <LocationList
            onEdit={this.onEdit}
            items={this.state.items}
            onDelete={this.onDelete}
          />
        </form>
      </div>
    );
  }
}
