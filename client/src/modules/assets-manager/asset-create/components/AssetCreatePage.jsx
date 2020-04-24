import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    TabGeneralContent, TabRepairContent, TabDistributeContent, TabAttachmentsContent, TabDepreciationContent// TabMaintenanceContent,
} from './CombineContent';

class AssetCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: 'lib/adminLTE/dist/img/avatar5.png',
            avatar: "",
            assetNew: {
                avatar: 'lib/adminLTE/dist/img/avatar5.png',
                datePurchase: this.formatDate(Date.now()),
                detailInfo: [],
                depreciationInfo: [],
            },
            file: [],
            repairUpgradeNew: [],
            distributeTransferNew: [],
        };

    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
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

    // function thêm mới thông tin tài sản
    handleSubmit = async () => {
        let newAsset = this.state.assetNew;
        let { file, contract, certificate, certificateShort } = this.state;
        // cập nhật lại state trước khi add asset
        await this.setState({
            assetNew: {
                ...newAsset,
                
                file: file.filter(file => (file.fileUpload === " "))
            }
        })
        const { assetNew } = this.state;
        // kiểm tra việc nhập các trường bắt buộc
        if (!assetNew.assetNumber) {
            this.notifyerror("Bạn chưa nhập mã tài sản");
        } else if (!assetNew.assetName) {
            this.notifyerror("Bạn chưa nhập tên tài sản");
        } 
        // else if (!assetNew.MSCC) {
        //     this.notifyerror("Bạn chưa nhập mã chấm công");
        // } else if (!assetNew.brithday) {
        //     this.notifyerror("Bạn chưa nhập ngày sinh");
        // } else if (!assetNew.emailCompany) {
        //     this.notifyerror("Bạn chưa nhập email công ty");
        // } else if (this.props.employeesManager.checkEmail === true) {
        //     this.notifyerror("Email công ty đã được sử dụng");
        // } else if (!assetNew.CMND) {
        //     this.notifyerror("Bạn chưa nhập số CMND/ Hộ chiếu");
        // } else if (!assetNew.dateCMND) {
        //     this.notifyerror("Bạn chưa nhập ngày cấp CMND/ Hộ chiếu");
        // } else if (!assetNew.addressCMND) {
        //     this.notifyerror("Bạn chưa nhập nơi cấp CMND/ Hộ chiếu");
        // } else if (!assetNew.phoneNumber) {
        //     this.notifyerror("Bạn chưa nhập số điện thoại");
        // } else if (!assetNew.nowAddress) {
        //     this.notifyerror("Bạn chưa nhập nơi ở hiện tại");
        // } else if (!assetNew.numberTax || !assetNew.userTax || !assetNew.startTax || !assetNew.unitTax) {
        //     this.notifyerror("Bạn chưa nhập đủ thông tin thuế");
        // } 
        else {
            await this.props.addNewAsset(assetNew);
            // lưu avatar
            if (this.state.avatar !== "") {
                let formData = new FormData();
                formData.append('fileUpload', this.state.avatar);
                this.props.uploadAvatar(this.state.assetNew.assetNumber, formData);
            };
            // lưu thông tin tài liệu đính kèm
            if (this.state.file.length !== 0) {
                let listFile = this.state.file;
                listFile = listFile.filter(file => (file.fileUpload !== " "))
                listFile.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameFile', x.nameFile);
                    formData.append('discFile', x.discFile);
                    formData.append('file', x.file);
                    formData.append('number', x.number);
                    this.props.updateFile(this.state.assetNew.assetNumber, formData)
                })
            }
            
            this.notifysuccess("Thêm tài sản thành công");
        }
    }


    render() {
        console.log(this.state);
        const { translate } = this.props;
        return (
            <div className=" qlcv">
                <div className="nav-tabs-custom" >
                    <ul className="nav nav-tabs">
                        <li className="active"><a title="Thông tin chung" data-toggle="tab" href="#thongtinchung">Thông tin chung</a></li>
                        <li><a title="Sửa chữa - thay thế - nâng cấp" data-toggle="tab" href="#suachua">Sửa chữa - Thay thế - Nâng cấp</a></li>
                        <li><a title="Cấp phát - điều chuyển - thu hồi" data-toggle="tab" href="#capphat">Cấp phát - Điều chuyển - Thu hồi</a></li>
                        <li><a title="Bảo hành - bảo trì" data-toggle="tab" href="#baohanh">Bảo hành - Bảo trì</a></li>
                        <li><a title="Thông tin khấu hao" data-toggle="tab" href="#khauhao">Thông tin khấu hao</a></li>
                        <li><a title="Tài liệu đính kèm" data-toggle="tab" href="#tailieu">Tài liệu đính kèm</a></li>
                    </ul>
                    < div className="tab-content">
                        <TabGeneralContent
                            id="thongtinchung"
                            img={this.state.img}
                            handleChange={this.handleChange}
                            handleUpload={this.handleUpload}
                            asset={this.state.assetNew}
                        />

                        <TabRepairContent
                            id="suachua"
                            repairUpgrade={this.state.repairUpgradeNew}
                            handleAddRepairUpgrade={this.handleChangeRepairUpgrade}
                            handleEditRepairUpgrade={this.handleChangeRepairUpgrade}
                            handleDeleteRepairUpgrade={this.handleChangeRepairUpgrade}
                        />

                        <TabDistributeContent
                            id="capphat"
                            distributeTransfer={this.state.distributeTransferNew}
                            handleAddDistributeTransfer={this.handleChangeDistributeTransfer}
                            handleEditDistributeTransfer={this.handleChangeDistributeTransfer}
                            handleDeleteDistributeTransfer={this.handleChangeDistributeTransfer}
                        />

                        <TabDepreciationContent
                            id="khauhao"
                            asset={this.state.assetNew}
                            handleChange={this.handleChange}
                        />

                        <TabAttachmentsContent
                            id="tailieu"
                            file={this.state.file}
                            asset={this.state.assetNew}
                            handleChange={this.handleChange}
                            handleAddFile={this.handleChangeFile}
                            handleEditFile={this.handleChangeFile}
                            handleDeleteFile={this.handleChangeFile}
                            handleSubmit={this.handleSubmit}
                        />
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    };
}

function mapState(state) {
    const { asset, RepairUpgrade, DistributeTransfer } = state;
    return { asset, RepairUpgrade, DistributeTransfer };
};

const actionCreators = {
    // addNewAsset: AssetManagerActions.addNewAsset,
    // uploadAvatar: AssetManagerActions.uploadAvatar,
    // checkAssetNumber: AssetManagerActions.checkAssetNumber,
    // createNewRepairUpgrade: RepairUpgradeActions.createNewRepairUpgrade,
    // createNewDistributeTransfer: DistributeTransferActions.createNewDistributeTransfer,
    // updateFile: AssetManagerActions.updateFile,
};
const createPage = connect(mapState, actionCreators)(withTranslate(AssetCreatePage));
export { createPage as AssetCreatePage };