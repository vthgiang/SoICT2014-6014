import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';
import { AssetTypeService } from '../../../asset-type/redux/services';

import AmountTree from './amount-of-asset/amountTree';
import DepreciationTree from './depreciation-of-asset/depreciationTree';
import ValueTree from './value-of-asset/valueTree';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { TreeSelect, PaginateBar } from '../../../../../../common-components';
import isEqual from 'lodash/isEqual';
import StatisticalAssetByType from './statisticalAssetByType';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';
import { AssetTypeActions } from '../../../asset-type/redux/actions';
class AssetByType extends Component {

    constructor(props) {
        super(props);

        this.INFO_SEARCH = {
            typeOfChart: ["Bar"]
        }
        this.EXPORT_DATA = {
            amountOfAsset: null,
            depreciationOfAsset: null,
            valueOfAsset: null
        }

        const defaultConfig = { limit: 10 }
        this.dashboardAssetByTypeId = "dashboard_asset_by_type";
        const dashboardAssetByType = getTableConfiguration(this.dashboardAssetByTypeId, defaultConfig).limit;

        this.state = {
            listAssets: [],
            displayBy: this.INFO_SEARCH.displayBy,
            typeOfChart: this.INFO_SEARCH.typeOfChart,
            depreciationOfAsset: [],
            amountOfAsset: [],
            valueOfAsset: [],
            depreciation: [],
            page: 1,
            limit: dashboardAssetByType,
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


        this.props.getAssetTypes({ page: this.state.page, perPage: this.state.limit })
    }

    handleSelectTypeOfDisplay = async (value) => {
        this.INFO_SEARCH.displayBy = value
    }

    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                displayBy: this.INFO_SEARCH.displayBy
            }
        })
    }

    setAmountOfAsset = (value) => {
        let { amountOfAsset } = this.state;
        this.EXPORT_DATA.amountOfAsset = value;
        this.props.setAssetByTypeExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)

        if (!isEqual(amountOfAsset, value)) {
            this.setState(state => {
                return {
                    ...state,
                    amountOfAsset: value,
                }
            })
        }
    }

    setDepreciationOfAsset = (value) => {
        let { depreciation } = this.state;
        this.EXPORT_DATA.depreciationOfAsset = value;
        this.props.setAssetByTypeExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)

        if (!isEqual(depreciation, value)) {
            this.setState(state => {
                return {
                    ...state,
                    depreciation: value,
                }
            })
        }
    }

    setValueOfAsset = (value) => {
        let { valueOfAsset } = this.state;
        this.EXPORT_DATA.valueOfAsset = value;
        this.props.setAssetByTypeExportData(this.EXPORT_DATA.amountOfAsset, this.EXPORT_DATA.depreciationOfAsset, this.EXPORT_DATA.valueOfAsset)

        if (!isEqual(valueOfAsset, value)) {
            this.setState(state => {
                return {
                    ...state,
                    valueOfAsset: value,
                }
            })
        }
    }

    getDepreciationOfAsset = (value) => {
        let { depreciationOfAsset } = this.state;
        if (!isEqual(depreciationOfAsset, value)) {
            this.setState(state => {
                return {
                    ...state,
                    depreciationOfAsset: value,
                }
            })
        }
    }

    getAssetTypes = (assetType) => {
        let typeArr = [];
        assetType.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null
            })
        })
        return typeArr;
    }

    handleChangeTypeAsset = (value) => {
        this.setState(state => {
            return {
                ...state,
                type: JSON.stringify(value),
            }
        })
    }

    handlePaginationAssetType = (page) => {
        const { limit } = this.state;
        this.setState({
            ...this.state,
            page,
        })
        this.props.getAssetTypes({ page: page, perPage: limit })
    }

    render() {
        const { translate, assetType } = this.props;
        const listAssetTypes = assetType?.administration?.types?.list
        let { listAssets, type, depreciationOfAsset, amountOfAsset, valueOfAsset, depreciation, page } = this.state;

        const listAssetTypeConvert = listAssetTypes && listAssetTypes.length > 0 ?
            this.getAssetTypes(listAssetTypes) : [];
        let assetTypes;

        if (type && JSON.parse(type).length > 0 && listAssetTypes && listAssetTypes.length > 0) {
            assetTypes = listAssetTypes.filter((obj, index) => JSON.parse(type).some(item => obj._id === item));
        } else {
            assetTypes = listAssetTypes;
        }

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">
                        <div className="col-md-12">
                            {/* Chọn loại tài sản */}
                            <div className="form-group" style={{ width: "100%" }}>
                                <label style={{ width: 90 }}>{translate('asset.general_information.asset_type')}</label>
                                <TreeSelect
                                    data={listAssetTypeConvert}
                                    value={type ? type : []}
                                    handleChange={this.handleChangeTypeAsset}
                                    mode="hierarchical"
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <PaginateBar
                                display={listAssetTypes?.length}
                                total={assetType?.administration?.types?.totalList}
                                pageTotal={assetType?.administration?.types?.totalPage}
                                currentPage={page}
                                func={this.handlePaginationAssetType} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">Biểu đồ thống kê tài sản theo loại</div>
                                </div>
                                <div className="box-body qlcv">
                                    {
                                        (amountOfAsset || depreciation || valueOfAsset) &&
                                        <StatisticalAssetByType
                                            amountOfAsset={amountOfAsset}
                                            depreciationOfAsset={depreciation}
                                            valueOfAsset={valueOfAsset}
                                        />
                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.amount_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AmountTree
                                        listAssets={listAssets}
                                        assetType={assetTypes}
                                        setAmountOfAsset={this.setAmountOfAsset}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.value_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <ValueTree
                                        listAssets={listAssets}
                                        assetType={assetTypes}
                                        setValueOfAsset={this.setValueOfAsset}
                                        depreciationOfAsset={depreciationOfAsset}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{translate('asset.dashboard.depreciation_of_asset')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <DepreciationTree
                                        listAssets={listAssets}
                                        assetType={assetTypes}
                                        setDepreciationOfAsset={this.setDepreciationOfAsset}
                                        getDepreciationOfAsset={this.getDepreciationOfAsset}
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
    const { listAssets } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType };
}

const mapDispatchToProps = {
    getAssetTypes: AssetTypeActions.getAssetTypes,
}

const AssetByTypeConnect = connect(mapState, mapDispatchToProps)(withTranslate(AssetByType));
export { AssetByTypeConnect as AssetByType };