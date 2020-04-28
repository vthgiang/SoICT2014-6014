import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { RepairUpgradeActions } from '../../repair-upgrade/redux/actions';
import { DistributeTransferActions } from '../../distribute-transfer/redux/actions';
import { AssetManagerActions } from '../../asset-manager/redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    TabGeneralContent, TabRepairContent, TabDistributeContent, TabAttachmentsContent, TabDepreciationContent
} from '../../asset-create/components/CombineContent';

class AssetEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    // Function upload avatar 
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }
    // Function lưu các trường thông tin vào state
    handleChange = (name, value) => {
        const { assetNew } = this.state;
        this.setState({
            assetNew: {
                ...assetNew,
                [name]: value
            }
        });
    }

    // Function thêm thông tin sửa chữa - thay thế - nâng cấp
handleChangeRepairUpgrade = (data) => {
    this.setState({
        repairUpgradeNew: data
    })
}

// Function thêm thông tin cấp phát - điều chuyển - thu hồi
handleChangeDistributeTransfer = (data) => {
    this.setState({
        distributeTransferNew: data
    })
}

// Function thêm thông tin tài liệu đính kèm
handleChangeFile = (data) => {
    this.setState({
        file: data
    })
}

    save = async () => {
        
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                img: nextProps.asset[0].avatar,
                avatar: "",
                asset: nextProps.asset[0],
                repairUpgrade: nextProps.repairUpgrade,
                distributeTransfer: nextProps.distributeTransfer,
                file: nextProps.asset[0].file,
                
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, assetsManager } = this.props;
        const { _id } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-edit-asset" isLoading={false}
                    formID="form-edit-asset"
                    title="Chỉnh sửa thông tin tài sản"
                    func={this.save}
                    disableSubmit={false}
                >
                    {/* <form className="form-group" id="form-edit-employee"> */}
                    <div className="nav-tabs-custom" style={{ marginTop: '-15px' }} >
                            <ul className="nav nav-tabs">
                                <li className="active"><a title="Thông tin chung" data-toggle="tab" href={`#edit_thongtinchung${_id}`}>Thông tin chung</a></li>
                                <li><a title="Sửa chữa - thay thế - nâng cấp" data-toggle="tab" href={`#edit_suachua${_id}`}>Sửa chữa - Thay thế - Nâng cấp</a></li>
                                <li><a title="Cấp phát - điều chuyển - thu hồi" data-toggle="tab" href={`#edit_capphat${_id}`}>Cấp phát - Điều chuyển - Thu hồi</a></li>
                                <li><a title="Bảo hành - bảo trì" data-toggle="tab" href={`#edit_baohanh${_id}`}>Bảo hành - Bảo trì</a></li>
                                <li><a title="Thông tin khấu hao" data-toggle="tab" href={`#edit_khauhao${_id}`}>Thông tin khấu hao</a></li>
                                <li><a title="Tài liệu đính kèm" data-toggle="tab" href={`#edit_tailieu${_id}`}>Tài liệu đính kèm</a></li>
                            </ul>
                        < div className="tab-content">
                            <TabGeneralContent
                                id={`#edit_thongtinchung${_id}`}
                                img={this.state.img}
                                asset={this.state.asset}
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                            />
                            <TabRepairContent
                                id={`#edit_suachua${_id}`}
                                repairUpgrade={this.state.repairUpgrade}
                                handleAddRepairUpgrade={this.handleChangeRepairUpgrade}
                                handleEditRepairUpgrade={this.handleChangeRepairUpgrade}
                                handleDeleteRepairUpgrade={this.handleChangeRepairUpgrade}
                            />
                            <TabDistributeContent
                                id={`#edit_capphat${_id}`}
                                distributeTransfer={this.state.distributeTransfer}
                                handleAddDistributeTransfer={this.handleChangeDistributeTransfer}
                                handleEditDistributeTransfer={this.handleChangeDistributeTransfer}
                                handleDeleteDistributeTransfer={this.handleChangeDistributeTransfer}
                            />

                            <TabDepreciationContent
                                id={`#edit_khauhao${_id}`}
                                asset={this.state.asset}
                                handleChange={this.handleChange}
                                
                            />

                            <TabAttachmentsContent
                                id={`#edit_tailieu${_id}`}
                                file={this.state.file}
                                asset={this.state.asset}
                                handleChange={this.handleChange}
                                handleAddFile={this.handleChangeFile}
                                handleEditFile={this.handleChangeFile}
                                handleDeleteFile={this.handleChangeFile}
                                handleSubmit={this.handleSubmit}
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
    const { assetsInfo, assetsManager } = state;
    return { assetsInfo, assetsManager };
};

const actionCreators = {
    // updateInformationAsset: AssetManagerActions.updateInformationAsset,
    // getAllAsset: AssetManagerActions.getAllAsset,
    // uploadAvatar: AssetManagerActions.uploadAvatar,
    // checkAssetNumber: AssetManagerActions.checkAssetNumber,

    // updateFile: AssetManagerActions.updateFile,

    // createNewRepairUpgrade: RepairUpgradeActions.createNewRepairUpgrade,
    // createNewDistributeTransfer: DistributeTransferActions.createNewDistributeTransfer,

    // updateRepairUpgrade: RepairUpgradeActions.updateRepairUpgrade,
    // updateDistributeTransfer: DistributeTransferActions.updateDistributeTransfer,

    // deleteRepairUpgrade: RepairUpgradeActions.deleteRepairUpgrade,
    // deleteDistributeTransfer: DistributeTransferActions.deleteDistributeTransfer,
};
const editForm = connect(mapState, actionCreators)(withTranslate(AssetEditForm));
export { editForm as AssetEditForm };