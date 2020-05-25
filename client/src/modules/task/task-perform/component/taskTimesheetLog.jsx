import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { performTaskAction } from './../redux/actions';
import './taskTimesheetLog.css';

class TaskTimesheetLog extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getStatusTimer();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
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

    stopTimer = () => {
        const { performtasks } = this.props;

        const timer = {
            stoppedAt: Date.now(),
            duration: Date.now() - performtasks.currentTimer.timesheetLogs[0].startedAt,
            task: performtasks.currentTimer._id,
            description: "",
            timesheetLog: performtasks.currentTimer.timesheetLogs[0]._id
        };

        this.props.stopTimer(timer);
    }

    render() { 
        const { translate, performtasks } = this.props;
        const currentTimer = performtasks.currentTimer;

        return ( 
            <React.Fragment>
                {
                    currentTimer &&
                    <div className="info-box">
                        <span className="info-box-icon">
                            <a href="#" className="link-black text-lg" >
                                <i class="fa fa-stop-circle-o fa-lg" style={{color: "red"}} aria-hidden="true" title="Dừng bấm giờ" onClick={() => this.stopTimer()}></i>
                            </a>
                        </span>
                        <div className="info-box-content">
                            <span className="info-box-text">
                                {currentTimer.name}
                            </span>
                            <span className="info-box-number">
                                {moment.utc(this.state.time - currentTimer.timesheetLogs[0].startedAt).format('HH:mm:ss')}
                            </span>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}
 
const mapStateToProps = state => {
    const { translate, performtasks } = state;
    return { translate, performtasks };
}

const mapDispatchToProps = {
    getStatusTimer: performTaskAction.getTimerStatusTask,
    stopTimer: performTaskAction.stopTimerTask,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(TaskTimesheetLog) );