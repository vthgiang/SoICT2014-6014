import React, { Component, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ImportFileExcel, ShowImportData, DialogModal, ExportExcel } from '../../../../common-components';
import { RoleActions } from '../../role/redux/actions';
import { LinkActions } from '../redux/actions';
import cloneDeep from 'lodash/cloneDeep';

function ModalImportLinkPrivilege(props) {
    const [state, setState] = useState({
        checkFileImport: true,
        limit: 100,
        page: 0
    })


    const { translate, role, link, user } = props;
    const { limit, page, valueImport, } = state;
    let { valueShow, rowError } = state;



    function configurationImport() {
        let config = {
            sheets: { // Tên các sheet
                description: 'Thông tin phân quyền trang',
                value: ["Thông tin phân quyền trang"]
            },
            rowHeader: { // Số dòng tiêu đề của bảng
                description: 'Số dòng tiêu đề của bảng',
                value: 1
            },
            linkUrl: {
                columnName: translate('manage_link.url'),
                description: translate('manage_link.url'),
                value: translate('manage_link.url'),
            },
            linkCategory: {
                columnName: translate('manage_link.category'),
                description: translate('manage_link.category'),
                value: translate('manage_link.category'),
            },
            linkDescription: {
                columnName: translate('manage_link.description'),
                description: translate('manage_link.description'),
                value: translate('manage_link.description'),
            },
            linkRoles: {
                columnName: translate('manage_link.roles'),
                description: translate('manage_link.roles'),
                value: translate('manage_link.roles'),
            }
        }
        return config;
    }

    const getLinkRoleId = (linkRole) => {
        const { list } = role;
        let result = [];
        if (linkRole && typeof linkRole === 'string' && list?.length) {
            let linkRoleArray = linkRole.split(",");

            if (linkRoleArray) {
                linkRoleArray.forEach(x => {
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
                // let linkUrl = x?.linkUrl ? getLinkId(x.linkUrl) : [];
                let linkImport = link.list.filter(link => link.url === x.linkUrl);

                let linkDescription = x.linkDescription;
                let linkRoles = x?.linkRoles ? getLinkRoleId(x.linkRoles) : [];
                let roleParentFormat = x?.roleParents ? getRoleParentId(x.roleParents) : [];
                let roleUsers = x?.roleUsers ? getRoleUserId(x?.roleUsers) : [];
                // let roleUsers = x?.roleUsers ? getRoleUserId(x?.roleUsers) : [];

                // const { length } = arr;
                // const id = length + 1;
                // const found = arr.some(el => el.username === name);
                // if (!found) arr.push({ id, username: name });

                if (x.linkUrl === null || !link.list.some(link => link.url === x.linkUrl)) {
                    rowError = [...rowError, index + 1];
                    x = { ...x, error: true };
                }

                if (x.linkUrl === null) {
                    errorAlert = [...errorAlert, 'Tên đường link của trang không được để trống'];
                }
                if (!link.list.some(link => link.url === x.linkUrl)) {
                    errorAlert = [...errorAlert, 'Tên đường link của trang không hợp lệ'];
                }

                // dữ liệu nguyên thuwry như trong file import để show ra
                valueShow = [
                    ...valueShow,
                    {
                        ...x,
                        errorAlert: errorAlert
                    }
                ]

                // dữ liệu này để gửi qua server đã chuẩn hóa
                // valueImport = [
                //     ...valueImport,
                //     {
                //         name: x.roleName,
                //         parents: roleParentFormat,
                //         users: roleUsers,
                //     }
                // ]

                valueImport = [
                    ...valueImport,
                    {
                        linkId: linkImport.length > 0 ? linkImport[0]._id : "",
                        url: x.linkUrl,
                        description: linkDescription,
                        roles: linkRoles,
                    }
                ]
            })
        }
        // console.log(valueImport);
        console.log(valueImport)

        setState({
            ...state,
            valueImport,
            valueShow,
            rowError
        })
    }

    // Kiểm tra 2 aray bằng nhau
    const isEqualArray = (a, b) => {
        // if length is not equal
        if (a.length != b.length)
            return false;
        else {
            // comapring each element of array
            for (var i = 0; i < a.length; i++)
                if (a[i] !== b[i])
                    return false;
            return true;
        }
    }

    const handleImport = () => {
        const { valueImport } = state;

        if (valueImport) {
            for (let k = 0; k < valueImport.length; k++) {
                // chỉ update những link có thay đổi so với các link hiện tại. Kiểm tra thỏa mãn cả 3 điều kiện id, mô tả, roles thì không update
                if (!link.list.some(link => link._id === valueImport[k].linkId && link.description === valueImport[k].description && isEqualArray(link.roles.map(role => role && role.roleId ? role.roleId._id : ""), valueImport[k].roles))) {
                    props.editLink(valueImport[k].linkId, {
                        url: valueImport[k].url,
                        description: valueImport[k].description,
                        roles: valueImport[k].roles
                    });
                    console.log("edit")
                }
            }
        }
    }
    const handleDownloadFileImport = () => {

    }


    const config = configurationImport();
    if (link?.error?.rowError !== undefined) {
        rowError = link.error.rowError;
        valueShow = valueShow.map((x, index) => {

            let errorAlert = link?.error?.data[index]?.errorAlert.map(err => translate(`super_admin.link.${err}`));
            return {
                ...x,
                error: link?.error?.data[index].error,
                errorAlert: errorAlert,
            }
        })

    }
    const templateImport = (translate, listRole, listLink) => {
        const copyListRole = cloneDeep(listRole);
        const copyListLink = cloneDeep(listLink);

        let listRolesConvert = [], listLinkConvert = [];

        copyListRole?.length && copyListRole.forEach((x, index) => {
            listRolesConvert = [...listRolesConvert, {
                STT: index + 1,
                roleName: x.name,
            }];
            // console.log(x)
        });

        copyListLink?.length && copyListLink.forEach((x, index) => {
            listLinkConvert = [...listLinkConvert, {
                STT: index + 1,
                linkUrl: x.url,
                linkCategory: x.category,
                linkDescription: x.description,
                linkRoles: x.roles.map(role => role && role.roleId ? role.roleId.name : "").join(", "),
            }];
            console.log(x.roles.map(role => role && role.roleId ? role.roleId._id : ""))
        })

        let templateImport = {
            fileName: "Mẫu import phân quyền trang",
            dataSheets: [
                {
                    sheetName: "Thông tin phân quyền trang",
                    sheetTitle: "Mẫu import thông tin phân quyền trang",
                    tables: [
                        {
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: translate('human_resource.stt'), width: 7 },
                                { key: "linkUrl", value: translate('manage_link.url'), width: 30 },
                                { key: "linkCategory", value: translate('manage_link.category'), width: 25 },
                                { key: "linkDescription", value: translate('manage_link.description'), width: 45 },
                                { key: "linkRoles", value: translate('manage_link.roles'), width: 70 },
                            ],
                            data: listLinkConvert
                        }
                    ],
                },
                {
                    sheetName: "Danh sách phân quyền",
                    sheetTitle: "Danh sách phân quyền hợp lệ được sử dụng trong import phân quyền trang",
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
                }
            ]
        }

        return templateImport;
    }

    let exportData = templateImport(translate, role?.list, link?.list);

    return (
        <DialogModal modalID={`modal-import-link-privilege`} isLoading={false}
            formID={`modal-import-link-privilege`}
            title={'Cập nhật dữ liệu từ phân quyền trang file excel'}
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
                    <button style={{ marginRight: 10 }} type="button" className="pull-right btn btn-success" onClick={handleImport} >Cập nhật</button>
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
    const { role, link, user } = state;
    return { role, link, user };
};

const mapDispatchToProps = {
    // getLinks: LinkActions.get,
    importRoles: RoleActions.importRoles,
    importLinkPrivilege: LinkActions.importLinkPrivilege,
    editLink: LinkActions.edit,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalImportLinkPrivilege));