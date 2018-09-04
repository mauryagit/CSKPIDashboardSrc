import * as React from "react";
//import { IOperationarea } from "../Services/OperationArea";
export interface IOperationList {
  items: any;
  edit: any;
  delete: any;
}

export class OperationList extends React.Component<IOperationList, {}> {
  constructor(props: IOperationList) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  private handleEdit(e: any): void {
    let title = e.target.parentElement.parentNode.getElementsByTagName("td")
      .title.textContent;
    let order = e.target.parentElement.parentNode.getElementsByTagName("td")
      .order.textContent;
    let ID = e.target.parentElement.parentNode
      .getElementsByTagName("td")
      .title.getAttribute("data-id");
    this.props.edit({
      ID: parseInt(ID),
      Title: title,
      Sequence: parseInt(order)
    });
  }
  private handleDelete(e: any): void {
    let title = e.target.parentElement.parentNode.getElementsByTagName("td")
      .title.textContent;
    let order = e.target.parentElement.parentNode.getElementsByTagName("td")
      .order.textContent;
    let ID = e.target.parentElement.parentNode
      .getElementsByTagName("td")
      .title.getAttribute("data-id");
    this.props.delete({
      ID: parseInt(ID),
      Title: title,
      Sequence: parseInt(order)
    });
  }
  public render() {
   
    var $this = this;
    return (
      <div className="container">
        <h2>Operation Area Details</h2>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Order</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {$this.props.items.map((val, index) => {
              return (
                <tr key={val.ID}>
                  <td id="title" data-id={val.ID} data-name="title">
                    {val.Title}
                  </td>
                  <td id="order" data-name="order">
                    {val.Sequence}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={$this.handleEdit}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={$this.handleDelete}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
