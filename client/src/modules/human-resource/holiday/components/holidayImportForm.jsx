import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ImportFileExcel, ConFigImportFile, ShowImportData, PaginateBar, DatePicker } from '../../../../common-components';
import { configurationHoliday } from './fileConfigurationImportHoliday';
import { LOCAL_SERVER_API } from '../../../../env';

import XLSX from 'xlsx';
import { HolidayActions } from '../redux/actions';

class HolidayImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configurationHoliday,
            checkFileImport: true,
            rowError: [],
            importData: [],
            month: null,
            limit: 100,
            page: 0
        };
    }
    componentDidUpdate() {
        const { holiday } = this.props;
        holiday.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    // Function Thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    // Convert dữ liệu date trong excel thành dạng dd-mm-yyyy
    convertExcelDateToJSDate = (serial) => {
        let utc_days = Math.floor(serial - 25569);
        let utc_value = utc_days * 86400;
        let date_info = new Date(utc_value * 1000);
        let month = date_info.getMonth() + 1;
        let day = date_info.getDate();
        if (month.toString().length < 2)
            month = '0' + month;
        if (day.toString().length < 2)
            day = '0' + day;
        return [day, month, date_info.getFullYear()].join('-');
    }

    // Function thay đổi file import
    handleImportExcel = (value, checkFileImport) => {
        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return { startDate: startDate, endDate: endDate, description: x.description };
        })

        if (checkFileImport) {
            let rowError = [];
            // Check dữ liệu import có hợp lệ hay không
            value = value.map((x, index) => {
                let errorAlert = [];
                if (x.startDate === null || x.endDate === null || x.reason === null) {
                    rowError = [...rowError, index + 1]
                    x = { ...x, error: true }
                };
                if (x.startDate === null) {
                    errorAlert = [...errorAlert, 'Ngày bắt đầu không được để trống'];
                };
                if (x.endDate === null) {
                    errorAlert = [...errorAlert, 'Ngày kết thúc không được để trống'];
                };
                if (x.reason === null) {
                    errorAlert = [...errorAlert, 'Mô tả lịch nghỉ không được để trống'];
                };
                x = { ...x, errorAlert: errorAlert }
                return x;
            });
            this.setState({
                importData: value,
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }
    }


    isFormValidated = () => {
        let { rowError, importData } = this.state;
        const { holiday } = this.props;
        if (holiday.error.rowError !== undefined) {
            rowError = holiday.error.rowError;
            importData = holiday.error.data
        }
        if (rowError.length === 0 && importData.length !== 0) {
            return true
        } return false
    }

    save = () => {
        let { importData } = this.state;
        let data = importData;
        for (let n in data) {
            let partStart = data[n].startDate.split('-');
            let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
            let partEnd = data[n].endDate.split('-');
            let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            data[n] = { ...data[n], startDate: startDate, endDate: endDate };
        };
        this.props.importHoliday(data);
    }

    render() {
        const { translate, holiday } = this.props;
        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;
        if (holiday.error.rowError !== undefined) {
            rowError = holiday.error.rowError;
            importData = holiday.error.data
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title='Thêm dữ liệu bằng việc Import file excel'
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    closeOnSave={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <ConFigImportFile
                            id="import_salary_config"
                            configData={configData}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <a className='pull-right' href={LOCAL_SERVER_API + configData.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configData.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_salary_show_data"
                                    configData={configData}
                                    importData={importData}
                                    rowError={rowError}
                                    scrollTable={false}
                                    checkFileImport={checkFileImport}
                                    limit={limit}
                                    page={page}
                                />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { holiday } = state;
    return { holiday };
};

const actionCreators = {
    importHoliday: HolidayActions.importHoliday,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(HolidayImportForm));
export { importExcel as HolidayImportForm };