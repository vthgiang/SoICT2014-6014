import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import moment from 'moment';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, ExportExcel, InputTags, ToolTip } from '../../../../common-components';
import { getFormatDateFromTime } from '../../../../helpers/stringMethod';
import { getProjectName } from '../../../../helpers/taskModuleHelpers';
import { getStorage } from '../../../../config';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { performTaskAction } from "../../task-perform/redux/actions";
import { taskManagementActions } from '../redux/actions';
import { ProjectActions } from "../../../project/projects/redux/actions";
import { TaskAddModal } from './taskAddModal';
import { ModalPerform } from '../../task-perform/component/modalPerform';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { convertDataToExportData, getTotalTimeSheetLogs, formatPriority, formatStatus } from './functionHelpers';
import TaskListView from './taskListView';

import TaskManagementImportForm from './taskManagementImportForm';

class TaskManagement extends Component {
    constructor(props) {
        let userId = getStorage("userId");
        super(props);
        const tableId = "tree-table-task-management";
        const defaultConfig = { limit: 20, hiddenColumns: ["2", "3", "4", "7", "8"] }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;
        // lấy giá trị từ dashboard công việc cá nhân
        const stateFromTaskDashboard = JSON.parse(localStorage.getItem("stateFromTaskDashboard"));
        localStorage.removeItem("stateFromTaskDashboard");

        this.state = {
            displayType: 'table',
            perPage: limit,
            currentPage: 1,
            tableId,

            currentTab: stateFromTaskDashboard && stateFromTaskDashboard.roles && stateFromTaskDashboard.roles.length > 0 ? stateFromTaskDashboard.roles : ["responsible", "accountable"],
            organizationalUnit: [],
            status: stateFromTaskDashboard && stateFromTaskDashboard.status && stateFromTaskDashboard.status.length > 0 ? stateFromTaskDashboard.status : ["inprocess", "wait_for_approval"],
            priority: [],
            special: [],
            name: "",
            startDate: stateFromTaskDashboard && stateFromTaskDashboard.startDate ? stateFromTaskDashboard.startDate : "",
            endDate: stateFromTaskDashboard && stateFromTaskDashboard.endDate ? stateFromTaskDashboard.endDate : "",
            startDateAfter: "",
            endDateBefore: "",
            startTimer: false,
            pauseTimer: false,
            timer: {
                startedAt: "",
                creator: userId,
                task: ""
            },
            monthTimeSheetLog: '',
            tags: []
        };
    }

