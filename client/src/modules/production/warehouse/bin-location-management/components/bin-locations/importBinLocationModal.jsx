import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BinLocationActions } from '../../redux/actions';
import { configBinLocation, importBinLocationTemplate } from './fileConfigurationImportBinLocation';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../../common-components';

function ImportBinLocationModal(props) {
    const [state, setState] = useState({

        configData: configBinLocation,
        limit: 100,
        page: 0
    })

    const { translate } = props;
    const { configData, importData, rowError, checkFileImport, limit, page } = state;
    const save = () => {
        const { importShowData } = state;
        props.importBinLocation(importShowData);
    }

    const handleChangeConfig = (value) => {
        setState({
            ...state,
            configData: value,
            importData: [],
        })
    }

    const convertDataExport = (dataExport) => {
        for (let i = 0; i < dataExport.dataSheets.length; i++) {
            for (let j = 0; j < dataExport.dataSheets[i].tables.length; j++) {
                let datas = [];
                let data = dataExport.dataSheets[i].tables[j].data;

                for (let index = 0; index < data.length; index++) {
                    let dataTemporary = data[index];
                    let out = {
                        STT: dataTemporary.code ? index + 1 : null,
                        code: dataTemporary.code,
                        name: dataTemporary.name,
                        department: dataTemporary.department,
                        status: dataTemporary.status,
                        capacity: dataTemporary.capacity,
                        stock: dataTemporary.stock,
                        parent: dataTemporary.parent,
                        unit: dataTemporary.unit,
                        users: dataTemporary.users,
                        description: dataTemporary.description,
                    }
                    datas = [...datas, out];
                }
                dataExport.dataSheets[i].tables[j].data = datas;
            }
        }

        return dataExport;
    }

    const checkBinLocationCode = (code, list) => {
        let checkCode;
        if (list?.length) {
            checkCode = list.filter(o => o?.code === code?.toString()?.trim())
        }
        if (checkCode?.length)
            return -1;
    }


    const handleImportExcel = (value, checkFileImport) => {
        const { list } = props;
        let values = [], valueShow = [], index = -1;

        for (let i = 0; i < value.length; i++) {
            const valueTemporary = value[i];
            if (valueTemporary.name) {
                index = index + 1;
                values = [...values, {
                    "STT": index + 1,
                    "code": valueTemporary.code,
                    "name": valueTemporary.name,
                    "department": valueTemporary.department,
                    "status": valueTemporary.status,
                    "capacity": valueTemporary.capacity,
                    "stock": valueTemporary.stock,
                    "parent": valueTemporary.parent,
                    "unit": valueTemporary.unit,
                    "users": valueTemporary.users,
                    "description": valueTemporary.description,
                }];
                valueShow = [...valueShow, {
                    "code": valueTemporary.code,
                    "name": valueTemporary.name,
                    "department": valueTemporary.department,
                    "status": valueTemporary.status,
                    "capacity": valueTemporary.capacity,
                    "stock": valueTemporary.stock,
                    "parent": valueTemporary.parent,
                    "unit": valueTemporary.unit,
                    "users": valueTemporary.users,
                    "description": valueTemporary.description,
                }];
            } else {
                if (index >= 0) {
                    let out = {
                        "STT": "",
                        "code": "",
                        "name": "",
                        "department": "",
                        "status": "",
                        "capacity": "",
                        "stock": "",
                        "parent": "",
                        "unit": "",
                        "users": "",
                        "description": "",
                    }
                    values = [...values, out];
                }
            }
        }
        value = values;

        if (checkFileImport) {
            let rowError = [];
            for (let i = 0; i < value.length; i++) {
                let x = value[i], errorAlert = [];
                const checkCode = value.filter(obj => obj?.code?.toString()?.trim() === value[i]?.code?.toString()?.trim());
                if (x.name === null || x.code === null || (value[i]?.code && checkCode?.length > 1) || checkBinLocationCode(x.code, list) === -1) {
                    rowError = [...rowError, i + 1];
                    x = { ...x, error: true };
                }
                if (x.code === null) {
                    errorAlert = [...errorAlert, 'Mã vị trí lưu trữ không được để trống'];
                }
                if (x.name === null) {
                    errorAlert = [...errorAlert, 'Tên vị trí lưu trữ không được để trống'];
                }
                if (value[i]?.code && checkCode?.length > 1) {
                    errorAlert = [...errorAlert, 'Mã vị trí lưu trữ trong file trùng lặp'];
                }
                if (checkBinLocationCode(x.code, list) === -1) {
                    errorAlert = [...errorAlert, 'Mã vị trí lưu trữ đã tồn tại trên hệ thống'];
                }

                x = { ...x, errorAlert: errorAlert };
                value[i] = x;
            };

            setState({
                ...state,
                importData: value, // show ra :))
                importShowData: valueShow, // Luuw db
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

    let importDataTemplate = convertDataExport(importBinLocationTemplate);
    return (
        <React.Fragment>
            <DialogModal
                modalID={`import_bin_location`} isLoading={false}
                formID={`form_import_bin_location`}
                title="Thêm vị trí lưu trữ bằng import file excel"
                func={save}
                disableSubmit={false}
                size={75}
            >
                <form className="form-group" id={`form_import_bin_location`}>
                    <ConFigImportFile
                        id="import_bin_location_config"
                        configData={configData}
                        scrollTable={false}
                        handleChangeConfig={handleChangeConfig}
                    />
                    <div className="row">
                        <div className="form-group col-md-6 col-xs-6">
                            <label>{translate('human_resource.choose_file')}</label>
                            <ImportFileExcel
                                configData={configData}
                                handleImportExcel={handleImportExcel}
                            />
                        </div>
                        <div className="form-group col-md-6 col-xs-6">
                            <label></label>
                            <ExportExcel id="download_bin_location_file" type='link' exportData={importDataTemplate}
                                buttonName='Download file import mẫu' />
                        </div>
                        <div className="form-group col-md-12 col-xs-12">
                            <ShowImportData
                                id="import_bin_location_show_data"
                                configData={configData}
                                importData={importData}
                                rowError={rowError}
                                scrollTable={true}
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

function mapState(state) {
    const { BinLocation } = state;
    return { BinLocation };
};
const actions = {
    importBinLocation: BinLocationActions.importBinLocation,
};

export default connect(mapState, actions)(withTranslate(ImportBinLocationModal))
