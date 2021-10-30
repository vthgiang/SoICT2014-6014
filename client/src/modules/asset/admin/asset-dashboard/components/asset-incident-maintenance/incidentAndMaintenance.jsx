import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';

import {AssetIncidentChart} from './assetIncidentChart';
import {AssetMaintenanceChart} from './assetMaintenanceChart';
import { AssetManagerActions } from '../../../asset-information/redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { AssetTypeService } from '../../../asset-type/redux/services';

class IncidentAndMaintenance extends Component {

    constructor(props) {
        super(props);

        this.EXPORT_DATA = {
            incidentData: null,
            maintenanceData: null
        }

        this.state = {
            listAssets: [],
        }
    }

    componentDidMount() {
        AssetService.getAll({
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
            limit: 0
        }).then(res => {
            if (res.data.success) {
                this.setState({ listAssets: res.data.content.data });
            }
        }).catch(err => {
            console.log(err);
        });
        this.props.getAllAssetIncident()
        this.props.getAllAssetMaintenance()
        AssetTypeService.getAssetTypes().then(res => {
            if (res.data.success) {
                this.setState({ assetType: res.data.content.list })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    getAssetTypeParentName = (listAssetTypeId, ListAssetType) => {
        const { translate } = this.props;
        let newArr = [];
        if (listAssetTypeId && listAssetTypeId.length === 0) {
            ListAssetType.forEach(() => {
                newArr = [`${translate('asset.general_information.choose_all')}`];
            })
        } else {
            ListAssetType.forEach(x => {
                listAssetTypeId.forEach(y => {
                    if (x._id === y)
                        newArr = [...newArr, x.typeName]
                })
            })
        }
        return newArr;
    }

    getIncidentData = (incidentData, assetTypeSearch) => {
        const { assetType } = this.state;
        let assetTypeName;

        if (assetType && assetType.length > 0) {
            assetTypeName = this.getAssetTypeParentName(assetTypeSearch, assetType);

            const newAssetTypeIncidentChart = { ...incidentData, assetTypeName }

            this.EXPORT_DATA.incidentData = newAssetTypeIncidentChart;

            this.props.setIncidentAndMaintenanceDataExportData(this.EXPORT_DATA.incidentData, this.EXPORT_DATA.maintenanceData)
        }
    }

    getMaintenanceData = (maintenanceData, assetTypeSearch) => {
        const { assetType } = this.state;
        let assetTypeName;

        if (assetType && assetType.length > 0) {
            assetTypeName = this.getAssetTypeParentName(assetTypeSearch, assetType);

            const newAssetTypeMaintenanceChart = { ...maintenanceData, assetTypeName }

            this.EXPORT_DATA.maintenanceData = newAssetTypeMaintenanceChart;

            this.props.setIncidentAndMaintenanceDataExportData(this.EXPORT_DATA.incidentData, this.EXPORT_DATA.maintenanceData)
        }
    }

    render() {
        const { translate } = this.props;
        const { listAssets, assetType } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">

                        {/* Biểu đồ sự cố */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.incident_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AssetIncidentChart
                                        listAssets={listAssets}
                                        assetType={assetType}
                                        getIncidentData={this.getIncidentData}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ bảo trì-sửa chữa tài sản */}
                        <div className="col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.maintenance_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AssetMaintenanceChart
                                        listAssets={listAssets}
                                        assetType={assetType}
                                        getMaintenanceData={this.getMaintenanceData}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment >
        );
    }
}
function mapState(state) {
    const { listAssets,incidentAsset,maintenanceAsset } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType ,incidentAsset,maintenanceAsset};
}
const mapDispatchToProps = {
    getAllAssetIncident : AssetManagerActions.getAllAssetIncident,
    getAllAssetMaintenance : AssetManagerActions.getAllAssetMaintenance
    
}
const IncidentAndMaintenanceConnect = connect(mapState,mapDispatchToProps)(withTranslate(IncidentAndMaintenance));
export { IncidentAndMaintenanceConnect as IncidentAndMaintenance };