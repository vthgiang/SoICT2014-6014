import { sendRequest } from '../../../../helpers/requestHelper'

/** Lấy các system page api */
const getSystemPageApis = (params) => {
  /**
   * params contain pageUrl and  perPage
   */

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/system-admin/system-page/apis`,
      method: 'GET',
      params
    },
    false,
    true,
    'system_admin.system_page'
  )
}
const getSystemAdminPage = (queryData) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/system-admin/system-page/getSystemAdminPage`,
      method: 'GET',
      params: {
        exampleName: queryData?.exampleName ? queryData.exampleName : '',
        page: queryData?.page ? queryData.page : null,
        perPage: queryData?.perPage ? queryData.perPage : null
      }
    },
    false,
    true,
    'system_admin.system_page'
  )
}
const addSystemAdminPage = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/system-admin/system-page/addSystemAdminPage`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'system_admin.system_page'
  )
}
const deleteSystemAdminPage = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/system-admin/system-page/deleteSystemAdminPage`,
      method: 'DELETE',
      data: {
        exampleIds: data?.exampleIds
      }
    },
    true,
    true,
    'system_admin.system_page'
  )
}

export const SystemPageServices = {
  getSystemPageApis,
  getSystemAdminPage,
  addSystemAdminPage,
  deleteSystemAdminPage
}
