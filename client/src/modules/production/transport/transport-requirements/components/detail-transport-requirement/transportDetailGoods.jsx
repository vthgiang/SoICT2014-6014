import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { exampleActions } from '../../redux/actions';
import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";
import { GoodActions} from '../../../../common-production/good-management/redux/actions';
import { validate } from 'uuid';

function TransportDetailGoods(props) {

    const {listGoodsChosen} = props

    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{"Thông tin hàng hóa"}</legend>
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>{"Số thứ tự"}</th>
                                <th>{"Mã sản phẩm"}</th>
                                <th>{"Tên sản phẩm"}</th>
                                <th>{"Số lượng"}</th>
                                <th>{"Khối lượng vận chuyển"}</th>
                                {/* <th>{translate("manufacturing.plan.base_unit")}</th>
                                <th>{translate("manufacturing.plan.quantity_good_inventory")}</th>
                                <th>{translate("manufacturing.plan.quantity")}</th>
                                <th>{translate("table.action")}</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {listGoodsChosen && listGoodsChosen.length === 0 ? (
                                <tr>
                                    {/* <td colSpan={7}>{translate("general.no_data")}</td> */}
                                    <td colSpan={5}>{"Không có dữ liệu"}</td>
                                </tr>
                            ) : (
                                listGoodsChosen && listGoodsChosen.length !== 0 &&
                                listGoodsChosen.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.good?.code}</td>
                                            <td>{x.good?.name}</td>
                                            <td>{x.quantity}</td>
                                            <td>{x.volume}</td>
                                            {/* <td>
                                                <a
                                                    href="#abc"
                                                    className="edit"
                                                    title={translate("general.edit")}
                                                    onClick={() => this.handleEditGood(x, index)}
                                                >
                                                    <i className="material-icons"></i>
                                                </a>
                                                <a
                                                    href="#abc"
                                                    className="delete"
                                                    title={translate("general.delete")}
                                                    onClick={() => this.handleDeleteGood(index)}
                                                >
                                                    <i className="material-icons"></i>
                                                </a>
                                            </td> */}
                                        </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                
                </div>
            </div>
        </fieldset>
        </div>

    
    );
}

function mapState(state) {
}

const actions = {
}

const connectedTransportDetailGoods = connect(mapState, actions)(withTranslate(TransportDetailGoods));
export { connectedTransportDetailGoods as TransportDetailGoods };