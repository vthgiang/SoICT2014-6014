import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

import { TransportManageVehicleProcess } from "./transportManageVehicleProcess"

import { TransportDetailRoute } from "./transportDetailRoute"
import { TransportDetailMap } from "./transportDetailMap"

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { transportProcessActions } from "../redux/actions"

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import './timeLine.css';

function TransportManageRouteMainPage(props) {

    const {allTransportPlans, currentTransportSchedule, socket} = props

    const [ currentPosition, setCurrentPosition ] = useState({});

    const [currentTransportPlan, setCurrentTransportPlan] = useState({
        _id: "0",
        code: "",
    });

    const [currentVehicleRoute, setCurrentVehicleRoute] = useState({})

    const [longestRoute, setLongestRoute] = useState();
    const [getLocateOnMap, setGetLocateOnMap] = useState(false);

    const [sendCurrentLocateTimer, setSendCurrentLocateTimer] = useState([]);

    const handleShowDetailRoute = (route) => {
        setCurrentVehicleRoute(route);
        window.$(`#modal-detail-route`).modal('show')
    }

    /**
     * Show bản đồ => yêu cầu gửi vị trí hiện tại để show lên map
     * @param {*} route 
     */
    const handleShowDetailMap = (route) => {
        setCurrentVehicleRoute(route);
        setGetLocateOnMap(true);
        console.log(route);
        props.startLocate({manageId: localStorage.getItem("userId"), driverId: getDriver(route.transportVehicle?._id)?.id})
        window.$(`#modal-detail-map`).modal('show');
    }
    // useEffect(() => {
    //     if (props.socket){
    //         props.socket.io.on("hihi", data => {
    //             console.log(data);
    //         });
    //     }
    // }, [])
    const getListTransportPlans = () => {
        let listTransportPlans = [
            {
                value: "0",
                text: "Kế hoạch",
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
    /**
     * Tính chiều dài route hiện tại (so với các route khác trong cùng kế hoạch)
     * @param {*} item 
     */
    const getBarWidth = (item) => {
        let length = 0;
        if (longestRoute && longestRoute!==0){
            if (item.routeOrdinal && item.routeOrdinal.length!==0){
                item.routeOrdinal.map(routeOrdinal => {
                    length +=routeOrdinal.distance?routeOrdinal.distance:0;
                })
            }
        }
        return length/longestRoute * 100;
    }

    const getDriver = (vehicleId) => {
        let driver = {id: " ", name: " "};
        if (currentTransportPlan && currentTransportPlan.transportVehicles && currentTransportPlan.transportVehicles.length!==0){
            let transportVehicles = currentTransportPlan.transportVehicles.filter(r => String(r.vehicle?._id) === String(vehicleId));
            if (transportVehicles && transportVehicles.length!==0){
                let carriers = transportVehicles[0]?.carriers;
                if (carriers && carriers.length!==0){
                    let carrier_driver = carriers.filter(c => String(c.pos) === "1");
                    if (carrier_driver && carrier_driver.length!==0){
                        driver.name = carrier_driver[0]?.carrier?.name;
                        driver.id = carrier_driver[0]?.carrier?._id;
                    }
                }
            }
        };
        return driver;
    }

    const getCarriers = (vehicleId) => {
        let carriers = "";
        if (currentTransportPlan && currentTransportPlan.transportVehicles && currentTransportPlan.transportVehicles.length!==0){
            let transportVehicles = currentTransportPlan.transportVehicles.filter(r => String(r.vehicle?._id) === String(vehicleId));
            if (transportVehicles && transportVehicles.length!==0){
                let carriers = transportVehicles[0]?.carriers;
                if (carriers && carriers.length!==0){
                    let carrier_driver = carriers.filter(c => String(c.pos) !== "1");
                    if (carrier_driver && carrier_driver.length!==0){
                        carrier_driver.map((cd, indexcd) => {
                            if (cd.carrier){
                                if (indexcd !==0){
                                    carriers = carriers.concat(", ")
                                }
                                carriers = carriers.concat(cd.carrier.name);
                            }
                        })
                    }
                }
            }
        };
        return carriers;
    }
    // setInterval(()=>{     
    //     navigator.geolocation.getCurrentPosition(success);
    // }, 50000)

    const stopGetLocateOnMap = () => {
        setGetLocateOnMap(false);
        props.stopLocate({driverId: getDriver(currentVehicleRoute.transportVehicle?._id)?.id})
    }

    useEffect(() => {
        props.getAllTransportPlans({page:1, limit: 100})
        let manageId;
        // const sendCurrentPosition = position => {
        //     const currentPosition = {
        //       lat: position.coords.latitude,
        //       lng: position.coords.longitude
        //     }
        //     // setCurrentPosition(currentPosition);
        //     console.log(currentPosition)
        //   };
          const sendCurrentPosition = () => {
            const currentPosition = {
              lat: 13,
              lng: 12,
            }
            // setCurrentPosition(currentPosition);
            let data = {
                manageId: manageId,
                location: currentPosition
            }
            console.log(data, " haha")
            setCurrentPosition(data)
          };
        // socket.io.on("current position", data => {
        //     console.log(data);
        // })
        // console.log(localStorage.getItem("userId"))
        /** Nhận được tín hiệu quản lý vào xem map => gửi lại vị trí hiện tại
         * data: {manageId: manageId}
         * driver
         */
        socket.io.on("start locate", data => {
            console.log(data, " aaaaaaaaaaaaaaaaaaaa");
            if (data?.manageId){
                manageId = data.manageId;
                // navigator.geolocation.getCurrentPosition(sendCurrentPosition);
                
                let interval = [...sendCurrentLocateTimer]
                let k =setInterval(() => {
                    sendCurrentPosition();
                }, 5000)
                console.log(k, " ooooooooooooooooooooooooooooooooooooooo");
                
                interval.push(k);
                setSendCurrentLocateTimer(interval);
            }
        })

        socket.io.on("stop locate", data => {
            console.log(data, " stop locate");
            // setCurrentPosition({});
            // clearInterval(sendCurrentLocateTimer);
            // for (let i = 1; i < 99999; i++)
            //     clearInterval(i);
            console.log(sendCurrentLocateTimer, " currenttimerr")
            if (sendCurrentLocateTimer && sendCurrentLocateTimer.length!==0){
                for (let i =0; i<sendCurrentLocateTimer.length;i++){
                    console.log(sendCurrentLocateTimer[i], " xoassssssssssssss")
                    clearInterval(sendCurrentLocateTimer[i]);
                }
            }

            })
            
    }, [])
    useEffect(() => {
        // console.log(currentPosition, " currentPosition");
        if (currentPosition){
            // if (localStorage.getItem("userId") !== '607a98a6e57ad61670049a2c')
            // props.driverSendMessage({
            //     data: {
            //         position: currentPosition,
            //     }
            // })
            
            props.sendCurrentLocate(currentPosition);
            console.log("da gui")
        }
      }, [currentPosition])
    useEffect(() => {
        if (currentTransportPlan && currentTransportPlan._id !== "0"){
            props.getTransportScheduleByPlanId(currentTransportPlan._id);
            // console.log(currentTransportPlan);
        }
    }, [currentTransportPlan])

    useEffect(() => {
        // console.log(currentTransportSchedule, " allll")
        if (currentTransportSchedule && currentTransportSchedule.route && currentTransportSchedule.route.length!==0){
            currentTransportSchedule.route.map(r => {
                if (r.routeOrdinal && r.routeOrdinal.length!==0){
                    let length = 0;
                    r.routeOrdinal.map(routeOrdinal => {
                        length += routeOrdinal.distance?routeOrdinal.distance:0;
                    })
                    setLongestRoute(length);
                }
            })
        }
    }, [currentTransportSchedule])

    // const success = position => {
    //     const currentPosition = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     }
    //     setCurrentPosition(currentPosition);
    //   };
      
      useEffect(() => {
        // navigator.geolocation.getCurrentPosition(success);  
        // const timer = setTimeout(() => {
        //     navigator.geolocation.getCurrentPosition(success);  
        // }, 5000);
        // return () => clearTimeout(timer);
        })

   return (
            <div className="box-body qlcv">
                {
                    currentTransportPlan && currentTransportPlan._id !== "0"
                    &&
                    <TransportDetailRoute 
                        currentVehicleRoute = {currentVehicleRoute}
                        transportPlanId = {currentTransportPlan._id}
                    />
                }
                <TransportDetailMap
                    currentVehicleRoute = {currentVehicleRoute}
                    getLocateOnMap={getLocateOnMap}
                    stopGetLocateOnMap = {stopGetLocateOnMap}
                />
                <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Chọn kế hoạch</label>
                            <SelectBox
                                id={`select-filter-plan`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={currentTransportPlan._id}
                                items={getListTransportPlans()}
                                onChange={handleTransportPlanChange}
                            />
                        </div>
                </div>
                {
                    (currentTransportSchedule && currentTransportSchedule.route && currentTransportSchedule.route.length !== 0)
                    && currentTransportSchedule.route.map((item,index) =>(
                        item &&
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">{item.transportVehicle?.name}</legend>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><strong>Mã xe: </strong></td>
                                            <td>{item.transportVehicle?.code}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Trọng tải xe: </strong></td>
                                            <td>{item.transportVehicle?.payload}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Thể tích thùng chứa: </strong></td>
                                            <td>{item.transportVehicle?.volume}</td>
                                        </tr>
                                    </tbody>
                                </table>                            
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><strong>Tài xế: </strong></td>
                                            <td>{getDriver(item.transportVehicle?._id)?.name}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Đi cùng: </strong></td>
                                            <td>{getCarriers(item.transportVehicle?._id)}</td>
                                        </tr>                                        
                                        <tr>
                                            <td>
                                                <a className="edit text-green" 
                                                    style={{ width: '5px', cursor:"pointer" }} 
                                                    title={'manage_example.detail_info_example'} 
                                                    onClick={() => handleShowDetailRoute(item)}
                                                    >
                                                        <strong>{"Chi tiết nhiệm vụ "}</strong>
                                                        <i className="material-icons">assignment</i>
                                                </a>
                                            </td>   
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="edit text-green" 
                                                    style={{ width: '5px', cursor:"pointer" }} 
                                                    title={'Bản đồ chi tiết'} 
                                                    onClick={() => handleShowDetailMap(item)}
                                                    >
                                                        <strong>{"Bản đồ "}</strong>
                                                        <i className="material-icons">location_on</i>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>                            
                            </div>
                                        
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 container-time-line">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><strong>Tiến độ vận chuyển:</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <TransportManageVehicleProcess
                                    route={item}
                                    timelineBarWidth={getBarWidth(item)}
                                />
                            </div>
                        </fieldset>
                    ))
                }
                


                <div className={"divTest2"}>
                    <table className="tableTest2 not-sort">
                        <thead>
                            <tr>
                                <th>
                                    STT
                                </th>
                                <th>
                                    Tên xe
                                </th>
                                <th>
                                    Hành động
                                </th>
                                <th>
                                    Tiến độ vận chuyển
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                        {
                            (currentTransportSchedule && currentTransportSchedule.route && currentTransportSchedule.route.length !== 0)
                            && currentTransportSchedule.route.map((item, index) => (
                                item &&
                                <tr key={"route "+index}>
                                    <th>{index + 1}</th>
                                    <td>{item.transportVehicle.name}</td>
                                    <td>
                                        <a className="edit text-green" 
                                        style={{ width: '5px', cursor:"pointer" }} 
                                        title={'manage_example.detail_info_example'} 
                                        onClick={() => handleShowDetailRoute(item)}
                                        >
                                            <i className="material-icons">visibility</i>
                                        </a>
                                    </td>
                                    {/* <td>
                                        <TransportManageVehicleProcess
                                            route={item}
                                            timelineBarWidth={900}
                                        />
                                    </td> */}
                                        
                                            {/* <div key={"1"} className={`timeline-item active`} >
                                                <div className="timeline-contain">{"123131323"}</div>
                                            </div>
                                            <div key={"2"} className={`timeline-item`} >
                                                <div className="timeline-contain" 
                                                // onClick={(e) => this.setCurrentStep(e, index)}
                                                >{"123131323"}</div>
                                                
                                            </div> */}
                                </tr>
    
                            ))
                        }
                        </tbody>
                    </table>
                </div>


                {/* <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs&q=21.0058354500001,105.842277338"} 
                width="600" 
                height="450" 
                frameborder="0" 
                style={{border:0}} 
                allowfullscreen=""
                loading="lazy" 
                aria-hidden="false" 
                tabindex="0"></iframe>    */}
                <fieldset className="scheduler-border" style={{ height: "100%" }}>

                    {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6"> */}
                    {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                    <strong>{"Trọng tải: "+item.transportVehicle.payload}</strong>
                    </div>
                    </div>                                    
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                    <strong>{"Thể tích thùng chứa: "+item.transportVehicle.volume}</strong>
                    </div>
                    </div>
                    </div> */}

                </fieldset>
            </div>
    )
}

function mapState(state) {
    const allTransportPlans = state.transportPlan.lists;
    const {currentTransportSchedule} = state.transportSchedule;
    const {socket} = state
    return { allTransportPlans, currentTransportSchedule,socket }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
    driverSendMessage: transportScheduleActions.driverSendMessage,    
    startLocate: transportProcessActions.startLocate,
    sendCurrentLocate: transportProcessActions.sendCurrentLocate,
    stopLocate: transportProcessActions.stopLocate,
}

const connectedTransportManageRouteMainPage = connect(mapState, actions)(withTranslate(TransportManageRouteMainPage));
export { connectedTransportManageRouteMainPage as TransportManageRouteMainPage };