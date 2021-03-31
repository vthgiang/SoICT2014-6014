import React, { Component } from 'react';
import { connect } from 'react-redux';
import { taskManagementActions } from '../../task-management/redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ToolTip } from '../../../../common-components';
import { convertTime } from '../../../../helpers/stringMethod';
import _deepClone from 'lodash/cloneDeep';

class AllTimeSheetLogs extends Component {
    constructor(props) {
        super(props);
        let curTime = new Date();
        let month = curTime.getMonth() + 1;
        let year = curTime.getFullYear();
        this.state = {
            time: month + "-" + year
        }
    }

    componentDidMount() {
        let { time } = this.state;
        this.filterTimeSheetLog(time);
        // this.filterTimeSheetLog(time);
    }

    changeTime = (value) => {
        this.setState({
            time: value
        });
        this.filterTimeSheetLog(value);
        // this.filterTimeSheetLog(value);
    }

    filterTimeSheetLog = (time) => {
        if (time) {
            let dataTime = time.split("-");
            let month = dataTime[0];
            let year = dataTime[1];
            this.props.getAllUserTimeSheet(month, year);
        }
    }


    render() {
        const { tasks, translate } = this.props;
        const { time } = this.state;
        let timesheetlogs = _deepClone(tasks?.allTimeSheetLogs);
        timesheetlogs.sort((a, b) => (a.duration < b.duration) ? 1 : -1);

        const thStyle = {
            position: "sticky",
            top: "-0.1em",
            background: "#fff",
            zIndex: 1,
        };
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            <div className="form-group" style={{ display: "flex", alignItems: 'center' }}>
                                <label style={{ margin: '2px 10px' }}>Tháng</label>
                                <DatePicker
                                    id="time-sheet-log"
                                    dateFormat="month-year"
                                    value={time}
                                    onChange={this.changeTime}
                                    disabled={false}
                                />
                            </div>
                            <div className="StyleScrollDiv StyleScrollDiv-y" style={{ maxHeight: '600px' }}>
                                <table className="table table-hover table-striped table-bordered" id="table-all-user-time-sheet-log">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px', ...thStyle }}>STT</th>
                                            <th style={thStyle}>{translate('manage_user.name')}</th>
                                            <th style={thStyle}>{translate('manage_user.email')}</th>
                                            <th style={thStyle}>Tổng thời gian bấm giờ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Array.isArray(timesheetlogs) && timesheetlogs.map((tsl, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{tsl?.creator?.name}</td>
                                                        <td>{tsl?.creator?.email}</td>
                                                        <td>{convertTime(tsl?.duration)}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapState = (state) => {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {
    getAllUserTimeSheet: taskManagementActions.getAllUserTimeSheet,

};

export default connect(mapState, actionCreators)(withTranslate(AllTimeSheetLogs));
