// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { withTranslate } from 'react-redux-multilingual';
// import { RepairUpgradeActions } from '../../repair-upgrade/redux/actions';
// import { DistributeTransferActions } from '../../distribute-transfer/redux/actions';
// import { AssetManagerActions } from '../../asset-management/redux/actions';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//     TabGeneralContent, TabRepairContent, TabDistributeContent, TabAttachmentsContent, TabDepreciationContent// TabMaintenanceContent,
// } from './combinedContent';



// class AssetCreatePage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             img: 'lib/adminLTE/dist/img/avatar5.png',
//             avatar: "",
//             assetNew: {
//                 avatar: 'lib/adminLTE/dist/img/avatar5.png',
//                 datePurchase: this.formatDate(Date.now()),
//                 detailInfo: [],
//             },
//             file: [],
//             repairUpgradeNew: [],
//             distributeTransferNew: [],
//         };

//     }

//     // Function format ngày hiện tại thành dạnh mm-yyyy
//     formatDate = (date) => {
//         var d = new Date(date),
//             month = '' + (d.getMonth() + 1),
//             day = '' + d.getDate(),
//             year = d.getFullYear();

//         if (month.length < 2)
//             month = '0' + month;
//         if (day.length < 2)
//             day = '0' + day;

//         return [day, month, year].join('-');
//     }
//     // function: notification the result of an action
//     notifysuccess = (message) => toast(message);
//     notifyerror = (message) => toast.error(message);
//     notifywarning = (message) => toast.warning(message);

//     // Function upload avatar 
//     handleUpload = (img, avatar) => {
//         this.setState({
//             img: img,
//             avatar: avatar
//         })
//     }
//     // Function lưu các trường thông tin vào state
//     handleChange = (name, value) => {
//         const { assetNew } = this.state;
//         this.setState({
//             assetNew: {
//                 ...assetNew,
//                 [name]: value
//             }
//         });
//     }

//     // Function thêm thông tin sửa chữa - thay thế - nâng cấp
//     handleChangeRepairUpgrade = (data) => {
//         this.setState({
//             repairUpgradeNew: data
//         })
//     }

//     // Function thêm thông tin cấp phát - điều chuyển - thu hồi
//     handleChangeDistributeTransfer = (data) => {
//         this.setState({
//             distributeTransferNew: data
//         })
//     }

//     // Function thêm thông tin tài liệu đính kèm
//     handleChangeFile = (data) => {
//         this.setState({
//             file: data
//         })
//     }

//     // function thêm mới thông tin tài sản
//     handleSubmit = async () => {
//         let newAsset = this.state.assetNew;
//         let { file } = this.state;
//         // cập nhật lại state trước khi add asset
//         await this.setState({
//             assetNew: {
//                 ...newAsset,
                
//                 file: file.filter(file => (file.fileUpload === " "))
//             }
//         })
//         const { assetNew } = this.state;
//         // kiểm tra việc nhập các trường bắt buộc
//         if (!assetNew.code) {
//             this.notifyerror("Bạn chưa nhập mã tài sản");
//         } else if (!assetNew.assetName) {
//             this.notifyerror("Bạn chưa nhập tên tài sản");
//         } else if (!assetNew.assetType) {
//             this.notifyerror("Bạn chưa nhập loại tài sản");
//         } else if (!assetNew.location) {
//             this.notifyerror("Bạn chưa nhập vị trí tài sản");
//         } else if (!assetNew.datePurchase) {
//             this.notifyerror("Bạn chưa nhập ngày nhập");
//         } else if (!assetNew.manager) {
//             this.notifyerror("Bạn chưa nhập người quản lý");
//         } else if (!assetNew.initialPrice) {
//             this.notifyerror("Bạn chưa nhập giá trị ban đầu");
//         } else {
//             await this.props.addNewAsset(assetNew);

//             // lưu avatar
//             if (this.state.avatar !== "") {
//                 let formData = new FormData();
//                 formData.append('fileUpload', this.state.avatar);
//                 this.props.uploadAvatar(this.state.assetNew.code, formData);
//             }

//             // lưu lịch sử sửa chữa - thay thế - nâng cấp
//             if (this.state.repairUpgradeNew.length !== 0) {
//                 let code = this.state.assetNew.code;
//                 this.state.repairUpgradeNew.map(x => {
//                     this.props.createNewRepairUpgrade({ ...x, code })
//                 })
//             }

