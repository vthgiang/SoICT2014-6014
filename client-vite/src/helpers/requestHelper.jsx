import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import { clearStorage, getStorage } from '../config'
import ServerResponseAlert from '../modules/alert/components/serverResponseAlert'
import JSEncrypt from 'jsencrypt'
// import { key } from './pub.json';

const key =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6J3DDsYRVeZ4g8HI5ni4Izb4xkepWp/ArqrI162hF7P/9sMegdeSKS9VAcqJzTFwTsrl2VB7c7jmISCLHLOcwlxeCGPaGqdTgKVKWne8bugb9XbOn2eEcBmj7hlzKC+0rP3pwszvBEjougI2vWi9Hd10LutwaCxyjEhtTyWYd1op5FjwBidA/UViAtZ0QMXp9Y44pk5IlFlolodFBBB0Hv/JvZy2M+7LNjM6c01q6UeOkl1BZz2mqM2gDp4p7EPu+CqODjjySV76C8k0QxqejUKoXPr7KMF7SsgxI9KeCvriltDxmhlhRiUnGniPWE+EVVbzdSQ/HBh0h7F2t8d4QQIDAQAB\n-----END PUBLIC KEY-----'

function encryptMessage(message) {
  const publicKey = key
  const jsEncrypt = new JSEncrypt()
  jsEncrypt.setPublicKey(publicKey)

  return jsEncrypt.encrypt(message)
}

const AuthenticateHeader = async () => {
  // const fpAgent = await FingerprintJS.load();
  // const result = await fpAgent.get();
  // const fingerprint = result.visitorId;

  return {
    crtp: encryptMessage(window.location.pathname),
    // "fgp": encryptMessage(fingerprint.toString()),
    fgp: encryptMessage(window.location.pathname),
    utk: getStorage('jwt'),
    crtr: encryptMessage(getStorage('currentRole'))
  }
}

/**
 * Check có xảy ra lỗi liên quan đến xác thực người dùng hay không?
 * @error_auth mảng các mã lỗi
 */
const checkErrorAuth = (code) => {
  const error_auth = [
    'access_denied',
    'page_access_denied',
    'role_invalid',
    'user_role_invalid',
    'service_off',
    'fingerprint_invalid',
    'service_permisson_denied',
    'auth_error',
    'requester_not_found'
  ]
  if (error_auth.indexOf(code) !== -1) return true
  return false
}

const showAuthResponseAlertAndRedirectToLoginPage = async () => {
  await window.$(`#alert-error-auth`).modal({ backdrop: 'static', keyboard: false, display: 'show' })
}

const showServerDisconnectedError = async () => {
  await window.$(`#alert-error-server-disconnected`).modal({ display: 'show' })
}

/**
 * Hàm gọi request đến server
 * @param {*} data Cấu trúc của data bao gồm (url method, data)
 * @url : url của api gọi đến
 * @method : phương thức gọi
 * @data : data truyền đi - có thể có hoặc không
 */
export async function sendRequest(
  options,
  showSuccessAlert = false,
  showFailAlert = true,
  module,
  successTitle = 'general.success',
  errorTitle = 'general.error'
) {
  const requestOptions = {
    url: options.url,
    method: options.method,
    data: options.data,
    params: options.params,
    responseType: options.responseType,
    headers: await AuthenticateHeader()
  }

  return axios(requestOptions)
    .then((res) => {
      const messages = Array.isArray(res.data.messages) ? res.data.messages : [res.data.messages]
      showSuccessAlert &&
        toast.success(
          <ServerResponseAlert type='success' title={successTitle} content={messages.map((message) => `${module}.${message}`)} />,
          { containerId: 'toast-notification' }
        )
      return Promise.resolve(res)
    })
    .catch((err) => {
      let messages
      if (!err.response) {
        showServerDisconnectedError()
      } else {
        messages = Array.isArray(err.response.data.messages) ? err.response.data.messages : [err.response.data.messages]
      }

      if (messages) {
        if (checkErrorAuth(messages[0])) showAuthResponseAlertAndRedirectToLoginPage()
        else if (messages[0] === 'acc_log_out') {
          clearStorage()
        }
        // else if (messages[0] === 'auth_password2_found') // Nếu người dùng chưa có mật khảu cấp 2 thì chuyển hướng tới trang thêm mới mkc2
        //     store.dispatch({ type: AuthConstants.REDIRECT_AUTH_QUESTION_PAGE, payload: err.response.data.content.token });
        else {
          showFailAlert &&
            toast.error(
              <ServerResponseAlert type='error' title={errorTitle} content={messages.map((message) => `${module}.${message}`)} />,
              { containerId: 'toast-notification' }
            )
        }
      }

      return Promise.reject(err)
    })
}
