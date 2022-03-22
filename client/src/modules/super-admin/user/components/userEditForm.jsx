import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, ErrorLabel, SelectBox, AttributeTable } from '../../../../common-components';
import { UserActions } from '../redux/actions';
import { AttributeActions } from '../../attribute/redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

function UserEditForm(props) {
    const [state, setState] = useState({
        status: [
            { id: 1, name: "disable", value: false },
            { id: 2, name: "enable", value: true }
        ]
    })

    const checkSuperAdmin = (roleArr) => {
        let superAdmin = props.role.list.find(obj => {
            return obj.name === "Super Admin"
        });

        var result = false;
        if (Array.isArray(roleArr)) {
            for (let i = 0; i < roleArr.length; i++) {
                if (roleArr[i] === superAdmin._id) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    const save = () => {
        var keys_to_keep = ['attributeId', 'value', 'description']
        if (isFormValidated()) {
            return props.edit(props.userId, {
                email: state.userEmail,
                name: state.userName,
                active: state.userActive,
                roles: state.userRoles,
                attributes: state.userAttributes.map(element => Object.assign({}, ...keys_to_keep.map(key => ({ [key]: element[key] }))))
            });
        }
    }

    const isFormValidated = () => {
        let { userName, userEmail } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, userName, 6, 255).status || !ValidationHelper.validateEmail(translate, userEmail).status || !validateAttributes()) return false;
        return true;
    }

    const handleUserName = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        setState({
            ...state,
            userName: value,
            userNameError: message
        });
    }

    const handleUserEmail = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateEmail(translate, value);
        setState({
            ...state,
            userEmail: value,
            userEmailError: message
        });
    }

    const handleRolesChange = (value) => {
        setState({
            ...state,
            userRoles: value
        });
    }

    const handleUserActiveChange = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            userActive: value
        });
    }

    // Function lưu các trường thông tin vào state
    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    const handleChangeAddRowAttribute = (name, value) => {
        props.handleChangeAddRowAttribute(name, value)
    }

    const validateAttributes = () => {
        var userAttributes = state.userAttributes;
        let result = true;

        if (userAttributes.length !== 0) {

            for (let n in userAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, userAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, userAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        console.log(result);
        return result;
    }

    useEffect(() => {
        if (props.userId !== state.userId || props.userAttributes !== state.userAttributes) {
            setState({
                ...state,
                userId: props.userId,
                userEmail: props.userEmail,
                userName: props.userName,
                userActive: props.userActive,
                userRoles: props.userRoles,
                userAvatar: props.userAvatar,
                userEmailError: undefined,
                userNameError: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                userAttributes: props.userAttributes.map((a, index) => a = { ...a, addOrder: index + props.userId })
            })
        }
    }, [props.userId, props.userAttributes])

    useEffect(() => {
        props.getAttribute();
    }, [])

    const { translate, role, user, auth } = props;
    const { userId, userEmail, userName, userActive, userRoles, status, userNameError, userEmailError, userAvatar, userAttributes } = state;

    return (
        <React.Fragment>
            <DialogModal
                func={save} isLoading={user.isLoading}
                modalID={`modal-edit-user`}
                formID={`form-edit-user`}
                title={translate('manage_user.edit')}
                disableSubmit={!isFormValidated()}
            >
                {/* Form chỉnh sửa thông tin tài khoản người dùng */}
                <form id={`form-edit-user`}>
                    <div className="row">
                        <div className="form-group col-sm-3" style={{ paddingTop: '25px' }}>
                            <img className="user-avatar" src={process.env.REACT_APP_SERVER + userAvatar} />
                        </div>
                        <div className="form-group col-sm-9">
                            <div className={`form-group ${!userNameError ? "" : "has-error"}`}>
                                <label>{translate('table.name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={userName} onChange={handleUserName} />
                                <ErrorLabel content={userNameError} />
                            </div>
                        </div>
                        {
                            checkSuperAdmin(userRoles) ? // Là super admin của công ty
                                <React.Fragment>
                                    <div className="form-group col-sm-3">
                                        <label>{translate('table.status')}<span className="text-red">*</span></label>
                                        <select
                                            className="form-control"
                                            style={{ width: '100%' }}
                                            value={userActive}
                                            disabled={true}>
                                            {
                                                status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className={`form-group col-sm-6 ${!userEmailError ? "" : "has-error"}`}>
                                        <label>{translate('table.email')}<span className="text-red">*</span></label>
                                        {
                                            auth.user._id === userId ?
                                                <input type="text" className="form-control" value={userEmail} onChange={handleUserEmail} /> :
                                                <input type="text" className="form-control" value={userEmail} disabled />
                                        }
                                        <ErrorLabel content={userEmailError} />
                                    </div>
                                </React.Fragment> :
                                <React.Fragment>
                                    <div className="form-group col-sm-3">
                                        <label>{translate('table.status')}<span className="text-red">*</span></label>
                                        <select
                                            className="form-control"
                                            style={{ width: '100%' }}
                                            value={userActive}
                                            onChange={handleUserActiveChange}>
                                            {
                                                status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className={`form-group col-sm-6 ${!userEmailError ? "" : "has-error"}`}>
                                        <label>{translate('table.email')}<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" value={userEmail} onChange={handleUserEmail} />
                                        <ErrorLabel content={userEmailError} />
                                    </div>
                                </React.Fragment>
                        }
                    </div>
                    {
                        checkSuperAdmin(userRoles) && auth.user._id !== userId ?
                            null :
                            <div className="form-group">
                                <label>{translate('manage_user.roles')}</label>
                                <SelectBox
                                    id={`user-role-form${userId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        checkSuperAdmin(userRoles) ? // Neu tai khoan nay hien tai khong co role la Super Admin
                                            role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } }) :
                                            role.list.filter(role => {
                                                return role && role.name !== 'Super Admin'
                                            }).map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })
                                    }
                                    onChange={handleRolesChange}
                                    value={userRoles}
                                    multiple={true}
                                />
                            </div>
                    }

                    {/* Các thuộc tính của user */}
                    <AttributeTable
                        attributes={userAttributes}
                        handleChange={handleChange}
                        attributeOwner={'userAttributes'}
                        translation={'manage_user'}
                        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                        i={props.i}
                    />
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { user, role, auth } = state;
    return { user, role, auth };
}

const action = {
    edit: UserActions.edit,
    getAttribute: AttributeActions.getAttributes
}


export default connect(mapStateToProps, action)(withTranslate(UserEditForm));
