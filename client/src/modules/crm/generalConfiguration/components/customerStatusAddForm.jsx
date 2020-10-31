import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { CrmStatusActions } from '../../status/redux/actions';

class CustomerStatusAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = { newCustomerStatus: {} }
    }

    handleChangeCustomerName = (e) => {
        const { newCustomerStatus } = this.state;
        const { value } = e.target;

        this.setState({
            newCustomerStatus: {
                ...newCustomerStatus,
                name: value
            }
        });
    }


    handleChangeCustomerDescription = (e) => {
        const { newCustomerStatus } = this.state;
        const { value } = e.target;

        this.setState({
            newCustomerStatus: {
                ...newCustomerStatus,
                description: value
            }
        });
    }

    save = () => {
        const { newCustomerStatus } = this.state;
        this.props.createGroup(newCustomerStatus);
    }


    render() {
        const { translate } = this.props;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-crm-customerStatus-create" button_name={translate('general.add')} title={translate('crm.group.add')} />
                <DialogModal
                    modalID="modal-crm-customerStatus-create" isLoading={false}
                    formID="form-crm-customerStatus-create"
                    title={translate('crm.status.add')}
                    func={this.save}
                    size={50}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-crm-customerStatus-create">
                        {/* tên trạng thái khách hàng */}
                        <div className={`form-group`}>
                            <label>{translate('crm.status.name')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleChangeCustomerName} />
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>

                        {/* Mô tả trạng thái khách hàng */}
                        <div className={`form-group `}>
                            <label>{translate('crm.status.description')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleChangeCustomerDescription} />
                            {/* <ErrorLabel content={groupNameError} /> */}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    createCustomerStatus: CrmStatusActions.createStatus,
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerStatusAddForm));