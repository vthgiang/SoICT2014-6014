import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ButtonModal, DialogModal } from '../../../../../common-components';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import {
    GeneralTab, UsageLogTab, MaintainanceLogTab, DepreciationTab, IncidentLogTab, DisposalTab, FileTab
} from '../../../base/create-tab/components/combinedContent';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetManagerActions } from '../redux/actions';

function AssetCreateForm(props) {
    const [state, setState] = useState({
        mg: '',
        avatar: "",
        asset: {
            avatar: '',
            code: "",
            assetName: "",
            serial: "",
            purchaseDate: null,
            warrantyExpirationDate: null,
            assignedToUser: null,
            assignedToOrganizationalUnit: null,
            handoverFromDate: null,
            handoverToDate: null,
            status: "",
            typeRegisterForUse: "",
            assetType: "",
            description: "",
            detailInfo: [],
            residualValue: null,
            startDepreciation: null,
            disposalDate: null,
            disposalType: "",
            disposalCost: null,
            disposalDesc: "",
            archivedRecordNumber: ""
        },
        maintainanceLogs: [],
        usageLogs: [],
        incidentLogs: [],
        files: [],
    })

    const { translate, assetsManager } = props;
    const { img, asset, maintainanceLogs, usageLogs, incidentLogs, files, avatar } = state;

    useEffect(() => {
        props.getAllUsers();
    }, [])

    // Function format dữ liệu Date thành string
    const formatDate2 = (date, monthYear = false) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [year, month].join('-');
        } else {
            return [year, month, day].join('-');
        }
    }

    // Function upload avatar 
    const handleUpload = (img, avatar) => {
        setState({
            ...state,
            img: img,
            avatar: avatar
        })
    }

    // Function lưu các trường thông tin vào state
    const handleChange = (name, value) => {
        const { asset } = state;

        if (name === 'purchaseDate' || name === 'warrantyExpirationDate' || name === 'handoverFromDate' ||
            name === 'handoverToDate' || name === 'startDepreciation' || name === 'disposalDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            } else {
                value = null
            }
        }
        asset[name] = value
        setState({
            ...state,
            asset: asset
        });
    }

    // Function thêm, chỉnh sửa thông tin bảo trì
    const handleChangeMaintainanceLog = (data, addData) => {
        const { maintainanceLogs } = state
        maintainanceLogs.push(addData)
        setState({
            ...state,
            maintainanceLogs: maintainanceLogs
        })
    }

    // Function thêm, chỉnh sửa thông tin cấp phát, điều chuyển, thu hồi
    const handleChangeUsageLog = (data, addData) => {
        const { asset, usageLogs } = state;
        usageLogs.push(addData)

        let status = addData ? addData.status : asset.status;
        setState({
            ...state,
            usageLogs: usageLogs,
            asset: {
                ...asset,
                assignedToUser: addData ? addData.usedByUser : null,
                assignedToOrganizationalUnit: addData ? addData.usedByOrganizationalUnit : null,
                status: status,
            },
        })
    }

    const handleRecallAsset = (data) => {
        const { asset } = state;
        setState({
            ...state,
            asset: {
                ...asset,
                assignedToUser: data.assignedToUser,
                assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
                status: data.status
            }
        })
    }
    // Function thêm, chỉnh sửa thông tin sự cố thiết bị
    const handleChangeIncidentLog = (data, addData) => {
        const { incidentLogs } = state
        incidentLogs.push(addData)
        setState({
            ...state,
            incidentLogs: incidentLogs
        })
    }

    // Function thêm thông tin tài liệu đính kèm
    const handleChangeFile = (data, addData) => {
        const { files } = state
        files.push(addData)
        setState({
            ...state,
            files: files
        })
    }

    // TODO: function
    const handleChangeCourse = (data) => {
        const { assetNew } = state;
        setState({
            ...state,
            assetNew: {
                ...assetNew,
                ...data
            }
        })
    }

    // function kiểm tra các trường bắt buộc phải nhập
    const validatorInput = (value) => {
        if (value && value.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let { asset } = state;

        let result =
            validatorInput(asset.code) &&
            validatorInput(asset.assetName) &&
            validatorInput(asset.assetType) &&
            validatorInput(asset.status) &&
            validatorInput(asset.typeRegisterForUse)

        return result;
    }

    // Function thêm mới thông tin tài sản
    const save = () => {
        let { asset, maintainanceLogs, usageLogs, incidentLogs, files, avatar } = state;
        let assetUpdate = {
            ...asset,
            maintainanceLogs,
            usageLogs,
            incidentLogs,
            files
        }

        setState({
            ...state,
            asset: assetUpdate
        })

        let formData = convertJsonObjectToFormData(assetUpdate);

        console.log(files)
        files.forEach(x => {
            if (x.hasOwnProperty('fileUpload')) {
                formData.append("file", x.fileUpload);
            }
        })
        formData.append("fileAvatar", avatar);
        props.addNewAsset(formData);
    }


    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-add-asset" button_name={translate('menu.add_asset')} title={translate('menu.add_asset')} /> */}
            <DialogModal
                size='75' modalID="modal-add-asset" isLoading={assetsManager.isLoading}
                formID="form-add-asset"
                title={translate('menu.add_asset')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('asset.general_information.general_information')} data-toggle="tab" href={`#create_general`}>{translate('asset.general_information.general_information')}</a></li>
                        <li><a title={translate('asset.general_information.depreciation_information')} data-toggle="tab" href={`#depreciation`}>{translate('asset.general_information.depreciation_information')}</a></li>
                        <li><a title={translate('asset.general_information.usage_information')} data-toggle="tab" href={`#usage`}>{translate('asset.general_information.usage_information')}</a></li>
                        <li><a title={translate('asset.general_information.incident_information')} data-toggle="tab" href={`#incident`}>{translate('asset.general_information.incident_information')}</a></li>
                        <li><a title={translate('asset.general_information.maintainance_information')} data-toggle="tab" href={`#maintainance`}>{translate('asset.general_information.maintainance_information')}</a></li>
                        <li><a title={translate('asset.general_information.disposal_information')} data-toggle="tab" href={`#disposal`}>{translate('asset.general_information.disposal_information')}</a></li>
                        <li><a title={translate('asset.general_information.attach_infomation')} data-toggle="tab" href={`#attachments`}>{translate('asset.general_information.attach_infomation')}</a></li>
                    </ul>

                    <div className="tab-content">
                        {/* Thông tin chung */}
                        <GeneralTab
                            id={`create_general`}
                            img={img}
                            avatar={avatar}
                            handleChange={handleChange}
                            handleUpload={handleUpload}
                            assignedToUser={asset.assignedToUser}
                            assignedToOrganizationalUnit={asset.assignedToOrganizationalUnit}
                            usageLogs={usageLogs}
                            status={asset.status}
                            asset={asset}
                            detailInfo={asset.detailInfo}
                        />

                        {/* Thông tin khấu hao */}
                        <DepreciationTab
                            id="depreciation"
                            asset={asset}
                            handleChange={handleChange}
                        />

                        {/* Thông tin bảo trì */}
                        <MaintainanceLogTab
                            id="maintainance"
                            maintainanceLogs={maintainanceLogs}
                            handleAddMaintainance={handleChangeMaintainanceLog}
                            handleEditMaintainance={handleChangeMaintainanceLog}
                            handleDeleteMaintainance={handleChangeMaintainanceLog}
                        />

                        {/* Thông tin sử dụng */}
                        <UsageLogTab
                            id="usage"
                            usageLogs={usageLogs}
                            typeRegisterForUse={asset.typeRegisterForUse}
                            managedBy={asset.managedBy}
                            handleAddUsage={handleChangeUsageLog}
                            handleEditUsage={handleChangeUsageLog}
                            handleDeleteUsage={handleChangeUsageLog}
                            handleRecallAsset={handleRecallAsset}
                        />

                        {/* Thông tin sự cố */}
                        <IncidentLogTab
                            id="incident"
                            incidentLogs={incidentLogs}
                            handleAddIncident={handleChangeIncidentLog}
                            handleEditIncident={handleChangeIncidentLog}
                            handleDeleteIncident={handleChangeIncidentLog}
                        />

                        {/* Thông tin thanh lý */}
                        <DisposalTab
                            id="disposal"
                            asset={asset}
                            handleChange={handleChange}
                        />

                        {/* Tài liệu đính kèm */}
                        <FileTab
                            id="attachments"
                            files={files}
                            asset={asset}
                            handleChange={handleChange}
                            handleAddFile={handleChangeFile}
                            handleEditFile={handleChangeFile}
                            handleDeleteFile={handleChangeFile}
                        />
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { assetsManager, auth } = state;
    return { assetsManager, auth };
};

const actionCreators = {
    addNewAsset: AssetManagerActions.addNewAsset,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getAllUsers: UserActions.get
};

const createForm = connect(mapState, actionCreators)(withTranslate(AssetCreateForm));
export { createForm as AssetCreateForm };
