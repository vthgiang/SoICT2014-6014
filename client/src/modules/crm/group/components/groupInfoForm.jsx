import React from 'react';
import PropTypes from 'prop-types';
import { DialogModal } from '../../../../common-components';

GroupInfoForm.propTypes = {

};

function GroupInfoForm(props) {
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-info-group"
                formID="form-info-group"
                //title={translate("crm.customer.order")}
                size={75}
            //   func={this.save}
            // disableSubmit={!this.isFormValidated()}
            >
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin nhóm khách hàng"}
                    </legend>
                    <div style={{ padding: '0' }, { margin: '10px' }}>
                        <div className="row">
                            {/* Mã đơn hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Mã nhóm khách hàng</strong>
                                        <div className="col-sm-8">
                                            <span>NH1402-19</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tên khách hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Tên nhóm  khách hàng</strong>
                                        <div className="col-sm-8">
                                            <span>Nhóm khách hàng bán buôn</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* Mã đơn hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Mô tả </strong>
                                        <div className="col-sm-8">
                                            <span>Nhóm khách hàng bán buôn</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tên khách hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Số lượng khách hàng</strong>
                                        <div className="col-sm-8">
                                            <span>30</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* Mã đơn hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Người tạo nhóm </strong>
                                        <div className="col-sm-8">
                                            <span>Nguyễn Văn Danh</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tên khách hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Ngày tạo</strong>
                                        <div className="col-sm-8">
                                            <span>24/03/2021</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* Mã đơn hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Chỉnh sửa lần cuối </strong>
                                        <div className="col-sm-8">
                                            <span>9:00 AM 24/03/2021</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tên khách hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Người chỉnh sửa</strong>
                                        <div className="col-sm-8">
                                            <span>Nguyễn Văn Danh</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     

                    </div>


                </fieldset>
            </DialogModal>
        </React.Fragment>
    );
}

export default GroupInfoForm;