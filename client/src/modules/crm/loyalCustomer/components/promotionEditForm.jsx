import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { translate } from 'react-redux-multilingual/lib/utils';
import { ConfirmNotification, DataTableSetting, DatePicker, DialogModal } from '../../../../common-components';
import { formatFunction } from '../../common';
import { CrmCustomerActions } from '../../customer/redux/actions';
import PromotionAddForm from './promotionAddForm';

function PromotionEditForm(props) {
    const { customerId, promotion, promotionIndex, crm } = props;
    const [promotionEdit, setPromotionEdit] = useState(promotion);

    

    const handleChangeValue = async (e) => {
        const value = e.target.value;
         setPromotionEdit({ ...promotionEdit, value: value });
    }

    const handleChangeMinimumOrderValue = async (e) => {
        const value = e.target.value;
        await setPromotionEdit({ ...promotionEdit, minimumOrderValue: value });
    }

    const handleChangePromotionalValueMax = async (e) => {
        const value = e.target.value;
        await setPromotionEdit({ ...promotionEdit, promotionalValueMax: value });
    }

    const handleChangeExpirationDate = async (value) => {
        await setPromotionEdit({ ...promotionEdit, expirationDate: value });
    }
    const handleChangeDescription = async (e) => {
        const value = e.target.value;
        await setPromotionEdit({
            ...promotionEdit, description: value
        })
    }

    const save = async () => {
        if (promotionEdit) {
            await props.editPromotion(customerId, { promotion: promotionEdit } );
        }

    }


    return (
        <DialogModal
            modalID="modal-crm-customer-promotion-edit"
            formID="form-crm-customer-promotion-edit"
            title={'Chỉnh sửa khuyến mãi khách hàng'}
            func={save}
            size={50}
        // disableSubmit={!this.isFormValidated()}
        >
            <form id="form-crm-customer-promotion-edit" className='qlcv'>
                {/* Khách hàng  */}
                <div className="row">
                    <div className="col-md-12">
                        <div className={`form-group`}>
                            <label style={{ marginRight: '10px' }}>Tên khách hàng:</label>
                            {
                                crm.customers.customerById &&
                                <strong> {crm.customers.customerById.name} </strong>
                            }
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>
                    </div>
                </div>
                {promotionEdit && <>
                    <div className={`form-group}`}>
                        <label>{'Giá trị khuyến mại (%)'}<span className="text-red">*</span></label>
                        <input type="number" className="form-control"
                            value={promotionEdit.value}
                            onChange={handleChangeValue}
                        />
                    </div>


                    <div className={`form-group}`}>
                        <label>{'Giá trị đơn hàng tối thiểu (VNĐ) '}<span className="text-red">*</span></label>
                        <input type="number" className="form-control"
                            value={promotionEdit.minimumOrderValue}
                            onChange={handleChangeMinimumOrderValue}
                        />
                    </div>


                    {/* Giảm tối đa */}

                    <div className={`form-group}`}>
                        <label>{'Giá trị giảm tối đa (VNĐ) '}<span className="text-red">*</span></label>
                        <input type="number" className="form-control"
                            value={promotionEdit.promotionalValueMax}
                            onChange={handleChangePromotionalValueMax}
                        />
                    </div>

                    {/* Ngày hết hạn */}

                    <div className="form-group">
                        <label>{'Ngày hết hạn'}</label>
                        <DatePicker
                            id="start-date-form-promotion-edit"
                            onChange={handleChangeExpirationDate}
                            value={formatFunction.formatDate(promotionEdit.expirationDate)}
                            disabled={false}
                        />
                    </div>

                    {/* Mô tả */}

                    <div className={`form-group}`}>
                        <label>{'Mô tả  '}<span className="text-red">*</span></label>
                        <textarea type="text" className="form-control"
                            value={promotionEdit.description}
                            onChange={handleChangeDescription}
                        />
                    </div>

                </>}


            </form>
        </DialogModal>
    );
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    editPromotion: CrmCustomerActions.editPromotion

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PromotionEditForm));