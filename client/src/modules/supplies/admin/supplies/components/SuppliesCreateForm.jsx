import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal,} from '../../../../../common-components';
import { SuppliesActions } from '../redux/actions';
import { AllocationTab, PurchaseInvoiceTab, SuppliesTab, } from '../../../base/create-tab/components/combinedContent'

function SuppliesCreateForm(props) {
    const [state, setState] = useState({
        supplies: {
            code: '',
            suppliesName: '',
            totalPurchase: 0,
            totalAllocation: 0,
            price: 0
        },
        purchaseInvoice: [],
        allocationHistory: []
    });

    const { translate, suppliesReducer} = props;
    const { supplies, purchaseInvoice, allocationHistory} = state;

    // Function lưu các trường thông tin vào state
    const handleChange = (name, value) => {
        const { supplies } = state;
        supplies[name] = value
        setState({
            ...state,
            supplies: supplies
        });
    }

    // Function thêm, chỉnh sửa thông tin hóa đơn mua
    const handlePurChaseInvoiceChange = (data, addData) => {
        const { purchaseInvoice } = state
        purchaseInvoice.push(addData)
        setState({
            ...state,
            purchaseInvoice: purchaseInvoice
        })
    }

    // Function thêm, chỉnh sửa thông tin hóa đơn mua
    const handleAllocationChange = (data, addData) => {
        const { allocationHistory } = state
        allocationHistory.push(addData)
        setState({
            ...state,
            allocationHistory: allocationHistory
        })
    }

    // function kiểm tra các trường bắt buộc phải nhập
    const validatorInput = (value) => {
        if (value && value.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let { supplies } = state;

        let result =
            validatorInput(supplies.code) &&
            validatorInput(supplies.suppliesName) &&
            supplies.totalPurchase >= 0 &&
            supplies.totalAllocation >= 0 &&
            supplies.price >=0;

        return result;
    }

    // Function thêm mới thông tin tài sản
    const save = () => {
        props.createSupplies(state);
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-add-supplies" isLoading={suppliesReducer.isLoading}
                formID="form-add-supplies"
                title={translate('menu.add_supplies')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('supplies.general_information.supplies_information')} data-toggle="tab" href={`#create_supplies`}>{translate('supplies.general_information.supplies_information')}</a></li>
                        <li><a title={translate('supplies.general_information.invoice_information')} data-toggle="tab" href={`#invoice`}>{translate('supplies.general_information.invoice_information')}</a></li>
                        <li><a title={translate('supplies.general_information.allocation_information')} data-toggle="tab" href={`#allocation`}>{translate('supplies.general_information.allocation_information')}</a></li>
                        
                    </ul>

                    <div className="tab-content">
                        {/* Thông tin chung */}
                        <SuppliesTab
                            id={`create_supplies`}
                            code={supplies.code}
                            suppliesName={supplies.suppliesName}
                            totalPurchase={supplies.totalPurchase}
                            totalAllocation={supplies.totalAllocation}
                            price={supplies.price}
                            handleChange={handleChange}
                        />
                        {/* Thông tin hoa don*/}
                        <PurchaseInvoiceTab
                            id="invoice"
                            purchaseInvoice={purchaseInvoice}
                            handleAddPurchaseInvoice={handlePurChaseInvoiceChange}
                            handleEditPurchaseInvoice={handlePurChaseInvoiceChange}
                            handleDeletePurchaseInvoice={handlePurChaseInvoiceChange}
                        />

                        {/* Thông tin cap phat */}
                        <AllocationTab
                            id="allocation"
                            allocationHistory={allocationHistory}
                            handleAddAllocation={handleAllocationChange}
                            handleEditAllocation={handleAllocationChange}
                            handleDeleteAllocation={handleAllocationChange}
                        />
                       
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { suppliesReducer, auth } = state;
    return { suppliesReducer, auth };
};

const actionCreators = {
    createSupplies: SuppliesActions.createSupplies,
};

const createSuppliesForm = connect(mapState, actionCreators)(withTranslate(SuppliesCreateForm));
export { createSuppliesForm as SuppliesCreateForm };