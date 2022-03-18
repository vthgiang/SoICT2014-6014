import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { RoleActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import ModalImportRole from './modalImportRole';

function RoleAttributeCreateForm(props) {
    const [state, setState] = useState({

        roleList: [],
        roleAttributes: [],
        i: 0
    })

    useEffect(() => {
        props.get();
    }, [])



    const handleRoleList = (value) => {
        setState({
            ...state,
            roleList: value
        });
    }



    const handleRoleUser = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            roleUsers: [value]
        });
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
            msg = translate('manage_role.attribute_not_selected');
        }
        if (willUpdateState) {
            var { roleAttributes } = state;
            roleAttributes[className] = { ...roleAttributes[className], attributeId: value}
            setState(state => {
                return {
                    ...state,
                    errorOnNameField: msg,
                    errorOnNameFieldPosition: msg ? className : null,
                    roleAttributes: roleAttributes
                }
            });
            props.handleChange("roleAttributes", roleAttributes);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa mô tả thuộc tính
     */
    const handleChangeAttributeDescription = (e, index, willUpdateState = true) => {
        var { value } = e.target;

        if (willUpdateState) {
            var { roleAttributes } = state;
            roleAttributes[index] = { ...roleAttributes[index], description: value }
            setState(state => {
                return {
                    ...state,
                    roleAttributes: roleAttributes
                }
            });
            props.handleChange("roleAttributes", roleAttributes);
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
            var { roleAttributes } = state;
            roleAttributes[className] = { ...roleAttributes[className], value: value }
            setState(state => {
                return {
                    ...state,
                    errorOnValue: message,
                    errorOnValuePosition: message ? className : null,
                    roleAttributes: roleAttributes
                }
            });
            props.handleChange("roleAttributes", roleAttributes);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện click thêm Thông tin chi tiết
     */
    const handleAddAttributes = () => {
        var roleAttributes = state.roleAttributes;
        var ind = state.i;
        ind++;
        setState(state => {
            return {
                ...state,
                i: ind
            }
        })
        if (roleAttributes.length !== 0) {
            let result;

            for (let n in roleAttributes) {
                result = validateAttributeName(roleAttributes[n].attributeId, n) && validateValue(roleAttributes[n].value, n);
                if (!result) {
                    validateAttributeName(roleAttributes[n].attributeId, n);
                    validateValue(roleAttributes[n].value, n)
                    break;
                }
            }

            if (result) {
                setState(state => {
                    return {
                        ...state,
                        roleAttributes: [...roleAttributes, { attributeId: "", description: "", value: "", addOrder: ind }]
                    }
                })
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    roleAttributes: [...roleAttributes, { attributeId: "", description: "", value: "", addOrder: ind }]
                }
            })
        }

    }

    /**
         * Bắt sự kiện xóa thông tin chi tiết
         */
    const handleRemoveAttribute = (index) => {
        var { roleAttributes } = state;
        roleAttributes.splice(index, 1);
        if (roleAttributes.length !== 0) {
            for (let n in roleAttributes) {
                validateAttributeName(roleAttributes[n].attributeId, n);
                validateValue(roleAttributes[n].value, n)
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    roleAttributes: roleAttributes,
                    errorOnValue: undefined,
                    errorOnNameField: undefined
                }
            })
        }
    };

    const validateAttributes = () => {
        var roleAttributes = state.roleAttributes;
        let result = true;

        if (roleAttributes.length !== 0) {

            for (let n in roleAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, roleAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, roleAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        console.log(result);
        return result;
    }

    const isFormValidated = () => {
        let { roleList, roleAttributes } = state;

        if (roleList.length == 0 || roleAttributes.length == 0 || !validateAttributes()) return false;
        return true;
    }

    const save = () => {
        var keys_to_keep = ['attributeId', 'value', 'description']
        const data = {
            roleList: state.roleList,
            attributes: state.roleAttributes.map(element => Object.assign({}, ...keys_to_keep.map(key => ({[key]: element[key]}))))
        }

        if (isFormValidated()) {
            return props.createRoleAttribute(data);
        }
    }

    const handleOpenModalCreateRoleAttribute = () => {
        window.$(`#modal-create-role-attribute`).modal('show')
    }
    console.log('state', state);

    // const handleOpenModalImportAttribute = () => {
    //     window.$(`#modal-import-role-attribute`).modal('show')
    // }

    const { translate, role, attribute } = props;
    const { roleAttributes, errorOnNameFieldPosition, errorOnValuePosition, errorOnNameField, errorOnValue } = state;

    return (
        <React.Fragment>
            {/* Button thêm thuộc tính */}
            <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
                {
                    <div className="dropdown">
                        <button style={{ marginRight: 10 }} type="button" className="btn btn-primary dropdown-toggler" data-toggle="dropdown" aria-expanded="true">Thêm thuộc tính</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#" onClick={handleOpenModalCreateRoleAttribute}>Thêm thuộc tính phân quyền</a></li>
                            {/* <li><a href="#" onClick={handleOpenModalImportRoleAttribute}>Thêm thuộc tính từ file</a></li> */}
                        </ul>
                    </div>
                }
            </div>

            {/* <ModalImportRole /> */}
            {/* <ButtonModal modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')} /> */}

            <DialogModal
                modalID="modal-create-role-attribute" isLoading={role.isLoading}
                formID="form-create-role-attribute"
                title={translate('manage_role.add_attribute_title')}
                size={50}
                func={save} disableSubmit={!isFormValidated()}
            >
                {/* Form thêm phân quyền mới */}
                <form id="form-create-role-attribute">

                    {/* Tên phân quyền
                    <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                        <input className="form-control" onChange={handleRoleName} />
                        <ErrorLabel content={roleNameError} />
                    </div> */}

                    {/* Các phân quyền thêm thuộc tính*/}
                    <div className="form-group">
                        <label>{translate('manage_role.roles_add_attribute')}<span className="text-red">*</span></label>
                        <SelectBox
                            id="select-role-attribute-create"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                role.list
                                    .map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })
                            }
                            onChange={handleRoleList}
                            multiple={true}
                        />
                    </div>

                    {/* Các thuộc tính của phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.attributes')}<span className="text-red">*</span></label>

                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}><label>{translate('manage_role.attribute_name')}</label></th>
                                    <th style={{ width: '30%' }}><label>{translate('manage_role.attribute_value')}</label></th>
                                    <th style={{ width: '30%' }}><label>{translate('manage_role.attribute_description')}</label></th>

                                    <th style={{ width: '40px' }} className="text-center"><a href="#add-attributes" className="text-green" onClick={handleAddAttributes}><i className="material-icons">add_box</i></a></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (!roleAttributes || roleAttributes.length == 0) ?
                                        <tr>
                                            <td colSpan={4}>
                                                <center> {translate('table.no_data')}</center>
                                            </td>
                                        </tr> :
                                        roleAttributes.map((attr, index) => {
                                            return <tr key={index}>
                                                <td>
                                                <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                        <SelectBox
                                                            id={attr.addOrder}
                                                            className="form-control select2"
                                                            style={{ width: "100%" }}
                                                            items={attribute.lists.map(attribute => { return { value: attribute ? attribute._id : null, text: attribute ? attribute.attributeName : "" } })}
                                                            onChange={(e) => handleChangeAttributeName(e, index)}
                                                            value={attr.attributeId}
                                                            multiple={false}
                                                            options={{ placeholder: translate('manage_role.attribute_select') }}
                                                        />
                                                        {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                        {/* {attr.attributeId} */}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_role.attribute_value_example')}
                                                            value={attr.value}
                                                            onChange={(e) => handleChangeAttributeValue(e, index)}
                                                        />
                                                        {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="form-group">
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_role.attribute_description_example')}
                                                            value={attr.description}
                                                            onChange={(e) => handleChangeAttributeDescription(e, index)}
                                                        />

                                                    </div>
                                                </td>

                                                <td>
                                                    <a href="#delete-manager"
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

                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { role, user, attribute } = state;
    return { role, user, attribute };
}


const mapDispatchToProps = {
    get: RoleActions.get,
    createRoleAttribute: RoleActions.createRoleAttribute,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleAttributeCreateForm));