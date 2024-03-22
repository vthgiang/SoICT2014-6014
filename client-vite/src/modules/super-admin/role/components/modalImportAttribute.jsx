import React, { Component, useState, useEffect, useRef, useLayoutEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ImportFileExcel, ShowImportData, DialogModal, ExportExcel } from '../../../../common-components'
import { RoleActions } from '../redux/actions'
import cloneDeep from 'lodash/cloneDeep'

function ModalImportAttribute(props) {
  const [state, setState] = useState({
    checkFileImport: true,
    limit: 100,
    page: 0
  })

  const { translate, role, link } = props
  const { limit, page, valueImport } = state
  let { valueShow, rowError, rowChange } = state

  // config data for import
  function configurationImport() {
    let config = {
      sheets: {
        // Tên các sheet
        description: 'Thông tin thuộc tính phân quyền',
        value: ['Thông tin thuộc tính phân quyền']
      },
      rowHeader: {
        // Số dòng tiêu đề của bảng
        description: 'Số dòng tiêu đề của bảng',
        value: 1
      },
      attributeName: {
        columnName: translate('manage_role.attribute_name'),
        description: translate('manage_role.attribute_name'),
        value: translate('manage_role.attribute_name')
      },
      attributeDescription: {
        columnName: translate('manage_role.attribute_description'),
        description: translate('manage_role.attribute_description'),
        value: translate('manage_role.attribute_description')
      }
    }
    role.list?.length &&
      role.list.forEach((x) => {
        // Thêm các column là tên các role trong hệ thống
        config[x.name] = {
          columnName: x.name,
          description: x.name,
          value: x.name
        }
      })
    return config
  }

  // config data for show
  function configurationShow() {
    let config = {
      sheets: {
        // Tên các sheet
        description: 'Thông tin phân quyền trang',
        value: ['Thông tin phân quyền trang']
      },
      rowHeader: {
        // Số dòng tiêu đề của bảng
        description: 'Số dòng tiêu đề của bảng',
        value: 1
      },
      linkUrl: {
        columnName: translate('manage_role.attribute_name'),
        description: translate('manage_role.attribute_name'),
        value: translate('manage_role.attribute_name')
      },
      linkCategory: {
        columnName: translate('manage_role.category'),
        description: translate('manage_role.category'),
        value: translate('manage_role.category')
      },
      linkDescription: {
        columnName: translate('manage_role.attribute_description'),
        description: translate('manage_role.attribute_description'),
        value: translate('manage_role.attribute_description')
      },
      linkRolesCurrent: {
        columnName: translate('manage_role.roles') + ' hiện tại',
        description: translate('manage_role.roles') + ' hiện tại',
        value: translate('manage_role.roles') + ' hiện tại'
      },
      linkRoles: {
        columnName: translate('manage_role.roles') + ' trong file',
        description: translate('manage_role.roles') + ' trong file',
        value: translate('manage_role.roles') + ' trong file'
      }
    }
    return config
  }

  const getLinkRoleId = (linkRole) => {
    const { list } = role
    let result = []
    let validRole = true
    if (linkRole && typeof linkRole === 'string' && list?.length) {
      let linkRoleArray = linkRole.split(',')

      if (linkRoleArray) {
        linkRoleArray.forEach((x) => {
          for (let k = 0; k < list.length; k++) {
            if (list[k].name.trim() === x?.trim()) {
              result = [...result, list[k]._id]
              validRole = true
              break
            } else {
              validRole = false
            }
          }
          if (!validRole) {
            result = [...result, null]
          }
        })
      }
    }
    return result
  }

  const handleImportExcel = (value) => {
    let rowError = []
    let rowChange = []
    let valueShow = [],
      valueImport = []

    if (value?.length) {
      value.forEach((x, index) => {
        let errorAlert = []

        // Lấy link import
        let linkImport = link.list.filter((link) => link.url === x.linkUrl)
        let linkDescription = x.linkDescription
        let linkCategory = x.linkCategory
        let linkRolesCurrent =
          linkImport.length > 0 ? linkImport[0].roles.map((role) => (role && role.roleId ? role.roleId.name : '')).join(', ') : ''
        let xLinkRolesConcatenate = []

        role.list?.length &&
          role.list.forEach((y, index) => {
            // Kiểm tra nếu cột của role đánh x thì concat linkRole
            if (x[y.name] != null && (x[y.name].trim().toLowerCase() === 'x' || x[y.name].trim().length > 0)) {
              xLinkRolesConcatenate[index] = y.name
            }
          })
        x = {
          ...x,
          linkRoles: xLinkRolesConcatenate.filter(Boolean).join(', ')
        }

        // lấy ds id của các role import từ file
        let linkRoles = x?.linkRoles ? getLinkRoleId(x.linkRoles) : []

        // Kiểm tra link hợp lệ: link có trong ds các link trong hệ thống không
        let validLink = link.list.some((link) => link.url === x.linkUrl)

        // Kiểm tra danh mục
        let validCategory = link.list.some((link) => link.category === linkCategory)

        // Kiểm tra role hợp lệ, role nhập vào có trong ds các role có trong hệ thống ko
        let validRole = linkRoles.every((linkRoleId) => role.list.map((role) => role._id).includes(linkRoleId))

        if (x.linkUrl === null || linkCategory === null || !validCategory || !validLink || (linkRoles.length > 0 && !validRole)) {
          rowError = [...rowError, index + 1]
          x = { ...x, error: true }
        }
        // else {
        //     x = { ...x, error: false };
        // }
        if (x.linkUrl === null) {
          errorAlert = [...errorAlert, 'Tên đường link của trang không được để trống']
        }
        if (!validLink) {
          errorAlert = [...errorAlert, 'Tên đường link của trang không hợp lệ']
        }
        if (linkCategory === null) {
          errorAlert = [...errorAlert, 'Tên danh mục của trang không được để trống']
        }
        if (!validCategory) {
          errorAlert = [...errorAlert, 'Tên danh mục của trang không hợp lệ']
        }
        if (linkRoles.length > 0 && !validRole) {
          errorAlert = [...errorAlert, 'Tên role được truy cập trang không hợp lệ']
        }
        if (
          !x.error &&
          !link.list.some(
            (link) =>
              link._id === (linkImport.length > 0 ? linkImport[0]._id : '') &&
              link.description === linkDescription &&
              isEqualArray(
                link.roles.map((role) => (role && role.roleId ? role.roleId._id : '')),
                linkRoles
              )
          )
        ) {
          rowChange = [...rowChange, index + 1]
          x = { ...x, change: true }
        }

        // dữ liệu nguyên thủy như trong file import để show ra
        valueShow = [
          ...valueShow,
          {
            linkCategory: x.linkCategory,
            linkDescription: x.linkDescription,
            linkRoles: x.linkRoles,
            linkRolesCurrent: linkRolesCurrent,
            linkUrl: x.linkUrl,
            error: x.error,
            errorAlert: errorAlert,
            change: x.change
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
            linkId: linkImport.length > 0 ? linkImport[0]._id : '',
            url: x.linkUrl,
            description: linkDescription,
            roles: linkRoles,
            valid: x.error ? !x.error : true
          }
        ]
      })
    }

    setState({
      ...state,
      valueImport,
      valueShow,
      rowError,
      rowChange
    })
  }

  // Kiểm tra 2 aray bằng nhau
  const isEqualArray = (a, b) => {
    // if length is not equal
    if (a.length != b.length) return false
    else {
      // comapring each element of array
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
      return true
    }
  }

  const handleImport = () => {
    const { valueImport } = state

    if (valueImport) {
      for (let k = 0; k < valueImport.length; k++) {
        // chỉ update những link có thay đổi so với các link hiện tại và hợp lệ. Kiểm tra thỏa mãn cả 3 điều kiện id, mô tả, roles thì không update
        if (
          valueImport[k].valid &&
          !link.list.some(
            (link) =>
              link._id === valueImport[k].linkId &&
              link.description === valueImport[k].description &&
              isEqualArray(
                link.roles.map((role) => (role && role.roleId ? role.roleId._id : '')),
                valueImport[k].roles
              )
          )
        ) {
          props.editLink(valueImport[k].linkId, {
            url: valueImport[k].url,
            description: valueImport[k].description,
            roles: valueImport[k].roles
          })
          console.log('edit')
        }
      }
    }
  }
  const handleDownloadFileImport = () => {}

  const config = configurationImport()
  const configShow = configurationShow()
  if (link?.error?.rowError !== undefined) {
    rowError = link.error.rowError
    valueShow = valueShow.map((x, index) => {
      let errorAlert = link?.error?.data[index]?.errorAlert.map((err) => translate(`super_admin.link.${err}`))
      return {
        ...x,
        error: link?.error?.data[index].error,
        errorAlert: errorAlert
      }
    })
  }

  // Template file import theo dạng liệt kê role
  // const templateImport = (translate, listRole, listLink) => {
  //     const copyListRole = cloneDeep(listRole);
  //     const copyListLink = cloneDeep(listLink);

  //     let listRolesConvert = [], listLinkConvert = [];

  //     copyListRole?.length && copyListRole.forEach((x, index) => {
  //         listRolesConvert = [...listRolesConvert, {
  //             STT: index + 1,
  //             roleName: x.name,
  //         }];
  //         // console.log(x)
  //     });

  //     copyListLink?.length && copyListLink.forEach((x, index) => {
  //         listLinkConvert = [...listLinkConvert, {
  //             STT: index + 1,
  //             linkUrl: x.url,
  //             linkCategory: x.category,
  //             linkDescription: x.description,
  //             linkRoles: x.roles.map(role => role && role.roleId ? role.roleId.name : "").join(", "),
  //         }];
  //         // console.log(x.roles.map(role => role && role.roleId ? role.roleId._id : ""))
  //     })

  //     let templateImport = {
  //         fileName: "Mẫu import phân quyền trang",
  //         dataSheets: [
  //             {
  //                 sheetName: "Thông tin phân quyền trang",
  //                 sheetTitle: "Mẫu import thông tin phân quyền trang",
  //                 tables: [
  //                     {
  //                         rowHeader: 1,
  //                         columns: [
  //                             { key: "STT", value: translate('human_resource.stt'), width: 7 },
  //                             { key: "linkUrl", value: translate('manage_role.attribute_name'), width: 30 },
  //                             { key: "linkCategory", value: translate('manage_role.category'), width: 25 },
  //                             { key: "linkDescription", value: translate('manage_role.attribute_description'), width: 45 },
  //                             { key: "linkRoles", value: translate('manage_role.roles'), width: 70 },
  //                         ],
  //                         data: listLinkConvert
  //                     }
  //                 ],
  //             },
  //             {
  //                 sheetName: "Danh sách phân quyền",
  //                 sheetTitle: "Danh sách phân quyền hợp lệ được sử dụng trong import phân quyền trang",
  //                 tables: [
  //                     {
  //                         columns: [{
  //                             key: "STT",
  //                             value: translate('human_resource.stt'),
  //                             width: 7
  //                         }, {
  //                             key: "roleName",
  //                             value: translate('manage_role.name'),
  //                             width: 40
  //                         }],
  //                         data: listRolesConvert
  //                     }
  //                 ],
  //             }
  //         ]
  //     }

  //     return templateImport;
  // }

  //Template file import theo dạng tích x vào cột tên role tương ứng
  const templateImportCheckBox = (translate, listRole, listLink) => {
    const copyListRole = cloneDeep(listRole)
    const copyListLink = cloneDeep(listLink)

    let listRolesConvert = [],
      listLinkConvert = []

    let allRoleColumn = [
      { key: 'STT', value: translate('human_resource.stt'), width: 7 },
      { key: 'linkUrl', value: translate('manage_role.attribute_name'), width: 30 },
      { key: 'linkCategory', value: translate('manage_role.category'), width: 25 },
      { key: 'linkDescription', value: translate('manage_role.attribute_description'), width: 45 }
    ]

    copyListRole?.length &&
      copyListRole.forEach((x, index) => {
        listRolesConvert = [
          ...listRolesConvert,
          {
            STT: index + 1,
            roleName: x.name
          }
        ]

        // Thêm các column là tên các role trong hệ thống
        allRoleColumn = [
          ...allRoleColumn,
          {
            key: 'canRole' + (index + 1) + 'Access',
            value: x.name,
            width: 15
          }
        ]
      })

    copyListLink?.length &&
      copyListLink.forEach((x, indexLink) => {
        listLinkConvert = [
          ...listLinkConvert,
          {
            STT: indexLink + 1,
            linkUrl: x.url,
            linkCategory: x.category,
            linkDescription: x.description
          }
        ]

        // Thêm cặp key là canRoleAccess và value là x nếu role dc phép truy cập link
        copyListRole?.length &&
          copyListRole.forEach((y, indexRole) => {
            let roleKey = 'canRole' + (indexRole + 1) + 'Access'
            listLinkConvert[indexLink][roleKey] = x.roles.map((role) => (role && role.roleId ? role.roleId._id : '')).includes(y._id)
              ? 'x'
              : ''
          })
      })

    let templateImport = {
      fileName: 'Mẫu import phân quyền trang',
      dataSheets: [
        {
          sheetName: 'Thông tin phân quyền trang',
          sheetTitle: 'Mẫu import thông tin phân quyền trang',
          tables: [
            {
              rowHeader: 1,
              note: 'Lưu ý: Không sửa tên các cột',
              columns: allRoleColumn,
              data: listLinkConvert,
              moreInform: [
                {
                  title: 'Hướng dẫn:',
                  value: ['Điền x vào ô tại cột Tên phân quyền được phép truy cập đến đường link ở hàng tương ứng']
                }
              ]
            }
          ]
        },
        {
          sheetName: 'Danh sách phân quyền',
          sheetTitle: 'Danh sách phân quyền hợp lệ được sử dụng trong import phân quyền trang',
          tables: [
            {
              columns: [
                {
                  key: 'STT',
                  value: translate('human_resource.stt'),
                  width: 7
                },
                {
                  key: 'roleName',
                  value: translate('manage_role.name'),
                  width: 40
                }
              ],
              data: listRolesConvert
            }
          ]
        }
      ]
    }

    return templateImport
  }

  let exportData = templateImportCheckBox(translate, role?.list, link?.list)

  return (
    <DialogModal
      modalID={`modal-import-link-privilege`}
      isLoading={false}
      formID={`modal-import-link-privilege`}
      title={'Cập nhật dữ liệu từ phân quyền trang file excel'}
      hasSaveButton={false}
      hasNote={false}
      // func={handleImport}
      size={75}
    >
      <div className='box-body row'>
        <div className='form-group col-md-4 col-xs-12'>
          <ImportFileExcel configData={config} handleImportExcel={handleImportExcel} />
        </div>

        <div className='form-group col-md-8 col-xs-12'>
          <ExportExcel
            id='download_template_annual-leave'
            exportData={exportData}
            buttonName={` ${translate('human_resource.download_file')}`}
            type='button'
          />
          {/* <button type="button" className="pull-right btn btn-success" onClick={handleDownloadFileImport} >Tải xuống file mẫu</button> */}
          <button style={{ marginRight: 10 }} type='button' className='pull-right btn btn-success' onClick={handleImport}>
            Cập nhật
          </button>
        </div>
      </div>

      {/* Hiện thị data import */}
      <div className='col-md-12 col-xs-12'>
        <ShowImportData
          id={`import_list_task`}
          configData={configShow}
          importData={valueShow}
          rowError={rowError}
          rowChange={rowChange}
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
  const { role, link } = state
  return { role, link }
}

const mapDispatchToProps = {
  // importLinkPrivilege: LinkActions.importLinkPrivilege,
  // editLink: LinkActions.edit,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalImportAttribute))
