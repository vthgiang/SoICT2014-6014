import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox } from '../../../../common-components';
import { SystemSettingActions } from '../redux/actions';

function ScheduleWeeklyForm(props) {
    const [state, setState] = useState({
        config: {},
        day: '',
        hour: '',
        minute: '',
        second: ''
    })

    useEffect(() => {
        if (props.systemSetting.backup.config && JSON.stringify(props.systemSetting.backup.config) !== JSON.stringify(state.config)) {
            setState({
                ...state,
                config: props.systemSetting.backup.config,
                day: props.systemSetting.backup.config.time.day,
                hour: props.systemSetting.backup.config.time.hour,
                minute: props.systemSetting.backup.config.time.minute,
                second: props.systemSetting.backup.config.time.second,
            })
        }
    }, [props.systemSetting.backup.config])

    const handleDay = (value) => {
        setState({
            ...state,
            day: value[0]
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
        const { schedule, limit } = props;
        const { day, hour, minute, second } = state;

        return props.configBackup({ auto: 'on', schedule }, {
            limit, day, hour, minute, second
        })
    }

    const { day, hour, minute, second } = state;
    const { translate } = props;

    return (<React.Fragment>
        <div className="row">
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.day')}</label>
                    <SelectBox
                        id="schedule-weekly-day"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={[
                            { value: '1', text: translate('system_admin.system_setting.backup.week_day.mon') },
                            { value: '2', text: translate('system_admin.system_setting.backup.week_day.tue') },
                            { value: '3', text: translate('system_admin.system_setting.backup.week_day.wed') },
                            { value: '4', text: translate('system_admin.system_setting.backup.week_day.thur') },
                            { value: '5', text: translate('system_admin.system_setting.backup.week_day.fri') },
                            { value: '6', text: translate('system_admin.system_setting.backup.week_day.sat') },
                            { value: '0', text: translate('system_admin.system_setting.backup.week_day.sun') },
                        ]}
                        value={day}
                        onChange={handleDay}
                        multiple={false}
                    />
                </div>
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.hour')}</label>
                    <SelectBox
                        id="schedule-weekly-hour"
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
                        onChange={handleHour}
                        value={hour}
                        multiple={false}
                    />
                </div>
            </div>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <div className="form-group">
                    <label>{translate('system_admin.system_setting.backup.minute')}</label>
                    <SelectBox
                        id="schedule-weekly-minute"
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={[
                            { value: '0', text: '00' },
                            { value: '5', text: '5' },
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
                        id="schedule-weekly-second"
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
        <button className="btn btn-success" onClick={save}>
            {translate('system_admin.system_setting.backup.save')}
        </button>
    </React.Fragment>);
}

const mapState = (state) => {
    return state;
}

const mapDispatchToProps = {
    configBackup: SystemSettingActions.configBackup
}

export default connect(mapState, mapDispatchToProps)(withTranslate(ScheduleWeeklyForm));
