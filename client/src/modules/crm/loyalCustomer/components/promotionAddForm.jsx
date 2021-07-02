import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DatePicker, DialogModal } from '../../../../common-components';
import { CrmCustomerActions } from '../../customer/redux/actions';
import { CrmLoyalCustomerActions } from '../redux/action';


function PromotionAddForm(props) {
    const { translate, customerId, crm, user, customers } = props;
    const [promotion, setPromotion] = useState({});

    const handleChangeValue = async (e) => {
        const value = e.target.value;
        await setPromotion({ ...promotion, value: value });
    }

    const handleChangeMinimumOrderValue = async (e) => {
        const value = e.target.value;
        await setPromotion({ ...promotion, minimumOrderValue: value });
    }

    const handleChangePromotionalValueMax = async (e) => {
        const value = e.target.value;
        await setPromotion({ ...promotion, promotionalValueMax: value });
    }

    const handleChangeExpirationDate = async (value) => {
        await setPromotion({ ...promotion, expirationDate: value });
    }
    const handleChangeDescription = async (e) => {
        const value = e.target.value;
        await setPromotion({
            ...promotion, description: value
        })
    }

    const save = async () => {
        if (promotion) {
            await props.addPromotion(customerId, promotion);
            await props.getLoyalCustomers();

        }

    }

    return (
        <React.Fragment>
            <ButtonModal modalID="modal-crm-customer-promotion-add" button_name={'Thêm mới khuyến mãi'} title={'Thêm mới khuyến mãi'} />
            <DialogModal
                modalID="modal-crm-customer-promotion-add"
                formID="form-crm-customer-promotion-add"
                title={'Thêm khuyến mãi khách hàng'}
                func={save}
                size={75}
            // disableSubmit={!this.isFormValidated()}
            >
                <form id="form-crm-customer-promotion-add" className='qlcv'>
                    {/* Khách hàng  */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className={`form-group`}>
                                <label style={{ marginRight: '10px' }}>{translate('crm.care.customer')}:</label>
                                {
                                    crm.customers.customerById &&
                                    <strong> {crm.customers.name} </strong>
                                }
                                {/* <ErrorLabel content={groupCodeError} /> */}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* giá trị mã giảm giá */}
                        <div className="col-md-6">
                            <div className={`form-group}`}>
                                <label>{'Giá trị khuyến mại (%)'}<span className="text-red">*</span></label>
                                <input type="number" className="form-control"
                                    onChange={handleChangeValue}
                                />
                            </div>
                        </div>


                    </div>
                    <div className="row">
                        {/* Giá trị đơn hàng tối thiểu*/}
                        <div className="col-md-6">
                            <div className={`form-group}`}>
                                <label>{'Giá trị đơn hàng tối thiểu (VNĐ) '}<span className="text-red">*</span></label>
                                <input type="number" className="form-control"
                                    onChange={handleChangeMinimumOrderValue}
                                />
                            </div>
                        </div>

                        {/* Giảm tối đa */}
                        <div className="col-md-6">
                            <div className={`form-group}`}>
                                <label>{'Giá trị giảm tối đa (VNĐ) '}<span className="text-red">*</span></label>
                                <input type="number" className="form-control"
                                    onChange={handleChangePromotionalValueMax}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        {/* Ngày hết hạn */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{'Ngày hết hạn'}</label>
                                <DatePicker
                                    id="start-date-form-promotion-add"
                                    onChange={handleChangeExpirationDate}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        {/* Mô tả */}
                        <div className="col-md-6">
                            <div className={`form-group}`}>
                                <label>{'Mô tả  '}<span className="text-red">*</span></label>
                                <textarea type="text" className="form-control"
                                    onChange={handleChangeDescription}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}
function mapStateToProps(state) {
    const { crm, auth, user } = state;
    return { crm, auth, user };
}

const mapDispatchToProps = {
    getCustomer: CrmCustomerActions.getCustomer,
    addPromotion: CrmCustomerActions.addPromotion,
    getLoyalCustomers: CrmLoyalCustomerActions.getLoyalCustomers,

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PromotionAddForm));
