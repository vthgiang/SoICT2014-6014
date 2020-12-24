import React from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting } from '../../../../../common-components';

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