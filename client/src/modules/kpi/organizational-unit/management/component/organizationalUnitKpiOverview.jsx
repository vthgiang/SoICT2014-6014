import React, {useEffect, useState} from 'react';
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

function KPIUnitManager(props) {
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

    var tableId = "table-org-kpi-management";
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;
    const stateFromOrganizationalUnitKpiDashboard = JSON.parse(localStorage.getItem("stateFromOrganizationalUnitKpiDashboard"));
    localStorage.removeItem("stateFromOrganizationalUnitKpiDashboard");

    const { user, managerKpiUnit, dashboardEvaluationEmployeeKpiSet, translate } = props;

    const [state, setState] = useState({
        tableId,
        showModalCopy: "",
        currentRole: localStorage.getItem("currentRole"),
        status: stateFromOrganizationalUnitKpiDashboard?.status ?? -1,
        organizationalUnit: stateFromOrganizationalUnitKpiDashboard?.organizationalUnit ?? [],
        startDate: stateFromOrganizationalUnitKpiDashboard?.startDate ?? new Date([startYear, startMonth].join('-')),
        endDate: stateFromOrganizationalUnitKpiDashboard?.endDate ?? new Date([year, endMonth].join('-')),
        infosearch: {
            role: localStorage.getItem("currentRole"),
            status: stateFromOrganizationalUnitKpiDashboard?.status ?? -1,
            startDate: stateFromOrganizationalUnitKpiDashboard?.startDate ?? new Date([startYear, startMonth].join('-')),
            endDate: stateFromOrganizationalUnitKpiDashboard?.endDate ?? new Date([year, endMonth].join('-')),
            organizationalUnit: stateFromOrganizationalUnitKpiDashboard?.organizationalUnit ?? [],
            perPage: limit,
            page: 1
        },
        defaultStartDate: stateFromOrganizationalUnitKpiDashboard?.defaultStartDate ?? [startMonth, startYear].join('-'),
        defaultEndDate: stateFromOrganizationalUnitKpiDashboard?.defaultEndDate ?? [endMonth, year].join('-'),
    });
    const { startDate, endDate, status, 
        errorOnDate, infosearch, organizationalUnit, 
        defaultStartDate, defaultEndDate, currentRole
    } = state;

    useEffect(()=>{
        props.getDepartment();
        props.getAllKPIUnit(state.infosearch);
        props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }, [])

    useEffect(()=>{
        if (organizationalUnit?.length === 0 && user && user.userdepartments) {
            const unit = [user.userdepartments._id];
            setState ({
                ...state,
                organizationalUnit: unit,
            })
        }
    }, [state.organizationalUnit, props.user, props.user.userdepartments])

    useEffect(()=>{
        if (currentRole !== localStorage.getItem('currentRole')) {
            props.getAllKPIUnit({
                ...infosearch,
                role: localStorage.getItem("currentRole"),
                organizationalUnit: []
            });
            props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem('currentRole'));

                setState ({
                    ...state,
                    currentRole: localStorage.getItem('currentRole')
            });

        }
    })

    const handleStartDateChange = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState( {
            ...state,
            startDate: month
        });
    }

    const checkStatusKPI = (status) => {
        if (status === 0) {
            return translate('kpi.organizational_unit.management.over_view.setting_up');
        } else if (status === 1) {
            return translate('kpi.organizational_unit.management.over_view.activated');
        }
    }

    const handleEndDateChange = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState ({
            ...state,
            endDate: month
        });
    }

    const handleStatus = async (value) => {
        await setState( {
            ...state,
            status: value

        })
    }

    function formatDate(date) {
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

    const handleShowEdit = async (id, idkpiunit, date) => {
        await setState( {
            ...state,
            id: id,
            idkpiunit: idkpiunit,
            date: date
        });
        window.$(`#dataResultTask`).modal('show');
    }

    const handleSelectOrganizationalUnit = (value) => {
        setState( {
            ...state,
            organizationalUnit: value
        })
    }


    const handleSearchData = async () => {
        await setState({
            ...state,
            infosearch: {
                ...state.infosearch,
                status: state.status,
                startDate: state.startDate,
                endDate: state.endDate,
                organizationalUnit: state.organizationalUnit
            }
        })
        const infosearch = {
            ...state.infosearch,
            status: state.status,
            startDate: state.startDate,
            endDate: state.endDate,
            organizationalUnit: state.organizationalUnit
        }

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
            props.getAllKPIUnit(infosearch);
        }
    };

    const setLimit = async (limit) => {
        if (Number(limit) !== state?.infosearch?.limit) {
            await setState( {
                    ...state,
                    infosearch: {
                        ...state.infosearch,
                        perPage: Number(limit)
                    }
            })
            const infosearch =  {
                ...state.infosearch,
                perPage: Number(limit)
            }

            props.getAllKPIUnit(infosearch);
        }
    }


    const handleGetDataPagination = async (index) => {
        await setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    page: index
                }
            }
        })
        const infosearch =  {
            ...state.infosearch,
            page: index
        }

        props.getAllKPIUnit(infosearch);
    }

    const showModalCopy = async (id) => {
        await setState(state => {
            return {
                ...state,
                showModalCopy: id
            }
        })
        window.$(`#copy-old-kpi-to-new-time-${id}`).modal("show")
    }

    const checkPermisson = (managerCurrentUnit) => {
        let currentRole = localStorage.getItem("currentRole");
        return (managerCurrentUnit && managerCurrentUnit.includes(currentRole));
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
   const  convertDataToExportData = (data, unitName) => {
        let fileName = "Bảng quản lý KPI đơn vị " + (unitName ? unitName : "");
        if (data) {
            data = data.map((x, index) => {

                let fullName = x?.creator?.name;
                let email = x?.creator?.email;
                let automaticPoint = (x?.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x?.automaticPoint);
                let employeePoint = (x?.employeePoint === null) ? "Chưa đánh giá" : parseInt(x?.employeePoint);
                let approverPoint = (x?.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x?.approvedPoint);
                let date = new Date(x?.date);
                let status = checkStatusKPI(x?.status);
                let numberTarget = parseInt(x?.kpis?.length);

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

    let listkpi, currentKPI, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint, organizationalUnitsOfUserLoading;
    let unitList, currentUnit, userdepartments, exportData;
    let childrenOrganizationalUnit = [], queue = [], currentOrganizationalUnit;

    if (user) userdepartments = user.userdepartments;
    if (user) {
        unitList = user.organizationalUnitsOfUser;
        organizationalUnitsOfUserLoading = user.organizationalUnitsOfUserLoading;

        currentUnit = unitList && unitList.filter(item =>
            item.managers.includes(state.currentRole)
            || item.deputyManagers.includes(state.currentRole)
            || item.employees.includes(state.currentRole));
    }

    if (managerKpiUnit) {
        listkpi = managerKpiUnit.kpis;
        if (listkpi && listkpi.length !== 0) {
            kpiApproved = listkpi.filter(item => item.status === 2);
            currentKPI = listkpi.filter(item => item.status !== 2);
            datachat1 = kpiApproved.map(item => {
                return { label: formatDate(item.date), y: item.result }
            }).reverse();
            targetA = kpiApproved.map(item => {

                return { label: formatDate(item.date), y: item.kpis[0].result }
            }).reverse();
            targetC = kpiApproved.map(item => {
                return { label: formatDate(item.date), y: item.kpis[1].result }
            }).reverse();
            targetOther = kpiApproved.map(item => {
                return { label: formatDate(item.date), y: (item.result - item.kpis[0].result - item.kpis[1].result) }
            }).reverse();
            misspoint = kpiApproved.map(item => {
                return { label: formatDate(item.date), y: (100 - item.result) }
            }).reverse();
        };
    }

    if (userdepartments && listkpi) {
        exportData = convertDataToExportData(listkpi, userdepartments.department);
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
                            date={state.date}
                            id={state.id}
                            idkpiunit={state.idkpiunit}
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
                                    onChange={handleSelectOrganizationalUnit}
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
                                        onChange={handleStatus}
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
                                    onChange={handleStartDateChange}
                                    dateFormat="month-year"
                                />
                                <ErrorLabel content={errorOnDate} />
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.management.over_view.end_date')}</label>
                                <DatePicker
                                    id="end_date"
                                    value={defaultEndDate}
                                    onChange={handleEndDateChange}
                                    dateFormat="month-year"
                                />
                                <ErrorLabel content={errorOnDate} />
                            </div>

                            <div className="form-group">
                                <button type="button" className="btn btn-success" onClick={() => handleSearchData()}>{translate('kpi.organizational_unit.management.over_view.search')}</button>
                            </div>

                            {exportData && <ExportExcel id="export-unit-kpi-management-overview" exportData={exportData} style={{ margin: 0 }} buttonName={"Xuất"} />}
                        </div>

                        <DataTableSetting
                            className="pull-right"
                            tableId={tableId}
                            tableContainerId="kpiTableContainer"
                            tableWidth="1300px"
                            columnArr={[
                                translate('kpi.organizational_unit.management.over_view.time'),
                                translate('task.task_management.col_organization'),
                                translate('kpi.organizational_unit.management.over_view.status'),
                                translate('kpi.organizational_unit.management.over_view.number_target'),
                                translate('kpi.organizational_unit.management.over_view.creator'),
                                translate('kpi.evaluation.employee_evaluation.system_evaluate'),
                                translate('kpi.evaluation.employee_evaluation.result_self_evaluate'),
                                translate('kpi.evaluation.employee_evaluation.evaluation_management'),
                                translate('kpi.organizational_unit.management.over_view.action')
                            ]}
                            setLimit={setLimit}
                            hideColumnOption={true}
                        />

                        {/* Danh sách các KPI của đơn vị */}
                        <table id={tableId} className="table table-hover table-bordered">
                            <thead>
                            <tr>
                                <th title={translate('kpi.organizational_unit.management.over_view.time')}>{translate('kpi.organizational_unit.management.over_view.time')}</th>
                                <th title={translate('task.task_management.col_organization')}>{translate('task.task_management.col_organization')}</th>
                                <th title={translate('kpi.organizational_unit.management.over_view.status')}>{translate('kpi.organizational_unit.management.over_view.status')}</th>
                                <th title={translate('kpi.organizational_unit.management.over_view.number_target')}>{translate('kpi.organizational_unit.management.over_view.number_target')}</th>
                                <th title={translate('kpi.organizational_unit.management.over_view.creator')}>{translate('kpi.organizational_unit.management.over_view.creator')}</th>
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
                                                <td>{formatDate(item.date)}</td>
                                                <td>{item.organizationalUnit && item.organizationalUnit.name}</td>
                                                <td>{checkStatusKPI(item.status)}</td>
                                                <td>{item.kpis.length}</td>
                                                <td>{item.creator && item.creator.name}</td>
                                                <td>{item.automaticPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.automaticPoint}</td>
                                                <td>{item.employeePoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.employeePoint}</td>
                                                <td>{item.approvedPoint === null ? translate('kpi.evaluation.employee_evaluation.not_evaluated_yet') : item.approvedPoint}</td>
                                                <td>
                                                    <a href={`#dataResultTask`}
                                                       data-toggle="modal"
                                                       data-backdrop="static"
                                                       data-keyboard="false"
                                                       title="Xem chi tiết KPI tháng này">
                                                        <i className="material-icons" onClick={() => handleShowEdit(item._id, item.organizationalUnit._id, item.date)}>view_list</i>
                                                    </a>

                                                    {checkPermisson(currentUnit && currentUnit[0] && currentUnit[0].managers)
                                                    && <a href="#abc" onClick={() => showModalCopy(item._id)} className="copy" data-toggle="modal" data-backdrop="static" data-keyboard="false" title="Thiết lập kpi tháng mới từ kpi tháng này">
                                                        <i className="material-icons">content_copy</i>
                                                    </a>
                                                    }
                                                    {state.showModalCopy === item._id
                                                        ? <ModalCopyKPIUnit 
                                                            kpiId={item._id} 
                                                            idunit={item.organizationalUnit._id} 
                                                            kpiunit={item} 
                                                            monthDefault={endMonth}
                                                        />
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
                            func={handleGetDataPagination}
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
export default connect(mapState, actionCreators)(withTranslate(KPIUnitManager));
