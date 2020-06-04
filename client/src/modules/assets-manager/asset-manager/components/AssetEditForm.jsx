import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DialogModal} from '../../../../common-components';
import {AssetManagerActions} from '../redux/actions';
import {RepairUpgradeActions} from '../../repair-upgrade/redux/actions';
import {DistributeTransferActions} from '../../distribute-transfer/redux/actions';
import 'react-toastify/dist/ReactToastify.css';
import {TabAttachmentsContent, TabDepreciationContent, TabDistributeContent, TabGeneralContent, TabRepairContent} from '../../asset-create/components/CombineContent';

class AssetEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isClose: false, distributeTransferNew: [], isEditDistribute: '', repairUpgradeNew: [], isEditRepair: ''
        };
    }


    // Function upload avatar
    handleUpload = (img, avatar) => {
        console.log(img, avatar);
        const {assetNew} = this.state;
        if (avatar !== undefined) {
            new Promise((resolve, reject) => {
                let data = new FormData();
                data.append('fileUpload', avatar);
                AssetManagerActions.uploadFile(data).then((res) => {
                    if (res.status === 200) {
                        resolve(res.data.url)
                    }
                });
            }).then(url => {
                this.setState({
                    assetNew: {
                        ...assetNew,
                        avatar: url
                    }
                });
            })
        }
    }
    // Function lưu các trường thông tin vào state
    handleChange = (name, value) => {
        const {assetNew} = this.state;
        this.setState({
            assetNew: {
                ...assetNew,
                [name]: value
            }
        });
    }

    // Function thêm, chỉnh sửa thông tin sửa chữa - thay thế - nâng cấp
    handleChangeRepairUpgrade = (data, isEdit) => {
        this.setState(state => {
            return {
                ...state,
                repairUpgradeNew: data,
                isEditRepair: isEdit
            }

        })
    }

    // Function thêm, chỉnh sửa thông tin cấp phát - điều chuyển - thu hồi
    handleChangeDistributeTransfer = (data, isEdit) => {
        this.setState(state => {
            return {
                ...state,
                distributeTransferNew: data,
                isEditDistribute: isEdit
            }

        })
    }

    // Function thêm, chỉnh sửa thông tin tài liệu đính kèm
    handleChangeFile = (data) => {
        console.log('data', data);
        this.setState({
            assetNew: {
                ...this.state.assetNew,
                file: data
            }

        })
    }

    save = async () => {
        let {distributeTransferNew, repairUpgradeNew, assetNew} = this.state;
        console.log('state', repairUpgradeNew);
        let dataUpdate = {};
        let newDataToUpdateAsset = {
            person: distributeTransferNew.receiver,
            dateStartUse: distributeTransferNew.dateStartUse,
            dateEndUse: distributeTransferNew.dateEndUse,
            location: distributeTransferNew.nextLocation
        };
        console.log(distributeTransferNew);
        switch (true) {
            case assetNew !== undefined && distributeTransferNew.length <= 0 && repairUpgradeNew.length <= 0:
                console.log('1');
                dataUpdate = {...this.state.asset, ...assetNew};
                if (!Object.keys(dataUpdate.person).length) dataUpdate.person = null;
                this.props.updateInformationAsset(this.state.asset._id, dataUpdate);
                break;
            case repairUpgradeNew.length && this.state.isEditRepair === 'edit' && assetNew === undefined && distributeTransferNew === undefined :
                this.props.updateRepairUpgrade(repairUpgradeNew._id, {...repairUpgradeNew, asset: this.state.asset._id});
                break;
            case repairUpgradeNew.length && !this.state.isEditRepair && assetNew === undefined:
                console.log('3');
                this.props.createNewRepairUpgrade({...repairUpgradeNew, asset: this.state.asset._id});
                break;
            case distributeTransferNew.length && this.state.isEditDistribute === 'edit' && (repairUpgradeNew === undefined || assetNew === undefined) :
                console.log('4');
                this.props.updateDistributeTransfer(distributeTransferNew._id, {...distributeTransferNew, asset: this.state.asset._id}).then(({response}) => {
                    if (response.data.success) {
                        this.props.updateInformationAsset(this.state._id, newDataToUpdateAsset);
                    }
                });
                break;
            case distributeTransferNew.length && this.state.isEditDistribute === 'edit' && repairUpgradeNew !== undefined && this.state.isEditRepair === 'edit' && assetNew !== undefined :
                dataUpdate = {...this.state.asset, ...assetNew};
                if (!Object.keys(dataUpdate.person).length) dataUpdate.person = null;
                this.props.updateInformationAsset(this.state.asset._id, dataUpdate);
                this.props.updateRepairUpgrade(repairUpgradeNew._id, {...repairUpgradeNew, asset: this.state.asset._id})
                this.props.updateDistributeTransfer(distributeTransferNew._id, {...distributeTransferNew, asset: this.state.asset._id}).then(({response}) => {
                    if (response.data.success) {
                        this.props.updateInformationAsset(this.state._id, newDataToUpdateAsset);
                    }
                });
                break;
            case assetNew !== undefined && distributeTransferNew !== undefined && this.state.isEditDistribute === 'edit' && repairUpgradeNew !== undefined && this.state.isEditRepair === 'edit':
                console.log('123');
                dataUpdate = {...this.state.asset, ...assetNew};
                if (!Object.keys(dataUpdate.person).length) dataUpdate.person = null;
                this.props.updateInformationAsset(this.state.asset._id, dataUpdate);
                this.props.updateRepairUpgrade(repairUpgradeNew._id, {...repairUpgradeNew, asset: this.state.asset._id})
                this.props.updateDistributeTransfer(distributeTransferNew._id, {...distributeTransferNew, asset: this.state.asset._id}).then(({response}) => {
                    if (response.data.success) {
                        this.props.updateInformationAsset(this.state._id, newDataToUpdateAsset);
                    }
                });
                break;
            case distributeTransferNew !== undefined && this.state.isEditDistribute === undefined && assetNew === undefined:
                this.props.createNewDistributeTransfer({...distributeTransferNew, asset: this.state.asset._id}).then(({response}) => {
                    if (response.status === 200) {
                        this.props.updateInformationAsset(this.state._id, newDataToUpdateAsset);
                    }
                });
                break;
            default:
                break;

        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps._id !== prevState._id || nextProps.repairUpgrade !== prevState.repairUpgrade || nextProps.distributeTransfer !== prevState.distributeTransfer) {
            return {
                ...prevState,
                asset: nextProps.asset,
                _id: nextProps.asset._id,
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
        const {translate, assetsManager} = this.props;
        const {_id} = this.state;
        console.log('this.state', this.state);
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-edit-asset" isLoading={false}
                    formID="form-edit-asset"
                    title="Chỉnh sửa thông tin tài sản"
                    func={this.save}
                    receiveEventClose={event => this.setState({isClose: event})}
                    disableSubmit={false}
                >
                    {/* <form className="form-group" id="form-edit-employee"> */}
                    <div className="nav-tabs-custom" style={{marginTop: '-15px'}}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title="Thông tin chung" data-toggle="tab" href={`#edit_thongtinchung${_id}`}>Thông tin chung</a></li>
                            <li><a title="Sửa chữa - thay thế - nâng cấp" data-toggle="tab" href={`#edit_suachua${_id}`}>Sửa chữa - Thay thế - Nâng cấp</a></li>
                            <li><a title="Cấp phát - điều chuyển - thu hồi" data-toggle="tab" href={`#edit_capphat${_id}`}>Cấp phát - Điều chuyển - Thu hồi</a></li>
                            <li><a title="Thông tin khấu hao" data-toggle="tab" href={`#edit_khauhao${_id}`}>Thông tin khấu hao</a></li>
                            <li><a title="Tài liệu đính kèm" data-toggle="tab" href={`#edit_tailieu${_id}`}>Tài liệu đính kèm</a></li>
                        </ul>
                        < div className="tab-content">
                            <TabGeneralContent
                                id={`edit_thongtinchung${_id}`}
                                img={this.props.asset.img}
                                asset={this.state.asset}

                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                            />
                            <TabRepairContent
                                id={`edit_suachua${_id}`}
                                isCloseModal={this.state.isClose}
                                repairUpgrade={this.state.repairUpgrade}
                                handleAddRepairUpgrade={this.handleChangeRepairUpgrade}
                                handleEditRepairUpgrade={this.handleChangeRepairUpgrade}
                                handleDeleteRepairUpgrade={this.handleChangeRepairUpgrade}
                            />
                            <TabDistributeContent
                                id={`edit_capphat${_id}`}
                                isCloseModal={this.state.isClose}
                                asset={this.state.asset}
                                distributeTransfer={this.state.distributeTransfer}
                                handleAddDistributeTransfer={this.handleChangeDistributeTransfer}
                                handleEditDistributeTransfer={this.handleChangeDistributeTransfer}
                                handleDeleteDistributeTransfer={this.handleChangeDistributeTransfer}
                            />

                            <TabDepreciationContent
                                id={`edit_khauhao${_id}`}
                                asset={this.state.asset}
                                handleChange={this.handleChange}

                            />

                            <TabAttachmentsContent
                                id={`edit_tailieu${_id}`}
                                file={this.state.asset.file}
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
    const {assetsInfo, assetsManager} = state;
    return {assetsInfo, assetsManager};
};

const actionCreators = {
    updateInformationAsset: AssetManagerActions.updateInformationAsset,
    getAllAsset: AssetManagerActions.getAllAsset,
    uploadAvatar: AssetManagerActions.uploadAvatar,
    checkCode: AssetManagerActions.checkCode,

    createNewRepairUpgrade: RepairUpgradeActions.createNewRepairUpgrade,
    createNewDistributeTransfer: DistributeTransferActions.createNewDistributeTransfer,

    updateRepairUpgrade: RepairUpgradeActions.updateRepairUpgrade,
    updateDistributeTransfer: DistributeTransferActions.updateDistributeTransfer,
    updateFile: AssetManagerActions.updateFile,

    deleteRepairUpgrade: RepairUpgradeActions.deleteRepairUpgrade,
    deleteDistributeTransfer: DistributeTransferActions.deleteDistributeTransfer,
};
const editForm = connect(mapState, actionCreators)(withTranslate(AssetEditForm));
export {editForm as AssetEditForm};
