import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ImportFileExcel, ConFigImportFile, SelectBox, ShowImportData, DatePicker, ExportExcel } from '../../../../common-components';

import { configurationSalary } from './fileConfigurationImportSalary';

import { SalaryActions } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';

const SalaryImportForm = (props) => {

    const { translate, salary, department } = props;
    let _organizationalUnit = department.list[0];

    const [state, setState] = useState({
        organizationalUnit: _organizationalUnit._id,
        configData: configurationSalary.configurationImport(props.translate),
        checkFileImport: true,
        rowError: [],
        importData: [],
        month: null,
        limit: 100,
        page: 0
    });

    // useEffect(() => {
    //     const { salary } = props;
    //     salary.importStatus && window.$(`#modal_import_file`).modal("hide");
    // })

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
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
    const handleOrganizationalUnitChange = (value) => {
        const { salary } = props;
        setState(state => ({
            ...state,
            organizationalUnit: value[0],
            importData: [],
            changeMonth: true
        }))
        window.$('#file-import-salary').val('');
    }

    /**
     * Bắt sự kiện thay đổi tháng lương
     * @param {*} value : Giá trị tháng lương
     */
    const handleMonthChange = (value) => {
        if (value) {
            const { salary, translate } = props;
            const { configData } = state;

            let partMonth = value.split('-'), rowError = [], importData = [];
            value = [partMonth[1], partMonth[0]].join('-');
            if (salary.error.rowError) {
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
                    if (x.errorAlert.find(y => y === translate('human_resource.salary.month_salary_have_exist'))) {
                        x.errorAlert = x.errorAlert.filter(y => y !== translate('human_resource.salary.month_salary_have_exist'));
                        x.error = false;
                        rowError = rowError.filter(y => y !== index + 1);
                    }
                    return x;
                })

                setState(state => ({
                    ...state,
                    importData: importData,
                    rowError: rowError,
                    changeMonth: true
                }));
            }
            setState(state => ({
                ...state,
                month: value,
                changeMonth: true,
            }));
        } else {
            setState(state => ({
                ...state,
                importData: [],
                rowError: [],
                month: value,
                changeMonth: true
            }))
        }
    }

    const { importSalary, downloadFile } = props;

    /** Function kiểm tra lỗi trước khi submit form*/
    const isFormValidated = () => {
        const { salary } = props;
        let { rowError, month, importData, changeMonth } = state;

        if (salary.error.rowError && changeMonth === false) {
            rowError = salary.error.rowError;
            importData = salary.error.data
        }
        if (rowError.length === 0 && month !== null && importData.length !== 0) {
            return true
        } return false
    }

    /** Function import dữ liệu */
    const save = () => {
        let { importData, month, configData } = state;

        let bonusName = configData.bonus.value;
        importData = importData.map(x => {
            let bonus = [];
            x.bonus.forEach((y, index) => {
                if (y) {
                    bonus = [...bonus, { nameBonus: bonusName[index], number: y }]
                }
            })
            return { ...x, month: month, organizationalUnit: x?.organizationalUnitId, bonus: bonus }
        });
        console.log('importData', importData)
        importSalary(importData);
        setState(state => ({
            ...state,
            changeMonth: false
        }))
    }

    /**
     * Function Thay đổi cấu hình file import
     * @param {*} value : Dữ liệu cấu hình file import
     */
    const handleChangeConfig = async (value) => {
        await setState(state => ({
            ...state,
            configData: value,
            importData: []
        }));
    }

    const checkUserOfUnits = (unitName) => {
        if (unitName && department?.list?.length) {
            const unitLength = department.list.length;
            let unitId;
            for (let i = 0; i < unitLength; i++) {
                if (typeof unitName === 'string' && unitName?.trim().toLowerCase() === department.list[i]?.name?.trim()?.toLowerCase()) {
                    unitId = department.list[i]._id;
                    break;
                }
            }
            if (unitId) {
                return unitId;
            } else
                return unitName;
        } else {
            return unitName
        }
    }


    /**
     * Function thay đổi file import
     * @param {*} value : Dữ liệu file import
     * @param {*} checkFileImport : true - file import đúng định dạng, false - file import sai định dạng
     */
    const handleImportExcel = (value, checkFileImport) => {
        const { translate } = props;
        if (checkFileImport) {
            let rowError = [];
            // Check dữ liệu import có hợp lệ hay không
            let checkImportData = value;
            value = value.map((x, index) => {
                let errorAlert = [];
                const organizationalUnitId = x?.orgUnit ? checkUserOfUnits(x.orgUnit) : x?.orgUnit;
                if (x.employeeNumber === null || x.employeeName === null || x.orgUnit === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1) {
                    rowError = [...rowError, index + 1]
                    x = { ...x, error: true }
                }
                if (x.employeeNumber === null) {
                    errorAlert = [...errorAlert, translate('human_resource.salary.employee_number_required')];
                } else {
                    if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                        errorAlert = [...errorAlert, translate('human_resource.salary.employee_code_duplicated')];
                };
                if (x.employeeName === null)
                    errorAlert = [...errorAlert, translate('human_resource.salary.employee_name_required')];

                if (x.orgUnit === null)
                    errorAlert = [...errorAlert, "Đơn vị không được để trống"];

                x = { ...x, organizationalUnitId, errorAlert: errorAlert }
                return x;
            });
            setState(state => ({
                ...state,
                importData: value,
                rowError: rowError,
                checkFileImport: checkFileImport
            }));
        } else {
            setState(state => ({
                ...state,
                checkFileImport: checkFileImport
            }));
        }
    }

    let { limit, page, importData, rowError, configData, changeMonth, month, checkFileImport, organizationalUnit } = state;
    if (salary.error.rowError && changeMonth === false) {
        rowError = salary.error.rowError;
        importData = salary.error.data;
        importData = importData.map(x => {
            let bonus = [];
            x?.bonus && x.bonus.forEach(k => {
                bonus = [...bonus, k.number]
            })
            if (x.errorAlert && x.errorAlert.length !== 0) {
                let errorAlert = x.errorAlert.map(err => translate(`human_resource.salary.${err}`));
                return { ...x, bonus, errorAlert: errorAlert }
            }
            return { ...x, bonus }
        })
    }

    let exportData = configurationSalary.templateImport(translate, department?.list);
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal_import_file`} isLoading={false}
                formID={`form_import_file`}
                title={translate('human_resource.add_data_by_excel')}
                func={save}
                disableSubmit={!isFormValidated()}
                closeOnSave={false}
                size={75}
            >
                <form className="form-group" id={`form_import_file`}>
                    {/* Form cấu file import */}
                    <ConFigImportFile
                        id="import_salary_config"
                        configData={configData}
                        textareaRow={8}
                        scrollTable={false}
                        handleChangeConfig={handleChangeConfig}
                    />
                    <div className="row">
                        {/* Đơn vị */}
                        {/* <div className="form-group col-md-4 col-sm-12 col-xs-12">
                            <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`import-salary-unit`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={department.list.map(y => { return { value: y._id, text: y.name } })}
                                onChange={handleOrganizationalUnitChange}
                            />
                        </div> */}
                        {/* Tháng */}
                        <div className="form-group col-md-4 col-sm-12 col-xs-12">
                            <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                            <DatePicker
                                id="import-salary-month"
                                dateFormat="month-year"
                                deleteValue={false}
                                value=""
                                onChange={handleMonthChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        {/* File import */}
                        <div className="form-group col-md-4 col-sm-12 col-xs-12">
                            <label>{translate('human_resource.choose_file')}</label>
                            <ImportFileExcel
                                id={'file-import-salary'}
                                configData={configData}
                                handleImportExcel={handleImportExcel}
                                disabled={!month ? true : false}
                            />
                        </div>

                        <div className="form-group pull-right col-md-4 col-sm-12 col-xs-12">
                            {/* Dowload file import mẫu */}
                            <ExportExcel id="download_template_salary" type='link' exportData={exportData}
                                buttonName={` ${translate('human_resource.download_file')}`} />

                        </div>
                    </div>


                    <div className="col-md-12 col-xs-12" style={{ padding: 0 }}>
                        {/* Form hiện thì dữ liệu sẽ import */}
                        <ShowImportData
                            id="import_salary_show_data"
                            configData={configData}
                            importData={importData}
                            rowError={rowError}
                            checkFileImport={checkFileImport}
                            limit={limit}
                            page={page}
                            scrollTableWidth={2500}
                        />
                    </div>
                    {/* </div> */}
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const actionCreators = {
    importSalary: SalaryActions.importSalary,
    downloadFile: AuthActions.downloadFile,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(SalaryImportForm));
export { importExcel as SalaryImportForm };