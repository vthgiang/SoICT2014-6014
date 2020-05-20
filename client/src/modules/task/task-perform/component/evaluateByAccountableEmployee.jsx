import React, { Component } from 'react';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';
import { TaskInformationForm } from './taskInformationForm';

class EvaluateByAccountableEmployee extends Component {
    constructor(props) {
        super(props);
        this.state={}
    }
    
    componentWillMount() {
        this.props.getTaskById(this.props.id);
    }

    handleChangePoint = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                point: value,
                errorOnPoint: this.validatePoint(value)
            }
        })
    }

    handleChangeProgress = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        document.getElementById("autoPoint").innerHTML = value;
    } 

    handleChangeAccountablePoint = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                accountablePoint: value,
                errorOnAccountablePoint: this.validatePoint(value)
            }
        })
        document.getElementById("accountablePoint").innerHTML = value;
    }

    handleChangeAccountableContribution = async(e)=>{
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                accountableContribution: value,
                errorOnAccountableContribution: this.validatePoint(value)
            }
        })
    }

    handleChangeMyPoint = async(e)=>{
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                myPoint: value,
                errorOnMyPoint: this.validatePoint(value)
            }
        })
    }

    onContributeChange = async (e)=>{
        var {name, value} = e.target;
        await this.setState(state=>{
            return {
                ...state,
                [name]: value
            }
        });
    }

    onApprovedPointChange = async (e)=>{
        var {name, value} = e.target;
        await this.setState(state=>{
            return {
                ...state,
                [name]: value
            }
        });
    }

