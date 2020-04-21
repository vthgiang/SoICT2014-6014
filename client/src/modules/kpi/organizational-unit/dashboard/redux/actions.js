import { dashboardConstants } from "./constants";
import { dashboardServices } from "./services";

export const dashboardActions = {
    getAllKPIUnit,
    // getCurrentKPIUnit,
    // getChildTargetOfCurrentTarget,
    // addKPIUnit,
    evaluateKPIUnit,
}

// lấy tất cả các KPI của đơn vị
function getAllKPIUnit(id) {
    return dispatch => {
        dispatch(request(id));

        dashboardServices.getAllKPIUnit(id)
            .then(
                kpis => dispatch(success(kpis)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: dashboardConstants.GETALL_KPIUNIT_REQUEST, id } }
    function success(kpis) { return { type: dashboardConstants.GETALL_KPIUNIT_SUCCESS, kpis } }
    function failure(error) { return { type: dashboardConstants.GETALL_KPIUNIT_FAILURE, error } }
}

// lấy kpi đơn vị hiện tại
// function getCurrentKPIUnit(id) {
//     return dispatch => {
//         dispatch(request(id));

//         dashboardServices.getCurrentKPIUnit(id)
//             .then(
//                 currentKPI => dispatch(success(currentKPI)),
//                 error => dispatch(failure(error.toString()))
//             );
//     };

//     function request(id) { return { type: dashboardConstants.GETCURRENT_KPIUNIT_REQUEST, id } }
//     function success(currentKPI) { return { type: dashboardConstants.GETCURRENT_KPIUNIT_SUCCESS, currentKPI } }
//     function failure(error) { return { type: dashboardConstants.GETCURRENT_KPIUNIT_FAILURE, error } }
// }

// lấy mục tiêu con của mục tiêu hiện tại
// function getChildTargetOfCurrentTarget(id) {
//     return dispatch => {
//         dispatch(request(id));

//         dashboardServices.getChildTargetOfCurrentTarget(id)
//             .then(
//                 childtarget => dispatch(success(childtarget)),
//                 error => dispatch(failure(error.toString()))
//             );
//     };

//     function request(id) { return { type: dashboardConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST, id } }
//     function success(childtarget) { return { type: dashboardConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS, childtarget } }
//     function failure(error) { return { type: dashboardConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE, error } }
// }

// Khởi tạo KPI đơn vị
// function addKPIUnit(newKPI) {
//     return dispatch => {
//         dispatch(request(newKPI));

//         dashboardServices.addKPIUnit(newKPI)
//             .then(
//                 newKPI => { 
//                     dispatch(success(newKPI));
//                 },
//                 error => {
//                     dispatch(failure(error.toString()));
//                 }
//             );
//     };

//     function request(newKPI) { return { type: dashboardConstants.ADD_KPIUNIT_REQUEST, newKPI } }
//     function success(newKPI) { return { type: dashboardConstants.ADD_KPIUNIT_SUCCESS, newKPI } }
//     function failure(error) { return { type: dashboardConstants.ADD_KPIUNIT_FAILURE, error } }
// }


// Cập nhật dữ liệu cho kpi đơn vị
function evaluateKPIUnit(id) {
    return dispatch => {
        dispatch(request(id));

        dashboardServices.evaluateKPIUnit(id)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: dashboardConstants.EVALUATE_KPIUNIT_REQUEST, id } }
    function success(newKPI) { return { type: dashboardConstants.EVALUATE_KPIUNIT_SUCCESS, newKPI } }
    function failure(error) { return { type: dashboardConstants.EVALUATE_KPIUNIT_FAILURE, error } }
}