import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SabbaticalActions } from '../redux/actions';
import { ModalAddSabbatical } from './ModalAddSabbatical';
import { ModalEditSabbatical } from './ModalEditSabbatical';
import { ActionColumn } from '../../../../common-components/src/ActionColumn';
import { PaginateBar } from '../../../../common-components/src/PaginateBar';
import { DepartmentActions } from '../../../super-admin-management/manage-department/redux/actions';
import { DeleteNotification } from '../../../../common-components';

class Sabbatical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "All",
            month: "",
            employeeNumber: "",
            department: "All",
            status: "All",
            page: 0,
            limit: 5,

        }
        this.handleResizeColumn();
        this.setLimit = this.setLimit.bind(this);
        this.setPage = this.setPage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);

    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getListSabbatical(this.state);
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
        this.props.getListSabbatical(this.state);
        window.$(`#setting-table`).collapse("hide");
    }
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getListSabbatical(this.state);
    }

    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
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
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    handleSunmitSearch = async () => {
        await this.setState({
            month: this.refs.month.value
        });
        console.log(this.state);
        this.props.getListSabbatical(this.state);
    }
    render() {
        console.log(this.state);
        const { tree, list } = this.props.department;
        const { translate } = this.props;
        var listSabbatical = "", listDepartment = list, listPosition;
        for (let n in listDepartment) {
            if (listDepartment[n]._id === this.state.department) {
                listPosition = [
                    { _id: listDepartment[n].dean._id, name: listDepartment[n].dean.name },
                    { _id: listDepartment[n].vice_dean._id, name: listDepartment[n].vice_dean.name },
                    { _id: listDepartment[n].employee._id, name: listDepartment[n].employee.name }
                ]
            }
        }
        if (this.props.sabbatical.isLoading === false) {
            listSabbatical = this.props.sabbatical.listSabbatical;
        }
        var pageTotal = ((this.props.sabbatical.totalList % this.state.limit) === 0) ?
            parseInt(this.props.sabbatical.totalList / this.state.limit) :
            parseInt((this.props.sabbatical.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <React.Fragment>
                <div className="row">
                    <div className="box box-info">
                        <div className="box-body">
                            <div className="col-md-12">
                                <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                    <h3 className="box-title">{translate('sabbatical.list_sabbatical')} :</h3>
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
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label style={{ paddingTop: 5 }}>{translate('page.status')}:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <select className="form-control" defaultValue="All" name="status" onChange={this.handleChange}>
                                            <option value="All">--Tất cả--</option>
                                            <option value="Đã chấp nhận">Đã chấp nhận</option>
                                            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                            <option value="Không chấp nhận">Không chấp nhận</option>
                                        </select>
                                    </div>
                                </div></div>
                            <div className="col-md-12">
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label htmlFor="employeeNumber">{translate('page.staff_number')}:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label htmlFor="month" style={{ paddingTop: 5 }}>{translate('page.month')}:</label>
                                    </div>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control" name="month" id="employeedatepicker4" defaultValue={this.formatDate(Date.now())} ref="month" placeholder={translate('page.month')} data-date-format="mm-yyyy" autoComplete="off" />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <center>
                                            <button type="submit" className="btn btn-success" title={translate('page.add_search')} onClick={this.handleSunmitSearch} >{translate('page.add_search')} </button></center>
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ paddingRight: 0 }}>
                                    <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title={translate('sabbatical.add_sabbatical_title')} data-toggle="modal" data-target="#modal-addNewSabbatical">{translate('sabbatical.add_sabbatical')}</button>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "10%" }}>{translate('table.employee_number')}</th>
                                            <th style={{ width: "14%" }}>{translate('table.employee_name')}</th>
                                            <th style={{ width: "9%" }}>{translate('table.start_date')}</th>
                                            <th style={{ width: "9%" }}>{translate('table.end_date')}</th>
                                            <th>{translate('sabbatical.reason')}</th>
                                            <th style={{ width: "12%" }}>{translate('table.unit')}</th>
                                            <th style={{ width: "10%" }}>{translate('table.position')}</th>
                                            <th style={{ width: "11%" }}>{translate('table.status')}</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>
                                                <ActionColumn
                                                    columnName={translate('table.action')}
                                                    hideColumn={false}
                                                    setLimit={this.setLimit}
                                                />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(typeof listSabbatical === 'undefined' || listSabbatical.length === 0) ? <tr><td colSpan={9}><center>{translate('table.no_data')}</center></td></tr> :
                                            listSabbatical.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{x.employee.employeeNumber}</td>
                                                    <td>{x.employee.fullName}</td>
                                                    <td>{x.startDate}</td>
                                                    <td>{x.endDate}</td>
                                                    <td>{x.reason}</td>
                                                    <td>P KTTT ViaVet</td>
                                                    <td>Nhân viên</td>
                                                    <td>{x.status}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <ModalEditSabbatical data={x} />
                                                        <DeleteNotification
                                                            content={{
                                                                title: "Xoá thông tin nghỉ phép",
                                                                btnNo: translate('confirm.no'),
                                                                btnYes: translate('confirm.yes'),
                                                            }}
                                                            data={{
                                                                id: x._id,
                                                                info: x.startDate.replace(/-/gi, "/") + " - " + x.endDate.replace(/-/gi, "/")
                                                            }}
                                                            func={this.props.deleteSabbatical}
                                                        />
                                                    </td>
                                                </tr>))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <ModalAddSabbatical />
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { sabbatical, department } = state;
    return { sabbatical, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListSabbatical: SabbaticalActions.getListSabbatical,
    deleteSabbatical: SabbaticalActions.deleteSabbatical,
};

const connectedListSabbatical = connect(mapState, actionCreators)(withTranslate(Sabbatical));
export { connectedListSabbatical as Sabbatical };