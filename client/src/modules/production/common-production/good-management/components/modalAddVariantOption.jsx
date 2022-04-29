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
        variantOptionValue: [],
    })

    const handleAddvariantOption = () => {
        var variantOption = state.variantOption;
        console.log(variantOption);

        if (variantOption.length !== 0) {
            let result;

            for (let n in variantOption) {
                result = validateNameField(variantOption[n].nameField, n) && validateValue(variantOption[n].value, n);
                if (!result) {
                    validateNameField(variantOption[n].nameField, n);
                    validateValue(variantOption[n].value, n)
                    break;
                }
            }

            if (result) {
                setState({
                    ...state,
                    variantOption: [...variantOption, { nameField: "", value: "" }]
                })
            }
        } else {
            setState({
                ...state,
                variantOption: [...variantOption, { nameField: "", value: "" }]
            })
        }

    }

    const delete_function = (index) => {
        var { variantOption } = state;
        variantOption.splice(index, 1);
        if (variantOption.length !== 0) {
            for (let n in variantOption) {
                validateNameField(variantOption[n].nameField, n);
                validateValue(variantOption[n].value, n)
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
            // props.handleChange("variantOption", variantOption);
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
            var { variantOption } = state;
            variantOption[className] = { ...variantOption[className], value: value }
            setState({
                ...state,
                errorOnValue: message,
                errorOnValuePosition: message ? className : null,
                variantOption: variantOption
            });
            // props.handleChange("variantOption", variantOption);
        }
        return message === undefined;
    }


    const { translate } = props;
    const { variantOptionValue, variantOption, errorOnNameField, errorOnValue, errorOnNameFieldPosition, errorOnValuePosition
    } = state;

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-variant-option`}
                formID={`modal-add-variant-option`}
                title="Thêm mới tùy chọn biến thể"
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={false}
                // func={save}
                size="100"
            >
                <div className="form-group">
                    <p type="button" className="btn btn-info" onClick={handleAddvariantOption}>Thêm mới</p>
                </div>
                <p>Sử dụng Tùy chọn biến thể để tạo Biến thể, mỗi Biến thể có một SKU duy nhất có thể được sử dụng để theo dõi khoảng không quảng cáo. Gán các thuộc tính như Hình ảnh, Giá mặc định và Trọng lượng ở cấp Biến thể.</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>{translate('asset.asset_info.field_name')}</th>
                            <th>{translate('asset.asset_info.value')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!variantOption || variantOption.length === 0) ? <tr>
                            <td colSpan={3}>
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
                                        <a onClick={() => delete_function(index)}><p className='text-red'>-Xóa tùy chọn</p></a>
                                    </td>

                                    <td>
                                        <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`} style={{ display: "flex" }}>
                                            <input className="form-control" type="text" value={x.value} name="value" style={{ width: "100%" }} onChange={(e) => handleChangeValue(e, index)} />
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => delete_function(index)}><i className="material-icons"></i></a>
                                            {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                        </div>
                                        <a onClick={() => delete_function(index)}><p className='text-green'>+Thêm giá trị mới</p></a>
                                    </td>
                                    {/* {(!variantOptionValue || variantOptionValue.length === 0) ?
                                        <td>
                                            <center> {translate('table.no_data')}</center>
                                        </td> :
                                        variantOptionValue.map((y, index) => {
                                            return
                                            <td key={index}>
                                                <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                    <input className="form-control" type="text" value={y.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} />
                                                    {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                </div>
                                                <a onClick={() => delete_function(index)}><p className='text-red'>-Xóa tùy chọn</p></a>
                                            </td>
                                        })} */}
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
