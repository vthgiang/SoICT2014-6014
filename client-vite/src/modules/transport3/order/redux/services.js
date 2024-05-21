import { sendRequest } from '../../../../helpers/requestHelper'

export const orderServices = {
  getAllOrder: (query) => {
    return sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/transport/v3/order`,
        method: 'GET',
        params: {
          page: query?.page ? query.page : null,
          perPage: query?.perPage ? query.perPage : null
        }
      },
      false,
      true,
      'manage_transportation.vehicle_management'
    )
  }
}
