import React, { useState } from 'react';
import { DepartmentActions } from '../redux/actions';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { configDepartment, templateImportDepartment } from './fileConfigurationImportOrganizationalUnit';

function DepartmentImportForm(props) {
    const [state, setState] = useState({
        configData: configDepartment,
        checkFileImport: true,
        rowError: [],
        importData: [],
        importDataShow: [],
        limit: 100,
        page: 0
    })

    const handleChangeConfig = (value) => {
        setState({
            ...state,
            configData: value,
            importData: [],
        })
    }


    const checkOrgName = nameOrg => {
        const { department } = props;
        let flag = false;

        if (department?.list?.length) {
            const check = department.list.find(x => x.name?.trim() === nameOrg?.toString()?.trim());
            if (check)
                flag = true;
            else
                flag = false
        } else
            flag = false;
        return flag;
    }


    const handleImportExcel = (value, checkFileImport) => {
        let values = [];
        let valueShow = [];
        let k = -1;
        for (let i = 0; i < value.length; i++) {
            let managers, deputyManagers, employees;
            let x = value[i];
            if (x.name) {
                k++;
                values = [...values, {
                    "name": x.name,
                    "description": x.description,
                    "parent": x.parent,
                    "managers": [x.managers],
                    "deputyManagers": [x.deputyManagers],
                    "employees": [x.employees],
                }];
                valueShow = [...valueShow, {
                    "STT": k + 1,
                    "name": x.name,
                    "description": x.description,
                    "parent": x.parent,
                    "managers": [x.managers],
                    "deputyManagers": [x.deputyManagers],
                    "employees": [x.employees],
                }]
            } else {
                let out = {
                    "STT": "",
                    "name": "",
                    "description": "",
                    "parent": "",
                    "managers": "",
                    "deputyManagers": "",
                    "employees": "",
                };
                if (x.managers) {
                    values[k].managers = [...values[k].managers, x.managers];
                    out.managers = x.managers;
                }
                if (x.deputyManagers) {
                    values[k].deputyManagers = [...values[k].deputyManagers, x.deputyManagers];
                    out.deputyManagers = x.deputyManagers;
                }
                if (x.employees) {
                    values[k].employees = [...values[k].employees, x.employees];
                    out.employees = x.employees;
                }
                valueShow = [...valueShow, out];
            }
        }
        value = valueShow;
        if (checkFileImport) {
            let rowError = [];
            let checkImportData = value;
            value = value.map((x, index) => {
                const checkOrgUnitNameDuplicateInFileExcell = value.filter(k => k?.name?.toString().trim() === x?.name?.toString().trim());
                const checkOrgUnitNameDuplicateInSystem = x?.name ? checkOrgName(x.name) : x.name;
                let errorAlert = [];
                if (x.name === null || x.description === null || x.managers === null || x.deputyManagers === null || x.employees === null || (x.name && checkOrgUnitNameDuplicateInFileExcell?.length > 1) || (x.name && checkOrgUnitNameDuplicateInSystem)) {
                    rowError = [...rowError, index + 1];
                    x = { ...x, error: true }
                }
                if (x.name === null) {
                    errorAlert = [...errorAlert, "Tên đơn vị không được để trống"];
                }

                if (x.name && checkOrgUnitNameDuplicateInFileExcell?.length > 1) {
                    errorAlert = [...errorAlert, "Tên đơn vị trong file excell bị trùng lặp"];
                }
                if (x.name && checkOrgUnitNameDuplicateInSystem) {
                    errorAlert = [...errorAlert, "Tên đơn vị trong file excell đã tồn tại trên hệ thống"];
                }

                if (x.description === null) {
                    errorAlert = [...errorAlert, "Tên mô tả đơn vị không được để trống"];
                }
                if (x.managers === null) {
                    errorAlert = [...errorAlert, "Tên các chức danh đơn vị không được để trống"];
                }
                if (x.deputyManagers === null) {
                    errorAlert = [...errorAlert, "Tên các chức danh phó đơn vị không được để trống"];
                }
                if (x.employees === null) {
                    errorAlert = [...errorAlert, "Tên các chức dnah nhân viên đơn vị không được để trống"];
                }
                x = { ...x, errorAlert: errorAlert };
                return x;
            });
            setState({
                ...state,
                importData: values,
                importDataShow: value
                ,
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            setState({
                ...state,
                checkFileImport: checkFileImport,
            })
        }
    }

    const save = () => {
        let { importData } = state;
        console.log(importData);
        props.importDepartment(importData);
    }

    const convertExportData = (dataExport) => {
        for (let va = 0; va < dataExport.dataSheets.length; va++) {
            for (let val = 0; val < dataExport.dataSheets[va].tables.length; val++) {
                let datas = [];
                let data = dataExport.dataSheets[va].tables[val].data;
                if (data[0] && Array.isArray(data[0].managers)) {
                    for (let i = 0; i < data.length; i++) {
                        let x = data[i];
                        let managers, deputyManagers, employees;
                        let length = 0;
                        if (x.managers.length > length) {
                            length = x.managers.length;
                        }
                        if (x.deputyManagers.length > length) {
                            length = x.deputyManagers.length;
                        }
                        if (x.employees.length > length) {
                            length = x.employees.length;
                        }
                        let out = {
                            name: x.name,
                            description: x.description,
                            parent: x.parent,
                            managers: x.managers[0],
                            deputyManagers: x.deputyManagers[0],
                            employees: x.employees[0],
                        }
                        datas = [...datas, out];
                        for (let k = 1; k < length; k++) {
                            out = {
                                name: "",
                                description: "",
                                parent: "",
                                managers: x.managers[k],
                                deputyManagers: x.deputyManagers[k],
                                employees: x.employees[k],
                            }
                            datas = [...datas, out];
                        }
                    }
                    dataExport.dataSheets[va].tables[val].data = datas;
                }

            }
        }
        return dataExport;
    }

    const { translate } = props;
    let { limit, page, configData, checkFileImport, rowError, importDataShow } = state;
    let templateImportDepartment2 = convertExportData(templateImportDepartment);
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal_import_file`} isLoading={false}
                title="Thêm cơ cấu tổ chức bằng import file excel"
                func={save}
                disableSubmit={false}
                size={75}
            >
                <div className="form-group" id={`form_import_file`}>
                    <ConFigImportFile
                        id="import_organizationalUnit_config"
                        configData={configData}
                        // textareaRow={8}
                        scrollTable={false}
                        handleChangeConfig={handleChangeConfig}
                    />
                    <div className="row">
                        <div className="form-group col-md-4 col-xs-12">
                            <label>{translate('human_resource.choose_file')}</label>
                            <ImportFileExcel
                                configData={configData}
                                handleImportExcel={handleImportExcel}
                            />
                        </div>
                        <div className="form-group col-md-4 col-xs-12">
                            <label></label>
                            <ExportExcel id="download_template_organizationalUnit" type='link' exportData={templateImportDepartment2}
                                buttonName='Download file import mẫu' />
                        </div>
                        <div className="form-group col-md-12 col-xs-12">
                            <ShowImportData
                                id="import_department_show_data"
                                configData={configData}
                                importData={importDataShow}
                                rowError={rowError}
                                scrollTable={false}
                                checkFileImport={checkFileImport}
                                limit={limit}
                                page={page}
                            />
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}
function mapState(state) {
    const { department } = state;
    return { department };
};
const actionCreators = {
    importDepartment: DepartmentActions.importDepartment,
}
const importFileExcel = connect(mapState, actionCreators)(withTranslate(DepartmentImportForm));
export { importFileExcel as DepartmentImportForm }