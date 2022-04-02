import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, Scheduler } from '../../../../../common-components';
import _isEqual from 'lodash/isEqual';
import {
    GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, DisposalTab, AttachmentTab
} from '../../../base/detail-tab/components/combinedContent';

function AssetViewInfo(props) {
    const [state, setState] = useState({})
    const [prevProps, setPrevProps] = useState({
        _id:null,
        depreciationType: null,
        typeRegisterForUse:null
    });
    const { translate, assetsManager } = props;
    const { _id, avatar, code, assetName, serial, assetType, group, purchaseDate, warrantyExpirationDate,
        managedBy, assignedToUser, assignedToOrganizationalUnit, handoverFromDate, handoverToDate, location, description, status, typeRegisterForUse,
        detailInfo, cost, residualValue, startDepreciation, usefulLife, depreciationType, estimatedTotalProduction,
        unitsProducedDuringTheYears, maintainanceLogs, usageLogs, incidentLogs, disposalDate, disposalType, disposalCost,
        disposalDesc, archivedRecordNumber, files, readByRoles
    } = state;

    // let isChange = 0;
    // for(const property in prevProps){
    //     if(prevProps[property] !== props[property]){
    //     isChange =1;
    //     }
    // }
    //console.log(props)
    if(state._id !== props._id || !_isEqual(state.files, props.files)){
        setState({
            ...state,
            _id: props._id,
            img: process.env.REACT_APP_SERVER + props.avatar,
            avatar: props.avatar,
            code: props.code,
            assetName: props.assetName,
            serial: props.serial,
            assetType: props.assetType,
            group: props.group,
            purchaseDate: props.purchaseDate,
            warrantyExpirationDate: props.warrantyExpirationDate,
            managedBy: props.managedBy,
            assignedToUser: props.assignedToUser,
            assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
            handoverFromDate: props.handoverFromDate,
            handoverToDate: props.handoverToDate,
            location: props.location,
            description: props.description,
            status: props.status,
            typeRegisterForUse: props.typeRegisterForUse,
            detailInfo: props.detailInfo,
            cost: props.cost,
            residualValue: props.residualValue,
            startDepreciation: props.startDepreciation,
            usefulLife: props.usefulLife,
            estimatedTotalProduction: props.estimatedTotalProduction,
            unitsProducedDuringTheYears: props.unitsProducedDuringTheYears,
            depreciationType: props.depreciationType,
            maintainanceLogs: props.maintainanceLogs,
            usageLogs: props.usageLogs,
            incidentLogs: props.incidentLogs,
            disposalDate: props.disposalDate,
            disposalType: props.disposalType,
            disposalCost: props.disposalCost,
            disposalDesc: props.disposalDesc,
            archivedRecordNumber: props.archivedRecordNumber,
            files: props.files,
            readByRoles: props.readByRoles
        })
    }
    console.log(state)
    return (
        <React.Fragment>
            <form className="form-group" id="form-view-asset" >
                <div className="nav-tabs-custom">
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#view_general${_id}`}>{translate('asset.general_information.general_information')}</a></li>
                        <li><a title={translate('asset.general_information.depreciation_information')} data-toggle="tab" href={`#view_depreciation${_id}`}>{translate('asset.general_information.depreciation_information')}</a></li>
                        <li><a title={translate('asset.general_information.usage_information')} data-toggle="tab" href={`#view_usage${_id}`} onClick={() => { Scheduler.triggerOnActiveEvent(".asset-usage-scheduler") }}>{translate('asset.general_information.usage_information')}</a></li>
                        <li><a title={translate('asset.general_information.incident_information')} data-toggle="tab" href={`#view_incident${_id}`}>{translate('asset.general_information.incident_information')}</a></li>
                        <li><a title={translate('asset.general_information.maintainance_information')} data-toggle="tab" href={`#view_maintainance${_id}`}>{translate('asset.general_information.maintainance_information')}</a></li>
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
                            assignedToUser={assignedToUser}
                            assignedToOrganizationalUnit={assignedToOrganizationalUnit}
                            handoverFromDate={handoverFromDate}
                            handoverToDate={handoverToDate}
                            location={location}
                            description={description}
                            status={status}
                            typeRegisterForUse={typeRegisterForUse}
                            detailInfo={detailInfo}
                            usageLogs={usageLogs}
                            readByRoles={readByRoles}
                        />

                        {/* Thông tin khấu hao */}
                        <DepreciationTab
                            id={`view_depreciation${_id}`}
                            cost={cost}
                            residualValue={residualValue}
                            startDepreciation={startDepreciation}
                            usefulLife={usefulLife}
                            estimatedTotalProduction={estimatedTotalProduction}
                            unitsProducedDuringTheYears={unitsProducedDuringTheYears}
                            depreciationType={depreciationType}
                        />

                        {/* Thông tin bảo trì */}
                        <MaintainanceLogTab
                            id={`view_maintainance${_id}`}
                            maintainanceLogs={maintainanceLogs}
                        />

                        {/* Thông tin sử dụng */}
                        <UsageLogTab
                            id={`view_usage${_id}`}
                            assetId={_id}
                            typeRegisterForUse={typeRegisterForUse}
                            managedBy={managedBy}
                            usageLogs={usageLogs}
                            linkPage={props.linkPage}
                        />

                        {/* Thông tin sự cố */}
                        <IncidentLogTab
                            id={`view_incident${_id}`}
                            incidentLogs={incidentLogs}
                            status={status}
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
            </form>
            {/* </DialogModal> */}
        </React.Fragment>
    );

}
function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const AssetViewInfoConnected = connect(null, null)(withTranslate(AssetViewInfo));
export { AssetViewInfoConnected as AssetViewInfo };