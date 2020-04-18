import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { withTranslate } from 'react-redux-multilingual';
import { performTaskAction } from '../redux/actions';
import { ModalDialog, ErrorLabel, ModalButton } from '../../../../common-components';
import { taskManagementActions } from '../../task-management/redux/actions';

class ModalApproveTask extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.props.getTaskById(this.props.taskID);
    }

    addResult = (taskID) => { // tạo mới result task rồi thêm vào db, cập nhật lại result trong task
        var { currentUser, role, performtasks } = this.props;
        //1-responsible, 2-accountable, 3-consulted
        if (role === "responsible") {
            return this.props.createResult({
                result: {
                    member: currentUser,
                    systempoint: this.state.systempoint,
                    mypoint: this.state.mypoint1,
                    approverpoint: this.state.approvepoint1,
                    roleMember: "responsible"
                },
                task: taskID
            });
        } else if (role === "consulted") {
            return this.props.createResult({
                result: {
                    member: currentUser,

                    systempoint: this.state.systempoint,
                    mypoint: this.state.mypoint2,
                    approverpoint: this.state.approvepoint2,
                    roleMember: "consulted"
                },
                task: taskID
            });
        } else if (role === "accountable") {
            var mypoint = this.state.mypoint3;
            return this.props.createResult({
                result: {
                    member: currentUser,
                    systempoint: this.state.systempoint,
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
                systempoint: this.state.systempoint,
                mypoint: this.state.mypoint1,
                approverpoint: this.state.approvepoint1,
                _id: task && task.results[0]._id,
                member: task && task.responsible[0]._id,
                roleMember: "responsible"
            },
            {
                systempoint: this.state.systempoint,
                mypoint: this.state.mypoint2,
                approverpoint: this.state.approvepoint2,
                _id: task && task.results[1]._id,
                member: task && task.consulted[0]._id,
                roleMember: "consulted"
            }
        ]; // currentTask.results;
        return this.props.editResultTask(listResult, taskID);
    }

    handleChangeMyPoint = async () => {
        await this.setState(state => {
            var percent = parseInt(this.percent.value);
            var a = this.validatePoint(percent)
            console.log('---errorOnPercent---', a);
            return {
                ...state,
                systempoint: percent,
                errorOnPercent: this.validatePoint(percent)
            }
        });

    }

    onHandleChange = async (e, namePoint) => {
        // var name = e.target.name;
        var value = parseInt(e.target.value);
        if (namePoint === "systempoint") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    systempoint: value,
                    errorOnPercent: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "mypoint1") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    mypoint1: value,
                    errorOnResMypoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "approvepoint1") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    approvepoint1: value,
                    errorOnResApprovepoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "mypoint2") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    mypoint2: value,
                    errorOnConsMypoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "approvepoint2") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    approvepoint2: value,
                    errorOnConsApprovepoint: this.validatePoint(value)
                }
            });
        }
        if (namePoint === "mypoint3") {
            await this.setState(state => {
                return {
                    // [name]: value,
                    ...state,
                    mypoint3: value,
                    errorOnApprovepoint: this.validatePoint(value)
                }
            });
        }
        // console.log(this.state);
    }

    validatePoint = (value) => {
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = "Giá trị không được vượt quá khoảng 0-100"
        }
        return msg;
    }

    save = () => {
        var { tasks, currentUser, role, performtasks } = this.props;
        if (role === "responsible") {
            var status = { status: "Chờ phê duyệt" };
            this.addResult(this.props.taskID);
            return this.props.editStatusOfTask(this.props.taskID, status);
        }
        else if (role === "consulted") {
            return this.addResult(this.props.taskID);
        }
        else if (role === "accountable") {
            var status = { status: "Đã hoàn thành" };
            this.addResult(this.props.taskID);
            this.confirmResult(this.props.taskID);
            return this.props.editStatusOfTask(this.props.taskID, status);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) { // nếu next != prev thì cập nhật state
        console.log('-----Next----', nextProps);
        console.log('-----Prev----', prevState);
        const { tasks } = nextProps;
        if (nextProps.taskID !== prevState.taskID) {
            console.log('-----update----');
            var task;
            var respPoint, consultPoint, accoutPoint;
            if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
            if (task && task.results) {
                var listResult = task.results;
                listResult.map((item) => {
                    if (task.responsible[0]._id === item.member && item.roleMember === "responsible") respPoint = item;
                    if (task.consulted[0]._id === item.member && item.roleMember === "consulted") consultPoint = item;
                    if (task.accounatable[0]._id === item.member && item.roleMember === "accountable") accoutPoint = item;
                })
            }
            const systempoint_def = (respPoint) ? respPoint.systempoint : 0;
            const defaultPoint = {
                systempoint: (respPoint) ? respPoint.systempoint : 0,
                responsible: {
                    mypoint: (respPoint) ? respPoint.mypoint : 0,
                    approverpoint: (respPoint) ? respPoint.approverpoint : 0
                },
                consulted: {
                    mypoint: (consultPoint) ? consultPoint.mypoint : 0,
                    approverpoint: (consultPoint) ? consultPoint.approverpoint : 0
                },
                accountable: {
                    mypoint: (accoutPoint) ? (accoutPoint.mypoint) : systempoint_def
                }
            }
            return {
                ...prevState,
                //  systempoint, mypoint1, mypoint2, mypoint3, approvepoint1, approvepoint2 
                taskID: nextProps.taskID,
                systempoint: task && defaultPoint.systempoint,
                mypoint1: task && defaultPoint.responsible.mypoint,
                approvepoint1: task && defaultPoint.responsible.approverpoint,
                mypoint2: task && defaultPoint.consulted.mypoint,
                approvepoint2: task && defaultPoint.consulted.approverpoint,
                mypoint3: task && defaultPoint.accountable.mypoint,

                errorOnApprovepoint: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnConsApprovepoint: undefined,
                errorOnConsMypoint: undefined,
                errorOnPercent: undefined,
                errorOnResApprovepoint: undefined,
                errorOnResMypoint: undefined,
                errorOnSytempoint: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { currentUser, role, resultTask } = this.props;
        var { systempoint, mypoint1, mypoint2, mypoint3, approvepoint1, approvepoint2 } = this.state;
        var { errorOnApprovepoint, errorOnConsApprovepoint, errorOnConsMypoint, errorOnPercent, errorOnResApprovepoint, errorOnResMypoint, errorOnSytempoint } = this.state;

        return (
            <React.Fragment>
                {/* <ModalButton modalID="modal-approve-task" button_name="Yêu cầu phê duyệt" title="Yêu cầu phê duyệt"/> */}
                <ModalDialog
                    size="50"
                    modalID={`modal-approve-task-${this.props.taskID}`}
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
                            <div className={`form-group ${errorOnPercent === undefined ? "" : "has-error"}`}>
                                <label className="form-control-static" htmlfor="percent">Công việc hoàn thành(%):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="percent"
                                    placeholder={10}
                                    ref={input => this.percent = input}
                                    value={systempoint}
                                    onChange={() => this.handleChangeMyPoint()}
                                    disabled={role !== "responsible"}
                                />
                                <ErrorLabel content={errorOnPercent} />
                            </div>
                            <div className={`form-group ${errorOnSytempoint === undefined ? "" : "has-error"}`}>
                                <label className="form-control-static" htmlfor="systempoint">Điểm hệ thống:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="systempoint"
                                    placeholder={10}
                                    // ref={input => this.systempoint = input} 
                                    // defaultValue={task && defaultPoint.systempoint} 
                                    disabled="true"
                                    name="systempoint"
                                    value={systempoint}
                                    onChange={(e) => this.onHandleChange(e, "systempoint")}
                                />
                                <ErrorLabel content={errorOnSytempoint} />
                            </div>
                        </fieldset>

                        {(role === "responsible" || role === "accountable") &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Vai trò người thực hiện:</legend>
                                <div className={`form-group ${errorOnResMypoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="mypoint1">Điểm tự đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="mypoint1"
                                        placeholder={80}
                                        // ref={input => this.mypoint1 = input} 
                                        // defaultValue={task && defaultPoint.responsible.mypoint} 
                                        disabled={role !== "responsible"}
                                        name="mypoint1"
                                        value={mypoint1}
                                        onChange={(e) => this.onHandleChange(e, "mypoint1")}
                                    />
                                    <ErrorLabel content={errorOnResMypoint} />
                                </div>
                                <div className={`form-group ${errorOnResApprovepoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="approvepoint1">Điểm quản lý đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="approvepoint1"
                                        placeholder={80}
                                        // ref={input => this.approvepoint1 = input} 
                                        // defaultValue={task && defaultPoint.responsible.approverpoint} 
                                        disabled={role !== "accountable"}
                                        name="approvepoint1"
                                        value={approvepoint1}
                                        onChange={(e) => this.onHandleChange(e, "approvepoint1")}
                                    />
                                    <ErrorLabel content={errorOnResApprovepoint} />
                                </div>
                            </fieldset>
                        }

                        {(role === "consulted" || role === "accountable") &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Vai trò người hỗ trợ:</legend>
                                <div className={`form-group ${errorOnConsMypoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="mypoint2">Điểm tự đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="mypoint2"
                                        placeholder={10}
                                        // ref={input => this.mypoint2 = input} 
                                        // defaultValue={task && defaultPoint.consulted.mypoint} 
                                        disabled={role !== "consulted"}
                                        name="mypoint2"
                                        value={mypoint2}
                                        onChange={(e) => this.onHandleChange(e, "mypoint2")}
                                    />
                                    <ErrorLabel content={errorOnConsMypoint} />
                                </div>
                                <div className={`form-group ${errorOnConsApprovepoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="approvepoint2">Điểm quản lý đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="approvepoint2"
                                        placeholder={10}
                                        // ref={input => this.approvepoint2 = input} 
                                        // defaultValue={task && defaultPoint.consulted.approverpoint} 
                                        disabled={role !== "accountable"}
                                        name="approvepoint2"
                                        value={approvepoint2}
                                        onChange={(e) => this.onHandleChange(e, "approvepoint2")}
                                    />
                                    <ErrorLabel content={errorOnConsApprovepoint} />
                                </div>
                            </fieldset>
                        }
                        {(role === "accountable") &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Vai trò người phê duyệt:</legend>
                                <div className={`form-group ${errorOnApprovepoint === undefined ? "" : "has-error"}`}>
                                    <label className="form-control-static" htmlfor="mypoint3">Điểm tự đánh giá:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="mypoint3"
                                        placeholder={10}
                                        // ref={input => this.mypoint3 = input} 
                                        // defaultValue={task && defaultPoint.accountable.mypoint} 
                                        disabled={role !== "accountable"}
                                        name="mypoint3"
                                        value={mypoint3}
                                        onChange={(e) => this.onHandleChange(e, "mypoint3")}
                                    />
                                    <ErrorLabel content={errorOnApprovepoint} />
                                </div>
                                {/* <div className={`form-group ${errorOnApprovepoint===undefined?"":"has-error"}`}>
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

export default connect(mapState, getState)(ModalApproveTask); 
