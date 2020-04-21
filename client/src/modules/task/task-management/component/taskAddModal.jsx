import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
// import { DepartmentActions, UserActions, managerKpiActions } from '../../../../redux-actions/CombineActions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { taskTemplateActions } from '../../../task/task-template/redux/actions';
// import { taskTemplateActions } from '../../../../redux-actions/CombineActions';//đợi nhóm Khoa--------------------------------------
import { taskManagementActions } from '../redux/actions';


// const token = getStorage();
// const verified = await jwt.verify(token, TOKEN_SECRET);
// var id = verified._id;

class ModalAddTask extends Component {

    componentDidMount() {
        // get id current role
        // this.props.getTaskTemplateByUser("1", "[]");
        this.props.getTaskTemplateByUser( "1", "0", "[]");//fix--localStorage.getItem('id'),---------------------------------------------------
        // Lấy tất cả nhân viên trong công ty
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        // load js for form
        this.handleLoadjs();
    }

    // Load js for form
    handleLoadjs = () => {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';//fix---------------------------------------------------------------
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    constructor(props) {
        super(props);
        this.state = {
            newTask: {
                responsible: [],
                accounatable: [],
                consulted: [],
                informed: [],
                creator: "",//fix-----------localStorage.getItem('id')----------------bên service của addTask() line 114---------------------------------------
                tasktemplate: null,
                role: localStorage.getItem('currentRole'),
                parent: null,
                kpi: []
            },
            submitted: false,
            currentRole: localStorage.getItem('currentRole'),
            currentTemplate: "",
            checkStartDate: "",
            checkEndDate: ""
        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    // update state before submit because setState async
    updateState = async () => {
        // get data in multi select
        let selectResponsible = this.refs.responsible;
        let responsible = [].filter.call(selectResponsible.options, o => o.selected).map(o => o.value);
        let selectAccounatable = this.refs.accounatable;
        let accounatable = [].filter.call(selectAccounatable.options, o => o.selected).map(o => o.value);
        let selectConsulted = this.refs.consulted;
        let consulted = [].filter.call(selectConsulted.options, o => o.selected).map(o => o.value);
        let selectInformed = this.refs.informed;
        let informed = [].filter.call(selectInformed.options, o => o.selected).map(o => o.value);
        let selectKPI = this.refs.kpi;
        let kpi = [].filter.call(selectKPI.options, o => o.selected).map(o => o.value);
        const token = getStorage();
        const verified = await jwt.verify(token, TOKEN_SECRET);
        var idUser = verified._id;
        
        await this.setState(state => {
            
            return {
                ...state,
                newTask: {
                    ...state.newTask,
                    creator: idUser,
                    name: this.name.value,
                    description: this.description.value,
                    startdate: this.startdate.value,
                    enddate: this.enddate.value,
                    priority: this.priority.value,
                    unit: this.unit.value,
                    tasktemplate: this.tasktemplate.value !== "" ? this.tasktemplate.value : null,
                    role: localStorage.getItem("currentRole"),
                    parent: this.parent.value !== "" ? this.parent.value : null,
                    kpi: kpi,
                    responsible: responsible,
                    accounatable: accounatable,
                    consulted: consulted,
                    informed: informed,
                },
                submitted: true
            }
        });
    }

    // submit new task in data
    handleOnSubmit = async (event) => {
        event.preventDefault();
        await this.updateState();
        const { newTask } = this.state;
        var starttime = this.startdate.value.split("-");
        var startdate = new Date(starttime[2], starttime[1] - 1, starttime[0]);
        var endtime = this.enddate.value.split("-");
        var enddate = new Date(endtime[2], endtime[1] - 1, endtime[0]);
        console.log(newTask);
        if (newTask.name && newTask.description && newTask.startdate && newTask.enddate && newTask.priority) {
            if (Date.parse(startdate) < Date.now()) {
                await this.setState(state => {
                    return {
                        ...state,
                        checkStartDate: "Thời gian bắt đầu không thỏa mãn!"
                    }
                });
            } else if (Date.parse(startdate) > Date.parse(enddate)) {
                await this.setState(state => {
                    return {
                        ...state,
                        checkEndDate: "Thời gian kết thúc không thỏa mãn!"
                    }
                });
            } else {
                this.props.addTask(newTask);//fix loi creater - sửa bên service ----------------------------------------------------------------
                await this.setState(state => {
                    return {
                        ...state,
                        submitted: false
                    }
                });
                window.$(`#addNewTask${this.props.id}`).modal("hide");
                var element = document.getElementsByTagName("BODY")[0];
                element.classList.remove("modal-open");
                var modal = document.getElementById(`addNewTask${this.props.id}`);
                modal.classList.remove("in");
                modal.style = "display: none;";
            }
        }

    }
    checkDefaultUser = async (roleTask, listUser) => {
        const token = getStorage();
        const verified = await jwt.verify(token, TOKEN_SECRET);
        var idUser = verified._id;
        var role = this.props.role;
        var currentUser = idUser;//fix----------------------localStorage.getItem("id")-----------------------------
        if (roleTask === role) {
            return [...listUser, currentUser];
        }
        return listUser;
    }
    handleChangeUnit = (event) => {
        event.preventDefault();
        if (event.target.value) {
            this.props.getAllUserOfDepartment(event.target.value);
        }
        this.handleLoadjs();
    }
    handleChangeTaskTemplate = async (event) => {
        var tasktemplate = event.target.value;
        await this.setState(state => {
            return {
                ...state,
                currentTemplate: tasktemplate
            }
        })
        this.handleLoadjs();
        this.handleGetTarget();
    }
    handleGetTarget = () => {
        let selectResponsible = this.refs.responsible;
        let responsible = [].filter.call(selectResponsible.options, o => o.selected).map(o => o.value);
        if (responsible !== []) {
            // this.props.getAllKPIPersonalByMember(responsible);
            this.props.getAllKPIPersonalByUserID(responsible);
            console.log('this response: ', responsible);
        }
    }
    render() {
        var units, currentUnit, userdepartments, listTaskTemplate, currentTemplate, listKPIPersonal;
        const { newTask, submitted } = this.state;
        const { department, tasktemplates, user, KPIPersonalManager } = this.props; //kpipersonals
        if (tasktemplates.items) {
            listTaskTemplate = tasktemplates.items;
            currentTemplate = listTaskTemplate.filter(item => item.resourceId._id === this.state.currentTemplate);
        }
        if (department.unitofuser) {
            units = department.unitofuser;
            currentUnit = units.filter(item =>
                item.dean === this.state.currentRole
                || item.vice_dean === this.state.currentRole
                || item.employee === this.state.currentRole);
        }
        if (user.userdepartments) userdepartments = user.userdepartments;
        // if (kpipersonals.kpipersonals) listKPIPersonal = kpipersonals.kpipersonals;
        if (KPIPersonalManager.kpipersonals) listKPIPersonal = KPIPersonalManager.kpipersonals;
        return (
            <div className="modal modal-full fade" id={`addNewTask${this.props.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h3 className="modal-title" id="myModalLabel"><b>Thêm công việc mới</b></h3>
                        </div>
                        <div className="modal-body" >
                            <form className="form-horizontal">
                                <div className="col-sm-12">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">Thông tin công việc</legend>
                                        <div className={'form-group has-feedback' + (submitted && !newTask.name ? ' has-error' : '')}>
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Tên công việc*</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <input type="Name" className="form-control" placeholder="Tên công việc" ref={input => this.name = input} />
                                            </div>
                                            {submitted && !newTask.name &&
                                                <div className="col-sm-4 help-block">Hãy điền tên công việc</div>
                                            }
                                        </div>
                                        <div className={'form-group has-feedback' + (submitted && !newTask.description ? ' has-error' : '')}>
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Mô tả công việc</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <textarea type="Description" className="form-control" name="Mô tả công việc" placeholder="Mô tả công việc" ref={input => this.description = input} />
                                            </div>
                                            {submitted && !newTask.description &&
                                                <div className="col-sm-4 help-block">Hãy điền mô tả công việc</div>
                                            }
                                        </div>
                                        <div className={'form-group has-feedback' + (submitted && (!newTask.startdate || !newTask.enddate || this.state.checkEndDate !== "" || this.state.checkStartDate !== "") ? ' has-error' : '')}>
                                            <div className="col-sm-6">
                                                <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left', marginLeft: "-14px" }}>Ngày bắt đầu*:</label>
                                                <div className={'input-group date has-feedback col-sm-10'} style={{ width: '100%' }}>
                                                    <div className="input-group-addon">
                                                        <i className="fa fa-calendar" />
                                                    </div>
                                                    <input type="text" className="form-control" autoComplete="off" ref={input => this.startdate = input} name="time" id="datepicker1" data-date-format="dd-mm-yyyy" />
                                                </div>
                                                {submitted && !newTask.startdate &&
                                                    <div className="col-sm-4 help-block">Hãy chọn thời gian bắt đầu</div>
                                                }
                                                {submitted && this.state.checkStartDate !== "" &&
                                                    <div className="col-sm-4 help-block">{this.state.checkStartDate}</div>
                                                }
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left', marginLeft: "-14px" }}>Ngày kết thúc*:</label>
                                                <div className={'input-group date has-feedback col-sm-10'} style={{ width: '100%' }}>
                                                    <div className="input-group-addon">
                                                        <i className="fa fa-calendar" />
                                                    </div>
                                                    <input type="text" className="form-control" autoComplete="off" ref={input => this.enddate = input} name="time" id="datepicker3" data-date-format="dd-mm-yyyy" />
                                                </div>
                                                {submitted && !newTask.enddate &&
                                                    <div className="col-sm-4 help-block">Hãy chọn thời gian kết thúc</div>
                                                }
                                                {submitted && this.state.checkEndDate !== "" &&
                                                    <div className="col-sm-4 help-block">{this.state.checkEndDate}</div>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group  has-feedback">
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Mức độ ưu tiên</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <select defaultValue="Cao" className="form-control" style={{ width: '100%' }} ref={input => this.priority = input}>
                                                    <option value="Cao">Cao</option>
                                                    <option value="Trung bình">Trung bình</option>
                                                    <option value="Thấp">Thấp</option>
                                                </select>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div className="col-sm-6">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">Phân định trách nhiệm (RACI)</legend>
                                        <div className={'form-group has-feedback' + (submitted && newTask.responsible.length === 0 ? ' has-error' : '')}>
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Người thực hiện*</label>
                                            <div className="col-sm-8" style={{ width: '100%' }}>
                                                <select multiline="true" defaultValue={(currentTemplate && currentTemplate.length !== 0) ? currentTemplate[0].resourceId.responsible : this.state.newTask.responsible} className="form-control select2" multiple="multiple" ref="responsible" data-placeholder="Chọn người thực hiện" style={{ width: '100%' }}>
                                                    {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                            </optgroup>)
                                                    }
                                                    {/* 
                                                    {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                {item.userId.map(x => {
                                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                                })}
                                                            </optgroup>)
                                                    }
                                                    */}
                                                </select>
                                            </div>
                                            {submitted && newTask.responsible.length === 0 &&
                                                <div className="col-sm-4 help-block">Hãy chọn người thực hiện</div>
                                            }
                                        </div>
                                        <div className={'form-group has-feedback' + (submitted && newTask.accounatable.length === 0 ? ' has-error' : '')}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người phê duyệt*</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <select defaultValue={(currentTemplate && currentTemplate.length !== 0) ? currentTemplate[0].resourceId.accounatable : this.state.newTask.accounatable} className="form-control select2" multiple="multiple" ref="accounatable" data-placeholder="Chọn người thực hiện" style={{ width: '100%' }}>
                                                    {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                            </optgroup>)
                                                    }
                                                    {/* {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                {item.userId.map(x => {
                                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                                })}
                                                            </optgroup>)
                                                    } */}
                                                </select>
                                            </div>
                                            {submitted && newTask.accounatable.length === 0 &&
                                                <div className="col-sm-4 help-block">Hãy chọn người phê duyệt</div>
                                            }
                                        </div>
                                        <div className='form-group has-feedback'>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người hỗ trợ</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <select defaultValue={(currentTemplate && currentTemplate.length !== 0) ? currentTemplate[0].resourceId.consulted : this.state.newTask.consulted} className="form-control select2" multiple="multiple" ref="consulted" data-placeholder="Chọn người thực hiện" style={{ width: '100%' }}>
                                                    {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                            </optgroup>)
                                                    }
                                                    {/* {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                {item.userId.map(x => {
                                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                                })}
                                                            </optgroup>)
                                                    } */}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='form-group has-feedback'>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người quan sát</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <select defaultValue={(currentTemplate && currentTemplate.length !== 0) ? currentTemplate[0].resourceId.informed : this.state.newTask.informed} className="form-control select2" multiple="multiple" ref="informed" data-placeholder="Chọn người thực hiện" style={{ width: '100%' }}>
                                                    {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                <option key={item.userId._id} value={item.userId._id}>{item.userId.name}</option>
                                                            </optgroup>)
                                                    }
                                                    {/* {userdepartments &&
                                                        userdepartments.map(item =>
                                                            <optgroup label={item.roleId.name} key={item.roleId._id}>
                                                                {item.userId.map(x => {
                                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                                })}
                                                            </optgroup>)
                                                    } */}
                                                </select>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                
                                <div className="col-sm-6">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">Liên kết công việc (Object and Key Results)</legend>
                                        <div className={'form-group has-feedback' + (submitted && !newTask.unit ? ' has-error' : '')}>
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Đơn vị*</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                {units &&
                                                    <select defaultValue={currentUnit[0]._id} className="form-control" style={{ width: '100%' }} onChange={this.handleChangeUnit} ref={input => this.unit = input}>
                                                        {units.map(x => {
                                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                                        })}
                                                    </select>}
                                            </div>
                                            {submitted && !newTask.unit &&
                                                <div className="col-sm-4 help-block">Hãy chọn đơn vị</div>
                                            }
                                        </div>
                                        <div className="form-group  has-feedback">
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Mẫu công việc</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                {
                                                    (typeof listTaskTemplate !== "undefined" && listTaskTemplate.length !== 0) ?
                                                        <select className="form-control" style={{ width: '100%' }} onChange={this.handleChangeTaskTemplate} ref={input => this.tasktemplate = input}>
                                                            <option value="">--Hãy chọn mẫu công việc--</option>
                                                            {
                                                                listTaskTemplate.map(item => {
                                                                    return <option key={item.resourceId._id} value={item.resourceId._id}>{item.resourceId.name}</option>
                                                                })
                                                            }
                                                        </select> : null
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group  has-feedback">
                                            <label className="col-sm-4 control-label" style={{ width: '100%', textAlign: 'left' }}>Công việc cha</label>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <select className="form-control select2" style={{ width: '100%' }} ref={input => this.parent = input} defaultValue={this.props.id !== "" ? this.props.id : null}>
                                                    <option value="">--Hãy chọn công việc cha--</option>
                                                    {this.props.currentTasks &&
                                                        this.props.currentTasks.map(item => {
                                                            return <option key={item._id} value={item._id}>{item.name}</option>
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className={'form-group has-feedback' + (submitted && newTask.kpi.length === 0 ? ' has-error' : '')}>
                                            <label className="col-sm-5 control-label" style={{ width: '20%', textAlign: 'left', marginTop: "-7px" }}>KPI mục tiêu*</label>
                                            <a style={{ color: "navy" }} href="#abc" onClick={() => this.handleGetTarget()} title="Lấy tất cả mục tiêu KPI cá nhân của người thực hiện" ><i style={{ fontSize: "19px" }} className="material-icons">refresh</i></a>
                                            <div className="col-sm-10" style={{ width: '100%' }}>
                                                <select className="form-control select2" multiple="multiple" ref="kpi" data-placeholder="Select a State" style={{ width: '100%' }} >
                                                    {listKPIPersonal &&
                                                        listKPIPersonal.map(item => {
                                                            return <optgroup label={item.creater.name} key={item._id}>
                                                                {item.listtarget.map(x => {
                                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                                })}
                                                            </optgroup>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            {submitted && newTask.kpi.length === 0 &&
                                                <div className="col-sm-4 help-block">Hãy chọn kpi mục tiêu</div>
                                            }
                                        </div>
                                    </fieldset>
                                </div>
                                
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.handleOnSubmit} className="btn btn-success">Lưu</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal" onClick={this.handleCancel}>Xóa trắng</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

function mapState(state) {
    const { department, tasktemplates, tasks, user, KPIPersonalManager } = state;//fix--------------kpipersonals-->KPIPersonalManager-------department(s)----------
    return { department, tasktemplates, tasks, user, KPIPersonalManager };
}

const actionCreators = {
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    addTask: taskManagementActions.addTask,
    getDepartment: DepartmentActions.getDepartmentOfUser,//có r
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,//có r
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,//chưa có
    // getAllKPIPersonalByMember: managerKpiActions.getAllKPIPersonalByMember//KPIPersonalManager----managerKpiActions //bị khác với hàm dùng trong kpioverview-có tham số
    getAllKPIPersonalByUserID: managerKpiActions.getAllKPIPersonalByUserID//KPIPersonalManager----managerKpiActions //bị khác với hàm dùng trong kpioverview-có tham số
};

const connectedModalAddTask = connect(mapState, actionCreators)(ModalAddTask);
export { connectedModalAddTask as ModalAddTask };