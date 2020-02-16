import React, { Component } from 'react';
import { connect } from 'react-redux';
import { employeeInfoActions } from '../../employee-info/redux/actions';
class ModalDetailEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {

        var list = this.props.list;
        console.log(list);
        return (
            <div style={{display:"inline"}}>
                <a href={`#modal-viewEmployee-${list.employeeNumber}`} title="Xem chi tiết nhân viên" data-toggle="modal"><i className="material-icons">visibility</i></a>
                <div className="modal modal-full fade" id={`modal-viewEmployee-${list.employeeNumber}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog-full">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chi tiết nhân viên:  {list.fullName} - {list.employeeNumber} </h4>
                            </div>
                            <div className="modal-body" style={{ paddingTop: 0 }}>
                                <div className="nav-tabs-custom">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin chung của nhân viên" data-toggle="tab" href="#thongtinchung">Thông tin chung</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin liên hệ của nhân viên" data-toggle="tab" href="#thongtinlienhe">Thông tin liên hệ</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Trình độ học vấn - Khinh nghiệm làm việc" data-toggle="tab" href="#kinhnghiem"> Học vấn - Kinh nghiệm</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Bằng cấp - Chứng chỉ" data-toggle="tab" href="#bangcap">Bằng cấp - Chứng chỉ</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Tài khoản ngân hành - Thuế thu nhập các nhân" data-toggle="tab" href="#taikhoan">Tài khoản - Thuế</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin bảo hiểm" data-toggle="tab" href="#baohiem">Thông tin bảo hiểm</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Hợp đồng lao động - Quá trình đào tạo" data-toggle="tab" href="#hopdong">Hợp đồng - Đào tạo</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Khen thưởng - kỷ luật" data-toggle="tab" href="#khenthuong">Khen thưởng - Kỷ luật</a></li>
                                        <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Lịch sử tăng giảm lương" data-toggle="tab" href="#historySalary">Lịch sử tăng giảm lương</a></li>
                                        <li><a style={{ paddingLeft: 5, }} title="Tài liệu đính kèm" data-toggle="tab" href="#tailieu">Tài liệu đính kèm</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="thongtinchung" className="tab-pane active">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <div className="col-sm-3">
                                                        <div className="form-group">
                                                            <img className="attachment-img avarta" src="adminLTE/dist/img/avatar5.png" alt="Attachment" />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Mã nhân viên:&emsp; </strong>
                                                            {list.employeeNumber}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Họ và tên:&emsp; </strong>
                                                            {list.fullName}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Giới tính:&emsp; </strong>
                                                            {list.gender}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Ngày sinh:&emsp; </strong>
                                                            {list.brithday}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Nơi sinh:&emsp; </strong>
                                                            {list.birthplace}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Dân tộc:&emsp; </strong>
                                                            {list.national}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Tôn giáo:&emsp; </strong>
                                                            {list.religion}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Quốc tịch:&emsp; </strong>
                                                            {list.nation}
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-5">
                                                        <div className="form-group" style={{ marginTop: 20 }}>
                                                            <strong>Mã số chấm công:&emsp; </strong>
                                                            {list.MSCC}
                                                        </div>
                                                        {
                                                            list.department && list.department.map((department, keys) => (
                                                                <div className="form-group" key={keys}>
                                                                    <strong>Đơn vị:&emsp; </strong>
                                                                    {department.nameDepartment}
                                                                </div>
                                                            ))
                                                        }

                                                        {
                                                            list.department && list.department.map((department, key) => (
                                                                <div className="form-group" key={key}>
                                                                    <strong>Chức vụ:&emsp;</strong>
                                                                    {department.position}
                                                                </div>
                                                            ))
                                                        }
                                                        <div className="form-group" >
                                                            <strong>Số CMND/Hộ chiếu:&emsp; </strong>
                                                            {list.CMND}

                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Ngày cấp:&emsp; </strong>
                                                            {list.dateCMND}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Nơi cấp:&emsp; </strong>
                                                            {list.addressCMND}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Tình trạng hôn nhân:&emsp; </strong>
                                                            {list.relationship}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Email công ty:&emsp; </strong>
                                                            {list.emailCompany}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="thongtinlienhe" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <div className="form-group col-md-4" style={{ marginTop: 20 }}>
                                                        <strong>Điện thoại di động:&emsp; </strong>
                                                        {list.phoneNumber ? "0" + list.phoneNumber : ""}
                                                    </div>
                                                    <div className="col-md-12" style={{ padding: 0 }}>
                                                        <div className="form-group col-md-4">
                                                            <strong>Điện thoại nhà riêng:&emsp; </strong>
                                                            {list.phoneNumberAddress ? "0" + list.phoneNumberAddress : ""}
                                                        </div>
                                                        <div className="form-group col-md-8">
                                                            <strong>Email cá nhân:&emsp; </strong>
                                                            {list.emailPersonal}
                                                        </div>

                                                    </div>

                                                </div>
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Liên hệ khẩn cấp với ai</h4></legend>
                                                        <div className="col-sm-6" style={{ padding: 0 }}>
                                                            <div className="form-group" >
                                                                <strong>Họ và tên:&emsp; </strong>
                                                                {list.friendName}
                                                            </div>
                                                            <div className="form-group" >
                                                                <strong>Quan hệ:&emsp; </strong>
                                                                {list.relation}
                                                            </div>
                                                            <div className="form-group" >
                                                                <strong>Điện Thoại di động:&emsp; </strong>
                                                                {list.friendPhone ? "0" + list.friendPhone : ""}
                                                            </div>
                                                            <div className="form-group" >
                                                                <strong>Điện thoại nhà riêng:&emsp; </strong>
                                                                {list.friendPhoneAddress ? "0" + list.phoneNumberAddress : ""}
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6" style={{ paddingLeft: 35 }}>
                                                            <div className="form-group" >
                                                                <strong>Email:&emsp; </strong>
                                                                {list.friendEmail}
                                                            </div>
                                                            <div className="form-group" >
                                                                <strong>Địa chỉ:&emsp; </strong>
                                                                {list.friendAddress}
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-sm-6">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Hộ khẩu thường trú</h4></legend>
                                                        <div className="form-group" >
                                                            <strong>Địa chỉ:&emsp; </strong>
                                                            {list.localAddress}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Xã/Phường:&emsp; </strong>
                                                            {list.localCommune}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Quận/Huyện:&emsp; </strong>
                                                            {list.localDistrict}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Tỉnh/Thành phố:&emsp; </strong>
                                                            {list.localCity}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Quốc gia:&emsp; </strong>
                                                            {list.localNational}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-sm-6">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Chỗ ở hiện tại</h4></legend>
                                                        <div className="form-group" >
                                                            <strong>Địa chỉ:&emsp; </strong>
                                                            {list.nowAddress}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Xã/Phường:&emsp; </strong>
                                                            {list.nowCommune}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Quận/Huyện:&emsp; </strong>
                                                            {list.nowDistrict}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Tỉnh/Thành phố:&emsp; </strong>
                                                            {list.nowCity}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Quốc gia:&emsp; </strong>
                                                            {list.nowNational}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="taikhoan" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Tài khoản ngân hàng</h4></legend>
                                                        <div className="form-group col-md-4" style={{ marginLeft: 20 }}>
                                                            <strong>Số tài khoản :&emsp; </strong>
                                                            {list.ATM}
                                                        </div>
                                                        <div className="form-group col-md-4" style={{ marginLeft: 20 }}>
                                                            <strong>Tên ngân hàng:&emsp; </strong>
                                                            {list.nameBank}
                                                        </div>
                                                        <div className="form-group col-md-4" style={{ marginLeft: 20 }}>
                                                            <strong>Chi nhánh:&emsp; </strong>
                                                            {list.addressBank}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Thuế thu nhập cá nhân</h4></legend>
                                                        {
                                                            (typeof list.Tax !== 'undefined' && list.Tax.length !== 0) ?
                                                                list.Tax.map((x, index) => (
                                                                    <div key={index}>
                                                                        <div className="form-group" style={{ marginLeft: 20 }}>
                                                                            <strong>Mã số thuế:&emsp; </strong>
                                                                            {x.numberTax}
                                                                        </div>
                                                                        <div className="form-group" style={{ marginLeft: 20 }}>
                                                                            <strong>Người đại diện:&emsp; </strong>
                                                                            {x.userTax}
                                                                        </div>
                                                                        <div className="form-group" style={{ marginLeft: 20 }}>
                                                                            <strong>Ngày hoạt động:&emsp; </strong>
                                                                            {x.startDate}
                                                                        </div>
                                                                        <div className="form-group" style={{ marginLeft: 20 }}>
                                                                            <strong>Quản lý bởi:&emsp; </strong>
                                                                            {x.unitTax}
                                                                        </div>
                                                                    </div>
                                                                )) : 
                                                                <div>
                                                                    <div className="form-group" style={{ marginLeft: 20 }}>
                                                                        <strong>Mã số thuế:&emsp; </strong>
                                                                    </div>
                                                                    <div className="form-group" style={{ marginLeft: 20 }}>
                                                                        <strong>Người đại diện:&emsp; </strong>
                                                                    </div>
                                                                    <div className="form-group" style={{ marginLeft: 20 }}>
                                                                        <strong>Ngày hoạt động:&emsp; </strong>
                                                                    </div>
                                                                    <div className="form-group" style={{ marginLeft: 20 }}>
                                                                        <strong>Quản lý bởi:&emsp; </strong>
                                                                    </div>
                                                                </div>}
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="bangcap" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Bằng cấp</h4></legend>
                                                        <table className="table table-bordered " >
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: "18%" }}>Tên bằng</th>
                                                                    <th style={{ width: "18%" }}>Nơi đào tạo</th>
                                                                    <th style={{ width: "13%" }}>Năm tốt nghiệp</th>
                                                                    <th style={{ width: "15%" }}>Xếp loại</th>
                                                                    <th style={{ width: "30%" }}>File đính kèm</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (typeof list.certificate === 'undefined' || list.certificate.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                                        list.certificate.map((x, index) => (
                                                                            <tr key={index}>
                                                                                <td>{x.nameCertificate}</td>
                                                                                <td>{x.addressCertificate}</td>
                                                                                <td>{x.yearCertificate}</td>
                                                                                <td>{x.typeCertificate}</td>
                                                                                <td><a href={x.urlCertificate ? x.urlCertificate : "#abc"}><u>{x.urlCertificate ? x.nameCertificate : ""}</u></a></td>
                                                                            </tr>
                                                                        ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                </div>
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Chứng chỉ</h4></legend>
                                                        <table className="table table-bordered " >
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: "22%" }}>Tên chứng chỉ</th>
                                                                    <th style={{ width: "22%" }}>Nơi cấp</th>
                                                                    <th style={{ width: "9%" }}>Ngày cấp</th>
                                                                    <th style={{ width: "12%" }}>Ngày hết hạn</th>
                                                                    <th style={{ width: "30%" }}>File đính kèm</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (typeof list.certificateShort === 'undefined' || list.certificateShort.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                                        list.certificateShort.map((x, index) => (
                                                                            <tr key={index}>
                                                                                <td>{x.nameCertificateShort}</td>
                                                                                <td>{x.unit}</td>
                                                                                <td>{x.startDate}</td>
                                                                                <td>{x.endDate}</td>
                                                                                <td><a href={x.urlCertificateShort ? x.urlCertificateShort : "#abc"}><u>{x.urlCertificateShort ? x.nameCertificateShort : ""}</u></a></td>
                                                                            </tr>
                                                                        ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                </div>
                                            </div>

                                        </div>
                                        <div id="kinhnghiem" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Trình độ học vấn</h4></legend>
                                                        <div className="form-group">
                                                            <strong>Trình độ văn hoá:&emsp; </strong>
                                                            {list.cultural}
                                                        </div>
                                                        <div className="form-group" >
                                                            <strong>Trình độ ngoại ngữ:&emsp; </strong>
                                                            {list.foreignLanguage}
                                                        </div>
                                                        <div className="form-group">
                                                            <strong>Trình độ chuyên môn:&emsp; </strong>
                                                            {list.educational}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Kinh nghiệm làm việc</h4></legend>
                                                        <table className="table table-bordered table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '14%' }}>Từ tháng/năm</th>
                                                                    <th style={{ width: '14%' }}>Đến tháng/năm</th>
                                                                    <th>Đơn vị công tác</th>
                                                                    <th style={{ width: '25%' }}>Chức vụ</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (typeof list.experience === 'undefined' || list.experience.length === 0) ? <tr><td colSpan={4}><center> Không có dữ liệu</center></td></tr> :
                                                                        list.experience.map((x, index) => (
                                                                            <tr key={index}>
                                                                                <td>{x.startDate}</td>
                                                                                <td>{x.endDate}</td>
                                                                                <td>{x.unit}</td>
                                                                                <td>{x.position}</td>
                                                                            </tr>

                                                                        ))
                                                                }

                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                </div>


                                            </div>

                                        </div>
                                        <div id="hopdong" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Hợp đồng lao động</h4></legend>
                                                        <table className="table table-bordered " >
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: "25%" }}>Tên hợp đồng</th>
                                                                    <th style={{ width: "13%" }}>Loại hợp đồng</th>
                                                                    <th style={{ width: "14%" }}>Ngày có hiệu lực</th>
                                                                    <th style={{ width: "13%" }}>Ngày hết hạn</th>
                                                                    <th style={{ width: "30%" }}>File đính kèm</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (typeof list.contract === 'undefined' || list.contract.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                                        list.contract.map((x, index) => (
                                                                            <tr key={index}>
                                                                                <td>{x.nameContract}</td>
                                                                                <td>{x.typeContract}</td>
                                                                                <td>{x.startDate}</td>
                                                                                <td>{x.endDate}</td>
                                                                                <td><a href={x.urlContract ? x.urlContract : "#abc"}><u>{x.urlContract ? x.nameContract : ""}</u></a></td>
                                                                            </tr>
                                                                        ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                </div>
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Quá trình đào tạo</h4></legend>
                                                        <table className="table table-bordered " >
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '20%' }}>Tên khoá học</th>
                                                                    <th style={{ width: '13%' }}>Ngày bắt đầu</th>
                                                                    <th style={{ width: '13%' }}>Ngày kết thúc</th>
                                                                    <th style={{ width: '20%' }}>Nơi đào tạo</th>
                                                                    <th style={{ width: '%12' }}>Loại đào tạo</th>
                                                                    <th style={{ width: '17%' }}>Trạng thái</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (typeof list.course === 'undefined' || list.course.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                                        list.course.map((x, index) => (
                                                                            <tr key={index}>
                                                                                <td>{x.nameCourse}</td>
                                                                                <td>{x.startDate}</td>
                                                                                <td>{x.endDate}</td>
                                                                                <td>{x.typeCourse}</td>
                                                                                <td>{x.unit}</td>
                                                                                <td>{x.status}</td>
                                                                            </tr>
                                                                        ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="baohiem" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Bảo hiểm y tế</h4></legend>
                                                        <div className="form-group col-md-4" >
                                                            <strong>Mã số BHYT:&emsp; </strong>
                                                            {list.numberBHXH}
                                                        </div>
                                                        <div className="form-group col-md-4" >
                                                            <strong>Ngày có hiệu lực:&emsp; </strong>
                                                            {list.startDateBHYT}
                                                        </div>
                                                        <div className="form-group col-md-4" >
                                                            <strong>Ngày hết hạn:&emsp; </strong>
                                                            {list.endDateBHYT}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Bảo hiểm xã hội</h4></legend>
                                                        <div className="form-group">
                                                            <strong>Mã số BHXH:&emsp; </strong>
                                                            {list.numberBHXH}
                                                        </div>
                                                        <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>Quá trình đóng bảo hiểm xã hội:</h4>
                                                        <table className="table table-bordered " >
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: "16%" }}>Từ tháng</th>
                                                                    <th style={{ width: "16%" }}>Đến thánh</th>
                                                                    <th style={{ width: "30%" }}>Chức vụ</th>
                                                                    <th style={{ width: "30%" }}>Đơn vị công tác</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    (typeof list.BHXH === 'undefined' || list.BHXH.length === 0) ? <tr><td colSpan={4}><center> Không có dữ liệu</center></td></tr> :
                                                                        list.BHXH.map((x, index) => (
                                                                            <tr key={index}>
                                                                                <td>{x.startDate}</td>
                                                                                <td>{x.endDate}</td>
                                                                                <td>{x.position}</td>
                                                                                <td>{x.unit}</td>
                                                                            </tr>
                                                                        ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="khenthuong" className="tab-pane">
                                            <div className="box-body">
                                                <fieldset className="scheduler-border">
                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Khen thưởng</h4></legend>
                                                    <table className="table table-bordered" >
                                                        <thead>
                                                            <tr>
                                                                <th>Số quyết định</th>
                                                                <th>Ngày quyết định</th>
                                                                <th>Cấp ra quyết định</th>
                                                                <th>Hình thức khen thưởng</th>
                                                                <th style={{ width: "15%" }}>Thành tích (lý do)</th>
                                                            </tr>

                                                        </thead>
                                                        <tbody>

                                                        </tbody>
                                                    </table>
                                                </fieldset>
                                                <fieldset className="scheduler-border">
                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Kỷ luật</h4></legend>
                                                    <table className="table table-bordered" >
                                                        <thead>
                                                            <tr>
                                                                <th>Số quyết định</th>
                                                                <th>Ngày có hiệu lực</th>
                                                                <th>Ngày hết hiệu lực</th>
                                                                <th>Cấp ra quyết định</th>
                                                                <th>Hình thức Kỷ luật</th>
                                                                <th style={{ width: "15%" }}>Lý do kỷ luật</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                        </tbody>
                                                    </table>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div id="historySalary" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-sm-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Lịch sử tăng giảm lương</h4></legend>
                                                        <table className="table table-bordered" >
                                                            <thead>
                                                                <tr>
                                                                    <th>Tháng</th>
                                                                    <th style={{ width: "50%" }}>Lương</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Thông tin nghỉ phép</h4></legend>
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th >Từ ngày</th>
                                                                    <th >Đến ngày</th>
                                                                    <th>Lý do</th>
                                                                    <th>Trạng thái</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                            </tbody>
                                                        </table>
                                                    </fieldset>

                                                </div>
                                            </div>
                                        </div>
                                        <div id="tailieu" className="tab-pane">
                                            <div className="box-body">
                                                <div className="form-group" style={{ paddingLeft: 15 }}>
                                                    <strong>Mã hồ sơ:&emsp;</strong>
                                                    {list.numberFile}
                                                </div>
                                                <div className="col-sm-12">
                                                    <h4 style={{ paddingLeft: 0, fontSize: 16 }}>Danh sách tài liệu đính kèm:</h4>
                                                    <table className="table table-bordered " >
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "22%" }}>Tên tài liệu</th>
                                                                <th style={{ width: "22%" }}>Mô tả</th>
                                                                <th style={{ width: "9%" }}>Số lượng</th>
                                                                <th style={{ width: "12%" }}>Trạng thái</th>
                                                                <th style={{ width: "30%" }}>File đính kèm</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                (typeof list.file === 'undefined' || list.file.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                                    list.file.map((x, index) => (
                                                                        <tr key={index}>
                                                                            <td>{x.nameFile}</td>
                                                                            <td>{x.discFile}</td>
                                                                            <td>{x.number}</td>
                                                                            <td>{x.status}</td>
                                                                            <td><a href={x.urlFile ? x.urlFile : "#abc"}><u>{x.urlFile ? x.nameFile : ""}</u></a></td>
                                                                        </tr>
                                                                    ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}


export { ModalDetailEmployee };