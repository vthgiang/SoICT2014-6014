import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { translate } from 'react-redux-multilingual/lib/utils';
import { ConfirmNotification, DataTableSetting, DialogModal } from '../../../../common-components';
import { formatFunction } from '../../common';
import { CrmCustomerActions } from '../../customer/redux/actions';
import { CrmGroupActions } from '../../group/redux/actions';
import PromotionAddForm from './promotionAddForm';
import PromotionEditForm from './promotionEditForm';

function CustomerPromotionInfoForm(props) {
    const { customerId, getLoyalCustomersData } = props;
    const { crm } = props;

    // Khuyến mãi cá nhân
    useEffect(() => {
        props.getCustomerById(customerId)
    }, [customerId])

    let customer;
    if (crm && crm.customers && crm.customers.customerById) customer = crm.customers.customerById;
    if (customer && customer._id != customerId) {
        customer._id = customerId;
        props.getCustomerById(customerId)
    }

    /*
    // Đoạn này thêm vào chỉ để test api getCustomerPromotions và api usePromotion, ko liên quan đến component này
    useEffect(() => {
        customerId && props.getCustomerPromotions(customerId);
        //customerId && props.usePromotion("62282c0ad76f84272cfa24b8", { "code":"KM001"} );
        //customerId && props.usePromotion("62282c0ad76f84272cfa24b8", { "code":"KMN001"} );
    }, [customerId])
    */

    // Khuyến mãi nhóm 
    useEffect(() => {
        let groupId;
        if (crm && crm.customers && crm.customers.customerById) {
            groupId = crm.customers.customerById.customerGroup._id;
            if (groupId) props.getGroupById(groupId);
        }
    }, [crm.customers.customerById])
    
    let group;
    if (crm && crm.groups && crm.groups.groupById) {
        group = crm.groups.groupById.groupById;

        let promotions =[];
        if (group.promotions) {
            const groupPromotions = group.promotions;
            groupPromotions.forEach(x => {
                if (!x.exceptCustomer ) {
                    promotions = [...promotions, x];
                } else {
                    let check = true;
                    x.exceptCustomer.map((o) => {
                        if (o._id == customerId) check = false;
                    })
                    if (check) promotions = [...promotions, x];             
                }
            })
        }
        group.promotions = promotions;
    }

    // Xử lí các sự kiện 
    const [promotionEdit, setPromotionEdit] = useState();
    const handleEditPromotion = async (promoEdit) => {
        await setPromotionEdit(promoEdit);
        window.$('#modal-crm-customer-promotion-edit').modal('show')
    }
    const deletePromotion = (code) => {
        props.deletePromotion(customerId, { code: code })
    }
    const formatPromotionStatus = (promotion) => {
        const now = new Date();
        //console.log(new Date(promotion.expirationDate),new Date(promotion.expirationDate).getMilliseconds());
        //console.log('now',now,now.getMilliseconds());

        if (now > new Date(promotion.expirationDate)) return "Đã hết hạn";
        if (promotion.status == 1) return "Chưa sử dụng";
        return "Đã sử dụng";
    }
    
    const formatPromotionStatus2 = (promotion) => {
        const now = new Date();
        //console.log(new Date(promotion.expirationDate),new Date(promotion.expirationDate).getMilliseconds());
        //console.log('now',now,now.getMilliseconds());

        if (now > new Date(promotion.expirationDate)) return "Đã hết hạn";

        let checkUsed = true; // Kiểm tra xem khách hàng đã từng sử dụng khuyến mại chưa 
        // true -> chưa từng
        if (promotion.customerUsed) {
            promotion.customerUsed.map((o) => {
                if (o.toString() === customerId.toString()) {
                    checkUsed = false;    
                }                
            })
        }
        if (checkUsed) return "Đã sử dụng";
        return "Chưa sử dụng";
    }
    return (
        <React.Fragment>
        <DialogModal
            modalID="modal-customer-promotion-info" isLoading={false}
            formID="form-customer-promotion-info"
            title={`Danh sách khuyến mãi cá nhân của khách hàng`}
            size={75}
            disableSubmit={true}
        >
            {customer && <PromotionAddForm customer={customer} customerId={customer._id} getLoyalCustomersData={getLoyalCustomersData} />}
            {promotionEdit && <PromotionEditForm customerId={customer._id} promotion={promotionEdit} />}
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
                            <tr key={o.code}>

                                <td>{index + 1}</td>
                                <td>{o.code}</td>
                                <td>{o.value}</td>
                                <td>{o.minimumOrderValue}</td>
                                <td>{o.promotionalValueMax}</td>
                                <td>{o.description}</td>
                                <td>{formatFunction.formatDate(o.expirationDate)}</td>
                                <td>{formatPromotionStatus(o)}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="text-yellow" title="Chỉnh sửa khuyến mãi khách hàng" onClick={() => handleEditPromotion(o)} ><i className="material-icons">edit</i></a>
                                    <ConfirmNotification
                                        icon="question"
                                        title="Xóa khuyến mãi khách hàng"
                                        content="<h3>Xóa khuyến mãi khách hàng</h3>"
                                        name="delete"
                                        className="text-red"
                                        func={() => deletePromotion(o.code)}
                                    />


                                </td>
                            </tr>
                        ))

                    }

                </tbody>
            </table>

            <h4 style={{ textAlign: 'center'}}><b>Danh sách khuyến mãi nhóm có thể sử dụng</b></h4>
            {/** Bảng hiển thị khuyến mãi nhóm */} 
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
                        group && group.promotions.map((o, index) => (
                            <tr key={o.code}>

                                <td>{index + 1}</td>
                                <td>{o.code}</td>
                                <td>{o.value}</td>
                                <td>{o.minimumOrderValue}</td>
                                <td>{o.promotionalValueMax}</td>
                                <td>{o.description}</td>
                                <td>{formatFunction.formatDate(o.expirationDate)}</td>
                                <td>{formatPromotionStatus2(o)}</td>
                            </tr>
                        ))

                    }

                </tbody>
            </table>
        </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getCustomerById: CrmCustomerActions.getCustomer,
    deletePromotion: CrmCustomerActions.deletePromotion,
    getGroupById: CrmGroupActions.getGroup,
    getCustomerPromotions: CrmCustomerActions.getCustomerPromotions,
    usePromotion: CrmCustomerActions.usePromotion
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CustomerPromotionInfoForm));
