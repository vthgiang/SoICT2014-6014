import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { AssetManagerActions } from '../../../../asset/admin/asset-information/redux/actions'
import { transportVehicleActions } from "../redux/actions";
import { transportPlanActions} from "../../transport-plan/redux/actions"

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import './transportVehicleChosen.css';

function TransportVehicle(props) {
    const { currentTransportPlanId, currentTransportPlan } = props;

    const getTableId = "table-manage-transport-vehicle";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const [vehiclesListState, setVehilesListState] = useState({});


    const [fullVehiclesList, setFullVehicleList] = useState(); // State chứa cả trạng thái xe đã chọn hay chưa

    /*
     * State lưu trạng thái xe đang có của lịch trình hiện tại
     */
    const [planVehiclesList, setPlanVehiclesList] = useState();

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
    }, [currentTransportPlanId])

    useEffect(() => {
        setPlanVehiclesList(currentTransportPlan?.transportVehicles);
    }, [currentTransportPlan])

    useEffect(() => {
        console.log(planVehiclesList, " planVehiclesList")
    }, [planVehiclesList])

    /**
     * Check xe trong kế hoạch planVehiclesList và xe được sử dụng vehicleList
     */
    useEffect(() => {
        // if (vehiclesList && vehiclesList.length !==0 && planVehiclesList && planVehiclesList.length !== 0){
        //     vehiclesList.map((item, index) => {
        //         planVehiclesList.map((item2, index2) => {

        //         })
        //     })
        // }
    }, [planVehiclesList, vehiclesList])

    const handleChooseVehicle = (vehicle) => {
        console.log(vehicle, " day la vehicle")
        const data = {
            id: vehicle._id,
            code: vehicle.code,
            name: vehicle.assetName,
            payload: vehicle.payload,
            volume: vehicle.volume,
            transportPlan: currentTransportPlanId,
        }
        // props.createTransportVehicle(data);
        props.createTransportPlanVehicleNotDuplicate(vehicle._id, data);
        // props.editTransportPlan(currentTransportPlanId, {
        //     transportVehicles: {
        //         transportVehicle:
        //     }
        // })
    }

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="form-group">
                    <button type="button" className="btn btn-success" title="Lọc" 
                        // onClick={this.handleSubmitSearch}
                    >
                        {"Lưu kế hoạch phương tiện"}
                    </button>
                </div>
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
                            <th>{"Chosen"}</th>
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
                                            <a className="edit text-green" style={{ width: '5px' }} title={"Thông tin xe"} 
                                                // onClick={() => handleShowDetailInfo(example)}
                                            >
                                                <i className="material-icons">visibility</i></a>

                                            <a className="text-green"
                                                onClick={() => handleChooseVehicle(vehicle)}
                                            >
                                                <i className="material-icons">add_comment</i></a>
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
                                            <span className="icon" 
                                                // title={translate(`manufacturing.work_schedule.${command.status}.content`)} 
                                                // style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}
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
                 
                        {/* {(lists && lists.length !== 0) &&
                            lists.map((example, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * perPage}</td>
                                    <td>{example.exampleName}</td>
                                    <td>{example.description}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_example.delete')}
                                            data={{
                                                id: example._id,
                                                info: example.exampleName
                                            }}
                                            func={handleDelete}
                                        />
                                    </td>
                                </tr>
                            ))
                        } */}
                    </tbody>
                </table>

                {/* PaginateBar */}
                {/* {example && example.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                } */}
                {/* <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={example && example.totalList}
                    func={setPage}
                /> */}
            </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { assetsManager } =state;
    const { currentTransportPlan } = state.transportPlan;
    return { assetsManager,  currentTransportPlan};
}

const actions = {
    getAllAsset: AssetManagerActions.getAllAsset,
    createTransportVehicle: transportVehicleActions.createTransportVehicle,
    createTransportPlanVehicleNotDuplicate: transportVehicleActions.createTransportPlanVehicleNotDuplicate,
    editTransportPlan: transportPlanActions.editTransportPlan,
    getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
}

const connectedTransportVehicle = connect(mapState, actions)(withTranslate(TransportVehicle));
export { connectedTransportVehicle as TransportVehicle };