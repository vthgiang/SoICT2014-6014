import { sendRequest } from '../../../../../../helpers/requestHelper'

export const qualityDasboardService = {
  getNumberCreatedInspection,
  getErrorNumByReporter,
  getErrorNumByGroup
}

function getNumberCreatedInspection(query) {
    return sendRequest(
        {
          url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/inspection/numberOfInspections`,
          method: 'GET',
          params: query
        },
        false,
        true,
        'manufacturing.quality.dashboard'
      )
}

function getErrorNumByReporter(query) {
    return sendRequest(
        {
          url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/error/errorNumByReporter`,
          method: 'GET',
          params: query
        },
        false,
        true,
        'manufacturing.quality.dashboard'
      )
}

function getErrorNumByGroup(query) {
    return sendRequest(
        {
          url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/error/errorNumByGroup`,
          method: 'GET',
          params: query
        },
        false,
        true,
        'manufacturing.quality.dashboard'
      )
}
