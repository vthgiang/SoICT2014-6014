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

    // Bắt xự kiện chọn file import
    handleChangeFileImport = (e) => {
        const { importConfiguration } = this.state;
        let configData = importConfiguration !== null ? importConfiguration : configurationHoliday;
        let sheets = configData.sheets;
        let file = e.target.files[0];

        if (file !== undefined) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (evt) => {
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, { type: 'binary' });
                // Lấy danh sách các sheet của file import
                let sheet_name_list = workbook.SheetNames;

                // Kiểm tra lọc lấy các sheet tồn tại mà người dùng muốn import
                for (let n in sheets) {
                    sheet_lists = sheet_lists.concat(sheet_name_list.filter(x => x.trim().toLowerCase() === sheets[n].trim().toLowerCase()));
                }

                let importData = [], rowError = [];
                sheet_lists.length !== 0 && sheet_lists.forEach(x => {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[x], { header: 1, blankrows: false, defval: null });
                    let indexStartDate, indexEndDate, indexDescription;

                    // Lấy index của các tiều đề cột mà người dùng muốn import
                    for (let i = 0; i < Number(configData.rowHeader); i++) {
                        data[i].forEach((x, index) => {
                            if (x !== null) {
                                if (x.trim().toLowerCase() === configData.startDate.trim().toLowerCase())
                                    indexStartDate = index;
                                if (x.trim().toLowerCase() === configData.endDate.trim().toLowerCase())
                                    indexEndDate = index;
                                if (x.trim().toLowerCase() === configData.description.trim().toLowerCase()) {
                                    indexDescription = index;
                                }
                            }
                        })
                    }

                    // Convert dữ liệu thành dạng array json mong muốn để gửi lên server
                    data.splice(0, Number(configData.rowHeader));
                    let dataConvert = [];
                    data.forEach(x => {
                        if (x[indexStartDate] !== null) {
                            let startDate = typeof (x[indexStartDate]) === 'String' ? x[indexStartDate] : this.convertExcelDateToJSDate(x[indexStartDate]);
                            let endDate = typeof (x[indexEndDate]) === 'String' ? x[indexEndDate] : this.convertExcelDateToJSDate(x[indexEndDate]);
                            let reason = x[indexDescription];
                            dataConvert = [...dataConvert, { startDate, endDate, reason }]
                        }
                    })
                    importData = importData.concat(dataConvert);
                })

                // Check dữ liệu import có hợp lệ hay không
                importData = importData.map((x, index) => {
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
                })

                this.setState({
                    importData: importData,
                    rowError: rowError
                })
            };
        }
    }

    // Function thay đổi file import
    handleImportExcel = (value, checkFileImport) => {
        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return { startDate: startDate, endDate: endDate, description: x.description };
        })

        console.log(value);
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