import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import {
    GeneralTab, RepairTab, DistributeTab, DepreciationTab, AttachmentTab
} from '../../asset-info/components/combineContent';
class AssetDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                assets: nextProps.assets,
                repairUpgrade: nextProps.repairUpgrade,
                distributeTransfer: nextProps.distributeTransfer,
                depreciation: nextProps.depreciation,
                file: nextProps.file
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, assetsManager } = this.props;
        const {_id, assets, repairUpgrade, distributeTransfer } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-view-asset" isLoading={assetsManager}
                    formID="form-view-asset"
                    title="Thông tin tài sản"
                    hasSaveButton={false}
                // disableSubmit={false}
                >
                    <form className="form-group" id="form-view-asset" style={{ marginTop: "-15px" }}>
                        {(typeof assets !== 'undefined' && assets.length !== 0) &&
                            assets.map((x, index) => (
                                <div className="nav-tabs-custom" key={index}>
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a title="Thông tin chung" data-toggle="tab" href={`#view_general${_id}`}>thông tin chung</a></li>
                                        <li><a title="Sửa chữa - Thay thế - Nâng cấp" data-toggle="tab" href={`#view_repair${_id}`}>Sửa chữa - Thay thế - Nâng cấp</a></li>
                                        <li><a title="Cấp phát - Điều chuyển - Thu hồi" data-toggle="tab" href={`#view_distribute${_id}`}>Cấp phát - Điều chuyển - Thu hồi</a></li>
                                        <li><a title="Thông tin khấu hao" data-toggle="tab" href={`#view_depreciation${_id}`}>Thông tin khấu hao</a></li>
                                        <li><a title="Tài liệu đính kèm" data-toggle="tab" href={`#view_attachments${_id}`}>Tài liệu đính kèm</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <GeneralTab
                                            id={`view_general${_id}`}
                                            asset={x}
                                        />
                                        <RepairTab
                                            id={`view_repair${_id}`}
                                            repairUpgrade={repairUpgrade}
                                        />
                                        <DistributeTab
                                            id={`view_distribute${_id}`}
                                            distributeTransfer={distributeTransfer}
                                        />
                                        <DepreciationTab
                                            id={`view_depreciation${_id}`}
                                            asset={x}
                                        />
                                        <AttachmentTab
                                            id={`view_attachments${_id}`}
                                            asset={x}
                                            file={x.file}
                                        />
                                    </div>
                                </div>
                            ))}
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    };
}

const detailAsset = connect(null, null)(withTranslate(AssetDetailForm));
export { detailAsset as AssetDetailForm };