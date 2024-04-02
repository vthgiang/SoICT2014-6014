import { sendRequest } from "../../../../helpers/requestHelper"

export const managerChainServices = {
    getChains,
    getChainTemplateById,
    createChainTemplate,
    editChainTemplate,
    deleteChainTemplate,
    getAllAssetTemplate,
    getAssetTemplateById,
    createAssetTemplate
}

function getChainTemplateById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manufacturing-chain/${id}`,
        method: "GET",
    },
        true,
        true,
        "manufacturing-chain"
    )
}

function getChains(queryData) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manufacturing-chain`,
        method: "GET",
        params: {
            processName: queryData !== undefined ? queryData.processName : "",
            page: queryData !== undefined ? queryData.page : null,
            perPage: queryData !== undefined ? queryData.perPage : null,
        }
    },
        false,
        true,
        "manufacturing-chain"
    );
}

function createChainTemplate(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manufacturing-chain`,
        method: "POST",
        data: data,
    },
        true,
        true,
        "manufacturing-chain"
    )
}

function editChainTemplate(id, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manufacturing-chain/${id}`,
        method: "PATCH",
        data: data,
    },
        true,
        true,
        "manufacturing-chain"
    )
}

function deleteChainTemplate(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/manufacturing-chain/${id}`,
        method: "DELETE",
    },
        true,
        true,
        "manufacturing-chain"
    )
}

function getAssetTemplateById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset-template/${id}`,
        method: "GET",
    },
        true,
        true,
        "asset-template"
    )
}

function getAllAssetTemplate(queryData) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset-template`,
        method: "GET",
        params: {
            templateName: queryData !== undefined ? queryData.templateName : "",
            page: queryData !== undefined ? queryData.page : null,
            perPage: queryData !== undefined ? queryData.perPage : null,
        }
    },
        false,
        true,
        "asset-template"
    );
}

function createAssetTemplate(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/asset-template`,
        method: "POST",
        data: data,
    },
        true,
        true,
        "asset-template"
    )
}