import React, { Component } from 'react';
import { configArchive, exportArchive } from './fileConfigImportDocumentArchive'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
//import { taskTemplateActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../../auth/redux/actions';
import { DocumentActions } from '../../../redux/actions'

class ArchiveImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configArchive,
            checkFileImport: true,
            rowError: [],
            importData: [],
            importShowData: [],
            limit: 100,
            page: 0
        }
    }

    // Function thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }
    handleImportExcel = (value, checkFileImport) => {
        console.log('vlueee', value, checkFileImport)
        let values = [];
        let showValues = [];
        let k = -1;
        for (let i in value) {
            let x = value[i];
            if (x.name) {
                values = [...value, {
                    "STT": k + 1,
                    "name": x.name,
                    "description": x.description,
                    "pathParent": x.pathParent,

                }];
                showValues = [...showValues, {
                    "STT": k + 1,
                    "name": x.name,
                    "description": x.description,
                    "pathParent": x.pathParent,

                }]
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
            this.setState({
                importData: value,
                importShowData: showValues,
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
        console.log(importShowData);
        this.props.importArchive(importShowData);
    }

    // convertDataExport = (dataExport)=>{
    //     for(let i  = 0; i < dataExport.dataSheets.length; i++){
    //         for(let j = 0; j < dataExport.dataSheets[j].table.length; j++){
    //             let datas = [];
    //             let data = dataExport.dataSheets[i].table[j].data;
    //             if(Array.isArray(data[0].))
    //         }
    //     }
    // }

    render() {
        const { translate } = this.props;
        console.log('state', this.state);
        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;
        //let templateImportArchive = this.convertDataExport(exportArchive);
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file_archive`} isLoading={false}
                    formID={`form_import_file_archive`}
                    title="Thêm danh mục bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <ConFigImportFile
                            id="import_taskTemplate_config"
                            configData={configData}
                            //textareaRow={8}
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
                                <ExportExcel id="download_template_task_template" type='link' exportData={exportArchive}
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


}

function mapState(state) {
    const { importArchive } = state;
    return { importArchive };
};
const actionCreators = {
    importArchive: DocumentActions.importDocumentArchive,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(ArchiveImportForm));
export { importFileExcel as ArchiveImportForm };
