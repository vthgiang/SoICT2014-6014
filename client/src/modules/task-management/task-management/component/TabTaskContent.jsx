import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalPerformTask } from '../../perform-task/component/ModalPerformTask';
import { ModalAddTask } from './ModalAddTask';
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { taskManagementActions } from '../redux/actions';
import Swal from 'sweetalert2';
class TabTaskContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 20,
            extendProperties: false,
            startTimer: false,
            currentTimer: "",
            currentPage: 1,
            showModal: ""
        };
    }
    componentDidMount() {
        this.props.getDepartment();//fix ở prj mới rồi--------------localStorage.getItem('id')------------------
        var content = this.props.role;
        if (content === "responsible") {
            this.props.getResponsibleTaskByUser( "[]", "1", "20", "[]", "[]", "[]", null);
        } else if (content === "accountable") {
            this.props.getAccounatableTaskByUser( "[]", 1, 20, "[]", "[]", "[]", null);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser( "[]", 1, 20, "[]", "[]", "[]", null);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser( "[]", 1, 20, "[]", "[]", "[]", null);
        } else {
            this.props.getInformedTaskByUser( "[]", 1, 20, "[]", "[]", "[]", null);
        }
        this.defindMultiSelect();
        this.handleResizeColumn();
    }

    UNSAFE_componentWillUpdate() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/GridTableVers1.js';//fix /lib/...
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
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
    defindMultiSelect = () => {
        window.$(document).ready(function () {
            window.$('#multiSelectShowColumn1').multiselect({
                buttonWidth: '160px',
                //   includeSelectAllOption : true,
                nonSelectedText: 'Chọn cột muốn ẩn',
                allSelectedText: 'Ẩn tất cả các cột'
            });
        });
        window.$(document).ready(function () {
            window.$('#multiSelectStatus').multiselect({
                buttonWidth: '160px',
                //   includeSelectAllOption : true,
                nonSelectedText: 'Chọn trạng thái',
                allSelectedText: 'Tất cả trạng thái'
            });
        });
        window.$(document).ready(function () {
            window.$('#multiSelectPriority').multiselect({
                buttonWidth: '160px',
                //   includeSelectAllOption : true,
                nonSelectedText: 'Chọn độ ưu tiên',
                allSelectedText: 'Tất cả độ ưu tiên'
            });
        });
        window.$(document).ready(function () {
            window.$('#multiSelectCharacteristic').multiselect({
                buttonWidth: '160px',
                //   includeSelectAllOption : true,
                nonSelectedText: 'Chọn đặc tính',
                allSelectedText: 'Tất cả đặc tính'
            });
        });
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
    handleSetting = async () => {
        console.log("----------------------Cập nhật cột muốn ấn------------------------");
        // Cập nhật cột muốn ấn
        var test = window.$("#multiSelectShowColumn1").val();
        window.$("td").show();
        window.$("th").show();
        for (var j = 0, len = test.length; j < len; j++) {
            window.$('td:nth-child(' + test[j] + ')').hide();
            window.$('th:nth-child(' + test[j] + ')').hide();
        }
        // Cập nhật số dòng trang trên một trang hiển thị
        await this.setState(state => {
            return {
                ...state,
                perPage: this.perPage.value
            }
        })
        // Đóng cửa sổ cài đặt
        var element = document.getElementById("setting-table");
        element.classList.remove("in");
        element.setAttribute("aria-expanded", "false");
    }
    handleExtendProperties = async () => {
        await this.defindMultiSelect();
        await this.setState(state => {
            return {
                ...state,
                extendProperties: !state.extendProperties
            }
        })
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
                console.log("okokokok");
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
                this.props.getResponsibleTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "accountable") {
                this.props.getAccounatableTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else {
                this.props.getInformedTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
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
                this.props.getResponsibleTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "accountable") {
                this.props.getAccounatableTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else {
                this.props.getInformedTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
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
                this.props.getResponsibleTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);//-------fix--localStorage.getItem('id') bên service
            } else if (content === "accountable") {
                this.props.getAccounatableTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "consulted") {
                this.props.getConsultedTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else if (content === "creator") {
                this.props.getCreatorTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            } else {
                this.props.getInformedTaskByUser( unit, newCurrentPage, 20, status, "[]", "[]", null);
            }
        };
    }
    handleUpdateData = () => {
        var unit = window.$("#multiSelectUnit1").val();
        var status = window.$("#multiSelectStatus").val();
        var content = this.props.role;
        if (content === "responsible") {
            this.props.getResponsibleTaskByUser( unit, 1, 20, status, "[]", "[]", null);//-------fix--localStorage.getItem('id') bên service
        } else if (content === "accountable") {
            this.props.getAccounatableTaskByUser( unit, 1, 20, status, "[]", "[]", null);
        } else if (content === "consulted") {
            this.props.getConsultedTaskByUser( unit, 1, 20, status, "[]", "[]", null);
        } else if (content === "creator") {
            this.props.getCreatorTaskByUser( unit, 1, 20, status, "[]", "[]", null);
        } else {
            this.props.getInformedTaskByUser( unit, 1, 20, status, "[]", "[]", null);
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
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`modelPerformTask${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }
    render() {
        var currentTasks, units;
        var pageTotals;
        const { tasks, department } = this.props;
        const { extendProperties, startTimer, currentTimer, currentPage } = this.state;
        if (tasks.tasks) {
            currentTasks = tasks.tasks;
            pageTotals = tasks.pages
        }
        if (department.unitofuser) units = department.unitofuser;
        const items = [];
        if (pageTotals > 5) {
            if (currentPage < 3) {
                for (let i = 0; i < 5; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
                }
                items.push(<li className="disable" key={pageTotals}><a href="#abc">...</a></li>);
            } else if (currentPage >= pageTotals - 3) {
                items.push(<li className="disable" key={0}><a href="#abc">...</a></li>);
                for (let i = pageTotals - 5; i < pageTotals; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
                }
            } else {
                items.push(<li className="disable" key={0}><a href="#abc">...</a></li>);
                for (let i = currentPage - 2; i < currentPage + 3; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
                }
                items.push(<li className="disable" key={pageTotals + 1}><a href="#abc">...</a></li>);
            }
        } else {
            for (let i = 0; i < pageTotals; i++) {
                items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
            }
        }
        return (
            <React.Fragment>
                <div className="col-xs-7">
                    <div className="col-xs-6 item-container">
                        <label>Đơn vị:</label>
                        {units &&
                            <select id="multiSelectUnit1" multiple="multiple" defaultValue={units.map(item => item._id)}>
                                {units.map(item => {
                                    return <option key={item._id} value={item._id}>{item.name}</option>
                                })}
                            </select>
                        }
                    </div>
                    <div className="col-xs-6 item-container">
                        <label style={{ width: "48%" }}>Tên công việc:</label>
                        <input className="form-control" type="text" placeholder="Tìm kiếm theo tên" />
                    </div>
                    <div className="col-xs-6 item-container">
                        <label>Trạng thái:</label>
                        <select id="multiSelectStatus" style={{ marginLeft: "0" }} multiple="multiple" defaultValue={["Đang chờ", "Đang thực hiện"]}>
                            <option value="Đang chờ">Đang chờ</option>
                            <option value="Đang thực hiện">Đang thực hiện</option>
                            <option value="Quá hạn">Quá hạn</option>
                            <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                            <option value="Đã hủy">Đã hủy</option>
                            <option value="Tạm dừng">Tạm dừng</option>
                        </select>
                    </div>
                    {extendProperties &&
                        <React.Fragment>
                            <div className="col-xs-6 item-container">
                                <label style={{ marginRight: "9%" }}>Độ ưu tiên:</label>
                                <select id="multiSelectPriority" style={{ marginLeft: "0" }} multiple="multiple" defaultValue={["Đang chờ", "Đang thực hiện", "Quá hạn", "Đã hoàn thành", "Đã hủy", "Tạm dừng"]}>
                                    <option value="Cao">Cao</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Thấp">Thấp</option>
                                </select>
                            </div>
                            <div className="col-xs-6 item-container">
                                <label>Đặc tính:</label>
                                <select id="multiSelectCharacteristic" style={{ marginLeft: "0" }} multiple="multiple" defaultValue={["Đang chờ", "Đang thực hiện", "Quá hạn", "Đã hoàn thành", "Đã hủy", "Tạm dừng"]}>
                                    <option value="1">Lưu trong kho</option>
                                    <option value="2">Tháng hiện tại</option>
                                </select>
                            </div>
                        </React.Fragment>}
                    <div className="col-xs-3 item-container">
                        <button type="button" className="btn btn-success" onClick={this.handleUpdateData} style={{ width: "135%" }}>Tìm kiếm</button>
                    </div>
                    <div className="col-xs-8" style={{ marginLeft: "-12px" }}>
                        <button className="btn btn-default" style={{ background: "none", border: "none", fontWeight: "700" }} onClick={this.handleExtendProperties}>{extendProperties ? "Cơ bản " : "Nâng cao "}<i className={extendProperties?"fa fa-angle-double-up":"fa fa-angle-double-down"}></i></button>
                    </div>
                </div>
                <div className="col-xs-2 col-xs-offset-3" style={{ marginTop: "4.5%" }}>
                    {this.props.role !== "informed" &&
                        <button type="button" className="btn btn-success" data-toggle="modal" title="Thêm mới một công việc" data-target="#addNewTask" data-backdrop="static" data-keyboard="false" style={{ width: "100%" }}>Thêm mới</button>
                    }
                    <ModalAddTask currentTasks={(typeof currentTasks !== 'undefined' && currentTasks.length !== 0)&&this.list_to_tree(currentTasks)} id=""/>
                </div>
                <table id="tree-table" className="table table-hover table-bordered">
                    <thead>
                        <tr id="task">
                            <th style={{ width: "9%" }} title="Tên công việc">Tên công việc</th>
                            <th style={{ width: "14%" }} title="Đơn vị">Đơn vị</th>
                            <th style={{ width: "7%" }} title="Độ ưu tiên">Độ ưu tiên</th>
                            <th style={{ width: "7%" }} title="Ngày bắt đầu">Bắt đầu</th>
                            <th style={{ width: "7%" }} title="Ngày kết thúc">Kết thúc</th>
                            <th style={{ width: "8%" }} title="Trạng thái">Trạng thái</th>
                            <th style={{ width: "6%" }} title="Tiến độ">Tiến độ</th>
                            <th style={{ width: "7%" }} title="Thời gian thực hiện">Thời gian</th>
                            <th style={{ width: "9%" }}>
                                Hành động
                                <button type="button" data-toggle="collapse" data-target="#setting-table" style={{ border: "none", background: "none" }}><i className="fa fa-gear"></i></button>
                                <div id="setting-table" className="row collapse">
                                    <span className="pop-arw arwTop L-auto R10"></span>
                                    <div className="col-xs-12">
                                        <label style={{ marginRight: "15px" }}>Ẩn cột:</label>
                                        <select id="multiSelectShowColumn1" multiple="multiple">
                                            <option value="1">Tên công việc</option>
                                            <option value="2">Đơn vị</option>
                                            <option value="3">Độ ưu tiên</option>
                                            <option value="4">Thời gian bắt đầu</option>
                                            <option value="5">Thời gian kết thúc</option>
                                            <option value="6">Trạng thái</option>
                                            <option value="7">Tiến độ</option>
                                            <option value="8">Thời gian</option>
                                            <option value="9">Hành động</option>
                                        </select>
                                    </div>
                                    <div className="col-xs-12" style={{ marginTop: "10px" }}>
                                        <label style={{ marginRight: "15px" }}>Số dòng/trang:</label>
                                        <input className="form-control" type="text" defaultValue={10} ref={input => this.perPage = input} />
                                    </div>
                                    <div className="col-xs-2 col-xs-offset-6" style={{ marginTop: "10px" }}>
                                        <button type="button" className="btn btn-success" onClick={this.handleSetting}>Cập nhật</button>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="taskTable" className="task-table">
                        {
                            (typeof currentTasks !== 'undefined' && currentTasks.length !== 0) ?
                                this.list_to_tree(currentTasks).map(item =>
                                    <tr key={item._id} data-id={item._id} data-parent={item.parent === null ? item.parent : item.parent._id} data-level={item.level}>
                                        <td title={item.name} data-column="name">{item.name}</td>
                                        <td title={item.unit.name}>{item.unit.name}</td>
                                        <td title={item.priority}>{item.priority}</td>
                                        <td title={this.formatDate(item.startdate)}>{this.formatDate(item.startdate)}</td>
                                        <td title={this.formatDate(item.enddate)}>{this.formatDate(item.enddate)}</td>
                                        <td title={item.status}>{item.status}</td>
                                        <td title={item.progress + "%"}>{item.progress + "%"}</td>
                                        <td title={this.convertTime(item.time)}>{this.convertTime(item.time)}</td>
                                        <td >
                                            <a href={`#modelPerformTask${item._id}`} className="edit" data-toggle="modal" onClick={() => this.handleShowModal(item._id)} title={"Bắt đầu" + item.name}><i className="material-icons">edit</i></a>
                                            {this.state.showModal === item._id ? <ModalPerformTask responsible={item.responsible} unit={item.unit._id} id={item._id} role={this.props.role} /> : null}
                                            {
                                                this.props.role !== "creator" && this.props.role !== "informed"
                                                && <a href="#abc" className={startTimer && currentTimer === item._id ? "edit" : "timer"} id="task-timer" title="Bắt đầu bấm giờ" onClick={() => this.handleCountTime(item._id)}><i className="material-icons">timer</i></a>
                                            }
                                            <button type="button" data-toggle="collapse" data-target={`#actionTask${item._id}`} style={{ border: "none", background: "none" }}><i className="fa fa-ellipsis-v"></i></button>
                                            <div id={`actionTask${item._id}`} className="collapse action-template">
                                                <a href={`#addNewTask${item._id}`} onClick={this.handleCheckClick} data-toggle="modal" className="add_circle" title="Thêm công việc con cho công việc này"><i className="material-icons">add_circle</i></a>
                                                <a href="#abc" className="all_inbox" title="Lưu công việc này vào kho"><i className="material-icons">all_inbox</i></a>
                                                {
                                                    this.props.role === "accountable" &&
                                                    <a href="#abc" className="delete" onClick={() => this.handleAction(item._id)} title="Xóa công việc này"><i className="material-icons"></i></a>
                                                }
                                            </div>
                                            <ModalAddTask currentTasks={(typeof currentTasks !== 'undefined' && currentTasks.length !== 0)&&this.list_to_tree(currentTasks)} id={item._id} role={this.props.role} />
                                        </td>
                                    </tr>
                                ) : null
                        }
                    </tbody>
                </table>
                <div className="row pagination-new">
                    <ul className="pagination" style={{ margin: "auto" }}>
                        <li><a href="#abc" onClick={() => this.backPage()}>«</a></li>
                        {items}
                        <li><a href="#abc" onClick={() => this.nextPage(pageTotals)}>»</a></li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, department } = state;//chuyen snag cai mới thì department ko có s
    return { tasks, department };
}

const actionCreators = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccounatableTaskByUser: taskManagementActions.getAccounatableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getDepartment: DepartmentActions.getDepartmentOfUser
};
const connectedTabTaskContent = connect(mapState, actionCreators)(TabTaskContent);
export { connectedTabTaskContent as TabTaskContent };