import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AssetService } from '../../../asset-information/redux/services';
import { AssetTypeService } from '../../../asset-type/redux/services';

import AmountOfAssetCharts from './amount-of-asset/amountOfAssetCharts';
import ValueOfAssetCharts from './value-of-asset/valueOfAssetCharts';
import DepreciationOfAssetCharts from './depreciation-of-asset/depreciationOfAssetCharts';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectBox } from '../../../../../../common-components';


class AssetByCategory extends Component {
    constructor(props) {
        super(props);

        this.INFO_SEARCH = {
            displayBy: ["Group"],
            typeOfChart: ["Bar"]
        }

        this.state = {
            listAssets: [],
            displayBy: this.INFO_SEARCH.displayBy,
            typeOfChart: this.INFO_SEARCH.typeOfChart
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

    render() {
        const { listAssets, recommendProcure, recommendDistribute, displayBy, assetType } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <section className="form-inline qlcv" style={{ textAlign: "right" }}>

                        <div className="form-group">
                            <label>Phân tích theo</label>
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
                        <button className="btn btn-success" onClick={this.handleSearchData}>Phân tích</button>
                    </section>
                    <div className="row">
                        <div className="col-xs-6">
                            {/* <div className="box box-primary"> */}
                            {/* <div className="box-header with-border"> */}
                            <h4 style={{ textAlign: "center", marginBottom: "0" }}>Biểu đồ số lượng tài sản</h4>
                            {/* </div> */}
                            <div className="box-body qlcv">
                                <AmountOfAssetCharts
                                    listAssets={listAssets}
                                    displayBy={displayBy}
                                    assetType={assetType}
                                />
                                {/* </div> */}
                            </div>
                        </div>

                        <div className="col-xs-6">
                            {/* <div className="box box-primary"> */}
                            {/* <div className="box"> */}
                            <h4 style={{ textAlign: "center", marginBottom: "0" }}>Biểu đồ giá trị tài sản</h4>
                            {/* </div> */}
                            <div className="box-body qlcv">
                                <ValueOfAssetCharts
                                    listAssets={listAssets}
                                    displayBy={displayBy}
                                    assetType={assetType}

                                />
                            </div>
                            {/* </div> */}
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