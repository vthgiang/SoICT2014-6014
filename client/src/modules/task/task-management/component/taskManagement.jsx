import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DataTableSetting, DatePicker, PaginateBar, SelectMulti, Tree, TreeTable } from '../../../../common-components';
import { getFormatDateFromTime } from '../../../../helpers/stringMethod';
import { getStorage } from '../../../../config';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { performTaskAction } from "../../task-perform/redux/actions";
import { taskManagementActions } from '../redux/actions';
import TaskProjectAction from '../../task-project/redux/action';

import { TaskAddModal } from './taskAddModal';
import { ModalPerform } from '../../task-perform/component/modalPerform';

class TaskManagement extends Component {
    constructor(props) {
        let userId = getStorage("userId");
        super(props);
        this.state = {
            displayType: 'table',
            perPage: 20,
            currentPage: 1,

            currentTab: ["responsible", "accountable"],
            organizationalUnit: [],
            status: ["inprocess", "wait_for_approval"],
            priority: [],
            special: [],
            name: "",
            startDate: "",
            endDate: "",
            startDateAfter: "",
            endDateBefore: "",
            startTimer: false,
            pauseTimer: false,
            timer: {
                startedAt: "",
                creator: userId,
                task: ""
            },
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllDepartment();
        this.props.getPaginateTasks(this.state.currentTab, [], '1', '20', this.state.status, null, null, null, null, null);
        this.props.getAllTaskProject();
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

    startTimer = async (taskId) => {
        let userId = getStorage("userId");
        let timer = {
            creator: userId,
        };
        this.props.startTimer(taskId, timer);
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

        if (action.length === 0 && progress === 0) {
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
        else {
            Swal.fire({
                title: translate('task.task_management.confirm_delete'),
                // type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }

    handleGetDataPagination = async (index) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate } = this.state;

        let oldCurrentPage = this.state.currentPage;
        let perPage = this.state.perPage;

        await this.setState({
            currentPage: index
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== index) {
            let content = this.state.currentTab;
            this.props.getPaginateTasks(content, organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);

            // if (content === "responsible") {
            //     this.props.getResponsibleTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
            // } else if (content === "accountable") {
            //     this.props.getAccountableTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            // } else if (content === "consulted") {
            //     this.props.getConsultedTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            // } else if (content === "creator") {
            //     this.props.getCreatorTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            // } else if (content === "informed") {
            //     this.props.getInformedTaskByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            // } else {
            //     this.props.getPaginateTasksByUser(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate);
            // }
        };
    }

    nextPage = async (pageTotal) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            let content = this.state.currentTab;
            this.props.getPaginateTasks(content, organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);

            // if (content === "responsible") {
            //     this.props.getResponsibleTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
            // } else if (content === "accountable") {
            //     this.props.getAccountableTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else if (content === "consulted") {
            //     this.props.getConsultedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else if (content === "creator") {
            //     this.props.getCreatorTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else if (content === "informed") {
            //     this.props.getInformedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else {
            //     this.props.getPaginateTasksByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // }
        };
    }

    backPage = async () => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            let content = this.state.currentTab;
            this.props.getPaginateTasks(content, organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);

            // if (content === "responsible") {
            //     this.props.getResponsibleTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
            // } else if (content === "accountable") {
            //     this.props.getAccountableTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else if (content === "consulted") {
            //     this.props.getConsultedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else if (content === "creator") {
            //     this.props.getCreatorTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else if (content === "informed") {
            //     this.props.getInformedTaskByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // } else {
            //     this.props.getPaginateTasksByUser(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate);
            // }
        };
    }

    handleGetDataPerPage = (perPage) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore } = this.state;

        let content = this.state.currentTab;
        this.props.getPaginateTasks(content, organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);

        // if (content === "responsible") {
        //     this.props.getResponsibleTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
        // } else if (content === "accountable") {
        //     this.props.getAccountableTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else if (content === "consulted") {
        //     this.props.getConsultedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else if (content === "creator") {
        //     this.props.getCreatorTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else if (content === "informed") {
        //     this.props.getInformedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else {
        //     this.props.getPaginateTasksByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // }
        this.setState({
            currentPage: 1
        })
    }

