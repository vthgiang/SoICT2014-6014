import React, { Component } from 'react';
import { configTaskTempalte } from './fileConfigurationImportTaskTemplate';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile } from '../../../../common-components';
import { taskTemplateActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../auth/redux/actions';

class TaskTemplateImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configTaskTempalte,
            checkFileImport: true,
            rowError: [],
            importData: [],
            importShowData: [],
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
        let values = [];
        let valueShow = [];
        let k = -1;
        for ( let i = 0; i < value.length; i++){
            let x = value[i];
            if (x.name) {
                let readByEmployees, responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;
                k = k + 1;
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
                values = [...values, {
                    "name": x.name, 
                    "description": x.description,
                    "organizationalUnit": x.organizationalUnit,
                    "readByEmployees": readByEmployees,
                    "priority": x.priority,
                    "responsibleEmployees": responsibleEmployees,
                    "accountableEmployees": accountableEmployees,
                    "consultedEmployees": consultedEmployees,
                    "informedEmployees": informedEmployees,
                    "formula": x.formula,
                    "taskActions": [x.taskActions],
                    "taskInformations": [x.taskInformations],
                    "filledByAccountableEmployeesOnly": x.filledByAccountableEmployeesOnly }];
                valueShow = [...valueShow, {
                    "name": x.name, 
                    "description": x.description,
                    "organizationalUnit": x.organizationalUnit,
                    "readByEmployees": readByEmployees,
                    "priority": x.priority,
                    "responsibleEmployees": responsibleEmployees,
                    "accountableEmployees": accountableEmployees,
                    "consultedEmployees": consultedEmployees,
                    "informedEmployees": informedEmployees,
                    "formula": x.formula,
                    "taskActions": [x.taskActions],
                    "taskInformations": [x.taskInformations],
                    "filledByAccountableEmployeesOnly": x.filledByAccountableEmployeesOnly }];
            } else {
                if (k >= 0) {
                    if (x.taskActions) {
                        values[k].taskActions = [...values[k].taskActions, x.taskActions];
                        valueShow[k].taskActions = [...valueShow[k].taskActions, x.taskActions];
                    }
                    if (x.taskInformations) {
                        valueShow[k].taskInformations = [...valueShow[k].taskInformations, x.taskInformations];
                        values[k].taskInformations = [...values[k].taskInformations, x.taskInformations];
                    }
                }
            }
        }

        for (let i = 0; i < values.length; i++) {
            let taskActions = [[],[],[]], taskInformations = [[],[],[],[]];
            for (let j = 0; j < values[i].taskActions.length; j++) {
                let k = values[i].taskActions[j][0];
                taskActions[0] = [...taskActions[0], k];
                k = values[i].taskActions[j][1];
                taskActions[1] = [...taskActions[1], k];
                k = values[i].taskActions[j][2]
                taskActions[2] = [...taskActions[2], k];
            }
            values[i].taskActions = taskActions;
            for (let j = 0; j < values[i].taskInformations.length; j++) {
                let k;
                k = values[i].taskInformations[j][0];
                taskInformations[0] = [...taskInformations[0], k];
                k = values[i].taskInformations[j][1]
                taskInformations[1] = [...taskInformations[1], k];
                k = values[i].taskInformations[j][2]
                taskInformations[2] = [...taskInformations[2], k];
                k = values[i].taskInformations[j][3]
                taskInformations[3] = [...taskInformations[3], k];
            }
            values[i].taskInformations = taskInformations;
        }
        value = values;
        
        if (checkFileImport) {
            let rowError = [];
            for ( let i = 0; i < value.length; i++){
                let x = value[i];
                let errorAlert = [];
                if (x.name === null || x.description === null || x.organizationalUnit === null || x.readByEmployees === null || x.formula === null){
                    rowError = [...rowError, i+1];
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
                value[i] = x;
            };
            // convert dữ liệu thành dạng array json mong muốn để gửi lên server

            this.setState({
                importData: value,
                importShowData: valueShow,
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
        let { importShowData } = this.state;
        this.props.importTaskTemplate(importShowData);
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
    importTaskTemplate: taskTemplateActions.importTaskTemplate,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(TaskTemplateImportForm));
export { importFileExcel as TaskTemplateImportForm };