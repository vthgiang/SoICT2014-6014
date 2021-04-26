import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { AssetManagerActions } from '../../../../asset/admin/asset-information/redux/actions'
import { transportVehicleActions } from "../redux/actions";
import { transportPlanActions} from "../../transport-plan/redux/actions"
import { TransportVehicle } from './transportVehicle';
import { TransportEmployee } from './transportEmployee'; 

function TransportVehicleManagementTable(props) {
    const { currentTransportPlanId, currentTransportPlan, transportVehicle } = props;

    const getTableId = "table-manage-transport-vehicle";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const [vehiclesListState, setVehilesListState] = useState({});

    useEffect(() => {
        const data = {
            tableId_constructor: "table-asset-manager",
            code: "",
            assetName: "",
            purchaseDate: null,
            disposalDate: null,
            status: '',
            group: "vehicle",
            handoverUnit: "",
            handoverUser: "",
            typeRegisterForUse: "",
            page: 0,
            limit: 500,
            managedBy: props.managedBy ? props.managedBy : ''
        }
        props.getAllAsset(data);
        
        props.getAllTransportVehicles({page: 1, limit : 100});
    }, [])

    /**
     * Lọc dữ liệu từ assetsManager
     */
    useEffect(() => {
        let vehiclesList = [];
        vehiclesList = props.assetsManager? (props.assetsManager.listAssets? props.assetsManager.listAssets: []) : []
        /**
         * Lọc khối lượng vận chuyển từ detailInfo của asset
         * Nếu không có mặc định khối lượng vận chuyển bằng 1000
         */
        if (vehiclesList && vehiclesList.length !==0){
            vehiclesList.map((vehicle, index) => {
                vehiclesList[index].volume = "1000";
                vehiclesList[index].payload = "1000";

                if (vehicle.detailInfo && vehicle.detailInfo.length !== 0) {
                    const volume = vehicle.detailInfo.filter((r) => r.nameField === "volume");
                    if (volume && volume.length !==0) {
                        if (volume[0].value){
                            vehiclesList[index].volume = volume[0].value;
                        }
                    }

                    const payload = vehicle.detailInfo.filter((r) => r.nameField === "payload");
                    if (payload && payload.length !==0) {
                        if (payload[0].value){
                            vehiclesList[index].payload = payload[0].value;
                        }
                    }
                }
            })
        }
        setVehilesListState({
            vehiclesList: vehiclesList,
        });
    }, [props.assetsManager])

    useEffect(() => {
        console.log(vehiclesListState, " vehicales")
    }, [vehiclesListState])
    const { vehiclesList } = vehiclesListState;
    
    /**
     * Lấy dữ liệu array transportVehicles lưu state
     */
    useEffect(() => {
        if (currentTransportPlanId){
            props.getDetailTransportPlan(currentTransportPlanId);
        }
        // props.getAllTransportVehicles({page: 1, limit : 100});

    }, [currentTransportPlanId])

    const handleChooseVehicle = (vehicle) => {
        const data = {
            id: vehicle._id,
            code: vehicle.code,
            name: vehicle.assetName,
            payload: vehicle.payload,
            volume: vehicle.volume,
            transportPlan: "",
            vehicleId: vehicle._id,
        }
        if (transportVehicle){
            if (transportVehicle.lists && transportVehicle.lists.length !==0){
                let currentVehicle = transportVehicle.lists.filter(r => String(r.asset?._id) ===vehicle._id);
                if (currentVehicle && currentVehicle.length!==0){
                    props.editTransportVehicle(currentVehicle[0]._id, {usable: 1})
                }
                else{
                    props.createTransportVehicle(data);
                }
            }
        }
    }
    const handleDeleteVehicle = (vehicle) => {
        // vehicle chỉ có assetId nên phải tìm ra _id trong transportVehicle
        if (transportVehicle){
            if (transportVehicle.lists && transportVehicle.lists.length !==0){
                let currentVehicle = transportVehicle.lists.filter(r => String(r.asset?._id) ===vehicle._id);
                if (currentVehicle && currentVehicle.length!==0){
                    props.editTransportVehicle(currentVehicle[0]._id, {usable: 0})
                }
            }
        }
    }
    const selectVehicle = (index, vehicle) => {
        let value;
        if (getTickboxStatus(vehicle)==="iconactive"){
            value = "iconinactive";
            handleDeleteVehicle(vehicle);
        }
        else {
            value = "iconactive";
            handleChooseVehicle(vehicle);
        }
    }
    const getTickboxStatus = (vehicle) => {
        if (transportVehicle){
            if (transportVehicle.lists && transportVehicle.lists.length !==0){
                let currentVehicle = transportVehicle.lists.filter(r => String(r.asset?._id) ===vehicle._id);
                if (currentVehicle && currentVehicle.length!==0){
                    if (String(currentVehicle[0].usable) === "1") return "iconactive";
                }
            }
        }
        return "iconinactive";
    }
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="form-inline">
                <table id={"123"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Mã phương tiện"}</th>
                            <th>{"Tên phương tiện"}</th>
                            <th>{"Trọng tải"}</th>
                            <th>{"Thể tích"}</th>
                            <th>{"Hành động"}</th>
                            <th>{"Chọn"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (vehiclesList && vehiclesList.length !== 0) && 
                                vehiclesList.map((vehicle, index) => (
                                    vehicle && 
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{vehicle.code}</td>
                                        <td>{vehicle.assetName}</td>
                                        <td>{vehicle.payload}</td>
                                        <td>{vehicle.volume}</td>
                                        <td style={{ textAlign: "center" }}>
                                            {/* <a className="edit text-green" style={{ width: '5px' }} title={"Thông tin xe"} 
                                                // onClick={() => handleShowDetailInfo(example)}
                                            >
                                                <i className="material-icons">visibility</i></a> */}

                                            {/* <a className="text-green"
                                                onClick={() => handleChooseVehicle(vehicle)}
                                            >
                                                <i className="material-icons">add_comment</i></a> */}
                                            {/* <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a> */}
                                            {/* <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: example._id,
                                                    info: example.exampleName
                                                }}
                                                func={handleDelete}
                                            /> */}
                                        </td>
                                        <td key={index} className="tooltip-checkbox">
                                            <span className={"icon " + getTickboxStatus(vehicle)}
                                                // title={translate(`manufacturing.work_schedule.${command.status}.content`)} 
                                                // style={{ backgroundColor: "green"}}
                                                onClick={() => selectVehicle(index, vehicle)}
                                                
                                            >
                                            </span>
                                            <span className="tooltiptext">
                                                {/* <a 
                                                    style={{ color: "white" }} 
                                                    onClick={() => this.handleShowDetailManufacturingCommand(command)}
                                                >
                                                    {command.code}
                                                </a> */}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { assetsManager } =state;
    const { currentTransportPlan } = state.transportPlan;
    const {transportVehicle} = state;
    console.log(transportVehicle)
    return { assetsManager,  currentTransportPlan, transportVehicle};
}

const actions = {
    getAllAsset: AssetManagerActions.getAllAsset,
    createTransportVehicle: transportVehicleActions.createTransportVehicle,
    createTransportPlanVehicleNotDuplicate: transportVehicleActions.createTransportPlanVehicleNotDuplicate,
    editTransportPlan: transportPlanActions.editTransportPlan,
    getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
    editTransportVehicle: transportVehicleActions.editTransportVehicle,
    addTransportVehicleToPlan: transportPlanActions.addTransportVehicleToPlan,
}

const connectedTransportVehicleManagementTable = connect(mapState, actions)(withTranslate(TransportVehicleManagementTable));
export { connectedTransportVehicleManagementTable as TransportVehicleManagementTable };

