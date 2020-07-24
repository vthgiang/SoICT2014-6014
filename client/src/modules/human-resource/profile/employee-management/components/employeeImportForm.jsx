import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ImportFileExcel, SlimScroll, PaginateBar, DatePicker } from '../../../../../common-components';
import { configurationEmployeeInfo } from './fileConfigurationImportEmployee';
import { LOCAL_SERVER_API } from '../../../../../env';

import XLSX from 'xlsx';

class EmployeeImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // rowError: [],
            // importData: [],
            // month: null,
            // configData: this.convertConfigurationToString(configurationSalary),
            // importConfiguration: configurationSalary,
            // limit: 100,
            // page: 0
        };
    }
    handleImportExcel = (value) => {
        let importData = [], rowError = [];
        value.forEach(row => {
            for (let index in row) {
                if (index === 'bonus') {
                    let bonus = [];
                    row[index].forEach((y, n) => {
                        if (y !== null) {
                            bonus = [...bonus, { nameBonus: configurationEmployeeInfo.bonus[n], number: Number(y) }];
                        }
                    })
                    row[index] = bonus;
                }
            }

        })

        // TODO 
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
        })
        console.log(value);
    }
    render() {
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title='Thêm dữ liệu bằng việc Import file excel'
                    func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    closeOnSave={false}
                    size={75}
                    disableSubmit={false}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <div>

                        </div>
                        <ImportFileExcel
                            id="import_employees_info"
                            configData={configurationEmployeeInfo}
                            handleImportExcel={this.handleImportExcel}
                        />

                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }
}
const importExcel = connect(null, null)(withTranslate(EmployeeImportForm));
export { importExcel as EmployeeImportForm };