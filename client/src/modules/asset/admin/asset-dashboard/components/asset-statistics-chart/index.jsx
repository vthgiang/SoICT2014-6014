import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { AssetService } from '../../../asset-information/redux/services';

import { StautsChart } from './stautsChart';
import { GroupChart } from './groupChart';
import { CostChart } from './costChart';

class AssetStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAssets: null,
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
    }
    
    
    render() {
        const { translate } = this.props;
        const { listAssets } = this.state;

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="row">
                        {/* Biểu thống kê tài sản theo trạng thái */}
                        <div className="col-6 col-xs-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('asset.dashboard.status_chart')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <StautsChart
                                        listAssets={listAssets}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Biểu thống kê tài sản theo nhóm */}
                        <div className="col-6 col-xs-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('asset.dashboard.group_chart')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <GroupChart
                                        listAssets={listAssets}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Biểu thống kê tài sản theo giá trị */}
                        <div className="col-6 col-xs-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('asset.dashboard.cost_chart')}</div>
                                </div>
                                <div className="box-body qlcv">
                                    <CostChart
                                        listAssets={listAssets}
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
}

const AssetStatisticsConnect = connect(mapState)(withTranslate(AssetStatistics));
export { AssetStatisticsConnect as AssetStatistics };