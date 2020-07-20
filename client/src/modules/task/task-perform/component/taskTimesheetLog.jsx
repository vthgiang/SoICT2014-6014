import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import { DialogModal } from '../../../../common-components';
import { getStorage } from "../../../../config";

import { CallApiStatus } from '../../../auth/redux/reducers'
import TextareaAutosize from 'react-textarea-autosize';
import { performTaskAction } from './../redux/actions';
import './taskTimesheetLog.css';
import Swal from 'sweetalert2';
class TaskTimesheetLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:'',
            description: ''
        }
        this.sendQuery = false;
    }

    callApi = () => {
        if (!this.called && this.props.auth.calledAPI === CallApiStatus.FINISHED){
            this.props.getStatusTimer();
            this.called = true;
        }
    }


    componentDidMount = () =>{
        this.callApi();
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        this.callApi(); // Khi logout rồi login vào website (hoặc login mới), chưa gọi API lấy task đang được bấm giờ trong componentDidMount -> Cần gọi lại

        if (nextProps.performtasks && nextProps.performtasks.currentTimer) {
            if (!this.timer) {
                this.timer = setInterval(() => this.setState(state => {
                    return {
                        ...state,
                        time: new Date()
                    }
                }), 1000);
            }
        } else {
            if (this.timer){
                clearInterval(this.timer);
                this.timer = null;
            }
        }

        return true;
    }

    componentWillUnmount = () => {
        if (this.timer){
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    handleStopTimer = () => {
        const {auth} = this.props;
        this.setState(state=>{
            return {
                ...state,
                showModal: auth.user.id
            }
        });
    }
    stopTimer = async () => {
        const { performtasks ,auth} = this.props;

        const timer = {
            stoppedAt: Date.now(),
            duration: Date.now() - performtasks.currentTimer.timesheetLogs[0].startedAt,
            task: performtasks.currentTimer._id,
            description: this.state.description,
            timesheetLog: performtasks.currentTimer.timesheetLogs[0]._id
        };
        await this.props.stopTimer(timer);
        
        // window.$("#modal-description-abc").modal('show')
    }   
    save = () => {
        //do something
        Swal.fire({
            title: "Bấm giờ quá 8 tiếng sẽ không được ghi nhận",
            type: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận',
            icon: 'warning'
        })
    }
    render() { 
        
        const { translate, performtasks, auth } = this.props;
        const currentTimer = performtasks.currentTimer;
        const a = this.state.time - currentTimer?.timesheetLogs[0].startedAt
        return ( 
            <React.Fragment>
                {
                    currentTimer &&
                    <React.Fragment>
                    <div className="timer info-box">
                        <span className="timer info-box-icon">
                            <a href="#" className="link-black text-lg">
                                <i className="fa fa-stop-circle-o fa-lg" style={{color: "red"}} aria-hidden="true" title="Dừng bấm giờ" onTouchEnd={this.handleStopTimer} onClick={this.handleStopTimer}></i>
                            </a>
                        </span>
                        <div className="timer info-box-content">
                            <span className="timer info-box-text">
                                {currentTimer.name}
                            </span>
                            <span className="timer info-box-number">
                                {moment.utc(this.state.time - currentTimer.timesheetLogs[0].startedAt).format('HH:mm:ss')}
                            </span>
                        </div>
                    </div>

                    {this.state.showModal == auth.user.id && 
                    <React.Fragment>
                        <div style={{width:'98%',backgroundColor:'white',border:'1px solid', height:"170px"}}>
                        <h2 style={{width:'100%',textAlign:'center',fontFamily:'sans-serif'}}>Nhập mô tả</h2>
                        <TextareaAutosize
                            style={{width:'100%'}}
                            placeholder='Nhập mô tả'
                            useCacheForDOMMeasurements
                            minRows = {3}
                            maxRows = {20}
                            onChange={(e)=>{
                                let value = e.target.value;
                                this.setState(state => {
                                    return { ...state, description: value}
                                })
                                console.log(this.state.description)
                            }}/>
                        <button className="btn btn-primary pull-right" style={{marginBottom:'5px'}} onClick={this.stopTimer} > Dừng bấm giờ</button>
                        </div>
                    </React.Fragment>
                    }
                    { (a > 28200000 && a < 28201000) && 
                        this.save()
                    }
                   </React.Fragment>
                }
            </React.Fragment>
        );
    }
}
 
const mapStateToProps = state => {
    const { translate, performtasks, auth } = state;
    return { translate, performtasks, auth };
}

const mapDispatchToProps = {
    getStatusTimer: performTaskAction.getTimerStatusTask,
    stopTimer: performTaskAction.stopTimerTask,
    ABC: performTaskAction.ABC
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(TaskTimesheetLog) );