    handleUpdateData = () => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate } = this.state;

        let content = this.state.currentTab;
        let { perPage } = this.state;

        this.props.getPaginateTasks(content, organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);

        // if (content === "responsible") {
        //     this.props.getResponsibleTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore);
        // } else if (content === "accountable") {
        //     this.props.getAccountableTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else if (content === "consulted") {
        //     this.props.getConsultedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else if (content === "creator") {
        //     this.props.getCreatorTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else if (content === "informed") {
        //     this.props.getInformedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // } else {
        //     this.props.getPaginateTasksByUser(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate);
        // }
        this.setState({
            currentPage: 1
        })
    }
    convertTime = (ms) => {
        if (!ms) return null;
        let hour = Math.floor(ms / (60 * 60 * 1000));
        let minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000));
        let second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000);

        return `${hour > 10 ? hour : `0${hour}`}:${minute > 10 ? minute : `0${minute}`}:${second > 10 ? second : `0${second}`}`;
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
    handleAddTask = async (id) => {
        await this.setState({
            parentTask: id
        });
        window.$(`#addNewTask`).modal('show')
    }


    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.normal');
        if (data === 3) return translate('task.task_management.high');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
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
        if (value === '') {
            value = null;
        }

        this.setState({
            startDate: value
        });
    }

    handleChangeEndDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState({
            endDate: value
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
                break;
            default:
                window.$('#tree-table-container').hide();
                window.$('#tasks-list-tree').show();
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

    render() {
        const { tasks, user, translate, taskProject } = this.props;
        const { currentTaskId, currentPage, currentTab, parentTask, startDate, endDate, perPage, status, displayType } = this.state;
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
            { name: translate('task.task_management.col_organization'), key: "organization" },
            { name: translate('task.task_management.col_priority'), key: "priority" },
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
                    organization: dataTemp[n].organizationalUnit ? dataTemp[n].organizationalUnit.name : translate('task.task_management.err_organizational_unit'),
                    priority: this.formatPriority(dataTemp[n].priority),
                    startDate: getFormatDateFromTime(dataTemp[n].startDate, 'dd-mm-yyyy'),
                    endDate: getFormatDateFromTime(dataTemp[n].endDate, 'dd-mm-yyyy'),
                    status: this.formatStatus(dataTemp[n].status),
                    progress: dataTemp[n].progress ? dataTemp[n].progress + "%" : "0%",
                    totalLoggedTime: this.convertTime(dataTemp[n].hoursSpentOnTask.totalHoursSpent),
                    parent: dataTemp[n].parent ? dataTemp[n].parent._id : null
                }
                let archived = "store";
                if (dataTemp[0].isArchived === true) {
                    archived = "restore";
                }
                if (dataTemp[n].creator._id === userId || dataTemp[n].informedEmployees.indexOf(userId) !== -1) {
                    let del = null;
                    if (dataTemp[n].creator._id === userId) {
                        del = "delete";
                    }
                    data[n] = { ...data[n], action: ["edit", ["add", archived, del]] }
                }
                if (dataTemp[n].responsibleEmployees.find(e => e._id === userId) || dataTemp[n].consultedEmployees.indexOf(userId) !== -1) {
                    data[n] = { ...data[n], action: ["edit", "startTimer", ["add", archived]] }
                }
                if (dataTemp[n].accountableEmployees.indexOf(userId) !== -1) {
                    data[n] = { ...data[n], action: ["edit", "startTimer", ["add", archived, "delete"]] }
                }

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

            let convertDataProject = taskProject.list.map(p => {
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

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div style={{ height: "40px" }}>
                        <button type="button" style={{ borderRadius: 0, marginLeft: 10 }} className="btn btn-default" title="Dạng bảng" onClick={() => this.handleDisplayType('table')}><i className="fa fa-list"></i> Dạng bảng</button>
                        <button type="button" style={{ borderRadius: 0, marginLeft: 10 }} className="btn btn-default" title="Dạng cây" onClick={() => this.handleDisplayType('tree')}><i className="fa fa-sitemap"></i> Dạng cây</button>
                        <button type="button" style={{ borderRadius: 0, marginLeft: 10 }} className="btn btn-default" onClick={() => { window.$('#tasks-filter').slideToggle() }}><i className="fa fa-filter"></i> Lọc</button>
                        {currentTab !== "informed" &&
                            <button type="button" onClick={() => { this.handleAddTask("") }} className="btn btn-success pull-right" title={translate('task.task_management.add_title')}>{translate('task.task_management.add_task')}</button>
                        }
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
                                    options={{ nonSelectedText: units.length !== 0 ? translate('task.task_management.select_department') : "Bạn chưa có đơn vị", allSelectedText: translate(`task.task_management.select_all_department`) }}>
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
                                    { value: "canceled", text: translate('task.task_management.canceled') }
                                ]}
                                onChange={this.handleSelectStatus}
                                options={{ nonSelectedText: translate('task.task_management.select_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label>{translate('task.task_management.priority')}</label>
                            <SelectMulti id="multiSelectPriority" defaultValue={[
                                translate('task.task_management.high'),
                                translate('task.task_management.normal'),
                                translate('task.task_management.low')
                            ]}
                                items={[
                                    { value: "3", text: translate('task.task_management.high') },
                                    { value: "2", text: translate('task.task_management.normal') },
                                    { value: "1", text: translate('task.task_management.low') }
                                ]}
                                onChange={this.handleSelectPriority}
                                options={{ nonSelectedText: translate('task.task_management.select_priority'), allSelectedText: translate('task.task_management.select_all_priority') }}>
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.special')}</label>
                            <SelectMulti id="multiSelectCharacteristic" defaultValue={[
                                translate('task.task_management.store'),
                                translate('task.task_management.current_month')
                            ]}
                                items={[
                                    { value: "Lưu trong kho", text: translate('task.task_management.stored') },
                                    { value: "Tháng hiện tại", text: translate('task.task_management.current_month') }
                                ]}
                                onChange={this.handleSelectSpecial}
                                options={{ nonSelectedText: translate('task.task_management.select_special'), allSelectedText: translate('task.task_management.select_all_special') }}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label>{translate('task.task_management.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange={(e) => this.handleChangeName(e)} />
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
                            <label>{translate('task.task_management.start_date')}</label>
                            <DatePicker
                                id="start-date"
                                dateFormat="month-year"
                                value={startDate}
                                onChange={this.handleChangeStartDate}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.end_date')}</label>
                            <DatePicker
                                id="end-date"
                                dateFormat="month-year"
                                value={endDate}
                                onChange={this.handleChangeEndDate}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('task.task_management.search')}</button>
                        </div>

                        <DataTableSetting
                            tableId="tree-table"
                            tableContainerId="tree-table-container"
                            columnArr={[
                                translate('task.task_management.col_name'),
                                translate('task.task_management.col_organization'),
                                translate('task.task_management.col_priority'),
                                translate('task.task_management.col_start_date'),
                                translate('task.task_management.col_end_date'),
                                translate('task.task_management.col_status'),
                                translate('task.task_management.col_progress'),
                                translate('task.task_management.col_logged_time')
                            ]}
                            limit={perPage}
                            setLimit={this.setLimit}
                            hideColumnOption={true}
                            className="pull-right btn btn-default"
                            style={{ borderRadius: 0 }}
                            fontSize={16}
                            text="Thiết lập"
                        />
                    </div>

                    {
                        currentTaskId &&
                        <ModalPerform
                            units={units}
                            id={currentTaskId}
                        />
                    }

                    <div id="tree-table-container" style={{ marginTop: '30px' }}>
                        <TreeTable
                            behaviour="show-children"
                            column={column}
                            data={data}
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
                    <div id="tasks-list-tree" style={{ display: 'none', marginTop: '30px' }}>
                        <Tree id="tasks-list-treeview"
                            plugins={false}
                            onChanged={this.handleShowTask}
                            data={dataTree} />
                    </div>

                    <PaginateBar
                        pageTotal={tasks.pages}
                        currentPage={currentPage}
                        func={this.handleGetDataPagination}
                    />

                </div>
            </div >
        );
    }
}

function mapState(state) {
    const { tasks, user, department, taskProject } = state;
    return { tasks, user, department, taskProject };
}

const actionCreators = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser,
    getPaginateTasks: taskManagementActions.getPaginateTasks,
    editArchivedOfTask: performTaskAction.editArchivedOfTask,
    getDepartment: UserActions.getDepartmentOfUser,
    getSubTask: taskManagementActions.getSubTask,
    startTimer: performTaskAction.startTimerTask,
    deleteTaskById: taskManagementActions._delete,
    getAllDepartment: DepartmentActions.get,
    getAllTaskProject: TaskProjectAction.get,
};
const translateTaskManagement = connect(mapState, actionCreators)(withTranslate(TaskManagement));
export { translateTaskManagement as TaskManagement };

