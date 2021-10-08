import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DatePicker, PaginateBar, InputTags, SelectMulti, TreeTable, ExportExcel, ToolTip } from '../../../../common-components';
import { getFormatDateFromTime } from '../../../../helpers/stringMethod';
import moment from 'moment';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../kpi/evaluation/dashboard/redux/actions';
import { taskManagementActions } from '../redux/actions';
import { getStorage } from '../../../../config';
import { ModalPerform } from '../../task-perform/component/modalPerform';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import parse from 'html-react-parser';
import { convertDataToExportData, getTotalTimeSheetLogs, formatPriority, formatStatus } from './functionHelpers';

function TaskManagementOfUnit(props) {
    const [state, setState] = useState(() => initState())
    const { tasks, user, translate, dashboardEvaluationEmployeeKpiSet } = props;
    const { selectBoxUnit, currentTaskId, currentPage, startDate,
        endDate, perPage, status, tags,
        organizationalUnit, tableId, selectedData, organizationalUnitRole
    } = state;

    function initState() {
        const tableId = "tree-table-task-management-of-unit";
        const defaultConfig = { limit: 20, hiddenColumns: ["3", "7", "8"] }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        return {
            organizationalUnit: null,
            perPage: limit,
            currentPage: 1,
            tableId,
            selectedData: [],
            currentTab: "responsible",
            status: ["inprocess", "wait_for_approval"],
            priority: [],
            special: [],
            name: "",
            startDate: "",
            endDate: "",
            organizationalUnitRole: ['management', 'collabration'],
            tags: []
        };
    }

    useEffect(() => {
        props.getDepartment();
        props.getAllDepartment();
        props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }, [])

    useEffect(() => {
        let { organizationalUnit, status, responsibleEmployees,
            accountableEmployees, creatorEmployees, perPage, currentPage, organizationalUnitRole
        } = state;

        if (organizationalUnit && !dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnitLoading) {
            setState({
                ...state,
                organizationalUnit: null
            })
        }

        if (!organizationalUnit && dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit) {
            let childrenOrganizationalUnit = [], queue = [], currentOrganizationalUnit;

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

            let units = childrenOrganizationalUnit.map(item => item.id);
            setState({
                ...state,
                organizationalUnit: [units?.[0]],
                selectBoxUnit: childrenOrganizationalUnit
            });
            let data = {
                unit: [units?.[0]],
                page: currentPage,
                perPage: perPage,
                status: status,
                priority: [],
                special: [],
                name: null,
                startDate: null,
                endDate: null,
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                creatorEmployees: creatorEmployees,
                organizationalUnitRole: organizationalUnitRole
            }
            props.getPaginatedTasksByOrganizationalUnit(data);
        }
    }, [state.organizationalUnit, dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnitLoading, dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit])

    useEffect(() => {
        window.$(`#modelPerformTask${state.currentTaskId}`).modal('show')
    }, [state.currentTaskId])

    const list_to_tree = (list) => {
        let map = {}, node, roots = [], i, newarr = [];
        for (i = 0; i < list.length; i += 1) {
            map[list[i]._id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }

        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parent !== null) {

                // if you have dangling branches check that map[node.parentId] exists
                if (map[node.parent._id] !== undefined) {
                    list[map[node.parent._id]].children.push(node);
                }
                else {
                    roots.push(node);
                }

            } else {
                roots.push(node);
            }
        }
        let change = (arr) => {
            arr.map(item => {
                newarr.push(item);
                change(item.children);
                return true;
            });
            return newarr;
        }
        let flat = change(roots).map(x => delete x.children && x);
        return flat;
    }

    const setLimit = (limit) => {
        if (Number(limit) !== state.perPage) {
            // Cập nhật số dòng trang trên một trang hiển thị
            setState({
                ...state,
                perPage: Number(limit)
            })
            // TODO: send query
            handleGetDataPerPage(Number(limit));
        }
    }

    const onSelectedRowsChange = (value) => {
        setState(state => {
            return {
                ...state,
                selectedData: value
            }
        })
    }

    const handleGetDataPagination = (index) => {
        let { organizationalUnit, status, priority, special, name,
            startDate, endDate, responsibleEmployees, tags,
            accountableEmployees, creatorEmployees, organizationalUnitRole, perPage
        } = state;

        if (state.currentPage !== index) {
            let data = {
                unit: organizationalUnit,
                page: index,
                perPage: perPage,
                status: status,
                priority: priority,
                special: special,
                name: name,
                startDate: startDate,
                endDate: endDate,
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                creatorEmployees: creatorEmployees,
                organizationalUnitRole: organizationalUnitRole,
                tags: tags
            }
            props.getPaginatedTasksByOrganizationalUnit(data);
        };
        setState({
            ...state,
            currentPage: index
        })
    }

    const handleDisplayType = (displayType) => {
        setState({
            ...state,
            displayType
        });
        switch (displayType) {
            case 'table':
                window.$('#tree-table-container').show();
                window.$('#tasks-list-tree').hide();
                break;
            default:
                window.$('#tree-table-container').hide();
                window.$('#tasks-list-tree').show();
                break;
        }
    }

    const handleGetDataPerPage = (perPage) => {
        let { organizationalUnit, status, priority, special, name,
            startDate, endDate, responsibleEmployees, tags,
            accountableEmployees, creatorEmployees, organizationalUnitRole
        } = state;
        let data = {
            unit: organizationalUnit,
            page: 1,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            creatorEmployees: creatorEmployees,
            organizationalUnitRole: organizationalUnitRole,
            tags: tags
        }
        props.getPaginatedTasksByOrganizationalUnit(data);

        setState({
            ...state,
            currentPage: 1,
            perPage: perPage
        })
    }

    const handleUpdateData = () => {
        const { translate } = props;
        let { organizationalUnit, status, priority, special, tags,
            name, startDate, endDate, perPage, organizationalUnitRole,
            responsibleEmployees, accountableEmployees, creatorEmployees
        } = state;

        let startMonth, endMonth;

        if (startDate && endDate) {
            startMonth = new Date(startDate);
            endMonth = new Date(endDate);
        }

        if (startMonth && endMonth && startMonth.getTime() > endMonth.getTime()) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        }
        else if (organizationalUnit && organizationalUnit.length !== 0) {
            props.getPaginatedTasksByOrganizationalUnit({
                unit: organizationalUnit,
                page: 1,
                perPage: perPage,
                status: status,
                priority: priority,
                special: special,
                name: name,
                startDate: startDate,
                endDate: endDate,
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                creatorEmployees: creatorEmployees,
                organizationalUnitRole: organizationalUnitRole,
                tags: tags
            });
        }

        setState({
            ...state,
            currentPage: 1
        })
    }

    const handleShowModal = (id) => {
        const { tasks } = props;
        const taskLength = tasks?.tasks?.length;
        let taskName;
        for (let i = 0; i < taskLength; i++) {
            if (tasks.tasks[i]._id === id) {
                taskName = tasks.tasks[i].name;
                break;
            }
        }

        setState(state => {
            return {
                ...state,
                currentTaskId: id,
                taskName
            }
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }

    const handleSelectOrganizationalUnit = (value) => {
        setState({
            ...state,
            organizationalUnit: value
        });
    }

    const handleSelectOrganizationalUnitRole = (value) => {
        setState({
            ...state,
            organizationalUnitRole: value
        });
    }

    const handleSelectStatus = (value) => {
        setState({
            ...state,
            status: value
        });
    }

    const handleSelectPriority = (value) => {
        setState({
            ...state,
            priority: value
        });
    }

    const handleSelectSpecial = (value) => {
        setState({
            ...state,
            special: value
        });
    }

    const handleChangeName = (e) => {
        let name = e.target.value;
        if (name === '') {
            name = null;
        }

        setState({
            ...state,
            name: name
        });
    }

    const handleChangeStartDate = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState({
            ...state,
            startDate: month
        });
    }

    const handleChangeEndDate = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState({
            ...state,
            endDate: month
        });
    }

    const handleChangeResponsibleEmployees = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            responsibleEmployees: value,
        })
    }

    const handleChangeAccountableEmployees = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            accountableEmployees: value,
        })
    }

    const handleChangeCreatorEmployees = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            creatorEmployees: value,
        })
    }

    const handleTaskTags = (value) => {
        setState({
            ...state,
            tags: value,
        })
    }

    const handleDelete = async (id) => {
        const { tasks, translate } = props;
        if (!Array.isArray(id)) {
            let currentTasks = tasks.tasks.find(task => task._id === id);
            let progress = currentTasks.progress;
            let action = currentTasks.taskActions.filter(item => item.creator); // Nếu công việc theo mẫu, chưa hoạt động nào được xác nhận => cho xóa
            Swal.fire({
                title: `Bạn có chắc chắn muốn xóa công việc "${currentTasks.name}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: props.translate('general.no'),
                confirmButtonText: props.translate('general.yes'),
            }).then((result) => {
                if (result.value) {
                    props.deleteTaskById(id);
                }
            })
        }

        else Swal.fire({
            title: `Bạn có chắc chắn muốn xóa các công việc đã chọn?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: props.translate('general.no'),
            confirmButtonText: props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.deleteTaskById(id);
            }
        })

    }

    const checkTaskRequestToClose = (task) => {
        const { translate } = props;
        let statusColor = "";
        switch (task.status) {
            case "inprocess":
                statusColor = "#385898";
                break;
            case "canceled":
                statusColor = "#e86969";
                break;
            case "delayed":
                statusColor = "#db8b0b";
                break;
            case "finished":
                statusColor = "#31b337";
                break;
            default:
                statusColor = "#333";
        }
        if (task.requestToCloseTask && task.requestToCloseTask.requestStatus === 1) {
            return (
                <div>
                    <span style={{ color: "#385898" }}>{translate('task.task_management.inprocess')}</span>&nbsp; - &nbsp;
                    <span style={{ color: "#333" }}>{translate('task.task_management.requested_to_close')}</span>
                </div>
            )
        }
        else {
            return (
                <div>
                    <span style={{ color: statusColor }}>{formatStatus(translate, task.status)}</span>
                </div>
            )
        }
    }

    const convertPriorityData = (priority) => {
        const { translate } = props;
        let priorityColor = "";
        switch (priority) {
            case 5:
                priorityColor = "#ff0707";
                break;
            case 4:
                priorityColor = "#ff5707";
                break;
            case 3:
                priorityColor = "#28A745";
                break;
            case 2:
                priorityColor = "#ffa707";
                break;
            default:
                priorityColor = "#808080"
        }
        return (
            <div >
                <span style={{ color: priorityColor }}> {formatPriority(translate, priority)}</span>
            </div>
        )
    }

    const convertProgressData = (progress = 0, startDate, endDate) => {
        let now = moment(new Date());
        let end = moment(endDate);
        let start = moment(startDate);
        let period = end.diff(start);
        let upToNow = now.diff(start);
        let barColor = "";
        if (now.diff(end) > 0) barColor = "red";
        else if (period * progress / 100 - upToNow >= 0) barColor = "lime";
        else barColor = "gold";
        return (
            <div >
                <div className="progress" style={{ backgroundColor: 'rgb(221, 221, 221)', textAlign: "right", borderRadius: '3px', position: 'relative' }}>
                    <span style={{ position: 'absolute', right: '1px', fontSize: '13px', marginRight: '5px' }}>{progress + '%'}</span>
                    <div role="progressbar" className="progress-bar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} style={{ width: `${progress + '%'}`, maxWidth: "100%", minWidth: "0%", backgroundColor: barColor }} >
                    </div>
                </div>
            </div>
        )
    }

    /**
    * Function kiểm tra action tương ứng cho các dòng đã chọn
    * @param {*} action : action cần kiểm tra
    */

    const validateAction = (action) => {
        const { selectedData } = state;
        if (selectedData.length === 0) return false;
        else for (let i = 0; i < selectedData.length; i++) {
            let actions = data.find(x => x._id === selectedData[i])?.action;
            if (!actions || actions.length === 0) return false;
            else if (!actions.flat(2).includes(action)) return false;
        }
        return true;
    }

    let currentTasks, units = [];
    let data = [];
    let childrenOrganizationalUnit = [], queue = [];
    let currentOrganizationalUnit, currentOrganizationalUnitLoading;

    if (tasks) {
        currentTasks = tasks.tasks;
    }

    // kiểm tra vai trò của người dùng
    let userId = getStorage("userId");

    if (user) units = user.organizationalUnitsOfUser;

    // khởi tạo dữ liệu TreeTable
    let column = [
        { name: translate('task.task_management.col_name'), key: "name" },
        { name: translate('task.task_management.detail_description'), key: "description" },
        { name: translate('task.task_management.col_organization'), key: "organization" },
        { name: translate('task.task_management.col_priority'), key: "priority" },
        { name: translate('task.task_management.responsible'), key: "responsibleEmployees" },
        { name: translate('task.task_management.accountable'), key: "accountableEmployees" },
        { name: translate('task.task_management.creator'), key: "creatorEmployees" },
        { name: translate('task.task_management.col_start_date'), key: "startDate" },
        { name: translate('task.task_management.col_end_date'), key: "endDate" },
        { name: translate('task.task_management.col_status'), key: "status" },
        { name: translate('task.task_management.col_progress'), key: "progress" },
        { name: translate('task.task_management.col_logged_time'), key: "totalLoggedTime" }
    ];
    if (currentTasks && currentTasks.length !== 0) {
        let dataTemp = currentTasks;
        for (let n in dataTemp) {
            data[n] = {
                ...dataTemp[n],
                name: dataTemp[n].name,
                description: dataTemp?.[n]?.description ? parse(dataTemp[n].description) : "",
                organization: dataTemp[n].organizationalUnit ? dataTemp[n].organizationalUnit.name : translate('task.task_management.err_organizational_unit'),
                priority: convertPriorityData(dataTemp[n].priority),
                responsibleEmployees: dataTemp[n].responsibleEmployees ? (<ToolTip dataTooltip={dataTemp[n].responsibleEmployees.map(o => o.name)} />) : null,
                accountableEmployees: dataTemp[n].accountableEmployees ? (<ToolTip dataTooltip={dataTemp[n].accountableEmployees.map(o => o.name)} />) : null,
                creatorEmployees: dataTemp[n].creator && dataTemp[n].creator.name,
                startDate: getFormatDateFromTime(dataTemp[n].startDate, 'dd-mm-yyyy'),
                endDate: getFormatDateFromTime(dataTemp[n].endDate, 'dd-mm-yyyy'),
                status: checkTaskRequestToClose(dataTemp[n]),
                progress: convertProgressData(dataTemp[n].progress, dataTemp[n].startDate, dataTemp[n].endDate),
                totalLoggedTime: getTotalTimeSheetLogs(dataTemp[n].timesheetLogs),
                parent: dataTemp[n].parent ? dataTemp[n].parent._id : null,
            }
        }

        for (let i in data) {
            if (dataTemp[i].creator && dataTemp[i].creator._id === userId || dataTemp[i].informedEmployees.indexOf(userId) !== -1) {
                let del = null;
                if (dataTemp[i].creator._id === userId) {
                    del = "delete";
                }
                data[i] = { ...data[i], action: ["edit", del] }
            }
            if (dataTemp[i].responsibleEmployees && dataTemp[i].responsibleEmployees.find(e => e._id === userId) || dataTemp[i].consultedEmployees && dataTemp[i].consultedEmployees.indexOf(userId) !== -1) {
                data[i] = { ...data[i], action: ["edit"] }
            }
            if (dataTemp[i].accountableEmployees && dataTemp[i].accountableEmployees.filter(o => o._id === userId).length > 0) {
                data[i] = { ...data[i], action: ["edit", "delete"] }
            }
        }
    }

    if (dashboardEvaluationEmployeeKpiSet) {
        currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        currentOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading;
    }

    let exportData = convertDataToExportData(translate, currentTasks, translate("menu.task_management_of"));
    return (
        <React.Fragment>
            {currentOrganizationalUnit
                ? <div className="box">
                    <div className="box-body qlcv">
                        <div style={{ height: "40px", marginBottom: '10px' }}>
                            <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng bảng" onClick={() => handleDisplayType('table')}><i className="fa fa-list"></i> Dạng bảng</button>
                            {/* <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng cây" onClick={() => handleDisplayType('tree')}><i className="fa fa-sitemap"></i> Dạng cây</button> */}
                            <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} onClick={() => { window.$('#tasks-filter').slideToggle() }}><i className="fa fa-filter"></i> Lọc</button>

                            {exportData && <ExportExcel id="list-task-employee" buttonName="Báo cáo" exportData={exportData} style={{ marginLeft: '10px' }} />}
                        </div>

                        {
                            selectedData && selectedData.length > 0 &&
                            <div className="form-inline" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button disabled={!validateAction("delete")} style={{ margin: "5px" }} type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDelete(selectedData)}>
                                    {translate("general.delete_option")}
                                </button>
                            </div>
                        }

                        <div id="tasks-filter" className="form-inline" style={{ display: 'none' }}>
                            {/* Đơn vị tham gia công việc */}
                            <div className="form-group">
                                <label>{translate('task.task_management.department')}</label>
                                {selectBoxUnit && selectBoxUnit.length !== 0
                                    && <SelectMulti
                                        key="multiSelectUnit1"
                                        id="multiSelectUnit1"
                                        items={selectBoxUnit.map(item => { return { value: item.id, text: item.name } })}
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

                            {/* Vai tro don vi */}
                            <div className="form-group">
                                <label>{translate('task.task_management.role_unit')}</label>
                                <SelectMulti
                                    key="roleUnit"
                                    id="roleUnit"
                                    value={organizationalUnitRole}
                                    items={[
                                        { value: "management", text: translate('task.task_management.organizational_unit_management') },
                                        { value: "collabration", text: translate('task.task_management.organizational_unit_collaborate') },
                                    ]}
                                    onChange={handleSelectOrganizationalUnitRole}
                                    options={{
                                        nonSelectedText: translate('task.task_management.select_role_organizational'),
                                        allSelectedText: translate('task.task_management.select_all_role')
                                    }}
                                />
                            </div>

                            {/* Trạng thái công việc */}
                            <div className="form-group">
                                <label>{translate('task.task_management.status')}</label>
                                <SelectMulti id="multiSelectStatus"
                                    value={status}
                                    items={[
                                        { value: "inprocess", text: translate('task.task_management.inprocess') },
                                        { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
                                        { value: "finished", text: translate('task.task_management.finished') },
                                        { value: "delayed", text: translate('task.task_management.delayed') },
                                        { value: "canceled", text: translate('task.task_management.canceled') },
                                    ]}
                                    onChange={handleSelectStatus}
                                    options={{ nonSelectedText: translate('task.task_management.select_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                                </SelectMulti>
                            </div>

                            {/* Độ ưu tiên công việc */}
                            <div className="form-group">
                                <label>{translate('task.task_management.priority')}</label>
                                <SelectMulti id="multiSelectPriority" defaultValue={[
                                    translate('task.task_management.urgent'),
                                    translate('task.task_management.high'),
                                    translate('task.task_management.standard'),
                                    translate('task.task_management.average'),
                                    translate('task.task_management.low'),
                                ]}
                                    items={[
                                        { value: "5", text: translate('task.task_management.urgent') },
                                        { value: "4", text: translate('task.task_management.high') },
                                        { value: "3", text: translate('task.task_management.standard') },
                                        { value: "2", text: translate('task.task_management.average') },
                                        { value: "1", text: translate('task.task_management.low') },
                                    ]}
                                    onChange={handleSelectPriority}
                                    options={{ nonSelectedText: translate('task.task_management.select_priority'), allSelectedText: translate('task.task_management.select_all_priority') }}>
                                </SelectMulti>
                            </div>

                            {/* Đặc tính công việc */}
                            <div className="form-group">
                                <label>{translate('task.task_management.special')}</label>
                                <SelectMulti
                                    id="multiSelectCharacteristic"
                                    defaultValue={[
                                        translate('task.task_management.store'),
                                        translate('task.task_management.current_month')
                                    ]}
                                    items={[
                                        { value: "stored", text: translate('task.task_management.stored') },
                                        { value: "currentMonth", text: translate('task.task_management.current_month') },
                                        { value: "assigned", text: translate('task.task_management.assigned') },
                                        { value: "not_assigned", text: translate('task.task_management.not_assigned') }
                                    ]}
                                    onChange={handleSelectSpecial}
                                    options={{ nonSelectedText: translate('task.task_management.select_special'), allSelectedText: translate('task.task_management.select_all_special') }}>
                                </SelectMulti>
                            </div>

                            {/* Tên công việc */}
                            <div className="form-group">
                                <label>{translate('task.task_management.name')}</label>
                                <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => handleChangeName(e)} />
                            </div>

                            {/* Người thực hiện */}
                            <div className="form-group">
                                <label>{translate('task.task_management.responsible')}</label>
                                <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeResponsibleEmployees(e)} />
                            </div>

                            {/* Người phê duyệt */}
                            <div className="form-group">
                                <label>{translate('task.task_management.accountable')}</label>
                                <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeAccountableEmployees(e)} />
                            </div>

                            {/* Người thiết lập */}
                            <div className="form-group">
                                <label>{translate('task.task_management.creator')}</label>
                                <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeCreatorEmployees(e)} />
                            </div>

                            {/* Ngày bắt đầu */}
                            <div className="form-group">
                                <label>{translate('task.task_management.start_date')}</label>
                                <DatePicker
                                    id="start-date"
                                    dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                    value={""} // giá trị mặc định cho datePicker    
                                    onChange={handleChangeStartDate}
                                    disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                                />
                            </div>

                            {/* Ngày kết thúc */}
                            <div className="form-group">
                                <label>{translate('task.task_management.end_date')}</label>
                                <DatePicker
                                    id="end-date"
                                    dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                    value={""} // giá trị mặc định cho datePicker    
                                    onChange={handleChangeEndDate}
                                    disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                                />
                            </div>

                            <div className="form-group">
                                <label>Tags</label>
                                <InputTags
                                    id={`task-unit`}
                                    onChange={handleTaskTags}
                                    value={tags}
                                />
                            </div>

                            <div className="form-group">
                                <label></label>
                                <button type="button" className="btn btn-success" onClick={handleUpdateData}>{translate('task.task_management.search')}</button>
                            </div>
                        </div>

                        {/* Dạng bảng */}
                        <div id="tree-table-container">
                            <TreeTable
                                tableId={tableId}
                                tableSetting={true}
                                allowSelectAll={true}
                                behaviour="show-children"
                                column={column}
                                data={data}
                                onSetNumberOfRowsPerPage={setLimit}
                                onSelectedRowsChange={onSelectedRowsChange}
                                openOnClickName={true}
                                titleAction={{
                                    edit: translate('task.task_management.action_edit'),
                                    delete: translate('task.task_management.action_delete'),
                                }}
                                funcEdit={handleShowModal}
                                funcDelete={handleDelete}
                            />
                        </div>

                        {/* Dạng cây */}
                        {/* <div id="tasks-list-tree" style={{ display: 'none', marginTop: '30px' }}>
                            <Tree id="tasks-list-treeview"
                                plugins={false}
                                onChanged={handleShowTask}
                                data={dataTree}
                            />
                        </div> */}

                        {
                            currentTaskId &&
                            <ModalPerform
                                units={units}
                                id={currentTaskId}
                                taskName={state?.taskName ? state?.taskName : ""}
                            />
                        }

                        {/* Paginate */}
                        <PaginateBar
                            display={tasks.tasks?.length}
                            total={tasks.totalCount}
                            pageTotal={tasks.pages}
                            currentPage={currentPage}
                            func={handleGetDataPagination}
                        />

                    </div>
                </div>
                : currentOrganizationalUnitLoading
                && <div className="box">
                    <div className="box-body">
                        <h4>{translate('general.not_org_unit')}</h4>
                    </div>
                </div>
            }
        </React.Fragment>
    );
}

function mapState(state) {
    const { tasks, user, department, dashboardEvaluationEmployeeKpiSet } = state;
    return { tasks, user, department, dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getPaginatedTasksByOrganizationalUnit: taskManagementActions.getPaginatedTasksByOrganizationalUnit,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllDepartment: DepartmentActions.get,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
    deleteTaskById: taskManagementActions._delete,
};
export default connect(mapState, actionCreators)(withTranslate(TaskManagementOfUnit));

