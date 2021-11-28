import { useEffect, useState } from "react";
import { getTableConfiguration } from "../../../../../helpers/tableConfiguration";

function AssetLotManagement(props) {
    const tableId_constructor = "table-asset-lot-manager";
    const defaultConfig = { limit: 5 };
    const limit_constructor = getTableConfiguration(tableId_constructor);

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

    const { assetLotsManager, assetType, translate, isActive } = props;
    const { page, limit, currentRowView, status, currentRow, tableId, group } = state;

    useEffect(() => {
        props.getAllAssetLot(state);
        props.getAssetTypes();
    }, []);

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
        props.getAllAssetLot({ page: 0, ...state });
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });
        props.getAllAssetLot({ ...state, limit: parseInt(number) });
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * state.limit;
        await setState({
            ...state,
            page: parseInt(page),
        });

        props.getAllAssetLot({ ...state, page: parseInt(page) });
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

    var assettypelist = assetType.listAssetTypes;
    let typeArr = getAssetTypes();
    let assetTypeName = state.assetType ? state.assetType : [];

    if (assetLotsManager.isLoading === false) {
        lists = assetLotsManager.listAssetLots;
    }

    var pageTotal = ((assetsManager.totalList % limit) === 0) ?
        parseInt(assetsManager.totalList / limit) :
        parseInt((assetsManager.totalList / limit) + 1);
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
                </div>
            </div>
        </div>
    );
};