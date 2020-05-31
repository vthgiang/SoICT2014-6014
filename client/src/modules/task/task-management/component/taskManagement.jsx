import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalPerformTask } from '../../task-perform/component/modalPerformTask';
import { ModalPerform } from '../../task-perform/component/modalPerform';
import { ModalAddTask } from './taskAddModal';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../redux/actions';
import Swal from 'sweetalert2';

import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DataTableSetting, PaginateBar, TreeTable, SelectBox } from '../../../../common-components';


class TaskManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 20,
            startTimer: false,
            currentTimer: "",
            currentPage: 1,
            // showModal: "",
            // showAddSubTask: ""

            currentTab: "responsible",
            organizationalUnit: '[]',
            status: '[]',
            priority: '[]',
            special: '[]',
            name: null,
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        // var content = this.state.currentTab;
        // if (content === "responsible") {
            this.props.getResponsibleTaskByUser("[]", "1", "20", "[]", "[]", "[]", null);
        // } else if (content === "accountable") {
        //     this.props.getAccountableTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        // } else if (content === "consulted") {
        //     this.props.getConsultedTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        // } else if (content === "creator") {
        //     this.props.getCreatorTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        // } else {
        //     this.props.getInformedTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        // }
    }

    UNSAFE_componentWillUpdate() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/GridTableVers1.js';//fix /lib/...
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    list_to_tree = (list) => {
        var map = {}, node, roots = [], i, newarr = [];
        for (i = 0; i < list.length; i += 1) {
            map[list[i]._id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }
        // console.log(map);
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parent !== null) {
                // if you have dangling branches check that map[node.parentId] exists
                list[map[node.parent._id]].children.push(node);
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

    handleCountTime = async (id) => {
        const { startTimer } = this.state;
        if (startTimer) {
            Swal.fire({
                title: "Thời gian đã làm: 120'",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Lưu'
            }).then((res) => {
            });
        }
        await this.setState(state => {
            return {
                ...state,
                startTimer: !state.startTimer,
                currentTimer: id
            }
        })
    }
    handleGetDataPagination = async (index) => {
        var unit = window.$("#multiSelectUnit1").val();
        var status = window.$("#multiSelectStatus").val();
        var oldCurrentPage = this.state.currentPage;
        var perPage = this.state.perPage;
        if (status.length === 0) status = "[]";
        if (unit.length === 0) unit = "[]";
        await this.setState(state => {
            return {
                ...state,
                currentPage: index
            }
        })
        var newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== index) {
            var content = this.state.currentTab;
            if (content === "responsible") {
                this.props.getResponsibleTaskByUser(unit, newCurrentPage, perPage, status, "[]", "[]", null);
            } else if (content === "accountable") {
                this.props.getAccountableTaskByUser(unit, newCurrentPage, perPage, status, "[]", "[]", null);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser(unit, newCurrentPage, perPage, status, "[]", "[]", null);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser(unit, newCurrentPage, perPage, status, "[]", "[]", null);
            } else {
                this.props.getInformedTaskByUser(unit, newCurrentPage, perPage, status, "[]", "[]", null);
            }
        };
    }
    nextPage = async (pageTotal) => {
        var unit = window.$("#multiSelectUnit1").val();
        var status = window.$("#multiSelectStatus").val();
        var oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        var newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            var content = this.state.currentTab;
            if (content === "responsible") {
                this.props.getResponsibleTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "accountable") {
                this.props.getAccountableTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else {
                this.props.getInformedTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            }
        };
    }
    backPage = async () => {
        var unit = window.$("#multiSelectUnit1").val();
        var status = window.$("#multiSelectStatus").val();
        var oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        var newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            var content = this.state.currentTab;
            if (content === "responsible") {
                this.props.getResponsibleTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "accountable") {
                this.props.getAccountableTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else {
                this.props.getInformedTaskByUser(unit, newCurrentPage, 20, status, "[]", "[]", null);
            }
        };
    }

    handleGetDataPerPage = (perPage) => {
        // this.props.getResponsibleTaskByUser( "[]", "1", "20", "[]", "[]", "[]", null);
        var unit = window.$("#multiSelectUnit1").val();
        var status = window.$("#multiSelectStatus").val();
        var content = this.state.currentTab;
        if (status.length === 0) status = "[]";
        if (unit.length === 0) unit = "[]";
        if (content === "responsible") {
            this.props.getResponsibleTaskByUser(unit, 1, perPage, status, "[]", "[]", null);
        } else if (content === "accountable") {
            this.props.getAccountableTaskByUser(unit, 1, perPage, status, "[]", "[]", null);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser(unit, 1, perPage, status, "[]", "[]", null);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser(unit, 1, perPage, status, "[]", "[]", null);
        } else {
            this.props.getInformedTaskByUser(unit, 1, perPage, status, "[]", "[]", null);
        }
        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }

    handleUpdateData = () => {// TODO: handle search??
        var { organizationalUnit, status, priority, special, name } = this.state;

        var content = this.state.currentTab;
        var { perPage } = this.state;

        if (content === "responsible") {
            this.props.getResponsibleTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name);
        } else if (content === "accountable") {
            this.props.getAccountableTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name);
        } else {
            this.props.getInformedTaskByUser(organizationalUnit, 1, perPage, status, priority, special, name);
        }
        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
        // this.loadJS();
    }
    convertTime = (duration) => {
        // var milliseconds = parseInt((duration % 1000) / 100),
        var seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }
    handleShowModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModal: id
            }
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }
    handleCheckClickAddSubTask = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showAddSubTask: id
            }
        });
        window.$(`#addNewTask${id}`).modal('show')
    }

    getResponsibleOfItem = (data, id) => {
        data.map(item => {
            if (id === item._id) {
                return item.responsibleEmployees
            }
        })
    }

    getUnitIdOfItem = (data, id) => {
        data.map(item => {
            if (id === item._id) {
                return item.organizationalUnit._id
            }
        })
    }

    formatPriority =(data) => {
        if(data === 1) return "Thấp";
        if(data === 2) return "Trung bình";
        if(data === 3) return "Cao";
    }

    handleRoleChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                currentTab: value[0]
            }
        });
    }

    handleSelectOrganizationalUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                organizationalUnit: value
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
        const name = e.target.value;
        this.setState(state => {
            return {
                ...state,
                name: name
            }
        });        
    }

    render() {
        const { currentTab } = this.state;

        var currentTasks, units = [];
        var pageTotals;
        const { tasks, user, translate } = this.props;
        const { startTimer, currentTimer, currentPage } = this.state;
        if (tasks.tasks) {
            currentTasks = tasks.tasks;
            pageTotals = tasks.pages
        }
        if (user.organizationalUnitsOfUser) units = user.organizationalUnitsOfUser;
        const items = [];

        // khởi tạo dữ liệu TreeTable
        var column = [
            { name: translate('task.task_management.col_name'), key: "name" },
            { name: translate('task.task_management.col_organization'), key: "organization" },
            { name: translate('task.task_management.col_priority'), key: "priority" },
            { name: translate('task.task_management.col_start_date'), key: "startDate" },
            { name: translate('task.task_management.col_end_date'), key: "endDate" },
            { name: translate('task.task_management.col_status'), key: "status" },
            { name: translate('task.task_management.col_progress'), key: "progress" },
            { name: translate('task.task_management.col_logged_time'), key: "totalLoggedTime" }
        ];
        var data = [];
        if (typeof currentTasks !== 'undefined' && currentTasks.length !== 0) {
            var dataTemp = currentTasks;
            for (let n in dataTemp) {
                data[n] = {
                    ...dataTemp[n],
                    name: dataTemp[n].name,
                    organization: dataTemp[n].organizationalUnit.name,
                    priority: this.formatPriority(dataTemp[n].priority),
                    // priority: dataTemp[n].priority,
                    startDate: this.formatDate(dataTemp[n].startDate),
                    endDate: this.formatDate(dataTemp[n].endDate),
                    status: dataTemp[n].status,
                    progress: dataTemp[n].progress + "%",
                    totalLoggedTime: this.convertTime(dataTemp[n].totalLoggedTime),
                    parent: dataTemp[n].parent ? dataTemp[n].parent._id : null
                }
            }
            if (this.state.currentTab === "creator" || this.state.currentTab === "informed") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", ["add", "store"]] }
                }
            }
            if (this.state.currentTab === "responsible" || this.state.currentTab === "consulted") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", "startTimer", ["add", "store"]] }
                }
            }

            if (this.state.currentTab === "accountable") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", "startTimer", ["add", "store", "delete"]] }
                }
            }
        }

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div style={{ height: "40px" }}>
                        {this.state.currentTab !== "informed" &&
                            <button type="button" className="btn btn-success pull-right" data-toggle="modal" title={translate('task.task_management.add_title')} data-target="#addNewTask" data-backdrop="static" data-keyboard="false">{translate('task.task_management.add_task')}</button>
                        }
                        <ModalAddTask currentTasks={(typeof currentTasks !== 'undefined' && currentTasks.length !== 0) && this.list_to_tree(currentTasks)} id="" />
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('task.task_management.department')}</label>
                            {units &&
                                <SelectMulti id="multiSelectUnit1"
                                    defaultValue={units.map(item => { return item._id })}
                                    items={units.map(item => { return { value: item._id, text: item.name } })}
                                    onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: translate('task.task_management.select_department'), allSelectedText: translate(`task.task_management.select_all_department`) }}>
                                </SelectMulti>
                            }
                        </div>
                        <div className="form-group">
                            <label>{translate('task.task_management.status')}</label>
                            <SelectMulti id="multiSelectStatus" 
                                defaultValue={[
                                    translate('task.task_management.inprocess')
                                ]}
                                items={[
                                    { value: "Inprocess", text: translate('task.task_management.inprocess') },
                                    { value: "WaitForApproval", text: translate('task.task_management.wait_for_approval') },
                                    { value: "Finished", text: translate('task.task_management.finished') },
                                    { value: "Delayed", text: translate('task.task_management.delayed') },
                                    { value: "Canceled", text: translate('task.task_management.canceled') }
                                ]}
                                onChange={this.handleSelectStatus}
                                options={{ nonSelectedText: translate('task.task_management.select_status'), allSelectedText: translate('task.task_management.select_all_status') }}>
                            </SelectMulti>
                        </div>
                    </div>

                    <div className="form-inline">
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
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('task.task_management.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_name')} name="name" onChange = {(e) => this.handleChangeName(e)} />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.role')}</label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`select-task-role`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    [
                                        { value: "responsible", text: translate('task.task_management.responsible') },
                                        { value: "accountable", text: translate('task.task_management.accountable') },
                                        { value: "consulted", text: translate('task.task_management.consulted') },
                                        { value: "creator", text: translate('task.task_management.creator') },
                                        { value: "informed", text: translate('task.task_management.informed') },
                                    ]
                                }
                                onChange={this.handleRoleChange}
                                multiple={false}
                            />
                        </div>

                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('task.task_management.search')}</button>
                        </div>
                    </div>


                    <DataTableSetting
                        tableId="tree-table"
                        tableContainerId="tree-table-container"
                        tableWidth="1300px"
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
                        limit={this.state.perPage}
                        setLimit={this.setLimit}
                        hideColumnOption={true}
                    />

                    <div id="tree-table-container">
                        <TreeTable
                            behaviour="show-children"
                            column={column}
                            data={data}
                            titleAction={{
                                edit: translate('task.task_management.action_edit'),
                                delete: translate('task.task_management.action_delete'),
                                store: translate('task.task_management.action_store'),
                                add: translate('task.task_management.action_add'),
                                startTimer: translate('task.task_management.action_start_timer'),
                            }}
                            funcEdit={this.handleShowModal}
                            funcAdd={this.handleCheckClickAddSubTask}
                            funcStartTimer={this.handleCountTime}
                            // funcStore={this.handleStore}
                            // funcDelete={this.handleDelete}
                        />

                    </div>
                    {
                        // this.state.showModal !== undefined &&

                        <ModalPerform
                            id={this.state.showModal}
                            role={this.state.currentTab}
                        />
                    }
                    {/* {
                        // this.state.showModal !== undefined &&

                        <ModalPerformTask
                            // responsible={item.responsibleEmployees}
                            // unit={item.organizationalUnit._id}
                            // responsible={this.getResponsibleOfItem(data, this.state.showModal)}
                            // unit={this.getUnitIdOfItem(data, this.state.showModal)}
                            id={this.state.showModal}
                            role={this.state.currentTab}
                        />
                    } */}

                    {
                        this.state.showAddSubTask !== undefined &&
                        <ModalAddTask
                            currentTasks={(typeof currentTasks !== 'undefined' && currentTasks.length !== 0) && this.list_to_tree(currentTasks)}
                            id={this.state.showAddSubTask}
                            role={this.state.currentTab}
                        />
                    }


                    <PaginateBar
                        pageTotal={tasks.pages}
                        currentPage={this.state.currentPage}
                        func={this.handleGetDataPagination}
                    />

                    {/*                     
                    {tasks.isLoading?
                        <div className="table-info-panel">{translate('confirm.loading')}</div>:
                        tasks.pages===0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }  
                    */}

                    {/*   
                                        
                    <div className="row pagination-new">
                        <ul className="pagination" style={{ margin: "auto" }}>
                            <li><a href="#abc" onClick={() => this.backPage()}>«</a></li>
                            {items}
                            <li><a href="#abc" onClick={() => this.nextPage(pageTotals)}>»</a></li>
                        </ul>
                    </div> 
                    */}

                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { tasks, user } = state;
    return { tasks, user };
}

const actionCreators = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getDepartment: UserActions.getDepartmentOfUser
};
const translateTaskManagement = connect(mapState, actionCreators)(withTranslate(TaskManagement));
export {translateTaskManagement as TaskManagement} ;
// export default ( withTranslate(TaskManagement) ) ;
