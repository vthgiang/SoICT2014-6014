import React, { useEffect, useState } from 'react';
import { SelectBox } from '../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SystemActions } from '../redux/actions';

function ScheduleYearlyForm(props) {
    const [state, setState] = useState({
        config: {},
        month: '',
        date: '',
        hour: '',
        minute: '',
        second: ''
    })

    useEffect(() => {
        if (props.system.backup.config && JSON.stringify(props.system.backup.config) !== JSON.stringify(state.config)) {
            setState({
                ...state,
                config: props.system.backup.config,
                month: props.system.backup.config.time.month,
                date: props.system.backup.config.time.date,
                hour: props.system.backup.config.time.hour,
                minute: props.system.backup.config.time.minute,
                second: props.system.backup.config.time.second,
            })
        }
    }, [props.system.backup.config])

    const handleMonth = (value) => {
        setState({
            ...state,
            month: value[0]
        })
    }

    const handleDate = (value) => {
        setState({
            ...state,
            date: value[0]
        })
    }

    const handleHour = (value) => {
        setState({
            ...state,
            hour: value[0]
        })
    }

    const handleMinute = (value) => {
        setState({
            ...state,
            minute: value[0]
        })
    }

    const handleSecond = (value) => {
        setState({
            ...state,
            second: value[0]
        })
    }

    const save = () => {
        const { limit, schedule } = props;
        const { month, date, hour, minute, second } = state;

        return props.configBackup({ auto: 'on', schedule }, {
            limit, month, date, hour, minute, second
        })
    }

    const { month, date, hour, minute, second } = state;
    const { translate } = props;

    return (<React.Fragment>
        <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.month')}</label>
                    <SelectBox
                        id="schedule-yearly-month"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={[
                            { value: '0', text: translate('system_admin.system_setting.backup.month_list.jan') },
                            { value: '1', text: translate('system_admin.system_setting.backup.month_list.feb') },
                            { value: '2', text: translate('system_admin.system_setting.backup.month_list.mar') },
                            { value: '3', text: translate('system_admin.system_setting.backup.month_list.apr') },
                            { value: '4', text: translate('system_admin.system_setting.backup.month_list.may') },
                            { value: '5', text: translate('system_admin.system_setting.backup.month_list.june') },
                            { value: '6', text: translate('system_admin.system_setting.backup.month_list.july') },
                            { value: '7', text: translate('system_admin.system_setting.backup.month_list.aug') },
                            { value: '8', text: translate('system_admin.system_setting.backup.month_list.sep') },
                            { value: '9', text: translate('system_admin.system_setting.backup.month_list.oct') },
                            { value: '10', text: translate('system_admin.system_setting.backup.month_list.nov') },
                            { value: '11', text: translate('system_admin.system_setting.backup.month_list.dec') }
                        ]}
                        value={month}
                        onChange={handleMonth}
                        multiple={false}
                    />
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.date')}</label>
                    <SelectBox
                        id="schedule-yearly-day"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={[
                            { value: '1', text: '1' },
                            { value: '2', text: '2' },
                            { value: '3', text: '3' },
                            { value: '4', text: '4' },
                            { value: '5', text: '5' },
                            { value: '6', text: '6' },
                            { value: '7', text: '7' },
                            { value: '8', text: '8' },
                            { value: '9', text: '9' },
                            { value: '10', text: '10' },
                            { value: '11', text: '11' },
                            { value: '12', text: '12' },
                            { value: '13', text: '13' },
                            { value: '14', text: '14' },
                            { value: '15', text: '15' },
                            { value: '16', text: '16' },
                            { value: '17', text: '17' },
                            { value: '18', text: '18' },
                            { value: '19', text: '19' },
                            { value: '20', text: '20' },
                            { value: '21', text: '21' },
                            { value: '22', text: '22' },
                            { value: '23', text: '23' },
                            { value: '24', text: '24' },
                            { value: '25', text: '25' },
                            { value: '26', text: '26' },
                            { value: '27', text: '27' },
                            { value: '28', text: '28' },
                            { value: '29', text: '29' },
                            { value: '30', text: '30' },
                            { value: '31', text: '31' },
                        ]}
                        value={date}
                        onChange={handleDate}
                        multiple={false}
                    />
                </div>
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.hour')}</label>
                    <SelectBox
                        id="schedule-yearly-hour"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={[
                            { value: '0', text: '0' },
                            { value: '1', text: '1' },
                            { value: '2', text: '2' },
                            { value: '3', text: '3' },
                            { value: '4', text: '4' },
                            { value: '5', text: '5' },
                            { value: '6', text: '6' },
                            { value: '7', text: '7' },
                            { value: '8', text: '8' },
                            { value: '9', text: '9' },
                            { value: '10', text: '10' },
                            { value: '11', text: '11' },
                            { value: '12', text: '12' },
                            { value: '13', text: '13' },
                            { value: '14', text: '14' },
                            { value: '15', text: '15' },
                            { value: '16', text: '16' },
                            { value: '17', text: '17' },
                            { value: '18', text: '18' },
                            { value: '19', text: '19' },
                            { value: '20', text: '20' },
                            { value: '21', text: '21' },
                            { value: '22', text: '22' },
                            { value: '23', text: '23' },
                        ]}
                        value={hour}
                        onChange={handleHour}
                        multiple={false}
                    />
                </div>
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.minute')}</label>
                    <SelectBox
                        id="schedule-yearly-minute"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={[
                            { value: '0', text: '00' },
                            { value: '5', text: '05' },
                            { value: '10', text: '10' },
                            { value: '15', text: '15' },
                            { value: '20', text: '20' },
                            { value: '25', text: '25' },
                            { value: '30', text: '30' },
                            { value: '35', text: '35' },
                            { value: '40', text: '40' },
                            { value: '45', text: '45' },
                            { value: '50', text: '50' },
                            { value: '55', text: '55' },
                        ]}
                        value={minute}
                        onChange={handleMinute}
                        multiple={false}
                    />
                </div>
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.second')}</label>
                    <SelectBox
                        id="schedule-yearly-second"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={[
                            { value: '0', text: '00' },
                            { value: '30', text: '30' },
                        ]}
                        value={second}
                        onChange={handleSecond}
                        multiple={false}
                    />
                </div>
            </div>
        </div>

        <button className="btn btn-success" onClick={save}>{translate('system_admin.system_setting.backup.save')}</button>
    </React.Fragment>);
}

function mapState(state) {
    return state;
}

const dispatchStateToProps = {
    configBackup: SystemActions.configBackup
}

export default connect(mapState, dispatchStateToProps)(withTranslate(ScheduleYearlyForm));
