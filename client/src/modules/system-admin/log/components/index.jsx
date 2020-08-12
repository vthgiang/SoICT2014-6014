import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {SelectBox} from '../../../../common-components';
import ScheduleMonthlyForm from './scheduleMonthlyForm';
import ScheduleWeeklyForm from './ScheduleWeeklyForm';
import ScheduleYearlyForm from './ScheduleYearlyForm';

class LogSystem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            schedule: 'monthly'
        }
    }

    render() { 
        const { translate } = this.props;
        console.log("schedule: ", this.state.schedule)
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
                                        value={'monthly'}
                                        onChange={this.handleSchedule}
                                        multiple={false}
                                    />
                                </div>
                                {
                                    this.rederScheduleForm()
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

    rederScheduleForm = () => {
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
}

const connectedLogSystem = connect(mapState, actions)(withTranslate(LogSystem));
export { connectedLogSystem as LogSystem }