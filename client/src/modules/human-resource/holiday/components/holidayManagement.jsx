import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, ExportExcel, DatePicker } from '../../../../common-components';

import { HolidayEditForm, HolidayCreateForm, HolidayImportForm } from './combinedContent'

import { HolidayActions } from '../redux/actions';

class ManageHoliday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
        }
    }

    componentDidMount() {
        this.props.getListHoliday();
    }

    /** Bắt sự kiện import kế hoạch làm việc */
    handleImport = async () => {
        await this.setState({
            importHoliday: true
        })
        window.$('#modal_import_file').modal('show');
    }

    /** Function bắt sự kiện thêm mới lịch làm việc */
    createHoliday = async () => {
        await this.setState({
            createHoliday: true
        })
        window.$('#modal-create-holiday').modal('show');
    }

    /**
     * Bắt sự kiện thay đổi số ngày được nghỉ phép trong năm
     * @param {*} value : Tổng số ngày được nghỉ phép
     */
    handleYearChange = (value) => {
        this.setState({
            year: value
        })
    }


    handleSunmitSearch = () => {
        const { year } = this.state;
        this.props.getListHoliday({ year: year });
    }

    /**
     * Function format ngày hiện tại thành dạnh dd/mm/yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate(date) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }
        return date;
    }

    /**
     * Function format ngày hiện tại thành dạnh dd-mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate2(date) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('-');
        }
        return date;
    }

    /**
     * Function bắt sự kiện chỉnh sửa lịch làm việc
     * @param {*} value : Thông tin lịch làm việc
     */
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentRow: value
        })
        window.$('#modal-edit-holiday').modal('show');
    }

    handleNumberDateOfYearChange = (e) => {
        const { value } = e.target;
        this.setState({
            numberDateLeaveOfYear: value
        })
    }

    updateNumberDateOfYear = async () => {
        const { holiday } = this.props;
        let { numberDateLeaveOfYear } = this.state;

        if (!numberDateLeaveOfYear) {
            numberDateLeaveOfYear = holiday.numberDateLeaveOfYear
        }
        await window.$(`#collapseNumberDateOfYear`).collapse("hide");
        this.props.updateHoliday(null, { numberDateLeaveOfYear: numberDateLeaveOfYear })
    }

    /**
     * Function chyển đổi dữ liệu kế hoạch làm việc thành dạng dữ liệu dùng export
     * @param {*} data 
     */
    convertDataToExportData = (data) => {
        const { translate } = this.props;
        data = data.map((x, index) => {
            return {
                STT: index + 1,
                type: translate(`human_resource.holiday.${x.type}`),
                startDate: new Date(x.startDate),
                endDate: new Date(x.endDate),
                description: x.description,
            }
        });
        let exportData = {
            fileName: translate('human_resource.holiday.file_name_export'),

            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: translate('human_resource.holiday.file_name_export'),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate('human_resource.stt'), width: 7 },
                                { key: 'type', value: translate('human_resource.holiday.table.type'), width: 35 },
                                { key: "startDate", value: translate('human_resource.holiday.table.start_date') },
                                { key: "endDate", value: translate('human_resource.holiday.table.end_date') },
                                { key: "description", value: translate('human_resource.holiday.table.describe_timeline'), width: 35 },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData
    };

    render() {
        const { translate, holiday } = this.props;

        let { year, importHoliday, createHoliday, currentRow, numberDateLeaveOfYear } = this.state;

        let holidays = holiday.listHoliday, numberDateLeave = holiday.numberDateLeaveOfYear;

        if (numberDateLeaveOfYear !== undefined) {
            numberDateLeave = numberDateLeaveOfYear;
        };

        let exportData = this.convertDataToExportData(holidays);
        let listNoLeave = holidays.filter(x => x.type === 'no_leave');
        let listAutoLeave = holidays.filter(x => x.type === 'auto_leave');
        let listHoliday = holidays.filter(x => x.type === 'holiday');

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Button thêm lịch làm việc */}
                        <div className="dropdown pull-right">
                            <button type="button" className="btn btn-success pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true"
                                title={translate('human_resource.holiday.add_holiday_title')} >{translate('human_resource.holiday.add_holiday')}</button>
                            <ul className="dropdown-menu pull-right" >
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.holiday.add_data_by_excel')} onClick={this.handleImport}>{translate('human_resource.holiday.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} title={translate('human_resource.holiday.add_holiday_title')} onClick={this.createHoliday}>{translate('human_resource.holiday.add_by_hand')}</a></li>
                            </ul>
                        </div>
                        <ExportExcel id="export-holiday" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 0 }} />
                    </div>

                    <div className="form-inline">
                        {/* Năm */}
                        <div className="form-group">
                            <label style={{ width: 'auto' }}>{translate('human_resource.holiday.year')}</label>
                            <DatePicker
                                id="year"
                                dateFormat="year"
                                value={year}
                                onChange={this.handleYearChange}
                            />
                        </div>

                        {/* Nút tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>


                    <div className="row row-equal-height">
                        {/* Danh sách thời gian nghỉ lễ, ghỉ tết*/}
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div id="holiday" className="description-box" style={{ paddingRight: 10 }}>
                                <h4>{translate('human_resource.holiday.list_holiday')}</h4>
                                <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 40 }}>{translate('human_resource.stt')}</th>
                                            <th>{translate('human_resource.holiday.table.timeline')}</th>
                                            <th>{translate('human_resource.holiday.table.describe_timeline')}</th>
                                            <th style={{ width: 120 }}>{translate('general.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listHoliday && listHoliday.length !== 0 &&
                                            listHoliday.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{(this.formatDate(x.startDate) === this.formatDate(x.endDate)) ? this.formatDate(x.startDate) : this.formatDate(x.startDate) + " - " + this.formatDate(x.endDate)}</td>
                                                    <td>{x.description}</td>
                                                    <td>
                                                        <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.holiday.edit_holiday')}><i className="material-icons">edit</i></a>
                                                        <DeleteNotification
                                                            content={translate('human_resource.holiday.delete_holiday')}
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
                                {
                                    holiday.isLoading ?
                                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                        (!listHoliday || listHoliday.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>


                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            {/* Danh sách thời gian không được xin nghỉ phép*/}
                            <div className="description-box " style={{ paddingRight: 10 }}>
                                <h4>{translate('human_resource.holiday.list_no_leave')}</h4>
                                <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 40 }}>{translate('human_resource.stt')}</th>
                                            <th >{translate('human_resource.holiday.table.timeline')}</th>
                                            <th>{translate('human_resource.holiday.table.describe_timeline')}</th>
                                            <th style={{ width: 100 }}>{translate('general.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listNoLeave && listNoLeave.length !== 0 &&
                                            listNoLeave.map((x, index) => (
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
                                {
                                    holiday.isLoading ?
                                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                        (!listNoLeave || listNoLeave.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>


                            {/* Danh sách thời gian được nghỉ*/}
                            <div className="box-solid description description-box" style={{ paddingRight: 10, marginTop: 25 }}>
                                <h4>{translate('human_resource.holiday.list_auto_leave')}</h4>
                                {/* Số ngày nghỉ phép trong một năm */}
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ width: 'auto' }} >{`${translate('human_resource.holiday.number_date_leave_of_year')} (${translate('human_resource.holiday.date_year')})`}&ensp;</label>
                                    <input className="form-control" style={{ width: 80, display: 'inline' }} value={numberDateLeave} onChange={this.handleNumberDateOfYearChange} type="Number" />
                                    &ensp;
                                    <button type="button" style={{ marginTop: -5 }} className="btn btn-primary" onClick={this.updateNumberDateOfYear}>{translate('human_resource.holiday.save_as')}</button>
                                </div>

                                <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 40 }}>{translate('human_resource.stt')}</th>
                                            <th >{translate('human_resource.holiday.table.timeline')}</th>
                                            <th>{translate('human_resource.holiday.table.describe_timeline')}</th>
                                            <th style={{ width: 100 }}>{translate('general.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listAutoLeave && listAutoLeave.length !== 0 &&
                                            listAutoLeave.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{(this.formatDate(x.startDate) === this.formatDate(x.endDate)) ? this.formatDate(x.startDate) : this.formatDate(x.startDate) + " - " + this.formatDate(x.endDate)}</td>
                                                    <td>{x.description}</td>
                                                    <td>
                                                        <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.holiday.edit_holiday')}><i className="material-icons">edit</i></a>
                                                        <DeleteNotification
                                                            content={translate('human_resource.holiday.delete_holiday')}
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
                                {
                                    holiday.isLoading ?
                                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                        (!listAutoLeave || listAutoLeave.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                { /* Form import lịch làm việc */
                    importHoliday && <HolidayImportForm />
                }
                { /* Form thêm lịch làm việc*/
                    createHoliday && <HolidayCreateForm />
                }
                { /* Form chỉnh sửa lịch làm việc*/
                    currentRow !== undefined &&
                    <HolidayEditForm
                        _id={currentRow._id}
                        type={currentRow.type}
                        startDate={this.formatDate2(currentRow.startDate)}
                        endDate={this.formatDate2(currentRow.endDate)}
                        description={currentRow.description}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { holiday } = state;
    return { holiday };
};

const actionCreators = {
    deleteHoliday: HolidayActions.deleteHoliday,
    getListHoliday: HolidayActions.getListHoliday,
    updateHoliday: HolidayActions.updateHoliday,
};

const listHoliday = connect(mapState, actionCreators)(withTranslate(ManageHoliday));
export { listHoliday as ManageHoliday };