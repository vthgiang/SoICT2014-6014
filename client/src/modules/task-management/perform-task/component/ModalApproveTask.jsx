import React, { Component } from 'react';
import {connect} from 'react-redux';
// import { withTranslate } from 'react-redux-multilingual';
import { performTaskAction } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';
import { taskManagementActions } from '../../task-management/redux/actions';

class ModalApproveTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            systempoint : 90,
            mypoint1 : 90,
            mypoint2 : 90,
            mypoint3 : 90,
            approvepoint1 : 90,
            approvepoint2 : 90,
            approvepoint3 : 90
        }
        this.save = this.save.bind(this);
    }    
    // componentWillMount(){
    //     console.log('-------WILL mount-------',this.props.taskID);
    //     this.props.getTaskById(this.props.taskID);
    // }
    // componentDidMount (){
    //     console.log('------cpn DID mount------',this.props.taskID);
    // }
    UNSAFE_componentWillMount() {
        console.log('------willmouseUNSAFE------',this.props.taskID);
        this.props.getTaskById(this.props.taskID);
    }

    handleChangeMyPoint = () => {
        var percent = parseInt(this.percent.value);
        this.systempoint.value = percent;

    }

    addResult = (taskID) => { // tạo mới result task rồi thêm vào db, cập nhật lại result trong task
        // result = this.refs;
        var { currentUser, role, performtasks} = this.props;
        //1-responsible, 2-accountable, 3-consulted
        if(role === "responsible"){
            return this.props.createResult({
                result :{
                    member: currentUser,
                    systempoint: this.systempoint.value,
                    mypoint: this.mypoint1.value,
                    approverpoint: this.approvepoint1.value,
                    roleMember: "responsible"
                },
                task: taskID
            });     
        } else if(role === "consulted"){
            return this.props.createResult({
                result :{
                    member: currentUser,
                    systempoint: this.systempoint.value,
                    mypoint: this.mypoint2.value,
                    approverpoint: this.approvepoint2.value,
                    roleMember: "consulted"
                },
                task: taskID
            });     
        } else if(role === "accountable"){
            var mypoint = this.mypoint3.value;
            return this.props.createResult({
                result :{
                    member: currentUser,
                    systempoint: this.systempoint.value,
                    mypoint: mypoint,
                    approverpoint: mypoint,
                    roleMember: "accountable"
                },
                task: taskID
            });     
        }
    }

    confirmResult = (taskID) => {
        var { tasks, performtasks } = this.props;
        var task;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        var listResult = [
            {
                systempoint: this.systempoint.value,
                mypoint: this.mypoint1.value,
                approverpoint: this.approvepoint1.value,
                _id: task && task.results[0]._id,
                member: task && task.responsible[0]._id,
                roleMember: "responsible"
            },
            {
                systempoint: this.systempoint.value,
                mypoint: this.mypoint2.value,
                approverpoint: this.approvepoint2.value,
                _id: task && task.results[1]._id,
                member: task && task.consulted[0]._id,
                roleMember: "consulted"
            }
        ]; // currentTask.results;
        return this.props.editResultTask(listResult, taskID);
    }

    onHandleChange = async (e) => {
        // console.log(e.target.value);
        var name = e.target.name;
        var value = parseInt(e.target.value);
        await this.setState ({
            [name] : value
        })
        console.log(this.state);
    }

    save = () => {
        var { tasks, currentUser , role, performtasks} = this.props;
        if(role === "responsible" ){
            var status = {status: "Chờ phê duyệt"};
            this.addResult(this.props.taskID);
            return this.props.editStatusOfTask(this.props.taskID, status);
        } 
        else if(role === "consulted"){
            return this.addResult(this.props.taskID);
        } 
        else if(role === "accountable"){
            var status = {status: "Đã hoàn thành"};
            this.addResult(this.props.taskID);
            this.confirmResult(this.props.taskID);
            return this.props.editStatusOfTask(this.props.taskID, status);
        }
    }

    render() { 
        var task; 
        var respPoint, consultPoint, accoutPoint;
        const { currentUser , role, resultTask} = this.props;
        const { tasks, performtasks } = this.props;
        var { systempoint, mypoint1, mypoint2, mypoint3, approvepoint1, approvepoint2 } = this.state;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        // const {taskID} = this.props;
        // var { task } = this.props;
        // console.log("--task--", task);
        // console.log("--taskID--", taskID);
        
        if(task && task.results) {
            var listResult = task.results;
            // console.log('------listResult------', listResult);
            listResult.map( (item) => {
                // console.log('--task--item--', task, item);
                if(task.responsible[0]._id === item.member && item.roleMember === "responsible" ) respPoint = item;
                if(task.consulted[0]._id === item.member && item.roleMember === "consulted" ) consultPoint = item;
                if(task.accounatable[0]._id === item.member && item.roleMember === "accountable" ) accoutPoint = item;
            })
        }
        const systempoint_def = (respPoint)?respPoint.systempoint:0;
        const defaultPoint = {
            systempoint : (respPoint)?respPoint.systempoint:0,
            responsible : {
                mypoint : (respPoint)?respPoint.mypoint:0,
                approverpoint : (respPoint)?respPoint.approverpoint:0
            },
            consulted : {
                mypoint : (consultPoint)?consultPoint.mypoint:0,
                approverpoint : (consultPoint)?consultPoint.approverpoint:0
            },
            accountable : {
                mypoint : (accoutPoint)?(accoutPoint.mypoint):systempoint_def
            } 
        }
        // console.log("---------default--------", defaultPoint);
        return ( 
            <React.Fragment>
                {/* <ModalButton modalID="modal-approve-task" button_name="Yêu cầu phê duyệt" title="Yêu cầu phê duyệt"/> */}
                <ModalDialog
                    size="50"
                    modalID = {`modal-approve-task-${this.props.taskID}`}
                    formID="form-approve-task"
                    title="Yêu cầu phê duyệt công việc"
                    msg_success="Yêu cầu phê duyệt thành công"
                    msg_faile="Yêu cầu phê duyệt không thành công"
                    func={this.save}
                >
                    {/* <div className="form-inline" > */}
                        <form id="form-approve-task" >
                            
                                
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin công việc*:</legend>
                                <div className="form-group ">
                                    <label className = "form-control-static" htmlfor="percent">Công việc hoàn thành(%):</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="percent" 
                                        placeholder={10} 
                                        ref={input => this.percent = input} 
                                        onChange={()=>this.handleChangeMyPoint()} 
                                        disabled={ role !== "responsible" }
                                    />
                                </div>
                                <div className="form-group ">
                                    <label className = "form-control-static" htmlfor="systempoint">Điểm hệ thống:</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="systempoint" 
                                        placeholder={10} 
                                        ref={input => this.systempoint = input} 
                                        defaultValue={task && defaultPoint.systempoint} 
                                        disabled="true" 
                                        // name="systempoint" 
                                        // value={ systempoint } 
                                        // onChange={this.onHandleChange}
                                    />
                                </div>
                            </fieldset>

                            {(role === "responsible" || role === "accountable" ) &&
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Vai trò người thực hiện:</legend>
                                    <div className="form-group ">
                                        <label className = "form-control-static" htmlfor="mypoint1">Điểm tự đánh giá:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="mypoint1" 
                                            placeholder={80} 
                                            ref={input => this.mypoint1 = input} 
                                            defaultValue={task && defaultPoint.responsible.mypoint} 
                                            disabled={ role !== "responsible" }
                                            // name="mypoint1" 
                                            // value={ mypoint1 } 
                                            // onChange={this.onHandleChange}
                                        />
                                    </div>
                                    <div className="form-group ">
                                        <label className = "form-control-static" htmlfor="approvepoint1">Điểm quản lý đánh giá:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="approvepoint1" 
                                            placeholder={80} 
                                            ref={input => this.approvepoint1 = input} 
                                            defaultValue={task && defaultPoint.responsible.approverpoint} 
                                            disabled={ role !== "accountable" } 
                                            // name="approvepoint1" 
                                            // value={ approvepoint1 } 
                                            // onChange={this.onHandleChange}
                                        />
                                    </div>
                                </fieldset>
                            }
                            
                            {(role === "consulted" || role === "accountable" ) &&
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Vai trò người hỗ trợ:</legend>
                                    <div className="form-group ">
                                        <label className = "form-control-static" htmlfor="mypoint2">Điểm tự đánh giá:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="mypoint2" 
                                            placeholder={10} 
                                            ref={input => this.mypoint2 = input} 
                                            defaultValue={task && defaultPoint.consulted.mypoint} 
                                            disabled={ role !== "consulted" } 
                                            // name="mypoint2" 
                                            // value={ mypoint2 } 
                                            // onChange={this.onHandleChange}
                                        />
                                    </div>
                                    <div className="form-group ">
                                        <label className = "form-control-static" htmlfor="approvepoint2">Điểm quản lý đánh giá:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="approvepoint2" 
                                            placeholder={10} 
                                            ref={input => this.approvepoint2 = input} 
                                            defaultValue={task && defaultPoint.consulted.approverpoint} 
                                            disabled={ role !== "accountable" } 
                                            // name="approvepoint2" 
                                            // value={ approvepoint2 } 
                                            // onChange={this.onHandleChange}
                                        />
                                    </div>
                                </fieldset>
                            }
                            {(role === "accountable") &&
                                <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Vai trò người phê duyệt:</legend>
                                <div className="form-group ">
                                    <label className = "form-control-static" htmlfor="mypoint3">Điểm tự đánh giá:</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="mypoint3" 
                                        placeholder={10} 
                                        ref={input => this.mypoint3 = input} 
                                        defaultValue={task && defaultPoint.accountable.mypoint} 
                                        disabled={ role !== "accountable" } 
                                        // name="mypoint3" 
                                        // value={ mypoint3 } 
                                        // onChange={this.onHandleChange}
                                    />
                                </div>
                                {/* <div className="form-group ">
                                    <label className = "form-control-static" htmlfor="approvepoint3">Điểm quản lý đánh giá:</label>
                                    <input type="number" className="form-control" id="approvepoint3" placeholder={80} ref={input => this.approvepoint3 = input} disabled={ role !== "accountable" }  />
                        </div> */}
                            </fieldset>
                            } 
                            

                        </form>
                    {/* </div> */}
                   
                </ModalDialog>
            </React.Fragment>
         );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state; // tasks,
    return { tasks, performtasks }; // tasks,
}  
const getState = {
    // create: DepartmentActions.create
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask
}
 
export default connect(mapState, getState) (ModalApproveTask); 
