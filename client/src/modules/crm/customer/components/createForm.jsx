import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox, DatePicker } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { CrmCustomerActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { getStorage } from '../../../../config';
import GeneralTabCreateForm from './generalTabCreateForm';

class CrmCustomerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCustomer: {
            },
            currentRole: getStorage('currentRole')
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { auth, user } = this.props;
        const { newCustomer, currentRole } = this.state;

        if (!newCustomer.owner && auth.user && user.organizationalUnitsOfUser) {
            let getCurrentUnit = await user.organizationalUnitsOfUser.find(item =>
                item.deans[0] === currentRole
                || item.viceDeans[0] === currentRole
                || item.employees[0] === currentRole);

            // Lấy người dùng của đơn vị hiện tại và người dùng của đơn vị con
            if (getCurrentUnit) {
                this.props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);
            }

            this.setState({
                newCustomer: {
                    ...newCustomer,
                    owner: [auth.user._id],
                },
            })
            return false;
        }
        return true;
    }

    render() {
        const { translate, crm } = this.props;
        const { newCustomer } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-create" isLoading={crm.customers.isLoading}
                    formID="form-crm-customer-create"
                    title={translate("crm.customer.add")}
                    size={75}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm khách hàng mới */}
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#customer-general" data-toggle="tab" >Thông tin chung</a></li>
                            <li><a href="#Customer-fileAttachment" data-toggle="tab">Tài liệu liên quan</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Tab thông tin chung */}
                            {
                                newCustomer && newCustomer.owner &&
                                <GeneralTabCreateForm
                                    id={"customer-general"}
                                    callBackFromParentCreateForm={this.myCallBack}
                                    newCustomer={newCustomer}
                                />
                            }

                            {/* Tab file liên quan đến khách hàng */}
                            <div id="Customer-fileAttachment" className="tab-pane">

                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }


    myCallBack = (name, value) => {
        const { newCustomer } = this.state;
        this.setState({
            newCustomer: {
                ...newCustomer,
                [name]: value,
            }
        })
    }

    isFormValidated = () => {
        const { code, name, taxNumber } = this.state.newCustomer;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, code).status
            || !ValidationHelper.validateName(translate, name).status
            || !ValidationHelper.validateInvalidCharacter(translate, taxNumber).status)
            return false;
        return true;
    }

    save = () => {
        const { newCustomer } = this.state;
        if (this.isFormValidated) {
            this.props.createCustomer(newCustomer);
        }
    }
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