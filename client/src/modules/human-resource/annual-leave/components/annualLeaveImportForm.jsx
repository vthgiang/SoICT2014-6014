import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ImportFileExcel, ConFigImportFile, SelectBox, ShowImportData, DatePicker, ExportExcel } from '../../../../common-components';

import { configurationAnnualLeave } from './fileConfigurationImportAnnualLeave';

import { AnnualLeaveActions } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';

class AnnualLeaveImportForm extends Component {
    constructor(props) {
        super(props);
        let organizationalUnit = this.props.department.list[0];
        this.state = {
            organizationalUnit: organizationalUnit._id,
            configData: configurationAnnualLeave.configurationImport(this.props.translate),
            checkFileImport: true,
            rowError: [],
            importData: [],
            limit: 100,
            page: 0
        };
    }

    componentDidUpdate() {
        const { annualLeave } = this.props;
        annualLeave.importStatus && window.$(`#modal_import_file`).modal("hide");
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
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    }

    /**
     * Bắt sự kiện thay đổi giá trị đơn vị
     * @param {*} value : Giá trị đơn vị
     */
    handleOrganizationalUnitChange = (value) => {
        const { salary } = this.props;
        this.setState({
            organizationalUnit: value[0],
            importData: [],
            changeMonth: true,
        });
        window.$('#file-import-annual-leave').val('');
    }

    /** Function kiểm tra lỗi trước khi submit form*/
    isFormValidated = () => {
        let { rowError, importData } = this.state;
        const { annualLeave } = this.props;
        if (annualLeave.error.rowError !== undefined) {
            rowError = annualLeave.error.rowError;
            importData = annualLeave.error.data
        }
        if (rowError.length === 0 && importData.length !== 0) {
            return true
        } return false
    }

    /** Function import dữ liệu */
    save = () => {
        let { importData, organizationalUnit } = this.state;
        let data = importData;
        for (let n in data) {
            let partStart = data[n].startDate.split('-');
            let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
            let partEnd = data[n].endDate.split('-');
            let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            data[n] = { ...data[n], startDate: startDate, endDate: endDate, organizationalUnit: organizationalUnit };
        };
        this.props.importAnnualLeave(data);
    }

    /**
     * Function Thay đổi cấu hình file import
     * @param {*} value : Dữ liệu cấu hình file import
     */
    handleChangeConfig = async (value) => {
        await this.setState({
            configData: value,
            importData: [],
        })
    }

    /**
     * Function thay đổi file import
     * @param {*} value : Dữ liệu file import
     * @param {*} checkFileImport : true - file import đúng định dạng, false - file import sai định dạng
     */
    handleImportExcel = (value, checkFileImport) => {
        const { translate } = this.props;

        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            let status = x.status;
            let type = false;
            if (x.totalHours) {
                type = true;
            }
            switch (status) {
                case translate('human_resource.annual_leave.status.approved'):
                    status = 'approved';
                    break;
                case translate('human_resource.annual_leave.status.waiting_for_approval'):
                    status = 'waiting_for_approval';
                    break;
                case translate('human_resource.annual_leave.status.disapproved'):
                    status = 'disapproved';
                    break;
                default:
                    status = null;
                    break;
            };
            return { ...x, status: status, startDate: startDate, endDate: endDate, type: type };
        })

        if (checkFileImport) {
            let rowError = [];
            // Check dữ liệu import có hợp lệ hay không
            let checkImportData = value;
            value = value.map((x, index) => {
                let errorAlert = [];
                if (x.employeeNumber === null || x.employeeName === null) {
                    rowError = [...rowError, index + 1]
                    x = { ...x, error: true }
                }
                if (x.employeeNumber === null) {
                    errorAlert = [...errorAlert, translate('human_resource.salary.employee_number_required')];
                }
                if (x.employeeName === null)
                    errorAlert = [...errorAlert, translate('human_resource.salary.employee_name_required')];

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

    /**
     * Function tải file import mẫu
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file muốn tải về
     */
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {

        const { translate, annualLeave, department } = this.props;

        let { limit, page, importData, rowError, configData, checkFileImport, organizationalUnit } = this.state;

        if (annualLeave.error.rowError !== undefined) {
            rowError = annualLeave.error.rowError;
            importData = annualLeave.error.data
            importData = importData.map(x => {
                let startDate = this.formatDate(x.startDate)
                let endDate = this.formatDate(x.endDate)
                if (x.errorAlert && x.errorAlert.length !== 0) {
                    let errorAlert = x.errorAlert.map(err => translate(`human_resource.annual_leave.${err}`));
                    return { ...x, errorAlert: errorAlert, startDate: startDate, endDate: endDate }
                }
                return { ...x, startDate: startDate, endDate: endDate }
            })
        };

        importData = importData.map(x => { return { ...x, status: translate(`human_resource.annual_leave.status.${x.status}`) } })

        let exportData = configurationAnnualLeave.templateImport(translate);
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
                        {/* Form cấu file import */}
                        <ConFigImportFile
                            id="import_annual-leave_config"
                            configData={configData}
                            textareaRow={8}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            {/* Đơn vị */}
                            <div className="form-group col-md-4 col-sm-12 col-xs-12">
                                <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`import-annual-leave-unit`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={department.list.map(y => { return { value: y._id, text: y.name } })}
                                    onChange={this.handleOrganizationalUnitChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            {/* File import */}
                            <div className="form-group col-md-4 col-sm-12 col-xs-12">
                                <label>{translate('human_resource.choose_file')}</label>
                                <ImportFileExcel
                                    id={'file-import-annual-leave'}
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>

                            <div className="form-group pull-right col-md-4 col-sm-12 col-xs-12">
                                {/* Dowload file import mẫu */}
                                <ExportExcel id="download_template_annual-leave" type='link' exportData={exportData}
                                    buttonName={` ${translate('human_resource.download_file')}`} />

                            </div>
                        </div>


                        <div className="col-md-12 col-xs-12" style={{ padding: 0 }}>
                            {/* Form hiện thì dữ liệu sẽ import */}
                            <ShowImportData
                                id="import_annual_leave_show_data"
                                configData={configData}
                                importData={importData}
                                rowError={rowError}
                                scrollTableWidth={1000}
                                checkFileImport={checkFileImport}
                                limit={limit}
                                page={page}
                            />
                        </div>
                        {/* </div> */}
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { annualLeave, department } = state;
    return { annualLeave, department };
};

const actionCreators = {
    importAnnualLeave: AnnualLeaveActions.importAnnualLeave,
    downloadFile: AuthActions.downloadFile,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(AnnualLeaveImportForm));
export { importExcel as AnnualLeaveImportForm };