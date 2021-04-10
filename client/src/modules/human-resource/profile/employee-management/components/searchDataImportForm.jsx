import React from 'react';
import { templateSearchImport, configSearchData } from './searchDataConfigForm';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../../auth/redux/actions';

const SearchDataImportForm = (props) => {
    const [state, setState] = ({
        configData: configSearchData,
        checkFileImport: true,
        rowError: [],
        importData: [],
        importShowData: [],
        limit: 100,
        page: 0
    });

    // Function thay đổi cấu hình file import
    const handleChangeConfig = (value) => {
        setState(state => ({
            ...state,
            configData: value,
            importData: []
        }))
    }

    const handleImportExcel = (value, checkFileImport) => {
        let values = [];
        let valueShow = [];
        let k = -1;
        for (let i = 0; i < value.length; i++) {
            let x = value[i];
            k = k + 1;
            values = [...values, {
                "STT": k + 1,
                "position": x.position,
                "professionalSkill": x.professionalSkill,
                "majorSearch": x.majorSearch,
                "certificatesType": x.certificatesType,
                "certificatesName": x.certificatesName,
                "certificatesEndDate": x.certificatesEndDate,
                "exp": x.exp,
                "sameExp": x.sameExp,
                "field": x.field,
                "package": x.package,
                "action": (x.action) ? x.action.split(",") : [],
            }];
            valueShow = [...valueShow, {
                "position": x.position,
                "professionalSkill": x.professionalSkill,
                "majorSearch": x.majorSearch,
                "certificatesType": x.certificatesType,
                "certificatesName": x.certificatesName,
                "certificatesEndDate": x.certificatesEndDate,
                "exp": x.exp,
                "sameExp": x.sameExp,
                "field": x.field,
                "package": x.package,
                "action": (x.action) ? x.action.split(",") : [],
            }];
        }

        value = values;

        if (checkFileImport) {
            let rowError = [];
            for (let i = 0; i < value.length; i++) {
                let x = value[i];
                let errorAlert = [];
                x = { ...x, errorAlert: errorAlert };
                value[i] = x;
            };
            setState(state => ({
                ...state,
                importData: value,
                importShowData: valueShow,
                rowError: rowError,
                checkFileImport: checkFileImport
            }))
        } else {
            setState(state => ({
                ...state,
                checkFileImport: checkFileImport
            }))
        }
    }

    const save = () => {
        let { importShowData } = state;
        console.log(importShowData);
        props.updateSearchData(importShowData[0])
    }

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
    }

    const convertDataExport = (dataExport) => {
        for (let va = 0; va < dataExport.dataSheets.length; va++) {
            for (let val = 0; val < dataExport.dataSheets[va].tables.length; val++) {
                let datas = [];
                let data = dataExport.dataSheets[va].tables[val].data;
                    for (let k = 0; k < data.length; k++) {
                        let x = data[k];
                        let out = {
                            STT: k + 1,
                            position: x.position,
                            professionalSkill: x.professionalSkill,
                            majorSearch: x.majorSearch,
                            certificatesType: x.certificatesType,
                            certificatesName: x.certificatesName,
                            certificatesEndDate: x.certificatesEndDate,
                            exp: x.exp,
                            sameExp: x.sameExp,
                            field: x.field,
                            package: x.package,
                            action: x.action,
                        }
                        datas = [...datas, out];
                        
                    }
                    dataExport.dataSheets[va].tables[val].data = datas;
            }
        }
        return dataExport;
    }

    const { translate } = props;
    let { limit, page, importData, rowError, configData, checkFileImport } = state;
    let searchTemplateImport = convertDataExport(templateSearchImport);
    console.log('searchTemplateImport', searchTemplateImport);
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal_import_file_search`} isLoading={false}
                formID={`form_import_file_search`}
                title="Thêm mẫu công việc bằng import file excel"
                func={save}
                disableSubmit={false}
                size={75}
            >
                <form className="form-group" id={`form_import_file_search`}>
                    <ConFigImportFile
                        id="import_search_config"
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
                        {/* <div className="form-group col-md-4 col-xs-12">
                            <label></label>
                            <ExportExcel id="download_template_task_template" type='link' exportData={searchTemplateImport}
                                buttonName='Download file import mẫu' />
                        </div> */}
                        <div className="form-group col-md-12 col-xs-12">
                            <ShowImportData
                                id="import_search_show_data"
                                configData={configData}
                                importData={importData}
                                rowError={rowError}
                                scrollTable={false}
                                // scrollTableWidth={2500}
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

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(null, actionCreators)(withTranslate(SearchDataImportForm));
export { importFileExcel as SearchDataImportForm };