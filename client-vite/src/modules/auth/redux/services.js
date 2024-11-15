import { getStorage } from '../../../config'
import { sendRequest } from '../../../helpers/requestHelper'
import sendExternalRequest from "../../../helpers/requestExternalServerHelpers"

export const AuthService = {
  login,
  editProfile,
  getLinksOfRole,
  refresh,
  logout,
  logoutAllAccount,
  forgotPassword,
  resetPassword,
  getComponentOfUserInLink,
  changeInformation,
  changePassword,
  downloadFile,
  createPassword2,
  deletePassword2,
  checkLinkValid,
  getExternalServerSessionId,
  logoutExternalSystem
}

async function login(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/login`,
      method: 'POST',
      data
    },
    false,
    false,
    'auth'
  )
}

function logout() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/logout`,
      method: 'GET'
    },
    false,
    true,
    'auth'
  )
}

function logoutAllAccount() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/logout-all-account`,
      method: 'GET'
    },
    false,
    true,
    'auth'
  )
}

function editProfile(data) {
  const id = getStorage('userId')

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/user/users/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'auth'
  )
}

function changeInformation(data) {
  const id = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/profile/${id}/change-information`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'auth'
  )
}

function changePassword(data, type) {
  console.log('type', type)
  const id = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/profile/${id}/change-password`,
      method: 'PATCH',
      data,
      params: { type }
    },
    true,
    true,
    'auth'
  )
}

function getLinksOfRole(idRole) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/get-links-that-role-can-access/${idRole}`,
      method: 'GET',
      params: {
        userId
      }
    },
    false,
    true,
    'auth'
  )
}

function refresh() {
  const id = getStorage('userId')

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/get-profile/${id}`,
      method: 'GET'
    },
    false,
    true,
    'auth'
  )
}

function forgotPassword(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/forget-password`,
      method: 'POST',
      data
    },
    true,
    true,
    'auth'
  )
}

function resetPassword(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/reset-password`,
      method: 'POST',
      data
    },
    true,
    true,
    'auth'
  )
}

function getComponentOfUserInLink(currentRole, linkId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/component/components`,
      method: 'GET',
      params: {
        currentRole,
        linkId,
        userId: getStorage('userId')
      }
    },
    false,
    true,
    'auth'
  )
}

/**
 * Download file
 * @param {*} path: đường dẫn file cần tải
 */
function downloadFile(path, type) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/download-file/`,
      method: 'GET',
      responseType: type ? undefined : 'blob',
      params: {
        path,
        type
      }
    },
    false,
    false,
    'auth'
  )
}

function createPassword2(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/profile/create-password2`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'auth'
  )
}

function deletePassword2(data) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/profile/${userId}/delete-password2`,
      method: 'DELETE',
      data: {
        pwd2: data
      }
    },
    true,
    true,
    'auth'
  )
}

function checkLinkValid(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/auth/reset-password`,
      method: 'GET',
      params: {
        token: data.token
      }
    },
    false,
    false,
    'auth'
  )
}

function getExternalServerSessionId() {
  const user = {
    "email": `${process.env.REACT_APP_EXTERNAL_SYSTEM_EMAIL}`,
    "password": `${process.env.REACT_APP_EXTERNAL_SYSTEM_PASSWORD}`
  }
  return sendExternalRequest.post("/sign-in", user);
}

function logoutExternalSystem(user) {
  return sendExternalRequest.post("/sign-out", user);
}
