import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, AttributeTable} from '../../../../common-components';
import { RoleActions } from '../redux/actions';
import { AttributeActions } from '../../attribute/redux/actions';
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

    const handleChange = (name, value) => {
        // if (name === 'roleAttributes') { //
        //     if (value) {
        //         var partValue = value.split('-');
        //         value = [partValue[2], partValue[1], partValue[0]].join('-');
        //     } else {
        //         value = null
        //     }
        // }
        // if (name === "assetType") {
        //     value = JSON.stringify(value);
        // }

        setState({
            ...state,
            [name]: value
        });
    }


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
        let { roleName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, roleName).status || !validateAttributes()) return false;
        return true;
    }

    const save = () => {
        var keys_to_keep = ['attributeId', 'value', 'description']
        const data = {
            name: state.roleName,
            parents: state.roleParents,
            users: state.roleUsers,
            attributes: state.roleAttributes.map(element => Object.assign({}, ...keys_to_keep.map(key => ({[key]: element[key]}))))
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

    useEffect(() => {
        props.getAttribute();
    }, [])

    const { translate, role, user} = props;
    const { roleNameError, roleAttributes} = state;

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
                    <AttributeTable 
                        attributes={roleAttributes}
                        handleChange={handleChange}
                        attributeOwner={'roleAttributes'}
                    />

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
    create: RoleActions.create,
    getAttribute: AttributeActions.getAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleCreateForm));