import React, { Component } from 'react';
import { configTaskTempalte } from './fileConfigurationImportTaskTemplate';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile } from '../../../../common-components';
import { taskTemplateActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TaskTemplateImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configTaskTempalte,
            checkFileImport: true,
            rowError: [],
            importData: [],
            limit: 100,
            page: 0
        };
    }
    
    // Function thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    handleImportExcel = (value, checkFileImport) => {
        let values;
        //for ()
        value = value.map(x => {
            let readByEmployees, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;
            readByEmployees = x.readByEmployees.split(',');
            readByEmployees = readByEmployees.map( x => x.trim());
            responsibleEmployees = x.responsibleEmployees.split(',');
            responsibleEmployees = responsibleEmployees.map( x => x.trim());
            accountableEmployees = x.accountableEmployees.split(',');
            accountableEmployees = accountableEmployees.map( x => x.trim());
            consultedEmployees = x.consultedEmployees.split(',');
            consultedEmployees = consultedEmployees.map( x => x.trim());
            informedEmployees = x.consultedEmployees.split(',');
            informedEmployees = informedEmployees.map( x=> x.trim());
            return { 
                name: x.name, 
                description: x.description,
                organizationalUnit: x.organizationalUnit,
                readByEmployees: readByEmployees,
                priority: x.priority,
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                consultedEmployees: consultedEmployees,
                informedEmployees: informedEmployees,
                formula: x.formula,
                taskActions: [],
                taskInformations: [],
                nameTaskActions: x.nameTaskActions,
                descriptionTaskAction: x.descriptionTaskAction,
                mandatory: x.mandatory,
                nameTaskInformation: x.nameTaskInformation,
                descriptionTaskInformation: x.descriptionTaskInformation,
                type: x.type,
                filledByAccountableEmployeesOnly: x.filledByAccountableEmployeesOnly
            };
        })
        if (checkFileImport) {
            let rowError = [];
            value = value.map((x, index) => {
                let errorAlert = [];
                if (x.name === null || x.description === null || x.organizationalUnit === null || x.readByEmployees === null || x.formula === null){
                    rowError = [...rowError, index+1];
                    x = { ...x, error: true};
                }
                if (x.name === null) {
                    errorAlert = [...errorAlert, 'Tên mẫu công việc không được để trống'];
                }
                if (x.organizationalUnit === null) {
                    errorAlert = [...errorAlert, 'Tên phòng ban không được để trống'];
                }
                if (x.description === null) {
                    errorAlert = [...errorAlert, 'Tên mô tả mẫu công việc không được để trống'];
                }
                if (x.readByEmployees === null) {
                    errorAlert = [...errorAlert, 'Tên người được xem không được để trống'];
                }
                if (x.formula === null) {
                    errorAlert = [...errorAlert, 'Tên công thức tính điểm không được để trống'];
                }
                x = { ...x, errorAlert: errorAlert };
                return x;
            });
            // convert dữ liệu thành dạng array json mong muốn để gửi lên server

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

    save = () => {
        let { importData } = this.state;
        this.props.importTaskTemplate(importData);
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {
        const { translate } = this.props;
        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;
        return (
            <React.Fragment>
                <DialogModal 
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title="Thêm mẫu công việc bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <ConFigImportFile
                            id="import_taskTemplate_config"
                            configData={configData}
                            // textareaRow={8}
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
                                <a className='pull-right'
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => this.requestDownloadFile(e, `.${configData.file.fileUrl}`, configData.file.fileName)}>
                                    <i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_taskTemplate_show_data"
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
            </React.Fragment>
        )
    }

}

function mapState(state) {
    const { taskTemplate } = state;
    return { taskTemplate };
};
const actionCreators = {
    importTaskTemplate: taskTemplateActions.importTaskTemplate
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(TaskTemplateImportForm));
export { importFileExcel as TaskTemplateImportForm };