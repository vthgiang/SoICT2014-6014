import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../env';
import { DialogModal } from '../../../../common-components';
import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, DisposalTab, AttachmentTab
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
                img: LOCAL_SERVER_API + nextProps.avatar,
                avatar: "",
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetType: nextProps.assetType,
                purchaseDate: nextProps.purchaseDate,
                warrantyExpirationDate: nextProps.warrantyExpirationDate,
                managedBy: nextProps.managedBy,
                assignedTo: nextProps.assignedTo,
                handoverFromDate: nextProps.handoverFromDate,
                handoverToDate: nextProps.handoverToDate,
                location: nextProps.location,
                description: nextProps.description,
                status: nextProps.status,
                canRegisterForUse: nextProps.canRegisterForUse,
                detailInfo: nextProps.detailInfo,
                cost: nextProps.cost,
                residualValue: nextProps.residualValue,
                startDepreciation: nextProps.startDepreciation,
                usefulLife: nextProps.usefulLife,
                depreciationType: nextProps.depreciationType,
                maintainanceLogs: nextProps.maintainanceLogs,
                usageLogs: nextProps.usageLogs,
                incidentLogs: nextProps.incidentLogs,
                disposalDate: nextProps.disposalDate,
                disposalType: nextProps.disposalType,
                disposalCost: nextProps.disposalCost,
                disposalDesc: nextProps.disposalDesc,
                archivedRecordNumber: nextProps.archivedRecordNumber,
                files: nextProps.files,
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, assetsManager } = this.props;
        const { _id, avatar, code, assetName, serial, assetType, purchaseDate, warrantyExpirationDate, 
                managedBy, assignedTo, handoverFromDate, handoverToDate, location, description, status, canRegisterForUse,
                detailInfo, cost, residualValue, startDepreciation, usefulLife, depreciationType,
                maintainanceLogs, usageLogs, incidentLogs, disposalDate, disposalType, disposalCost, 
                disposalDesc, archivedRecordNumber, files 
            } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-asset" isLoading={assetsManager}
                    formID="form-view-asset"
                    title="Thông tin tài sản"
                    hasSaveButton={false}
                >
                    <form className="form-group" id="form-view-asset" style={{ marginTop: "-15px" }}>
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a title="Thông tin chung" data-toggle="tab" href={`#view_general${_id}`}>Thông tin chung</a></li>
                                <li><a title="Thông tin sử dụng" data-toggle="tab" href={`#view_usage${_id}`}>Thông tin sử dụng</a></li>
                                <li><a title="Thông tin bảo trì" data-toggle="tab" href={`#view_maintainance${_id}`}>Thông tin bảo trì</a></li>
                                <li><a title="Thông tin khấu hao" data-toggle="tab" href={`#view_depreciation${_id}`}>Thông tin khấu hao</a></li>
                                <li><a title="Thông tin sự cố" data-toggle="tab" href={`#view_incident${_id}`}>Thông tin sự cố</a></li>
                                <li><a title="Thông tin thanh lý" data-toggle="tab" href={`#view_disposal${_id}`}>Thông tin thanh lý</a></li>
                                <li><a title="Tài liệu đính kèm" data-toggle="tab" href={`#view_attachments${_id}`}>Tài liệu đính kèm</a></li>
                            </ul>
                            <div className="tab-content">
                                <GeneralTab
                                    id={`view_general${_id}`}
                                    avatar={avatar}
                                    code={code}
                                    assetName={assetName}
                                    serial={serial}
                                    assetTypes={assetType}
                                    purchaseDate={purchaseDate}
                                    warrantyExpirationDate={warrantyExpirationDate}
                                    managedBy={managedBy}
                                    assignedTo={assignedTo}
                                    handoverFromDate={handoverFromDate}
                                    handoverToDate={handoverToDate}
                                    location={location}
                                    description={description}
                                    status={status}
                                    canRegisterForUse={canRegisterForUse}
                                    detailInfo={detailInfo}
                                />
                                <MaintainanceLogTab
                                    id={`view_maintainance${_id}`}
                                    maintainanceLogs={maintainanceLogs}
                                />
                                <UsageLogTab
                                    id={`view_usage${_id}`}
                                    usageLogs={usageLogs}
                                />
                                <DepreciationTab
                                    id={`view_depreciation${_id}`}
                                    cost={cost}
                                    residualValue={residualValue}
                                    startDepreciation={startDepreciation}
                                    usefulLife={usefulLife}
                                    depreciationType={depreciationType}
                                />
                                <IncidentLogTab
                                    id={`view_incident${_id}`}
                                    incidentLogs={incidentLogs}
                                />
                                <DisposalTab
                                    id={`view_disposal${_id}`}
                                    disposalDate={disposalDate}
                                    disposalType={disposalType}
                                    disposalCost={disposalCost}
                                    disposalDesc={disposalDesc}
                                />
                                <AttachmentTab
                                    id={`view_attachments${_id}`}
                                    archivedRecordNumber={archivedRecordNumber}
                                    files={files}
                                />
                            </div>
                        </div>
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