import React, { useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { ErrorLabel, DialogModal } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

function ModalAddVariantOption(props) {
    const [state, setState] = useState({
        limit: 10,
        checkedId: '',
        variantOption: [],
    })

    const handleAddvariantOption = () => {
        var { variantOption } = state;
        let array = ['']
        if (variantOption.length !== 0) {
            let result;
            for (let n in variantOption) {
                result = validateNameField(variantOption[n].nameField, n);
                // && validateVariantOptionValue(variantOption[n].value, n);
                if (!result) {
                    validateNameField(variantOption[n].nameField, n);
                    // validateVariantOptionValue(variantOption[n].value, n)
                    break;
                }
            }
            if (result) {
                setState({
                    ...state,
                    variantOption: [...variantOption, { nameField: "", variantOptionValue: array }],
                })
            }
        } else {
            setState({
                ...state,
                variantOption: [...variantOption, { nameField: "", variantOptionValue: array }],
            })
        }

    }

    const handleAddVariantOptionValue = async (index) => {
        let data = Object.entries(state.variantOption[index]).map(([key, value]) => ({ key, value }));
        var { variantOption } = state;
        if (data.length !== 0) {
            let result = true;
            if (result) {
                data[1].value.push('');
                variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
                await setState({
                    ...state,
                    variantOption: variantOption
                });
            }
        } else {
            data[1].value.push('');
            variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
            await setState({
                ...state,
                variantOption: variantOption
            });
        }
    }

    const delete_function = (index) => {
        var { variantOption } = state;
        variantOption.splice(index, 1);
        if (variantOption.length !== 0) {
            for (let n in variantOption) {
                validateNameField(variantOption[n].nameField, n);
                // validateValue(variantOption[n].value, n)
            }
        } else {
            setState({
                ...state,
                variantOption: variantOption,
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    const deleteVariantOptionValue = (i, index) => {
        var { variantOption } = state;
        let data = Object.entries(state.variantOption[index]).map(([key, value]) => ({ key, value }));
        data[1].value.splice(i, 1);
        variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
        setState({
            ...state,
            variantOption: variantOption,
            errorOnValue: undefined,
            errorOnNameField: undefined
        });

    }

    const handleChangeNameField = (e, index) => {
        var { value } = e.target;
        validateNameField(value, index);
    }
    const validateNameField = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { variantOption } = state;
            variantOption[className] = { ...variantOption[className], nameField: value }
            setState({
                ...state,
                errorOnNameField: message,
                errorOnNameFieldPosition: message ? className : null,
                variantOption: variantOption
            });
        }
        return message === undefined;
    }


    const handleChangeVariantOptionValue = (e, i, index) => {
        var { value } = e.target;
        validateVariantOptionValue(value, i, index);
    }
    const validateVariantOptionValue = async (value, i, index, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { variantOption } = state;
            let data = Object.entries(variantOption[index]).map(([key, value]) => ({ key, value }));
            data[1].value[i] = value;
            variantOption[index] = { ...variantOption[index], variantOptionValue: data[1].value }
            await setState({
                ...state,
                errorOnValue: message,
                errorOnValuePosition: message ? index : null,
                variantOption: variantOption
            });
        }
        return message === undefined;
    }

    const save = async () => {
        await props.onDataChange(state.variantOption);
    }


    const { translate } = props;
    const { variantOption, errorOnNameField, errorOnValue, errorOnNameFieldPosition, errorOnValuePosition} = state;
    console.log(variantOption);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-variant-option`}
                formID={`modal-add-variant-option`}
                title="Thêm mới tùy chọn biến thể"
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={false}
                func={save}
                size="100"
            >
                <div className="form-group">
                    <p type="button" className="btn btn-success" onClick={handleAddvariantOption}>Thêm mới</p>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>{translate('asset.asset_info.field_name')}</th>
                            <th style={{textAlign : 'left'}}>{translate('asset.asset_info.value')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!variantOption || variantOption.length === 0) ? <tr>
                            <td colSpan={10}>
                                <center> {translate('table.no_data')}</center>
                            </td>
                        </tr> :
                            variantOption.map((x, index) => {
                                return <tr key={index}>
                                    <td>
                                        <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                            <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} />
                                            {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                        </div>
                                        <a onClick={() => delete_function(index)}><p className='text-red'>- Xóa tùy chọn</p></a>
                                    </td>

                                    <td>
                                        {(x.variantOptionValue && x.variantOptionValue.length) ? x.variantOptionValue.map((y, i) => {
                                            return <div key={i} className={`form-group ${(parseInt(errorOnValuePosition) === i && errorOnValue) ? "has-error" : ""}`} style={{ display: "flex" }}>
                                                <input className="form-control" type="text" value={y} name="value" style={{ width: "100%" }} onChange={(e) => handleChangeVariantOptionValue(e, i, index)} />
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => deleteVariantOptionValue(i, index)}><i className="material-icons"></i></a>
                                                {(parseInt(errorOnValuePosition) === i && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                            </div>

                                        }) : <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}> </div>}
                                        <a style={{textAlign : 'left'}} onClick={() => handleAddVariantOptionValue(index)}><p className='text-green'>+ Thêm giá trị mới</p></a>
                                    </td>
                                </tr>
                            })}
                    </tbody>
                </table>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalAddVariantOption));
