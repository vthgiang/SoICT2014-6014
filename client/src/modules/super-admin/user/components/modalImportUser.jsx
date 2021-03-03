import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, ImportFileExcel, ExportExcel } from '../../../../common-components';
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

const dataImportTemplate = (listRole) => {
    let role, data = [];
    if (listRole && listRole.list) {
        role = listRole.list;
        role.forEach((x, index) => {
            data.push({ STT: index + 1, name: x.name });
        })
    }

    return {
        fileName: 'Thông tin người dùng',
        dataSheets: [
            {
                sheetName: 'sheet1',
                sheetTitle: 'Thông tin người dùng',
                tables: [
                    {
                        columns: [
                            { key: "name", value: "Tên" },
                            { key: "email", value: "Email" },
                            { key: "roles", value: "Phân quyền" },
                        ],
                        data: [
                            {
                                name: "Nguyễn Văn A",
                                email: "nva.vnist@gmail.com",
                                roles: "Nhân viên kỹ thuật",
                            }
                        ]
                    }
                ]
            },

            {
                sheetName: 'sheet2',
                sheetTitle: 'Thông tin các phân quyền',
                tables: [
                    {
                        columns: [
                            { key: "STT", value: "Số thứ tự" },
                            { key: "name", value: "Tên phân quyền" },
                        ],
                        data: data
                    }
                ]
            },

        ]
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
            <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="col-md-6">
                    <ImportFileExcel
                        configData={configData}
                        handleImportExcel={_handleImport}
                    />
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <ExportExcel type="link" id="downloadTemplateImport-user" buttonName={translate('human_resource.download_file')} exportData={dataImportTemplate(role)} style={{ marginLeft: '10px' }} />
                    </div>
                </div>
            </div>
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