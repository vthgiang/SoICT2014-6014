import { sendRequest } from '../../../../helpers/requestHelper'

export const BiddingPackageService = {
  getBiddingPackageDocument
}

/**
 * Import thông tin nhân viên
 * @param {*} data : dữ liệu thông tin nhân viên cần import
 */
function getBiddingPackageDocument(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/bidding-package/bidding-packages/${data}/document`,
      method: 'GET',
      responseType: 'blob',
      params: {
        data
      }
    },
    false,
    true,
    'human_resource.profile.bidding_package'
  )
}
