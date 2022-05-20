import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectBox } from '../../../../../common-components';
import Swal from "sweetalert2";
import ValidationHelper from '../../../../../helpers/validationHelper';

function OptionalAttributeCreateForm(props) {

    const [state, setState] = useState({
        detailInfo: [],
    })

    const handleAddDetailInfo = () => {
        var detailInfo = state.detailInfo;

        if (detailInfo.length !== 0) {
            let result;

            for (let n in detailInfo) {
                result = validateNameField(detailInfo[n].nameField, n) && validateValue(detailInfo[n].value, n);
                if (!result) {
                    validateNameField(detailInfo[n].nameField, n);
                    validateValue(detailInfo[n].value, n)
                    break;
                }
            }

            if (result) {
                setState(state => {
                    return {
                        ...state,
                        detailInfo: [...detailInfo, { nameField: "", value: "" }]
                    }
                })
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    detailInfo: [...detailInfo, { nameField: "", value: "" }]
                }
            })
        }

    }

    const handleChangeNameField = (e, index) => {
        var { value } = e.target;
        validateNameField(value, index);
    }
    const validateNameField = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { detailInfo } = state;
            detailInfo[className] = { ...detailInfo[className], nameField: value }
            setState(state => {
                return {
                    ...state,
                    errorOnNameField: message,
                    errorOnNameFieldPosition: message ? className : null,
                    detailInfo: detailInfo
                }
            });
            props.handleChange(detailInfo);
        }
        return message === undefined;
    }

    const handleChangeValue = (e, index) => {
        var { value } = e.target;
        validateValue(value, index);
    }

    const validateValue = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { detailInfo } = state;
            detailInfo[className] = { ...detailInfo[className], value: value }
            setState(state => {
                return {
                    ...state,
                    errorOnValue: message,
                    errorOnValuePosition: message ? className : null,
                    detailInfo: detailInfo
                }
            });
            props.handleChange(detailInfo);
        }
        return message === undefined;
    }

    const delete_function = (index) => {
        var { detailInfo } = state;
        detailInfo.splice(index, 1);
        if (detailInfo.length !== 0) {
            for (let n in detailInfo) {
                validateNameField(detailInfo[n].nameField, n);
                validateValue(detailInfo[n].value, n)
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    detailInfo: detailInfo,
                    errorOnValue: undefined,
                    errorOnNameField: undefined
                }
            })
        }
    };

    const showListExplainOptionalAttribute = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Các thuộc tính tùy chọn</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Cho phép người dùng tạo các thuộc tính thêm của hàng hóa ngoài các thuộc tính mặc định có sẵn</p>`,
            width: "50%",
        })
    };


    const { translate, id } = props;
    let { detailInfo, errorOnNameField, errorOnNameFieldPosition, errorOnValue, errorOnValuePosition } = state;
    return (

        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{'Thêm thuộc tính tùy chọn'}
                <a onClick={() => showListExplainOptionalAttribute()}>
                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                </a>
            </legend>

            <div className="form-group">
                <p type="button" className="btn btn-success" onClick={handleAddDetailInfo}>Thêm mới</p>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                        <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {(!detailInfo || detailInfo.length === 0) ? <tr>
                        <td colSpan={3}>
                            <center> {translate('table.no_data')}</center>
                        </td>
                    </tr> :
                        detailInfo.map((x, index) => {
                            return <tr key={index}>
                                <td style={{ paddingLeft: '0px' }}>
                                    <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                        <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} />
                                        {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                    </div>
                                </td>

                                <td style={{ paddingLeft: '0px' }}>
                                    <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                        <input className="form-control" type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={(e) => handleChangeValue(e, index)} />
                                        {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                    </div>
                                </td>

                                <td style={{ textAlign: "center" }}>
                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => delete_function(index)}><i className="material-icons"></i></a>
                                </td>
                            </tr>
                        })}
                </tbody>
            </table>
        </fieldset >
    )
}

export default connect(null, null)(withTranslate(OptionalAttributeCreateForm));
