import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ShowImportData, ImportFileExcel, ConFigImportFile } from '../../../../../common-components';

import { LOCAL_SERVER_API } from '../../../../../env';

class EmployeeImportTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkFileImport: true,
            limit: 100,
            page: 0
        };
    }

    // Function Thay đổi cấu hình file import
    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
        })
    }

    // Function thay đổi file import
    handleImportExcel = (value, checkFileImport) => {
        if (checkFileImport) {
            let result = this.props.handleCheckImportData(value);
            this.setState({
                importData: result.importData,
                rowError: result.rowError,
                checkFileImport: checkFileImport
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport
            })
        }

    }

    isFormValidated = () => {
        const { rowErrorOfReducer, dataOfReducer } = this.props;
        let { rowError, importData } = this.state;
        if (rowErrorOfReducer !== undefined) {
            rowError = rowErrorOfReducer;
            importData = dataOfReducer
        }
        if (rowError.length === 0 && importData.length !== 0) {
            return true
        } return false
    }

    render() {
        const { id, className = "tab-pane", configuration, rowErrorOfReducer, dataOfReducer, configTableWidth, showTableWidth, handleImport, textareaRow } = this.props;

        let { limit, page, importData, rowError, configData, checkFileImport } = this.state;

        if (rowErrorOfReducer !== undefined) {
            rowError = rowErrorOfReducer;
            importData = dataOfReducer
        };
        configData = configData ? configData : configuration;

        return (
            <React.Fragment>
                <div id={id} className={className}>
                    <div className="box-body row">
                        <div className="form-group col-md-12" style={{ marginBottom: 0 }}>
                            <ConFigImportFile
                                id={`import_employees_config${id}`}
                                configData={configData}
                                scrollTableWidth={configTableWidth}
                                textareaRow={textareaRow}
                                handleChangeConfig={this.handleChangeConfig}
                            />
                        </div>
                        <div className="form-group row col-md-12" style={{ marginBottom: 0 }}>
                            <div className="form-group col-md-4 col-xs-12">
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-4 col-xs-12 pull-right">
                                <a className='pull-right' href={LOCAL_SERVER_API + configData.file.fileUrl} target="_blank" style={{ paddingTop: 15 }}
                                    download={configData.file.fileName}><i className="fa fa-download"> &nbsp;Download file import mẫu!</i></a>
                            </div>
                        </div>
                        {importData && importData.length !== 0 &&
                            <div className="col-md-12">
                                <button type="button" className="btn btn-primary" onClick={handleImport} disabled={!this.isFormValidated()}>Import excel</button>
                            </div>
                        }
                        <div className="col-md-12">
                            <ShowImportData
                                id={`import_employee_infor_show_data${id}`}
                                configData={configData}
                                importData={importData}
                                rowError={rowError}
                                scrollTableWidth={showTableWidth}
                                checkFileImport={checkFileImport}
                                limit={limit}
                                page={page}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const importExcel = connect(null, null)(withTranslate(EmployeeImportTab));
export { importExcel as EmployeeImportTab };