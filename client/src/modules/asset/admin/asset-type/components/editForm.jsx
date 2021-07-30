import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TreeSelect, ErrorLabel } from '../../../../../common-components';

import { AssetTypeActions } from '../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';

function EditForm(props) {
    const [state, setState] = useState({
        domainChild:{
            length: null
        }
    })
    const { translate, assetType } = props;
    const { tree, list } = assetType.administration.types;
    const { domainId, domainChild, domainCode, domainName, domainDescription, domainParent, errorName, defaultInfo, errorOnNameField, errorPosition, errorOnValuePosition, errorOnValue} = state;
    const [prevProps, setPrevProps] = useState({
        domainId : null
    })

    if(prevProps.domainId !== props.domainId) {
        setState({
            ...state,
            domainId: props.domainId,
            domainChild: props.domainChild,
            domainCode: props.domainCode,
            domainName: props.domainName,
            domainDescription: props.domainDescription,
            domainParent: props.domainParent,
            defaultInfo: props.defaultInformation,
            errorName: undefined,
        })
        setPrevProps(props)
    }


    const handleCode = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            domainCode: value
        })
    }

    const handleName = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            domainName: value
        })
    }

    const validateName = async (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = "hello world";
        }
        if (willUpdateState) {
            await setState(state => {
                return {
                    ...state,
                    domainName: value,
                    errorName: msg
                }
            })
        }

        return msg === undefined;
    }

    const handleValidateName = (e) => {
        const value = e.target.value.trim();
        validateName(value, true);
    }

    const isValidateForm = () => {
        return validateName(state.domainName, false);
    }

    const handleDescription = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            domainDescription: value
        })
    }

    const handleParent = (value) => {
        setState({ 
            ...state,
            domainParent: value[0] });
    };

    /**
     * Bắt sự kiện click thêm Thông tin mặc định
     */
    const handleAddDefaultInfo = () => {
        var defaultInfo = state.defaultInfo;

        if (defaultInfo.length !== 0) {
            let result;

            for (let n in defaultInfo) {
                result = validateNameField(defaultInfo[n].nameField, n) && validateValue(defaultInfo[n].value, n);
                if (!result) {
                    validateNameField(defaultInfo[n].nameField, n);
                    break;
                }
            }

            if (result) {
                setState({
                    ...state,
                    defaultInfo: [...defaultInfo, { nameField: "" , value: ""}]
                })
            }
        } else {
            setState({
                ...state,
                defaultInfo: [...defaultInfo, { nameField: "", value: ""}]
            })
        }

    }

    /**
     * Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin mặc định
     */
    const handleChangeNameField = (e, index) => {
        var { value } = e.target;
        validateNameField(value, index);
    }
    const validateNameField = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { defaultInfo } = state;
            defaultInfo[className] = { ...defaultInfo[className], nameField: value }
            setState(state => {
                return {
                    ...state,
                    errorOnNameField: message,
                    errorPosition: message ? className : null,
                    defaultInfo: defaultInfo
                }
            });
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin chi tiết
     */
     const handleChangeValue = (e, index) => {
        var { value } = e.target;
        validateValue(value, index);
    }
    const validateValue = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { defaultInfo } = state;
            defaultInfo[className] = { ...defaultInfo[className], value: value }
            setState(state => {
                return {
                    ...state,
                    errorOnValue: message,
                    errorOnValuePosition: message ? className : null,
                    defaultInfo: defaultInfo
                }
            });
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện xóa thông tin mặc định
     */
    const delete_function = (index) => {
        var { defaultInfo } = state;
        defaultInfo.splice(index, 1);
        setState({
            ...state,
            defaultInfo: defaultInfo
        })
        if (defaultInfo.length !== 0) {
            for (let n in defaultInfo) {
                validateNameField(defaultInfo[n].nameField, n);
                validateValue(defaultInfo[n].value, n);
            }
        } else {
            setState({
                ...state,
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    const save = () => {
        const { domainId, domainCode, domainName, domainDescription, domainParent, defaultInfo } = state;
        props.editAssetType(domainId, {
            typeNumber: domainCode,
            typeName: domainName,
            description: domainDescription,
            parent: domainParent,
            defaultInformation: defaultInfo,
        });
    }


    let cannotChoose = [domainId];
    let dataList = [];

    if (domainChild.length) {
        for (let i in domainChild) {
            cannotChoose.push(domainChild[i]);
        }
    }

    for (let i in list) {
        if (cannotChoose.indexOf(list[i]._id) < 0) {
            dataList.push({
                ...list[i],
                id: list[i]._id,
                name: list[i].typeName
            })
        }
    }

    return (
        <div id="edit-asset-type">
            {/* Mã loại tài sản */}
            <div className="form-group">
                <label>{translate('asset.asset_type.asset_type_code')}<span className="text-red">*</span></label>
                <input type="text" className="form-control" onChange={handleCode} value={domainCode} />
            </div>

            {/* Tên loại tài sản */}
            <div className="form-group">
                <label>{translate('asset.asset_type.asset_type_name')}<span className="text-red">*</span></label>
                <input type="text" className="form-control" onChange={handleName} value={domainName} />
            </div>

            {/* Loại tài sản cha */}
            <div className="form-group">
                <label>{translate('asset.asset_type.parent_asset_type')}</label>
                <TreeSelect data={dataList} value={[domainParent]} handleChange={handleParent} mode="radioSelect" />
            </div>

            {/* Mô tả */}
            <div className="form-group">
                <label>{translate('asset.general_information.description')}</label>
                <textarea style={{ minHeight: '120px' }} type="text" className="form-control" onChange={handleDescription} value={domainDescription} />
            </div>

            {/* Thông tin mặc định */}
            <div className="form-group">
                <label>Các thuộc tính mặc định:<a style={{ cursor: "pointer" }} title='Thêm thuộc tính mặc định'><i className="fa fa-plus-square" style={{ color: "#28A745", marginLeft: 5 }}
                    onClick={handleAddDefaultInfo} /></a></label>

                {/* Bảng thông tin chi tiết */}
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                            <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!defaultInfo || defaultInfo.length === 0) ? <tr>
                            <td colSpan={3}>
                                <center> {translate('table.no_data')}</center>
                            </td>
                        </tr> :
                            defaultInfo.map((x, index) => {
                                return <tr key={index}>
                                    {/* Tên trường dữ liệu */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        <div className={`form-group ${(parseInt(errorPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                            <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} />
                                            {(parseInt(errorPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                        </div>
                                    </td>

                                    {/* Giá trị mặc định  */}
                                    <td style={{ paddingLeft: '0px' }}>
                                        <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                            <input className="form-control" type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={(e) => handleChangeValue(e, index)} />
                                            {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                        </div>
                                    </td>

                                    {/* Hành động */}
                                    <td style={{ textAlign: "center" }}>
                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => delete_function(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            })}
                    </tbody>
                </table>
            </div>

            {/* Button */}
            <div className="form-group">
                <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={save}>{translate('asset.general_information.save')}</button>
                <button className="btn btn-danger" onClick={() => {
                    window.$(`#edit-asset-type`).slideUp()
                }}>{translate('asset.general_information.cancel')}</button>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { assetType } = state;
    return { assetType };
}

const mapDispatchToProps = {
    editAssetType: AssetTypeActions.editAssetType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));