import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, ImportFileExcel } from '../../../../common-components';
import { UserActions } from '../redux/actions';

const configData = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 2
    },
    name: {
        columnName: "Tên",
        description: "Tên người dùng",
        value: "Tên"
    },
    email: {
        columnName: "Email",
        description: "Địa chỉ email",
        value: "Email"
    },
    roles: {
        columnName: "Phân quyền",
        description: "Phân quyền được cấp cho người dùng",
        value: "Phân quyền"
    }
}

const ModalImportUser = ({ user, role, translate, importUsers, limit }) => {
    const [state, setState] = useState({});

    const _importUser = () => {
        let data = state.data; // mảng các user và phân quyền tương ứng
        let params = { limit }
        importUsers({ data }, params);
    }

    const _handleImport = (value, checkFileImport) => {
        let data = _getDataImportUser(value);
        setState({
            ...state,
            data: data
        });
    }

    const _convertRoleNameToId = (name) => {
        let roles = role.list;
        let roleFilter = roles.filter(r => r.name === name);

        return roleFilter.length > 0 ? roleFilter[0]._id : null;
    }

    const _getDataImportUser = (data) => {
        let newData = data.map(u => {
            let userRoles = u.roles.split(',');
            userRoles = userRoles.map(ur => _convertRoleNameToId(ur));

            return {
                name: u.name,
                email: u.email,
                roles: userRoles
            }
        });

        return newData;
    }

    return (
        <DialogModal
            modalID="modal-import-user" isLoading={user.isLoading}
            formID="form-import-user"
            title={translate('manage_user.import_title')}
            func={_importUser}
            size={75}
        >
            <ImportFileExcel
                configData={configData}
                handleImportExcel={_handleImport}
            />
            <button type="button" className="btn btn-success" style={{ position: 'absolute', top: 15, right: 15 }}>Download file mẫu</button>
        </DialogModal>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        role: state.role
    }
}

const mapDispatchToProps = {
    importUsers: UserActions.importUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalImportUser))