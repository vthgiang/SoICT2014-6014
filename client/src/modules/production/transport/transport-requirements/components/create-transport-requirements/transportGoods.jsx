import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { exampleActions } from '../../redux/actions';
import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";

function TransportGoods(props) {
    // const { translate, example, page, perPage } = props;

    // const { exampleName, description, exampleNameError } = state;

    // const isFormValidated = () => {
    //     if (!exampleNameError.status) {
    //         return false;
    //     }
    //     return true;
    // }
    let goods = props.goods;
    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <fieldset className="scheduler-border" style={{ padding: 10 }}>
            <legend className="scheduler-border">Thông tin hàng hóa</legend>
                
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                <div className={`form-group`}>
                    <label>
                        Sản phẩm
                        <span className="attention"> * </span>
                    </label>
                    {/* <SelectBox
                        id={`select-good-code-quote`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={good}
                        items={this.getGoodOptions()}
                        onChange={handleGoodChange}
                        multiple={false}
                    /> */}
                </div>

                <div className="form-group">
                    <label>
                        Tên sản phẩm
                        <span className="attention"> * </span>
                    </label>
                    <input type="text" className="form-control"/>
                </div>
            </div>            

                {/* Hiển thị bảng */}
                <table className="table table-bordered not-sort">
                    <thead>
                        <tr>
                            <th title={"STT"}>STT</th>
                            <th title={"Mã sản phẩm"}>Mã sản phẩm</th>
                            <th title={"Tên sản phẩm"}>Tên sản phẩm</th>
                            <th title={"Đơn vị tính"}>Đ/v tính</th>
                            <th title={"Giá niêm yết"}>Giá niêm yết (vnđ)</th>
                            <th title={"giá tính tiền"}>giá tính tiền (vnđ)</th>
                            <th title={"Số lượng"}>Số lượng</th>
                            <th title={"Khối lượng vận chuyển"}>Khối lượng vận chuyển</th>
                            <th title={"Khuyến mãi"}>Khuyến mãi</th>
                            <th title={"Thành tiền"}>Thành tiền</th>
                            <th title={"Thuế"}>Thuế</th>
                            <th title={"Tổng tiền"}>Tổng tiền</th>
                            <th>Cam kết chất lượng</th>
                            <th title={"Ghi chú"}>Ghi chú</th>
                            <th title={"Hành động"}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(props.goods && props.goods.length !== 0) &&
                            props.goods.map((good, index) => (
                                <tr key={index}>
                                    {/* <td>{index + 1 + (page - 1) * perPage}</td> */}
                                    <td>sssssss</td>
                                    <td>{good.good.code?good.good.code:""}</td>
                                    <td>{good.good.name?good.good.name:""}</td>
                                    {/* <td>{example.description}</td> */}
                                    {/* <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_example.delete')}
                                            data={{
                                                id: example._id,
                                                info: example.exampleName
                                            }}
                                            func={handleDelete}
                                        />
                                    </td> */}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </fieldset>
        </div>
    );
}

function mapState(state) {
    // const bills = state.bills.listPaginate;
    // return { bills }
}

const actions = {
    // getBillsByType: BillActions.getBillsByType,
    // getCustomers: CrmCustomerActions.getCustomers,
}

const connectedTransportGoods = connect(mapState, actions)(withTranslate(TransportGoods));
export { connectedTransportGoods as TransportGoods };