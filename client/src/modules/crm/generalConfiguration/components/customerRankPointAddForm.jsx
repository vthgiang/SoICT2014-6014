import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { CrmCustomerRankPointActions } from '../../customerRankPoint/redux/action';
import { CrmStatusActions } from '../../status/redux/actions';

function CustomerRankPointAddForm(props) {
    const [newCustomerRankPoint, setNewCustomerRankPoint] = useState({})

    const handleChangeName = async (e) => {
        const { value } = e.target;
        await setNewCustomerRankPoint({ ...newCustomerRankPoint, name: value })

    }


    const handleChangeDescription = async (e) => {

        const { value } = e.target;
        await setNewCustomerRankPoint({ ...newCustomerRankPoint, description: value })
    }
    const handleChangePoint = async (e) => {

        const { value } = e.target;
        await setNewCustomerRankPoint({ ...newCustomerRankPoint, point: value })
    }

    const save = () => {

        props.createCustomerRankPoint(newCustomerRankPoint);
    }



    const { translate } = props;

    return (
        <React.Fragment>
            <ButtonModal modalID="modal-crm-customer-rankPoint-create" button_name={translate('general.add')} title={translate('crm.group.add')} />
            <DialogModal
                modalID="modal-crm-customer-rankPoint-create" isLoading={false}
                formID="form-crm-customer-rankPoint-create"
                title={'Thêm mới phân hạng khách hàng'}
                func={save}
                size={50}
            // disableSubmit={!this.isFormValidated()}
            >
                <form id="form-crm-customer-rankPoint-create">
                    {/* tên phân hạng khách hàng */}
                    <div className={`form-group`}>
                        <label>{'Tên phân hạng khách hàng'}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" onChange={handleChangeName} />
                        {/* <ErrorLabel content={groupCodeError} /> */}
                    </div>
                    {/* Số điểm tối thiểu */}
                    <div className={`form-group`}>
                        <label>{'Số điểm tích lũy tối thiểu'}<span className="attention"> * </span></label>
                        <input type="number" className="form-control" onChange={handleChangePoint} />
                        {/* <ErrorLabel content={groupCodeError} /> */}
                    </div>

                    {/* Mô tả phân hạng khách hàng */}
                    <div className={`form-group `}>
                        <label>{'Mô tả'}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" onChange={handleChangeDescription} />
                        {/* <ErrorLabel content={groupNameError} /> */}
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    createCustomerRankPoint: CrmCustomerRankPointActions.createCustomerRankPoint,
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerRankPointAddForm));