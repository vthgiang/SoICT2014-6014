import React, { Component } from 'react';
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

class AssetCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: process.env.REACT_APP_SERVER + '/upload/asset/pictures/picture5.png',
            avatar: "./upload/asset/pictures/picture5.png",
            asset: {
                avatar: './upload/asset/pictures/picture5.png',
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
        };
    }

    componentDidMount() {
        this.props.getAllUsers();
    }

    // Function format dữ liệu Date thành string
    formatDate2(date, monthYear = false) {
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
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }

    // Function lưu các trường thông tin vào state
    handleChange = (name, value) => {
        const { asset } = this.state;

        if (name === 'purchaseDate' || name === 'warrantyExpirationDate' || name === 'handoverFromDate' ||
            name === 'handoverToDate' || name === 'startDepreciation' || name === 'disposalDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            } else {
                value = null
            }
        }

        this.setState({
            asset: {
                ...asset,
                [name]: value
            }
        });
    }

    // Function thêm, chỉnh sửa thông tin bảo trì
    handleChangeMaintainanceLog = (data, addData) => {
        this.setState({
            maintainanceLogs: data
        })
    }

    // Function thêm, chỉnh sửa thông tin cấp phát, điều chuyển, thu hồi
    handleChangeUsageLog = (data, addData) => {
        this.setState({
            usageLogs: data
        })
    }

    handleRecallAsset = (data) => {
        this.setState({
            assignedToUser: data.assignedToUser,
            assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
            status: data.status
        })
    }
    // Function thêm, chỉnh sửa thông tin sự cố thiết bị
    handleChangeIncidentLog = (data, addData) => {
        this.setState({
            incidentLogs: data
        })
    }

    // Function thêm thông tin tài liệu đính kèm
    handleChangeFile = (data, addData) => {
        this.setState({
            files: data
        })
    }

    // TODO: function
    handleChangeCourse = (data) => {
        const { assetNew } = this.state;
        this.setState({
            assetNew: {
                ...assetNew,
                ...data
            }
        })
    }

    // function kiểm tra các trường bắt buộc phải nhập
    validatorInput = (value) => {
        if (value) {
            return true;
        } else {
            return false;
        }
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let { asset } = this.state;

        let result =
            this.validatorInput(asset.code) &&
            this.validatorInput(asset.assetName) &&
            this.validatorInput(asset.assetType) &&
            this.validatorInput(asset.status) &&
            this.validatorInput(asset.typeRegisterForUse)

        return result;
    }

    // Function thêm mới thông tin tài sản
    save = () => {
        let { asset, maintainanceLogs, usageLogs, incidentLogs, files, avatar } = this.state;
        let assetUpdate = {
            ...asset,
            maintainanceLogs,
            usageLogs,
            incidentLogs,
            files
        }

        this.setState({ asset: assetUpdate })

        let formData = convertJsonObjectToFormData(assetUpdate);
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", avatar);
        this.props.addNewAsset(formData);
    }

    render() {
        const { translate, assetsManager } = this.props;
        const { img, asset, maintainanceLogs, usageLogs, incidentLogs, files, avatar } = this.state;

        return (
            <React.Fragment>
                {/* <ButtonModal modalID="modal-add-asset" button_name={translate('menu.add_asset')} title={translate('menu.add_asset')} /> */}
                <DialogModal
                    size='75' modalID="modal-add-asset" isLoading={assetsManager.isLoading}
                    formID="form-add-asset"
                    title={translate('menu.add_asset')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
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
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                                asset={asset}
                                detailInfo={asset.detailInfo}
                            />

                            {/* Thông tin khấu hao */}
                            <DepreciationTab
                                id="depreciation"
                                asset={asset}
                                handleChange={this.handleChange}
                            />

                            {/* Thông tin bảo trì */}
                            <MaintainanceLogTab
                                id="maintainance"
                                maintainanceLogs={maintainanceLogs}
                                handleAddMaintainance={this.handleChangeMaintainanceLog}
                                handleEditMaintainance={this.handleChangeMaintainanceLog}
                                handleDeleteMaintainance={this.handleChangeMaintainanceLog}
                            />

                            {/* Thông tin sử dụng */}
                            <UsageLogTab
                                id="usage"
                                usageLogs={usageLogs}
                                typeRegisterForUse={asset.typeRegisterForUse}
                                managedBy={asset.managedBy}
                                handleAddUsage={this.handleChangeUsageLog}
                                handleEditUsage={this.handleChangeUsageLog}
                                handleDeleteUsage={this.handleChangeUsageLog}
                                handleRecallAsset={this.handleRecallAsset}
                            />

                            {/* Thông tin sự cố */}
                            <IncidentLogTab
                                id="incident"
                                incidentLogs={incidentLogs}
                                handleAddIncident={this.handleChangeIncidentLog}
                                handleEditIncident={this.handleChangeIncidentLog}
                                handleDeleteIncident={this.handleChangeIncidentLog}
                            />

                            {/* Thông tin thanh lý */}
                            <DisposalTab
                                id="disposal"
                                asset={asset}
                                handleChange={this.handleChange}
                            />

                            {/* Tài liệu đính kèm */}
                            <FileTab
                                id="attachments"
                                files={files}
                                asset={asset}
                                handleChange={this.handleChange}
                                handleAddFile={this.handleChangeFile}
                                handleEditFile={this.handleChangeFile}
                                handleDeleteFile={this.handleChangeFile}
                            />
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
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
