import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DialogModal, ButtonModal } from '../../../../../common-components';

const FamilyMemberTab = ({ id }) => {
    let [familyMembers, setFamilyMembers] = useState([]);

    const _save = () => {

    }

    const _openModalAddNewFamilyMembers = () => {
        setFamilyMembers([...familyMembers, {}]);
        window.$('#modal-add-family-members').modal('show');
    }

    const _handleChange = (e) => {
        let index = familyMembers.length - 1;
        console.log("length", index)
        let { name, value } = e.target;
        familyMembers[index][name] = value;
        setFamilyMembers(familyMembers);
    }

    console.log("familyMembers", familyMembers)

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <fieldset className="scheduler-border" style={{ margin: '10px 20px' }}>
                    <legend className="scheduler-border" >
                        <h4 className="box-title">Phụ luc: Thành viên hộ gia đình của NLĐ</h4>
                    </legend>
                    <div className="row">
                        {/* họ và tên chủ hộ */}
                        <div className="form-group col-md-4">
                            <label >Họ và tên chủ hộ <span className="text-red">*</span></label>
                            <input type="text" className="form-control" />
                        </div>
                        {/* Loại giấy tờ */}
                        <div className="form-group col-md-4">
                            <label >Loại giấy tờ</label>
                            <input type="text" className="form-control" />
                        </div>
                        {/* Số sổ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Số sổ hộ khẩu</label>
                            <input type="text" className="form-control" />
                        </div>

                        {/* Tỉnh/TP */}
                        <div className="form-group col-md-4">
                            <label >Tỉnh/TP <span className="text-red">*</span></label>
                            <input type="text" className="form-control" />
                        </div>
                        {/* Loại giấy tờ */}
                        <div className="form-group col-md-4">
                            <label >Quận/huyện <span className="text-red">*</span></label>
                            <input type="text" className="form-control" />
                        </div>
                        {/* Số sổ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Phường/xã <span className="text-red">*</span></label>
                            <input type="text" className="form-control" />
                        </div>

                        {/* Địa chỉ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Địa chỉ hộ khẩu</label>
                            <input type="text" className="form-control" />
                        </div>
                        {/* Số điện thoại */}
                        <div className="form-group col-md-4">
                            <label >Số điện thoại</label>
                            <input type="text" className="form-control" />
                        </div>
                        {/* Số sổ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Mã số hộ gia đình</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="scheduler-border" style={{ margin: '10px 20px' }}>
                    <legend className="scheduler-border" >
                        <h4 className="box-title">Kê khai đầy đủ thành viên hộ gia đình trong sổ hộ khẩu hoặc sổ tạm trú</h4>
                    </legend>

                    {/* Thêm mới thông tin thành viên hộ gia đình của chủ hộ */}
                    <button className="btn btn-success" style={{ cursor: 'pointer' }} onClick={_openModalAddNewFamilyMembers}>Thêm mới</button>
                    <DialogModal
                        modalID="modal-add-family-members"
                        formID="form-add-family-members"
                        title="Thêm thành viên trong hộ gia đình"
                        func={_save} size={75}
                    >
                        <form id="form-add-family-members">
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Họ và tên</label>
                                        <input className="form-control" name="name" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Mã số BHXH</label>
                                        <input className="form-control" name="codeSocialInsurance" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Số sổ BHXH</label>
                                        <input className="form-control" name="bookNumberSocialInsurance" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Giới tính</label>
                                        <input className="form-control" name="gender" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Là chủ hộ</label>
                                        <input className="form-control" name="isHeadHousehold" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Quan hệ với chủ hộ</label>
                                        <input className="form-control" name="relationshipWithHeadHousehold" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Ngày sinh</label>
                                        <input className="form-control" name="birth" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>CNSS</label>
                                        <input className="form-control" name="cnss" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Nơi cấp giấy khai sinh</label>
                                        <input className="form-control" name="placeOfBirthCertificate" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Quốc tịch</label>
                                        <input className="form-control" name="nationality" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Dân tộc</label>
                                        <input className="form-control" name="nation" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Số CMND/Hộ chiếu</label>
                                        <input className="form-control" name="numberPassport" onChange={_handleChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>Ghi chú</label>
                                        <textarea className="form-control" name="note" onChange={_handleChange} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </DialogModal>

                    {/* Bảng danh sách thông tin các thành viên trong hộ gia đình */}
                    <div id="container-employee-family-member" className="row">
                        <table className="table table-hover table-striped table-bordered" id="table-employee-family-member">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Mã số BHXH</th>
                                    <th>Số sổ BHXH</th>
                                    <th>Giới tính</th>
                                    <th>Là chủ hộ</th>
                                    <th>Quan hệ với chủ hộ</th>
                                    <th>CNSS</th>
                                    <th>Ngày sinh</th>
                                    <th>Nơi cấp giấy khai sinh</th>
                                    <th>Quốc tịch</th>
                                    <th>Dân tộc</th>
                                    <th>Số CMND/Hộ chiếu</th>
                                    <th>Ghi chú
                                        <DataTableSetting
                                            tableId="table-employee-family-member"
                                            tableContainerId="container-employee-family-member"
                                            tableWidt={1500}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>STT</td>
                                    <td>Họ và tên</td>
                                    <td>Mã số BHXH</td>
                                    <td>Số sổ BHXH</td>
                                    <td>Giới tính</td>
                                    <td>Là chủ hộ</td>
                                    <td>Quan hệ với chủ hộ</td>
                                    <td>CNSS</td>
                                    <td>Ngày sinh</td>
                                    <td>Nơi cấp giấy khai sinh</td>
                                    <td>Quốc tịch</td>
                                    <td>Dân tộc</td>
                                    <td>Số CMND/Hộ chiếu</td>
                                    <td>Ghi chú</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default connect()(withTranslate(FamilyMemberTab));