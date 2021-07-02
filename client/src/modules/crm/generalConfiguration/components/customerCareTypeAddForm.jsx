import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DialogModal } from '../../../../common-components';
import { CrmCareTypeActions } from '../../careType/redux/action';

function CustomerCareTypeAddForm(props) {
    const [newCustomerCareType, setNewCustomerCareType] = useState({})

    const handleChangeName = async (e) => {
        const { value } = e.target;
        await setNewCustomerCareType({ ...newCustomerCareType, name: value })

    }


    const handleChangeDescription = async (e) => {

        const { value } = e.target;
        await setNewCustomerCareType({ ...newCustomerCareType, description: value })
    }

    const save = () => {

        props.createCareTypes(newCustomerCareType);
    }



    const { translate } = props;

    return (
        <React.Fragment>
            <ButtonModal modalID="modal-crm-customer-care-type-create" button_name={translate('general.add')} title={translate('crm.group.add')} />
            <DialogModal
                modalID="modal-crm-customer-care-type-create" 
                isLoading={false}
                formID="form-crm-customer-care-type-create"
                title={"Thêm mới loại hoạt động chăm sóc khách hàng"}
                func={save}
                size={50}
            // disableSubmit={!this.isFormValidated()}
            >
                <form id="form-crm-crm-customer-care-type-create">
                    {/* tên trạng thái khách hàng */}
                    <div className={`form-group`}>
                        <label>{'Tên loại hoạt động chăm sóc khách hàng'}<span className="attention"> * </span></label>
                        <input type="text" className="form-control" onChange={handleChangeName} />
                        {/* <ErrorLabel content={groupCodeError} /> */}
                    </div>

                    {/* Mô tả trạng thái khách hàng */}
                    <div className={`form-group `}>
                        <label>{translate('crm.status.description')}<span className="attention"> * </span></label>
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
    createCareTypes: CrmCareTypeActions.createCareType,
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerCareTypeAddForm));