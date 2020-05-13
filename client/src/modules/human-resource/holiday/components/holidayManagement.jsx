import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ModalImportHoliday } from './holidayImportForm';
import { DeleteNotification } from '../../../../common-components';
import { HolidayEditForm, HolidayCreateForm } from './combinedContent'

import { HolidayActions } from '../redux/actions';
class ManageHoliday extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getListHoliday();
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    }

    formatDate2(date){
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('-');
    }
    // Function bắt sự kiện chỉnh sửa thông tin nhân viên
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-holiday').modal('show');
    }
    render() {
        if (this.props.holiday.listHoliday.length !== 0) {
            var listHoliday = this.props.holiday.listHoliday
        }
        var { translate } = this.props;
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <button type="button" className="btn btn-success pull-right" style={{ marginLeft: 20 }} id="" title="Chọn tệp để Import" data-toggle="modal" data-target="#modal-importFileSabbatical">Import File</button>
                    <HolidayCreateForm />
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <h4 className="box-title">Danh sách lịch nghỉ ngày lễ (ngày tết):</h4>
                        </div>

                    </div>

                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>STT</th>
                                <th style={{ width: "30%" }}>Các mốc thời gian</th>
                                <th style={{ width: "55%" }}>Mô tả các mốc thời gian</th>
                                <th style={{ width: 120 }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listHoliday === 'undefined' || listHoliday.length === 0) ? <tr><td colSpan={4}><center>{translate('table.no_data')}</center></td></tr> :
                                listHoliday.map((x, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{(this.formatDate(x.startDate) === this.formatDate(x.endDate)) ? this.formatDate(x.startDate) : this.formatDate(x.startDate) + " - " + this.formatDate(x.endDate)}</td>
                                        <td>{x.reason}</td>
                                        <td>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa nghỉ phép"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xoá ngày nghỉ lễ (tết)"
                                                data={{
                                                    id: x._id,
                                                    info: (this.formatDate(x.startDate) === this.formatDate(x.endDate)) ? this.formatDate(x.startDate) : this.formatDate(x.startDate) + " - " + this.formatDate(x.endDate)
                                                }}
                                                func={this.props.deleteHoliday}
                                            />
                                        </td>
                                    </tr>)
                                )}
                        </tbody>
                    </table>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <HolidayEditForm
                        _id={this.state.currentRow._id}
                        startDate={this.formatDate2(this.state.currentRow.startDate)}
                        endDate={this.formatDate2(this.state.currentRow.endDate)}
                        reason={this.state.currentRow.reason}
                    />
                }
            </div>
        );
    }
};
function mapState(state) {
    const { holiday } = state;
    return { holiday };
};

const actionCreators = {
    deleteHoliday: HolidayActions.deleteHoliday,
    getListHoliday: HolidayActions.getListHoliday
};
const listHoliday = connect(mapState, actionCreators)(withTranslate(ManageHoliday));
export { listHoliday as ManageHoliday };