import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ButtonModal, DialogModal } from '../../../../common-components';
import { LOCAL_SERVER_API } from '../../../../env';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';

import {
    GeneralTab, UsageLogTab, MaintainanceLogTab, DepreciationTab, IncidentLogTab, DisposalTab, FileTab
} from '../../asset-create/components/combinedContent';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { AssetManagerActions } from '../redux/actions';

class AssetCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: LOCAL_SERVER_API + '/upload/asset/pictures/picture5.png',
            avatar: "",
            asset: {
                avatar: '/upload/asset/pictures/picture5.png',
                purchaseDate: this.formatDate2(Date.now()),
                warrantyExpirationDate: this.formatDate2(Date.now()),
                assignedTo: null,
                handoverFromDate: null,
                handoverToDate: null,
                status: "",
                canRegisterForUse: "",
                description: "",
                detailInfo: [],
                residualValue: null,
                startDepreciation: this.formatDate2(Date.now()),
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
        this.handleChangeCourse = this.handleChangeCourse.bind(this);
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

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [year, month].join('-');
        } else return [year, month, day].join('-');
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
            var partValue = value.split('-');
            value = [partValue[2], partValue[1], partValue[0]].join('-');
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
        if (value !== undefined && value.trim() !== '') {
            return true;
        }
        return false;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validatorInput(this.state.asset.code) && this.validatorInput(this.state.asset.assetName) &&
            this.validatorInput(this.state.asset.serial) && this.validatorInput(this.state.asset.purchaseDate) &&
            this.validatorInput(this.state.asset.warrantyExpirationDate) && this.validatorInput(this.state.asset.location) &&
            this.validatorInput(this.state.asset.assetType) && this.validatorInput(this.state.asset.managedBy) &&
            this.validatorInput(this.state.asset.status) && this.validatorInput(this.state.asset.canRegisterForUse) &&
            this.validatorInput(this.state.asset.cost) && this.validatorInput(this.state.asset.usefulLife) &&
            this.validatorInput(this.state.asset.startDepreciation) && this.validatorInput(this.state.asset.depreciationType);
        return result;
    }

    // Function thêm mới thông tin tài sản
    save = async () => {
        let { asset, maintainanceLogs, usageLogs, incidentLogs, files } = this.state;
        await this.setState({
            asset: {
                ...asset,
                maintainanceLogs,
                usageLogs,
                incidentLogs,
                files
            }
        })
        let formData = convertJsonObjectToFormData(this.state.asset);
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", this.state.avatar);
        this.props.addNewAsset(formData);
    }

    render() {
        const { translate, assetsManager } = this.props;
        console.log(this.state, 'this.state-create')
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-add-asset" button_name="Thêm mới tài sản" title="Thêm mới tài sản" />
                <DialogModal
                    size='75' modalID="modal-add-asset" isLoading={assetsManager.isLoading}
                    formID="form-add-asset"
                    title="Thêm mới tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title="Thông tin chung" data-toggle="tab" href="#general">Thông tin chung</a></li>
                            <li><a title="Thông tin bảo trì" data-toggle="tab" href="#maintainance">Thông tin bảo trì</a></li>
                            <li><a title="Thông tin sử dụng" data-toggle="tab" href="#usage">Thông tin sử dụng</a></li>
                            <li><a title="Thông tin khấu hao" data-toggle="tab" href="#depreciation">Thông tin khấu hao</a></li>
                            <li><a title="Thông tin sự cố" data-toggle="tab" href="#incident">Thông tin sự cố</a></li>
                            <li><a title="Thông tin thanh lý" data-toggle="tab" href="#disposal">Thông tin thanh lý</a></li>
                            <li><a title="Tài liệu đính kèm" data-toggle="tab" href="#attachments">Tài liệu đính kèm</a></li>
                        </ul>
                        < div className="tab-content">
                            <GeneralTab
                                id="general"
                                img={this.state.img}
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                                asset={this.state.asset}
                                detailInfo={this.state.asset.detailInfo}
                            />

                            <MaintainanceLogTab
                                id="maintainance"
                                maintainanceLogs={this.state.maintainanceLogs}
                                handleAddMaintainance={this.handleChangeMaintainanceLog}
                                handleEditMaintainance={this.handleChangeMaintainanceLog}
                                handleDeleteMaintainance={this.handleChangeMaintainanceLog}
                            />

                            <UsageLogTab
                                id="usage"
                                usageLogs={this.state.usageLogs}
                                handleAddUsage={this.handleChangeUsageLog}
                                handleEditUsage={this.handleChangeUsageLog}
                                handleDeleteUsage={this.handleChangeUsageLog}
                            />

                            <DepreciationTab
                                id="depreciation"
                                asset={this.state.asset}
                                handleChange={this.handleChange}
                            />

                            <IncidentLogTab
                                id="incident"
                                incidentLogs={this.state.incidentLogs}
                                handleAddIncident={this.handleChangeIncidentLog}
                                handleEditIncident={this.handleChangeIncidentLog}
                                handleDeleteIncident={this.handleChangeIncidentLog}
                            />

                            <DisposalTab
                                id="disposal"
                                asset={this.state.asset}
                                handleChange={this.handleChange}
                            />

                            <FileTab
                                id="attachments"
                                files={this.state.files}
                                asset={this.state.asset}
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