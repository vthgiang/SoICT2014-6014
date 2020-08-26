import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';
import { AssetTypeService } from '../../../asset-type/redux/services';

import AmountOfAssetCharts from './amountOfAsset/amountOfAssetCharts';
import ValueOfAssetCharts from './valueOfAsset/valueOfAssetCharts';
import DepreciationOfAssetCharts from './depreciationOfAsset/depreciationOfAssetCharts';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectBox } from '../../../../../../common-components';


class AssetByCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAssets: [],
            displayBy: ["Group"],
            typeOfChart: ["Bar"]
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

        AssetTypeService.getAssetTypes().then(res => {
            if (res.data.success) {
                this.setState({ assetType: res.data.content.tree })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    handleSelectTypeOfDisplay = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                displayBy: value
            }
        })
    }

    handleSelectTypeOfChart = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                typeOfChart: value
            }
        })
    }

    render() {
        const { listAssets, recommendProcure, recommendDistribute, displayBy, assetType } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <section className="form-inline" style={{ textAlign: "left" }}>
                        {/* {
                            displayBy == "Type" &&
                            <div className="form-group">
                                <label>Type of Chart</label>
                                <SelectBox
                                    id={`select-chart-in-asset-dashboard`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[{ text: "Bar", value: "Bar" }, { text: "Tree", value: "Tree" }]}
                                    multiple={false}
                                    onChange={this.handleSelectTypeOfChart}
                                    value={"Bar"}
                                />
                            </div>
                        } */}
                        <div className="form-group">
                            <label>Classify by</label>
                            <SelectBox
                                id={`select-type-display-in-asset-dashboard`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[{ text: "Group", value: "Group" }, { text: "Type", value: "Type" }]}
                                multiple={false}
                                onChange={this.handleSelectTypeOfDisplay}
                                value={"Group"}
                            />
                        </div>
                    </section>
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Biểu đồ số lượng tài sản</div>
                                </div>
                                <div className="box-body qlcv">
                                    <AmountOfAssetCharts
                                        listAssets={listAssets}
                                        displayBy={displayBy}
                                        assetType={assetType}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Biểu đồ giá trị tài sản</div>
                                </div>
                                <div className="box-body qlcv">
                                    <ValueOfAssetCharts
                                        listAssets={listAssets}
                                        displayBy={displayBy}
                                        assetType={assetType}

                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Biểu đồ khấu hao tài sản</div>
                                </div>
                                <div className="box-body qlcv">
                                    <DepreciationOfAssetCharts
                                        listAssets={listAssets}
                                        displayBy={displayBy}
                                        assetType={assetType}

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

const AssetByCategoryConnect = connect(mapState)(withTranslate(AssetByCategory));
export { AssetByCategoryConnect as AssetByCategory };