import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, TreeTable, ExportExcel, Tree } from '../../../../common-components';
import { getFormatDateFromTime } from '../../../../helpers/stringMethod';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../kpi/evaluation/dashboard/redux/actions';
import { taskManagementActions } from '../redux/actions';

import { ModalPerform } from '../../task-perform/component/modalPerform';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import parse from 'html-react-parser';
import { convertDataToExportData, getTotalTimeSheetLogs, formatPriority, formatStatus } from './functionHelpers';

class TaskManagementOfUnit extends Component {

    constructor(props) {
        super(props);
        const tableId = "tree-table-task-management-of-unit";
        const defaultConfig = { limit: 20, hiddenColumns: ["2", "6", "7"] }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            organizationalUnit: null,
            perPage: limit,
            currentPage: 1,
            tableId,
            currentTab: "responsible",
            status: ["inprocess", "wait_for_approval"],
            priority: [],
            special: [],
            name: "",
            startDate: "",
            endDate: "",
            organizationalUnitRole: ['management', 'collabration']
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllDepartment();
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { dashboardEvaluationEmployeeKpiSet } = this.props;
        let { currentTab, organizationalUnit, status, priority, special, name,
            startDate, endDate, responsibleEmployees,
            accountableEmployees, creatorEmployees, perPage, currentPage, organizationalUnitRole
        } = this.state;

        if (organizationalUnit !== nextState.organizationalUnit ||
            currentTab !== nextState.currentTab ||
            status !== nextState.status ||
            priority !== nextState.priority ||
            special !== nextState.special ||
            name !== nextState.name ||
            startDate !== nextState.startDate ||
            endDate !== nextState.endDate
        ) {
            return false;
        }

        if (organizationalUnit && !dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnitLoading) {
            this.setState(state => {
                return {
                    ...state,
                    organizationalUnit: null
                }
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
            this.setState((state) => {
                return {
                    ...state,
                    organizationalUnit: [units?.[0]],
                    selectBoxUnit: childrenOrganizationalUnit
                }
            });

            await this.props.getPaginatedTasksByOrganizationalUnit({
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
            });
            return true;
        }

        return true;
    }

    list_to_tree = (list) => {
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

    setLimit = async (limit) => {
        if (Number(limit) !== this.state.perPage) {
            // Cập nhật số dòng trang trên một trang hiển thị
            await this.setState(state => {
                return {
                    ...state,
                    perPage: Number(limit)
                }
            })
            // TODO: send query
            this.handleGetDataPerPage(this.state.perPage);
        }
    }

    handleGetDataPagination = async (index) => {
        let { organizationalUnit, status, priority, special, name,
            startDate, endDate, responsibleEmployees,
            accountableEmployees, creatorEmployees, organizationalUnitRole
        } = this.state;

        let oldCurrentPage = this.state.currentPage;
        let perPage = this.state.perPage;

        await this.setState(state => {
            return {
                ...state,
                currentPage: index
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== index) {
            this.props.getPaginatedTasksByOrganizationalUnit({
                unit: organizationalUnit,
                page: newCurrentPage,
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
                organizationalUnitRole: organizationalUnitRole
            });
        };
    }

    nextPage = async (pageTotal) => {
        let { organizationalUnit, status, priority, special, name,
            startDate, endDate, responsibleEmployees,
            accountableEmployees, creatorEmployees, perPage, organizationalUnitRole
        } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            this.props.getPaginatedTasksByOrganizationalUnit({
                unit: organizationalUnit,
                page: newCurrentPage,
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
                organizationalUnitRole: organizationalUnitRole
            });
        };
    }

    backPage = async () => {
        let { organizationalUnit, status, priority, special, name,
            startDate, endDate, responsibleEmployees,
            accountableEmployees, creatorEmployees, perPage, organizationalUnitRole
        } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            this.props.getPaginatedTasksByOrganizationalUnit({
                unit: organizationalUnit,
                page: newCurrentPage,
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
                organizationalUnitRole: organizationalUnitRole
            });
        };
    }

    handleDisplayType = (displayType) => {
        this.setState({
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

    handleGetDataPerPage = (perPage) => {
        let { organizationalUnit, status, priority, special, name,
            startDate, endDate, responsibleEmployees,
            accountableEmployees, creatorEmployees, organizationalUnitRole
        } = this.state;

        this.props.getPaginatedTasksByOrganizationalUnit({
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
            organizationalUnitRole: organizationalUnitRole
        });

        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }

    handleUpdateData = () => {
        const { translate } = this.props;
        let { organizationalUnit, status, priority, special,
            name, startDate, endDate, perPage, organizationalUnitRole,
            responsibleEmployees, accountableEmployees, creatorEmployees
        } = this.state;

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
            this.props.getPaginatedTasksByOrganizationalUnit({
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
                organizationalUnitRole: organizationalUnitRole
            });
        }

        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }

    handleShowModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                currentTaskId: id
            }
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }

    handleSelectOrganizationalUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                organizationalUnit: value
            }
        });
    }

    handleSelectOrganizationalUnitRole = (value) => {
        this.setState(state => {
            return {
                ...state,
                organizationalUnitRole: value
            }
        });
    }

    handleSelectStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }

    handleSelectPriority = (value) => {
        this.setState(state => {
            return {
                ...state,
                priority: value
            }
        });
    }

    handleSelectSpecial = (value) => {
        this.setState(state => {
            return {
                ...state,
                special: value
            }
        });
    }

    handleChangeName = (e) => {
        let name = e.target.value;
        if (name === '') {
            name = null;
        }

        this.setState(state => {
            return {
                ...state,
                name: name
            }
        });
    }

    handleChangeStartDate = (value) => {
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

    handleChangeEndDate = (value) => {
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

    handleChangeResponsibleEmployees = (e) => {
        const { value } = e.target;
        this.setState({
            responsibleEmployees: value,
        })
    }

    handleChangeAccountableEmployees = (e) => {
        const { value } = e.target;
        this.setState({
            accountableEmployees: value,
        })
    }

    handleChangeCreatorEmployees = (e) => {
        const { value } = e.target;
        this.setState({
            creatorEmployees: value,
        })
    }

    render() {
        const { tasks, user, translate, dashboardEvaluationEmployeeKpiSet } = this.props;
        const { selectBoxUnit, currentTaskId, currentPage, startDate,
            endDate, perPage, status,
            organizationalUnit, tableId, organizationalUnitRole
        } = this.state;
        let currentTasks, units = [];
        let data = [];
        let childrenOrganizationalUnit = [], queue = [];
        let currentOrganizationalUnit, currentOrganizationalUnitLoading;

        if (tasks) {
            currentTasks = tasks.tasks;
        }
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
                    priority: formatPriority(translate, dataTemp[n].priority),
                    responsibleEmployees: dataTemp[n].responsibleEmployees && dataTemp[n].responsibleEmployees.map(o => o.name).join(', '),
                    accountableEmployees: dataTemp[n].accountableEmployees && dataTemp[n].accountableEmployees.map(o => o.name).join(', '),
                    creatorEmployees: dataTemp[n].creator && dataTemp[n].creator.name,
                    startDate: getFormatDateFromTime(dataTemp[n].startDate, 'dd-mm-yyyy'),
                    endDate: getFormatDateFromTime(dataTemp[n].endDate, 'dd-mm-yyyy'),
                    status: formatStatus(translate, dataTemp[n].status),
                    progress: dataTemp[n].progress ? dataTemp[n].progress + "%" : "0%",
                    totalLoggedTime: getTotalTimeSheetLogs(dataTemp[n].timesheetLogs),
                    parent: dataTemp[n].parent ? dataTemp[n].parent._id : null
                }
            }

            for (let i in data) {
                data[i] = { ...data[i], action: ["edit"] }
            }
        }

        if (dashboardEvaluationEmployeeKpiSet) {
            currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
            currentOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading;
        }

        let exportData = convertDataToExportData(translate, currentTasks, translate("menu.task_management_of"));

        return (
            <React.Fragment>
                { currentOrganizationalUnit
                    ? <div className="box">
                        <div className="box-body qlcv">
                            <div style={{ height: "40px" }}>
                                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng bảng" onClick={() => this.handleDisplayType('table')}><i className="fa fa-list"></i> Dạng bảng</button>
                                {/* <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng cây" onClick={() => this.handleDisplayType('tree')}><i className="fa fa-sitemap"></i> Dạng cây</button> */}
                                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} onClick={() => { window.$('#tasks-filter').slideToggle() }}><i className="fa fa-filter"></i> Lọc</button>

                                {exportData && <ExportExcel id="list-task-employee" buttonName="Báo cáo" exportData={exportData} style={{ marginLeft: '10px' }} />}
                            </div>

                            <div id="tasks-filter" className="form-inline" style={{ display: 'none' }}>
                                {/* Đợn vị tham gia công việc */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.department')}</label>
                                    {selectBoxUnit && selectBoxUnit.length !== 0
                                        && <SelectMulti
                                            key="multiSelectUnit1"
                                            id="multiSelectUnit1"
                                            items={selectBoxUnit.map(item => { return { value: item.id, text: item.name } })}
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
                                        onChange={this.handleSelectOrganizationalUnitRole}
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
                                        onChange={this.handleSelectStatus}
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
                                        onChange={this.handleSelectPriority}
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
                                        onChange={this.handleSelectSpecial}
                                        options={{ nonSelectedText: translate('task.task_management.select_special'), allSelectedText: translate('task.task_management.select_all_special') }}>
                                    </SelectMulti>
                                </div>

                                {/* Tên công việc */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.name')}</label>
                                    <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => this.handleChangeName(e)} />
                                </div>

                                {/* Người thực hiện */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.responsible')}</label>
                                    <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => this.handleChangeResponsibleEmployees(e)} />
                                </div>

                                {/* Người phê duyệt */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.accountable')}</label>
                                    <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => this.handleChangeAccountableEmployees(e)} />
                                </div>

                                {/* Người thiết lập */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.creator')}</label>
                                    <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => this.handleChangeCreatorEmployees(e)} />
                                </div>

                                {/* Ngày bắt đầu */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.start_date')}</label>
                                    <DatePicker
                                        id="start-date"
                                        dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                        value={""} // giá trị mặc định cho datePicker    
                                        onChange={this.handleChangeStartDate}
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
                                        onChange={this.handleChangeEndDate}
                                        disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                                    />
                                </div>

                                <div className="form-group">
                                    <label></label>
                                    <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('task.task_management.search')}</button>
                                </div>
                            </div>

                            <DataTableSetting
                                tableId={tableId}
                                tableContainerId="tree-table-container"
                                tableWidth="1300px"
                                columnArr={[
                                    translate('task.task_management.col_name'),
                                    translate('task.task_management.detail_description'),
                                    translate('task.task_management.col_organization'),
                                    translate('task.task_management.col_priority'),
                                    translate('task.task_management.responsible'),
                                    translate('task.task_management.accountable'),
                                    translate('task.task_management.creator'),
                                    translate('task.task_management.col_start_date'),
                                    translate('task.task_management.col_end_date'),
                                    translate('task.task_management.col_status'),
                                    translate('task.task_management.col_progress'),
                                    translate('task.task_management.col_logged_time')
                                ]}
                                setLimit={this.setLimit}
                            />

                            {/* Dạng bảng */}
                            <div id="tree-table-container">
                                <TreeTable
                                    tableId={tableId}
                                    behaviour="show-children"
                                    column={column}
                                    data={data}
                                    titleAction={{
                                        edit: translate('task.task_management.action_edit'),
                                    }}
                                    funcEdit={this.handleShowModal}
                                />
                            </div>

                            {/* Dạng cây */}
                            {/* <div id="tasks-list-tree" style={{ display: 'none', marginTop: '30px' }}>
                                <Tree id="tasks-list-treeview"
                                    plugins={false}
                                    onChanged={this.handleShowTask}
                                    data={dataTree}
                                />
                            </div> */}

                            {
                                currentTaskId &&
                                <ModalPerform
                                    units={units}
                                    id={currentTaskId}
                                />
                            }

                            {/* Paginate */}
                            <PaginateBar
                                display={tasks.tasks?.length}
                                total={tasks.totalCount}
                                pageTotal={tasks.pages}
                                currentPage={currentPage}
                                func={this.handleGetDataPagination}
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
};
const translateTaskManagementOfUnit = connect(mapState, actionCreators)(withTranslate(TaskManagementOfUnit));
export { translateTaskManagementOfUnit as TaskManagementOfUnit };

