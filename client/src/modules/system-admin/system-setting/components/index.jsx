import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SelectBox, ConfirmNotification, DateTimeConverter} from '../../../../common-components';
import ScheduleMonthlyForm from './scheduleMonthlyForm';
import ScheduleWeeklyForm from './ScheduleWeeklyForm';
import ScheduleYearlyForm from './ScheduleYearlyForm';
import { SystemSettingActions } from '../redux/actions';

class SystemSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            autoBackup: 'on',
            schedule: 'monthly',
            limit: 10
        }
    }

    render() { 
        const { translate } = this.props;
        const {backup, restore} = this.props.systemSetting;
        const {schedule, autoBackup, limit} = this.state;
        console.log("processENV", process.env)
        
        return ( 
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className="box box-default">
                            <div className="box-header with-border">
                                <h4><b>Cấu hình sao lưu dữ liệu tự động</b></h4>
                            </div>
                            <div className="box-body">
                                <React.Fragment>
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
                                    </div>
                                    {
                                        autoBackup === 'on' ?
                                        <React.Fragment>
                                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                                <div className="form-group">
                                                    <label>Giới hạn bản backup</label>
                                                    <input className="form-control" type="number" min={0} onChange={this.handleBackupLimit} value={limit}/>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
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
                                            </div>
                                        </React.Fragment> :
                                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                            <button className="btn btn-success" onClick={()=>this.props.backup({auto: 'off'})}>Lưu</button>
                                        </div>
                                    }
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                        {
                                            this.renderScheduleForm()
                                        }
                                    </div>
                                </React.Fragment>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <div className="box box-default">
                            <div className="box-header with-border">
                                <button className="btn btn-success pull-right"onClick={()=>{this.props.backup()}} title={"Thêm bản sao dữ liệu mới nhất"}>             
                                    Sao lưu dữ liệu
                                </button>
                            </div>
                            <div className="box-body">
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>Phiên bản</th>
                                            <th>Mô tả</th>
                                            <th>Thời gian sao lưu</th>
                                            <th style={{width: '100px'}}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            restore.list.map( (data, i) => 
                                                <tr key={ `restore-version-${i}` }>
                                                    <td> { data.version } </td>
                                                    <td> { data.description } </td>
                                                    <td><DateTimeConverter dateTime={data.createdAt}/></td>
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
                </div>
                
            </React.Fragment>
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
        const {schedule, limit} = this.state;
        switch(schedule) {
            case 'weekly':
                return <ScheduleWeeklyForm schedule={schedule} limit={limit}/>
            case 'yearly':
                return <ScheduleYearlyForm schedule={schedule} limit={limit}/>
            default:
                return <ScheduleMonthlyForm schedule={schedule} limit={limit}/>
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

    handleBackupLimit = (e) => {
        const {value} = e.target;
        this.setState({
            limit: value
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