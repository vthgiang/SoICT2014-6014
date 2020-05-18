import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetInfoActions } from '../redux/actions';
import {
    GeneralTab, RepairTab, DistributeTab, DepreciationTab, AttachmentTab
} from './combineContent';
class AssetDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount = async () => {
        this.props.getAssetProfile();
    }
    render() {
        var assets, repairUpgrades, distributeTransfers;
        const { assetsInfo, translate } = this.props;
        if (assetsInfo.assets) assets = assetsInfo.assets;
        if (assetsInfo.repairUpgrades) repairUpgrades = assetsInfo.repairUpgrades;
        if (assetsInfo.distributeTransfers) distributeTransfers = assetsInfo.distributeTransfers;
        return (
            <React.Fragment>
                {
                    typeof assets !== 'undefined' && assets.length === 0 && assetsInfo.isLoading === false && < span className="text-red">{translate('manage_employee.no_data_personal')}</span>
                }
                {(typeof assets !== 'undefined' && assets.length !== 0) &&
                    assets.map((x, index) => (
                        <div className="row" key={index}>
                            {/* left column */}
                            <div className="col-sm-12">
                                <div className="nav-tabs-custom">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a title="Thông tin chung" data-toggle="tab" href="#view_general">Thông tin chung</a></li>
                                        <li><a title="Sửa chữa - Thay thế - Nâng cấp" data-toggle="tab" href="#view_repair">Sửa chữa - Thay thế - Nâng cấp</a></li>
                                        <li><a title="Cấp phát - Điều chuyển - Thu hồi" data-toggle="tab" href="#view_distribute">Cấp phát - Điều chuyển - Thu hồi</a></li>
                                        <li><a title="Thông tin khấu hao" data-toggle="tab" href="#view_depreciation">Thông tin khấu hao</a></li>
                                        <li><a title="Tài liệu đính kèm" data-toggle="tab" href="#view_attachments">Tài liệu đính kèm</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <GeneralTab
                                            id="view_general"
                                            asset={x}
                                        />
                                        <RepairTab
                                            id="view_repair"
                                            repairUpgrades={repairUpgrades}
                                        />
                                        <DistributeTab
                                            id="view_distribute"
                                            distributeTransfers={distributeTransfers}
                                        />
                                        <DepreciationTab
                                            id="view_depreciation"
                                            asset={x}
                                        />
                                        <AttachmentTab
                                            id="view_attachments"
                                            asset={x}
                                            file={x.file}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
            </React.Fragment>
        );
    };
}

function mapState(state) {
    const { assetsInfo } = state;
    return { assetsInfo };
}
const actionCreators = {
    // getAssetProfile: AssetInfoActions.getAssetProfile,
}
const connectDetailAsset = connect(mapState, actionCreators)(withTranslate(AssetDetail));
export { connectDetailAsset as AssetDetail };