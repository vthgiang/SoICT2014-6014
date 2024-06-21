import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { GoodActions } from '../redux/actions';
import { configGood, importGoodTemplate } from './fileConfigurationImportGood';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components';

function ImportGoodModal(props) {
    const [state, setState] = useState({
        configData: configGood,
        limit: 100,
        page: 0,
        importData: [],
        rowError: [],
        checkFileImport: false,
        importShowData: []
    });

    const { translate } = props;
    const dispatch = useDispatch();
    const goodList = useSelector(state => state.Good.list); // Giả sử `list` là một phần của state `Good`

    const save = () => {
        dispatch(GoodActions.importGood(state.importShowData));
    };

    const handleChangeConfig = (value) => {
        setState(prevState => ({
            ...prevState,
            configData: value,
            importData: []
        }));
    };

    const convertDataExport = (dataExport) => {
        dataExport.dataSheets.forEach(sheet => {
            sheet.tables.forEach(table => {
                table.data = table.data.map((data, index) => ({
                    ...data,
                    STT: data.code ? index + 1 : null
                }));
            });
        });
        return dataExport;
    };

    const checkGoodCode = (code, list) => {
        return list?.some(item => item.code === code.trim()) ? -1 : 1;
    };

    const handleImportExcel = (value, checkFileImport) => {
        let values = [];
        let valueShow = [];
        let index = -1;

        value.forEach((item) => {
            if (item.name) {
                index++;
                values.push({
                    STT: index + 1,
                    ...item
                });
                valueShow.push({
                    ...item
                });
            } else if (index >= 0) {
                values.push({
                    STT: '',
                    code: '',
                    name: '',
                    category: '',
                    baseUnit: '',
                    description: '',
                    numberExpirationDate: '',
                    pricePerBaseUnit: '',
                    salesPriceVariance: '',
                    sourceType: '',
                    type: ''
                });
            }
        });

        if (checkFileImport) {
            let rowError = [];
            values = values.map((item, i) => {
                let errorAlert = [];
                const duplicateCode = values.filter((obj, idx) => obj.code?.trim() === item.code?.trim() && idx !== i);
                if (!item.code || !item.name || duplicateCode.length > 0 || checkGoodCode(item.code, goodList) === -1) {
                    rowError.push(i + 1);
                    item.error = true;
                }
                if (!item.code) errorAlert.push('Mã hàng hóa không được để trống');
                if (!item.name) errorAlert.push('Tên hàng hóa không được để trống');
                if (duplicateCode.length > 0) errorAlert.push('Mã hàng hóa trong file trùng lặp');
                if (checkGoodCode(item.code, goodList) === -1) errorAlert.push('Mã hàng hóa đã tồn tại trên hệ thống');

                item.errorAlert = errorAlert;
                return item;
            });

            setState(prevState => ({
                ...prevState,
                importData: values,
                importShowData: valueShow,
                rowError: rowError,
                checkFileImport: checkFileImport
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                checkFileImport: checkFileImport
            }));
        }
    };

    const importDataTemplate = convertDataExport(importGoodTemplate);

    return (
        <React.Fragment>
            <DialogModal
                modalID="import_good"
                isLoading={false}
                formID="form_import_good"
                title='Thêm hàng hóa bằng import file excel'
                func={save}
                disableSubmit={false}
                size={75}
            >
                <form className="form-group" id="form_import_good">
                    <ConFigImportFile id="import_good_config" configData={state.configData} scrollTable={false} handleChangeConfig={handleChangeConfig} />
                    <div className="row">
                        <div className="form-group col-md-6 col-xs-6">
                            <label>{translate('human_resource.choose_file')}</label>
                            <ImportFileExcel configData={state.configData} handleImportExcel={handleImportExcel} />
                        </div>
                        <div className="form-group col-md-6 col-xs-6">
                            <label></label>
                            <ExportExcel id="download_good_file" type="link" exportData={importDataTemplate} buttonName="Download file import mẫu" />
                        </div>
                        <div className="form-group col-md-12 col-xs-12">
                            <ShowImportData
                                id="import_good_show_data"
                                configData={state.configData}
                                importData={state.importData}
                                rowError={state.rowError}
                                scrollTable={true}
                                checkFileImport={state.checkFileImport}
                                limit={state.limit}
                                page={state.page}
                            />
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

export default withTranslate(ImportGoodModal);
