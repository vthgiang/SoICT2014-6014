import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, TreeTable } from '../../../../common-components';
import { getStorage } from '../../../../config';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../kpi/evaluation/dashboard/redux/actions';
import { taskManagementActions } from '../redux/actions';

import { ModalPerform } from '../../task-perform/component/modalPerform';
class TaskManagementOfUnit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organizationalUnit: [],
            perPage: 20,
            currentPage: 1,

            currentTab: "responsible",
            status: ["inprocess", "wait_for_approval"],
            priority: [],
            special: [],
            name: "",
            startDate: "",
            endDate: "",

            isAssigned: -1
        };
    }

    componentDidMount() {
        this.props.getDepartment();
        this.props.getAllDepartment();
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { dashboardEvaluationEmployeeKpiSet } = this.props;
        let { currentTab, organizationalUnit, status, priority, special, name, startDate, endDate, isAssigned } = this.state;

        if (organizationalUnit !== nextState.organizationalUnit ||
            currentTab !== nextState.currentTab ||
            status !== nextState.status ||
            priority !== nextState.priority ||
            special !== nextState.special ||
            name !== nextState.name ||
            startDate !== nextState.startDate ||
            endDate !== nextState.endDate ||
            isAssigned !== nextState.isAssigned
        ) {
            return false;
        }

        if (organizationalUnit && organizationalUnit.length === 0 && dashboardEvaluationEmployeeKpiSet && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
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
                    organizationalUnit: units,
                    selectBoxUnit: childrenOrganizationalUnit
                }
            });

            await this.props.getPaginatedTasksByOrganizationalUnit(units, 1, 20, status, [], [], null, null, null, isAssigned);
            return true;
        }

        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tasks.tasks && this.props.tasks.tasks && prevProps.tasks.tasks.length !== this.props.tasks.tasks.length) {
            this.handleUpdateData();
        }
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

        return [day, month, year].join('-');
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
        let { organizationalUnit, status, priority, special, name, startDate, endDate, isAssigned } = this.state;

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
            this.props.getPaginatedTasksByOrganizationalUnit(organizationalUnit, newCurrentPage, perPage, status, priority, special, name, startDate, endDate, isAssigned);
        };
    }

    nextPage = async (pageTotal) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, isAssigned } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            this.props.getPaginatedTasksByOrganizationalUnit(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate, isAssigned);
        };
    }

    backPage = async () => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, isAssigned } = this.state;

        let oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        let newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) {
            this.props.getPaginatedTasksByOrganizationalUnit(organizationalUnit, newCurrentPage, 20, status, priority, special, name, startDate, endDate, isAssigned);
        };
    }

    handleGetDataPerPage = (perPage) => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, isAssigned } = this.state;

        this.props.getPaginatedTasksByOrganizationalUnit(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate, isAssigned);

        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }

    handleUpdateData = () => {
        let { organizationalUnit, status, priority, special, name, startDate, endDate, perPage, isAssigned } = this.state;

        if (organizationalUnit && organizationalUnit.length !== 0) {
            this.props.getPaginatedTasksByOrganizationalUnit(organizationalUnit, 1, perPage, status, priority, special, name, startDate, endDate, isAssigned);
        }
        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }

    convertTime = (duration) => {
        let seconds = Math.floor((duration / 1000) % 60),
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
                currentTaskId: id
            }
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }

    formatPriority = (data) => {
        const { translate } = this.props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.average');
        if (data === 3) return translate('task.task_management.standard');
        if (data === 4) return translate('task.task_management.high');
        if (data === 5) return translate('task.task_management.urgent');
    }

    formatStatus = (data) => {
        const { translate } = this.props;
        if (data === "inprocess") return translate('task.task_management.inprocess');
        else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
        else if (data === "finished") return translate('task.task_management.finished');
        else if (data === "delayed") return translate('task.task_management.delayed');
        else if (data === "canceled") return translate('task.task_management.canceled');
    }

    handleChangeIsAssigned = (value) => {
        this.setState(state => {
            return {
                ...state,
                isAssigned: value[0]
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
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                startDate: value
            }
        });
    }

    handleChangeEndDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                endDate: value
            }
        });
    }

    render() {
        const { tasks, user, translate, dashboardEvaluationEmployeeKpiSet } = this.props;
        const { selectBoxUnit, currentTaskId, currentPage, startDate, endDate, perPage, status, isAssigned, organizationalUnit } = this.state;
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
            { name: translate('task.task_management.col_organization'), key: "organization" },
            { name: translate('task.task_management.col_priority'), key: "priority" },
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
                    organization: dataTemp[n].organizationalUnit ? dataTemp[n].organizationalUnit.name : translate('task.task_management.err_organizational_unit'),
                    priority: this.formatPriority(dataTemp[n].priority),
                    startDate: this.formatDate(dataTemp[n].startDate),
                    endDate: this.formatDate(dataTemp[n].endDate),
                    status: this.formatStatus(dataTemp[n].status),
                    progress: dataTemp[n].progress ? dataTemp[n].progress + "%" : "0%",
                    totalLoggedTime: this.convertTime(dataTemp[n].hoursSpentOnTask.totalHoursSpent),
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

        return (
            <React.Fragment>
                { currentOrganizationalUnit
                    ? <div className="box">
                        <div className="box-body qlcv">
                            <div className="form-inline">
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
                                                nonSelectedText: organizationalUnit.length !== 0 ? translate('task.task_management.select_department') : translate('general.not_org_unit'),
                                                allSelectedText: translate(`task.task_management.select_all_department`),
                                                includeSelectAllOption: true,
                                                maxHeight: 200
                                            }}
                                            value={organizationalUnit}
                                        >
                                        </SelectMulti>
                                    }
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
                                            { value: "canceled", text: translate('task.task_management.canceled') }
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
                                    <SelectMulti id="multiSelectCharacteristic" defaultValue={[
                                        translate('task.task_management.store'),
                                        translate('task.task_management.current_month')
                                    ]}
                                        items={[
                                            { value: "stored", text: translate('task.task_management.stored') },
                                            { value: "currentMonth", text: translate('task.task_management.current_month') }
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

                                {/* Công việc chưa phân công nhân viên */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.assigned_collaborate')}</label>
                                    <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                        id={`select-task-employee`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            [
                                                { value: -1, text: translate('task.task_management.none_select_assigned') },
                                                { value: 1, text: translate('task.task_management.assigned') },
                                                { value: 0, text: translate('task.task_management.not_assigned') }

                                            ]
                                        }
                                        onChange={this.handleChangeIsAssigned}
                                        value={isAssigned}
                                        multiple={false}
                                    />
                                </div>

                                {/* Ngày bắt đầu */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.start_date')}</label>
                                    <DatePicker
                                        id="start-date"
                                        dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                        value={startDate} // giá trị mặc định cho datePicker    
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
                                        value={endDate} // giá trị mặc định cho datePicker    
                                        onChange={this.handleChangeEndDate}
                                        disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                                    />
                                </div>
                            </div>

                            <div className="form-inline">
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
                                limit={perPage}
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
                                    }}
                                    funcEdit={this.handleShowModal}
                                />

                            </div>
                            {
                                currentTaskId &&
                                <ModalPerform
                                    units={units}
                                    id={currentTaskId}
                                />
                            }
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

