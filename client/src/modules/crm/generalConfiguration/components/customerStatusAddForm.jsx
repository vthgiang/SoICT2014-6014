import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { CrmStatusActions } from '../../status/redux/actions';

function CustomerStatusAddForm(props) {
    const [newCustomerStatus, setNewCustomerStatus] = useState({})

    const handleChangeCustomerName = async (e) => {
        const { value } = e.target;
        await setNewCustomerStatus({ ...newCustomerStatus, name: value })

    }


    const handleChangeCustomerDescription = async (e) => {

        const { value } = e.target;
        await setNewCustomerStatus({ ...newCustomerStatus, description: value })
    }

    const save = () => {

        props.createCustomerStatus(newCustomerStatus);
    }



    const { translate } = props;

    return (
        <React.Fragment>
            <ButtonModal modalID="modal-crm-customerStatus-create" button_name={translate('general.add')} title={translate('crm.group.add')} />
            <DialogModal
                modalID="modal-crm-customerStatus-create" isLoading={false}
                formID="form-crm-customerStatus-create"
                title={translate('crm.status.add')}
                func={save}
                size={50}
            // disableSubmit={!this.isFormValidated()}
            >
                <form id="form-crm-customerStatus-create">
                    {/* tên trạng thái khách hàng */}
                    <div className={`form-group`}>
                        <label>{translate('crm.status.name')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" onChange={handleChangeCustomerName} />
                        {/* <ErrorLabel content={groupCodeError} /> */}
                    </div>

                    {/* Mô tả trạng thái khách hàng */}
                    <div className={`form-group `}>
                        <label>{translate('crm.status.description')}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" onChange={handleChangeCustomerDescription} />
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
    createCustomerStatus: CrmStatusActions.createStatus,
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerStatusAddForm));