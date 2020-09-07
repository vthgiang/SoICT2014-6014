import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';

import { AnnualLeaveActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';


class ManageLeaveApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataStatus: 0,
            status: ['process'],
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getDepartmentsThatUserIsDean();
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     */
    formatDate2(date) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [year, month, day].join('-');
        }
        return date;
    };

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value :Tháng tìm kiếm
     */
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            month: value
        });
    }

    /**
     * Function lưu giá trị status vào state khi thay đổi
     * @param {*} value 
     */
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            status: value
        })
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        this.props.searchAnnualLeaves(this.state);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let departmentsThatUserIsDean = this.props.department.departmentsThatUserIsDean;
        if (this.state.dataStatus === 0 && departmentsThatUserIsDean && departmentsThatUserIsDean.length !== 0) {
            departmentsThatUserIsDean = departmentsThatUserIsDean.map(x => x._id);
            this.props.searchAnnualLeaves({ ...this.state, organizationalUnits: departmentsThatUserIsDean });
            this.setState({
                dataStatus: 1,
                organizationalUnits: departmentsThatUserIsDean,
            })
            return false;
        }
        return true;
    };

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng hiện thị
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchAnnualLeaves(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trạng hiện tại cần hiện thị
     */
    setPage = async (pageNumber) => {
        let { limit } = this.state;
        let page = (pageNumber - 1) * limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchAnnualLeaves(this.state);
    };

    handleAcceptApplication = (value) => {
        let startDateNew = this.formatDate2(value.startDate);
        let endDateNew = this.formatDate2(value.endDate);

        Swal.fire({
            html: `<h4 style="color: red"><div>${'Chấp nhận đơn xin nghỉ'}</div> <div>"${this.formatDate(value.startDate)} - ${this.formatDate(value.endDate)}" ?</div></h4>`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.translate('general.no'),
            confirmButtonText: this.props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                this.props.updateAnnualLeave(value._id, { ...value, startDate: startDateNew, endDate: endDateNew, status: 'pass', approvedApplication: true })
            }
        })
    };

    handleRefuseApplication = (value) => {
        let startDateNew = this.formatDate2(value.startDate);
        let endDateNew = this.formatDate2(value.endDate);

        Swal.fire({
            html: `<h4 style="color: red"><div>${'Từ chối đơn xin nghỉ'}</div> <div>"${this.formatDate(value.startDate)} - ${this.formatDate(value.endDate)}" ?</div></h4>`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.translate('general.no'),
            confirmButtonText: this.props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                this.props.updateAnnualLeave(value._id, { ...value, startDate: startDateNew, endDate: endDateNew, status: 'faile', approvedApplication: true })
            }
        })
    }

    render() {
        const { translate, annualLeave } = this.props;
        const { month, status, limit, page, currentRow } = this.state;

        let listAnnualLeaves = [];
        if (annualLeave.isLoading === false) {
            listAnnualLeaves = annualLeave.listAnnualLeaves;
        };

        let pageTotal = ((annualLeave.totalList % limit) === 0) ?
            parseInt(annualLeave.totalList / limit) :
            parseInt((annualLeave.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Tháng */}
                        <div className="form-group">
                            <label style={{ width: 'auto' }}>{translate('human_resource.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(month, true)}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label style={{ width: 'auto' }}>{translate('human_resource.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_status'), allSelectedText: translate('human_resource.all_status') }}
                                onChange={this.handleStatusChange}
                                value={status}
                                items={[
                                    { value: "pass", text: translate('human_resource.annual_leave.status.pass') },
                                    { value: "process", text: translate('human_resource.annual_leave.status.process') },
                                    { value: "faile", text: translate('human_resource.annual_leave.status.faile') }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        {/* Button tìm kiếm */}
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                                <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                                <th>{translate('human_resource.annual_leave.table.reason')}</th>
                                <th>{translate('human_resource.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.annual_leave.table.action')}
                                    <DataTableSetting
                                        tableId="annual-leave-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('human_resource.staff_name'),
                                            translate('human_resource.annual_leave.table.start_date'),
                                            translate('human_resource.annual_leave.table.end_date'),
                                            translate('human_resource.unit'),
                                            translate('human_resource.annual_leave.table.reason'),
                                            translate('human_resource.status')
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listAnnualLeaves && listAnnualLeaves.length !== 0 &&
                                listAnnualLeaves.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.employeeNumber}</td>
                                        <td>{x.employee.fullName}</td>
                                        <td>{this.formatDate(x.startDate)}</td>
                                        <td>{this.formatDate(x.endDate)}</td>
                                        <td>{x.reason}</td>
                                        <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            {(x.status === 'process' || x.status === "faile") &&
                                                <a onClick={() => this.handleAcceptApplication(x)} className="add_circle" style={{ width: '5px' }} title={"Chấp nhận đơn xin nghỉ"}><i className="material-icons">check</i></a>}
                                            {(x.status === 'process' || x.status === "pass") &&
                                                <a onClick={() => this.handleRefuseApplication(x)} className="delete" style={{ width: '5px' }} title={"Từ chối đơn xin nghỉ"}><i className="material-icons">clear</i></a>}
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {annualLeave.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listAnnualLeaves || listAnnualLeaves.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
            </div >
        );
    }
};

function mapState(state) {
    const { annualLeave, department } = state;
    return { annualLeave, department };
};

const actionCreators = {
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    updateAnnualLeave: AnnualLeaveActions.updateAnnualLeave,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
};

const leaveApplication = connect(mapState, actionCreators)(withTranslate(ManageLeaveApplication));
export { leaveApplication as ManageLeaveApplication };