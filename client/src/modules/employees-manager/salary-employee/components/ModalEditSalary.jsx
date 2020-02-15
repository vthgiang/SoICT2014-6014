import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SalaryActions } from '../redux/actions';
class ModalEditSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: this.props.data.mainSalary.slice(-3, this.props.data.mainSalary.length),
            id: this.props.data._id,
            fullName: this.props.data.employee.fullName,
            employeeNumber: this.props.data.employee.employeeNumber,
            month: this.props.data.month,
            mainSalary: this.props.data.mainSalary.slice(0, this.props.data.mainSalary.length - 3),
            bonus: this.props.data.bonus,
        };
        this.handleAddBonus = this.handleAddBonus.bind(this);
        this.handleChangeBonus = this.handleChangeBonus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSunmit = this.handleSunmit.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleAddBonus(event) {
        var bonus = this.state.bonus;
        this.setState({
            bonus: [...bonus, { nameBonus: "", number: "" }]
        })
    }
    handleChangeBonus(event) {
        var { name, value, className } = event.target;
        var { bonus } = this.state;
        bonus[className] = { ...bonus[className], [name]: value }
        this.setState({
            bonus: bonus
        })
    }
    delete = (index) => {
        var { bonus } = this.state;
        bonus.splice(index, 1);
        this.setState({
            bonus: bonus
        })
    };
    handleSunmit(event) {
        this.props.updateSalary(this.state.employeeNumber, this.state.month, this.state);
        window.$(`#modal-editSalary-${this.props.data._id}`).modal("hide");
    }

    render() {
        var data = this.state;
        console.log(data);
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editSalary-${data.id}`} title="Thông tin bảng lương" data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal fade" id={`modal-editSalary-${data.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thông tin bảng lương: {data.fullName + "- tháng:" + data.month}</h4>
                            </div>
                            <div className="modal-body">
                                {/* /.box-header */}
                                <div className="box-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="employeeNumber">Mã nhân viên:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue={data.employeeNumber} name="employeeNumber" disabled />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="month">Tháng:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" style={{height:33}} className="form-control" name="month" id="datepicker5" defaultValue={data.month} data-date-format="mm-yyyy" disabled />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="mainSalary">Tiền lương chính:<span className="required">&#42;</span></label>
                                            <input style={{ display: "inline", width: "85%" }} type="number" className="form-control" name="mainSalary" defaultValue={parseInt(data.mainSalary)} onChange={this.handleChange} autoComplete="off" />
                                            <select name="unit" id="" className="form-control" defaultValue={data.unit} onChange={this.handleChange} style={{ height: 33, display: "inline", width: "15%" }}>
                                                <option value="VND">VND</option>
                                                <option value="USD">USD</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Các loại lương thưởng khác:<a href="#abc" title="Thêm lương thưởng khác"><i className="fa fa-plus" style={{ color: "#00a65a", marginLeft: 5 }} onClick={this.handleAddBonus} /></a></label>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Tên lương thưởng</th>
                                                        <th style={{ width: "30%" }}>Số tiền({this.state.unit})</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(typeof data.bonus === 'undefined' || data.bonus.length === 0) ? <tr><td colSpan={3}><center> Không có lương thưởng khác</center></td></tr> :
                                                        data.bonus.map((x, index) => (
                                                            <tr key={index}>
                                                                <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={this.handleChangeBonus} /></td>
                                                                <td><input className={index} type="text" value={x.number} name="number" style={{ width: "100%" }} onChange={this.handleChangeBonus} /></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                {/* /.box-body */}
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Lưu lại các thay đổi" onClick={this.handleSunmit} className="btn btn-success pull-right">Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
};
function mapState(state) {
    const { Salary } = state;
    return { Salary };
};

const actionCreators = {
    updateSalary: SalaryActions.updateSalary,
};

const connectedEditSalary = connect(mapState, actionCreators)(ModalEditSalary);
export { connectedEditSalary as ModalEditSalary };