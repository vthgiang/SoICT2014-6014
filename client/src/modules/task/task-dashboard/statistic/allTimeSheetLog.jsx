import React, { Component } from 'react';
import { connect } from 'react-redux';
import { taskManagementActions } from '../../task-management/redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ToolTip } from '../../../../common-components';
import { convertTime } from '../../../../helpers/stringMethod';

class AllTimeSheetLogs extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        this.props.getAllUserTimeSheet(1, 2021);
    }

    render() {
        const { tasks, translate } = this.props;
        const timesheetlogs = tasks?.allTimeSheetLogs;

        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <table className="table table-hover table-striped table-bordered" id="table-all-user-time-sheet-log">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>STT</th>
                                <th>{translate('manage_user.name')}</th>
                                <th>{translate('manage_user.email')}</th>
                                <th>Tổng thời gian bấm giờ</th>
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