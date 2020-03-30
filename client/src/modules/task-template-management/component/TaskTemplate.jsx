import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalAddTaskTemplate } from './ModalAddTaskTemplate';
import { DepartmentActions } from '../../super-admin-management/departments-management/redux/actions';
// sửa đường dẫn sau khi vào project mới
import {taskTemplateActions} from '../redux/actions'
import { ModalViewTaskTemplate } from './ModalViewTaskTemplate';
import { ModalEditTaskTemplate } from './ModalEditTaskTemplate';

import { SelectMulti } from '../../../common-components/src/SelectMulti/SelectMulti.jsx';

import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

class TaskTemplate extends Component {
    componentDidMount() {
        this.props.getDepartment();
        //edit later
        this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, "[]");
        this.loadJSMultiSelect();
    }
    constructor(props) {
        super(props);
        this.state = {
            status: 'start',
            currentPage: 1,
            perPage: 5,
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
        if (Number(this.perPage.value) !== this.state.perPage) {
            await this.setState(state => {
                return {
                    ...state,
                    perPage: Number(this.perPage.value),
                    currentPage: 1
                }
            })
            this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, "[]");
        }
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
        if (oldCurrentPage !== index) this.props.getTaskTemplateByUser(index, this.state.perPage, test);
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
        
        if (oldCurrentPage !== newCurrentPage) this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, test);
    }

    // Quay lai trang truoc
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
        if (oldCurrentPage !== newCurrentPage) this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, test);
    }

    handleUpdateData = () => {
        var test = window.$("#multiSelectUnit").val();
        console.log(test);
        this.props.getTaskTemplateByUser(1, this.state.perPage, test);
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
        const { translate } = this.props;
        if (count == 0) {
            Swal.fire({
                title: translate('task_template.confirm_title'),
                type: 'success',
                showCancelButton: true,
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('task_template.confirm')
            }).then((res) => {
                if (res.value){
                    this.props._delete(id);

                    var test = window.$("#multiSelectUnit").val();
                    this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, test);
                }
            });
        } else { 
            Swal.fire({
                title: translate('task_template.error_title'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('task_template.confirm')
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
        const { translate } = this.props;
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
        
        if (tasktemplates.items) {
            list = tasktemplates.items;
        }
        var items = [];
        
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
            <div className="box" id="qlcv">
                {/* /.box-header */}
                <div className="box-body">

                    <div className = "form-group">
                        {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                        <button type="button" className="btn btn-success pull-right" data-toggle="modal" title="Thêm mới một mẫu công việc" data-target="#addTaskTemplate" data-backdrop="static" data-keyboard="false">{translate('task_template.add')}</button>}
                        <ModalAddTaskTemplate />
                    </div>
                    
                    <div className="form-inline">
                        <div className = "form-group">
                            <label className = "form-control-static">{translate('task_template.name')}:</label>
                            <input className="form-control" type="text" placeholder="Tìm kiếm theo tên" />
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label className = "form-control-static">{translate('task_template.unit')}:</label>
                            {units && <SelectMulti id="multiSelectUnit" items={units} 
                            nonSelectedText = "Chọn đơn vị" allSelectedText= "Tất cả đơn vị"></SelectMulti>}
                            <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={this.handleUpdateData}>{translate('task_template.search')}</button>
                        </div>
                    </div>

                    <table className="table table-bordered table-striped table-hover" id="myTable">
                        <thead>
                            <tr>
                                <th title="Tên mẫu công việc">{translate('task_template.tasktemplate_name')}</th>
                                <th title="Mô tả">{translate('task_template.description')}</th>
                                <th title="Số lần sử dụng">{translate('task_template.count')}</th>
                                <th title="Người tạo mẫu">{translate('task_template.creator')}</th>
                                <th title="Đơn vị">{translate('task_template.unit')}</th>

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
                                            <input className="form-control" type="text" defaultValue={this.state.perPage} ref={input => this.perPage = input} />
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

                    <div className="row pagination-new">
                        <ul className="pagination" style={{ margin: "auto" }}>
                            <li><a onClick={() => this.backPage()}>«</a></li>
                            {items}
                            <li><a onClick={() => this.nextPage(pageTotal)}>»</a></li>
                        </ul>
                        <div id="search-page" className="col-sm-12 collapse" style={{ width: "26%" }}>
                            <input className="col-sm-6 form-control" type="number" min="1" max={pageTotal} style={{ width: "60%" }} ref={input => this.newCurrentPage = input} />
                            <button className="col-sm-4 btn btn-success" style={{ width: "35%", marginLeft: "5%" }} onClick={() => this.handleSearchPage()}>{translate('task_template.search')}</button>
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
const connectedTaskTemplate = connect(mapState, actionCreators)( withTranslate(TaskTemplate));
export { connectedTaskTemplate as TaskTemplate };