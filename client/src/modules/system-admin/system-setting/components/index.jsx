import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SelectBox, ConfirmNotification} from '../../../../common-components';
import ScheduleMonthlyForm from './scheduleMonthlyForm';
import ScheduleWeeklyForm from './ScheduleWeeklyForm';
import ScheduleYearlyForm from './ScheduleYearlyForm';
import { SystemSettingActions } from '../redux/actions';

class SystemSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            backupType: 'automatic',
            autoBackup: 'on',
            schedule: 'monthly'
        }
    }

    render() { 
        const { translate } = this.props;
        const {backup, restore} = this.props.systemSetting;
        const {schedule, autoBackup, backupType} = this.state;
        console.log("schedule:", this.state)
        return ( 
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#backup" data-toggle="tab">Backup <i className="material-icons">backup</i> </a></li>
                    <li><a href="#restore" data-toggle="tab">Restore<i className="material-icons">restore</i> </a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="backup">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="radio-inline">
                                    <span>
                                        <input type="radio" name="backup-no-automatic" value="no-automatic" onChange={this.handleBackupType}
                                            checked={backupType !== "automatic" ? true : false} />Thủ công</span>
                                </div>
                                <div className="radio-inline">
                                    <span>
                                        <input type="radio" name="backup-automatic" value="automatic" onChange={this.handleBackupType}
                                            checked={backupType === "automatic" ? true : false} />Tự động</span>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                {
                                    backupType !== 'automatic' ?
                                    <div style={{padding: '10px', border: '1px solid #ECF0F5', marginTop: '10px'}}>
                                        <button className="btn btn-default"onClick={()=>{this.props.backup()}} title={"Thêm bản sao dữ liệu mới nhất"}>
                                            Sao lưu dữ liệu
                                        </button>
                                    </div> :
                                    <div style={{padding: '10px', border: '1px solid #ECF0F5', marginTop: '10px'}}>
                                        <div className="form-group">
                                            <label>Tự động sao lưu</label>
                                            <SelectBox
                                                id="select-backup-status"
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={[
                                                    {value: 'on', text: 'Bật'},
                                                    {value: 'off', text: 'Tắt'}
                                                ]}
                                                value={autoBackup}
                                                onChange={this.handleBackupAutoStatus}
                                                multiple={false}
                                            />
                                        </div>
                                        {
                                            autoBackup === 'on' ?
                                            <React.Fragment>
                                                <div className="form-group">
                                                    <label>Giới hạn bản backup dữ liệu</label>
                                                    <input className="form-control" type="number" min={0}/>
                                                </div>
                                                <div className="form-group">
                                                    <label>Định kỳ</label>
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
                                            <button className="btn btn-success" onClick={()=>this.props.backup({auto: 'off'})}>Lưu</button>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane" id="restore">
                        
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>Phiên bản</th>
                                    <th>Mô tả</th>
                                    <th style={{width: '100px'}}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    restore.list.map( (data, i) => 
                                        <tr key={ `restore-version-${i}` }>
                                            <td> { data.version } </td>
                                            <td> { data.description } </td>
                                            <td>
                                                <ConfirmNotification
                                                    icon="question"
                                                    title="Restore this backup data"
                                                    content="<h3>Restore this backup data</h3>"
                                                    name="restore"
                                                    className="text-green"
                                                    func={()=>this.restore(data.version)}
                                                />
                                                <ConfirmNotification
                                                    icon="warning"
                                                    title="Delete this backup data"
                                                    content="<h3>Delete this backup data</h3>"
                                                    name="delete_outline"
                                                    className="text-red"
                                                    func={()=>this.deleteBackup(data.version)}
                                                />
                                            </td>
                                        </tr>       
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
         );
    }

    componentDidMount(){
        this.props.getRestoreData();
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
                return <ScheduleWeeklyForm schedule={schedule}/>
            case 'yearly':
                return <ScheduleYearlyForm schedule={schedule}/>
            default:
                return <ScheduleMonthlyForm schedule={schedule}/>
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

    restore = (version) => {
        console.log("restore", version);
        this.props.restore(version);
    }

    deleteBackup = (version) => {
        this.props.deleteBackup(version)
    }
}
 
function mapState(state) {
    const { systemSetting } = state;
    return { systemSetting }
}
const actions = {
    backup: SystemSettingActions.backup,
    deleteBackup: SystemSettingActions.deleteBackup,
    getRestoreData: SystemSettingActions.getRestoreData,
    restore: SystemSettingActions.restore
}

const connectedSystemSetting = connect(mapState, actions)(withTranslate(SystemSetting));
export { connectedSystemSetting as SystemSetting }