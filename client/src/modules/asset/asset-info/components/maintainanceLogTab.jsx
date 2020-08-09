import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class MaintainanceLogTab extends Component {
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
                maintainanceLogs: nextProps.maintainanceLogs
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { maintainanceLogs } = this.state;

        console.log('this.state', this.state);
        var formater = new Intl.NumberFormat();

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Lịch sử sửa chữa - thay thế - nâng cấp */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Lịch sử sửa chữa - thay thế - nâng cấp</h4></legend>

                        {/* Bảng thông tin bảo trì */}
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Mã phiếu</th>
                                    <th>Ngày lập</th>
                                    <th>Phân loại</th>
                                    <th>Ngày thực hiện</th>
                                    <th>Ngày hoàn thành</th>
                                    <th>Nội dung</th>
                                    <th>Chi phí</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(maintainanceLogs && maintainanceLogs.length !== 0) &&
                                    maintainanceLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.maintainanceCode}</td>
                                            <td>{x.createDate ? this.formatDate(x.createDate) : ''}</td>
                                            <td>{x.type}</td>
                                            <td>{x.startDate ? this.formatDate(x.startDate) : ''}</td>
                                            <td>{x.endDate ? this.formatDate(x.endDate) : ''}</td>
                                            <td>{x.description}</td>
                                            <td>{x.expense ? formater.format(parseInt(x.expense)) : ''} VNĐ</td>
                                            <td>{x.status}</td>
                                        </tr>))
                                }
                            </tbody>
                        </table>
                        {
                            (!maintainanceLogs || maintainanceLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

const maintainanceLogTab = connect(null, null)(withTranslate(MaintainanceLogTab));
export { maintainanceLogTab as MaintainanceLogTab };