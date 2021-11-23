import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../redux/actions';
import { DialogModal, SelectBox, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ROLE_TYPE, ROOT_ROLE } from '../../../../helpers/constants';

function RoleInfoForm(props) {
    const [state, setState] = useState({})

    // Thiet lap cac gia tri tu props vao state
    useEffect(() => {
        if (props.roleId !== state.roleId) {
            setState({
                ...state,
                roleId: props.roleId,
                roleName: props.roleName,
                roleType: props.roleType,
                roleParents: props.roleParents,
                roleUsers: props.roleUsers,
                roleNameError: undefined,
                roleAttributes: props.roleAttributes
            })
        }
    }, [props.roleId])

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
                        roleAttributes: [...roleAttributes, { name: "", value: "" }]
                    }
                })
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    roleAttributes: [...roleAttributes, { name: "", value: "" }]
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

    const isFormValidated = () => {
        let { roleName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, roleName).status) return false;
        return true;
    }

    const save = () => {
        const role = {
            id: state.roleId,
            name: state.roleName,
            parents: state.roleParents,
            users: state.roleUsers,
            attributes: state.roleAttributes
        };
        console.log(role)

        if (isFormValidated()) {
            return props.edit(role);
        }
    }

    const { role, user, translate } = props;
    const { roleId, roleType, roleName, roleParents, roleUsers, roleNameError, roleAttributes, errorOnNameFieldPosition, errorOnValuePosition, errorOnNameField, errorOnValue } = state;

    return (
        <React.Fragment>
            <DialogModal
                func={save} isLoading={role.isLoading}
                modalID="modal-edit-role"
                formID="form-edit-role"
                title={translate('manage_role.edit')}
                disableSubmit={!isFormValidated()}
            >
                {/* Form chỉnh sửa thông tin phân quyền */}
                <form id="form-edit-role">

                    {/* Tên phân quyền */}
                    <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                        <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                        {
                            roleType === ROLE_TYPE.ROOT ?
                                <input className="form-control" value={roleName} disabled={true} /> :
                                <input className="form-control" value={roleName} onChange={handleRoleName} />
                        }
                        <ErrorLabel content={roleNameError} />
                    </div>

                    {/* Kế thừa phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.extends')}</label>
                        <SelectBox
                            id={`role-parents-${roleId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                role.list.filter(role => (role && role.name !== ROOT_ROLE.SUPER_ADMIN && role.name !== roleName))
                                    .map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })
                            }
                            onChange={handleParents}
                            disabled={roleName === ROOT_ROLE.SUPER_ADMIN ? true : false}
                            value={roleParents}
                            multiple={true}
                        />
                    </div>

                    {/* Những người dùng có phân quyền */}
                    <div className="form-group">
                        <label>{translate('manage_role.users')} {roleName}</label>
                        <SelectBox
                            id={`role-users-${roleId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } })
                            }
                            onChange={handleUsers}
                            value={roleUsers}
                            disabled={roleName === ROOT_ROLE.SUPER_ADMIN ? true : false}
                            multiple={roleName !== ROOT_ROLE.SUPER_ADMIN ? true : false}
                        />
                    </div>

                    {/* Các thuộc tính của phân quyền */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><span>{translate('manage_role.attributes')} {roleName}</span></legend>

                        <div className="form-group">
                            <table className="table table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th><label>{translate('manage_role.attribute_name')}</label></th>
                                        <th><label>{translate('manage_role.attribute_value')}</label></th>
                                        <th style={{ width: '40px' }} className="text-center"><a href="#add-attributes" className="text-green" onClick={handleAddAttributes}><i className="material-icons">add_box</i></a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (!roleAttributes || roleAttributes.length == 0) ?
                                            <tr>
                                                <td colSpan={3}>
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

                    </fieldset>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { role, user } = state;
    return { role, user };
}

const dispatchStateToProps = {
    edit: RoleActions.edit
}

export default connect(mapState, dispatchStateToProps)(withTranslate(RoleInfoForm));