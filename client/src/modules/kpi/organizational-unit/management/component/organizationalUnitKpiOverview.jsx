import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { managerActions } from '../redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';

import { ModalDetailKPI } from './organizationalUnitKpiDetailModal';
import { ModalCopyKPIUnit } from './organizationalUnitKpiCopyModal';

import { DataTableSetting, ErrorLabel, DatePicker, SelectBox, ExportExcel, SelectMulti, PaginateBar } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

class KPIUnitManager extends Component {
    constructor(props) {
        super(props);

        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
        let startMonth, endMonth, startYear;

        if (month > 1) {
            startMonth = month - 1;
            startYear = year;
        } else {
            startMonth = month - 1 + 12;
            startYear = year - 1;
        }
        if (startMonth < 10)
            startMonth = '0' + startMonth;
        if (month < 10) {
            endMonth = '0' + month;
        } else {
            endMonth = month;
        }

        const tableId = "table-org-kpi-management";
        const defaultConfig = { limit: 20 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            tableId,
            showModalCopy: "",
            currentRole: localStorage.getItem("currentRole"),
            status: -1,
            organizationalUnit: [],
            startDate: new Date([startYear, startMonth].join('-')),
            endDate: new Date([year, endMonth].join('-')),
            infosearch: {
                role: localStorage.getItem("currentRole"),
                status: -1,
                startDate: new Date([startYear, startMonth].join('-')),
                endDate: new Date([year, endMonth].join('-')),
                organizationalUnit: [],
                perPage: limit,
                page: 1
            },
            defaultStartDate: [startMonth, startYear].join('-'),
            defaultEndDate: [endMonth, year].join('-'),
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllKPIUnit(this.state.infosearch);
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        const { currentRole, infosearch, startDate, endDate, status, organizationalUnit } = this.state;

        if (currentRole !== localStorage.getItem('currentRole')) {
            this.props.getAllKPIUnit({
                ...infosearch,
                role: localStorage.getItem("currentRole"),
                organizationalUnit: []
            });
            this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem('currentRole'));

            this.setState(state => {
                return {
                    ...state,
                    currentRole: localStorage.getItem('currentRole')
                }
            })

            return true;
        }

        // Không re-render khi lựa chọn tháng ở DatePiker
        if (nextState.startDate !== startDate
            || nextState.endDate !== endDate
            || nextState.status !== status
            || nextState.organizationalUnit !== organizationalUnit
        ) {
            return false;
        }

        return true;
    }

    handleStartDateChange = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        this.setState(state => {
            return {
                ...state,
                startDate: month
            }
        });
    }

    checkStatusKPI = (status) => {
        const { translate } = this.props
        if (status === 0) {
            return translate('kpi.organizational_unit.management.over_view.setting_up');
        } else if (status === 1) {
            return translate('kpi.organizational_unit.management.over_view.activated');
        }
    }

    handleEndDateChange = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        this.setState(state => {
            return {
                ...state,
                endDate: month
            }
        });
    }

    handleUser = (value) => {
        this.setState(state => {
            return {
                ...state,
                userkpi: value,
            }
        })
    }

    handleStatus = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                status: value
            }
        })
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    handleShowEdit = async (id, idkpiunit, date) => {
        await this.setState(state => {
            return {
                ...state,
                id: id,
                idkpiunit: idkpiunit,
                date: date
            }
        });
        window.$(`#dataResultTask`).modal('show');
    }

    handleSelectOrganizationalUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                organizationalUnit: value
            }
        })
    }

    
    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    status: this.state.status,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    organizationalUnit: this.state.organizationalUnit
                }
            }
        })
        const { infosearch, startDate, endDate } = this.state;
        const { translate } = this.props;

        let startDateIso, endDateIso;

        if (startDate && endDate) {
            startDateIso = new Date(startDate);
            endDateIso = new Date(endDate);
        }

        if (startDateIso && endDateIso && startDateIso.getTime() > endDateIso.getTime()) {
            Swal.fire({
                title: translate('kpi.organizational_unit.management.over_view.alert_search.search'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.management.over_view.alert_search.confirm')
            })
        } else {
            this.props.getAllKPIUnit(infosearch);
        }
    };

    setLimit = async (limit) => {
        if (Number(limit) !== this.state?.infosearch?.limit) {
            await this.setState(state => {
                return {
                    ...state,
                    infosearch: {
                        ...state.infosearch,
                        perPage: Number(limit)
                    }
                }
            })

            let { infosearch } = this.state;
            this.props.getAllKPIUnit(infosearch);
        }
    }

    
    handleGetDataPagination = async (index) => {
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    page: index
                }
            }
        })

        let { infosearch } = this.state;
        this.props.getAllKPIUnit(infosearch);
    }

    showModalCopy = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModalCopy: id
            }
        })
        window.$(`#copy-old-kpi-to-new-time-${id}`).modal("show")
    }

    checkPermisson = (managerCurrentUnit) => {
        let currentRole = localStorage.getItem("currentRole");
        return (managerCurrentUnit && managerCurrentUnit.includes(currentRole));
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data, unitName) => {
        let fileName = "Bảng quản lý KPI đơn vị " + (unitName ? unitName : "");
        if (data) {
            data = data.map((x, index) => {

                let fullName = x.creator.name;
                let email = x.creator.email;
                let automaticPoint = (x.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.employeePoint);
                let approverPoint = (x.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.approvedPoint);
                let date = new Date(x.date);
                let status = this.checkStatusKPI(x.status);
                let numberTarget = parseInt(x.kpis.length);

                return {
                    STT: index + 1,
                    fullName: fullName,
                    email: email,
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    time: date,
                    numberTarget: numberTarget
                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "fullName", value: "Người tạo" },
                                { key: "email", value: "Email người tạo" },
                                { key: "time", value: "Thời gian" },
                                { key: "status", value: "Trạng thái" },
                                { key: "numberTarget", value: "Số lượng mục tiêu" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    render() {
        const { user, managerKpiUnit, dashboardEvaluationEmployeeKpiSet, translate } = this.props;
        const { startDate, endDate, status, errorOnDate, infosearch, organizationalUnit, defaultStartDate, defaultEndDate, tableId } = this.state;

        let listkpi, currentKPI, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint, organizationalUnitsOfUserLoading;
        let unitList, currentUnit, userdepartments, exportData;
        let childrenOrganizationalUnit = [], queue = [], currentOrganizationalUnit;

        if (user) userdepartments = user.userdepartments;
        if (user) {
            unitList = user.organizationalUnitsOfUser;
            organizationalUnitsOfUserLoading = user.organizationalUnitsOfUserLoading;

            currentUnit = unitList && unitList.filter(item =>
                item.managers.includes(this.state.currentRole)
                || item.deputyManagers.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole));
        }

        if (managerKpiUnit) {
            listkpi = managerKpiUnit.kpis;
            if (listkpi && listkpi.length !== 0) {
                kpiApproved = listkpi.filter(item => item.status === 2);
                currentKPI = listkpi.filter(item => item.status !== 2);
                datachat1 = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.result }
                }).reverse();
                targetA = kpiApproved.map(item => {

                    return { label: this.formatDate(item.date), y: item.kpis[0].result }
                }).reverse();
                targetC = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.kpis[1].result }
                }).reverse();
                targetOther = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (item.result - item.kpis[0].result - item.kpis[1].result) }
                }).reverse();
                misspoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (100 - item.result) }
                }).reverse();
            };
        }

        if (userdepartments && listkpi) {
            exportData = this.convertDataToExportData(listkpi, userdepartments.department);
        }


        // Khởi tạo selectbox đơn vị
        if (dashboardEvaluationEmployeeKpiSet) {
            currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }
        if (currentOrganizationalUnit) {
            childrenOrganizationalUnit.push(currentOrganizationalUnit);
            queue.push(currentOrganizationalUnit);
            while (queue.length > 0) {
                let v = queue.shift();
                if (v.children) {
                    for (let i = 0; i < v.children.length; i++) {
                        let u = v.children[i];
                        queue.push(u);
                        childrenOrganizationalUnit.push(u);
                    }
                }
            }
        }

        return (
            <React.Fragment>
                <div className="box">
                    {unitList && unitList.length !== 0
                        ? <div className="box-body qlcv">
                            <ModalDetailKPI
                                date={this.state.date}
                                id={this.state.id}
                                idkpiunit={this.state.idkpiunit}
                            />

                            {/* TÌm kiếm theo đơn vị, trạng thái */}
                            <div className="form-inline">
                                <div className="form-group">
                                    <label>{translate('task.task_management.department')}</label>
                                    {childrenOrganizationalUnit && childrenOrganizationalUnit.length !== 0
                                        && <SelectMulti
                                            key="multiSelectUnit1"
                                            id="multiSelectUnit1"
                                            items={childrenOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                            onChange={this.handleSelectOrganizationalUnit}
                                            options={{
                                                nonSelectedText: translate('task.task_management.select_department'),
                                                allSelectedText: translate(`task.task_management.select_all_department`),
                                            }}
                                            value={organizationalUnit}
                                        >
                                        </SelectMulti>
                                    }
                                </div>
                                <div className="form-group">
                                    <label>{translate('kpi.organizational_unit.management.over_view.status')}</label>
                                    {
                                        <SelectBox
                                            id={`select-status-kpi`}
                                            className="form-control select2"
                                            items={[{ value: -1, text: translate('kpi.organizational_unit.management.over_view.all_status') }, { value: 0, text: translate('kpi.organizational_unit.management.over_view.setting_up') }, { value: 1, text: translate('kpi.organizational_unit.management.over_view.activated') },]}
                                            onChange={this.handleStatus}
                                            style={{ width: "100%" }}
                                            value={status}
                                        />
                                    }
                                </div>
                            </div>

                            {/* TÌm kiếm theo tháng */}
                            <div className="form-inline">
                                <div className={`form-group ${!errorOnDate ? "" : "has-error"}`}>
                                    <label>{translate('kpi.organizational_unit.management.over_view.start_date')}</label>
                                    <DatePicker
                                        id="start_date"
                                        value={defaultStartDate}
                                        onChange={this.handleStartDateChange}
                                        dateFormat="month-year"
                                    />
                                    <ErrorLabel content={errorOnDate} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('kpi.organizational_unit.management.over_view.end_date')}</label>
                                    <DatePicker
                                        id="end_date"
                                        value={defaultEndDate}
                                        onChange={this.handleEndDateChange}
                                        dateFormat="month-year"
                                    />
                                    <ErrorLabel content={errorOnDate} />
                                </div>

                                <div className="form-group">
                                    <label></label>
                                    <button type="button" className="btn btn-success" onClick={() => this.handleSearchData()}>{translate('kpi.organizational_unit.management.over_view.search')}</button>
                                </div>

                                {exportData && <ExportExcel id="export-unit-kpi-management-overview" exportData={exportData} style={{ marginRight: 15, marginTop: 5 }} />}
                            </div>



                            <DataTableSetting
                                className="pull-right"
                                tableId={tableId}
                                tableContainerId="kpiTableContainer"
                                tableWidth="1300px"
                                columnArr={[
                                    'Người tạo',
                                    'Thời gian',
                                    'Trạng thái',
                                    'Số lượng mục tiêu',
                                    'Kết quả đánh giá',
                                    'Xem chi tiết',
                                    'Tạo KPI tháng mới',
                                    'Cập nhật'
                                ]}
                                setLimit={this.setLimit}
                                hideColumnOption={true}
                            />

                            {/* Danh sách các KPI của đơn vị */}
                            <table id={tableId} className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th title={translate('kpi.organizational_unit.management.over_view.creator')}>{translate('kpi.organizational_unit.management.over_view.creator')}</th>
                                        <th title={translate('task.task_management.col_organization')}>{translate('task.task_management.col_organization')}</th>
                                        <th title={translate('kpi.organizational_unit.management.over_view.time')}>{translate('kpi.organizational_unit.management.over_view.time')}</th>
                                        <th title={translate('kpi.organizational_unit.management.over_view.status')}>{translate('kpi.organizational_unit.management.over_view.status')}</th>
                                        <th title={translate('kpi.organizational_unit.management.over_view.number_target')}>{translate('kpi.organizational_unit.management.over_view.number_target')}</th>
                                        <th title={translate('kpi.evaluation.employee_evaluation.system_evaluate')}>{translate('kpi.evaluation.employee_evaluation.system_evaluate')}</th>
                                        <th title={translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}>{translate('kpi.evaluation.employee_evaluation.result_self_evaluate')}</th>
                                        <th title={translate('kpi.evaluation.employee_evaluation.evaluation_management')}>{translate('kpi.evaluation.employee_evaluation.evaluation_management')}</th>
                                        <th title={translate('kpi.organizational_unit.management.over_view.action')}>{translate('kpi.organizational_unit.management.over_view.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (listkpi && listkpi.length !== 0)
                                            ? listkpi.map((item, index) => {
                                                if (item) {
                                                    return <tr key={index + 1}>
                                                        <td>{item.creator && item.creator.name}</td>
                                                        <td>{item.organizationalUnit && item.organizationalUnit.name}</td>
                                                        <td>{this.formatDate(item.date)}</td>
                                                        <td>{this.checkStatusKPI(item.status)}</td>
                                                        <td>{item.kpis.length}</td>
                                                        <td>{item.automaticPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.automaticPoint}</td>
                                                        <td>{item.employeePoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.employeePoint}</td>
                                                        <td>{item.approvedPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.approvedPoint}</td>
                                                        <td>
                                                            <a href={`#dataResultTask`}
                                                                data-toggle="modal"
                                                                data-backdrop="static"
                                                                data-keyboard="false"
                                                                title="Xem chi tiết KPI tháng này">
                                                                <i className="material-icons" onClick={() => this.handleShowEdit(item._id, item.organizationalUnit._id, item.date)}>view_list</i>
                                                            </a>

                                                            {this.checkPermisson(currentUnit && currentUnit[0] && currentUnit[0].managers)
                                                                && <a href="#abc" onClick={() => this.showModalCopy(item._id)} className="copy" data-toggle="modal" data-backdrop="static" data-keyboard="false" title="Thiết lập kpi tháng mới từ kpi tháng này">
                                                                    <i className="material-icons">content_copy</i>
                                                                </a>
                                                            }
                                                            {this.state.showModalCopy === item._id
                                                                ? <ModalCopyKPIUnit kpiId={item._id} idunit={item.organizationalUnit._id} kpiunit={item} />
                                                                : null
                                                            }
                                                        </td>
                                                    </tr>
                                                }
                                            }) : null
                                    }
                                </tbody>
                            </table>
                            {(listkpi && listkpi.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}

                            <PaginateBar
                                display={managerKpiUnit?.kpis?.length}
                                total={managerKpiUnit?.totalCountUnitKpiSet}
                                pageTotal={managerKpiUnit?.totalPageUnitKpiSet}
                                currentPage={infosearch?.page}
                                func={this.handleGetDataPagination}
                            />
                        </div>
                        : organizationalUnitsOfUserLoading
                        && <div className="box-body">
                            <h4>Bạn chưa có đơn vị</h4>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, managerKpiUnit, dashboardEvaluationEmployeeKpiSet } = state;
    return { user, managerKpiUnit, dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllKPIUnit: managerActions.getAllKPIUnit,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
};
const connectedKPIUnitManager = connect(mapState, actionCreators)(withTranslate(KPIUnitManager));
export { connectedKPIUnitManager as KPIUnitManager };