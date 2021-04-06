import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SlimScroll } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import "./arrangeVehiclesAndGoods.css";
import { transportRequirementsActions } from "../../transport-requirements/redux/actions";
import { transportVehicleActions } from "../../transport-vehicle/redux/actions"

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function ArrangeVehiclesAndGoods(props) {

    let { allTransportVehicle } = props;

    useEffect(() => {
        props.getAllTransportVehicles({page: 1, limit : 100});
    }, []);

    return (
        <React.Fragment>
            <div className={"divTest"}>
                <table className={"tableTest table-bordered table-hover not-sort"}>
                    <thead>
                        <tr className="word-no-break">
                            <th colSpan={6} rowSpan={3}>{"Yêu cầu vận chuyển"}</th>
                            {
                                (allTransportVehicle && allTransportVehicle.length !== 0) &&
                                allTransportVehicle.map((item, index) => (
                                    item &&
                                    <th key={index}>{item.name}</th>
                                ))
                            }
                            {/* <th colSpan={2}>{"Xe 1"}</th>
                            <th colSpan={2}>{"Xe 1"}</th>
                            <th colSpan={2}>{"Xe 1"}</th> */}
                        </tr>
                        <tr className="word-no-break">
                            {
                                (allTransportVehicle && allTransportVehicle.length !== 0) &&
                                allTransportVehicle.map((item, index) => (
                                    item &&
                                    <td>{"Payload: " + item.payload}</td>
                                ))
                            }
                            {/* <td>{"Trọng tải"}</td>
                            <td>{"Thể tích"}</td>
                            <td>{"Trọng tải"}</td>
                            <td>{"Thể tích"}</td> */}
                        </tr>
                        <tr className="word-no-break">
                            {
                                (allTransportVehicle && allTransportVehicle.length !== 0) &&
                                allTransportVehicle.map((item, index) => (
                                    item &&
                                    <td>{"Volume: " + item.volume}</td>
                                ))
                            }
                            {/* <td>{"1000"}</td> */}
                        </tr>
                    </thead>
                    <tbody className="transport-special-row">
                    <tr className="word-no-break">
                        <th>{"Mã yêu cầu"}</th>
                        <td>{"123"}</td>
                        <th>{"Loại yêu cầu"}</th>
                        <td>{"Giao hàng"}</td>
                        <th>{"Hành động"}</th>
                        <td>{"Xem"}</td>
                        {
                            (allTransportVehicle && allTransportVehicle.length !== 0) &&
                            allTransportVehicle.map((item, index) => (
                                item &&
                                <td rowSpan={3} key={index} className="tooltip-checkbox">
                                    <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                                    <span className="tooltiptext">
                                        <a style={{ color: "white" }} 
                                            // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                        >{"1"}</a>
                                    </span>
                                </td>
                            ))
                        }
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm nhận"}</th>
                        <td colSpan={3}>{"Bách Khoa k k k k k k k k k  k k k k k k k k k "}</td>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm giao"}</th>
                        <td colSpan={3}>{"Thái Hà"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>
                    </tr>

                    <tr className="word-no-break">
                        <th>{"Mã yêu cầu"}</th>
                        <td>{"123"}</td>
                        <th>{"Loại yêu cầu"}</th>
                        <td>{"Giao hàng"}</td>
                        <th>{"Hành động"}</th>
                        <td>{"Xem"}</td>
                        <td colSpan={2} rowSpan={3} key={"2"} className="tooltip-checkbox">
                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                            <span className="tooltiptext">
                                <a style={{ color: "white" }} 
                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                >{"1"}</a>
                            </span>
                        </td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm nhận"}</th>
                        <td colSpan={3}>{"Bách Khoa k k k k k k k k k  k k k k k k k k k "}</td>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm giao"}</th>
                        <td colSpan={3}>{"Thái Hà"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>
                    </tr>

                    <tr className="word-no-break">
                        <th>{"Mã yêu cầu"}</th>
                        <td>{"123"}</td>
                        <th>{"Loại yêu cầu"}</th>
                        <td>{"Giao hàng"}</td>
                        <th>{"Hành động"}</th>
                        <td>{"Xem"}</td>
                        <td colSpan={2} rowSpan={3} key={"2"} className="tooltip-checkbox">
                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                            <span className="tooltiptext">
                                <a style={{ color: "white" }} 
                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                >{"1"}</a>
                            </span>
                        </td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm nhận"}</th>
                        <td colSpan={3}>{"Bách Khoa k k k k k k k k k  k k k k k k k k k "}</td>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm giao"}</th>
                        <td colSpan={3}>{"Thái Hà"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>
                    </tr>
                    
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
    return(
    <div className="col-lg-6 col-md-6 col-sm-5 col-xs-4" style={{ padding: 0 }}>
    <table id={"work-schedule-table-worker"} className="table table-striped table-bordered table-hover not-sort">
        <thead>
            <tr>
                <th colSpan={2}>{"Xe 1"}</th>
                <th colSpan={2}>{"Xe 1"}</th>
                <th colSpan={2}>{"Xe 1"}</th>
                <th colSpan={2}>{"Xe 1"}</th>
            </tr>
            <tr>
                <th>{"Trọng tải"}</th>
                <th>{"Thể tích"}</th>
                <th>{"Trọng tải"}</th>
                <th>{"Thể tích"}</th>
                <th>{"Trọng tải"}</th>
                <th>{"Thể tích"}</th>
                <th>{"Trọng tải"}</th>
                <th>{"Thể tích"}</th>
            </tr>
        </thead>
        <tbody>
            <tr rowSpan={3}>
                <td colSpan={2} key={"1"} className="tooltip-checkbox">
                    <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                    {/* <span className="tooltiptext">
                        <a style={{ color: "white" }} 
                            // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                        >{"1"}</a>
                    </span> */}
                </td>
                <td colSpan={2} key={"2"} className="tooltip-checkbox">
                    <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                    <span className="tooltiptext">
                        <a style={{ color: "white" }} 
                            // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                        >{"1"}</a>
                    </span>
                </td>
                <td colSpan={2} key={"2"} className="tooltip-checkbox">
                    <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                    <span className="tooltiptext">
                        <a style={{ color: "white" }} 
                            // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                        >{"1"}</a>
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
    )

    return(        <div className="box-body qlcv">
    <DataTableSetting
            tableId={"999"}
            setLimit={10}
    />
    <div id="croll-table-worker" className="form-inline">
        <div className="col-lg-6 col-md-6 col-sm-7 col-xs-8" style={{ padding: 0 }}>
            <table id={"999"} className="table table-striped table-bordered not-sort">
                <thead>
                    <tr>
                        <th colSpan={4} rowSpan={2}>{"Yêu cầu vận chuyển"}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colSpan={4}>{" "}</th>
                    </tr>
                    <tr>
                        <th colSpan={4}>{" "}</th>
                    </tr>
                    <tr>
                        <th colSpan={4}>{" "}</th>
                    </tr>
                    <tr>
                        <th colSpan={4}>{" "}</th>
                    </tr>
                    <tr>
                        <th colSpan={4}>{" "}</th>
                    </tr>
                    <tr>
                        <th colSpan={4}>{" "}</th>
                    </tr>
                    <tr>
                        <th>{"Mã yêu cầu"}</th>
                        <td>{"123"}</td>
                        <th>{"Loại yêu cầu"}</th>
                        <td>{"Giao hàng"}</td>
                    </tr>
                    <tr>
                        <th>{"Điểm nhận"}</th>
                        <td>{"Bách Khoa"}</td>
                        <th>{"Điểm giao"}</th>
                        <td>{"Thái Hà"}</td>
                    </tr>
                    <tr>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>

                    </tr>
                </tbody>
            </table>
        </div>
        
        <div className="col-lg-6 col-md-6 col-sm-5 col-xs-4" style={{ padding: 0 }}>
            <table id={"work-schedule-table-worker"} className="table table-striped table-bordered table-hover not-sort">
                <thead>
                    <tr>
                        <th colSpan={2}>{"Xe 1"}</th>
                        <th colSpan={2}>{"Xe 1"}</th>
                        <th colSpan={2}>{"Xe 1"}</th>
                        <th colSpan={2}>{"Xe 1"}</th>
                    </tr>
                    <tr>
                        <th>{"Trọng tải"}</th>
                        <th>{"Thể tích"}</th>
                        <th>{"Trọng tải"}</th>
                        <th>{"Thể tích"}</th>
                        <th>{"Trọng tải"}</th>
                        <th>{"Thể tích"}</th>
                        <th>{"Trọng tải"}</th>
                        <th>{"Thể tích"}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr rowSpan={3}>
                        <td colSpan={2} key={"1"} className="tooltip-checkbox">
                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                            {/* <span className="tooltiptext">
                                <a style={{ color: "white" }} 
                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                >{"1"}</a>
                            </span> */}
                        </td>
                        <td colSpan={2} key={"2"} className="tooltip-checkbox">
                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                            <span className="tooltiptext">
                                <a style={{ color: "white" }} 
                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                >{"1"}</a>
                            </span>
                        </td>
                        <td colSpan={2} key={"2"} className="tooltip-checkbox">
                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                            <span className="tooltiptext">
                                <a style={{ color: "white" }} 
                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                >{"1"}</a>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <SlimScroll outerComponentId='croll-table-worker' innerComponentId='work-schedule-table-worker' innerComponentWidth={1000} activate={true} />
</div>
)
}

function mapState(state) {
    console.log(state, " day la state");
    const transportArrangeRequirements = state.transportRequirements.lists;
    const allTransportVehicle = state.transportVehicle.lists;
    return { transportArrangeRequirements, allTransportVehicle };
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    editTransportRequirement: transportRequirementsActions.editTransportRequirement,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
}

const connectedArrangeVehiclesAndGoods = connect(mapState, actions)(withTranslate(ArrangeVehiclesAndGoods));
export { connectedArrangeVehiclesAndGoods as ArrangeVehiclesAndGoods };