//             // lưu thông tin cấp phát - điều chuyển - thay thế
//             if (this.state.distributeTransferNew.length !== 0) {
//                 let code = this.state.assetNew.code;
//                 this.state.distributeTransferNew.map(x => {
//                     this.props.createNewDistributeTransfer({ ...x, code })
//                 })
//             }

//             // lưu thông tin tài liệu đính kèm
//             if (this.state.file.length !== 0) {
//                 let listFile = this.state.file;
//                 listFile = listFile.filter(file => (file.fileUpload !== " "))
//                 listFile.map(x => {
//                     let formData = new FormData();
//                     formData.append('fileUpload', x.fileUpload);
//                     formData.append('nameFile', x.nameFile);
//                     formData.append('discFile', x.discFile);
//                     formData.append('file', x.file);
//                     formData.append('number', x.number);
//                     this.props.updateFile(this.state.assetNew.code, formData)
//                 })
//             }
            
//             this.notifysuccess("Thêm tài sản thành công");
//         }
//     }


//     render() {
//         console.log(this.state);
//         const { translate } = this.props;
//         return (
//             <div className=" qlcv">
//                 <div className="nav-tabs-custom" >
//                     <ul className="nav nav-tabs">
//                         <li className="active"><a title="Thông tin chung" data-toggle="tab" href="#thongtinchung">Thông tin chung</a></li>
//                         <li><a title="Sửa chữa - thay thế - nâng cấp" data-toggle="tab" href="#suachua">Sửa chữa - Thay thế - Nâng cấp</a></li>
//                         <li><a title="Cấp phát - điều chuyển - thu hồi" data-toggle="tab" href="#capphat">Cấp phát - Điều chuyển - Thu hồi</a></li>
//                         {/* <li><a title="Bảo hành - bảo trì" data-toggle="tab" href="#baohanh">Bảo hành - Bảo trì</a></li> */}
//                         <li><a title="Thông tin khấu hao" data-toggle="tab" href="#khauhao">Thông tin khấu hao</a></li>
//                         <li><a title="Tài liệu đính kèm" data-toggle="tab" href="#pagetailieu">Tài liệu đính kèm</a></li>
//                     </ul>
//                     < div className="tab-content">
//                         <TabGeneralContent
//                             id="thongtinchung"
//                             img={this.state.img}
//                             handleChange={this.handleChange}
//                             handleUpload={this.handleUpload}
//                             asset={this.state.assetNew}
//                         />

//                         <TabRepairContent
//                             id="suachua"
//                             repairUpgrade={this.state.repairUpgradeNew}
//                             handleAddRepairUpgrade={this.handleChangeRepairUpgrade}
//                             handleEditRepairUpgrade={this.handleChangeRepairUpgrade}
//                             handleDeleteRepairUpgrade={this.handleChangeRepairUpgrade}
//                         />

//                         <TabDistributeContent
//                             id="capphat"
//                             distributeTransfer={this.state.distributeTransferNew}
//                             handleAddDistributeTransfer={this.handleChangeDistributeTransfer}
//                             handleEditDistributeTransfer={this.handleChangeDistributeTransfer}
//                             handleDeleteDistributeTransfer={this.handleChangeDistributeTransfer}
//                         />

//                         <TabDepreciationContent
//                             id="khauhao"
//                             asset={this.state.assetNew}
//                             handleChange={this.handleChange}
//                         />

//                         <TabAttachmentsContent
//                             id="pagetailieu"
//                             file={this.state.file}
//                             asset={this.state.assetNew}
//                             handleChange={this.handleChange}
//                             handleAddFile={this.handleChangeFile}
//                             handleEditFile={this.handleChangeFile}
//                             handleDeleteFile={this.handleChangeFile}
//                             handleSubmit={this.handleSubmit}
//                         />
//                     </div>
//                 </div>
//                 <ToastContainer />
//             </div>
//         );
//     };
// }

// function mapState(state) {
//     const { assetsManager, RepairUpgrade, DistributeTransfer } = state;
//     return { assetsManager, RepairUpgrade, DistributeTransfer };
// };

// const actionCreators = {
//     // addNewAsset: AssetManagerActions.addNewAsset,
//     // uploadAvatar: AssetManagerActions.uploadAvatar,
//     // checkCode: AssetManagerActions.checkCode,
//     // createNewRepairUpgrade: RepairUpgradeActions.createNewRepairUpgrade,
//     // createNewDistributeTransfer: DistributeTransferActions.createNewDistributeTransfer,
//     // updateFile: AssetManagerActions.updateFile,
// };
// const createPage = connect(mapState, actionCreators)(withTranslate(AssetCreatePage));
// export { createPage as AssetCreatePage };