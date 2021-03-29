import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, SelectBox } from '../../../../common-components';
import OrderInfoForm from './orderInfoForm';

class PurchaseHistoriesInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
handleOrderInfo =()=>{
    window.$('#modal-crm-order-info').modal('show');
}
    render() {

        const { translate } = this.props;
        const { id } = this.props;
        return (
            <div className="tab-pane purchaseHistories" id={id}>
                <div className="box">
                    <div className="box-body qlcv">
                        <OrderInfoForm/>
                        {/* search form */}
                        <div className="form-inline" style={{ marginBottom: '2px' }}>
                            <div className="form-group unitSearch">
                                <label>{'Trạng thái đơn hàng'}</label>
                                {

                                    <SelectBox
                                        id={`customer-group-edit-form`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            ['']
                                        }
                                        value={[""]}
                                        //  onChange={this.handleChangeCustomerGroup}
                                        multiple={false}
                                    />
                                }
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">Mã đơn hàng</label>
                                <input className="form-control" type="text" name="customerCode" oplaceholder={`Mã đơn hàng`} />
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group" >
                                <label>Tìm kiếm</label>
                                <button type="button" className="btn btn-success"
                                //onClick={this.search} 
                                >{'Tìm kiếm'}</button>
                            </div>
                        </div>
                        <table className="table table-hover table-striped table-bordered" id={1} style={{ marginTop: '10px' }}>
                            <thead>
                                <tr>

                                    <th>{'Mã đơn hàng'}</th>
                                    <th>{'Ngày đặt đơn'}</th>
                                    <th>{'Giá trị đơn hàng'}</th>
                                    <th>{'Trạng thái'}</th>
                                    <th style={{ width: "120px" }}>
                                        {translate('table.action')}
                                        <DataTableSetting
                                            columnArr={[
                                                "Mã đơn hàng",
                                                "Ngày đặt đơn",
                                                "Giá trị đơn hàng",
                                                "Trạng thái",
                                            ]}
                                        // setLimit={this.setLimit}
                                        // tableId={tableId}
                                        />
                                    </th>

                                </tr>
                            </thead>
                            <tbody>

                                <td>DH 001</td>
                                <td>1/1/2021</td>
                                <td>100.000 VND</td>
                                <td>Đang giao hàng</td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="text-green" onClick={this.handleOrderInfo}><i className="material-icons">visibility</i></a>
                                </td>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(withTranslate(PurchaseHistoriesInfoForm));