import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SabbaticalCreateForm, SabbaticalEditForm } from './combinedContent';
import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';

import { DepartmentActions } from '../../../super-admin-management/organizational-unit/redux/actions';
import { SabbaticalActions } from '../redux/actions';

class SabbaticalManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: null,
            position: null,
            employeeNumber: "",
            month: null,
            status: null,
            page: 0,
            limit: 5,
        }
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }
    componentDidMount() {
        this.props.getListSabbatical(this.state);
        this.props.getDepartment();
    }
    // Bắt sự kiện click chỉnh sửa thông tin nghỉ phép
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-sabbtical').modal('show');
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
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

    // Function lưu giá trị mã nhân viên vào state khi thay đổi
    handleMSNVChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            unit: value
        })
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        if (this.state.month === null) {
            await this.setState({
                ...this.state,
                month: this.formatDate(Date.now())
            })
        }
        this.props.getListSabbatical(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListSabbatical(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getListSabbatical(this.state);
    }

    render() {
        const { list } = this.props.department;
        const { translate, sabbatical } = this.props;
        var listSabbatical = "", listPosition = [];
        if (this.state.unit !== null) {
            let unit = this.state.unit;
            unit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let position = [
                            { _id: x.dean._id, name: x.dean.name },
                            { _id: x.vice_dean._id, name: x.vice_dean.name },
                            { _id: x.employee._id, name: x.employee.name }
                        ]
                        listPosition = listPosition.concat(position)
                    }
                })
            })
        }
        if (this.props.sabbatical.isLoading === false) {
            listSabbatical = this.props.sabbatical.listSabbatical;
        }
        var pageTotal = ((this.props.sabbatical.totalList % this.state.limit) === 0) ?
            parseInt(this.props.sabbatical.totalList / this.state.limit) :
            parseInt((this.props.sabbatical.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <SabbaticalCreateForm />
                    <div className="form-group">
                        <h4 className="box-title">{translate('sabbatical.list_sabbatical')}: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_position'), allSelectedText: translate('page.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleMSNVChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />

                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "pass", text: translate('sabbatical.pass') },
                                    { value: "process", text: translate('sabbatical.process') },
                                    { value: "faile", text: translate('sabbatical.faile') }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="sabbatical-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('table.employee_number')}</th>
                                <th style={{ width: "14%" }}>{translate('table.employee_name')}</th>
                                <th style={{ width: "9%" }}>{translate('table.start_date')}</th>
                                <th style={{ width: "9%" }}>{translate('table.end_date')}</th>
                                <th>{translate('sabbatical.reason')}</th>
                                <th style={{ width: "12%" }}>{translate('table.unit')}</th>
                                <th style={{ width: "14%" }}>{translate('table.position')}</th>
                                <th style={{ width: "11%" }}>{translate('table.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="sabbatical-table"
                                        columnArr={[
                                            translate('table.employee_number'),
                                            translate('table.employee_name'),
                                            translate('table.start_date'),
                                            translate('table.end_date'),
                                            translate('sabbatical.reason'),
                                            translate('table.unit'),
                                            translate('table.position'),
                                            translate('table.status')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listSabbatical !== 'undefined' && listSabbatical.length !== 0) &&
                                listSabbatical.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.employeeNumber}</td>
                                        <td>{x.employee.fullName}</td>
                                        <td>{x.startDate}</td>
                                        <td>{x.endDate}</td>
                                        <td>{x.reason}</td>
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
                                        <td>{translate(`sabbatical.${x.status}`)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('sabbatical.edit_sabbatical')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('sabbatical.delete_sabbatical')}
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
                    {sabbatical.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listSabbatical === 'undefined' || listSabbatical.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <SabbaticalEditForm
                        _id={this.state.currentRow._id}
                        employeeNumber={this.state.currentRow.employee.employeeNumber}
                        endDate={this.state.currentRow.endDate}
                        startDate={this.state.currentRow.startDate}
                        reason={this.state.currentRow.reason}
                        status={this.state.currentRow.status}
                    />
                }
            </div >
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

const connectedListSabbatical = connect(mapState, actionCreators)(withTranslate(SabbaticalManager));
export { connectedListSabbatical as SabbaticalManager };