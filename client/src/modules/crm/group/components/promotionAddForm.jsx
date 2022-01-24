import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DatePicker, SelectBox, DialogModal } from '../../../../common-components';
import { CrmGroupActions } from '../redux/actions';


function PromotionAddForm(props) {
    const { translate, groupId, crm } = props;
    const { group } = crm;
    const [promotion,setPromotion] = useState(() => initState());

    function initState() {
        return {
            promotion: {
                exceptCustomer: []
            }
        }
    }

    let allMembersGroup;
    if ( crm?.groups?.membersInGroup ) {
        allMembersGroup = crm.groups.membersInGroup;
    };

    allMembersGroup = allMembersGroup.map((e) => {
        return {
            value: e._id,
            text: e.name
        }
    });
    //console.log(allMembersGroup);

    let i = 0;

    const handleChangeValue = async (e) => {
        const value = e.target.value;
        await setPromotion({ ...promotion, value: value});
    }

    const handleChangeMinimumOrderValue = async (e) => {
        const value = e.target.value;
        await setPromotion({...promotion, minimumOrderValue: value});
    }

    const handleChangePromotionalValueMax = async (e) => {
        const value = e.target.value;
        await setPromotion({...promotion, promotionalValueMax: value});
    }

    const handleChangeExpirationDate = async (value) => {
        await setPromotion({...promotion, expirationDate: value});
    }

    const handleChangeDescription = async (e) => {
        const value = e.target.value;
        await setPromotion({
            ...promotion, description: value
        })
    }

    const handleChangeExceptCustomer = async (value) => {
        await setPromotion({...promotion, exceptCustomer: value});
    }

    const save = async () => {
        if (promotion) {
            console.log(promotion);
            await props.addPromotion(groupId, promotion);
            await props.getRefreshData();
        }
    }

    return (
        <React.Fragment>
            <ButtonModal modalID="modal-crm-group-promotion-add" button_name={'Thêm mới khuyến mãi'} title={'Thêm mới khuyến mãi'}/>
            <DialogModal
                modalID="modal-crm-group-promotion-add"
                formID="form-crm-group-promotion-add"
                title={'Thêm khuyến mãi nhóm khách hàng'}
                func={save}
                size={50}
            >
                <form id="form-crm-group-promotion-add" className='qlcv'>
                    <div className="row">
                        <div className="col-md-12">
                            <div className={`form-group`}>
                                <label style={{ marginRight:'10px' }}>Tên nhóm khách hàng:</label>
                                {
                                    crm.groups.groupById.groupById &&
                                    <strong> {crm.groups.groupById.groupById.name}</strong>
                                }
                            </div>
                        </div>
                    </div>

                    <div className={`form-group`}>
                        <label>{'Giá trị khuyến mại (%)'}<span className="test-red">*</span></label>
                        <input type="number" className="form-control"
                             onChange={handleChangeValue}
                        />
                    </div>

                    <div className={`form-group`}>
                        <label>{'Giá trị đơn hàng tối thiểu (VNĐ)'}<span className="text-red">*</span></label>
                        <input type="number" className="form-control"
                            onChange={handleChangeMinimumOrderValue}
                        />
                    </div>

                    {/* Giảm tối đa */}

                    <div className={`form-group}`}>
                        <label>{'Giá trị giảm tối đa (VNĐ) '}<span className="text-red">*</span></label>
                        <input type="number" className="form-control"
                            onChange={handleChangePromotionalValueMax}
                        />
                    </div>


                    {/* Ngày hết hạn */}

                    <div className="form-group">
                        <label>{'Ngày hết hạn'}</label>
                        <DatePicker
                            id="start-date-form-promotion-add"
                            onChange={handleChangeExpirationDate}
                            disabled={false}
                        />
                    </div>

                    {/* Mô tả */}

                    <div className={`form-group}`}>
                        <label>{'Mô tả  '}<span className="text-red">*</span></label>
                        <textarea type="text" className="form-control"
                            onChange={handleChangeDescription}
                        />
                    </div>

                    <div className='form-group'>
                        <label className="control-label">{'Áp dụng với nhóm khách hàng ngoại trừ:'}</label>
                        {allMembersGroup && 
                            <SelectBox
                                id={`add-form`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allMembersGroup}
                                onChange={handleChangeExceptCustomer}     
                                value={promotion.exceptCustomer}
                                multiple={true}
                                options={{ placeholder: "Ngoại trừ" }}
                            />
                        }
                    </div>

                </form>
            </DialogModal>
        </React.Fragment>
    )
}
function mapStateToProps(state) {
    const { crm, auth, group } = state;
    return { crm, auth, group };
}

const mapDispatchToProps = {
    addPromotion: CrmGroupActions.addPromotion,
    //getMembersGroup: CrmGroupActions.getMembersGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PromotionAddForm));