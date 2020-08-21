import React, {Component} from 'react';
import { DepartmentActions } from '../redux/actions';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { configDepartment, templateImportDepartment } from './fileConfigurationImportOrganizationalUnit';

class DepartmentImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configDepartment,
            checkFileImport: true,
            rowError: [],
            importData: [],
            limit: 100,
            page: 0
        };
    };

    handleChangeConfig = (value) =>{
        this.setState({
            configData: value,
            importData: [],
        })
    }

    handleImportExcel = (value, checkFileImport) => {
        console.log(value);
        for (let i = 0; i < value.length; i++) {
            let deans, viceDeans, employees;
            deans = value[i].deans.split(',');
            deans = deans.map( x => x.trim());
            value[i].deans = deans;
            viceDeans = value[i].viceDeans.split(',');
            viceDeans = viceDeans.map( x => x.trim());
            value[i].viceDeans = viceDeans;
            employees = value[i].employees.split(',');
            employees = employees.map( x => x.trim());
            value[i].employees = employees;
        }
        if (checkFileImport) {
            let rowError = [];
            let checkImportData = value;
            value = value.map((x, index) => {
                let errorAlert = [];
                if (x.name === null || x.description === null || x.deans === null || x.viceDeans === null || x.employees === null) {
                    rowError = [...rowError, index+1];
                    x = {...x, error: true}
                }
                if (x.name === null){
                    errorAlert = [...errorAlert, "Tên đơn vị không được để trống"];
                }
                if (x.description === null){
                    errorAlert = [...errorAlert, "Tên mô tả đơn vị không được để trống"];
                }
                if (x.deans === null){
                    errorAlert = [...errorAlert, "Tên các chức danh đơn vị không được để trống"];
                }
                if (x.viceDeans === null){
                    errorAlert = [...errorAlert, "Tên các chức danh phó đơn vị không được để trống"];
                }
                if (x.employees === null){
                    errorAlert = [...errorAlert, "Tên các chức dnah nhân viên đơn vị không được để trống"];
                }
                x = { ...x, errorAlert: errorAlert };
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

    save = () => {
        let { importData } = this.state;
        console.log(importData);
        this.props.importDepartment(importData);
    }

    render() {
        const { translate} = this.props;
        let { limit, page, importData, configData, checkFileImport, rowError } = this.state;
        return (
            <React.Fragment>
                <DialogModal 
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title="Thêm cơ cấu tổ chức bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <ConFigImportFile
                            id="import_organizationalUnit_config"
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
                                <ExportExcel id="download_template_organizationalUnit" type='link' exportData={templateImportDepartment}
                                    buttonName='Download file import mẫu' />
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_department_show_data"
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
    const { department } = state;
    return { department };
};
const actionCreators = {
    importDepartment : DepartmentActions.importDepartment,
}
const importFileExcel = connect(mapState, actionCreators)(withTranslate(DepartmentImportForm));
export { importFileExcel as DepartmentImportForm}