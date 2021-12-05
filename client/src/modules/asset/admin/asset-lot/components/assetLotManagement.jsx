import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Swal from "sweetalert2";
import { DeleteNotification, PaginateBar, SelectMulti, SmartTable, TreeSelect } from "../../../../../common-components";
import { getTableConfiguration } from "../../../../../helpers/tableConfiguration";
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetLotManagerActions } from "../redux/actions";

const getAssetLotName = (listAssetLot, idAssetLot) => {
    let assetLotName;
    if (listAssetLot?.length && idAssetLot) {
        for (let i = 0; i < listAssetLot.length; i++) {
            if (listAssetLot[i]?._id === idAssetLot) {
                assetLotName = `${listAssetLot[i].code} - ${listAssetLot[i].assetLotName}`;
                break;
            }
        }
    }
    return assetLotName;
}

function AssetLotManagement(props) {
    const tableId_constructor = "table-asset-lot-manager";
    const defaultConfig = { limit: 5 };
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        code: "",
        assetLotName: "",
        supplier: "",
        group: "",
        page: 0,
        limit: limit_constructor
    });

    const [selectedData, setSelectedData] = useState();

    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const { assetLotManager, assetType, translate, isActive } = props;
    const { page, limit, currentRowView, status, currentRow, tableId, group } = state;

    useEffect(() => {
        props.getAllAssetLots(state);
        props.getAssetTypes();
    }, []);

    const handleDeleteOptions = () => {
        console.log('selectedData', selectedData)
        const shortTitle = `<h4 style="color: red"><div>${translate('asset.asset_lot.delete_info')} "${selectedData?.length && selectedData.length === 1 ? getAssetLotName(props.assetLotManager?.listAssetLots, selectedData[0]) : ""}" ?</div></h4>`;
        const longTitle = `<h4 style="color: red"><div>Xóa thông tin ${selectedData?.length > 1 ? selectedData.length : ""} lô tài sản ?</div></h4>`;

        Swal.fire({
            html: selectedData?.length === 1 ? shortTitle : longTitle,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && selectedData.length > 0) {
                props.deleteAssetLots({
                    assetLotIds: selectedData
                });
            }
        })

    }

    const handleDeleteAnAssetLot = (id) => {
        props.deleteAssetLot({
            assetLotIds: [id]
        });
    }

    // Bắt sự kiện click xem thông tin tài sản
    const handleView = async (value) => {
        await setState({
            ...state,
            currentRowView: value
        });
        window.$('#modal-view-asset-lot').modal('show');
    }

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    const handleEdit = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-asset-lot').modal('show');
    }

    //lưu giá trị mã lô tài sản vào state khi thay đổi
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    }

    //lưu giá trị tên lô tài sản vào state khi thay đổi
    const handleAssetLotNameChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    }

    //lưu giá trị nhà sản xuất vào state khi thay đổi
    const handleSupplierChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    }

    //lưu giá trị loại tài sản vào state khi thay đổi
    const handleAssetTypeChange = (value) => {
        setState(state => {
            return {
                ...state,
                assetType: value.length !== 0 ? JSON.stringify(value) : null,
            }
        })
    }

    // Bắt sự kiện thay đổi nhóm tài sản
    const handleGroupChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState({
            ...state,
            group: value
        })
    }

    // Bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        await setState({
            ...state,
            page: 0,
        });
        props.getAllAssetLots({ page: 0, ...state });
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });
        props.getAllAssetLots({ ...state, limit: parseInt(number) });
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * state.limit;
        await setState({
            ...state,
            page: parseInt(page),
        });

        props.getAllAssetLots({ ...state, page: parseInt(page) });
    }

    const getAssetTypesList = (types) => {
        let list = types.reduce((list, cur) => {
            return list ? list + ', ' + cur.typeName : cur.typeName;
        }, '');
        return list;
    }

    const getNumber = (number) => {
        return number ? number : '';
    }

    const getAssetTypes = () => {
        let { assetType } = props;
        let assetTypeName = assetType && assetType.listAssetTypes;
        let typeArr = [];
        assetTypeName.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? typeof item.parent === 'object' ? item.parent._id : item.parent : null
            })
        })
        return typeArr;
    }

    const convertGroupAsset = (group) => {
        const { translate } = props;
        if (group === 'building') {
            return translate('asset.dashboard.building')
        }
        else if (group === 'vehicle') {
            return translate('asset.asset_info.vehicle')
        }
        else if (group === 'machine') {
            return translate('asset.dashboard.machine')
        }
        else if (group === 'other') {
            return translate('asset.dashboard.other')
        }
        else return null;
    }

    var lists = "";
    var assettypelist = assetType.listAssetTypes;
    let typeArr = getAssetTypes();
    let assetTypeName = state.assetType ? state.assetType : [];

    if (assetLotManager.isLoading === false) {
        lists = assetLotManager.listAssetLots;
    }

    var pageTotal = ((assetLotManager.totalList % limit) === 0) ?
        parseInt(assetLotManager.totalList / limit) :
        parseInt((assetLotManager.totalList / limit) + 1);
    var currentPage = parseInt((page / limit) + 1);

    return (
        <div className={isActive ? isActive : "box"}>
            <div className="box-body qlcv">
                {/* Thanh tìm kiếm */}
                <div className="form-inline">
                    {/* Mã lô tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.asset_lot.asset_lot_code')}</label>
                        <input type="text" className="form-control" name="code" onChange={handleCodeChange} placeholder={translate('asset.asset_lot.asset_lot_code')} autoComplete="off" />
                    </div>

                    {/* Tên lô tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.asset_lot.asset_lot_name')}</label>
                        <input type="text" className="form-control" name="assetLotName" onChange={handleAssetLotNameChange} placeholder={translate('asset.asset_lot.asset_lot_name')} autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline">
                    {/* Nhóm tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.asset_group')}</label>
                        <SelectMulti id={`multiSelectGroupInManagement`} multiple="multiple"
                            value={group}
                            options={{ nonSelectedText: translate('asset.asset_info.select_group'), allSelectedText: translate('asset.general_information.select_all_group') }}
                            onChange={handleGroupChange}
                            items={[
                                { value: "vehicle", text: translate('asset.asset_info.vehicle') },
                                { value: "machine", text: translate('asset.dashboard.machine') },
                                { value: "other", text: translate('asset.dashboard.other') },
                            ]}
                        >
                        </SelectMulti>
                    </div>

                    {/* Loại tài sản */}
                    <div className="form-group">
                        <label>{translate('asset.general_information.asset_type')}</label>
                        <TreeSelect
                            data={typeArr}
                            value={assetTypeName}
                            handleChange={handleAssetTypeChange}
                            mode="hierarchical"
                        />
                    </div>
                </div>

                <div className="form-inline">
                    {/* Nhà sản xuất */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.asset_lot.supplier')}</label>
                        <input type="text" className="form-control" name="supplier" onChange={handleSupplierChange} placeholder={translate('asset.asset_lot.supplier')} autoComplete="off" />
                    </div>

                    {/* Nút tìm kiếm */}
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={handleSubmitSearch}>{translate('asset.general_information.search')}</button>
                    </div>
                </div>
                {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}
                <SmartTable
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_example.index'),
                        assetLotCode: translate('asset.asset_lot.asset_lot_code'),
                        assetLotName: translate('asset.asset_lot.asset_lot_name'),
                        group: translate('asset.general_information.asset_group'),
                        assetType: translate('asset.general_information.asset_type'),
                        total: translate('asset.asset_lot.asset_lot_total'),
                        price: translate('asset.asset_lot.asset_lot_price'),
                        supplier: translate('asset.asset_lot.supplier'),
                    }}
                    tableHeaderData={{
                        index: <th>{translate('manage_example.index')}</th>,
                        assetLotCode: <th>{translate('asset.asset_lot.asset_lot_code')}</th>,
                        assetLotName: <th>{translate('asset.asset_lot.asset_lot_name')}</th>,
                        group: <th>{translate('asset.general_information.asset_group')}</th>,
                        assetType: <th>{translate('asset.general_information.asset_type')}</th>,
                        total: <th>{translate('asset.asset_lot.asset_lot_total')}</th>,
                        price: <th>{translate('asset.asset_lot.asset_lot_price')}</th>,
                        supplier: <th>{translate('asset.asset_lot.supplier')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={lists?.length > 0 && lists.map((x, index) => {
                        return {
                            id: x?._id,
                            index: <td>{index + 1}</td>,
                            assetLotCode: <td>{x.code}</td>,
                            assetLotName: <td>{x.assetLotName}</td>,
                            group: <td>{convertGroupAsset(x.group)}</td>,
                            assetType: <td>{x.assetType && x.assetType.length !== 0 && x.assetType.map((type, index, arr) => index !== arr.length - 1 ? type.typeName + ', ' : type.typeName)}</td>,
                            total: <th>{x.total}</th>,
                            price: <td>{x.price}</td>,
                            supplier: <td>{x.supplier}</td>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} ><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} ><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('asset.general_information.delete_info')}
                                    data={{
                                        id: x._id,
                                        info: x.code + " - " + x.assetName
                                    }}
                                func={handleDeleteAnAssetLot}
                                />
                            </td>
                        }
                    })}
                    dataDependency={lists}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {assetLotManager.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar
                    display={assetLotManager.listAssetLots ? assetLotManager.listAssetLots.length : null}
                    total={assetLotManager.totalList ? assetLotManager.totalList : null}
                    pageTotal={pageTotal ? pageTotal : 0}
                    currentPage={currentPage}
                    func={setPage}
                />
            </div>


        </div>
    );
};

function mapState(state) {
    const { assetLotManager, assetType, auth } = state;
    return { assetLotManager, assetType, auth };
};

const actionCreators = {
    getAssetTypes: AssetTypeActions.getAssetTypes,
    getAllAssetLots: AssetLotManagerActions.getAllAssetLots,
    deleteAssetLot: AssetLotManagerActions.deleteAssetLots
};

const assetLotManagement = connect(mapState, actionCreators)(withTranslate(AssetLotManagement));
export { assetLotManagement as AssetLotManagement };