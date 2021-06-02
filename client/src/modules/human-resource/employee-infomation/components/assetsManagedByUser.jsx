import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { AssetManagerActions } from '../../../asset/admin/asset-information/redux/actions';
import { AssetService } from "../../../asset/admin/asset-information/redux/services";
function areEqual(prevProps, nextProps) {
    if (prevProps.user._id === nextProps.user._id ){
        return true
    } else {
        return false
    }
}
function AssetsManagedByUser(props) {
    const [ listAssets, setListAssets ] = useState({status:false})
    const { translate } = props
    useEffect(() => {
        if (props.user._id) {
            if (props.type==="quản lý"){
                AssetService.getAll({ currentRole: localStorage.getItem('currentRole'), managedBy: props.user._id })
                .then(res=>
                    {
                        setListAssets({status:true,data:res.data.content.data})
                    }
                )
                .catch(err=>setListAssets({status:true}))
            }
            if (props.type==="sử dụng"){
                AssetService.getAll({ currentRole: localStorage.getItem('currentRole'), handoverUser: props.user.name })
                .then(res=>
                    {
                        setListAssets({status:true,data:res.data.content.data})
                    }
                )
                .catch(err=>setListAssets({status:true}))
            }
        }
    }, [props.user._id])
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
    return (
        <React.Fragment>
            <table  className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                        <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                        <th style={{ width: "10%" }}>{translate('asset.general_information.asset_group')}</th>
                        <th style={{ width: "10%" }}>{translate('asset.general_information.asset_type')}</th>
                        <th style={{ width: "10%" }}>{translate('asset.general_information.purchase_date')}</th>
                        <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                        <th style={{ width: "10%" }}>{translate('asset.general_information.disposal_date')}</th>
                    </tr>
                </thead>
                <tbody>
                    {(listAssets.data && listAssets.data.length !== 0) ?
                        listAssets.data.map((x, index) => (
                            <tr key={index}>
                                <td>{x.code}</td>
                                <td>{x.assetName}</td>
                                <td>{convertGroupAsset(x.group)}</td>
                                <td>{x.assetType && x.assetType.length !== 0 && x.assetType.map((type, index, arr) => index !== arr.length - 1 ? type.typeName + ', ' : type.typeName)}</td>
                                <td>{formatDate(x.purchaseDate)}</td>
                                <td>{formatStatus(x.status)}</td>
                                <td>{formatDisposalDate(x.disposalDate, x.status)}</td>
                            </tr>)) : null
                    }
                </tbody>
            </table>
            {!listAssets.status ?
                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                (!listAssets.data || listAssets.data.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
        </React.Fragment>
    )
}
function mapState(state) {
    const { } = state;

    return { }
}

const mapDispatchToProps = {
    getAllAsset: AssetManagerActions.getAllAsset,
}



export default connect(mapState, mapDispatchToProps)(withTranslate(React.memo(AssetsManagedByUser,areEqual)));