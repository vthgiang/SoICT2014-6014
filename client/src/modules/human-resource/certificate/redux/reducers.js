import { CertificateConstant } from './constants'

const initState = {
  isLoading: false,
  totalList: 0,
  listCertificate: [],
  error: ''
}

export function certificate(state = initState, action) {
  switch (action.type) {
    case CertificateConstant.GET_CERTIFICATE_REQUEST:
    case CertificateConstant.CREATE_CERTIFICATE_REQUEST:
    case CertificateConstant.DELETE_CERTIFICATE_REQUEST:
    case CertificateConstant.UPDATE_CERTIFICATE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case CertificateConstant.GET_CERTIFICATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCertificate: action.payload !== undefined ? action.payload : [],
        totalList: action.payload.totalList
      }
    case CertificateConstant.CREATE_CERTIFICATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCertificate: action.payload !== undefined ? action.payload : [],
        totalList: action.payload.totalList
      }
    case CertificateConstant.DELETE_CERTIFICATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCertificate: action.payload !== undefined ? action.payload : [],
        totalList: action.payload.totalList
      }
    case CertificateConstant.UPDATE_CERTIFICATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCertificate: action.payload !== undefined ? action.payload : []
      }
    case CertificateConstant.GET_CERTIFICATE_FAILURE:
    case CertificateConstant.CREATE_CERTIFICATE_FAILURE:
    case CertificateConstant.DELETE_CERTIFICATE_FAILURE:
    case CertificateConstant.UPDATE_CERTIFICATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    default:
      return state
  }
}
