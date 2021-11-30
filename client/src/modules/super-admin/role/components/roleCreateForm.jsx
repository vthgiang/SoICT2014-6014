import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { RoleActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import ModalImportRole from './modalImportRole';

function RoleCreateForm(props) {
    const [state, setState] = useState({
        roleUsers: [],
        roleParents: [],
        roleAttributes: []
    })

    useEffect(() => {
        props.get();
    }, [])

    const handleRoleName = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState({
            ...state,
            roleName: value,
            roleNameError: message
        });
    }

    const handleParents = (value) => {
        setState({
            ...state,
            roleParents: value
        });
    }

    const handleUsers = (value) => {
        setState({
            ...state,
            roleUsers: value
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
        var { value } = e.target;
        validateNameField(value, index);
    }
    const validateNameField = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { roleAttributes } = state;
            roleAttributes[className] = { ...roleAttributes[className], name: value }
            setState(state => {
                return {
                    ...state,
                    errorOnNameField: message,
                    errorOnNameFieldPosition: message ? className : null,
                    roleAttributes: roleAttributes
                }
            });
            props.handleChange("roleAttributes", roleAttributes);
        }
        return message === undefined;
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

        if (roleAttributes.length !== 0) {
            let result;

            for (let n in roleAttributes) {
                result = validateNameField(roleAttributes[n].name, n) && validateValue(roleAttributes[n].value, n);
                if (!result) {
                    validateNameField(roleAttributes[n].name, n);
                    validateValue(roleAttributes[n].value, n)
                    break;
                }
            }

            if (result) {
                setState(state => {
                    return {
                        ...state,
                        roleAttributes: [...roleAttributes, { name: "", description: "", value: "" }]
                    }
                })
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    roleAttributes: [...roleAttributes, { name: "", description: "", value: "" }]
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
                validateNameField(roleAttributes[n].name, n);
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
                if (!ValidationHelper.validateEmpty(props.translate, roleAttributes[n].name).status || !ValidationHelper.validateEmpty(props.translate, roleAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        console.log(result);
        return result;
    }

    const isFormValidated = () => {
        let { roleName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, roleName).status || !validateAttributes()) return false;
        return true;
    }

    const save = () => {
        const data = {
            name: state.roleName,
            parents: state.roleParents,
            users: state.roleUsers,
            attributes: state.roleAttributes
        }

        if (isFormValidated()) {
            return props.create(data);
        }
    }

    const handleOpenModalCreate = () => {
        window.$(`#modal-create-role`).modal('show')
    }
    console.log('state', state);

    const handleOpenModalImport = () => {
        window.$(`#modal-import-role`).modal('show')
    }

    const { translate, role, user } = props;
    const { roleNameError, roleAttributes, errorOnNameFieldPosition, errorOnValuePosition, errorOnNameField, errorOnValue } = state;

    return (
        <React.Fragment>
            {/* Button thêm phân quyền mới */}
            <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
                {
                    <div className="dropdown">
                        <button type="button" className="btn btn-success dropdown-toggler" data-toggle="dropdown" aria-expanded="true">Thêm phân quyền</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#" onClick={handleOpenModalCreate}>Thêm một phân quyền</a></li>
                            <li><a href="#" onClick={handleOpenModalImport}>Thêm phân quyền từ file</a></li>
                        </ul>
                    </div>
                }
            </div>

            <ModalImportRole />
            {/* <ButtonModal modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')} /> */}

            <DialogModal
                modalID="modal-create-role" isLoading={role.isLoading}
                formID="form-create-role"
                title={translate('manage_role.add_title')}
                size={50}
                func={save} disableSubmit={!isFormValidated()}
            >
                {/* Form thêm phân quyền mới */}
                <form id="form-create-role">

                    {/* Tên phân quyền */}
                    <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                        <input className="form-control" onChange={handleRoleName} />
                        <ErrorLabel content={roleNameError} />
                    </div>

                    {/* Kế thừa phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.extends')}</label>
                        <SelectBox
                            id="select-role-parents-create"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                role.list.filter(role => (role && role.name !== 'Super Admin'))
                                    .map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })
                            }
                            onChange={handleParents}
                            multiple={true}
                        />
                    </div>

                    {/* Những người dùng có phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.users')}</label>
                        <SelectBox
                            id="select-role-users-create"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } })
                            }
                            onChange={handleUsers}
                            multiple={true}
                        />
                    </div>

                    {/* Các thuộc tính của phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.attributes')}</label>
                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th><label>{translate('manage_role.attribute_name')}</label></th>
                                    <th><label>{translate('manage_role.attribute_value')}</label></th>
                                    <th><label>{translate('manage_role.attribute_description')}</label></th>

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
                                        roleAttributes.map((attribute, index) => {
                                            return <tr key={index}>
                                                <td>
                                                    <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_role.attribute_name_example')}
                                                            value={attribute.name}
                                                            onChange={(e) => handleChangeAttributeName(e, index)}
                                                        />
                                                        {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_role.attribute_value_example')}
                                                            value={attribute.value}
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
                                                            value={attribute.description}
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
    const { role, user } = state;
    return { role, user };
}


const mapDispatchToProps = {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleCreateForm));