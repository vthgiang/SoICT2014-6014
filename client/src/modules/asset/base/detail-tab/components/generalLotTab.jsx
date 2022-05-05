import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { translate } from "react-redux-multilingual/lib/utils";
import { ApiImage, SmartTable } from "../../../../../common-components";
import { getPropertyOfValue } from "../../../../../helpers/stringMethod";
import { getTableConfiguration } from "../../../../../helpers/tableConfiguration";
import { AssetDetailForm } from "../../../admin/asset-information/components/assetDetailForm";
import { AssetTypeActions } from "../../../admin/asset-type/redux/actions";


function GeneralLotTab(props) {
    const tableId_constructor = "table-asset-detail";

    const defaultConfig = { limit: 5 };
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        defaultAvatar: "./upload/asset/pictures/picture5.png",

        page: 0,
        limit: limit_constructor,
        tableId: tableId_constructor,
    })

    const [prevProps, setPrevProps] = useState({
        id: null
    })

    useEffect(() => {
        props.getAssetTypes();
    }, [])

    if (prevProps.id !== props.id) {
        setState({
            ...state,
            id: props.id,
            avatar: props.avatar,
            code: props.code,
            assetLotName: props.assetLotName,
            group: props.group,
            assetTypes: props.assetTypeEdit,
            total: props.total,
            price: props.price,
            supplier: props.supplier,
        })
        setPrevProps(props)
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

    const { id, translate, user, assetsManager, department, role, assetLotManager } = props;
    var userlist = user.list, departmentlist = department.list;
    let assetbuilding = assetsManager && assetsManager.buildingAssets;
    let assetbuildinglist = assetbuilding && assetbuilding.list;

    const {
        avatar, code, assetLotName, assetTypes, group, total, price, supplier,
        currentRowView, tableId,
    } = state;


    const formatStatus = (status) => {
        const { translate } = props;

        if (status === 'ready_to_use') {
            return translate('asset.general_information.ready_use')
        }
        else if (status === 'in_use') {
            return translate('asset.general_information.using')
        }
        else if (status === 'broken') {
            return translate('asset.general_information.damaged')
        }
        else if (status === 'lost') {
            return translate('asset.general_information.lost')
        }
        else if (status === 'disposed') {
            return translate('asset.general_information.disposal')
        }
        else {
            return '';
        }
    }

    const formatDisposalDate = (disposalDate, status) => {
        const { translate } = props;
        if (status === 'disposed') {
            if (disposalDate) return formatDate(disposalDate);
            else return translate('asset.general_information.not_disposal_date');
        }
        else {
            return translate('asset.general_information.not_disposal');
        }
    }

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });
        //props.getAllAsset({ ...state, limit: parseInt(number) });
    }

    const onSelectedRowsChange = (value) => {
        //setSelectedData(value)
    }

    // Bắt sự kiện click xem thông tin tài sản
    const handleView = async (value) => {
        setState({
            ...state,
            currentRowView: value
        });
        window.$('#modal-view-asset').modal('show');
    }

    return (
        <div id={id} className="tab-pane active">
            <div className="box-body" >
                <div className="row" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                    {/* Anh lo tài sản */}
                    <div className="col-md-4 " style={{ textAlign: 'center', paddingLeft: '0px' }}>
                        <div>
                            {avatar && <ApiImage className="attachment-img avarta" id={`avater-imform-${id}`} src={`.${avatar}`} />}
                        </div>
                    </div>

                    {/* Thông tin cơ bản */}
                    <br />
                    <div className="col-md-8  " style={{ paddingRight: '0px', paddingLeft: '0px', minWidth: '350px' }}>
                        <div>
                            <div className="col-md-6">

                                {/* Mã tài sản */}
                                <div className="form-group">
                                    <strong>{translate('asset.asset_lot.asset_lot_code')}&emsp; </strong>
                                    {code}
                                </div>

                                {/* Tên tài sản */}
                                <div className="form-group">
                                    <strong>{translate('asset.asset_lot.asset_lot_name')}&emsp; </strong>
                                    {assetLotName}
                                </div>

                                {/* Nhóm tài sản */}
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.asset_group')}&emsp; </strong>
                                    {convertGroupAsset(group)}
                                </div>
                                {/* Loại tài sản */}
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.asset_type')}&emsp; </strong>
                                    {assetTypes && assetTypes.length ? assetTypes.map((item, index) => { let suffix = index < assetTypes.length - 1 ? ", " : ""; return item.typeName + suffix }) : ''}
                                </div>
                            </div>
                            <div className="col-md-6">
                                {/* So luong ban dau */}
                                <div className="form-group">
                                    <strong>{translate('asset.asset_lot.asset_lot_total')}&emsp; </strong>
                                    {total}
                                </div>
                                {/* Gia tien */}
                                <div className="form-group">
                                    <strong>{translate('asset.asset_lot.asset_lot_price')}&emsp; </strong>
                                    {price}
                                </div>
                                {/* Nha cung cap */}
                                <div className="form-group">
                                    <strong>{translate('asset.asset_lot.supplier')}&emsp; </strong>
                                    {supplier}
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    {/* Thông tin cac tai san trong lo */}
                    <div className="col-md-12">
                        <label>{translate('asset.asset_lot.assets_information')}:<a style={{ cursor: "pointer" }} title={translate('asset.general_information.asset_properties')}></a></label>
                        <div className="form-group">
                            <SmartTable
                                tableId={tableId}
                                columnData={{
                                    index: translate('manage_example.index'),
                                    assetCode: translate('asset.general_information.asset_code'),
                                    assetName: translate('asset.general_information.asset_name'),
                                    assetGroup: translate('asset.general_information.asset_group'),
                                    assetType: translate('asset.general_information.asset_type'),
                                    assetPurchaseDate: translate('asset.general_information.purchase_date'),
                                    assetManager: translate('asset.general_information.manager'),
                                    assetUser: translate('asset.general_information.user'),
                                    assetOrganizationUnit: translate('asset.general_information.organization_unit'),
                                    assetStatus: translate('asset.general_information.status'),
                                    assetDisposalDate: translate('asset.general_information.disposal_date')
                                }}
                                tableHeaderData={{
                                    index: <th>{translate('manage_example.index')}</th>,
                                    assetCode: <th>{translate('asset.general_information.asset_code')}</th>,
                                    assetName: <th>{translate('asset.general_information.asset_name')}</th>,
                                    assetGroup: <th>{translate('asset.general_information.asset_group')}</th>,
                                    assetType: <th>{translate('asset.general_information.asset_type')}</th>,
                                    assetPurchaseDate: <th>{translate('asset.general_information.purchase_date')}</th>,
                                    assetManager: <th>{translate('asset.general_information.manager')}</th>,
                                    assetUser: <th>{translate('asset.general_information.user')}</th>,
                                    assetOrganizationUnit: <th>{translate('asset.general_information.organization_unit')}</th>,
                                    assetStatus: <th>{translate('asset.general_information.status')}</th>,
                                    assetDisposalDate: <th>{translate('asset.general_information.disposal_date')}</th>,
                                    action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                                }}
                                tableBodyData={assetLotManager.listAssets?.length > 0 && assetLotManager.listAssets.map((x, index) => {
                                    //console.log("hang detail",x.assetType);
                                    return {
                                        id: x?._id,
                                        index: <td>{index + 1}</td>,
                                        assetCode: <td>{x.code}</td>,
                                        assetName: <td>{x.assetName}</td>,
                                        assetGroup: <td>{convertGroupAsset(x.group)}</td>,
                                        assetType: <td>{x.assetType && x.assetType.length !== 0 && x.assetType.map((type, index, arr) => index !== arr.length - 1 ? type.typeName + ', ' : type.typeName)}</td>,
                                        assetPurchaseDate: <td>{formatDate(x.purchaseDate)}</td>,
                                        assetManager: <td>{getPropertyOfValue(x.managedBy, 'email', false, userlist)}</td>,
                                        assetUser: <td>{getPropertyOfValue(x.assignedToUser, 'email', false, userlist)}</td>,
                                        assetOrganizationUnit: <td>{getPropertyOfValue(x.assignedToOrganizationalUnit, 'name', false, departmentlist)}</td>,
                                        assetStatus: <td>{formatStatus(x.status)}</td>,
                                        assetDisposalDate: <td>{formatDisposalDate(x.disposalDate, x.status)}</td>,
                                        action: <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleView(x)}><i className="material-icons">visibility</i></a>
                                        </td>
                                    }
                                })}
                                dataDependency={assetLotManager.listAssets}
                                onSetNumberOfRowsPerpage={setLimit}
                                onSelectedRowsChange={onSelectedRowsChange}
                            />
                        </div>
                        {/* Form xem thông tin tài sản */}
                        {
                            currentRowView &&
                            <AssetDetailForm
                                _id={currentRowView._id}
                                avatar={currentRowView.avatar}
                                code={currentRowView.code}
                                assetName={currentRowView.assetName}
                                serial={currentRowView.serial}
                                assetType={currentRowView.assetType}
                                group={currentRowView.group}
                                purchaseDate={currentRowView.purchaseDate}
                                warrantyExpirationDate={currentRowView.warrantyExpirationDate}
                                managedBy={getPropertyOfValue(currentRowView.managedBy, '_id', true, userlist)}
                                assignedToUser={getPropertyOfValue(currentRowView.assignedToUser, '_id', true, userlist)}
                                assignedToOrganizationalUnit={getPropertyOfValue(currentRowView.assignedToOrganizationalUnit, '_id', true, departmentlist)}
                                handoverFromDate={currentRowView.handoverFromDate}
                                handoverToDate={currentRowView.handoverToDate}
                                location={currentRowView.location}
                                description={currentRowView.description}
                                status={currentRowView.status}
                                typeRegisterForUse={currentRowView.typeRegisterForUse}
                                detailInfo={currentRowView.detailInfo}
                                cost={currentRowView.cost}
                                readByRoles={currentRowView.readByRoles}
                                residualValue={currentRowView.residualValue}
                                startDepreciation={currentRowView.startDepreciation}
                                usefulLife={currentRowView.usefulLife}
                                depreciationType={currentRowView.depreciationType}
                                estimatedTotalProduction={currentRowView.estimatedTotalProduction}
                                unitsProducedDuringTheYears={currentRowView.unitsProducedDuringTheYears}

                                maintainanceLogs={currentRowView.maintainanceLogs}
                                usageLogs={currentRowView.usageLogs}
                                incidentLogs={currentRowView.incidentLogs}

                                disposalDate={currentRowView.disposalDate}
                                disposalType={currentRowView.disposalType}
                                disposalCost={currentRowView.disposalCost}
                                disposalDesc={currentRowView.disposalDesc}

                                archivedRecordNumber={currentRowView.archivedRecordNumber}
                                files={currentRowView.documents}
                                linkPage={"management"}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapState(state) {
    const { user, assetType, assetLotManager, assetsManager, department, role } = state;
    return { user, assetType, assetLotManager, assetsManager, department, role };
}
const actions = {
    getAssetTypes: AssetTypeActions.getAssetTypes,
}
const tabGeneral = connect(mapState, actions)(withTranslate(GeneralLotTab));
export { tabGeneral as GeneralLotTab };