import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SalaryActions } from '../redux/actions';
import { ModalAddSalary } from './ModalAddSalary';
import { ModalImportFileSalary } from './ModalImportFileSalary';
import { ModalEditSalary } from './ModalEditSalary';
import { ActionColumn } from '../../../../common-components';
import { PaginateBar } from '../../../../common-components';
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { DeleteNotification } from '../../../../common-components';

class SalaryEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "All",
            month: "",
            employeeNumber: "",
            department: "All",
            page: 0,
            limit: 5,

        }
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getListSalary(this.state);
        this.props.getDepartment();
        let script1 = document.createElement('script');
        script1.src = 'lib/main/js/GridSelect.js';
        script1.async = true;
        script1.defer = true;
        document.body.appendChild(script1);

    }

    displayTreeSelect = (data, i) => {
        i = i + 1;
        if (data !== undefined) {
            if (typeof (data.children) === 'undefined') {
                return (
                    <option key={data.id} data-level={i} value={data.id}>{data.name}</option>
                )
            } else {
                return (
                    <React.Fragment key={data.id}>
                        <option data-level={i} value={data.id} style={{ fontWeight: "bold" }}>{data.name}</option>
                        {
                            data.children.map(tag => this.displayTreeSelect(tag, i))
                        }
                    </React.Fragment>
                )
            }

        }
        else return null
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    setLimit = async (number) => {
        await this.setState({ limit: parseInt(number) });
        this.props.getListSalary(this.state);
        window.$(`#setting-table`).collapse("hide");
    }
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListSalary(this.state);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    handleSunmitSearch = async () => {
        await this.setState({
            month: this.refs.month.value
        })
        this.props.getListSalary(this.state);
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
    render() {
        const { tree, list } = this.props.department;
        const { translate } = this.props;
        var formatter = new Intl.NumberFormat();
        var listSalary = "", listDepartment = list, listPosition;
        for (let n in listDepartment) {
            if (listDepartment[n]._id === this.state.department) {
                listPosition = [
                    { _id: listDepartment[n].dean._id, name: listDepartment[n].dean.name },
                    { _id: listDepartment[n].vice_dean._id, name: listDepartment[n].vice_dean.name },
                    { _id: listDepartment[n].employee._id, name: listDepartment[n].employee.name }
                ]
            }
        }
        if (this.props.salary.isLoading === false) {
            listSalary = this.props.salary.listSalary;
        }
        var pageTotal = (this.props.salary.totalList % this.state.limit === 0) ?
            parseInt(this.props.salary.totalList / this.state.limit) :
            parseInt((this.props.salary.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-info">
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                        <h3 className="box-title">{translate('salary_employee.list_salary')}:</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label style={{ paddingTop: 5 }}>{translate('page.unit')}:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-control" defaultValue="All" id="tree-select" name="department" onChange={this.handleChange}>
                                                <option value="All" level={1}>--Tất cả---</option>
                                                {
                                                    tree !== null &&
                                                    tree.map((tree, index) => this.displayTreeSelect(tree, 0))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label style={{ paddingTop: 5 }}>{translate('page.position')}:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-control" defaultValue="All" name="position" onChange={this.handleChange}>
                                                <option value="All">--Tất cả--</option>
                                                {
                                                    listPosition !== undefined &&
                                                    listPosition.map((position, index) => (
                                                        <option key={index} value={position._id}>{position.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12" style={{ marginBottom: 10 }} >
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}>
                                            <label htmlFor="employeeNumber">{translate('page.staff_number')}:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}>
                                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}>
                                            <label htmlFor="month" style={{ paddingTop: 5 }}>{translate('page.month')}:</label>
                                        </div>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control" name="month" id="employeedatepicker4" defaultValue={this.formatDate(Date.now())} ref="month" placeholder="Tháng tính lương" data-date-format="mm-yyyy" autoComplete="off" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group" style={{ paddingLeft: 0, marginBottom: 0 }}>
                                            <button type="submit" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()} >{translate('page.add_search')}</button>
                                        </div>
                                    </div>
                                    <div className="col-md-3" style={{ paddingRight: 0 }}>
                                        <div className="form-group pull-right" style={{ marginBottom: 0 }} >
                                            <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title={translate('salary_employee.add_salary_title')} >{translate('salary_employee.add_salary')}</button>
                                            <ul className="dropdown-menu pull-right" style={{ background: "#999", marginTop: -15 }}>
                                                <li><a href="#abc" style={{ color: "#fff" }} title={translate('salary_employee.add_import_title')} data-toggle="modal" data-target="#modal-importFileSalary">{translate('salary_employee.add_import')}</a></li>
                                                <li><a href="#abc" style={{ color: "#fff" }} title={translate('salary_employee.add_by_hand_title')} data-toggle="modal" data-target="#modal-addNewSalary">{translate('salary_employee.add_by_hand')}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "13%" }}>{translate('table.employee_number')}</th>
                                                <th style={{ width: "18%" }}>{translate('table.employee_name')}</th>
                                                <th style={{ width: "10%" }}>{translate('table.month')}</th>
                                                <th style={{ width: "13%" }}>{translate('table.total_salary')}</th>
                                                <th style={{ width: "15%" }}>{translate('table.unit')}</th>
                                                <th style={{ width: "18%" }}>{translate('table.position')}</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>
                                                    <ActionColumn
                                                        columnName={translate('table.action')}
                                                        columnArr={[
                                                            translate('table.employee_number'),
                                                            translate('table.employee_name'),
                                                            translate('table.month'),
                                                            translate('table.total_salary'),
                                                            translate('table.unit'),
                                                            translate('table.position'),
                                                        ]}
                                                        limit={this.state.limit}
                                                        setLimit={this.setLimit}
                                                        hideColumnOption={true}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(typeof listSalary === 'undefined' || listSalary.length === 0) ? <tr><td colSpan={7}><center> {translate('table.no_data')}</center></td></tr> :
                                                listSalary.map((x, index) => {

                                                    let salary = x.mainSalary.slice(0, x.mainSalary.length - 3);
                                                    if (x.bonus.length !== 0) {
                                                        var total = 0;
                                                        for (let count in x.bonus) {
                                                            total = total + parseInt(x.bonus[count].number)
                                                        }
                                                    }
                                                    var unit = x.mainSalary.slice(x.mainSalary.length - 3, x.mainSalary.length);
                                                    return (
                                                        <tr key={index}>
                                                            <td>{x.employee.employeeNumber}</td>
                                                            <td>{x.employee.fullName}</td>
                                                            <td>{x.month}</td>
                                                            <td>
                                                                {
                                                                    (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                                        formatter.format(parseInt(salary)) :
                                                                        formatter.format(total + parseInt(salary))
                                                                } {unit}
                                                            </td>
                                                            <td>{x.departments.length !== 0 ? x.departments.map(unit => (
                                                                <React.Fragment key={unit._id}>
                                                                    {unit.name}<br />
                                                                </React.Fragment>
                                                            )) : null}</td>
                                                            <td>{x.roles.length !== 0 ? x.roles.map(role => (
                                                                <React.Fragment key={role._id}>
                                                                    {role.roleId.name}<br />
                                                                </React.Fragment>
                                                            )) : null}</td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <ModalEditSalary data={x} />
                                                                <DeleteNotification
                                                                    content={{
                                                                        title: "Xoá bảng lương",
                                                                        btnNo: translate('confirm.no'),
                                                                        btnYes: translate('confirm.yes'),
                                                                    }}
                                                                    data={{
                                                                        id: x._id,
                                                                        info: x.employee.employeeNumber + "- tháng: " + x.month
                                                                    }}
                                                                    func={this.props.deleteSalary}
                                                                />
                                                            </td>
                                                        </tr>)
                                                })
                                            }
                                        </tbody>
                                    </table>

                                </div>
                                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                            </div>
                        </div>

                    </div>
                </div>
                <ToastContainer />
                <ModalAddSalary />
                <ModalImportFileSalary />

            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListSalary: SalaryActions.getListSalary,
    deleteSalary: SalaryActions.deleteSalary,
};

const connectedListSalary = connect(mapState, actionCreators)(withTranslate(SalaryEmployee));
export { connectedListSalary as SalaryEmployee };