    componentDidMount() {
        const { perPage, currentPage } = this.state;
        const userId = getStorage('userId');

        let data = {
            role: this.state.currentTab,
            unit: [],
            number: currentPage,
            perPage: perPage,
            status: this.state.status,
            priority: null,
            special: null,
            name: null,
            startDate: null,
            endDate: null,
            responsibleEmployees: null,
            accountableEmployees: null,
            creatorEmployees: null,
            creatorTime: null,
            projectSearch: null,
            startDateAfter: null,
            endDateBefore: null,
            aPeriodOfTime: false,
            tags: []
        }

        this.props.getDepartment();
        this.props.getAllDepartment();
        this.props.getPaginateTasks(data);
        this.props.getProjectsDispatch({ calledId: "" });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { currentTab, organizationalUnit, status, priority, special, name, startDate, endDate } = this.state;
        if (currentTab !== nextState.currentTab ||
            organizationalUnit !== nextState.organizationalUnit ||
            status !== nextState.status ||
            priority !== nextState.priority ||
            special !== nextState.special ||
            name !== nextState.name ||
            startDate !== nextState.startDate ||
            endDate !== nextState.endDate
        ) {
            return false;
        }

        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tasks.tasks && this.props.tasks.tasks && prevProps.tasks.tasks.length !== this.props.tasks.tasks.length) {
            this.handleUpdateData();
        }
    }

    list_to_tree = (list) => {
        let map = {}, node, roots = [], i, newarr = [];
        for (i = 0; i < list.length; i += 1) {
            map[list[i]._id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }

        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parent) {
                // if you have dangling branches check that map[node.parentId] exists
                if (map[node.parent._id]) {
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
            await this.setState({
                perPage: Number(limit)
            })
            this.handleGetDataPerPage(Number(limit));
        }
    }

    startTimer = async (taskId, overrideTSLog = 'no') => {
        let userId = getStorage("userId");
        let timer = {
            creator: userId,
            overrideTSLog
        };
        this.props.startTimer(taskId, timer).catch(err => {
            let warning = Array.isArray(err.response.data.messages) ? err.response.data.messages : [err.response.data.messages];
            if (warning[0] === 'time_overlapping') {
                Swal.fire({
                    title: `Bạn đã hẹn tắt bấm giờ cho công việc [ ${warning[1]} ]`,
                    html: `<h4 class="text-red">Lưu lại những giờ đã bấm được cho công việc [ ${warning[1]} ] và bấm giờ công việc mới</h4>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Bấm giờ mới',
                    cancelButtonText: 'Hủy'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let timer = {
                            creator: userId,
                            overrideTSLog: 'yes'
                        };
                        this.props.startTimer(taskId, timer)
                    }
                })
            }
        })
    }

    // Hàm xử lý trạng thái lưu kho
    handleStore = async (id) => {
        await this.props.editArchivedOfTask(id);
    }

    // Hàm xóa một công việc theo id
    handleDelete = async (id) => {
        const { tasks, translate } = this.props;
        let currentTasks = tasks.tasks.find(task => task._id === id);
        let progress = currentTasks.progress;
        let action = currentTasks.taskActions.filter(item => item.creator); // Nếu công việc theo mẫu, chưa hoạt động nào được xác nhận => cho xóa

        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa công việc "${currentTasks.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.translate('general.no'),
            confirmButtonText: this.props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                this.props.deleteTaskById(id);
            }
        })


    }

    handleGetDataPagination = async (index) => {
        let {
            organizationalUnit, status, priority,
            special, name, startDate, endDate,
            responsibleEmployees, accountableEmployees,
            creatorEmployees, creatorTime,
            projectSearch, tags
        } = this.state;

        let oldCurrentPage = this.state.currentPage;
        let perPage = this.state.perPage;

        await this.setState({
            currentPage: index
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== index) {
            let data = {
                role: this.state.currentTab,
                unit: organizationalUnit,
                number: newCurrentPage,
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
                creatorTime: creatorTime,
                projectSearch: projectSearch,
                startDateAfter: null,
                endDateBefore: null,
                aPeriodOfTime: false,
                tags: tags
            }

            this.props.getPaginateTasks(data);
        };
    }

    nextPage = async (pageTotal) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, responsibleEmployees, accountableEmployees, creatorEmployees, perPage, creatorTime, projectSearch, tags } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            let data = {
                role: this.state.currentTab,
                unit: organizationalUnit,
                number: newCurrentPage,
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
                creatorTime: creatorTime,
                projectSearch: projectSearch,
                startDateAfter: null,
                endDateBefore: null,
                aPeriodOfTime: false,
                tags: tags
            }
            this.props.getPaginateTasks(data);
        };
    }

    backPage = async () => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, responsibleEmployees, accountableEmployees, creatorEmployees, perPage, creatorTime, projectSearch, tags } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            let data = {
                role: this.state.currentTab,
                unit: organizationalUnit,
                number: newCurrentPage,
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
                creatorTime: creatorTime,
                projectSearch: projectSearch,
                startDateAfter: null,
                endDateBefore: null,
                aPeriodOfTime: false,
                tags: tags
            }
            this.props.getPaginateTasks(data);
        };
    }

    handleGetDataPerPage = (perPage) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, responsibleEmployees, accountableEmployees, creatorEmployees, creatorTime, projectSearch, tags } = this.state;

        let data = {
            role: this.state.currentTab,
            unit: organizationalUnit,
            number: 1,
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
            creatorTime: creatorTime,
            projectSearch: projectSearch,
            startDateAfter: null,
            endDateBefore: null,
            aPeriodOfTime: false,
            tags: tags
        }

        this.props.getPaginateTasks(data);

        this.setState({
            currentPage: 1
        })
    }

    handleUpdateData = () => {
        const { translate } = this.props;
        let { organizationalUnit, status, priority, special, name, startDate, endDate, responsibleEmployees, perPage, accountableEmployees, creatorEmployees, creatorTime, projectSearch, tags } = this.state;
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
        } else {
            let data = {
                role: this.state.currentTab,
                unit: organizationalUnit,
                number: 1,
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
                creatorTime: creatorTime,
                projectSearch: projectSearch,
                startDateAfter: null,
                endDateBefore: null,
                aPeriodOfTime: false,
                tags: tags
            }

            this.props.getPaginateTasks(data);
        }

        this.setState({
            currentPage: 1
        })
    }

    handleShowModal = async (id) => {
        await this.setState({
            currentTaskId: id
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }

    /**
     * Mở modal thêm task mới
     * @id task cha của task sẽ thêm (là "" nếu không có cha)
     */
    handleAddTask = (id) => {
        this.setState({
            parentTask: id
        });
        window.$(`#addNewTask-undefined`).modal('show')
    }

    handleRoleChange = (value) => {
        this.setState({
            currentTab: value
        });
    }

    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            organizationalUnit: value
        });
    }

    handleSelectStatus = (value) => {
        this.setState({
            status: value
        });
    }

    handleSelectPriority = (value) => {
        this.setState({
            priority: value
        });
    }

    handleSelectSpecial = (value) => {
        this.setState({
            special: value
        });
    }

    handleChangeName = (e) => {
        let name = e.target.value;
        if (name === '') {
            name = null;
        }

        this.setState({
            name
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

    handleDisplayType = (displayType) => {
        this.setState({
            displayType
        });
        switch (displayType) {
            case 'table':
                window.$('#tree-table-container').show();
                window.$('#tasks-list-tree').hide();
                window.$('#tasks-list').hide();
                break;
            case 'list':
                window.$('#tasks-list').show();
                window.$('#tree-table-container').hide();
                window.$('#tasks-list-tree').hide();
                break;
            default:
                window.$('#tree-table-container').hide();
                window.$('#tasks-list-tree').show();
                window.$('#tasks-list').hide();
                break;
        }
    }

    handleShowTask = (e, data) => {
        const { tasks } = this.props;
        let id = data && data.node && data.node.original ? data.node.original._id : '';
        let idValid = tasks.tasks ? tasks.tasks.some(t => t._id === id) : null;
        if (id && idValid) {
            this.setState({
                currentTaskId: id
            }, () => { window.$(`#modelPerformTask${id}`).modal('show') })
        }
    }

    handleChangeMonthTimeSheetLog = (value) => {
        this.setState({
            monthTimeSheetLog: value
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

    handleSelectCreatorTime = (value) => {
        this.setState({
            creatorTime: value[0],
        })
    }

    handleSelectTaskProject = (value) => {
        this.setState({
            projectSearch: value,
        })
    }

    handleTaskTags = (value) => {
        this.setState({
            tags: value,
        })
    }

    checkTaskRequestToClose = (task) => {
        const { translate } = this.props;
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

    convertPriorityData = (priority) => {
        const { translate } = this.props;
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

    convertProgressData = (progress = 0, startDate, endDate) => {
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
            <div className="progress" style={{ backgroundColor: 'rgb(221, 221, 221)', textAlign: "right", borderRadius: '3px', position: 'relative' }}>
                <span style={{ position: 'absolute', right: '1px', fontSize: '13px', marginRight: '5px' }}>{progress + '%'}</span>
                <div role="progressbar" className="progress-bar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} style={{ width: `${progress + '%'}`, maxWidth: "100%", minWidth: "0%", backgroundColor: barColor }} >
                </div>
            </div>
        )
    }

    handleOpenModalImport = () => {
        window.$('#modal_import_tasks').modal('show');
    }

    render() {
        const { tasks, user, translate, project } = this.props;
        const { currentTaskId, currentPage, currentTab,
            parentTask, startDate, endDate, perPage,
            status, monthTimeSheetLog, tableId,
            responsibleEmployees, creatorTime,
            projectSearch, tags
        } = this.state;

        let currentTasks, units = [];

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
            { name: translate('task.task_management.col_project'), key: "project" },
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
        let data = [], dataTree = [];;
        if (currentTasks && currentTasks.length !== 0) {
            let dataTemp = currentTasks;
            let idTaskProjectRoot = 'task-project-root';
            for (let n in dataTemp) {
                data[n] = {
                    ...dataTemp[n],
                    name: dataTemp[n].name,
                    description: dataTemp[n].description ? parse(dataTemp[n].description) : null,
                    organization: dataTemp[n].organizationalUnit ? dataTemp[n].organizationalUnit.name : translate('task.task_management.err_organizational_unit'),
                    project: dataTemp[n].taskProject ? getProjectName(dataTemp[n].taskProject, project.data && project.data.list) : null,
                    priority: this.convertPriorityData(dataTemp[n].priority),
                    responsibleEmployees: dataTemp[n].responsibleEmployees ? (<ToolTip dataTooltip={dataTemp[n].responsibleEmployees.map(o => o.name)} />) : null,
                    accountableEmployees: dataTemp[n].accountableEmployees ? (<ToolTip dataTooltip={dataTemp[n].accountableEmployees.map(o => o.name)} />) : null,
                    creatorEmployees: dataTemp[n].creator ? dataTemp[n].creator.name : null,
                    startDate: getFormatDateFromTime(dataTemp[n].startDate, 'dd-mm-yyyy'),
                    endDate: getFormatDateFromTime(dataTemp[n].endDate, 'dd-mm-yyyy'),
                    status: this.checkTaskRequestToClose(dataTemp[n]),
                    progress: this.convertProgressData(dataTemp[n].progress, dataTemp[n].startDate, dataTemp[n].endDate),
                    totalLoggedTime: getTotalTimeSheetLogs(dataTemp[n].timesheetLogs),
                    parent: dataTemp[n].parent ? dataTemp[n].parent._id : null
                }
                let archived = "store";
                if (dataTemp[0].isArchived === true) {
                    archived = "restore";
                }
                if (dataTemp[n].creator && dataTemp[n].creator._id === userId || dataTemp[n].informedEmployees.indexOf(userId) !== -1) {
                    let del = null;
                    if (dataTemp[n].creator._id === userId) {
                        del = "delete";
                    }
                    data[n] = { ...data[n], action: ["edit", ["add", archived, del]] }
                }
                if (dataTemp[n].responsibleEmployees && dataTemp[n].responsibleEmployees.find(e => e._id === userId) || dataTemp[n].consultedEmployees && dataTemp[n].consultedEmployees.indexOf(userId) !== -1) {
                    data[n] = { ...data[n], action: ["edit", "startTimer", ["add", archived]] }
                }
                if (dataTemp[n].accountableEmployees && dataTemp[n].accountableEmployees.filter(o => o._id === userId).length > 0) {
                    data[n] = { ...data[n], action: ["edit", "startTimer", ["add", archived, "delete"]] }
                }
                // Do mới thêm populate accountableEmployees bên server nên đoạn code dưới sai
                // if (dataTemp[n].accountableEmployees.indexOf(userId) !== -1) {
                //     data[n] = { ...data[n], action: ["edit", "startTimer", ["add", archived, "delete"]] }
                // }
            }

            let getId = (data) => {
                if (data && typeof (data) === 'object') return data._id;
                else return data;
            }

            let isIdValiInArr = (id, arr) => {
                if (!arr) return false;
                let result = arr.some(n => n.id === id);
                return result;
            }

            let convertDataProject = project && project.data && project.data.list.map(p => {
                return {
                    ...p,
                    id: 'pj' + p._id,
                    parent: 'pj' + getId(p.parent),
                    isTask: false
                }
            });

            let convertDataTask = currentTasks.map(t => {
                return {
                    ...t,
                    id: 't' + t._id,
                    parent: 't' + getId(t.parent),
                    taskProject: 'pj' + getId(t.taskProject),
                    isTask: true
                }
            });

            let getDataTree = [...convertDataProject, ...convertDataTask];
            let idProjectNull = 'project_null';
            dataTree = [...dataTree, {
                _id: idProjectNull,
                id: idProjectNull,
                icon: 'glyphicon glyphicon-folder-open',
                text: 'Không có chủ đề',
                state: { "opened": true },
                parent: '#'
            }]
            for (let i = 0; i < getDataTree.length; i++) {
                let node = getDataTree[i];
                if (node.parent || node.taskProject)//Có thông tin về dự án cha/công việc cha
                {
                    dataTree = [...dataTree, {
                        ...node,
                        id: node.id,
                        icon: node.isTask ? 'fa fa-file-text-o' : 'glyphicon glyphicon-folder-open',
                        text: node.name,
                        state: { "opened": true },
                        parent: isIdValiInArr(getId(node.parent), getDataTree) ?
                            getId(node.parent) :
                            isIdValiInArr(getId(node.taskProject), getDataTree) ?
                                getId(node.taskProject) :
                                !node.code ? idProjectNull : '#'
                    }]
                }
                else //Không có cả thông tin về dự án or công việc cha
                {
                    if (!node.code) //node này là một công việc - tại thời điểm này (17/12/2020) chỉ có dự án mới có mã code
                    {
                        dataTree = [...dataTree, {
                            ...node,
                            id: node.id,
                            icon: 'fa fa-file-text-o',
                            text: node.name,
                            state: { "opened": true },
                            parent: '#'
                        }]
                    }
                    else { //node này là một dự án
                        dataTree = [...dataTree, {
                            ...node,
                            id: node.id,
                            icon: 'glyphicon glyphicon-folder-open',
                            text: node.name,
                            state: { "opened": true },
                            parent: '#'
                        }]
                    }
                }
            }
        }

        let listProject = [];
        if (project && project.data && project.data.list) {
            project.data.list.forEach(x => {
                listProject = [
                    ...listProject,
                    { value: x._id, text: x.name }
                ]
            })
        }

        let exportData = convertDataToExportData(translate, currentTasks, translate("menu.task_management"));
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <div style={{ height: "40px", display: 'flex', justifyContent: 'space-between' }}>
                            <div><button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng bảng" onClick={() => this.handleDisplayType('table')}><i className="fa fa-table"></i> Dạng bảng</button>
                                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng cây" onClick={() => this.handleDisplayType('tree')}><i className="fa fa-sitemap"></i> Dạng cây</button>
                                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} title="Dạng danh sách" onClick={() => this.handleDisplayType('list')}><i className="fa fa-list"></i> Dạng danh sách</button>
                                <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} onClick={() => { window.$('#tasks-filter').slideToggle() }}><i className="fa fa-filter"></i> Lọc</button></div>

                            <div style={{ display: 'flex', marginBottom: 6 }}>
                                {
                                    currentTab !== "informed" &&
                                    <div className="dropdown">
                                        <button type="button" className="btn btn-success dropdown-toggler" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('task_template.add')}</button>
                                        <ul className="dropdown-menu pull-right">
                                            <li><a href="#" title="ImportForm" onClick={() => { this.handleAddTask("") }}>{translate('task_template.add')}</a></li>
                                            <li><a href="#" title="Import file excell" onClick={this.handleOpenModalImport}>{translate('task_template.import')}</a></li>
                                        </ul>
                                    </div>
                                }
                                {/* <button type="button" onClick={this.handleOpenModalImport} className="btn btn-success pull-right" title={translate('task.task_management.add_title')}>Thêm excel</button> */}

                                {exportData && <ExportExcel id="list-task-employee" buttonName="Báo cáo" exportData={exportData} style={{ marginLeft: '10px' }} />}
                                {/* {currentTab !== "informed" &&
                                <button type="button" onClick={() => { this.handleAddTask("") }} className="btn btn-success pull-right" title={translate('task.task_management.add_title')}>{translate('task.task_management.add_task')}</button>
                            } */}
                            </div>


                            <TaskManagementImportForm />
                            <TaskAddModal currentTasks={(currentTasks && currentTasks.length !== 0) && this.list_to_tree(currentTasks)} parentTask={parentTask} />
                        </div>


                        <div id="tasks-filter" className="form-inline" style={{ display: 'none' }}>
                            <div className="form-group">
                                <label>{translate('task.task_management.department')}</label>
                                {units &&
                                    <SelectMulti id="multiSelectUnit1"
                                        defaultValue={units.map(item => item._id)}
                                        items={units.map(item => { return { value: item._id, text: item.name } })}
                                        onChange={this.handleSelectOrganizationalUnit}
                                        options={{ nonSelectedText: translate('task.task_management.select_department'), allSelectedText: translate(`task.task_management.select_all_department`) }}>
                                    </SelectMulti>
                                }
                            </div>
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

                            <div className="form-group">
                                <label>{translate('task.task_management.name')}</label>
                                <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => this.handleChangeName(e)} />
                            </div>

                            <div className="form-group">
                                <label>{translate('task.task_management.special')}</label>
                                <SelectMulti id="multiSelectCharacteristic" defaultValue={[
                                    translate('task.task_management.store'),
                                    translate('task.task_management.current_month')
                                ]}
                                    items={[
                                        { value: "stored", text: translate('task.task_management.stored') },
                                        { value: "currentMonth", text: translate('task.task_management.current_month') },
                                        { value: "request_to_close", text: "Chưa phê duyệt kết thúc" },
                                    ]}
                                    onChange={this.handleSelectSpecial}
                                    options={{ nonSelectedText: translate('task.task_management.select_special'), allSelectedText: translate('task.task_management.select_all_special') }}>
                                </SelectMulti>
                            </div>

                            <div className="form-group">
                                <label>{translate('task.task_management.role')}</label>
                                <SelectMulti id="select-task-role"
                                    items={[
                                        { value: "responsible", text: translate('task.task_management.responsible') },
                                        { value: "accountable", text: translate('task.task_management.accountable') },
                                        { value: "consulted", text: translate('task.task_management.consulted') },
                                        { value: "creator", text: translate('task.task_management.creator') },
                                        { value: "informed", text: translate('task.task_management.informed') },
                                    ]}
                                    value={currentTab}
                                    onChange={this.handleRoleChange}
                                    options={{ nonSelectedText: translate('task.task_management.select_role'), allSelectedText: translate('task.task_management.select_all_role') }}>
                                </SelectMulti>
                            </div>

                            <div className="form-group">
                                <label>{translate('task.task_management.col_project')}</label>
                                {
                                    listProject &&
                                    <SelectBox id="select-project-search" className="form-control select2" style={{ width: "100%" }}
                                        items={listProject}
                                        value={projectSearch}
                                        onChange={this.handleSelectTaskProject}
                                        multiple={true}
                                        options={{ placeholder: "Chọn dự án" }}
                                    />
                                }
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

                            <div className="form-group">
                                <label>{translate('task.task_management.start_date')}</label>
                                <DatePicker
                                    id="start-date"
                                    dateFormat="month-year"
                                    value={""}
                                    onChange={this.handleChangeStartDate}
                                    disabled={false}
                                />
                            </div>

                            <div className="form-group">
                                <label>{translate('task.task_management.end_date')}</label>
                                <DatePicker
                                    id="end-date"
                                    dateFormat="month-year"
                                    value={""}
                                    onChange={this.handleChangeEndDate}
                                    disabled={false}
                                />
                            </div>

                            <div className="form-group">
                                <label>{translate('task.task_management.creator_time')}</label>
                                <SelectBox id="multiSelectCreatorTime" className="form-control select2" style={{ width: "100%" }}
                                    items={[
                                        { value: '', text: '--- Chọn ---' },
                                        { value: "currentMonth", text: translate('task.task_management.current_month') },
                                        { value: "currentWeek", text: translate('task.task_management.current_week') },
                                    ]}
                                    value={creatorTime}
                                    onChange={this.handleSelectCreatorTime}
                                    options={{ minimumResultsForSearch: 100 }}
                                >
                                </SelectBox>
                            </div>

                            <div className="form-group">
                                <label>Tags</label>
                                <InputTags
                                    id={`task-personal`}
                                    onChange={this.handleTaskTags}
                                    value={tags}
                                />
                            </div>

                            <div className="form-group">
                                <label></label>
                                <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('task.task_management.search')}</button>
                            </div>
                        </div>

                        {
                            currentTaskId &&
                            <ModalPerform
                                units={units}
                                id={currentTaskId}
                            />
                        }

                        <DataTableSetting
                            tableId={tableId}
                            tableContainerId="tree-table-container"
                            tableWidth="1300px"
                            columnArr={[
                                translate('task.task_management.col_name'),
                                translate('task.task_management.detail_description'),
                                translate('task.task_management.col_organization'),
                                translate('task.task_management.col_project'),
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
                        <div id="tree-table-container" style={{ marginTop: '20px' }}>
                            <TreeTable
                                tableId={tableId}
                                behaviour="show-children"
                                column={column}
                                data={data}
                                openOnClickName={true}
                                titleAction={{
                                    edit: translate('task.task_management.action_edit'),
                                    delete: translate('task.task_management.action_delete'),
                                    store: translate('task.task_management.action_store'),
                                    restore: translate('task.task_management.action_restore'),
                                    add: translate('task.task_management.action_add'),
                                    startTimer: translate('task.task_management.action_start_timer'),
                                }}
                                funcEdit={this.handleShowModal}
                                funcAdd={this.handleAddTask}
                                funcStartTimer={this.startTimer}
                                funcStore={this.handleStore}
                                funcDelete={this.handleDelete}
                            />
                        </div>

                        {/* Dạng cây */}
                        <div id="tasks-list-tree" style={{ display: 'none', marginTop: '30px' }}>
                            <Tree id="tasks-list-treeview"
                                plugins={false}
                                onChanged={this.handleShowTask}
                                data={dataTree}
                            />
                        </div>

                        <div id="tasks-list" style={{ display: 'none', marginTop: '30px' }}>
                            {
                                currentTasks &&
                                <TaskListView
                                    data={currentTasks}
                                    project={project}
                                    funcEdit={this.handleShowModal}
                                    funcAdd={this.handleAddTask}
                                    funcStartTimer={this.startTimer}
                                    funcStore={this.handleStore}
                                    funcDelete={this.handleDelete}
                                />
                            }
                        </div>

                        <PaginateBar
                            display={tasks.tasks?.length}
                            total={tasks.totalCount}
                            pageTotal={tasks.pages}
                            currentPage={currentPage}
                            func={this.handleGetDataPagination}
                        />

                    </div>
                </div >
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, user, department, project } = state;
    return { tasks, user, department, project };
}

const actionCreators = {
    getPaginateTasks: taskManagementActions.getPaginateTasks,
    editArchivedOfTask: performTaskAction.editArchivedOfTask,
    getDepartment: UserActions.getDepartmentOfUser,
    startTimer: performTaskAction.startTimerTask,
    deleteTaskById: taskManagementActions._delete,
    getAllDepartment: DepartmentActions.get,
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
};
export default connect(mapState, actionCreators)(withTranslate(TaskManagement));

