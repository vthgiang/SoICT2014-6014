import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, DisposalTab, AttachmentTab
} from '../../../base/detail-tab/components/combinedContent';

class AssetInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id || nextProps.depreciationType !== prevState.depreciationType) {
            return {
                ...prevState,
                _id: nextProps._id,
                img: process.env.REACT_APP_SERVER + nextProps.avatar,
                avatar: "",
                avatar: nextProps.avatar,
                code: nextProps.code,
                assetName: nextProps.assetName,
                serial: nextProps.serial,
                assetType: nextProps.assetType,
                group: nextProps.group,
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
        const { _id, avatar, code, assetName, serial, assetType, group, purchaseDate, warrantyExpirationDate,
            managedBy, assignedTo, handoverFromDate, handoverToDate, location, description, status, canRegisterForUse,
            detailInfo, cost, residualValue, startDepreciation, usefulLife, depreciationType,
            maintainanceLogs, usageLogs, incidentLogs, disposalDate, disposalType, disposalCost,
            disposalDesc, archivedRecordNumber, files
        } = this.state;
        console.log('grrrrrrrrrrrrrrr', group);
        return (
            <React.Fragment>
                {/* <DialogModal
                    size='75' modalID="modal-view-asset" isLoading={assetsManager}
                    formID="form-view-asset"
                    title={translate('asset.asset_info.asset_info')}
                    hasSaveButton={false}
                > */}
                <div className="form-group" id="form-view-building" >
                    <div className="nav-tabs-custom">
                        {/* Nav-tabs */}
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#view_general${_id}`}>{translate('asset.general_information.general_information')}</a></li>
                            <li><a title={translate('asset.general_information.usage_information')} data-toggle="tab" href={`#view_usage${_id}`}>{translate('asset.general_information.usage_information')}</a></li>
                            <li><a title={translate('asset.general_information.maintainance_information')} data-toggle="tab" href={`#view_maintainance${_id}`}>{translate('asset.general_information.maintainance_information')}</a></li>
                            <li><a title={translate('asset.general_information.depreciation_information')} data-toggle="tab" href={`#view_depreciation${_id}`}>{translate('asset.general_information.depreciation_information')}</a></li>
                            <li><a title={translate('asset.general_information.incident_information')} data-toggle="tab" href={`#view_incident${_id}`}>{translate('asset.general_information.incident_information')}</a></li>
                            <li><a title={translate('asset.general_information.disposal_information')} data-toggle="tab" href={`#view_disposal${_id}`}>{translate('asset.general_information.disposal_information')}</a></li>
                            <li><a title={translate('asset.general_information.attach_infomation')} data-toggle="tab" href={`#view_attachments${_id}`}>{translate('asset.general_information.attach_infomation')}</a></li>
                        </ul>

                        <div className="tab-content">
                            {/* Thông tin chung */}
                            <GeneralTab
                                id={`view_general${_id}`}
                                avatar={avatar}
                                code={code}
                                assetName={assetName}
                                serial={serial}
                                assetTypes={assetType}
                                group={group}
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

                            {/* Thông tin bảo trì */}
                            <MaintainanceLogTab
                                id={`view_maintainance${_id}`}
                                maintainanceLogs={maintainanceLogs}
                            />

                            {/* Thông tin sử dụng */}
                            <UsageLogTab
                                id={`view_usage${_id}`}
                                usageLogs={usageLogs}
                            />

                            {/* Thông tin khấu hao */}
                            <DepreciationTab
                                id={`view_depreciation${_id}`}
                                cost={cost}
                                residualValue={residualValue}
                                startDepreciation={startDepreciation}
                                usefulLife={usefulLife}
                                depreciationType={depreciationType}
                            />

                            {/* Thông tin sự cố */}
                            <IncidentLogTab
                                id={`view_incident${_id}`}
                                incidentLogs={incidentLogs}
                            />

                            {/* Thông tin thanh lý */}
                            <DisposalTab
                                id={`view_disposal${_id}`}
                                disposalDate={disposalDate}
                                disposalType={disposalType}
                                disposalCost={disposalCost}
                                disposalDesc={disposalDesc}
                            />

                            {/* Tài liệu đính kèm */}
                            <AttachmentTab
                                id={`view_attachments${_id}`}
                                archivedRecordNumber={archivedRecordNumber}
                                files={files}
                            />
                        </div>
                    </div>
                </div>
                {/* </DialogModal> */}
            </React.Fragment>
        );
    };
}
function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const detailAsset = connect(null, null)(withTranslate(AssetInfoForm));
export { detailAsset as AssetInfoForm };