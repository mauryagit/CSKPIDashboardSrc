import * as React from 'react';
export interface IKPIMatrixList {
    items: any;
    edit: any;
    delete: any;
}

export class KPIMartixlist extends React.Component<IKPIMatrixList, {}>{
    constructor(props: IKPIMatrixList) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }


    private handleEdit(e: any): void {

        let title = e.target.parentElement.parentNode.getElementsByTagName("td")
            .kpititle.textContent;
        let sequence = e.target.parentElement.parentNode.getElementsByTagName("td")
            .sequence.textContent;
        let operationarea = e.target.parentElement.parentNode.getElementsByTagName("td")
            .operationarea.textContent;
        let metric = e.target.parentElement.parentNode.getElementsByTagName("td")
            .metric.textContent;
        let target = e.target.parentElement.parentNode.getElementsByTagName("td")
            .target.textContent;
        let ID = e.target.parentElement.parentNode
            .getElementsByTagName("td")
            .operationarea.getAttribute("data-id");
        let kpimatrixid = e.target.parentElement.parentNode
            .getElementsByTagName("td")
            .operationarea.getAttribute("data-kpimatirxid");
        let operationareaid = e.target.parentElement.parentNode
            .getElementsByTagName("td")
            .operationarea.getAttribute("data-operationareaID");
        this.props.edit({
            KPIID: parseInt(ID),
            Title: title,
            Sequence: parseInt(sequence),
            Metric: metric,
            OperationAreaID: parseInt(operationareaid),
            OperationAreaTitle: operationarea,
            KPITargetConfig: "Generic",
            Target: target,
            KPIMatrixID: parseInt(kpimatrixid)
        });
    }
    private handleDelete(e: any): void {
        let title = e.target.parentElement.parentNode.getElementsByTagName("td")
            .kpititle.textContent;
        let sequence = e.target.parentElement.parentNode.getElementsByTagName("td")
            .sequence.textContent;
        let operationarea = e.target.parentElement.parentNode.getElementsByTagName("td")
            .operationarea.textContent;
        let metric = e.target.parentElement.parentNode.getElementsByTagName("td")
            .metric.textContent;
        let target = e.target.parentElement.parentNode.getElementsByTagName("td")
            .target.textContent;
        let ID = e.target.parentElement.parentNode
            .getElementsByTagName("td")
            .operationarea.getAttribute("data-id");
        let kpimatrixid = e.target.parentElement.parentNode
            .getElementsByTagName("td")
            .operationarea.getAttribute("data-kpimatirxid");
        let operationareaid = e.target.parentElement.parentNode
            .getElementsByTagName("td")
            .operationarea.getAttribute("data-operationareaID");
        this.props.delete({
            KPIID: parseInt(ID),
            Title: title,
            Sequence: parseInt(sequence),
            Metric: metric,
            OperationAreaID: parseInt(operationareaid),
            OperationAreaTitle: operationarea,
            KPITargetConfig: "Generic",
            Target: target,
            KPIMatrixID: parseInt(kpimatrixid)
        });
    }
    public render() {

        var $this = this;
        return (
            <div className="container">
                <h2>KPI Matrix Details</h2>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Area Of Operation</th>
                            <th>SN</th>
                            <th>KPI</th>
                            <th>Metric</th>
                            <th>Target</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {$this.props.items.map((val, index) => {
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