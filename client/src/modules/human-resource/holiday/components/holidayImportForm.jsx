import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ImportFileExcel, ConFigImportFile, ShowImportData, ExportExcel } from '../../../../common-components';

import { configurationHoliday } from './fileConfigurationImportHoliday';

import { HolidayActions } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';


class HolidayImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configurationHoliday.configurationImport(this.props.translate),
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

    /**
     * Function Thay đổi cấu hình file import
     * @param {*} value : Dữ liệu cấu hình file import
     */
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    /**
     * Convert dữ liệu date trong excel thành dạng dd-mm-yyyy
     * @param {*} serial : seri ngày cần format
     */
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

    /**
     * Function thay đổi file import
     * @param {*} value : Dữ liệu import
     * @param {*} checkFileImport : true file import hợp lệ, false file import không hợp lệ
     */
    handleImportExcel = (value, checkFileImport) => {
        const { translate } = this.props;
        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            let type = x.type;
            switch (type) {
                case translate('human_resource.holiday.holiday'):
                    type = 'holiday';
                    break;
                case translate('human_resource.holiday.auto_leave'):
                    type = 'auto_leave';
                    break;
                case translate('human_resource.holiday.no_leave'):
                    type = 'no_leave';
                    break;
                default:
                    type = null;
                    break;
            };
            return { type: type, startDate: startDate, endDate: endDate, description: x.description };
        })

        if (checkFileImport) {
            let rowError = [];
            value = value.map((x, index) => {
                let errorAlert = [];
                if (x.startDate === null || x.endDate === null || x.reason === null, x.type === null) {
                    rowError = [...rowError, index + 1]
                    x = { ...x, error: true }
                };
                if (x.type === null) {
                    errorAlert = [...errorAlert, translate('human_resource.holiday.type_required')];
                };
                if (x.startDate === null) {
                    errorAlert = [...errorAlert, translate('human_resource.holiday.start_date_required')];
                };
                if (x.endDate === null) {
                    errorAlert = [...errorAlert, translate('human_resource.holiday.end_date_required')];
                };
                if (x.reason === null) {
                    errorAlert = [...errorAlert, translate('human_resource.holiday.reason_required')];
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

    /** Function kiểm tra lỗi của các dữ liệu nhập vào để undisable submit form */
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

    /** function import dữ liệu */
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

    /**
     * Function dowload file import mẫu
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file dùng đê lưu
     */
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {
        const { translate, holiday } = this.props;

        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;

        if (holiday.error.rowError !== undefined) {
            rowError = holiday.error.rowError;
            importData = holiday.error.data
        }

        let exportData = configurationHoliday.templateImport(translate);

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title={translate('human_resource.add_data_by_excel')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    closeOnSave={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        {/* Cấu hình file import */}
                        <ConFigImportFile
                            id="import_salary_config"
                            configData={configData}
                            textareaRow={8}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="qlcv">
                            <div className="form-inline">
                                {/* Chọn file import */}
                                <div className="form-group">
                                    <ImportFileExcel
                                        configData={configData}
                                        handleImportExcel={this.handleImportExcel}
                                    />
                                </div>
                            </div>

                            {/* Dowload file import mẫu */}
                            <ExportExcel id="download_template_salary" type='link' exportData={exportData}
                                buttonName={` ${translate('human_resource.download_file')}`} />

                            {/* Hiện thị dữ liệu import */}
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
    downloadFile: AuthActions.downloadFile,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(HolidayImportForm));
export { importExcel as HolidayImportForm };