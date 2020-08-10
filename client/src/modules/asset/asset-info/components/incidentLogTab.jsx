import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions';

class IncidentLogTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.getUser({ name: ""});
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                incidentLogs: nextProps.incidentLogs,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate, user } = this.props;
        const { incidentLogs } = this.state;
        
        var userlist = user.list;
        console.log('this.state', this.state);

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Danh sách sự cố tài sản */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Danh sách sự cố tài sản</h4></legend>

                        {/* Bảng thông tin sự cố */}
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Mã sự cố</th>
                                    <th>Loại sự cố</th>
                                    <th>Người báo cáo</th>
                                    <th>Ngày phát hiện sự cố</th>
                                    <th>Nội dung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(incidentLogs && incidentLogs.length !== 0) &&
                                    incidentLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.incidentCode}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reportedby ? (userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().name : 'User is deleted') : ''}</td>
                                            <td>{x.dateOfIncident ? this.formatDate(x.dateOfIncident): ''}</td>
                                            <td>{x.description}</td>
                                        </tr>
                                    )
                                    )
                                }
                            </tbody>
                        </table>
                        {
                            (!incidentLogs || incidentLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};
function mapState(state) {
    const { user } = state;
    return { user };
};
const actionCreators = {
    getUser: UserActions.get,
    
};
const incidentLogTab = connect(mapState, actionCreators)(withTranslate(IncidentLogTab));
export { incidentLogTab as IncidentLogTab };