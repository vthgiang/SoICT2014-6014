import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';


export const kpiTemplateService = {
    getAll,
    getById,
    getAllKpiTemplateByRole,
    getAllKpiTemplateByUser,
    addNewKpiTemplate,
    editKpiTemplate,
    deleteKpiTemplateById,
    importKpiTemplate,
};

/** get all kpi template */
function getAll() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates`,
        method: 'GET',
    }, false, true, 'kpi.kpi_template');
}

/** get a kpi template by id */
function getById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates/${id}`,
        method: 'GET',
    }, false, true, 'kpi.kpi_template');
}

/** get all kpi template by Role */
function getAllKpiTemplateByRole(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates`,
        params: {
            roleId: id
        },
        method: 'GET',
    }, false, true, 'kpi.kpi_template');
}

/** get all kpi template by User
*   Để lấy tất cả kết quả: cho pageNumber=1, noResultsPerPage = 0 
*/
function getAllKpiTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name) {
    var id = getStorage("userId");

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates`,
        method: 'GET',
        params: {
            userId: id,
            pageNumber: pageNumber,
            noResultsPerPage: noResultsPerPage,
            arrayUnit: arrayUnit,
            name: name
        }
    }, false, true, 'kpi.kpi_template');
}

/** add new kpi template */
function addNewKpiTemplate(newKpiTemplate) {
    var id = getStorage("userId");
    newKpiTemplate = { ...newKpiTemplate, creator: id };

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates`,
        method: 'POST',
        data: newKpiTemplate
    }, true, true, 'kpi.kpi_template');
}


function editKpiTemplate(id, newKpiTemplate) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates/${id}`,
        method: 'PATCH',
        data: newKpiTemplate
    }, true, true, 'kpi.kpi_template');
}


/** delete a kpi template */
function deleteKpiTemplateById(id) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates/${id}`,
        method: 'DELETE',
    }, true, true, 'kpi.kpi_template');
}

/** import a kpi Kpi Template  */
function importKpiTemplate(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/kpi/kpi-templates/import`,
        method: 'POST',
        data: data,
    }, true, true, 'kpi.kpi_template');
}