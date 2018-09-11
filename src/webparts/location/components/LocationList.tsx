import * as React from "react";

export interface ILocationList  {
  onEdit:any;
  onDelete:any;
  items: any;
}
export class LocationList extends React.Component<ILocationList, {}> {
  constructor(props: ILocationList) {
    super(props);

    this.state = {
      locationitems: this.props.items
    };
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  protected onEdit(e: any):void {
    this.props.onEdit(e);
  }
  protected onDelete(e: any):void {
   
    this.props.onDelete(e);
  }
  public render() {
    var $this = this;
    return (
      <div className="container">
        <h2>Location Details</h2>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.props.items.map((item, index) => {
              return (
                <Locationrow
                  key={item.ID}
                  row={item}
                  edit={$this.onEdit}
                  delete={$this.onDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

interface rowDetails {
  row: any;
  edit(val:any): void;
 // delete: any[];
 delete(val: any):void;
}

class Locationrow extends React.Component<rowDetails, {}> {
  constructor(props: rowDetails) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  protected handleDelete(e: any): void {
    e.preventDefault();
    let name = e.target.parentNode.parentElement.firstChild.textContent;
    let id = e.target.parentNode.parentElement.firstChild.getAttribute(
      "data-id"
    );
    this.props.delete({ ID: parseInt(id), Title: name });
  }

  protected handleEdit(e: any): void {   
    e.preventDefault();
    let name = e.target.parentNode.parentElement.firstChild.textContent;
    let id = e.target.parentNode.parentElement.firstChild.getAttribute(
      "data-id"
    );
    this.props.edit({ ID: parseInt(id), Title: name });
  }

 public render() {
    let item = this.props.row;
    return (
      <tr>       
        <td id="name" data-id={item.ID}>
          {item.Title}
        </td>
        <td>
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.handleEdit}
          >
            Edit
          </button>
        </td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={this.handleDelete}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
}
