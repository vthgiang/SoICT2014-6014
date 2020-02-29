import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { EmployeeManagerActions } from '../../employee-manager/redux/actions';
import 'react-toastify/dist/ReactToastify.css';
import { SalaryActions } from '../redux/actions';
class ModalAddSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "VND",
            employeeNumber: "",
            mainSalary: "",
            bonus: [],
        };
        this.handleAddBonus = this.handleAddBonus.bind(this);
        this.handleChangeBonus = this.handleChangeBonus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMSNV = this.handleChangeMSNV.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
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
    handleChangeMSNV(event) {
        const { name, value } = event.target;
        if (value !== "") {
            this.props.checkMSNV(value);
        };
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
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    delete = (index) => {
        var { bonus } = this.state;
        bonus.splice(index, 1);
        this.setState({
            bonus: bonus
        })
    };

    handleCloseModal = () => {
        this.setState({
            unit: "VND",
            employeeNumber: "",
            mainSalary: "",
            bonus: [],
        });
        document.getElementById("formAddSalary").reset();
        window.$(`#modal-addNewSalary`).modal("hide");
    }

    handleSunmit = async () => {
        var { translate } = this.props;
        await this.setState({
            month: this.refs.month.value,
        })
        if (this.state.employeeNumber === "") {
            this.notifyerror(translate('salary_employee.check_null_msnv'));
        } else if (this.props.employeesManager.checkMSNV===false) {
            this.notifyerror(translate('salary_employee.check_msnv'));
        } else if (this.state.mainSalary === "") {
            this.notifyerror(translate('salary_employee.check_main_salary'));
        } else if (this.state.endDate === "") {
            this.notifyerror(translate('salary_employee.check_month'));
        } else {
            this.props.createNewSalary(this.state);
            this.setState({
                unit: "VND",
                employeeNumber: "",
                mainSalary: "",
                bonus: [],
            });
            this.notifysuccess(translate('modal.add_success'));
            document.getElementById("formAddSalary").reset();
            window.$(`#modal-addNewSalary`).modal("hide");
        }
    }
    render() {
        const { translate } = this.props;
        var data = this.state;
        return (
            <div className="modal fade" id="modal-addNewSalary" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => this.handleCloseModal()} aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">{translate('salary_employee.add_new_salary')}:</h4>
                        </div>
                        <form id="formAddSalary">
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): {translate('modal.note')}.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">{translate('salary_employee.staff_number')}:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" id="employeeNumber" name="employeeNumber" onChange={this.handleChangeMSNV} placeholder={translate('salary_employee.staff_number')} autoComplete="off" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="month">{translate('salary_employee.month')}:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control employeedatepicker" name="month" defaultValue={this.formatDate(Date.now())} ref="month" onChange={this.handleChange} placeholder={translate('salary_employee.month')} data-date-format="mm-yyyy" autoComplete="off" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mainSalary">{translate('salary_employee.main_salary')}:<span className="required">&#42;</span></label>
                                        <input style={{ display: "inline", width: "85%" }} type="number" className="form-control" name="mainSalary" onChange={this.handleChange} autoComplete="off" />
                                        <select name="unit" id="" className="form-control" onChange={this.handleChange} style={{ height: 34, display: "inline", width: "15%" }}>
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
                                                    <th style={{ width: "30%" }}>{translate('salary_employee.money_salary')}</th>
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
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()}>{translate('modal.close')}</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title={translate('salary_employee.add_new_salary')} >{translate('modal.create')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};
function mapState(state) {
    const { salary, employeesManager } = state;
    return { salary, employeesManager };
};

const actionCreators = {
    createNewSalary: SalaryActions.createNewSalary,
    checkMSNV:EmployeeManagerActions.checkMSNV,
};

const connectedAddSalary = connect(mapState, actionCreators)(withTranslate(ModalAddSalary));
export { connectedAddSalary as ModalAddSalary };