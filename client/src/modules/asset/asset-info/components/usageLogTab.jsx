import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class UsageLogTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                usageLogs: nextProps.usageLogs,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate, user } = this.props;
        const { usageLogs } = this.state;

        var userlist = user.list;
        console.log('this.state', this.state);

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Lịch sử cấp phát - điều chuyển - thu hồi */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Lịch sử cấp phát - điều chuyển - thu hồi</h4></legend>

                        {/* Bảng thông tin sử dụng */}
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Người sử dụng</th>
                                    <th>Ngày bắt đầu sử dụng</th>
                                    <th>Ngày kết thúc sử dụng</th>
                                    <th>Nội dung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usageLogs && usageLogs.length !== 0) &&
                                    usageLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.usedby && userlist.length && userlist.filter(item => item._id === x.usedBy).pop() ? userlist.filter(item => item._id === x.usedBy).pop().name : 'User is deleted'}</td>
                                            <td>{x.startDate ? this.formatDate(x.startDate) : ''}</td>
                                            <td>{x.endDate ? this.formatDate(x.endDate) : ''}</td>
                                            <td>{x.description}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (!usageLogs || usageLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
const usageLogTab = connect(mapState, null)(withTranslate(UsageLogTab));
export { usageLogTab as UsageLogTab };