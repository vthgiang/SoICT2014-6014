import { sendRequest } from '../../../../../helpers/requestHelper'
import sendExternalRequest from "../../../../../helpers/requestExternalServerHelpers"

export const CategoryServices = {
  getCategories,
  getCategoryToTree,
  getCategoriesByType,
  createCategory,
  editCategory,
  deleteCategory,
  deleteManyCategories,
  importCategory,
  syncCreateCategory
}

function getCategories(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.category_management'
  )
}

function getCategoryToTree() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories/category-tree`,
      method: 'GET'
    },
    false,
    true,
    'manage_warehouse.category_management'
  )
}

function getCategoriesByType(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories/by-type`,
      method: 'GET',
      params
    },
    false,
    true,
    'manage_warehouse.category_management'
  )
}

function createCategory(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_warehouse.category_management'
  )
}

function editCategory(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_warehouse.category_management'
  )
}

function deleteCategory(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'manage_warehouse.category_management'
  )
}

function deleteManyCategories(array) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories/delete-many`,
      method: 'POST',
      data: { array }
    },
    true,
    true,
    'manage_warehouse.category_management'
  )
}

function importCategory(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/categories/imports`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_warehouse.category_management'
  )
}

function syncCreateCategory(data) {
  return sendExternalRequest.post("/goods-groups", data);
}
