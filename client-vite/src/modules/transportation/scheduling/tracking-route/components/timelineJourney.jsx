import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Timeline, { DateHeader, SidebarHeader, TimelineHeaders } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { secondsToHHMMSS, getCustomersOfJourney } from '../../../utilities'
import SaveSolutionRouting from "../../delivery-plan/components/saveSolutionRouting";
import { DeliveryActions } from "../../delivery-plan/redux/actions";
import { DeliveryServices } from "../../delivery-plan/redux/services";
import { EmployeeManagerActions } from "../../../../human-resource/profile/employee-management/redux/actions";
import { TreeSelect } from "../../../../../common-components";
import Swal from 'sweetalert2';
import { ShipperActions } from "../../../shipper/redux/actions";

var keys = {
    groupIdKey: "id",
    groupTitleKey: "title",
    groupRightTitleKey: "rightTitle",
    itemIdKey: "id",
    itemTitleKey: "title",
    itemDivTitleKey: "title",
    itemGroupKey: "group",
    itemTimeStartKey: "start_time",
    itemTimeEndKey: "end_time",
    groupLabelKey: "title"
};

function TimelineJourney (props) {
    const [state, setState] = useState({
        solution: props.solution,
        solutions: props.solutions,
        groups: props.solution.journeys,
        showTimeline: false,
        changedDrivers: [],
        isChangeDriver: false
    });

    const { groups, solution, focusJourney, isChangeDriver, changedDrivers, solutions } = state;
    const { employeesManager, shipper } = props;

    useEffect(() => {
        setState({
            ...state,
            solution: props.solution,
            solutions: props.solutions
        });
        setNodesTimeline(solution);
        props.getAllEmployee();
    }, []);

    useEffect(() => {
        if (focusJourney) {
            let problemAssumption = props.problemAssumption;
            props.getAllShipperAvailableForJourney({
                startTime: focusJourney.timeWindowJourney.startTime,
                endTime: focusJourney.timeWindowJourney.endTime,
                journeyDate: problemAssumption.estimatedDeliveryDate
            });
        }
    }, [focusJourney])

    const createNodesTimeline = (journey) => {
        let nodesTimeline = [];
        let startOfDay = moment().startOf('day');
        journey.routes.map((route, index) => {
            let nodesInRoute = [];
            let startDepot = {
                id: 0,
                group: journey.id,
                title: route.startDepot.code,
                code: route.startDepot.code,
                canMove: false,
                canResize: false,
                canChangeGroup: false,
                start_time: startOfDay + route.timeline[0].startTime * 1000,
                end_time: startOfDay + route.timeline[0].endTime * 1000,
                marker: {
                    code: route.startDepot.code,
                    infoWindow: {
                        depotCode: route.startDepot.code,
                        startTime: secondsToHHMMSS(route.timeline[(0)].startTime),
                        endTime: secondsToHHMMSS(route.timeline[(0)].endTime),
                        fillRateCapacity: route.fillRateCapacity,
                        fillRateLoadWeight: route.fillRateLoadWeight,
                        ordinalLoadingOrders: route.ordinalLoadingOrders,
                    }
                },
            }
            startDepot.itemProps = {
                onDoubleClick: () => { props.showDepotMarkerInfo(startDepot.marker) },
            }
            nodesInRoute.push(startDepot);
            route.bills.map((bill, index) => {
                let customerTimeline = {
                    id: index,
                    group: journey.id,
                    title: bill.order.customer.code,
                    code: bill.order.customer.code,
                    start_time: startOfDay + route.timeline[(index + 1)].startTime * 1000,
                    end_time: startOfDay + route.timeline[(index + 1)].endTime * 1000,
                    canMove: true,
                    canResize: false,
                    canChangeGroup: true,
                    order: bill.order,
                    marker: {
                        code: bill.order.customer.code,
                        infoWindow: {
                            customerCode: bill.order.customer.code,
                            startTime: secondsToHHMMSS(route.timeline[(index + 1)].startTime),
                            endTime: secondsToHHMMSS(route.timeline[(index + 1)].endTime),
                            intendStartTime: secondsToHHMMSS(bill.order.deliveryAfterTime),
                            intendEndTime: secondsToHHMMSS(bill.order.deliveryBeforeTime),
                            bill: bill,
                            fillRateCapacity: bill.fillRateCapacity,
                            fillRateLoadWeight: bill.fillRateLoadWeight,
                            travelTime: route.timeline[(index + 1)].startTime - route.timeline[(index)].endTime,
                        }
                    },
                }
                customerTimeline.itemProps = {
                    onDoubleClick: () => { props.showCustomerMarkerInfo(customerTimeline.marker) },
                }
                nodesInRoute.push(customerTimeline);
            });
            let endDepot = {
                id: nodesInRoute.length,
                group: journey.id,
                title: route.endDepot.code,
                code: route.endDepot.code,
                canMove: false,
                canResize: false,
                canChangeGroup: false,
                start_time: startOfDay + route.timeline[route.timeline.length - 1].startTime * 1000,
                end_time: startOfDay + route.timeline[route.timeline.length - 1].startTime * 1000 + 600 * 1000,
                marker: {
                    code: route.endDepot.code,
                    infoWindow: {
                        depotCode: route.endDepot.code,
                        startTime: secondsToHHMMSS(route.timeline[route.timeline.length - 1].startTime),
                        endTime: secondsToHHMMSS(route.timeline[route.timeline.length - 1].startTime),
                        // fillRateCapacity: route.fillRateCapacity,
                        // fillRateLoadWeight: route.fillRateLoadWeight,
                        // ordinalLoadingOrders: route.ordinalLoadingOrders,
                    }
                },
            }
            endDepot.itemProps = {
                onDoubleClick: () => { props.showDepotMarkerInfo(endDepot.marker) },
            }
            nodesInRoute.push(endDepot);
            nodesTimeline = nodesTimeline.concat(nodesInRoute);
        });
        return nodesTimeline;
    }

    const processJourneys = (solution) => {
        const journeys = solution.journeys.map((journey, index) => {
            journey.id = solution.id * 100 + journey.vehicle.id;
            journey.title = journey.vehicle.name;
            journey.nodesTimeline = createNodesTimeline(journey);
            journey.rightTitle = (Math.round((journey.totalTravelTime / 60) * 10) / 10) + " (phút)/" + (Math.round((journey.totalDistance / 1000) * 10) / 10) + " (km)"
            return journey;
        });
        return journeys;
    }

    const setNodesTimeline = (solution) => {
        let nodesTimeline = [];
        solution.journeys = processJourneys(solution);
        solution.journeys.map((journey) => {
            nodesTimeline = nodesTimeline.concat(journey.nodesTimeline);
        });
        nodesTimeline.map((node, index) => {
            node.id = 1000 * solution.id + (index + 1);
        })
        setState({
            ...state,
            nodesTimeline: nodesTimeline
        });
    }

    // Lựa chọn xem theo từng chuyến xe
    const handleChangeJourney = (event) => {
        let journeyId = parseInt(event.target.value);
        const focusJourney = solution.journeys.find(journey => journey.id === journeyId);
        if (focusJourney !== undefined) {
            console.log("focusJourney", focusJourney);
            props.focusJourney(focusJourney);
            setState({
                ...state,
                groups: [focusJourney],
                focusJourney: focusJourney,
                changedDrivers: focusJourney.vehicle.driverCode
            });
        }
        else {
            props.showAllJourney();
            setState({
                ...state,
                groups: solution.journeys
            });
        }
    }

    const resetFocus = () => {
        let solution = solution;
        solution.focusJourneyId = 0;
        setState({
            ...state,
            solution: solution
        });
    }

    // Chọn xem giải pháp khác
    const handleChangeSolution = (event) => {
        setState({
            ...state,
            nodesTimeline: undefined
        });
        let solutionId = parseInt(event.target.value);
        resetFocus();
        solutions.map((solution) => {
            if (solution.id === solutionId) {
                setState({
                    ...state,
                    solution: solution,
                    groups: solution.journeys,
                });
                setNodesTimeline(solution);
                props.changeSolution(solution);
            }
        });
    }
    //Thay đổi đơn hàng từ xe A sang xe B

    const isItemChangeGroup = (itemId, newGroupOrderIndex) => {
        let isChange = false;
        state.nodesTimeline.map((node) => {
            if (node.id === itemId && node.group !== solution.journeys[newGroupOrderIndex].id)
                isChange = true;
        })
        return isChange;
    }

    const handleItemMove = (itemId, dragTime, newGroupOrder) => {
        if (isItemChangeGroup(itemId, newGroupOrder)) {
            const changedNodeTimeline = state.nodesTimeline.find(nodeTimeline => nodeTimeline.id === itemId);
            const toJourney = solution.journeys[newGroupOrder];
            const fromJourney = solution.journeys.find(journey => journey.id === changedNodeTimeline.group);
            const dataChanged = {
                changedOrder: changedNodeTimeline.order,
                toJourney: toJourney,
                fromJourney: fromJourney
            }
            console.log("data changed: ", dataChanged);
            setState({
                ...state,
                changedOrder: changedNodeTimeline.order,
                toJourney: toJourney,
                fromJourney: fromJourney,
            });
            window.$('#modal-change-order-position').modal('show')
        }
    };

    // Cap nhat thay doi

    const updateSolution = (solution) => {
        props.setDirections(solution);
        props.setSolution(solution);
    }

    const handleChangeSubmit = () => {
        const changedSolution = {
            solution: solution,
            changedOrder: state.changedOrder,
            toJourney: state.toJourney,
            fromJourney: state.fromJourney,
            problemAssumption: props.problemAssumption,
        }
        console.log("solution data", solution);
        console.log("Form data changed order", changedSolution);
        DeliveryServices.changeOrderToJourney(changedSolution)
            .then((response) => {
                console.log("Ket qua thay doi vi tri",response);
                const data = response.data;
                if (data.code === 'SUCCESS') {
                    let solution = data.data;
                    solution.id = solution.id;
                    solution.focusJourneyId = 0;
                    setState({
                        ...state,
                        solution: solution,
                    })
                    updateSolution(solution);
                    setNodesTimeline(solution);
                    console.log("solution:", solution);
                }
            })
            .catch((error) =>{
                console.log(error);
            });
    }

    const setShowTimeline = (showTimeline) => {
        setState({
            ...state,
            showTimeline: showTimeline
        })
    }
    const handleChangeDrivers = (value) => {
        setState({
            ...state,
            changedDrivers: value,
            isChangeDriver: true
        })
    }

    const showConfirmChangeDrivers = () => {
        Swal.fire({
            html: `<h4"><div>Bạn có chắc muốn thay đổi tài xế phụ trách</div></div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Huỷ",
            confirmButtonText: "Xác nhận",
        }).then((result) => {
            if (result.isConfirmed) {
                if (state.focusJourney) {
                    let updateJourney = solution.journeys.filter((journey) => journey.id != focusJourney.id);
                    updateJourney.push({...focusJourney, vehicle: {...focusJourney.vehicle, driverCode : changedDrivers}});
                    setState({
                        ...state,
                        solution: {...solution, journeys: updateJourney},
                        focusJourney: {...focusJourney, vehicle: {...focusJourney.vehicle, driverCode : changedDrivers}},
                        isChangeDriver: false,
                    })
                }
            } else {
                setState({
                    ...state,
                    changedDrivers: focusJourney.vehicle.driverCode,
                    isChangeDriver: false
                })
            }
        })
    }

    const handleShowDetailTotalCost = (fixedVehicleCost, operationVehicleCost, salary, bonus) => {
        Swal.fire({
            title: '<strong>Chi tiết chi phí chuyến xe</strong>',
            icon: 'info',
            html:
              `<div>
                <p style="font-size: 15px">Chi phí xe cố định: ${fixedVehicleCost} (VND)</p>
                <p style="font-size: 15px">Chi phí vận hành xe: ${operationVehicleCost} (VND)</p>
                <p style="font-size: 15px">Lương cứng nhân viên: ${salary} (VND)</p>
                <p style="font-size: 15px">Lương bonus: ${bonus} (VND)</p>
              </div>`
          })
    }

    let availableShippers = [];
    if (shipper.availableForCurrentJourney) {
        availableShippers = shipper.availableForCurrentJourney.map((shipper) => {
            return {
                _id: shipper.driver._id,
                name: shipper.driver.fullName
            }
        })
    }

    const listEmployee = employeesManager.listAllEmployees.map((employee) => {
        return {
            _id: employee._id,
            name: employee.fullName
        }
    })

    const items = state.nodesTimeline;

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <SaveSolutionRouting
                        solution={solution}
                        problemAssumption={props.problemAssumption}
                    ></SaveSolutionRouting>
                        <div className="row">
                            {/* Timline header area */}
                            <div className="col-md-3">
                                {
                                    solution &&
                                    <label htmlFor="solutions">Giải pháp giao hàng {solution.id}</label>
                                }
                                {
                                    state.nodesTimeline &&
                                    <div className="form-group">
                                        <select className="form-control" id="solution" value={solution.id} onChange={handleChangeSolution} style={{height: "30px"}}>
                                            {
                                                solutions.map((item, index) =>
                                                    <option key={index} value={item.id}>{"Giải pháp" + (item.id)}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                }
                            </div>
                            {/* Journey header area */}
                            <div className="col-md-3">
                                {
                                    solution &&
                                    <label htmlFor="journey-drivers">Hành trình xe:</label>
                                }
                                {
                                    solutions &&
                                    <div className="form-group">
                                        <select className="form-control" id="journey" onChange={handleChangeJourney} value={solution.focusJourneyId} style={{height: "30px"}}>
                                            <option key={0} value={0}>Tất cả xe</option>
                                            {
                                                solution.journeys.map((journey, index) =>
                                                    <option key={index + 1} value={journey.id}>{(journey.vehicle.name)}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                }
                            </div>
                            {/* Show timeline, save solution button */}
                            <div className="col-md-6">
                                <button type="button" className="btn btn-sm btn-success" style={{float: "right"}} onClick={() => window.$('#modal-save-solution').modal('show')}>Lưu giải pháp</button>
                                <button type="submit" className="btn btn-sm btn-info" style={{float: "right", marginRight: "1%"}} onClick={() => setShowTimeline(!state.showTimeline)}>{state.showTimeline === true ? "Ẩn Timeline" : "Hiện Timeline"}</button>
                            </div>
                        </div>
                        {
                            solution.focusJourneyId === 0 &&
                            <div className="row">
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Tổng chi phí: " + Math.round((solution.totalCost) * 10) / 10 + " (VND)"}</span>
                                    <span style={{marginLeft: "1%"}}><a
                                        onClick={() => handleShowDetailTotalCost(solution.fixedVehicleCost, solution.operationVehicleCost, solution.totalFixedDriverSalary, solution.totalBonusDriverSalary)}>
                                        <i className="fa fa-question-circle-o" aria-hidden="true"></i>
                                    </a></span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Lợi nhuận: " + Math.round((solution.revenue) * 10) / 10 + " (VND)"}</span>
                                </div>
                                {/* <div className="col-md-3">{"Doanh thu: " + solution.totalAmount + " (VND)"}</div>
                                <div className="col-md-3">{"Lợi nhuận: " + Math.round((solution.revenue) * 10) / 10 + " (VND)"}</div> */}
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-tachometer" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Tỷ lệ lấp đầy trung bình: " + Math.round((solution.fillVolumeRate ? solution.fillVolumeRate : 0) * 100) / 100 + " %"}</span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-truck" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Số xe sử dụng: " + solution.numberVehicle + " xe"}</span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-shopping-bag" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Số đơn trung bình: " + Math.round(((solution.totalNumberOrders) / solution.numberVehicle)) + " (đơn/xe)" }</span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-hourglass-start" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Thời gian đi trung bình: " + (Math.round(((solution.totalTravelTime / 60) / solution.numberVehicle) * 10) / 10) + " (phút/xe)" }</span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-paper-plane-o" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Quãng đường trung bình: " + Math.round(((solution.totalDistance / 1000) / solution.numberVehicle) * 10) / 10 + " (km/xe)" }</span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-user" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Số lượng tài xế: " + solution.numberVehicle + " người"}</span>
                                </div>
                            </div>
                        }
                        {
                            solution.focusJourneyId !== 0 &&
                            <div className="row">
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Tổng chi phí: " + Math.round((state.focusJourney.totalCost) * 10) / 10 + " (VND)"}</span>
                                    <span style={{marginLeft: "1%"}}><a
                                        onClick={() => handleShowDetailTotalCost(state.focusJourney.fixedVehicleCost, state.focusJourney.operationVehicleCost, state.focusJourney.totalDriverFixedSalary, state.focusJourney.totalDriverBonusSalary)}>
                                        <i className="fa fa-question-circle-o" aria-hidden="true"></i>
                                    </a></span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    {"Phí phạt: " + Math.round((state.focusJourney.totalPenaltyCost) * 10) / 10 + " (VND)"}
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Lợi nhuận: " + Math.round((state.focusJourney.revenue ? state.focusJourney.revenue : 0) * 10) / 10 + " VND"}</span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-shopping-bag" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    {"Số đơn:  " + getCustomersOfJourney(state.focusJourney).length + " đơn"}
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-tachometer" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Tỷ lệ lấp đầy trung bình: " + Math.round((state.focusJourney.fillVolumeRate ? state.focusJourney.fillVolumeRate : 0) * 100) / 100 + " %"}</span>
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-paper-plane-o" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    {"Số chuyến:  " + state.focusJourney.routes.length + " chuyến"}
                                </div>
                                <div className="col-md-3" style={{marginTop: "20px"}}>
                                    <i className="fa fa-user" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                    <span>{"Tài xế phụ trách:  "}</span>
                                    <TreeSelect
                                        data={availableShippers}
                                        value={changedDrivers}
                                        handleChange={handleChangeDrivers}
                                        mode="hierarchical"
                                    />
                                </div>
                                { isChangeDriver &&
                                    <div className="col-md-3" style={{marginTop: "20px"}}>
                                        <button type="button" className="btn btn-sm btn-warning" onClick={showConfirmChangeDrivers}>Thay đổi</button>
                                    </div>
                                }
                            </div>
                        }
                    {state.nodesTimeline && groups && state.showTimeline &&
                        <>
                            <hr />
                            <Timeline
                                groups={groups}
                                items={items}
                                keys={keys}
                                rightSidebarWidth={150}
                                defaultTimeStart={moment().startOf('day').add(8, 'hour')}
                                defaultTimeEnd={moment().startOf('day').add(12, 'hour')}
                                minZoom={1 * 60 * 60 * 1000}
                                maxZoom={4 * 60 * 60 * 1000}
                                traditionalZoom
                                onItemMove={handleItemMove}
                                // itemRenderer={itemRenderer}
                            >
                                <TimelineHeaders>
                                    <SidebarHeader>
                                        {({ getRootProps }) => {
                                            return <div {...getRootProps(items)} >
                                                <div style={{ textAlign: "center" }}>
                                                    <h5 style={{ color: "#FFFAF0" }}>
                                                        Tên xe
                                                    </h5>
                                                </div>
                                            </div>
                                        }}
                                    </SidebarHeader>
                                    <SidebarHeader variant="right">
                                        {({ getRootProps }) => {
                                            return <div {...getRootProps()} >
                                                <div style={{ textAlign: "center" }}>
                                                    <h5 style={{ color: "#FFFAF0" }}>
                                                        Thời gian di chuyển(phút)/Tổng quãng đường(km)
                                                    </h5>
                                                </div>
                                            </div>
                                        }}
                                    </SidebarHeader>
                                    <DateHeader unit="primaryHeader" labelFormat="YYYY"/>
                                    <DateHeader unit="hour" labelFormat="HH:mm" />
                                </TimelineHeaders>
                            </Timeline>
                        </>
                    }
                </div>
            </div>
        </>
    );
}

function mapState (state) {
    const isLoading = state.delivery.isLoading;
    const employeesManager = state.employeesManager;
    const shipper = state.shipper;
    return { isLoading , employeesManager, shipper }
}

const actions = {
    changeOrderToJourney: DeliveryActions.changeOrderToJourney,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getAllShipperAvailableForJourney: ShipperActions.getAllShipperAvailableForJourney,
}

export default connect(mapState, actions)(withTranslate(TimelineJourney))