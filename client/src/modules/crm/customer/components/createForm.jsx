import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { getStorage } from '../../../../config';
import GeneralTabCreateForm from './generalTabCreateForm';
import FileTabCreateForm from './fileTabCreateForm';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';
function CrmCustomerCreate(props) {
    const { auth, user, crm, translate } = props;

    const [currentRole, setCurrentRole] = useState(getStorage('currentRole'))
    //lấy danh sách trạng thái
    const listStatus = crm.status.list.map(o => ({ _id: o._id, name: o.name, active: o.active }))

    const [newCustomer, setNewCustomer] = useState({ status: [listStatus[0]._id] });
    useEffect(() => {
        if (!newCustomer.owner && auth.user && user.organizationalUnitsOfUser) {
            let getCurrentUnit = user.organizationalUnitsOfUser.find(item =>
                item.managers[0] === currentRole
                || item.deputyManagers[0] === currentRole
                || item.employees[0] === currentRole);

            // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
            if (getCurrentUnit) {
                props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);
            }


            const newCustomerInit = {
                ...newCustomer,
                owner: [auth.user._id],
            }
            setNewCustomer(newCustomerInit);


        }
    }, [])


    /**
     * function setState các giá trị lấy từ component con vào state
     * @param {*} name 
     * @param {*} value 
     */
    const myCallBack = (name, value) => {

        const newCustomerInput = {
            ...newCustomer,
            [name]: value,
        }
        setNewCustomer(newCustomerInput)
    }

    /**
     * Hàm kiểm tra validate
     */
    const isFormValidated = () => {
        const { code, name, taxNumber } = newCustomer;
        const { translate } = props;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateName(translate, name).status
            || !ValidationHelper.validateInvalidCharacter(translate, taxNumber).status)
            return false;
        return true;
    }

    const save = () => {
        const { auth } = props;
        let formData;
        const getStatus = newCustomer.status;
        const statusHistories = [];
        const getDateTime = new Date();

        // Ghi log thay đổi trạng thái
        if (getStatus && getStatus.length > 0) {
            statusHistories.push({
                oldValue: getStatus[0],
                newValue: getStatus[0],
                createdAt: getDateTime,
                createdBy: auth.user._id,
                description: 'Khách hàng được tạo mới'
            })
        }
        const newCustomerInput = { ...newCustomer, statusHistories, roleId: getStorage('currentRole') }

        // Convert file upload
        formData = convertJsonObjectToFormData(newCustomerInput);
        console.log('formData', formData);
        if (newCustomerInput.files) {
            newCustomerInput.files.forEach(o => {
                formData.append('file', o.fileUpload);
            })
        }

        if (isFormValidated) {
            props.createCustomer(formData);
        }
    }



    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-customer-create" isLoading={crm.customers.isLoading}
                formID="modal-customer-create"
                title={translate("crm.customer.add")}
                size={75}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm khách hàng mới */}
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#customer-general" data-toggle="tab" >Thông tin chung</a></li>
                        <li><a href="#customer-fileAttachment" data-toggle="tab">Tài liệu liên quan</a></li>
                    </ul>
                    <div className="tab-content">
                        {/* Tab thông tin chung */}
                        {
                            newCustomer && newCustomer.owner &&
                            <GeneralTabCreateForm
                                id={"customer-general"}
                                callBackFromParentCreateForm={myCallBack}
                                newCustomer={newCustomer}
                            />
                        }

                        {/* Tab file liên quan đến khách hàng */}
                        {
                            <FileTabCreateForm
                                id={'customer-fileAttachment'}
                                callBackFromParentCreateForm={myCallBack}
                            />
                        }
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}



function mapStateToProps(state) {
    const { crm, auth, user } = state;
    return { crm, auth, user };
}

const mapDispatchToProps = {
    createCustomer: CrmCustomerActions.createCustomer,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerCreate));