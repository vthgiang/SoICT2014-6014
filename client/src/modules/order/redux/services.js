import { LOCAL_SERVER_API } from "../../../env";
import { sendRequest } from "../../../helpers/requestHelper";

export const orderServices = {
  getAllOrders,
  createNewOrder,
  editOrder,
  deleteOrder,
};

function getAllOrders(queryData) {
  return sendRequest(
    {
      url: `${LOCAL_SERVER_API}/orders`,
      method: "GET",
      params: {
        code: queryData !== undefined ? queryData.code : "",
        page: queryData !== undefined ? queryData.page : null,
        limit: queryData !== undefined ? queryData.limit : null,
      },
    },
    false,
    true,
    "manage_order"
  );
}

function createNewOrder(dataOrder) {
  return sendRequest(
    {
      url: `${LOCAL_SERVER_API}/orders`,
      method: "POST",
      data: dataOrder,
    },
    true,
    true,
    "manage_order"
  );
}

function editOrder(id, dataEdit) {
  return sendRequest(
    {
      url: `${LOCAL_SERVER_API}/orders/${id}`,
      method: "PATCH",
      data: dataEdit,
    },
    true,
    true,
    "manage_order"
  );
}

function deleteOrder(id) {
  return sendRequest(
    {
      url: `${LOCAL_SERVER_API}/orders/${id}`,
      method: "DELETE",
    },
    true,
    true,
    "manage_order"
  );
}