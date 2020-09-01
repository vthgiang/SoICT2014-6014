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
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate('human_resource.stt') },
                                { key: 'type', value: translate('human_resource.holiday.table.type') },
                                { key: "startDate", value: translate('human_resource.holiday.table.start_date') },
                                { key: "endDate", value: translate('human_resource.holiday.table.end_date') },
                                { key: "description", value: translate('human_resource.holiday.table.describe_timeline'), },
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
        const { translate, holiday } = this.props;

        let { importHoliday, createHoliday, currentRow } = this.state;

        let listHoliday = [];
        if (holiday.listHoliday && holiday.listHoliday.length !== 0) {
            listHoliday = holiday.listHoliday;
        }
        let exportData = this.convertDataToExportData(listHoliday);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    {/* Button thêm lịch làm việc */}
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true"
                            title={translate('human_resource.holiday.add_holiday_title')} >{translate('human_resource.holiday.add_holiday')}</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }} >
                            <li><a title={translate('human_resource.holiday.add_data_by_excel')} onClick={this.handleImport}>{translate('human_resource.holiday.add_import')}</a></li>
                            <li><a title={translate('human_resource.holiday.add_holiday_title')} onClick={this.createHoliday}>{translate('human_resource.holiday.add_by_hand')}</a></li>
                        </ul>
                    </div>

                    <ExportExcel id="export-holiday" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15 }} />
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>{translate('human_resource.stt')}</th>
                                <th style={{ width: "30%" }}>{translate('human_resource.holiday.table.timeline')}</th>
                                <th style={{ width: "55%" }}>{translate('human_resource.holiday.table.describe_timeline')}</th>
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
                            (!listHoliday || listHoliday.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
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