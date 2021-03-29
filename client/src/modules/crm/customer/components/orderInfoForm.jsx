import React from 'react';
import PropTypes from 'prop-types';
import { DialogModal } from '../../../../common-components';


function OrderInfoForm(props) {
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-crm-order-info"
                formID="form-crm-order-info"
                //title={translate("crm.customer.order")}
                size={75}
            //   func={this.save}
            // disableSubmit={!this.isFormValidated()}
            >
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin đơn hàng"}
                    </legend>
                    <div style ={{padding:'0'},{margin :'10px'}}>
                    <div className="row">
                        {/* Mã đơn hàng */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">Mã đơn hàng</strong>
                                    <div className="col-sm-8">
                                        <span>DH1402-19</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tên khách hàng */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">Tên khách hàng</strong>
                                    <div className="col-sm-8">
                                        <span>Nguyễn Văn Thái</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Danh sách sản phẩm */}
                        <div className="col-sm-12">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-2">Danh sách sản phẩm : </strong>
                                    <div className="col-sm-10" style={{margin:'20px 0 30px 0'}}>

                                                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <label>Tên sản phẩm</label>
                                                </div>
                                                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <label>Số lượng</label>
                                                </div>
                                                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <label>Giá tiền</label>
                                                </div>
                                            
                                            
                                                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <span>Sữa th milk</span>
                                                </div>
                                                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <span>100</span>
                                                </div>
                                                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                                    <span>1.000.000</span>
                                                </div>
                                          
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* Tổng tiền */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Tổng giá trị đơn hàng</strong>
                                        <div className="col-sm-8">
                                            <span>12.000.000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*  */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Trạng thái đơn hàng</strong>
                                        <div className="col-sm-8">
                                            <span>Đang giao hàng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* Người tạo đơn hàng*/}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Người tạo đơn hàng</strong>
                                        <div className="col-sm-8">
                                            <span>Nguyễn Văn Danh</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian tạo đơn */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Ngày tạo đơn hàng</strong>
                                        <div className="col-sm-8">
                                            <span>9:00 AM 19/03/2021</span>
                                        </div>
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

export default OrderInfoForm;