import React, { Component } from 'react';
import { configDocument } from './fileConfigImportDocument.js'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';
//import { taskTemplateActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../../auth/redux/actions';
import { DocumentActions } from '../../../redux/actions'

class DocumentImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configData: configDocument,
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
                    "archives": [x.archives],
                    "domains": [x.domains],
                    "issuingBody": x.issuingBody,
                    "signer": x.signer,
                    "officialNumber": x.officialNumber,
                    "versionName": x.versionName,
                    "issuingDate": x.issuingDate,
                    "effectiveDate": x.effectiveDate,
                    "expiredDate": x.effectiveDate,
                    "category": x.category,
                    "relationshipDescription": x.relationshipDescription,
                    "documentRelationshipList": [x.documentRelationshipList],
                    "role": [x.role],
                    "organizationUnitManager": x.organizationUnitManager,
                }];
                showValues = [...showValues, {
                    "name": x.name,
                    "description": x.description,
                    "archives": [x.archives],
                    "domains": [x.domains],
                    "issuingBody": x.issuingBody,
                    "signer": x.signer,
                    "officialNumber": x.officialNumber,
                    "versionName": x.versionName,
                    "issuingDate": x.issuingDate,
                    "effectiveDate": x.effectiveDate,
                    "expiredDate": x.effectiveDate,
                    "category": x.category,
                    "relationshipDescription": x.relationshipDescription,
                    "documentRelationshipList": [x.documentRelationshipList],
                    "role": [
                        
                    ],
                    "organizationUnitManager": x.organizationUnitManager,
                }]
            } else {
                if (k >= 0) {
                    let out = {
                        "STT": "",
                        "name": "",
                        "description": "",
                        "archives": "",
                        "domains": "",
                        "issuingBody": "",
                        "signer": "",
                        "officialNumber": "",
                        "versionName": "",
                        "issuingDate": "",
                        "effectiveDate": "",
                        "expiredDate": "",
                        "category": "",
                        "relationshipDescription": "",
                        "documentRelationshipList": "",
                        "role": "",
                        "organizationUnitManager": "",
                    }
                    if (x.domains) {
                        showValues[k].domains = [...showValues[k].domains, x.domains];
                        out.domains = [x.domains]
                    }
                    if (x.archives) {
                        showValues[k].domains = [...showValues[k].archives, x.archives];
                        out.archives = [x.archives];
                    }
                    if (x.roles) {
                        showValues[k].domains = [...showValues[k].roles, x.roles];
                        out.roles = [x.roles];
                    }
                    if (x.relationshipDocuments) {
                        showValues[k].relationshipDocuments = [...showValues[k].relationshipDocuments, x.relationshipDocuments];
                        out.relationshipDocuments = [x.relationshipDocuments];
                    }
                }
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
        this.props.importDocument(importShowData);
    }
    render() {
        const { translate } = this.props;
        console.log('stateeeeeeee');
        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file_document`} isLoading={false}
                    formID={`form_import_file_document`}
                    title="Thêm tài liệu bằng import file excel"
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
                            {/* <div className="form-group col-md-4 col-xs-12">
                                <label></label>
                                <ExportExcel id="download_template_task_template" type='link' exportData={templateImportTaskTemplate2}
                                    buttonName='Download file import mẫu' />
                            </div> */}
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
    const { importDocument } = state;
    return { importDocument };
};
const actionCreators = {
    importDocument: DocumentActions.importDocument,
    downloadFile: AuthActions.downloadFile,
};
const importFileExcel = connect(mapState, actionCreators)(withTranslate(DocumentImportForm));
export { importFileExcel as DocumentImportForm };







