import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';

import { LOCAL_SERVER_API } from '../../../../env';
import {DialogModal} from '../../../../common-components';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';

import {
        GeneralTab, MaintainanceLogTab, UsageLogTab, DepreciationTab, IncidentLogTab, FileTab
        } from '../../asset-create/components/combinedContent';
import {AssetManagerActions} from '../redux/actions';

class AssetEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        if(name==='purchaseDate'||name==='warrantyExpirationDate'||name==='handoverFromDate'||name==='handoverToDate'){
            var partValue = value.split('-');
            value = [partValue[2],partValue[1], partValue[0]].join('-');
        }
        this.setState({
            asset: {
                ...asset,
                [name]: value
            }
        });
    }

    // Function thêm sửa chữa, thay thế, nâng cấp
    handleCreateMaintainanceLogs = (data, addData) => {
        this.setState({
            maintainanceLogs: data
        })
    }
    // Function chỉnh sửa sửa chữa, thay thế, nâng cấp
    handleEditMaintainanceLogs = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editMaintainanceLogs: [...this.state.editMaintainanceLogs, editData]
            })
        } else {
            this.setState({
                maintainanceLogs: data
            })
        }
    }
    // Function xoá sửa chữa, thay thế, nâng cấp
    handleDeleteMaintainanceLogs = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteMaintainanceLogs: [...this.state.deleteMaintainanceLogs, deleteData],
                editMaintainanceLogs: this.state.editMaintainanceLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                maintainanceLogs: data
            })
        }
    }

    // Function thêm thông tin cấp phát, điều chuyển, thu hồi
    handleCreateUsageLogs = (data, addData) => {
        this.setState({
            usageLogs: data
        })
    }
    // Function chỉnh sửa thông tin cấp phát, điều chuyển, thu hồi
    handleEditUsageLogs = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editUsageLogs: [...this.state.editUsageLogs, editData]
            })
        } else {
            this.setState({
                usageLogs: data
            })
        }
    }
    // Function xoá thông tin cấp phát, điều chuyển, thu hồi
    handleDeleteUsageLogs = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteUsageLogs: [...this.state.deleteUsageLogs, deleteData],
                editUsageLogs: this.state.editUsageLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                usageLogs: data
            })
        }
    }

    // Function thêm thông tin sự cố tài sản
    handleCreateIncidentLogs = (data, addData) => {
        this.setState({
            incidentLogs: data
        })
    }
    // Function chỉnh sửa thông tin sự cố tài sản
    handleEditIncidentLogs = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editIncidentLogs: [...this.state.editIncidentLogs, editData]
            })
        } else {
            this.setState({
                incidentLogs: data
            })
        }
    }
    // Function xoá thông tin sự cố tài sản
    handleDeleteIncidentLogs = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteIncidentLogs: [...this.state.deleteIncidentLogs, deleteData],
                editIncidentLogs: this.state.editIncidentLogs.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                incidentLogs: data
            })
        }
    }

    // Function thêm thông tin tài liệu đính kèm
    handleCreateFile = (data, addData) => {
        this.setState({
            files: data
        })
    }
    // Function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editFiles: [...this.state.editFiles, editData]
            })
        } else {
            this.setState({
                files: data
            })
        }
    }
    // Function xoá thông tin tài liệu đính kèm
    handleDeleteFile = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteFiles: [...this.state.deleteFiles, deleteData],
                editFiles: this.state.editFiles.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                files: data
            })
        }
    }

    // TODO: function 
    handleChangeCourse = (data) => {
        const { assetNew } = this.state;
        this.setState({
            assetNew: {
                ...assetNew
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
        if (this.state.asset !== undefined) {
            let result = this.validatorInput(this.state.asset.code) && this.validatorInput(this.state.asset.assetName) &&
                this.validatorInput(this.state.asset.serial) && this.validatorInput(this.state.asset.purchaseDate) &&
                this.validatorInput(this.state.asset.warrantyExpirationDate) && this.validatorInput(this.state.asset.location) &&
                this.validatorInput(this.state.asset.status) && this.validatorInput(this.state.asset.cost.toString()) &&
                this.validatorInput(this.state.asset.usefulLife.toString()) && this.validatorInput(this.state.asset.residualValue.toString());
            return result;
        }
        return true;
    }

    save = async () => {
        let { maintainanceLogs, usageLogs, incidentLogs,  files} = this.state;
        await this.setState({
            createMaintainanceLogs: maintainanceLogs.filter(x => x._id === undefined),
            createUsageLogs: usageLogs.filter(x => x._id === undefined),
            createIncidentLogs: incidentLogs.filter(x => x._id === undefined),
            createFiles: files.filter(x => x._id === undefined),
        })
        let formData = convertJsonObjectToFormData(this.state);
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", this.state.avatar);
        this.props.updateInformationAsset(this.state._id, formData);
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                img: LOCAL_SERVER_API + nextProps.assets[0].avatar,
                avatar: "",
                asset: nextProps.assets[0],
                usageLogs: nextProps.assets[0].usageLogs,
                maintainanceLogs: nextProps.assets[0].maintainanceLogs,
                incidentLogs: nextProps.assets[0].incidentLogs,
                files: nextProps.assets[0].files,

                editUsageLogs: [],
                deleteUsageLogs: [],
                editMaintainanceLogs: [],
                deleteMaintainanceLogs: [],
                editIncidentLogs: [],
                deleteIncidentLogs: [],
                editFiles: [],
                deleteFiles: [],

            }
        } else {
            return null;
        }
    }

    render() {
        const {translate, assetsManager} = this.props;
        const {_id} = this.state;
        console.log('this.state', this.state);

        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-edit-asset" isLoading={assetsManager.isLoading}
                    formID="form-edit-asset"
                    title="Chỉnh sửa thông tin tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* <form className="form-group" id="form-edit-asset"> */}
                    <div className="nav-tabs-custom" style={{marginTop: '-15px'}}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title="Thông tin chung" data-toggle="tab" href={`#edit_general${_id}`}>Thông tin chung</a></li>
                            <li><a title="Thông tin bảo trì" data-toggle="tab" href={`#edit_maintainance${_id}`}>Thông tin bảo trì</a></li>
                            <li><a title="Thông tin sử dụng" data-toggle="tab" href={`#edit_usage${_id}`}>Thông tin sử dụng</a></li>
                            <li><a title="Thông tin khấu hao" data-toggle="tab" href={`#edit_depreciation${_id}`}>Thông tin khấu hao</a></li>
                            <li><a title="Thông tin sự cố" data-toggle="tab" href={`#edit_incident${_id}`}>Thông tin sự cố</a></li>
                            <li><a title="Tài liệu đính kèm" data-toggle="tab" href={`#edit_attachments${_id}`}>Tài liệu đính kèm</a></li>
                        </ul>
                        < div className="tab-content">
                            <GeneralTab
                                id={`edit_general${_id}`}
                                img={this.state.img}
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                                asset={this.state.asset}
                            />
                            <MaintainanceLogTab
                                id={`edit_maintainance${_id}`}
                                maintainanceLogs={this.state.maintainanceLogs}
                                handleAddMaintainance={this.handleCreateMaintainanceLogs}
                                handleEditMaintainance={this.handleEditMaintainanceLogs}
                                handleDeleteMaintainance={this.handleDeleteMaintainanceLogs}
                            />
                            <UsageLogTab
                                id={`edit_usage${_id}`}
                                usageLogs={this.state.usageLogs}
                                handleAddUsage={this.handleCreateUsageLogs}
                                handleEditUsage={this.handleEditUsageLogs}
                                handleDeleteUsage={this.handleDeleteUsageLogs}
                            />

                            <DepreciationTab
                                id={`edit_depreciation${_id}`}
                                asset={this.state.asset}
                                handleChange={this.handleChange}
                            />
                            <IncidentLogTab
                                id={`edit_incident${_id}`}
                                incidentLogs={this.state.incidentLogs}
                                handleAddIncident={this.handleCreateIncidentLogs}
                                handleEditIncident={this.handleEditIncidentLogs}
                                handleDeleteIncident={this.handleDeleteIncidentLogs}
                            />

                            <FileTab
                                id={`edit_attachments${_id}`}
                                files={this.state.files}
                                asset={this.state.asset}
                                handleChange={this.handleChange}
                                handleAddFile={this.handleCreateFile}
                                handleEditFile={this.handleEditFile}
                                handleDeleteFile={this.handleDeleteFile}
                            />
                        </div>
                    </div>
                    {/* </form> */}
                </DialogModal>
            </React.Fragment>
        )
    }
};

function mapState(state) {
    const {assetsInfo, assetsManager} = state;
    return {assetsInfo, assetsManager};
};

const actionCreators = {
    updateInformationAsset: AssetManagerActions.updateInformationAsset,
};
const editForm = connect(mapState, actionCreators)(withTranslate(AssetEditForm));
export {editForm as AssetEditForm};