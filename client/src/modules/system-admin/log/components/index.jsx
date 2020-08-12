import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SelectBox} from '../../../../common-components';
import ScheduleMonthlyForm from './scheduleMonthlyForm';
import ScheduleWeeklyForm from './ScheduleWeeklyForm';
import ScheduleYearlyForm from './ScheduleYearlyForm';
import { LogActions } from '../redux/actions';

class LogSystem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            backupType: 'backup-automatic',
            autoBackup: 'on',
            schedule: 'monthly'
        }
    }

    render() { 
        const { translate } = this.props;
        const {backupType, schedule, autoBackup} = this.state;
        console.log("schedule:", this.state)
        return ( 
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="box box-primary color-palette-box" style={{minHeight: '100px'}}>
                            <div className="box-header with-border">
                                <h3 className="box-title"><i className="fa fa-server text-blue" /> Backup dữ liệu định kỳ</h3>
                            </div>
                            <div className="box-body">
                                <div className="form-group">
                                    <label>Thiết lập</label>
                                    <div>
                                        <div className="radio-inline">
                                            <span>
                                                <input type="radio" name="backup-hand" value="backup-hand" onChange={this.handleBackupType}
                                                    checked={backupType === "backup-hand" ? true : false} />Thủ công</span>
                                        </div>
                                        <div className="radio-inline">
                                            <span>
                                                <input type="radio" name="backup-automatic" value="backup-automatic" onChange={this.handleBackupType}
                                                    checked={backupType === "backup-automatic" ? true : false} />Tự động</span>
                                        </div><br/>
                                    </div>
                                </div>
                                {
                                    backupType === 'backup-automatic' ? 
                                    <React.Fragment>
                                        <div className="form-group">
                                            <label>Trạng thái sao lưu</label>
                                            <SelectBox
                                                id="select-backup-status"
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={[
                                                    {value: 'on', text: 'Bật'},
                                                    {value: 'off', text: 'Tắt'}
                                                ]}
                                                value={'on'}
                                                onChange={this.handleBackupAutoStatus}
                                                multiple={false}
                                            />
                                        </div>
                                        {
                                            autoBackup === 'on' ?
                                            <React.Fragment>
                                                <div className="form-group">
                                                    <label>Thời gian định kỳ</label>
                                                    <SelectBox
                                                        id="select-backup-time-schedule"
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={[
                                                            {value: 'weekly', text: 'Hàng tuần'},
                                                            {value: 'monthly', text: 'Hàng tháng'},
                                                            {value: 'yearly', text: 'Hàng năm'},
                                                        ]}
                                                        value={schedule}
                                                        onChange={this.handleSchedule}
                                                        multiple={false}
                                                    />
                                                </div>
                                                {
                                                    this.renderScheduleForm()
                                                }
                                            </React.Fragment>:
                                            <button className="btn btn-success">Save</button>
                                        }
                                    </React.Fragment> : 
                                    <button className="btn btn-success" onClick={this.props.backupDatabase}>Sao lưu</button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="box box-success color-palette-box" style={{minHeight: '100px'}}>
                            <div className="box-header with-border">
                                <h3 className="box-title"><i className="fa fa-refresh text-green" /> Restore dữ liệu</h3>
                            </div>
                            <div className="box-body">
                             
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }

    handleBackupType = (e) => {
        const {value} = e.target;
        this.setState({
            backupType: value
        })
    }

    handleBackupAutoStatus = (value) => {
        this.setState({
            autoBackup: value[0]
        })
    }

    renderScheduleForm = () => {
        const {schedule} = this.state;
        switch(schedule) {
            case 'weekly':
                return <ScheduleWeeklyForm/>
            case 'yearly':
                return <ScheduleYearlyForm/>
            default:
                return <ScheduleMonthlyForm/>
        }
    }

    handleScheduleType = (value) => {
        this.setState({ backupType: value[0]})
    }

    handleSchedule = (value) => {
        this.setState({
            schedule: value[0]
        })
    }
}
 
function mapState(state) {
    const { log } = state;
    return { log }
}
const actions = {
    backupDatabase: LogActions.backupDatabase
}

const connectedLogSystem = connect(mapState, actions)(withTranslate(LogSystem));
export { connectedLogSystem as LogSystem }