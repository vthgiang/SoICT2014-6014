import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, ErrorLabel } from '../../../common-components';
import ValidationHelper from '../../../helpers/validationHelper';

function AttributeTable(props) {
    const [state, setState] = useState({ translation: props.translation, noDescription: props.noDescription ? props.noDescription : false })

    // Thiet lap cac gia tri tu props vao state
    useEffect(() => {
        if (props.attributes !== state.attributes) {
            setState({
                ...state,
                attributes: props.attributes,
                attributeOwner: props.attributeOwner
            })
        }
    }, [props.attributes]);
    // lan1 - role 1 
    // an lai - role 1 -> ko chay vao useeffect
    // an dong 2 - role 2 -. useeffect load lai thuoc tinh dong 2
    // 

    console.log(state)


    // Function lưu các trường thông tin vào state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value,
            }
        })
        props.handleChange(name, value);
    }
    /**
     * Bắt sự kiện chỉnh sửa tên thuộc tính
     */
    const handleChangeAttributeName = (e, index) => {
        validateAttributeName(e[0], index);
    }

    const validateAttributeName = (value, className, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate(translation + '.attribute_not_selected');
        }
        if (willUpdateState) {
            var { attributes } = state;
            attributes[className] = { ...attributes[className], attributeId: value }
            setState(state => {
                return {
                    ...state,
                    errorOnNameField: msg,
                    errorOnNameFieldPosition: msg ? className : null,
                    attributes: attributes
                }
            });
            props.handleChange(state.attributeOwner, attributes);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa mô tả thuộc tính
     */
    const handleChangeAttributeDescription = (e, index, willUpdateState = true) => {
        var { value } = e.target;

        if (willUpdateState) {
            var { attributes } = state;
            attributes[index] = { ...attributes[index], description: value }
            setState(state => {
                return {
                    ...state,
                    attributes: attributes
                }
            });
            props.handleChange(state.attributeOwner, attributes);
        }
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị thuộc tính
     */
    const handleChangeAttributeValue = (e, index) => {
        var { value } = e.target;
        validateValue(value, index);
    }
    const validateValue = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { attributes } = state;
            attributes[className] = { ...attributes[className], value: value }
            setState(state => {
                return {
                    ...state,
                    errorOnValue: message,
                    errorOnValuePosition: message ? className : null,
                    attributes: attributes
                }
            });
            props.handleChange(state.attributeOwner, attributes);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện click thêm Thông tin chi tiết
     */
    const handleAddAttributes = () => {
        var attributes = state.attributes;
        var ind = props.i;
        ind++;
        // setState(state => {
        //     return {
        //         ...state,
        //         i: ind
        //     }
        // })
        props.handleChangeAddRowAttribute('i', ind)
        if (attributes.length !== 0) {
            let result;

            for (let n in attributes) {
                result = validateAttributeName(attributes[n].attributeId, n) && validateValue(attributes[n].value, n);
                if (!result) {
                    validateAttributeName(attributes[n].attributeId, n);
                    validateValue(attributes[n].value, n)
                    break;
                }
            }

            if (result) {
                setState(state => {
                    return {
                        ...state,
                        attributes: [...attributes, { attributeId: "", description: "", value: "", addOrder: ind }]
                    }
                })
            }

        } else {
            setState(state => {
                return {
                    ...state,
                    attributes: [...attributes, { attributeId: "", description: "", value: "", addOrder: ind }]
                }
            })
        }

    }

    /**
         * Bắt sự kiện xóa thông tin chi tiết
         */
    const handleRemoveAttribute = (index) => {
        var { attributes } = state;
        attributes.splice(index, 1);
        if (attributes.length !== 0) {
            for (let n in attributes) {
                validateAttributeName(attributes[n].attributeId, n);
                validateValue(attributes[n].value, n)
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    attributes: attributes,
                    errorOnValue: undefined,
                    errorOnNameField: undefined
                }
            })
        }
    };

    const { translate, attribute } = props;
    const { attributes, errorOnNameFieldPosition, errorOnValuePosition, errorOnNameField, errorOnValue, translation, noDescription } = state;

    return (
        <React.Fragment>

            {/* Các thuộc tính của phân quyền */}
            <div className="form-group">
                <label>{translate(translation + '.attributes')}</label>
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th style={(noDescription) ? { width: '45%' } : { width: '30%' }}><label>{translate(translation + '.attribute_name')}</label></th>
                            <th style={(noDescription) ? { width: '45%' } : { width: '30%' }}><label>{translate(translation + '.attribute_value')}</label></th>
                            {(noDescription) ? null :
                                <th style={{ width: '30%' }}><label>{translate(translation + '.attribute_description')}</label></th>
                            }
                            <th style={{ width: '40px' }} className="text-center"><a href="#add-attributes" className="text-green" onClick={handleAddAttributes}><i className="material-icons">add_box</i></a></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (!attributes || attributes.length == 0) ?
                                <tr>
                                    <td colSpan={4}>
                                        <center> {translate('table.no_data')}</center>
                                    </td>
                                </tr> :
                                attributes.map((attr, index) => {
                                    return <tr key={index}>
                                        <td style={{ maxWidth: '250px' }}>
                                            <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                <SelectBox
                                                    id={attr.addOrder}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    value={attr.attributeId}
                                                    items={attribute.lists.map(attribute => { return { value: attribute ? attribute._id : null, text: attribute ? attribute.attributeName : "" } })}
                                                    onChange={(e) => handleChangeAttributeName(e, index)}
                                                    multiple={false}
                                                    options={{ placeholder: translate(translation + '.attribute_select') }}
                                                />
                                                {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                            </div>
                                        </td>

                                        <td>
                                            <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                <input type="text"
                                                    className="form-control"
                                                    placeholder={translate(translation + '.attribute_value_example')}
                                                    value={attr.value}
                                                    onChange={(e) => handleChangeAttributeValue(e, index)}
                                                />
                                                {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                            </div>
                                        </td>
                                        {(noDescription) ? null :
                                            <td>
                                                <div className="form-group">
                                                    <input type="text"
                                                        className="form-control"
                                                        placeholder={translate(translation + '.attribute_description_example')}
                                                        value={attr.description}
                                                        onChange={(e) => handleChangeAttributeDescription(e, index)}
                                                    />

                                                </div>
                                            </td>
                                        }

                                        <td>
                                            <a href="#delete-attribute"
                                                className="text-red"
                                                style={{ border: 'none' }}
                                                onClick={() => handleRemoveAttribute(index)}><i className="fa fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                })
                        }
                    </tbody>
                </table>
            </div>


        </React.Fragment>
    );
}
function mapState(state) {
    const { attribute } = state;
    return { attribute };
}
const attributeTableConnected = connect(mapState)(withTranslate(AttributeTable))

export { attributeTableConnected as AttributeTable };