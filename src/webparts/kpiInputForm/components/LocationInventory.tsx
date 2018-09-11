import * as React from 'react';
import styles from './KpiInputForm.module.scss';
import { ICSKPIProps } from '../service/IKPIItem';
import { ILocationInventory } from '../service/ILocationInventory';
import { IKPIInputFormDataProvider } from '../service/DataProvider/IKPIInputFormDataProvider';
export interface ILocationInventoryProperty extends ICSKPIProps {
    locationInventoryrefresh:ILocationInventory;
    // onAdd(val: ILocationInventory): void;
    //  onUpdate(val:ILocationInventory):void;
    dataprovider: IKPIInputFormDataProvider;
}
export interface ILocationInventoryState {
    locationInventoryItem: ILocationInventory;
}
export class LocationInvetory extends React.Component<ILocationInventoryProperty, ILocationInventoryState>{

    private _localCheck ={week:"",year:"",location:""};
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
    private command: string = "save";
    private _dataProvider: IKPIInputFormDataProvider;

    constructor(props: ILocationInventoryProperty) {       
        super(props);             
        this._dataProvider = this.props.dataprovider;
        this.state = { locationInventoryItem: this._locationinventory };
        this._loadLocationInventory();
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    private _loadLocationInventory(): Promise<ILocationInventory> {
     
        return this._dataProvider.getKPILocationInventoryForTheWeekOfLocation({
            location:{name:this.props.location.name, id:this.props.location.id},
             week:this.props.week,year:this.props.year})
            .then((items: ILocationInventory) => {                
                this.setState((previousState: ILocationInventoryState, props: ILocationInventoryProperty): ILocationInventoryState => {
                    previousState.locationInventoryItem = items;
                    return previousState;
                });
                return items;
            });
    }
    protected handleChange(e): void {
        let target = e.target;
        if (e.target.validity.valid) {
        this.setState((previousState: ILocationInventoryState, props: ILocationInventoryProperty): ILocationInventoryState => {
            previousState.locationInventoryItem[target["name"]] = target.value;
            return previousState;
        });
    }
    }

    private handleAddLocationInventory(e: ILocationInventory): void {
        let newItem: ILocationInventory = e;
       
        this._dataProvider.AddKPILocationInventory(newItem)
            .then((resolve) => {
                this.setState((previousState: ILocationInventoryState, props: ILocationInventoryProperty): ILocationInventoryState => {
                    previousState.locationInventoryItem = resolve;
                    return previousState;
                });
            });
    }
    private handleUpdateLocationInventory(e: ILocationInventory): void {

        let updateItem: ILocationInventory = e;       
        this._dataProvider.UpdateKPILocationInventory(updateItem)
            .then((resolve) => {             
                this.setState((previousState: ILocationInventoryState, props: ILocationInventoryProperty): ILocationInventoryState => {
                    previousState.locationInventoryItem = resolve;
                    return previousState;
                });
            });
    }
    protected handleClick(e: any): void {
        e.preventDefault();

        let item: ILocationInventory = {
            Areainacres: this.state.locationInventoryItem.Areainacres,
            Builtupofficespacearea: this.state.locationInventoryItem.Builtupofficespacearea,
            Cabininventory: this.state.locationInventoryItem.Cabininventory, Cabinoccupied: this.state.locationInventoryItem.Cabinoccupied,
            Cubicleinventory: this.state.locationInventoryItem.Cubicleinventory, Cubicleoccupied: this.state.locationInventoryItem.Cubicleoccupied,
            Dailybuses: this.state.locationInventoryItem.Dailybuses, Employee: this.state.locationInventoryItem.Employee,
            GETaccommodation: this.state.locationInventoryItem.GETaccommodation, GHtransitaccommodation: this.state.locationInventoryItem.GHtransitaccommodation,
            ID: this.state.locationInventoryItem.ID, LocationId: this.props.location.id, LocationTitle: this.props.location.name,
            Mealserved: this.state.locationInventoryItem.Mealserved,
            Monthlyhirecar: this.state.locationInventoryItem.Monthlyhirecar, Title: this.props.year,
            Totalstaff: this.state.locationInventoryItem.Totalstaff, Townshipaccommodation: this.state.locationInventoryItem.Townshipaccommodation,
            Week: this.props.week
        };
        switch (this.command) {
            case "save":
                this.handleAddLocationInventory(item);           
                break;
            case "update":
                this.handleUpdateLocationInventory(item);
                break;
        }
    }

  protected  shouldComponentUpdate(nextProps){    
        if(this.props.location.name !== "" && this.props.week !=="" && this.props.year !== ""){
            if(this._localCheck["week"] !== this.props.week ||
                 this._localCheck["year"] !== this.props.year ||
                  this._localCheck["location"]  !==this.props.location.name)
            {
                this._loadLocationInventory();
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
        if (this.state.locationInventoryItem.ID !== 0) {
            this.command = "update";
        }else{
            this.command = "save";
        }
       
        const isActive = ((this.props.location.name !=="" && this.props.location.name !== '--Select--' ) && this.props.week !=="" && this.props.year !=="");
        return (
            <div className="container ">
                <fieldset className={styles["fieldset-scheduler-border"]}>
                    <legend className={styles["legend-scheduler-border"]}>Location Overview</legend>                 
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Area In Acres</span>
                                </div>
                                <input type="text" onChange={this.handleChange} data-inventoyid="needtocheck" id="Areainacres" name="Areainacres"
                                    value={this.state.locationInventoryItem.Areainacres} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Built-up Office Space Area</span>
                                </div>
                                <input type="text" id="Builtupofficespacearea" name="Builtupofficespacearea" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Builtupofficespacearea} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Office Space Inventory</span>
                                </div>
                                <input type="text" id="Cubicleinventory" name="Cubicleinventory" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Cubicleinventory} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Office Space Occupied</span>
                                </div>
                                <input type="text" id="Cubicleoccupied" name="Cubicleoccupied" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Cubicleoccupied} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">RIL Employees </span>
                                </div>
                                <input type="text" id="Employee" name="Employee" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Employee} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Total Staff (Including Contract Staff)</span>
                                </div>
                                <input type="text" id="Totalstaff" name="Totalstaff" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Totalstaff} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Township Accommodations</span>
                                </div>
                                <input type="text" id="Townshipaccommodation" name="Townshipaccommodation" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Townshipaccommodation} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">GET Accommodations</span>
                                </div>
                                <input type="text" id="GETaccommodation" name="GETaccommodation" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.GETaccommodation} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">GH/Transit Accommodations</span>
                                </div>
                                <input type="text" id="GHtransitaccommodation" name="GHtransitaccommodation" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.GHtransitaccommodation} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>

                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Meals Served</span>
                                </div>
                                <input type="text" id="Mealserved" name="Mealserved" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Mealserved} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Daily Buses</span>
                                </div>
                                <input type="text" id="Dailybuses" name="Dailybuses" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Dailybuses} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div className="form-group col-xs-10 col-sm-6 col-md-6 col-lg-6">
                            <div className="input-group input-group-sm mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Monthly Hired Cars</span>
                                </div>
                                <input type="text" id="Monthlyhirecar" name="Monthlyhirecar" onChange={this.handleChange} pattern="[0-9]*"
                                    placeholder="Only Number Allowed"
                                    value={this.state.locationInventoryItem.Monthlyhirecar} className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-default btn-sm btn-primary" disabled={!isActive} data-command={this.command} onClick={this.handleClick}>Save</button>
                </fieldset>
            </div>
        );
    }

}