import React, { Component, useState } from 'react';
import { configCategory, exportCategory } from './fileConfigDocumentCategory'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../../auth/redux/actions';
import { DocumentActions } from '../../../redux/actions'

function CategoryImportForm(props) {
    const [state, setState] = useState({
        configData: configCategory,
        checkFileImport: true,
        rowError: [],
        importData: [],
        importShowData: [],
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

    const handleImportExcel = (value, checkFileImport) => {
        let values = [];
        let showValues = [];
        let k = 0;
        for (let i in value) {
            let x = value[i];

            if (x.name) {
                k++
                values = [...values, {
                    "STT": k,
                    "name": x.name,
                    "description": x.description,

                }];
                showValues = [...showValues, {
                    "STT": k,
                    "name": x.name,
                    "description": x.description,

                }];
                //  k++;
            }
        }
        value = values;
        if (checkFileImport) {
            let rowError = [];
            for (let i in value) {
                let x = value[i];
                let errorAlert = [];
                if (x.name === null) {
                    rowError = [...rowError, i + 1];
                    x = { ...x, error: true };
                }
                if (x.name === null) {
                    errorAlert = [errorAlert, "Tên danh mục không được để trống"];
                }
                x = { ...x, errorAlert: errorAlert };
                value[i] = x;
            }

            setState({
                ...state,
                importData: value,
                importShowData: showValues,
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
        let { importShowData } = state;
        props.importCategory(importShowData);
    }
    const { translate } = props;
    let { limit, page, importData, rowError, configData, checkFileImport } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-import-file-category" isLoading={false}
                formID="form-import-file-category"
                title="Thêm loại tài liệu bằng import file excel"
                func={save}
                disableSubmit={false}
                size={75}
            >
                <form className="form-group" id="form-import-file">
                    <ConFigImportFile
                        id="import_taskTemplate_config_category"
                        configData={configData}
                        //textareaRow={8}
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
                            <ExportExcel id="download_template_task_template" type='link' exportData={exportCategory}
                                buttonName='Download file import mẫu' />
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


function mapState(state) {
    const { importCategory } = state;
    return { importCategory };
};
const actionCreators = {
    importCategory: DocumentActions.importDocumentCategory,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(CategoryImportForm));
export { importFileExcel as CategoryImportForm };