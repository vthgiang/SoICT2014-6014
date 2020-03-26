import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalAddTaskTemplate } from './ModalAddTaskTemplate';
import { DepartmentActions } from '../../super-admin-management/departments-management/redux/actions';
// sửa đường dẫn sau khi vào project mới
import {taskTemplateActions} from '../redux/actions'
import { ModalViewTaskTemplate } from './ModalViewTaskTemplate';
import { ModalEditTaskTemplate } from './ModalEditTaskTemplate';

import Swal from 'sweetalert2';

class TaskTemplate extends Component {
    componentDidMount() {
        this.props.getDepartment();
        //edit later
        this.props.getTaskTemplateByUser("1", "[]");
        //get department of current user
        this.loadJSMultiSelect();
        let script = document.createElement('script');
        script.src = '../lib/main/js/defindMultiSelect.js'
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.handleResizeColumn();
    }
    constructor(props) {
        super(props);
        this.state = {
            status: 'start',
            currentPage: 1,
            perPage: 15,
            unit: [],
            currentRole: localStorage.getItem("currentRole"),
            showView: "",
            showEdit: "",
        };
        this.handleUpdateData = this.handleUpdateData.bind(this);
    }
    // handleInputSearchPage = (e) => {
    //     // if (e.key === 'Enter') {
    //     //     console.log('do validate');
    //     // }
    //     var input = document.getElementById("input-search-page");
    //     input.addEventListener("keyup", function(event) {
    //         // Number 13 is the "Enter" key on the keyboard
    //         if (event.keyCode === 13) {
    //           // Cancel the default action, if needed
    //           event.preventDefault();
    //           // Trigger the button element with a click
    //           document.getElementById("search-page").click();
    //         }
    //       });
    // }
    handleSetting = async () => {
        // Cập nhật cột muốn ấn
        var test = window.$("#multiSelectShowColumn").val();
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
        this.props.getTaskTemplateByUser(localStorage.getItem('id'), this.perPage.value, "[]");
    }
    // handleAction = (id) => {
    //     // Đóng cửa sổ cài đặt
    //     var element = document.getElementById(`action${id}`);
    //     element.classList.remove("in");
    //     element.setAttribute("aria-expanded", "false");
    // }
    loadJSMultiSelect = () => {
        window.$(document).ready(function () {
            window.$('#multiSelectShowColumn').multiselect({
                buttonWidth: '160px',
                //   includeSelectAllOption : true,
                nonSelectedText: 'Chọn cột muốn ẩn'
            });
        });
    }
    // getSelectedValues = () => {
    //     var selectedVal = window.$("#multiSelectUnit").val();
    //     for (var i = 0; i < selectedVal.length; i++) {
    //         //abc
    //     }
    //     console.log(selectedVal);
    // }
    //
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
    myFunction = () => {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toLowerCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    updateCurrentPage = (number) => {
        this.setState(state => {
            return {
                ...state,
                currentPage: number
            }
        })
    }
    handleGetDataPagination = async (index) => {
        var test = window.$("#multiSelectUnit").val();
        var oldCurrentPage = this.state.currentPage;
        await this.updateCurrentPage(index);
        if (oldCurrentPage !== index) this.props.getTaskTemplateByUser(localStorage.getItem('id'), index, test);
    }
    nextPage = async (pageTotal) => {
        var test = window.$("#multiSelectUnit").val();
        var oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === pageTotal ? pageTotal : state.currentPage + 1
            }
        })
        var newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) this.props.getTaskTemplateByUser(localStorage.getItem('id'), this.state.currentPage, test);
    }
    backPage = async () => {
        var test = window.$("#multiSelectUnit").val();
        var oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
            }
        })
        var newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) this.props.getTaskTemplateByUser(localStorage.getItem('id'), this.state.currentPage, test);
    }
    handleUpdateData = () => {
        var test = window.$("#multiSelectUnit").val();
        console.log(test);
        this.props.getTaskTemplateByUser(localStorage.getItem('id'), 1, test);
        this.setState(state => {
            return {
                ...state,
                currentPage: 1
            }
        })
    }
    handleShowView = async (id) => {
        await this.setState(state=>{
            return{
                ...state,
                showView: id
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`viewTaskTemplate${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }
    handleShowEdit = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showEdit: id
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`editTaskTemplate${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }


    //Xoa tasktemplate theo id
    handleDelete = (id, count) => {
        if (count == 0) {
            Swal.fire({
                title: "Bạn chắc chắn muốn xóa mẫu công việc này?",
                type: 'success',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value){
                    this.props._delete(id);
                }
            });
        } else {
            Swal.fire({
                title: "Không thể xóa mẫu công việc này do đã được sử dụng.",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
        
    }

    handleSearchPage = async () => {
        var newCurrentPage = this.newCurrentPage.value;
        console.log(typeof newCurrentPage);
        if (newCurrentPage) {
            this.handleGetDataPagination(parseInt(newCurrentPage));
            var element = document.getElementById("search-page");
            element.classList.remove("in");
            element.setAttribute("aria-expanded", "false");
        }
    }
    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        return (currentRole === deanCurrentUnit);
    }
    render() {
        var list, pageTotal, units, currentUnit;
        const { tasktemplates, department } = this.props;
        const { currentPage } = this.state;
        if (tasktemplates.pageTotal) pageTotal = tasktemplates.pageTotal;
        if (department.unitofuser) {
            units = department.unitofuser;
            currentUnit = units.filter(item =>
                item.dean === localStorage.getItem("currentRole")
                || item.vice_dean === localStorage.getItem("currentRole")
                || item.employee === localStorage.getItem("currentRole"));
        }
        console.log(currentUnit);
        if (tasktemplates.items) {
            list = tasktemplates.items;
        }
        var items = [];
        console.log("*********abc******************",list);
        if (typeof pageTotal !== "undefined" && pageTotal > 5) {
            if (currentPage <= 3) {
                for (let i = 0; i < 5; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
                }
                items.push(<li className="disable" key={pageTotal + 1}><a href="#search-page" data-toggle="collapse">...</a></li>);
                items.push(<li key={pageTotal} className={currentPage === pageTotal ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(pageTotal)}>{pageTotal}</a></li>);
            } else if (currentPage >= pageTotal - 3) {
                items.push(<li key={1} className={currentPage === 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(1)}>1</a></li>);
                items.push(<li className="disable" key={0}><a href="#search-page" data-toggle="collapse">...</a></li>);
                for (let i = pageTotal - 5; i < pageTotal; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
                }
            } else {
                items.push(<li key={1} className={currentPage === 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(1)}>1</a></li>);
                items.push(<li className="disable" key={0}><a href="#search-page" data-toggle="collapse">...</a></li>);
                for (let i = currentPage - 3; i < currentPage + 2; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
                }
                items.push(<li className="disable" key={pageTotal + 1}><a href="#search-page" data-toggle="collapse">...</a></li>);
                items.push(<li key={pageTotal} className={currentPage === pageTotal ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(pageTotal)}>{pageTotal}</a></li>);
            }
        } else if (typeof pageTotal !== "undefined") {
            for (let i = 0; i < pageTotal; i++) {
                items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => this.handleGetDataPagination(i + 1)}>{i + 1}</a></li>);
            }
        }
        return (
           
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box">
                                {/* /.box-header */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="col-xs-3 item-container">
                                                <label>Tên mẫu:</label>
                                                <input className="form-control" type="text" placeholder="Tìm kiếm theo tên" />
                                            </div>
                                            <div className="col-xs-3  item-container">
                                                <label style={{ marginLeft: "-5%", marginRight: "-6%" }}>Đơn vị:</label>
                                                {units &&
                                                    <select id="multiSelectUnit" multiple="multiple" defaultValue={units.map(item => item._id)}>
                                                        {units.map(item => {
                                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                                        })}
                                                    </select>
                                                }
                                            </div>
                                            <div className="col-xs-2" style={{ marginLeft: "-5%" }}>
                                                <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={this.handleUpdateData}>Tìm kiếm</button>
                                            </div>
                                            <div className="col-xs-1" style={{marginLeft: "28.5%"}}>
                                                {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                                    <button type="button" className="btn btn-success" data-toggle="modal" title="Thêm mới một mẫu công việc" data-target="#addTaskTemplate" data-backdrop="static" data-keyboard="false">Thêm mới</button>}
                                                    <ModalAddTaskTemplate />
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <table className="table table-bordered table-striped" id="myTable">
                                                <thead>
                                                    <tr>
                                                        <th title="Tên mẫu công việc">Tên mẫu công việc</th>
                                                        <th title="Mô tả">Mô tả</th>
                                                        <th title="Số lần sử dụng">Số lần sử dụng</th>
                                                        <th title="Người tạo mẫu">Người tạo mẫu</th>
                                                        <th title="Đơn vị">Đơn vị</th>

                                                        <th style={{ width: "121px" }}>
                                                            Hoạt động
                                                            <button type="button" data-toggle="collapse" data-target="#setting-table" style={{ border: "none", background: "none" }}><i className="fa fa-gear"></i></button>
                                                            <div id="setting-table" className="row collapse" style={{ width: "26%" }}>
                                                                <span className="pop-arw arwTop L-auto" style={{ right: "13px" }}></span>
                                                                <div className="col-xs-12">
                                                                    <label style={{ marginRight: "15px" }}>Ẩn cột:</label>
                                                                    <select id="multiSelectShowColumn" multiple="multiple">
                                                                        <option value="1">Tên mẫu</option>
                                                                        <option value="2">Mô tả</option>
                                                                        <option value="3">Số lần sử dụng</option>
                                                                        <option value="4">Người tạo</option>
                                                                        <option value="5">Đơn vị</option>
                                                                        <option value="6">Hoạt động</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-xs-12" style={{ marginTop: "10px" }}>
                                                                    <label style={{ marginRight: "15px" }}>Số dòng/trang:</label>
                                                                    <input className="form-control" type="text" defaultValue={1} ref={input => this.perPage = input} />
                                                                </div>
                                                                <div className="col-xs-2 col-xs-offset-6" style={{ marginTop: "10px" }}>
                                                                    <button type="button" className="btn btn-success" onClick={this.handleSetting}>Cập nhật</button>
                                                                </div>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="task-table">
                                                    {
                                                        (typeof list !== 'undefined' && list.length !== 0) ?
                                                            list.map(item =>
                                                                item.resourceId && <tr key={item.resourceId._id}>
                                                                    <td title={item.resourceId.name}>{item.resourceId.name}</td>
                                                                    <td title={item.resourceId.description}>{item.resourceId.description}</td>
                                                                    <td title={item.resourceId.count}>{item.resourceId.count}</td>
                                                                    <td title={item.resourceId.creator.name}>{item.resourceId.creator.name}</td>
                                                                    <td title={item.resourceId.unit.name}>{item.resourceId.unit.name}</td>
                                                                    <td>
                                                                        <a href="#abc" onClick={()=>this.handleShowView(item.resourceId._id)} data-toggle="modal" title="Xem chi tiết mẫu công việc này">
                                                                            <i className="material-icons" style={!this.checkPermisson(currentUnit && currentUnit[0].dean) ? { paddingLeft: "35px" } : { paddingLeft: "0px" }}>view_list</i>
                                                                        </a>
                                                                        {this.state.showView===item.resourceId._id&&<ModalViewTaskTemplate id={item.resourceId._id} />}
                                                                        {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                                                            <React.Fragment>
                                                                                <a onClick={()=>this.handleShowEdit(item.resourceId._id)} data-toggle="modal" className="edit" title="Sửa mẫu công việc này"><i className="material-icons"></i></a>
                                                                                <a onClick={()=>this.handleDelete(item.resourceId._id, item.resourceId.count)} className="delete" title="Xóa mẫu công việc này"><i className="material-icons"></i></a>
                                                                            </React.Fragment>}
                                                                        {this.state.showEdit===item.resourceId._id&&<ModalEditTaskTemplate id={item.resourceId._id} />}
                                                                    </td>
                                                                </tr>
                                                            ) : <tr><td colSpan={6}><center>Không có dữ liệu</center></td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row pagination-new">
                                        <ul className="pagination" style={{ margin: "auto" }}>
                                            <li><a href="#abc" onClick={() => this.backPage()}>«</a></li>
                                            {items}
                                            <li><a href="#abc" onClick={() => this.nextPage(pageTotal)}>»</a></li>
                                        </ul>
                                        <div id="search-page" className="col-sm-12 collapse" style={{ width: "26%" }}>
                                            <input className="col-sm-6 form-control" type="number" min="1" max={pageTotal} style={{ width: "60%" }} ref={input => this.newCurrentPage = input} />
                                            <button className="col-sm-4 btn btn-success" style={{ width: "35%", marginLeft: "5%" }} onClick={() => this.handleSearchPage()}>Tìm kiếm</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
              
        );
    }
}

function mapState(state) {
    const { tasktemplates, department } = state;
    return { tasktemplates, department };
}

const actionCreators = {
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    getDepartment: DepartmentActions.getDepartmentOfUser,
    _delete: taskTemplateActions._delete
};
const connectedTaskTemplate = connect(mapState, actionCreators)(TaskTemplate);
export { connectedTaskTemplate as TaskTemplate };