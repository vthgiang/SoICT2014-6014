import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, AttachmentTab
} from '../../asset-info/components/combinedContent';
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
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, assetsManager } = this.props;
        const { _id, assets } = this.state;
        console.log('this.state', this.state);

        return (    
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-view-asset" isLoading={assetsManager}
                    formID="form-view-asset"
                    title="Thông tin tài sản"
                    hasSaveButton={false}
                >
                    <form className="form-group" id="form-view-asset" style={{ marginTop: "-15px" }}>
                        {(typeof assets !== 'undefined' && assets.length !== 0) &&
                            assets.map((x, index) => (
                                <div className="nav-tabs-custom" key={index}>
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a title="Thông tin chung" data-toggle="tab" href={`#view_general${_id}`}>Thông tin chung</a></li>
                                        <li><a title="Sửa chữa - Thay thế - Nâng cấp" data-toggle="tab" href={`#view_maintainance${_id}`}>Sửa chữa - Thay thế - Nâng cấp</a></li>
                                        <li><a title="Cấp phát - Điều chuyển - Thu hồi" data-toggle="tab" href={`#view_usage${_id}`}>Cấp phát - Điều chuyển - Thu hồi</a></li>
                                        <li><a title="Thông tin khấu hao" data-toggle="tab" href={`#view_depreciation${_id}`}>Thông tin khấu hao</a></li>
                                        <li><a title="Thông tin sự cố" data-toggle="tab" href={`#view_incident${_id}`}>Thông tin sự cố</a></li>
                                        <li><a title="Tài liệu đính kèm" data-toggle="tab" href={`#view_attachments${_id}`}>Tài liệu đính kèm</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <GeneralTab
                                            id={`view_general${_id}`}
                                            asset={x}
                                        />
                                        <MaintainanceLogTab
                                            id={`view_maintainance${_id}`}
                                            maintainanceLogs={x.maintainanceLogs}
                                        />
                                        <UsageLogTab
                                            id={`view_usage${_id}`}
                                            usageLogs={x.usageLogs}
                                        />
                                        <DepreciationTab
                                            id={`view_depreciation${_id}`}
                                            asset={x}
                                        />
                                        <IncidentLogTab
                                            id={`view_incident${_id}`}
                                            incidentLogs={x.incidentLogs}
                                        />
                                        <AttachmentTab
                                            id={`view_attachments${_id}`}
                                            asset={x}
                                            files={x.files}
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
function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const detailAsset = connect(null, null)(withTranslate(AssetDetailForm));
export { detailAsset as AssetDetailForm };