import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';
import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { DisciplineActions } from '../../commendation-discipline/redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

import { SelectMulti, DatePicker } from '../../../../common-components';
class EmployeeDashBoardHeader extends Component {
    constructor(props) {
        super(props);
        let partMonth = this.formatDate(Date.now(), true).split('-');
        let month = [partMonth[1], partMonth[0]].join('-');
        this.state = {
            organizationalUnits: null,
            month: month
        }
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
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

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllEmployee({ organizationalUnits: this.state.organizationalUnits, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListPraise({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListDiscipline({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
    }

    // function bắt sự kiện thay đổi unit
    handleSelectOrganizationalUnit = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    };

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        let partMonth = value.split('-');
        value = [partMonth[1], partMonth[0]].join('-');
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        if (this.state.month === "-") {
            await this.setState({
                ...this.state,
                month: ""
            })
        }
        this.props.getAllEmployee({ organizationalUnits: this.state.organizationalUnits, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListPraise({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.getListDiscipline({ organizationalUnits: this.state.organizationalUnits, month: this.state.month });
        this.props.DisRenderAgePyramidChart();
    }
    render() {
        const { employeesManager, department, discipline, annualLeave, translate } = this.props;
        const { organizationalUnits, month } = this.state;
        return (
            <React.Fragment>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnit"
                            items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
                            options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                            onChange={this.handleSelectOrganizationalUnit}
                        >
                        </SelectMulti>
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.month')}</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            value={this.formatDate(Date.now(), true)}
                            onChange={this.handleMonthChange}
                        />
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Số nhân viên</span>
                                <span className="info-box-number">
                                    {employeesManager.totalEmployeeOfOrganizationalUnits === '' ? employeesManager.totalAllEmployee : employeesManager.totalEmployeeOfOrganizationalUnits}
                                </span>
                                <a href={`/hr-list-employee?organizationalUnits=${organizationalUnits}`} >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>

                            <div className="info-box-content" >
                                <span className="info-box-text">Số khen thưởng</span>
                                <span className="info-box-number">{discipline.totalListCommendation}/{discipline.totalListCommendationOfYear}</span>
                                <a href={`/hr-discipline?page=commendation?organizationalUnits=${organizationalUnits}?month=${month}`} >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>

                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số kỷ luật</span>
                                <span className="info-box-number">{discipline.totalListDiscipline}/{discipline.totalListDisciplineOfYear}</span>
                                <a href={`/hr-discipline?page=discipline?organizationalUnits=${organizationalUnits}?month=${month}`} >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-calendar-times-o"></i></span>
                            <div className="info-box-content" style={{ paddingBottom: 0 }}>
                                <span className="info-box-text">Số nghỉ phép</span>
                                <span className="info-box-number">{annualLeave.totalList}/{annualLeave.totalListAnnualLeavesOfYear}</span>
                                <a href={`hr-annual-leave?organizationalUnits=${organizationalUnits}?month=${month}`} >Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { employeesManager, annualLeave, discipline, department } = state;
    return { employeesManager, annualLeave, discipline, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
};

const employeeDashBoardHeader = connect(mapState, actionCreators)(withTranslate(EmployeeDashBoardHeader));
export { employeeDashBoardHeader as EmployeeDashBoardHeader };