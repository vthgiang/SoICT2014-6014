import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { HolidayActions } from '../redux/actions';
import { ToastContainer } from 'react-toastify';
import { ModalImportHoliday } from './ModalImportHoliday';
import { ModalEditHoliday } from './ModalEditHoliday';
import { ModalAddHoliday } from './ModalAddHoliday';
import { DeleteNotification } from '../../../../common-components';
class ManageHoliday extends Component {
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
    render() {
        if (this.props.holiday.listHoliday.length !== 0) {
            var listHoliday = this.props.holiday.listHoliday
        }
        var { translate } = this.props;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-info">
                            <div className="box-body" >
                                <div className="col-md-12">
                                    <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 10 }}>
                                        <div className="box-header col-md-6" style={{ paddingLeft: 0 }}>
                                            <h3 className="box-title">Danh sách lịch nghỉ ngày lễ (ngày tết):</h3>
                                        </div>
                                        <button type="submit" style={{ marginRight:0 }} className="btn btn-success pull-right" id="" title="Chọn tệp để Import" data-toggle="modal" data-target="#modal-importFileSabbatical">Import File</button>
                                        <button type="submit" style={{ marginRight: 15 }} className="btn btn-success pull-right" id="" title="Thêm mới lịch nghỉ" data-toggle="modal" data-target="#modal-addHoliday">Thêm mới</button>
                                    </div>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }}>STT</th>
                                                <th style={{ width: "30%" }}>Các mốc thời gian</th>
                                                <th style={{ width: "55%" }}>Mô tả các mốc thời gian</th>
                                                <th>Hành động</th>
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
                                                            <ModalEditHoliday data={x} />
                                                            <DeleteNotification
                                                                content={{
                                                                    title: "Xoá ngày nghỉ lễ (tết)",
                                                                    btnNo: translate('confirm.no'),
                                                                    btnYes: translate('confirm.yes'),
                                                                }}
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
                            </div>
                            {/* /.box-body */}
                        </div>
                    </div>
                </div>
                <ModalImportHoliday />
                <ModalEditHoliday />
                <ModalAddHoliday />
                <ToastContainer />
            </React.Fragment>
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