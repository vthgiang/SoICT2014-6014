import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleAddBonus(event) {
        var bonus = this.state.bonus;
        this.setState({
            bonus: [...bonus, { nameBonus: " ", number: "" }]
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
        var { translate } = this.props;
        if (this.state.employeeNumber === "") {
            this.notifyerror(translate('salary_employee.check_null_msnv'));
        } else if (this.state.mainSalary === "") {
            this.notifyerror(translate('salary_employee.check_main_salary'));
        } else if (this.state.endDate === "") {
            this.notifyerror(translate('salary_employee.check_month'));
        } else {
            this.props.updateSalary(this.state.id, this.state);
            window.$(`#modal-editSalary-${this.props.data._id}`).modal("hide");
        }
    }

    render() {
        const { translate } = this.props;
        var data = this.state;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editSalary-${data.id}`} title={translate('salary_employee.infor_salary')} data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal fade" id={`modal-editSalary-${data.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">{translate('salary_employee.infor_salary')}: {data.fullName + " - "}{ translate('salary_employee.month') }{": " + data.month}</h4>
                            </div>
                            <div className="modal-body">
                                {/* /.box-header */}
                                <div className="box-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): {translate('modal.note')}.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="employeeNumber">{translate('salary_employee.staff_number')}:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" defaultValue={data.employeeNumber} name="employeeNumber" disabled />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="month">{translate('salary_employee.month')}:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" style={{ height: 33 }} className="form-control employeedatepicker" name="month" defaultValue={data.month} data-date-format="mm-yyyy" disabled />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="mainSalary">{translate('salary_employee.main_salary')}:<span className="required">&#42;</span></label>
                                            <input style={{ display: "inline", width: "85%" }} type="number" className="form-control" name="mainSalary" defaultValue={parseInt(data.mainSalary)} onChange={this.handleChange} autoComplete="off" />
                                            <select name="unit" id="" className="form-control" defaultValue={data.unit} onChange={this.handleChange} style={{ height: 33, display: "inline", width: "15%" }}>
                                                <option value="VND">VND</option>
                                                <option value="USD">USD</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>{translate('salary_employee.other_salary')}:<a href="#abc" title="Thêm lương thưởng khác"><i className="fa fa-plus" style={{ color: "#00a65a", marginLeft: 5 }} onClick={this.handleAddBonus} /></a></label>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>{translate('salary_employee.name_salary')}</th>
                                                        <th style={{ width: "30%" }}>{translate('salary_employee.money_salary')}({this.state.unit})</th>
                                                        <th>{translate('table.action')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(typeof data.bonus === 'undefined' || data.bonus.length === 0) ? <tr><td colSpan={3}><center> {translate('table.no_data')}</center></td></tr> :
                                                        data.bonus.map((x, index) => (
                                                            <tr key={index}>
                                                                <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={this.handleChangeBonus} /></td>
                                                                <td><input className={index} type="number" value={x.number} name="number" style={{ width: "100%" }} onChange={this.handleChangeBonus} /></td>
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
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">{translate('modal.close')}</button>
                                <button style={{ marginRight: 15 }} type="button" title={translate('modal.update')} onClick={this.handleSunmit} className="btn btn-success pull-right">{translate('modal.update')}</button>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
};
function mapState(state) {
    const { salary } = state;
    return { salary };
};

const actionCreators = {
    updateSalary: SalaryActions.updateSalary,
};

const connectedEditSalary = connect(mapState, actionCreators)(withTranslate(ModalEditSalary));
export { connectedEditSalary as ModalEditSalary };