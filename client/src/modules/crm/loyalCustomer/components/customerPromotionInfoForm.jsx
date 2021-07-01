import React from 'react';
import { translate } from 'react-redux-multilingual/lib/utils';
import { DataTableSetting, DialogModal } from '../../../../common-components';
import { formatFunction } from '../../common';
import PromotionAddForm from './promotionAddForm';

function CustomerPromotionInfoForm(props) {
    const { customer } = props;
    return (
        <DialogModal
            modalID="modal-customer-promotion-info" isLoading={false}
            formID="form-customer-promotion-info"
            title={`Danh sách khuyến mãi của khách hàng`}
            size={75}
            disableSubmit={true}
        >
             <PromotionAddForm customer ={customer} customerId={customer._id}  />
            {/* Bảng hiển thị thông tin khách hàng thân thiết */}
            <table className="table table-hover table-striped table-bordered" id="customer-promotion-info" style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>{"Số thứ tự"}</th>
                        <th>{"Giá trị khuyến mãi (%)"}</th>
                        <th>{"Giá trị đơn hàng tối thiểu (VNĐ)"}</th>
                        <th>{"Số tiền giảm tối đa (VNĐ)"}</th>
                        <th>{"Mô tả"}</th>
                        <th>{"Hạn sử dụng"}</th>
                        <th>{"Trạng Thái khuyến mãi"}</th>
                        <th style={{ width: "120px" }}>
                            {'Hành động'}
                            <DataTableSetting
                                columnArr={[
                                    'Số thứ tự',
                                    'Giá trị khuyến mãi (%)',
                                    'Giá trị đơn hàng tối thiểu (VNĐ)',
                                    'Số tiền giảm tối đa (VNĐ)',
                                    "Mô tả",
                                    "Hạn sử dụng",
                                    'Trạng Thái khuyến mãi'
                                ]}
                                tableId="customer-promotion-info"
                            />
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        customer && customer.promotions.map((o, index) => (
                            <tr >

                                <td>{index + 1}</td>
                                <td>{o.value}</td>
                                <td>{o.minimumOrderValue}</td>
                                <td>{o.promotionalValueMax}</td>
                                <td>{o.description}</td>
                                <td>{formatFunction.formatDate(o.expirationDate)}</td>
                                <td>{o.status ? (o.status == 1 ? 'Chưa sử dụng' : 'Đã sử dụng') : ''}</td>
                                {/* <td style={{ textAlign: 'center' }}>
                                    <a className="text-green"
                                        onClick={() => handleCreateCareAcrion(o.customer._id)}
                                    ><i className="material-icons">add_comment</i></a>
                                </td> */}
                            </tr>
                        ))

                    }

                </tbody>
            </table>


        </DialogModal>
    );
}

export default CustomerPromotionInfoForm;