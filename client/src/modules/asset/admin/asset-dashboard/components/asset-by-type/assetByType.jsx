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
            type:[],
        }
    }

    static getDerivedStateFromProps = (props, state) => {
        if (props?.assetType?.administration?.types?.list && state?.listAssets) {
            const listAssetTypes = props?.assetType?.administration?.types?.list;
            let listAssetTypeSort = [];

            for (let i in listAssetTypes) {
                let count = { ...listAssetTypes[i], countAsset: 0 };
                for (let j in state.listAssets) {
                    if (state.listAssets[j].assetType.some(item => listAssetTypes[i].typeNumber === item.typeNumber))
                        count = { ...count, countAsset: count.countAsset + 1 }
                }
                listAssetTypeSort = [
                    ...listAssetTypeSort,
                    count,
                ];
            }

            listAssetTypeSort = listAssetTypeSort.sort((a, b) => (a.countAsset < b.countAsset) ? 1 : ((b.countAsset < a.countAsset) ? -1 : 0))
            return {
                ...state,
                listAssetTypes: listAssetTypeSort
            }
        } else {
            return null;
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


        this.props.getAssetTypes();
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
        assetType&&assetType.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null,
                typeName: item.typeName,
            })
        })
        return typeArr;
    }

    handleChangeTypeAsset = (value) => {
        this.setState(state => {
            return {
                ...state,
                type: value,
            }
        })
        console.log("type",JSON.stringify(value));
    }
    
    handlePaginationAssetType = (page) => {
        const { limit } = this.state;
        let pageConvert = (page - 1) * (limit);

        this.setState({
            ...this.state,
            page: parseInt(pageConvert),
        })
    }

    render() {
        const { translate, assetType ,chartAsset} = this.props;
        let { listAssets, type, depreciationOfAsset, amountOfAsset, valueOfAsset, depreciation, page, limit, listAssetTypes } = this.state;
        let listAssetTypeConvert = listAssetTypes && listAssetTypes.length > 0 ?
            this.getAssetTypes(listAssetTypes) : [];
        let assetTypes;
        console.log(chartAsset)

        // const listAssetTypePaginate = listAssetTypeConvert && listAssetTypeConvert.slice(startIndex, endIndex + 1);
        let dataShow = chartAsset.dataChartType
        let listAssetsAmount = {}
        if ( this.state.type.length !== 0){
            let countAssetType = [],countAssetValue = [],countAssetDepreciation = [],idAssetType = [],shortName = [],typeName = [],listType = []
            this.state.type.forEach(element => {
                let index = dataShow.listType.findIndex(value=>value._id === element)
                countAssetType = [...countAssetType,dataShow.amountType.countAssetType[index]]
                countAssetValue = [...countAssetValue,dataShow.amountType.countAssetValue[index]]
                countAssetDepreciation = [...countAssetDepreciation,dataShow.amountType.countDepreciation[index]]
                idAssetType = [...idAssetType,dataShow.amountType.idAssetType[index]]
                shortName = [...shortName,dataShow.amountType.shortName[index]]
                typeName = [...typeName,dataShow.amountType.typeName[index]]
                listType = [...listType,dataShow.listType[index]]
            });
            listAssetsAmount = {
                countAssetType : countAssetType,
                countAssetValue : countAssetValue,
                countAssetDepreciation : countAssetDepreciation,
                idAssetType : idAssetType,
                shortName : shortName,
                typeName : typeName,
                listType : listType
                
            }
        } else {
            listAssetsAmount = {
            
                countAssetType : chartAsset.dataChartType.amountType.countAssetType,
                countAssetValue : chartAsset.dataChartType.amountType.countAssetValue,
                countAssetDepreciation : chartAsset.dataChartType.amountType.countDepreciation,
                idAssetType : chartAsset.dataChartType.amountType.idAssetType,
                shortName : chartAsset.dataChartType.amountType.shortName,
                typeName : chartAsset.dataChartType.amountType.typeName,
                listType : chartAsset.dataChartType.listType
                
            }
        }

        let pageTotal = 0, totalItems = 0
        if (listAssetsAmount.listType){
            pageTotal = ((listAssetsAmount.listType.length % limit) === 0) ?
            parseInt(listAssetsAmount.listType.length / limit) :
            parseInt((listAssetsAmount.listType.length / limit) + 1);
            totalItems = listAssetsAmount.listType.length;
        }
        let currentPage = parseInt((page / limit) + 1);

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * limit;
        const endIndex = Math.min(startIndex + limit - 1, totalItems - 1);
        listAssetsAmount = {
            countAssetType : listAssetsAmount.countAssetType.slice(startIndex, endIndex + 1),
            countAssetValue : listAssetsAmount.countAssetValue.slice(startIndex, endIndex + 1),
            countAssetDepreciation : listAssetsAmount.countAssetDepreciation.slice(startIndex, endIndex + 1),
            idAssetType : listAssetsAmount.idAssetType.slice(startIndex, endIndex + 1),
            shortName : listAssetsAmount.shortName.slice(startIndex, endIndex + 1),
            typeName : listAssetsAmount.typeName.slice(startIndex, endIndex + 1),
            listType : listAssetsAmount.listType.slice(startIndex, endIndex + 1)
        }
        // if (type && JSON.parse(type).length > 0 && listAssetTypePaginate && listAssetTypePaginate.length > 0) {
        //     assetTypes = listAssetTypePaginate.filter((obj, index) => JSON.parse(type).some(item => obj._id === item));
        // } else {
        //     assetTypes = listAssetTypePaginate;
        // }
        let dataSelect = []
        if (chartAsset.dataChartType.listType){
            dataSelect = this.getAssetTypes(chartAsset.dataChartType.listType)
        }
        // console.log("hang",amountOfAsset);
        // console.log("hang depreciation",depreciation);

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">
                        <div className="col-md-12">
                            {/* Chọn loại tài sản */}
                            <div className="form-group" style={{ width: "100%" }}>
                                <label style={{ width: 90 }}>{translate('asset.general_information.asset_type')}</label>
                                <TreeSelect
                                    data={dataSelect}
                                    value={type ? type : []}
                                    handleChange={this.handleChangeTypeAsset}
                                    mode="hierarchical"
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <PaginateBar
                                display={limit}
                                total={assetType?.administration?.types?.totalList}
                                pageTotal={pageTotal}
                                currentPage={currentPage}
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
                                        
                                        listAssetsAmount = {listAssetsAmount}
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
                                        listAssetsAmount = {listAssetsAmount}
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
                                        // listAssets={listAssets ? listAssets : []}
                                        // assetType={assetTypes ? assetTypes : []}
                                        listAssetsAmount = {listAssetsAmount}
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
    const { listAssets, chartAsset } = state.assetsManager;
    const { assetType } = state;
    return { listAssets, assetType, chartAsset };
}

const mapDispatchToProps = {
    getAssetTypes: AssetTypeActions.getAssetTypes,
}

const AssetByTypeConnect = connect(mapState, mapDispatchToProps)(withTranslate(AssetByType));
export { AssetByTypeConnect as AssetByType };