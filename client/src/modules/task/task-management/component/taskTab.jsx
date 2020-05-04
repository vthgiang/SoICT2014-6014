import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalPerformTask } from '../../task-perform/component/modalPerformTask';
import { ModalAddTask } from './taskAddModal';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { taskManagementActions } from '../redux/actions';
import Swal from 'sweetalert2';

import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DataTableSetting, PaginateBar } from '../../../../common-components';
import { TreeTable } from '../../../../common-components';

class TabTaskContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 20,
            startTimer: false,
            currentTimer: "",
            currentPage: 1,
            // showModal: "",
            // showAddSubTask: ""
        };
    }
    componentDidMount() {
        this.props.getDepartment();
        var content = this.props.role;
        if (content === "responsible") {
            this.props.getResponsibleTaskByUser("[]", "1", "20", "[]", "[]", "[]", null);
        } else if (content === "accountable") {
            this.props.getAccountableTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        } else {
            this.props.getInformedTaskByUser("[]", 1, 20, "[]", "[]", "[]", null);
        }
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
            var content = this.props.role;
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
            var content = this.props.role;
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
            var content = this.props.role;
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
        var content = this.props.role;
        if (status.length === 0) status = "[]";
        if (unit.length === 0) unit = "[]";
        if (content === "responsible") {
            this.props.getResponsibleTaskByUser(unit, 1, perPage, status, "[]", "[]", null);//-------fix--localStorage.getItem('id') bên service
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
        var unit = window.$("#multiSelectUnit1").val();
        var status = window.$("#multiSelectStatus").val();
        var content = this.props.role;
        if (content === "responsible") {
            this.props.getResponsibleTaskByUser(unit, 1, 20, status, "[]", "[]", null);//-------fix--localStorage.getItem('id') bên service
        } else if (content === "accountable") {
            this.props.getAccountableTaskByUser(unit, 1, 20, status, "[]", "[]", null);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser(unit, 1, 20, status, "[]", "[]", null);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser(unit, 1, 20, status, "[]", "[]", null);
        } else {
            this.props.getInformedTaskByUser(unit, 1, 20, status, "[]", "[]", null);
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
        console.log('id---perform-->', id);
        // var responsible=this.getResponsibleOfItem(data, this.state.showModal);
        // var unit=this.getUnitIdOfItem(data, this.state.showModal);
        window.$(`#modelPerformTask${id}`).modal('show')
        // var element = document.getElementsByTagName("BODY")[0];
        // element.classList.add("modal-open");
        // var modal = document.getElementById(`modelPerformTask${id}`);
        // modal.classList.add("in");
        // modal.style = "display: block; padding-right: 17px;";
    }
    handleCheckClickAddSubTask = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showAddSubTask: id
            }
        });
        console.log('id---add-->', id);
        window.$(`#addNewTask${id}`).modal('show')
    }

    getResponsibleOfItem = (data,id) => {
        data.map(item => {
            if(id === item._id){
                return item.responsibleEmployees
            }
        })
    }

    getUnitIdOfItem = (data, id) => {
        data.map(item => {
            if(id === item._id){
                console.log('--item--', item);
                console.log('item.organizationalUnit._id', item.organizationalUnit._id);
                return item.organizationalUnit._id
            }
        })
    }

    render() {
        var currentTasks, units = [];
        var pageTotals;
        const { tasks, department, translate } = this.props;
        const { startTimer, currentTimer, currentPage } = this.state;
        if (tasks.tasks) {
            currentTasks = tasks.tasks;
            pageTotals = tasks.pages
        }
        if (department.unitofuser) units = department.unitofuser;
        const items = [];

        // khởi tạo dữ liệu TreeTable
        var column = [
            { name: "Tên công việc", key: "name" },
            { name: "Đơn vị", key: "organization" },
            { name: "Độ ưu tiên", key: "priority" },
            { name: "Ngày bắt đầu", key: "startDate" },
            { name: "Ngày kết thúc", key: "endDate" },
            { name: "Trạng thái", key: "status" },
            { name: "Tiến độ", key: "progress" },
            { name: "Thời gian thực hiện", key: "totalLoggedTime" }
        ];
        var data = [];
        if (typeof currentTasks !== 'undefined' && currentTasks.length !== 0) {
            var dataTemp = currentTasks;
            for (let n in dataTemp) {
                data[n] = {
                    ...dataTemp[n],
                    name: dataTemp[n].name,
                    organization: dataTemp[n].organizationalUnit.name,
                    priority: dataTemp[n].priority,
                    startDate: this.formatDate(dataTemp[n].startDate),
                    endDate: this.formatDate(dataTemp[n].endDate),
                    status: dataTemp[n].status,
                    progress: dataTemp[n].progress + "%",
                    totalLoggedTime: this.convertTime(dataTemp[n].totalLoggedTime),
                    parent: dataTemp[n].parent ? dataTemp[n].parent._id : null
                }
            }
            if (this.props.role === "creator" || this.props.role === "informed") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", ["add", "store"]] }
                }
            }
            if (this.props.role === "responsible" || this.props.role === "consulted") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", "startTimer", ["add", "store"]] }
                }
            }

            if (this.props.role === "accountable") {
                for (let i in data) {
                    data[i] = { ...data[i], action: ["edit", "startTimer", ["add", "store", "delete"]] }
                }
            }
        }

        return (
            <React.Fragment>
                <div className="qlcv">

                    <div style={{ height: "40px" }}>
                        {this.props.role !== "informed" &&
                            <button type="button" className="btn btn-success pull-right" data-toggle="modal" title="Thêm mới một công việc" data-target="#addNewTask" data-backdrop="static" data-keyboard="false">Thêm mới</button>
                        }
                        <ModalAddTask currentTasks={(typeof currentTasks !== 'undefined' && currentTasks.length !== 0) && this.list_to_tree(currentTasks)} id="" />
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label>Đơn vị</label>
                            {units &&
                                <SelectMulti id="multiSelectUnit1"
                                    defaultValue={units.map(item => { return item._id })}
                                    items={units.map(item => { return { value: item._id, text: item.name } })}
                                    options={{ nonSelectedText: "Chọn đơn vị", allSelectedText: "Tất cả các đơn vị" }}>
                                </SelectMulti>
                            }
                        </div>
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <SelectMulti id="multiSelectStatus" defaultValue={["Đang chờ", "Đang thực hiện"]}
                                items={[
                                    { value: "Đang chờ", text: "Đang chờ" },
                                    { value: "Đang thực hiện", text: "Đang thực hiện" },
                                    { value: "Quá hạn", text: "Quá hạn" },
                                    { value: "Chờ phê duyệt", text: "Chờ phê duyệt" },
                                    { value: "Đã hoàn thành", text: "Đã hoàn thành" },
                                    { value: "Đã hủy", text: "Đã hủy" },
                                    { value: "Tạm dừng", text: "Tạm dừng" }
                                ]}
                                options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Tất cả các trạng thái" }}>
                            </SelectMulti>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label>Độ ưu tiên</label>
                            <SelectMulti id="multiSelectPriority" defaultValue={["Cao", "Trung bình", "Thấp"]}
                                items={[
                                    { value: "Cao", text: "Cao" },
                                    { value: "Trung bình", text: "Trung bình" },
                                    { value: "Thấp", text: "Thấp" }
                                ]}
                                options={{ nonSelectedText: "Chọn mức độ ưu tiên", allSelectedText: "Tất cả các mức" }}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label>Đặc tính</label>
                            <SelectMulti id="multiSelectCharacteristic" defaultValue={["Lưu trong kho", "Tháng hiện tại"]}
                                items={[
                                    { value: "Lưu trong kho", text: "Lưu trong kho" },
                                    { value: "Tháng hiện tại", text: "Tháng hiện tại" }
                                ]}
                                options={{ nonSelectedText: "Chọn đặc tính", allSelectedText: "Tất cả các đặc tính" }}>
                            </SelectMulti>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label>Tên công việc</label>
                            <input className="form-control" type="text" placeholder="Tìm kiếm theo tên" />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>Tìm kiếm</button>
                        </div>
                    </div>


                    <DataTableSetting
                        tableId="tree-table"
                        tableContainerId="tree-table-container"
                        tableWidth="1300px"
                        columnArr={[
                            'Tên công việc',
                            'Đơn vị',
                            'Độ ưu tiên',
                            'Ngày bắt đầu',
                            'Ngày kết thúc',
                            'Trạng thái',
                            'Tiến độ',
                            'Thời gian thực hiện'
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
                                edit: "Bắt đầu công việc",
                                delete: "Xóa công việc",
                                store: "Lưu vào kho",
                                add: "Thêm công việc con",
                                startTimer: "Bắt đầu bấm giờ",
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

                        <ModalPerformTask
                            // responsible={item.responsibleEmployees}
                            // unit={item.organizationalUnit._id}
                            // responsible={this.getResponsibleOfItem(data, this.state.showModal)}
                            // unit={this.getUnitIdOfItem(data, this.state.showModal)}
                            id={this.state.showModal}
                            role={this.props.role}
                        />
                    }

                    {
                        this.state.showAddSubTask !== undefined &&
                        <ModalAddTask
                            currentTasks={(typeof currentTasks !== 'undefined' && currentTasks.length !== 0) && this.list_to_tree(currentTasks)}
                            id={this.state.showAddSubTask}
                            role={this.props.role}
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

            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, department } = state;
    return { tasks, department };
}

const actionCreators = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getDepartment: DepartmentActions.getDepartmentOfUser
};
const connectedTabTaskContent = connect(mapState, actionCreators)(withTranslate(TabTaskContent))
export { connectedTabTaskContent as TabTaskContent };