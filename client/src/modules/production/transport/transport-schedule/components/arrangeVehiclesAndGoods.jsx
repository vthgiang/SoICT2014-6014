import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SlimScroll, SelectBox } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import "./arrangeVehiclesAndGoods.css";
import { transportRequirementsActions } from "../../transport-requirements/redux/actions";
import { transportVehicleActions } from "../../transport-vehicle/redux/actions";
import { transportScheduleActions } from "../redux/actions";
import { transportPlanActions } from "../../transport-plan/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function ArrangeVehiclesAndGoods(props) {

    let { allTransportPlans, currentTransportSchedule} = props;

    const [currentTransportPlan, setCurrentTransportPlan] = useState({
        _id: "0",
        code: "",
    });    

    const [transportArrangeRequirements, setAransportArrangeRequirements] = useState([]);
    const [allTransportVehicle, setAllTransportVehicle] = useState([]);
    
    const getListTransportPlans = () => {
        let listTransportPlans = [
            {
                value: "0",
                text: "Lịch trình",
            },
        ];        
        if (allTransportPlans) {
            allTransportPlans.map((item) => {
                listTransportPlans.push({
                    value: item._id,
                    text: item.code,
                });
            });
        }
        return listTransportPlans;
    }

    const handleTransportPlanChange = (value) => {
        if (value[0] !== "0" && allTransportPlans){
            let filterPlan = allTransportPlans.filter((r) => r._id === value[0]);
            if (filterPlan.length > 0){
                setCurrentTransportPlan(filterPlan[0]);
            }
        }
        else{
            setCurrentTransportPlan({_id: value[0], code: ""});
        }
    }
    useEffect(() => {
        props.getAllTransportVehicles({page: 1, limit : 100});
        props.getAllTransportRequirements({page: 1, limit: 100});
        props.getAllTransportPlans({page: 1, limit: 100});
    }, []);

    useEffect(() => {
        if (currentTransportPlan && currentTransportPlan._id !==0){
            props.getTransportScheduleByPlanId(currentTransportPlan._id);
        }
    }, [currentTransportPlan])

    useEffect(() => {
        console.log(currentTransportSchedule, " currentTransportSchedule")
        if (currentTransportSchedule){
            if (currentTransportSchedule.transportPlan){
                setAransportArrangeRequirements(currentTransportSchedule.transportPlan.transportRequirements);
                setAllTransportVehicle(currentTransportSchedule.transportPlan.transportVehicles);
            }
        }
    }, [currentTransportSchedule])

    return (
        <React.Fragment>
        <div className="box-body qlcv">
            <div className="form-inline">
                <div className="form-group">
                    <label className="form-control-static">Chọn lịch trình</label>
                    <SelectBox
                        id={`select-filter-status-discounts`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={currentTransportPlan._id}
                        items={getListTransportPlans()}
                        onChange={handleTransportPlanChange}
                        // onChange={this.handleQueryDateChange}
                    />
                </div>

                <div className="form-group">
                    <button type="button" className="btn btn-success" title="Lọc" 
                        // onClick={this.handleSubmitSearch}
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>
                        

            <div className={"divTest"}>
                <table className={"tableTest table-bordered table-hover not-sort"}>
                    <thead>
                        <tr className="word-no-break">
                            <th rowSpan={3}>{"STT"}</th>
                            <th colSpan={3} rowSpan={3}>{"Yêu cầu vận chuyển"}</th>
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
                        
                    {
                            (transportArrangeRequirements && transportArrangeRequirements.length !==0) &&
                            transportArrangeRequirements.map((item, index) => (
                                item &&
                                <tr className="word-no-break">
                                <td>
                                    {index+1}
                                </td>
                                <td>
                                    <div>
                                        <p className="p-header">
                                            {"Mã yêu cầu:"}
                                        </p>
                                        <p>
                                            {"123"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="p-header">
                                            {"Loại yêu cầu:"}
                                        </p>
                                        <p>
                                            {"Giao hàng"}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p className="p-header">
                                            {"Điểm nhận:"}
                                        </p>
                                        <p>
                                            {item.fromAddress}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="p-header">
                                            {"Điểm giao:"}
                                        </p>
                                        <p>
                                            {item.toAddress}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p className="p-header">
                                            {"Khối lượng:"}
                                        </p>
                                        <p>
                                            {"1000"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="p-header">
                                            {"Thể tích:"}
                                        </p>
                                        <p>
                                            {"1000"}
                                        </p>
                                    </div>
                                </td>
                                
                                {
                                    (allTransportVehicle && allTransportVehicle.length !== 0) &&
                                    allTransportVehicle.map((item, index) => (
                                        item &&
                                        <td key={index} className="tooltip-checkbox">
                                            <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                                            <span className="tooltiptext">
                                                <a style={{ color: "white" }} 
                                                    // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                                >{"1"}</a>
                                            </span>
                                        </td>
                                    ))
                                }
                            </tr >
          
                            ))
                        }
                    <tr className="word-no-break">
                        <td>
                            {"1"}
                        </td>
                        <td>
                            <div>
                                <p>
                                    {"Mã yêu cầu:"}
                                </p>
                                <p>
                                    {"123"}
                                </p>
                            </div>
                            <div>
                                <p>
                                    {"Loại yêu cầu:"}
                                </p>
                                <p>
                                    {"Giao hàng"}
                                </p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <p>
                                    {"Điểm nhận:"}
                                </p>
                                <p>
                                    {"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội"}
                                </p>
                            </div>
                            <div>
                                <p>
                                    {"Điểm giao:"}
                                </p>
                                <p>
                                    {"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội"}
                                </p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <p>
                                    {"Khối lượng:"}
                                </p>
                                <p>
                                    {"1000"}
                                </p>
                            </div>
                            <div>
                                <p>
                                    {"Thể tích:"}
                                </p>
                                <p>
                                    {"1000"}
                                </p>
                            </div>
                        </td>
                        {/* <th>{"Hành động"}</th>
                        <td>{"Xem"}</td> */}
                        {
                            (allTransportVehicle && allTransportVehicle.length !== 0) &&
                            allTransportVehicle.map((item, index) => (
                                item &&
                                <td key={index} className="tooltip-checkbox">
                                    <span className="icon" title={"alo"} style={{ backgroundColor: "white"}}></span>
                                    <span className="tooltiptext">
                                        <a style={{ color: "white" }} 
                                            // onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                        >{"1"}</a>
                                    </span>
                                </td>
                            ))
                        }
                    </tr >





                    {/* <tr className="word-no-break">
                        <th>{"Điểm nhận"}</th>
                        <td colSpan={3}>{"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội "}</td>
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
                        <td colSpan={3}>{"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội "}</td>
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
                        <th><div>{"Loại yêu cầu"}</div><div>{"Loại yêu cầu"}</div></th>
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
                        <td colSpan={3}>{"Lê Thanh Nghị Bách Khoa, Hai Bà Trưng, Hà Nội "}</td>
                        <th>{"Khối lượng"}</th>
                        <td>{"100"}</td>
                    </tr>
                    <tr className="word-no-break">
                        <th>{"Điểm giao"}</th>
                        <td colSpan={3}>{"Thái Hà"}</td>
                        <th>{"Thể tích"}</th>
                        <td>{"1000"}</td>
                    </tr> */}
                    
                    </tbody>
                </table>
            </div>
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
    console.log(state, " 113213123");
    const transportArrangeRequirements = state.transportRequirements.lists;
    const allTransportVehicle = state.transportVehicle.lists;
    const allTransportPlans = state.transportPlan.lists;
    const { currentTransportSchedule } = state.transportSchedule;
    return { transportArrangeRequirements, allTransportVehicle, allTransportPlans, currentTransportSchedule };
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    editTransportRequirement: transportRequirementsActions.editTransportRequirement,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
    getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}

const connectedArrangeVehiclesAndGoods = connect(mapState, actions)(withTranslate(ArrangeVehiclesAndGoods));
export { connectedArrangeVehiclesAndGoods as ArrangeVehiclesAndGoods };