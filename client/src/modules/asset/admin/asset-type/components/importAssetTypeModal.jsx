import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';

import { AssetTypeActions } from '../redux/actions';

import { configAssetType, importAssetTypeTemplate } from './fileConfigurationImportAssetType';

import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';

class ImportAssetTypeModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            configData: configAssetType,
            limit: 100,
            page: 0
        }
    }

    save = () => {
        const { importShowData } = this.state;

        this.props.createAssetTypes(importShowData);
    }

    handleChangeConfig = (value) => {
        this.setState({
            configData: value,
            importData: [],
        })
    }

    convertDataExport = (dataExport) => {
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
                        parent: dataTemporary.parent,
                        description: dataTemporary.description,
                        information: dataTemporary.information
                    }
                    datas = [...datas, out];
                }

                dataExport.dataSheets[i].tables[j].data = datas;
            }
        }

        return dataExport;
    }

    getAssetTypeParentId = (parentName, data) => {
        let indexOfArr = -1,
            AssetTypeParentId;

        // Kiểm tra xem loại tài sản cha có tồn tại hay không
        if (!parentName) return

        data.forEach((item, index) => {
            if (item.typeName === parentName)
                indexOfArr = index;
        })

        if (indexOfArr !== -1) {
            for (let i = 0; i < data.length; i++) {
                if (parentName === data[i].typeName) {
                    AssetTypeParentId = data[i]._id;
                    return AssetTypeParentId;
                }
            }
        } else {
            return indexOfArr;
        }
    }


    handleImportExcel = (value, checkFileImport) => {
        const { list } = this.props.assetType.administration.types;
        let values = [], valueShow = [], index = -1;

        for (let i = 0; i < value.length; i++) {
            const valueTemporary = value[i];
            if (valueTemporary.name) {
                index = index + 1;
                values = [...values, {
                    "STT": index + 1,
                    "code": valueTemporary.code,
                    "name": valueTemporary.name,
                    "parent": valueTemporary.parent,
                    "description": valueTemporary.description,
                    "information": valueTemporary.information
                }];
                valueShow = [...valueShow, {
                    "typeNumber": valueTemporary.code,
                    "typeName": valueTemporary.name,
                    "parent": this.getAssetTypeParentId(valueTemporary.parent, list),
                    "description": valueTemporary.description,
                    "defaultInformation": [{ nameField: valueTemporary.information }]
                }];
            } else {
                if (index >= 0) {
                    let out = {
                        "STT": "",
                        "code": "",
                        "name": "",
                        "parent": "",
                        "description": "",
                        "information": "",
                    }

                    if (valueTemporary.information) {
                        out.information = valueTemporary.information;
                    }
                    if (valueTemporary.information && valueShow[index]) {
                        valueShow[index].defaultInformation = [...valueShow[index].defaultInformation, { nameField: valueTemporary.information }];
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

                if (x.name === null || x.code === null || this.getAssetTypeParentId(x.parent, list) === -1) {
                    rowError = [...rowError, i + 1];
                    x = { ...x, error: true };
                }
                if (x.code === null) {
                    errorAlert = [...errorAlert, 'Mã loại tài sản không được để trống'];
                }
                if (x.name === null) {
                    errorAlert = [...errorAlert, 'Tên loại tài sản không được để trống'];
                }
                if (this.getAssetTypeParentId(x.parent, list) === -1) {
                    errorAlert = [...errorAlert, 'Loại tài sản cha không đúng định dạng'];
                }

                x = { ...x, errorAlert: errorAlert };
                value[i] = x;
            };

            this.setState({
                importData: value, // show ra :))
                importShowData: valueShow, // Luuw db
                rowError: rowError,
                checkFileImport: checkFileImport,
            })
        } else {
            this.setState({
                checkFileImport: checkFileImport,
            })
        }
    }

    render() {
        const { translate } = this.props;
        const { configData, importData, rowError, checkFileImport, limit, page } = this.state;

        let importDataTemplate = this.convertDataExport(importAssetTypeTemplate);
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`import_asset_type`} isLoading={false}
                    formID={`form_import_asset_type`}
                    title="Thêm loại tài sản bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_asset_type`}>
                        <ConFigImportFile
                            id="import_asset_type_config"
                            configData={configData}
                            scrollTable={false}
                            handleChangeConfig={this.handleChangeConfig}
                        />
                        <div className="row">
                            <div className="form-group col-md-6 col-xs-6">
                                <label>{translate('human_resource.choose_file')}</label>
                                <ImportFileExcel
                                    configData={configData}
                                    handleImportExcel={this.handleImportExcel}
                                />
                            </div>
                            <div className="form-group col-md-6 col-xs-6">
                                <label></label>
                                <ExportExcel id="download_asset_type_file" type='link' exportData={importDataTemplate}
                                    buttonName='Download file import mẫu' />
                            </div>
                            <div className="form-group col-md-12 col-xs-12">
                                <ShowImportData
                                    id="import_asset_type_show_data"
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

}

function mapState(state) {
    const { assetType } = state;
    return { assetType };
};
const actions = {
    createAssetTypes: AssetTypeActions.createAssetTypes,
};

const connectedImportAssetTypeModal = connect(mapState, actions)(withTranslate(ImportAssetTypeModal));
export { connectedImportAssetTypeModal as ImportAssetTypeModal };

