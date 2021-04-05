import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { AssetManagerActions } from '../../../../asset/admin/asset-information/redux/actions'
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TransportVehicle(props) {
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

    return { assetsManager };
}

const actions = {
    getAllAsset: AssetManagerActions.getAllAsset,
    // deleteExample: exampleActions.deleteExample
}

const connectedTransportVehicle = connect(mapState, actions)(withTranslate(TransportVehicle));
export { connectedTransportVehicle as TransportVehicle };