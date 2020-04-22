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

// TODO: function thêm thông tin quá trình đào tạo
// handleChangeCourse = (data) => {
//     const { employeeNew } = this.state;
//     var course = employeeNew.course;
//     this.setState({
//         employeeNew: {
//             ...employeeNew,
//             course: [...course, {
//                 ...data
//             }]
//         }
//     })
// }

// // function thêm mới thông tin nhân viên
// handleSubmit = async () => {
//     let newEmployee = this.state.employeeNew;
//     let { file, contract, certificate, certificateShort } = this.state;
//     // cập nhật lại state trước khi add employee
//     await this.setState({
//         employeeNew: {
//             ...newEmployee,
//             certificate: certificate.filter(certificate => (certificate.fileUpload === " ")),
//             certificateShort: certificateShort.filter(certificateShort => (certificateShort.fileUpload === " ")),
//             contract: contract.filter(contract => (contract.fileUpload === " ")),
//             file: file.filter(file => (file.fileUpload === " "))
//         }
//     })
//     const { employeeNew } = this.state;
//     // kiểm tra việc nhập các trường bắt buộc
//     if (!employeeNew.employeeNumber) {
//         this.notifyerror("Bạn chưa nhập mã nhân viên");
//     } else if (!employeeNew.fullName) {
//         this.notifyerror("Bạn chưa nhập tên nhân viên");
//     } else if (!employeeNew.MSCC) {
//         this.notifyerror("Bạn chưa nhập mã chấm công");
//     } else if (!employeeNew.brithday) {
//         this.notifyerror("Bạn chưa nhập ngày sinh");
//     } else if (!employeeNew.emailCompany) {
//         this.notifyerror("Bạn chưa nhập email công ty");
//     } else if (this.props.employeesManager.checkEmail === true) {
//         this.notifyerror("Email công ty đã được sử dụng");
//     } else if (!employeeNew.CMND) {
//         this.notifyerror("Bạn chưa nhập số CMND/ Hộ chiếu");
//     } else if (!employeeNew.dateCMND) {
//         this.notifyerror("Bạn chưa nhập ngày cấp CMND/ Hộ chiếu");
//     } else if (!employeeNew.addressCMND) {
//         this.notifyerror("Bạn chưa nhập nơi cấp CMND/ Hộ chiếu");
//     } else if (!employeeNew.phoneNumber) {
//         this.notifyerror("Bạn chưa nhập số điện thoại");
//     } else if (!employeeNew.nowAddress) {
//         this.notifyerror("Bạn chưa nhập nơi ở hiện tại");
//     } else if (!employeeNew.numberTax || !employeeNew.userTax || !employeeNew.startTax || !employeeNew.unitTax) {
//         this.notifyerror("Bạn chưa nhập đủ thông tin thuế");
//     } else {
//         await this.props.addNewEmployee(employeeNew);
//         // lưu avatar
//         if (this.state.avatar !== "") {
//             let formData = new FormData();
//             formData.append('fileUpload', this.state.avatar);
//             this.props.uploadAvatar(this.state.employeeNew.employeeNumber, formData);
//         };

//         // lưu thông tin tài liệu đính kèm
//         if (this.state.file.length !== 0) {
//             let listFile = this.state.file;
//             listFile = listFile.filter(file => (file.fileUpload !== " "))
//             listFile.map(x => {
//                 let formData = new FormData();
//                 formData.append('fileUpload', x.fileUpload);
//                 formData.append('nameFile', x.nameFile);
//                 formData.append('discFile', x.discFile);
//                 formData.append('file', x.file);
//                 formData.append('number', x.number);
//                 formData.append('status', x.status);
//                 this.props.updateFile(this.state.employeeNew.employeeNumber, formData)
//             })
//         }
//         // lưu lịch sử tăng giảm lương
//         if (this.state.salaryNew.length !== 0) {
//             let employeeNumber = this.state.employeeNew.employeeNumber;
//             this.state.salaryNew.map(x => {
//                 this.props.createNewSalary({ ...x, employeeNumber })
//             })
//         }
//         // lưu thông tin nghỉ phép
//         if (this.state.sabbaticalNew.length !== 0) {
//             let employeeNumber = this.state.employeeNew.employeeNumber;
//             this.state.sabbaticalNew.map(x => {
//                 this.props.createNewSabbatical({ ...x, employeeNumber })
//             })
//         }
//         // lưu thông tin khen thưởng
//         if (this.state.praiseNew.length !== 0) {
//             let employeeNumber = this.state.employeeNew.employeeNumber;
//             this.state.praiseNew.map(x => {
//                 this.props.createNewPraise({ ...x, employeeNumber })
//             })
//         }
//         // lưu thông tin kỷ luật
//         if (this.state.disciplineNew.length !== 0) {
//             let employeeNumber = this.state.employeeNew.employeeNumber;
//             this.state.disciplineNew.map(x => {
//                 this.props.createNewDiscipline({ ...x, employeeNumber })
//             })
//         }
//         this.notifysuccess("Thêm nhân viên thành công");
//     }
// }

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
                        handleChange={this.handleChange}
                        asset={this.state.assetNew}
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
// const { employeesManager, Salary, Discipline, Sabbatical } = state;
// return { employeesManager, Salary, Discipline, Sabbatical };
};

const actionCreators = {
// addNewEmployee: EmployeeManagerActions.addNewEmployee,
// uploadAvatar: EmployeeManagerActions.uploadAvatar,
// checkMSNV: EmployeeManagerActions.checkMSNV,
// checkEmail: EmployeeManagerActions.checkEmail,
// createNewSalary: SalaryActions.createNewSalary,
// createNewSabbatical: SabbaticalActions.createNewSabbatical,
// createNewPraise: DisciplineActions.createNewPraise,
// createNewDiscipline: DisciplineActions.createNewDiscipline,
// updateContract: EmployeeManagerActions.updateContract,
// updateCertificate: EmployeeManagerActions.updateCertificate,
// updateCertificateShort: EmployeeManagerActions.updateCertificateShort,
// updateFile: EmployeeManagerActions.updateFile,
};
const createPage = connect(mapState, actionCreators)(withTranslate(AssetCreatePage));
export { createPage as AssetCreatePage };