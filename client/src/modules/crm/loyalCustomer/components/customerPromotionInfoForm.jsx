import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { translate } from 'react-redux-multilingual/lib/utils';
import { ConfirmNotification, DataTableSetting, DialogModal } from '../../../../common-components';
import { formatFunction } from '../../common';
import { CrmCustomerActions } from '../../customer/redux/actions';
import PromotionAddForm from './promotionAddForm';
import PromotionEditForm from './promotionEditForm';


function CustomerPromotionInfoForm(props) {
    const { customerId, getLoyalCustomersData } = props;
    useEffect(() => {
        props.getCustomerById(customerId)
    }, [])
    const { crm } = props;
    let customer;
    if (crm && crm.customers && crm.customers.customerById) customer = crm.customers.customerById;
    if (customer && customer._id != customerId) {
        customer._id = customerId;
        props.getCustomerById(customerId)
    }
    const [promotionEdit, setPromotionEdit] = useState();
    const [promotionEditIndex, setPromotionEditIndex] = useState();
    const handleEditPromotion = async (promoEdit, promoIndex) => {
        await setPromotionEdit(promoEdit);
        await setPromotionEditIndex(promoIndex);
        window.$('#modal-crm-customer-promotion-edit').modal('show')
    }
    const deletePromotion = (index) => {
        props.deletePromotion(customerId, { promoIndex: index })
    }
    const formatPromotionStatus = (promotion) => {
        const now = new Date();
        console.log(new Date(promotion.expirationDate),new Date(promotion.expirationDate).getMilliseconds());
        console.log('now',now,now.getMilliseconds());

        if (now > new Date(promotion.expirationDate)) return "Đã hết hạn";
        if (promotion.status == 1) return "Chưa sử dụng";
        return "Đã sử dụng";
    }
    return (
        <DialogModal
            modalID="modal-customer-promotion-info" isLoading={false}
            formID="form-customer-promotion-info"
            title={`Danh sách khuyến mãi của khách hàng`}
            size={75}
            disableSubmit={true}
        >
            {customer && <PromotionAddForm customer={customer} customerId={customer._id} getLoyalCustomersData={getLoyalCustomersData} />}
            {promotionEdit && promotionEditIndex && <PromotionEditForm customerId={customer._id} promotion={promotionEdit} promotionIndex={promotionEditIndex} />}
            {/* Bảng hiển thị thông tin khách hàng thân thiết */}
            <table className="table table-hover table-striped table-bordered" id="customer-promotion-info" style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>{"Số thứ tự"}</th>
                        <th>{"Mã khuyến mãi"}</th>
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
                                    'Mã khuyến mãi',
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
                                <td>{o.code}</td>
                                <td>{o.value}</td>
                                <td>{o.minimumOrderValue}</td>
                                <td>{o.promotionalValueMax}</td>
                                <td>{o.description}</td>
                                <td>{formatFunction.formatDate(o.expirationDate)}</td>
                                <td>{formatPromotionStatus(o)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="text-yellow" title="Chỉnh sửa khuyến mãi khách hàng" onClick={() => handleEditPromotion(o, index + 1)} ><i className="material-icons">edit</i></a>
                                    <ConfirmNotification
                                        icon="question"
                                        title="Xóa khuyến mãi khách hàng"
                                        content="<h3>Xóa khuyến mãi khách hàng</h3>"
                                        name="delete"
                                        className="text-red"
                                        func={() => deletePromotion(index)}
                                    />


                                </td>
                            </tr>
                        ))

                    }

                </tbody>
            </table>


        </DialogModal>
    );
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getCustomerById: CrmCustomerActions.getCustomer,
    deletePromotion: CrmCustomerActions.deletePromotion

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CustomerPromotionInfoForm));

/* Thêm 58, 70,90*/