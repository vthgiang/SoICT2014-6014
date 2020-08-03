import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, ExportExcel } from '../../../../common-components';
import { HolidayEditForm, HolidayCreateForm, HolidayImportForm } from './combinedContent'

import { HolidayActions } from '../redux/actions';
class ManageHoliday extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getListHoliday();
    }
    handleImport = async () => {
        await this.setState({
            importHoliday: true
        })
        window.$('#modal_import_file').modal('show');
    }

    createHoliday = async () => {
        await this.setState({
            createHoliday: true
        })
        window.$('#modal-create-holiday').modal('show');
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

    formatDate2(date) {
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

    // Function chyển đổi dữ liệu chấm công thành dạng dữ liệu dùng export
    convertDataToExportData = (data) => {

        let exportData = {
            fileName: "Bảng chấm công",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "total", value: "Tổng số công", type: "Number" },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData
    }


    render() {
        const { translate } = this.props;
        const { holiday } = this.props;

        let { importHoliday, createHoliday } = this.state;

        let listHoliday = [];
        if (holiday.listHoliday.length !== 0) {
            listHoliday = holiday.listHoliday;
        }
        let exportData = this.convertDataToExportData(listHoliday);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title="Thêm mới kế hoạch làm việc" >Thêm mới</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }} >
                            <li><a title={'Thêm mới thông tin chấm công từ file excel'} onClick={this.handleImport}>Import file Excel</a></li>
                            <li><a title={'Thêm mới thông tin chấm công'} onClick={this.createHoliday}>Thêm bằng tay</a></li>
                        </ul>
                    </div>

                    <ExportExcel id="export-timesheets" exportData={exportData} style={{ marginRight: 15 }} />
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
                                        <td>{x.description}</td>
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

                {importHoliday && <HolidayImportForm />}
                {createHoliday && <HolidayCreateForm />}
                {
                    this.state.currentRow !== undefined &&
                    <HolidayEditForm
                        _id={this.state.currentRow._id}
                        startDate={this.formatDate2(this.state.currentRow.startDate)}
                        endDate={this.formatDate2(this.state.currentRow.endDate)}
                        description={this.state.currentRow.description}
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