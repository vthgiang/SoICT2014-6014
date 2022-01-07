import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DialogModal } from '../../../../common-components';
import { formatFunction } from '../../common';
import promotionAddForm from './promotionAddForm';
import promotionEditForm from './promotionEditForm';

function GroupPromotionInfoForm (props) {
    const { groupId, getGroupData, crm } = props;
    useEffect(()=> {
        props.getGroup(groupId)
    },[]);

    let group;
    if (crm && crm.groups && crm.groups.groupById) {}
    
    const [groupPromotionEdit, setGroupPromotionEdit] = useState();
    const [groupPromotionEditIndex,setGroupPromotionEditIndex] = useState();
    const handleEditPromotion = async ( promoEdit, promoIndex) => {
        await setGroupPromotionEdit(promoEdit);
        await setGroupPromotionEditIndex(promoIndex);
        window.$('#modal-crm-group-promotion-edit').modal('show');
    }

    const deletePromotion = (index) => {
        props.deletePromotion(groupId, { promoindex: index});
    }

    const formatPromotionStatus = (promotion) => {
        const now = new Date();
        console.log(new Date(promotion.expirationDate), new Date(promotion.expirationDate).getMilliseconds());
        console.log('now', now, now.getMilliseconds());

        if (now > new Date(promotion.expirationDate)) return "Đã hết hạn";
        if ( promotion.status == 1) return " Chưa sử dụng";
        return "Đã sử dụng";
    }
    return (
        <DialogModal
            modalID="modal-group-promotion-info" isLoading={false}
            formID="form-group-promotion-info"
            title={`Danh sách khuyến mãi của nhóm khách hàng`}
            size={75}
            disableSubmit={true}
        >      
        </DialogModal>
    )
}

/* add 1-> 51 */