import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TabEmployeeCapacity } from './combinedContent';
import { TabHumanResource, TabSalary, TabAnualLeave } from '../../human-resource/employee-dashboard/components/combinedContent';

import { DatePicker, SelectMulti, ApiImage, LazyLoadComponent, forceCheckOrVisible } from '../../../common-components';

import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { AnnualLeaveActions } from '../../human-resource/annual-leave/redux/actions';
import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions';
import { SalaryActions } from '../../human-resource/salary/redux/actions';

class MainDashboardUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: this.formatDate(Date.now(), true),
            organizationalUnits: [this.props.childOrganizationalUnit[0].id],
            arrayUnitShow: [this.props.childOrganizationalUnit[0].id],
            actionSearch: true
        }
    };

    componentDidMount() {
        const { organizationalUnits, month } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: organizationalUnits, month: newMonth });
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: newMonth });

        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: organizationalUnits, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });
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
     * Function bắt sự kiện thay đổi đơn vị
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            arrayUnitShow: value,
        });

    }

    /**
     * Function bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng
     */
    handleSelectMonth = (value) => {
        this.setState({
            month: value
        })
    };

    /** Bắt sự kiện phân tích dữ liệu */
    handleUpdateData = () => {
        let { organizationalUnits, month, arrayUnitShow } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        this.setState({
            actionSearch: !this.state.actionSearch,
            organizationalUnits: arrayUnitShow,
        });

        this.props.getAllEmployee({ organizationalUnits: arrayUnitShow, status: 'active' });
        this.props.searchAnnualLeaves({ organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.getListPraise({ organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: arrayUnitShow, month: newMonth });

        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

    }

    /** Bắt sự kiện chuyển tab  */
    handleNavTabs = (value) => {
        if (!value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }


    render() {
        const { translate, department, } = this.props;

        const { childOrganizationalUnit } = this.props;

        const { month, organizationalUnits, actionSearch, arrayUnitShow } = this.state;

        let allOrganizationalUnits = department.list.map(x => x._id);

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectMulti id="multiSelectOrganizationalUnitInDashboardUnit"
                                items={childOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                onChange={this.handleSelectOrganizationalUnit}
                                value={arrayUnitShow}
                            >
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                            <DatePicker
                                id="monthInDashboardUnit"
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleSelectMonth}
                                deleteValue={false}
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-tasks"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số công việc</span>
                                    <span className="info-box-number">
                                        50
                                    </span>
                                    <a style={{ cursor: 'pointer' }} >Xem chi tiết <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-yellow"><i className="fa fa-tag"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Kết quả KPI</span>
                                    <span className="info-box-number">
                                        80
                                    </span>
                                    <a style={{ cursor: 'pointer' }} >Xem chi tiết <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số khen thưởng</span>
                                    <span className="info-box-number">
                                        25
                                    </span>
                                    <a style={{ cursor: 'pointer' }} >Xem chi tiết <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số kỷ luật</span>
                                    <span className="info-box-number">
                                        25
                                    </span>
                                    <a style={{ cursor: 'pointer' }} >Xem chi tiết <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#employee-capacity" data-toggle="tab" onClick={() => this.handleNavTabs()}>Năng lực nhân viên</a></li>
                            <li><a href="#human-resourse" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Tổng quan nhân sự</a></li>
                            <li><a href="#annualLeave" data-toggle="tab" onClick={() => this.handleNavTabs()}>Nghỉ phép-Tăng ca</a></li>
                            <li><a href="#salary" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Lương thưởng nhân viên</a></li>
                        </ul>
                        <div className="tab-content ">
                            {/* Tab năng lực nhân viên*/}
                            <div className="tab-pane active" id="employee-capacity">
                                <LazyLoadComponent>
                                    <TabEmployeeCapacity organizationalUnits={organizationalUnits} month={month} allOrganizationalUnits={allOrganizationalUnits} />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab tổng quan nhân sự*/}
                            <div className="tab-pane" id="human-resourse">
                                <TabHumanResource childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={month} actionSearch={actionSearch} />
                            </div>

                            {/* Tab nghỉ phép tăng ca*/}
                            <div className="tab-pane" id="annualLeave">
                                <TabAnualLeave />
                            </div>

                            {/* Tab lương thưởng*/}
                            <div className="tab-pane" id="salary">
                                <TabSalary organizationalUnits={organizationalUnits} monthShow={month} />
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
    searchSalary: SalaryActions.searchSalary,
};

const mainDashboardUnit = connect(mapState, actionCreators)(withTranslate(MainDashboardUnit));
export { mainDashboardUnit as MainDashboardUnit };