// ==========================BEGIN HANDLE INFORMATION TASK=========================================

    handleChangeNumberInfo = async (e) => {
        var value = parseInt(e.target.value);
        var name = e.target.name;
        await this.setState(state =>{
            return {
                ...state,
                [name]: {
                    value: value,
                    code: name
                },
                errorOnNumberInfo: this.validateNumberInfo(value)
            }
        })
    } 

    handleChangeTextInfo = async (e) => {
        var value = e.target.value;
        var name = e.target.name;
        await this.setState(state =>{
            return {
                ...state,
                [name]: {
                    value: value,
                    code: name
                },
                errorOnTextInfo: this.validateTextInfo(value)
            }
        })
    }

    handleDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    errorOnDate: this.validateDate(value),
                    date: value,
                }
            });
        
    }

    handleInfoDateChange = (value, code) => {
        console.log('value', value);
        this.setState(state => {
            state[`${code}`] = {
                value: value,
                code: code
            }
            return {
                ...state,
                errorOnInfoDate: this.validateDate(value),
                // infoDate: value,
            }
        });
    }


    handleInfoBooleanChange  = (event) => {
        var {name, value} = event.target;
        this.setState(state => {
            return {
                ...state,
                [name]: {
                    value: value,
                    code: name
                }
                // errorOnInfoBoolean: this.validateInfoBoolean(value)
            }
        });
    }

    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }
        
        return msg;
    }

    validateTextInfo = (value) =>{
        let msg = undefined;
        if(value === ""){
            msg = "Giá trị không được để trống"
        }
        return msg;
    }

    validatePoint = (value) => {
        var { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    validateNumberInfo = (value) => {
        var { translate } = this.props;
        let msg = undefined;
        
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = "Giá trị bắt buộc phải chọn";
        }
        
        return msg;
    }



    handleSetOfValueChange = async (value, code) => {
        console.log('value', value);

        this.setState(state => {
            state[`${code}`] = {
                value: value,
                code: code
            }
            return {
                ...state,
            }
        });
    }

// ==========================END HANDLE INFORMATION TASK=========================================

    // validatePoint = (value) => {
    //     var { translate } = this.props;
    //     let msg = undefined;
    //     if (value < 0 || value > 100) {
    //         msg = translate('task.task_perform.modal_approve_task.err_range');
    //     }
    //     if (isNaN(value)) {
    //         msg = translate('task.task_perform.modal_approve_task.err_empty');
    //     }
    //     return msg;
    // }
    
    handleDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    errorOnDate: this.validateDate(value),
                    date: value,
                }
            });
        
    }
    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }
        
        return msg;
    }

    isFormValidated = () => {
        const { errorOnDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
            errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo} = this.state;
        return (errorOnDate === undefined && errorOnPoint === undefined &&  errorOnProgress === undefined 
                && errorOnInfoDate === undefined && errorOnAccountablePoint === undefined 
                && errorOnAccountableContribution === undefined && errorOnMyPoint === undefined
                && errorOnInfoBoolean === undefined && errorOnNumberInfo === undefined && errorOnTextInfo === undefined)?true:false;
    }
    
    save = () => {

    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('nextProps, prevState',nextProps, prevState);
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // TODO: ve sau can sửa
                id: nextProps.id,
                // point: nextProps.point,

                errorOnPoint: undefined
            } 
        } else {
            return null;
        }
    }

    render() {
        const { translate, tasks, performtasks } = this.props;
        const { date, progress, accountablePoint, autoPoint, myPoint, accountableContribution, infoDate, infoBoolean, setOfValue } = this.state;
        const { errorOnDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
                errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo} = this.state;
        var task = (tasks && tasks.task)&& tasks.task.info;

        return (
            <React.Fragment>
            <DialogModal
                modalID={`modal-evaluate-task-by-${this.props.role}-${this.props.id}`}
                formID="form-evaluate-task-by-accountable"
                title={this.props.title}
                func={this.save}
                disableSubmit={!this.isFormValidated()}
                size={75}
                maxWidth={750}
            >
                <form id="form-evaluate-task-by-accountable">
                    <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                        <label>Ngày đánh giá:<span className="text-red">*</span></label>
                        <DatePicker
                            id="create_start_date"
                            value={date}
                            onChange={this.handleDateChange}
                        />
                        <ErrorLabel content={errorOnDate} />
                    </div>
                    <div>
                        <TaskInformationForm 
                            task= {task && task} 

                            handleChangeProgress={this.handleChangeProgress}
                            handleInfoBooleanChange={this.handleInfoBooleanChange}
                            handleInfoDateChange={this.handleInfoDateChange}
                            handleSetOfValueChange={this.handleSetOfValueChange}
                            handleChangeNumberInfo={this.handleChangeNumberInfo}
                            handleChangeTextInfo={this.handleChangeTextInfo}

                            // errorOnInfoBoolean={errorOnInfoBoolean}
                            // errorOnProgress={errorOnProgress}
                            // errorOnInfoDate={errorOnInfoDate}
                            // errorOnTextInfo={errorOnTextInfo}
                            // errorOnNumberInfo={errorOnNumberInfo}
                            
                            value={this.state}
                        />
                        
                    </div>
                    <div>
                        {/* <strong>Điểm tự động: &nbsp;<span id='autoPoint'></span> </strong>
                        <br/> */}
                        {
                            (task && task.evaluations.length !== 0 && task.evaluations[task.evaluations.length-1].results !== 0 ) &&
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Đánh giá cá nhân người phê duyệt</legend>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className={`form-group ${errorOnAccountableContribution===undefined?"":"has-error"}`}>
                                            <label>% đóng góp (<span style={{color:"red"}}>*</span>)</label>
                                            <input 
                                                className="form-control"
                                                type="number" 
                                                name="accountableContribution"
                                                placeholder={85}
                                                onChange={this.handleChangeAccountableContribution}
                                                value={accountableContribution}
                                            />
                                            <ErrorLabel content={errorOnAccountableContribution}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className={`form-group ${errorOnMyPoint===undefined?"":"has-error"}`}>
                                            <label>Điểm tự đánh giá-phê duyệt (<span style={{color:"red"}}>*</span>)</label>
                                            <input 
                                                className="form-control"
                                                type="number" 
                                                name="myPoint"
                                                placeholder={85}
                                                onChange={this.handleChangeMyPoint}
                                                value={myPoint}
                                            />
                                            <ErrorLabel content={errorOnMyPoint}/>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        }
                        
                        <strong>Điểm tự động: &nbsp;<span id='autoPoint'>{autoPoint}</span> </strong>
                        <br/>
                        <br/>
                        <strong>Đánh giá thành viên tham gia công việc: </strong>
                        <br/>
                        <br/>
                        {
                            (task && task.evaluations.length !== 0 && task.evaluations[task.evaluations.length-1].results !== 0 ) ?
                            <table className="table table-striped table-bordered table-hover">
                                <tr>
                                    <th>Tên</th>
                                    <th>Vai trò</th>
                                    <th>Điểm tự đánh giá</th>
                                    <th>% đóng góp</th>
                                    <th>Đánh giá của người phê duyệt</th>
                                </tr>
                            
                                {
                                    // (task && task.evaluations.length !== 0) &&
                                    task.evaluations[task.evaluations.length-1].results.map((res,index) => 
                                        (
                                            (res.role !== "accountable")&&
                                            <tr>
                                                <td>{res.employee.name}</td>
                                                <td>{res.role}</td>
                                                <td>{res.employeePoint}</td>
                                                <td><input className="form-control" type="number" name={`contribute${index}`} placeholder={50} onChange={this.onContributeChange}/></td>
                                                <td><input className="form-control" type="number" name={`approvedPoint${index}`} placeholder={85} onChange={this.onApprovedPointChange}/></td>
                                            </tr>  
                                        )
                                          
                                    )
                                }
                                {/* <tr>
                                    <td>{res.employee.name}</td>
                                    <td>{res.role}</td>
                                    <td><span id="accountablePoint"></span></td>
                                    <td><input className="form-control" type="number" placeholder={50}/></td>
                                    <td><input className="form-control" type="number" placeholder={85} value={accountablePoint} onChange={this.handleChangeAccountablePoint}/></td>
                                </tr> */}
                            </table> : <div><p style={{color: "red", fontWeight: "bold"}}>Người thực hiện chưa đánh giá - Chờ người thực hiện đánh giá</p></div>
                        }
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state; // tasks,
    return { tasks, performtasks }; // tasks,
}
const getState = {
    getTaskById: taskManagementActions.getTaskById,
    createResult: performTaskAction.createResultTask,
    editResultTask: performTaskAction.editResultTask,
    editStatusOfTask: taskManagementActions.editStatusOfTask
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployee));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployee }

// export {EvaluateByAccountableEmployee};