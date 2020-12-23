import React from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

const FamilyMemberTab = ({ id }) => {
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
                    <div className="row">
                        <table className="table table-hover table-striped table-bordered" id="table-employee-family-member">
                            <thead>
                                <tr>
                                    <th rowSpan={2}>STT</th>
                                    <th rowSpan={2}>Họ và tên</th>
                                    <th rowSpan={2}>Mã số BHXH</th>
                                    <th rowSpan={2}>Ngày sinh</th>
                                    <th rowSpan={2}>Giới tính</th>
                                    <th rowSpan={2}>Quốc tịch</th>
                                    <th rowSpan={2}>Dân tộc</th>
                                    <th colSpan={3} style={{ width: '300px' }}>Nơi cấp GKS</th>
                                    <th rowSpan={2}>Hành động</th>
                                </tr>
                                <tr>
                                    <th>Tỉnh/TP</th>
                                    <th>Quận/Huyện</th>
                                    <th>Địa chỉ</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default connect()(withTranslate(FamilyMemberTab));