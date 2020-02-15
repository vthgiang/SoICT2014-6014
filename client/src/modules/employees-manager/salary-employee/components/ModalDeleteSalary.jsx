import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SalaryActions } from '../redux/actions';

class ModalDeleteSalary extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        this.props.deleteSalary(this.props.data.employee.employeeNumber,this.props.data.month);
        window.$(`#modal-deleteSalary-${this.props.data._id}`).modal("hide");
    }
    render() {
        var { data } = this.props;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-deleteSalary-${data._id}`} className="delete" title="Xoá bảng lương" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal modal-full fade" id={`modal-deleteSalary-${data._id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Xoá bảng lương: {data.employee.fullName + "- tháng:" + data.month}</h4>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xoá bảng lương</p>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 25 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Xoá bảng lương" onClick={this.handleSubmit} className="btn btn-success pull-right">Xoá</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { Salary } = state;
    return { Salary };
};

const actionCreators = {
    deleteSalary: SalaryActions.deleteSalary,
};

const connectedDeleteSalary = connect(mapState, actionCreators)(ModalDeleteSalary);
export { connectedDeleteSalary as ModalDeleteSalary };