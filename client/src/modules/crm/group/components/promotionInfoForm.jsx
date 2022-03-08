import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DialogModal } from '../../../../common-components';
import { formatFunction } from '../../common';
import PromotionAddForm from './promotionAddForm';
import PromotionEditForm from './promotionEditForm';
import { CrmGroupActions } from '../redux/actions';
import {useSelector} from 'react-redux'

function GroupPromotionInfoForm (props) {
    const { groupPromotionId, crm } = props;
    const [groupPromotionEdit, setGroupPromotionEdit] = useState();
    
    // Gọi API lấy thông tin group, trong đó có promotion của group đó
    useEffect(()=> {
        groupPromotionId && props.getGroupById(groupPromotionId);
    },[props.groupPromotionId]);

    // Gọi Api lấy danh sách các thành viên trong group đó
    useEffect(() => {
        groupPromotionId && props.getMembersGroup(groupPromotionId);
    },[groupPromotionId]);

    let group;
    // Lấy thông tin group từ Store sau khi api trả về bỏ vào store
    if (crm && crm.groups && crm.groups.groupById) {
        if (crm.groups.groupById.groupById) {
            group = crm.groups.groupById.groupById;
        } else {
            group = crm.groups.groupById;
        }
    }

    // Đối với từng khuyến mãi của nhóm -> Tạo danh sách các khách hàng ko được hưởng khuyến mãi
    if (group && group.promotions) {
        group.promotions = group.promotions.map((o) => {
            let listExceptCustomer = "";                    
            o.exceptCustomer.map((e) => {
                listExceptCustomer = listExceptCustomer + e.name + ", "
            });  
            return {...o, listExceptCustomer: listExceptCustomer}
        });
    }

    const handleEditPromotion = async (promoEdit) => {
        await setGroupPromotionEdit(promoEdit);
        window.$('#modal-crm-group-promotion-edit').modal('show');
    }

    const deletePromotion = (groupId, promoDelete) => {
        props.deletePromotion(groupId, promoDelete);
    }

    const getRefreshData = () => {
        props.getGroupById(groupPromotionId);
    }

    return ( 
        <DialogModal
            modalID="modal-group-promotion-info-1" isLoading={crm.groups.isLoading}
            formID="form-group-promotion-info"
            title={`Danh sách khuyến mãi của nhóm khách hàng`}
            size={75}
            disableSubmit={true}
        >    
        {group && <PromotionAddForm groupId={group._id} getRefreshData={() => getRefreshData()}/>}
        {group && groupPromotionEdit && <PromotionEditForm groupId={group._id} groupPromotionEdit={groupPromotionEdit} getRefreshData={() => getRefreshData()}/>}
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
                        <th>{"Ngoại trừ"}</th>
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
                                    'Ngoại trừ'
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
                                <td>{o.listExceptCustomer}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="text-yellow" title="Chỉnh sửa khuyến mãi nhóm khách hàng" onClick={() => handleEditPromotion(o)} ><i className="material-icons">edit</i></a>
                                    <ConfirmNotification
                                        icon="question"
                                        title="Xóa khuyến mãi nhóm khách hàng"
                                        content="<h3>Xóa khuyến mãi nhóm khách hàng</h3>"
                                        name="delete"
                                        className="text-red"
                                        func={() => deletePromotion( group._id, o)}
                                    />
                                </td>
                            </tr>
                        ))

                    }

                </tbody>
            </table>
        </DialogModal>
    )
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getGroupById: CrmGroupActions.getGroup,
    deletePromotion: CrmGroupActions.deletePromotion,
    getMembersGroup: CrmGroupActions.getMembersGroup
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withTranslate(GroupPromotionInfoForm)));


/* add 1-> 51 */

/*if (group && group._id != groupPromotionId) {
        group._id = groupPromotionId;
        props.getGroupById(groupPromotionId);
    }*/

    

    
