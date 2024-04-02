import React, { useEffect, useState } from "react";
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual";

// import {InitRouteTable} from './initRouteTable';
import { RequestTransportTable } from "./transport-requests-table/requestTransportTable"
import { ParameterConfiguration } from "./configuration-algorithm/parameterConfiguration"
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions'
import { vehicleActions } from '../../../vehicle/redux/actions'
import { DeliveryServices } from '../../delivery-plan/redux/services'
import TransportSolution from "./transportSolution";
import moment from "moment";
import { convertHHMMSSToInt } from '../../../utilities'
import { ShipperActions } from '../../../shipper/redux/actions'
import Swal from 'sweetalert2';
import { TransportationCostManagementActions } from "../../../cost/redux/actions";


function InitializationType(props) {
    const { requestManagements, vehicle, shipper, transportationCostManagement } = props;
    const today = moment().format("DD-MM-YYYY");
    const [state, setState] = useState({
        step: 0,
        isProgress: false,
        isInitFail: false,
        vehicles: [],
        orders: [],
        depots: [],
        vehicleSchedules: [],
        drivers: [],
        estimatedDeliveryDate: today,
        eliteSize: "",
        eliteRate: "",
        // isLimitedTime: false,
        // maxTravelTime: "",
        // isLimitedDistance: false,
        // maxDistance: "",
        isExcludeProduct: false,
        isLimitedTime: false,
        isLimitedDistance: false,
        isAllowedViolateTW: false,
        maxTime: 9,
        popSize: 100,
        eliteSize: 10,
        eliteRate: 13.3,
        maxGen: 80,
        maxGenImprove: 60,
        probCrossover: 0.96,
        probMutation: 0.16,
        tournamentSize: 20,
        selectionRate: 20,
        exponentialFactor: 1,
        clusteringOrders: [],
        listRequestId: [],
        selectedRequests: [],
        solutions: [],
        returnDataProblemAssumption: null,
        driverBonusPerOrder: [],
    });
    const [testInterVal, setTestInterVal] = useState(0);
    const [running, setRunning] = useState(false);
    const [progressPercent, setProgress] = useState(0);

    const { eliteSize, eliteRate, isExcludeProduct, isLimitedTime, isLimitedDistance, isAllowedViolateTW, maxTime, maxGen, maxGenImprove, popSize, probCrossover,
            probMutation, selectionSize, selectionRate, tournamentSize, exponentialFactor, listRequestId, selectedRequests, solutions, returnDataProblemAssumption,
            isProgress, isInitFail, estimatedDeliveryDate} = state;

    const parameterConfigurationValues = {
        eliteSize, eliteRate, isExcludeProduct, isLimitedTime, isLimitedDistance, isAllowedViolateTW, maxTime, maxGen, maxGenImprove, popSize, probCrossover,
        probMutation, selectionSize, selectionRate, tournamentSize, exponentialFactor
    }

    useEffect(() => {
        if (transportationCostManagement.shipperCostList) {
            let findShipperCost = transportationCostManagement.shipperCostList.filter((shipperCost) => shipperCost.code.includes('PRODUCTIVITY_BONUS'));
            let driverBonusPerOrder = findShipperCost.map((shipperCost) => shipperCost.cost)
            if (driverBonusPerOrder.length > 0) {
                setState({
                    ...state,
                    driverBonusPerOrder: driverBonusPerOrder,
                })
            }
        }
    }, [transportationCostManagement.shipperCostList]);
    useEffect(() => {
        props.getAllFreeVehicleSchedule({dateToSearch: estimatedDeliveryDate});
        props.getAllFreeShipperSchedule({dateToSearch: estimatedDeliveryDate});
        props.getAllShipperCosts();
    }, [estimatedDeliveryDate])

    const nextStep = () => {
        setState({
            ...state,
            step: state.step + 1
        });
    }

    const prevStep = () => {
        setState({
            ...state,
            step: state.step - 1
        });
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setState({
            ...state,
            [name]: value
        });
    }
    const handleChangeSelectedData = (data) => {
        let selectedRequests = requestManagements?.listRequests.filter((request) => data.includes(request._id));
        setState({
            ...state,
            listRequestId: data,
            selectedRequests: selectedRequests
        });
    }

    const unique = (arr) => {
        var newArr = []
        for (var i = 0; i < arr.length; i++) {
          if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i])
          }
        }
        return newArr
    }

    const getVehicleSchedules = () => {
        if (vehicle.todayVehiclesSchedule.length > 0) {
            return vehicle.todayVehiclesSchedule.map((schedule) => {
                let availableTimeWindows = schedule.freeTimeWindows.map((timeWindow) => {
                    return {
                        startTime: convertHHMMSSToInt(timeWindow.startTime),
                        endTime: convertHHMMSSToInt(timeWindow.endTime)
                    }
                })
                return {
                    dxCode: schedule._id,
                    availableTimeWindows: availableTimeWindows
                }
            })
        }
    }

    const getShipperSchedules = () => {
        if (shipper.todayShippersSchedule.length > 0) {
            return shipper.todayShippersSchedule.map((schedule) => {
                let availableTimeWindows = schedule.freeTimeWindows.map((timeWindow) => {
                    return {
                        startTime: convertHHMMSSToInt(timeWindow.startTime),
                        endTime: convertHHMMSSToInt(timeWindow.endTime)
                    }
                })
                return {
                    dxCode: schedule._id, // chính là employeeId
                    availableTimeWindows: availableTimeWindows,
                    canDriveTruck: true,
                    canDriveBike: true,
                    listVehicleCanDrive: schedule.listVehicleCanDrive,
                    averageSalaryPerOrder: schedule.salary/300,
                }
            })
        }
    }

    const getOrderCodes = () => {
        if (selectedRequests.length > 0) {
            return selectedRequests.map((request) => request._id);
        }
        return [];
    }

    const getCustomerCodes = () => {
        if (selectedRequests.length > 0) {
            let customerCodes =  selectedRequests.map((request) => request.supplier._id);
            return customerCodes = unique(customerCodes);
        }
        return [];
    }

    const getDepotCodes = () => {
        if (selectedRequests.length > 0) {
            let depotCodes =  selectedRequests.map((request) => request.stock._id);
            return depotCodes = unique(depotCodes);
        }
        return [];
    }

    const getClusteringOrders = () => {
        if (selectedRequests.length > 0) {
            return selectedRequests.map((request) => {
                return {
                    orderCode: request._id,
                    depotCode: request.stock._id,
                }
            });
        }
        return [];
    }

    const buildProblemAssumption = () => {
        let orderCodes = getOrderCodes();
        let customerCodes = getCustomerCodes();
        let depotCodes = getDepotCodes();
        let clusteringOrders = getClusteringOrders();
        let vehicleSchedules = getVehicleSchedules();
        let drivers = getShipperSchedules();

        if (vehicleSchedules.length == 0 || orderCodes.length == 0 || depotCodes.length == 0 || clusteringOrders.length == 0) {
            return null;
        }

        let problemAssumption = {
            vehicleSchedules: vehicleSchedules,
            drivers: drivers,
            orderCodes : orderCodes,
            customerCodes : customerCodes,
            depotCodes : depotCodes,
            clusteringOrders: clusteringOrders,
            estimatedDeliveryDate: estimatedDeliveryDate,
            isExcludeProduct: isExcludeProduct,
            isLimitedTime : false,
            isLimitedDistance : false,
            isAllowedViolateTW : isAllowedViolateTW,
            maxTime : maxTime,
            popSize : popSize,
            eliteSize : eliteSize,
            eliteRate : eliteRate,
            maxGen : maxGen,
            maxGenImprove : maxGenImprove,
            probCrossover : probCrossover,
            probMutation:  probMutation,
            tournamentSize :  tournamentSize,
            selectionRate :  selectionRate,
            exponentialFactor : exponentialFactor,
            driverBonusPerOrder: state.driverBonusPerOrder,
        }
        return problemAssumption;
    }

    let interval = undefined;
    useEffect(() => {
        if (running) {
            interval = setInterval(() => {
                setProgress((prev) => prev + 1);
            }, 3000);
        } else {
            clearInterval(interval);
        }
    }, [running]);

    useEffect(() => {
        if (progressPercent == 99) {
            setRunning(false);
            clearInterval(interval);
        }
    }, [progressPercent]);

    const handleInitDeliveryPlan = () => {
        let problemAssumption = buildProblemAssumption();
        if (problemAssumption) {
            console.log("Kiem tra truy van dl", problemAssumption);
            // Bắt đầu chạy fake thanh hiển thị thời gian chạy thuật toán
            setRunning(true);

            setState({
                ...state,
                isProgress: true,
            });
            DeliveryServices.getDeliveryPlanFromExternalServer(problemAssumption)
                .then((res) => {
                    let responseData = res.data.data;
                    console.log("Khoi tao thanh cong", responseData);
                    clearInterval(interval);
                    setState({
                        ...state,
                        solutions: responseData.solutions,
                        returnDataProblemAssumption: responseData.problemAssumption,
                        isProgress: false,
                        step: 2
                    })
                })
                .catch((error) => {
                    Swal.fire({
                        html: `<h4"><div>${"Khởi tạo kế hoạch giao hàng thất bại"}</div></div></h4>`,
                        icon: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: "Xác nhận",
                    }).then((result) => {

                    });
                    clearInterval(interval);
                    setState({
                        ...state,
                        isProgress: false,
                        step: 0,
                    });
                    // Reset thanh progress khi khởi tạo kế hoạch giao hàng
                    setRunning(false);
                    setProgress(0);
                });
        } else {
            Swal.fire({
                html: `<h4"><div>${"Lấy dữ liệu thất bại, không thể chạy giải thuật"}</div></div></h4>`,
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: "Xác nhận",
            })
            console.log("Loi du lieu dau vao, xem lai");
        }
    }

    const handleChangeEstimatedDeliveryDate = (data) => {
        setState({
            ...state,
            estimatedDeliveryDate: data,
        })
    }

    switch (state.step) {
        case 0:
            return (
                <>
                    <RequestTransportTable
                        nextStep={nextStep}
                        handleChangeSelectedRequest={handleChangeSelectedData}
                        requestManagements={requestManagements}
                        isProgress={isProgress}
                        handleInitDeliveryPlan={handleInitDeliveryPlan}
                        handleChangeEstimatedDeliveryDate={handleChangeEstimatedDeliveryDate}
                        progressPercent={progressPercent}
                    />
                </>
            );
        case 1:
            return (
                <ParameterConfiguration
                    prevStep={prevStep}
                    parameterConfigurationValues={parameterConfigurationValues}
                    handleInputChange={handleInputChange}
                    handleInitDeliveryPlan={handleInitDeliveryPlan}
                    isProgress={isProgress}
                    handleChangeEstimatedDeliveryDate={handleChangeEstimatedDeliveryDate}
                    // progressPercent={progressPercent}
                    // isInitFail={isInitFail}
                />
            );
        case 2:
            return (
                <TransportSolution
                    solutions={solutions}
                    problemAssumption={returnDataProblemAssumption}
                />
            );
        default:
            return;
    }
}


function mapStateToProps(state) {
    const requestManagements =  state.requestManagements;
    const vehicle = state.vehicle;
    const shipper =  state.shipper;
    const transportationCostManagement = state.transportationCostManagement;
    return { requestManagements, vehicle, shipper, transportationCostManagement }
}

const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
    getAllVehicleWithCondition: vehicleActions.getAllVehicleWithCondition,
    getAllFreeVehicleSchedule: vehicleActions.getAllFreeVehicleSchedule,
    getAllFreeShipperSchedule: ShipperActions.getAllFreeShipperSchedule,
    getAllShipperCosts: TransportationCostManagementActions.getAllShipperCosts,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InitializationType));