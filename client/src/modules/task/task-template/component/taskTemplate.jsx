import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalAddTaskTemplate } from './addTaskTemplateModal';
import { UserActions } from '../../../super-admin/user/redux/actions';
// sửa đường dẫn sau khi vào project mới
import {taskTemplateActions} from '../redux/actions'
import { ModalViewTaskTemplate } from './viewTaskTemplateModal';
import { ModalEditTaskTemplate } from './editTaskTemplateModal';
import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

class TaskTemplate extends Component {
    componentDidMount() {
        this.props.getDepartment();
        //edit later
        this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, "[]", "");
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

    setLimit = async (limit) => {
        // Cập nhật số dòng trang trên một trang hiển thị
        if (Number(limit) !== this.state.perPage) {
            await this.setState(state => {
                return {
                    ...state,
                    perPage: Number(limit),
                    currentPage: 1
                }
            })
            this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, "[]", this.name.value);
        }
    }
    // handleAction = (id) => {
    //     // Đóng cửa sổ cài đặt
    //     var element = document.getElementById(`action${id}`);
    //     element.classList.remove("in");
    //     element.setAttribute("aria-expanded", "false");
    // }

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
        if (oldCurrentPage !== index) this.props.getTaskTemplateByUser(index, this.state.perPage, test, this.name.value);
    }

    handleUpdateData = () => {
        var test = window.$("#multiSelectUnit").val();
        this.props.getTaskTemplateByUser( 1, this.state.perPage, test, this.name.value);
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
        window.$('#modal-view-tasktemplate').modal('show');
    }
    handleShowEdit = async (template) => {
        await this.setState(state => {
            return {
                ...state,
                showEdit: template._id,
                currentRow : template,
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`editTaskTemplate${template._id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }



    //Xoa tasktemplate theo id
    handleDelete = (id, numberOfUse) => {
        const { translate } = this.props;
        if (numberOfUse == 0) {
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
                    this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, test, "");
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
    
    checkHasComponent = (name) => {
        var { auth } = this.props;
        var result = false;
        auth.components.forEach(component => {
            if(component.name === name) result=true;
        });
        return result;
    }
    setPage = async (pageTotal) => {
        var test = window.$("#multiSelectUnit").val();
        var oldCurrentPage = this.state.currentPage;
        await this.setState(state => {
            return {
                ...state,
                currentPage : pageTotal
            }
        })
        var newCurrentPage = this.state.currentPage;
        if (oldCurrentPage !== newCurrentPage) this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, test, this.name.value);
    }
    render() {
        const { translate } = this.props;
        var list, pageTotal, units = [], currentUnit;
        const { tasktemplates, user } = this.props;
        const { currentPage } = this.state;
        if (tasktemplates.pageTotal) pageTotal = tasktemplates.pageTotal;
        if (user.organizationalUnitsOfUser) {
            units = user.organizationalUnitsOfUser;
            currentUnit = units.filter(item =>
                item.dean === localStorage.getItem("currentRole")
                || item.viceDean === localStorage.getItem("currentRole")
                || item.employee === localStorage.getItem("currentRole"));
        }
        
        if (tasktemplates.items) {
            list = tasktemplates.items;
        }
        
        return ( 
            <div className="box">
                {/* /.box-header */}
                <div className="box-body qlcv" id="table-task-template">

                    <div className = "form-group">
                        {this.checkHasComponent('create-task-template-button') &&
                        <button type="button" className="btn btn-success pull-right" data-toggle="modal" title="Thêm mới một mẫu công việc" data-target="#addTaskTemplate" data-backdrop="static" data-keyboard="false">{translate('task_template.add')}</button>}
                        <ModalAddTaskTemplate />
                    </div>
                    
                    <div className="form-inline">
                        <div className = "form-group">
                            <label className = "form-control-static">{translate('task_template.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('task_template.search_by_name')} ref={input => this.name = input}/>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label className = "form-control-static">{translate('task_template.unit')}</label>
                            {units &&
                                <SelectMulti id="multiSelectUnit"
                                    defaultValue = {units.map(item => {return item._id})}
                                    items = {units.map(item => {return {value: item._id, text: item.name}})} 
                                    options = {{nonSelectedText: translate('task_template.select_all_units'), allSelectedText: "Tất cả các đơn vị"}}>
                                </SelectMulti>
                            }
                            <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={this.handleUpdateData}>{translate('task_template.search')}</button>
                        </div>
                    </div>
                    <DataTableSetting 
                        tableId="table-task-template"
                        columnArr={[
                            'Tên mẫu công việc',
                            'Mô tả',
                            'Số lần sử dụng',
                            'Người tạo mẫu',
                            'Đơn vị'
                        ]}
                        limit = {this.state.perPage}
                        setLimit = {this.setLimit}
                        hideColumnOption = {true}
                    />
                    
                    <table className="table table-bordered table-striped table-hover" id="table-task-template">
                        <thead>
                            <tr>
                                <th title="Tên mẫu công việc">{translate('task_template.tasktemplate_name')}</th>
                                <th title="Mô tả">{translate('task_template.description')}</th>
                                <th title="Số lần sử dụng">{translate('task_template.count')}</th>
                                <th title="Người tạo mẫu">{translate('task_template.creator')}</th>
                                <th title="Đơn vị">{translate('task_template.unit')}</th>

                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="task-table">
                            {
                                (typeof list !== 'undefined' && list.length !== 0) ?
                                    list.map(item =>
                                        item.resourceId && <tr key={item.resourceId._id}>
                                            <td title={item.resourceId.name}>{item.resourceId.name}</td>
                                            <td title={item.resourceId.description}>{item.resourceId.description}</td>
                                            <td title={item.resourceId.numberOfUse}>{item.resourceId.numberOfUse}</td>
                                            <td title={item.resourceId.creator.name}>{item.resourceId.creator.name}</td>
                                            <td title={item.resourceId.organizationalUnit.name}>{item.resourceId.organizationalUnit.name}</td>
                                            <td>
                                                <a href="#abc" onClick={()=>this.handleShowView(item.resourceId._id)} data-toggle="modal" title="Xem chi tiết mẫu công việc này">
                                                    <i className="material-icons" style={!this.checkPermisson(currentUnit && currentUnit[0].dean) ? { paddingLeft: "35px" } : { paddingLeft: "0px" }}>view_list</i>
                                                </a>
                                                {this.state.showView===item.resourceId._id&&<ModalViewTaskTemplate id={item.resourceId._id} />}
                                                {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                                    <React.Fragment>
                                                        <a onClick={()=>this.handleShowEdit(item.resourceId)} data-toggle="modal" className="edit" title="Sửa mẫu công việc này"><i className="material-icons"></i></a>
                                                        <a onClick={()=>this.handleDelete(item.resourceId._id, item.resourceId.numberOfUse)} className="delete" title="Xóa mẫu công việc này"><i className="material-icons"></i></a>
                                                    </React.Fragment>}
                                                    {this.state.showEdit===item.resourceId._id&&this.state.currentRow&&<ModalEditTaskTemplate id={item.resourceId._id} 
                                                                                                                                taskTemplate = {this.state.currentRow}/>}
                                            </td>
                                        </tr>
                                    ) : <tr><td colSpan={6}><center>Không có dữ liệu</center></td></tr>
                            }
                        </tbody>
                    </table>
                    <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={this.setPage}/>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { tasktemplates, user, auth } = state;
    return { tasktemplates, user, auth };
}

const actionCreators = {
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    getDepartment: UserActions.getDepartmentOfUser,
    _delete: taskTemplateActions._delete
};
const connectedTaskTemplate = connect(mapState, actionCreators)( withTranslate(TaskTemplate));
export { connectedTaskTemplate as TaskTemplate };