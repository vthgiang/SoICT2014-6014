import { sendRequest } from '../../../../../helpers/requestHelper'

export const commandServices = {
  getAllManufacturingCommands,
  getDetailManufacturingCommand,
  handleEditCommand,
  getNumberCommands,
  getNumberCommandsStatus,
  getTopTenProduct,
  getFuctuatingProduct
}

function getAllManufacturingCommands(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-command`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.command'
  )
}

function getDetailManufacturingCommand(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-command/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.command'
  )
}

function handleEditCommand(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-command/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manufacturing.command'
  )
}

function getNumberCommands(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-command/get-number-commands`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.command'
  )
}

function getNumberCommandsStatus(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-command/get-number-commands-by-status`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.command'
  )
}

function getTopTenProduct(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-command/get-top-ten-product`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.command'
  )
}

function getFuctuatingProduct(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-command/get-fluctuating-product`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.command'
  )
}
