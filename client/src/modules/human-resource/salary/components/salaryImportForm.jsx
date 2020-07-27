import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ImportFileExcel, ConFigImportFile, ShowImportData, DatePicker } from '../../../../common-components';
import { configurationSalary } from './fileConfigurationImportSalary';
import { LOCAL_SERVER_API } from '../../../../env';

import { SalaryActions } from '../redux/actions';

class SalaryImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configurationSalary,
            rowError: [],
            importData: [],
            month: null,
            limit: 100,
            page: 0
        };
    }
    componentDidUpdate() {
        const { salary } = this.props;
        salary.importStatus && window.$(`#modal_import_file`).modal("hide");
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
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

    // Bắt sự kiện thay đổi tháng lương
    handleMonthChange = (value) => {
        const { salary } = this.props;
        const { configData } = this.state;
        let partMonth = value.split('-'), rowError = [], importData = [];
        value = [partMonth[1], partMonth[0]].join('-');
        if (salary.error.rowError !== undefined) {
            rowError = salary.error.rowError;
            importData = salary.error.data;
            importData = importData.map(x => {
                let bonusName = configData.bonus.value;
                let bonus = bonusName.map(b => null);
                bonusName.forEach((y, key) => {
                    if (x.nameBonus === y) {
                        bonus[key] = x.number;
                    }
                })
                return { ...x, bonus: bonus }
            })

            importData = importData.map((x, index) => {
                if (x.errorAlert.find(y => y === "month_salary_have_exist") !== undefined) {
                    x.errorAlert = x.errorAlert.filter(y => y !== "month_salary_have_exist");
                    x.error = false;
                    rowError = rowError.filter(y => y !== index + 1);
                }
                return x;
            })
            this.setState({
                ...this.state,
                importData: importData,
                rowError: rowError,
                changeMonth: true,
            })
        }
        this.setState({
            ...this.state,
            month: value,
            changeMonth: true,
        });
    }

    isFormValidated = () => {
        const { salary } = this.props;
        let { rowError, month, importData, changeMonth } = this.state;
        if (salary.error.rowError !== undefined && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
        }
        if (rowError.length === 0 && month !== null && importData.length !== 0) {
            return true
        } return false
    }

    save = () => {
        let { importData, month, configData } = this.state;
        let bonusName = configData.bonus.value;
        importData = importData.map(x => {
            let bonus = [];
            x.bonus.forEach((y, index) => {
                if (y) {
                    bonus = [...bonus, { nameBonus: bonusName[index], number: y }]
                }
            })
            return { ...x, month: month, bonus: bonus }
        });
        console.log(importData)
        this.props.importSalary(importData);
        this.setState({
            changeMonth: false
        })
    }

    // Function Thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    // Function thay đổi file import
    handleImportExcel = (value) => {
        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        let checkImportData = value;
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.employeeName === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, 'Mã nhân viên không được để trống'];
            } else {
                if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                    errorAlert = [...errorAlert, 'Mã nhân viên bị trùng lặp'];
            };
            if (x.employeeName === null)
                errorAlert = [...errorAlert, 'Tên nhân viên không được để trống'];

            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importData: value,
            rowError: rowError,
        })
    }
    render() {
        // let formater = new Intl.NumberFormat();
        const { translate, salary } = this.props;
        let { limit, page, importData, rowError, configData, changeMonth, month } = this.state;
        if (salary.error.rowError !== undefined && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
            importData = importData.map(x => {
                let bonusName = configData.bonus.value;
                let bonus = bonusName.map(b => null);
                bonusName.forEach((y, key) => {
                    if (x.nameBonus === y) {
                        bonus[key] = x.number;
                    }
                })
                return { ...x, bonus: bonus }
            })
        }
        console.log(importData);
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
                            id="import_employees_config"
                            configData={configData}
                            scrollTableWidth={850}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <label>Tháng</label>
                                <DatePicker
                                    id="import-salary-month"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value=""
                                    onChange={this.handleMonthChange}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                    disabled={!month ? true : false}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <a className='pull-right' href={LOCAL_SERVER_API + configData.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configData.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_employee_show_data"
                                    configData={configData}
                                    importData={importData}
                                    rowError={rowError}
                                    scrollTableWidth={1000}
                                    limit={limit}
                                    page={page}
                                />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { salary } = state;
    return { salary };
};

const actionCreators = {
    importSalary: SalaryActions.importSalary,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(SalaryImportForm));
export { importExcel as SalaryImportForm };