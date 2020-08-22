import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetTypeActions } from '../../asset-type/redux/actions';

class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.getAssetTypes();

    }
    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetTypes: nextProps.assetTypes,
                purchaseDate: nextProps.purchaseDate,
                warrantyExpirationDate: nextProps.warrantyExpirationDate,
                managedBy: nextProps.managedBy,
                assignedToUser: nextProps.assignedToUser,
                assignedToOrganizationalUnit: nextProps.assignedToOrganizationalUnit,
                handoverFromDate: nextProps.handoverFromDate,
                handoverToDate: nextProps.handoverToDate,
                location: nextProps.location,
                description: nextProps.description,
                status: nextProps.status,
                canRegisterForUse: nextProps.canRegisterForUse,
                detailInfo: nextProps.detailInfo,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate, user, assetType, assetsManager } = this.props;
        var userlist = user.list;
        var assettype = assetType && assetType.administration;
        let assettypelist = assettype && assettype.types.list;
        let assetbuilding = assetsManager && assetsManager.buildingAssets;
        let assetbuildinglist = assetbuilding && assetbuilding.list;

        const {
            img, avatar, code, assetName, serial, assetTypes, purchaseDate, warrantyExpirationDate,
            managedBy, assignedToUser, assignedToOrganizationalUnit, handoverFromDate, handoverToDate, location, description, status, canRegisterForUse, detailInfo
        } = this.state;

        return (
            <div id={id} className="tab-pane active">
                <div className="box-body">
                    <div className="col-md-12">
                        {/* Anh tài sản */}
                        <div className="col-md-4" style={{ textAlign: 'center' }}>
                            <div>
                                <a href={process.env.REACT_APP_SERVER + avatar} target="_blank">
                                    <img className="attachment-img avarta" src={process.env.REACT_APP_SERVER + avatar} alt="Attachment" />
                                </a>
                            </div>
                        </div>

                        {/* Thông tin cơ bản */}
                        <label>{translate('asset.general_information.basic_information')}:</label>
                        <br />
                        <div className="col-md-8">
                            <div>
                                <div className="col-md-6">

                                    {/* Mã tài sản */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_code')}&emsp; </strong>
                                        {code}
                                    </div>

                                    {/* Tên tài sản */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_name')}&emsp; </strong>
                                        {assetName}
                                    </div>

                                    {/* Số serial */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.serial_number')}&emsp; </strong>
                                        {serial}
                                    </div>

                                    {/* Loại tài sản */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_type')}&emsp; </strong>
                                        {assetTypes && assettypelist.length && assettypelist.filter(item => item._id === assetTypes).pop() ? assettypelist.filter(item => item._id === assetTypes).pop().typeName : 'Asset type is deleted'}
                                    </div>

                                    {/* Ngày nhập */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.purchase_date')}&emsp; </strong>
                                        {this.formatDate(purchaseDate)}
                                    </div>

                                    {/* Ngày bảo hành */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.warranty_expiration_date')}&emsp; </strong>
                                        {this.formatDate(warrantyExpirationDate)}
                                    </div>

                                    {/* Người quản lý */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.manager')}&emsp; </strong>
                                        {managedBy && userlist.length && userlist.filter(item => item._id === managedBy).pop() ? userlist.filter(item => item._id === managedBy).pop().name : 'User is deleted'}
                                    </div>
                                </div>

                                <div className="col-md-6">

                                    {/* Người sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.user')}&emsp; </strong>
                                        {assignedToUser ? (userlist.length && userlist.filter(item => item._id === assignedToUser).pop() ? userlist.filter(item => item._id === assignedToUser).pop().name : 'User is deleted') : ''}
                                    </div>

                                    {/* Thời gian bắt đầu sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.handover_from_date')}&emsp; </strong>
                                        {handoverFromDate ? this.formatDate(handoverFromDate) : ''}
                                    </div>

                                    {/* Thời gian kết thúc sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.handover_to_date')}&emsp; </strong>
                                        {handoverToDate ? this.formatDate(handoverToDate) : ''}
                                    </div>

                                    {/* Vị trí */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.asset_location')}&emsp; </strong>
                                        {location && assetbuildinglist.length && assetbuildinglist.filter(item => item._id === location).pop() ? assetbuildinglist.filter(item => item._id === location).pop().assetName : 'Data is deleted'}
                                    </div>

                                    {/* Mô tả */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.description')}&emsp; </strong>
                                        {description}
                                    </div>

                                    {/* Trạng thái */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.status')}&emsp; </strong>
                                        {status}
                                    </div>

                                    {/* Quyền đăng ký sử dụng */}
                                    <div className="form-group">
                                        <strong>{translate('asset.general_information.can_register_for_use')}&emsp; </strong>
                                        {canRegisterForUse}
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="col-md-12">
                                <label>{translate('asset.general_information.detail_information')}:<a title={translate('asset.general_information.detail_information')}></a></label>
                                <div className="form-group">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>{translate('asset.asset_info.field_name')}</th>
                                                <th>{translate('asset.asset_info.value')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(!detailInfo || detailInfo.length === 0) ? <tr>
                                                <td colSpan={3}>
                                                    <center> {translate('table.no_data')}</center>
                                                </td>
                                            </tr> :
                                                detailInfo.map((x, index) => {
                                                    return <tr key={index}>
                                                        <td>{x.nameField}</td>
                                                        <td>{x.value}</td>
                                                    </tr>
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function mapState(state) {
    const { user, assetType, assetsManager } = state;
    return { user, assetType, assetsManager };
};
const actions = {
    getAssetTypes: AssetTypeActions.getAssetTypes,
}
const tabGeneral = connect(mapState, actions)(withTranslate(GeneralTab));
export { tabGeneral as GeneralTab };
