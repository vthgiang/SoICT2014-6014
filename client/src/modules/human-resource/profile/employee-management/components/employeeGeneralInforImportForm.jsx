import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ShowImportData, ImportFileExcel, ConFigImportFile } from '../../../../../common-components';

import { configurationEmployeeInfo } from './fileConfigurationImportEmployee';
import { LOCAL_SERVER_API } from '../../../../../env';

class EmployeeGeneralInforImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 1,
            page: 0
        };
    }

    // Function Thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
        })
    }

    // Function thay đổi file import
    handleImportExcel = (value) => {
        console.log(value);
        let rowError = [];

        // // Check dữ liệu import có hợp lệ hay không
        // let checkImportData = value;
        // value = value.map((x, index) => {
        //     let errorAlert = [];
        //     if (x.employeeNumber === null || x.employeeName === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1) {
        //         rowError = [...rowError, index + 1]
        //         x = { ...x, error: true }
        //     }
        //     if (x.employeeNumber === null) {
        //         errorAlert = [...errorAlert, 'Mã nhân viên không được để trống'];
        //     } else {
        //         if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
        //             errorAlert = [...errorAlert, 'Mã nhân viên bị trùng lặp'];
        //     };
        //     if (x.employeeName === null)
        //         errorAlert = [...errorAlert, 'Tên nhân viên không được để trống'];

        //     x = { ...x, errorAlert: errorAlert }
        //     return x;
        // });
        this.setState({
            importData: value,
            rowError: rowError,
        })
    }

    render() {
        const { id } = this.props;

        const { limit, page, importData, rowError, configData } = this.state;

        let configuration = configData ? configData : configurationEmployeeInfo;

        return (
            <React.Fragment>
                <div id={id} className="tab-pane active">
                    <div className="box-body">
                        <ConFigImportFile
                            id="import_employees_infor_config"
                            configData={configuration}
                            scrollTableWidth={4500}
                            textareaRow={15}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configuration}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12 pull-right">
                                <label></label>
                                <a className='pull-right' href={LOCAL_SERVER_API + configuration.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configuration.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_employee_infor_show_data"
                                    configData={configuration}
                                    importData={importData}
                                    rowError={rowError}
                                    scrollTableWidth={1000}
                                    limit={limit}
                                    page={page}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
const importExcel = connect(null, null)(withTranslate(EmployeeGeneralInforImportForm));
export { importExcel as EmployeeGeneralInforImportForm };