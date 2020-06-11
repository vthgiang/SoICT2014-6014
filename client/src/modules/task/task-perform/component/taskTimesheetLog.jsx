import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import { DialogModal } from '../../../../common-components';
import { getStorage } from "../../../../config";

import { CallApiStatus } from '../../../auth/redux/reducers'

import { performTaskAction } from './../redux/actions';
import './taskTimesheetLog.css';

class TaskTimesheetLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:''
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

    stopTimer = async () => {
        const { performtasks ,auth} = this.props;

        const timer = {
            stoppedAt: Date.now(),
            duration: Date.now() - performtasks.currentTimer.timesheetLogs[0].startedAt,
            task: performtasks.currentTimer._id,
            description: "",
            timesheetLog: performtasks.currentTimer.timesheetLogs[0]._id
        };
        //this.props.ABC()
        await this.props.stopTimer(timer);
        await this.setState(state=>{
            return {
                ...state,
                showModal: auth.user.id
            }
        });
        // window.$("#modal-description-abc").modal('show')
    }   
    save = () => {
        //do something
        console.log("Clicked!!")
    }
    render() { 
        
        const { translate, performtasks, auth } = this.props;
        const currentTimer = performtasks.currentTimer;
        // console.log(auth.user.id)
        // console.log(this.state.showModal)
        return ( 
            <React.Fragment>
                {
                    currentTimer &&
                    <React.Fragment>
                    <div className="timer info-box">
                        <span className="timer info-box-icon">
                            <a href="#" className="link-black text-lg">
                                <i className="fa fa-stop-circle-o fa-lg" style={{color: "red"}} aria-hidden="true" title="Dừng bấm giờ" onTouchEnd={this.stopTimer} onClick={this.stopTimer}></i>
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
                        <DialogModal
                            marginTop = {"30px"}
                            isLoading={false}
                            size="30vh"
                            modalID={"modal-description-abc"}
                            formID="form-timesheet-log"
                            title={'Mô tả bấm giờ'}
                            bodyStyle={{padding: "15px"}}
                            hasSaveButton={true}
                            func= {this.save}
                        >
                            <form>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Nhập mô tả (*):</label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                            </form>
                        </DialogModal>
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