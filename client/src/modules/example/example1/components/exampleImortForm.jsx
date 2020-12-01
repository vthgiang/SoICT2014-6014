import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { exampleActions } from '../redux/actions';

import { ShowImportData, ConFigImportFile, ImportFileExcel, DialogModal, ExportExcel } from '../../../../common-components/index';

import { configurationExampleTemplate, importExampleTemplate } from './fileConfigurationImportExample';

class ExampleImportForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            importData: undefined,
            rowError: [],
            scrollTable: false
        }
    }

    // Function Thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState(state => {
            return {
                ...state,
                configData: value,
            }
        })
    }

    // Xử lý file import 
    handleImportExcel = (value, checkFileImport) => {
        if (checkFileImport) {
            let rowError = [];
            value = value.map((item, index) => {
                let errorAlert = [];
  
                if (!item.exampleName) {
                    rowError = [...rowError, index + 1];
                    item = { ...item, error: true };
                }
                
                if (!item.exampleName) {
                    errorAlert = [...errorAlert, 'Tên ví dụ không được bỏ trống']
                }
                
                return {
                    ...item,
                    errorAlert: errorAlert
                }
            });

            this.setState(state => {
                return {
                    ...state,
                    importData: value,
                    rowError: rowError,
                    checkFileImport: true
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    checkFileImport: checkFileImport,
                }
            })
        }
    }

    isFormValidated = () => {
        const { rowError, checkFileImport } = this.state;
        if (rowError.length !== 0 || !checkFileImport) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {
            const { page, limit } = this.props;
            const { importData } = this.state;
            
            this.props.createExample(importData);
            this.props.getExamples({
                exampleName: "",
                page: page,
                limit: limit
            })
        }
    }

    render() {
        const { translate } = this.props;
        const { configData, scrollTable, importData, rowError, checkFileImport, id = "import_file_example" } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-import-file-example`} isLoading={false}
                    formID={`form-import-file-example`}
                    title={translate('human_resource.add_data_by_excel')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                >
                    <form className="form-group" id={`form-import-file-example`}>
                        <div className="col-md-12 col-xs-12">
                            <ConFigImportFile
                                id={`import_asset_config${id}`}
                                scrollTable={scrollTable}
                                configData={configData ? configData : configurationExampleTemplate}
                                handleChangeConfig={this.handleChangeConfig}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-xs-12">
                                <label>{translate('human_resource.choose_file')}</label>
                                <ImportFileExcel
                                    id={'file-import-example'}
                                    configData={configData ? configData : configurationExampleTemplate}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="col-md-8 col-xs-12">
                                <label></label>
                                <ExportExcel id="download_template_example" type='link' exportData={importExampleTemplate}
                                    buttonName='Download file import mẫu' />
                            </div>
                        </div>
                        <div className="col-md-12 col-xs-12">
                            <ShowImportData
                                id={`import_asset_show_data${id}`}
                                configData={configData ? configData : configurationExampleTemplate}
                                importData={importData}
                                rowError={rowError}
                                checkFileImport={checkFileImport}
                                scrollTable={scrollTable}
                                limit={100}
                                page={0}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = {
    createExample: exampleActions.createExample,
    getExamples: exampleActions.getExamples,
}
export default connect(null, mapDispatchToProps)(withTranslate(ExampleImportForm)); 