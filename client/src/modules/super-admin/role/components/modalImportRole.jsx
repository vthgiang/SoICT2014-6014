import React, { Component, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ImportFileExcel, ShowImportData, DialogModal, ExportExcel } from '../../../../common-components';
import { RoleActions } from '../redux/actions';
import cloneDeep from 'lodash/cloneDeep';

function ModalImportRoles(props) {
    const [state, setState] = useState({
        checkFileImport: true,
        limit: 100,
        page: 0
    })

    const { translate, role, user } = props;
    const { limit, page, valueImport, } = state;
    let { valueShow, rowError } = state;

    function configurationImport() {
        let config = {
            sheets: { // Tên các sheet
                description: 'Thông tin chung',
                value: ["Thông tin chung"]
            },
            rowHeader: { // Số dòng tiêu đề của bảng
                description: 'Số dòng tiêu đề của bảng',
                value: 1
            },
            roleName: {
                columnName: translate('manage_role.name'),
                description: translate('manage_role.name'),
                value: translate('manage_role.name'),
            },
            roleParents: {
                columnName: translate('manage_role.extends'),
                description: translate('manage_role.extends'),
                value: translate('manage_role.extends'),
            },
            roleUsers: {
                columnName: translate('manage_role.users'),
                description: translate('manage_role.users'),
                value: translate('manage_role.users'),
            },
        }
        return config;
    }

    const getRoleParentId = (roleParentName) => {
        const { list } = role;
        let result = [];
        if (roleParentName && typeof roleParentName === 'string' && list?.length) {
            let roleParentNameArray = roleParentName.split(",");

            if (roleParentNameArray) {
                roleParentNameArray.forEach(x => {
                    for (let k = 0; k < list.length; k++) {
                        if (list[k].name.trim() === x?.trim()) {
                            result = [...result, list[k]._id];
                            break;
                        }
                    }
                })
            }
        }
        return result;
    }

    const getRoleUserId = (userName) => {
        const { list } = user;
        let result = [];
        if (userName && typeof userName === 'string' && list?.length) {
            let userNameArray = userName.split(",");
            if (userNameArray) {
                userNameArray.forEach(x => {
                    for (let k = 0; k < list.length; k++) {
                        if (list[k].name.trim() === x?.trim()) {
                            result = [...result, list[k]._id];
                            break;
                        }
                    }
                })
            }
        }
        return result;
    }

    const handleImportExcel = (value) => {
        let rowError = [];
        let valueShow = [], valueImport = [];

        if (value?.length) {
            value.forEach((x, index) => {
                let errorAlert = [];
                let roleParentFormat = x?.roleParents ? getRoleParentId(x.roleParents) : [];
                let roleUsers = x?.roleUsers ? getRoleUserId(x?.roleUsers) : [];

                if (x.roleName === null) {
                    rowError = [...rowError, index + 1];
                    x = { ...x, error: true };
                }

                if (x.roleName === null)
                    errorAlert = [...errorAlert, 'Tên phân quyền không được đê trống'];

                // dữ liệu nguyên thuwry như trong file import để show ra
                valueShow = [
                    ...valueShow,
                    {
                        ...x,
                        errorAlert: errorAlert
                    }
                ]

                // dữ liệu này để gửi qua server đã chuẩn hóa
                valueImport = [
                    ...valueImport,
                    {
                        name: x.roleName,
                        parents: roleParentFormat,
                        users: roleUsers,
                    }
                ]
            })
        }

        setState({
            ...state,
            valueImport,
            valueShow,
            rowError
        })
    }

    const handleImport = () => {
        const { valueImport } = state;
        if (valueImport) {
            props.importRoles(valueImport);
        }
    }
    const handleDownloadFileImport = () => {

    }


    const config = configurationImport();
    if (role?.error?.rowError !== undefined) {
        rowError = role.error.rowError;
        valueShow = valueShow.map((x, index) => {

            let errorAlert = role?.error?.data[index]?.errorAlert.map(err => translate(`super_admin.role.${err}`));
            return {
                ...x,
                error: role?.error?.data[index].error,
                errorAlert: errorAlert,
            }
        })

    }
    const templateImport = (translate, listRole, listUser) => {
        const copyListRole = cloneDeep(listRole);
        const copyListUser = cloneDeep(listUser);

        let listRolesConvert = [], listUserConvert = [];

        copyListRole?.length && copyListRole.forEach((x, index) => {
            if (x.name !== "Super Admin") {
                listRolesConvert = [...listRolesConvert, {
                    STT: index + 1,
                    roleName: x.name,
                }]
            }
        });

        copyListUser?.length && copyListUser.forEach((x, index) => {
            listUserConvert = [...listUserConvert, {
                STT: index + 1,
                userName: x.name,
            }]
        })

        let templateImport = {
            fileName: "Mẫu import phân quyền",
            dataSheets: [{
                sheetName: "Thông tin chung",
                sheetTitle: "Mẫu import thông tin phân quyền",
                tables: [{
                    rowHeader: 1,
                    columns: [
                        { key: "STT", value: translate('human_resource.stt'), width: 7 },
                        { key: "roleName", value: translate('manage_role.name') },
                        { key: "roleParents", value: translate('manage_role.extends'), width: 40 },
                        { key: "roleUsers", value: translate('manage_role.users'), width: 45 },
                    ],
                    data: [{
                        STT: 1,
                        roleName: 'Nhân viên quản lý nhân sự',
                        roleParents: 'Employee, Trưởng phòng nhân sự',
                        roleUsers: 'Trần Bình Minh, Nguyễn Thị Thủy',
                    }]
                },]
            },
            {
                sheetName: "Danh sách kế thừa phân quyền",
                sheetTitle: "Danh sách kế thừa phân quyền hợp lệ được sử dụng trong import phân quyền",
                tables: [
                    {
                        columns: [{
                            key: "STT",
                            value: translate('human_resource.stt'),
                            width: 7
                        }, {
                            key: "roleName",
                            value: translate('manage_role.name'),
                            width: 40
                        }],
                        data: listRolesConvert
                    }
                ],
            },
            {
                sheetName: "Danh sách nhân viên",
                sheetTitle: "Danh sách nhân viên được sử dụng trong import phân quyền",
                tables: [
                    {
                        columns: [{
                            key: "STT",
                            value: translate('human_resource.stt'),
                            width: 7
                        }, {
                            key: "userName",
                            value: "Tên nhân viên",
                            width: 40
                        }],
                        data: listUserConvert
                    }
                ],
            }
            ]
        }

        return templateImport;
    }

    let exportData = templateImport(translate, role?.list, user?.list);

    return (
        <DialogModal modalID={`modal-import-role`} isLoading={false}
            formID={`modal-import-role`}
            title={'Thêm dữ liệu từ phân quyền file excel'}
            hasSaveButton={false}
            hasNote={false}
            // func={handleImport}
            size={75}>

            <div className="box-body row">
                <div className="form-group col-md-4 col-xs-12">
                    <ImportFileExcel
                        configData={config}
                        handleImportExcel={handleImportExcel}
                    />
                </div>

                <div className="form-group col-md-8 col-xs-12">
                    <ExportExcel id="download_template_annual-leave" exportData={exportData}
                        buttonName={` ${translate('human_resource.download_file')}`} type='button' />
                    {/* <button type="button" className="pull-right btn btn-success" onClick={handleDownloadFileImport} >Tải xuống file mẫu</button> */}
                    <button style={{ marginRight: 10 }} type="button" className="pull-right btn btn-success" onClick={handleImport} >Thêm mới</button>
                </div>
            </div>

            {/* Hiện thị data import */}
            <div className="col-md-12 col-xs-12">
                <ShowImportData
                    id={`import_list_task`}
                    configData={config}
                    importData={valueShow}
                    rowError={rowError}
                    scrollTable={true}
                    checkFileImport={true}
                    limit={limit}
                    page={page}
                // scrollTableWidth={2500
                />
            </div>
        </DialogModal>
    )
}
const mapStateToProps = (state) => {
    const { role, user } = state;
    return { role, user };
};

const mapDispatchToProps = {
    importRoles: RoleActions.importRoles
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalImportRoles));