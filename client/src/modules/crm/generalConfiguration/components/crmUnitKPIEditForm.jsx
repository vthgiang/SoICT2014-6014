import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DialogModal } from '../../../../common-components';
import { CrmUnitKPIActions } from '../../crmUnitKPI/redux/action';

function CrmUnitKPIEditForm(props) {
    const [crmUnitKPIState, setCrmUnitKPIState] = useState();
    const [isNew, setIsNew] = useState(true);
    const { crm, translate } = props;
    let crmUnitKPI;
    if (crm.crmUnitKPI && crm.crmUnitKPI.list && crm.crmUnitKPI.list.length > 0) {
        crmUnitKPI = crm.crmUnitKPI.list[0];
    }
    if (crmUnitKPI  && (!crmUnitKPIState || crmUnitKPIState._id != crmUnitKPI._id)) {
        setCrmUnitKPIState(crmUnitKPI);
    }
    const save = () => {

        props.editCrmUnitKPI(crmUnitKPIState._id,crmUnitKPIState);
    }
    const handleChangeNumberOfNewCustomersValue = async (e) => {

        const { value } = e.target;
        const newState = { ...crmUnitKPIState, numberOfNewCustomers: { value, weight: crmUnitKPIState.numberOfNewCustomers.weight } }
        await setCrmUnitKPIState(newState)
    }
    const handleChangeNumberOfNewCustomersWeight = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, numberOfNewCustomers: { weight: value, value: crmUnitKPIState.numberOfNewCustomers.value } })
    }
    const handleChangeCustomerRetentionRateValue = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, customerRetentionRate: { value, weight: crmUnitKPIState.customerRetentionRate.weight } })
    }
    const handleChangeCustomerRetentionRateWeight = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, customerRetentionRate: { weight: value, value: crmUnitKPIState.customerRetentionRate.value } })
    }
    const handleChangeTotalActionsValue = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, totalActions: { value, weight: crmUnitKPIState.totalActions.weight } })
    }
    const handleChangeTotalActionsWeight = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, totalActions: { weight: value, value: crmUnitKPIState.totalActions.value } })
    }
    const handleChangeNewCustomerBuyingRateValue = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, newCustomerBuyingRate: { value, weight: crmUnitKPIState.newCustomerBuyingRate.weight } })
    }
    const handleChangeNewCustomerBuyingRateWeight = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, newCustomerBuyingRate: { weight: value, value: crmUnitKPIState.newCustomerBuyingRate.value } })
    }
    const handleChangeSolutionRateValue = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, solutionRate: { value, weight: crmUnitKPIState.solutionRate.weight } })
    }
    const handleChangeSolutionRateWeight = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, solutionRate: { weight: value, value: crmUnitKPIState.solutionRate.value } })
    }
    const handleChangeCompletionRateValue = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, completionRate: { value, weight: crmUnitKPIState.completionRate.weight } })
    }
    const handleChangeCompletionRateWeight = (e) => {
        const { value } = e.target;
        setCrmUnitKPIState({ ...crmUnitKPIState, completionRate: { weight: value, value: crmUnitKPIState.completionRate.value } })
    }

    return (
        <React.Fragment>
            <ButtonModal modalID="modal-crm-customer-care-KPI-edit" button_name='Chỉnh sửa chỉ tiêu công việc' title='Chỉnh sửa chỉ tiêu công việc' />
            <DialogModal
                modalID="modal-crm-customer-care-KPI-edit"
                isLoading={false}
                formID="form-crm-customer-care-KPI-edit"
                func={save}
                size={50}
            // disableSubmit={!this.isFormValidated()}
            >
                <form id="form-crm-crm-customer-care-KPI-edit">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{'Chỉ tiêu cho công việc "Tìm kiếm khách hàng mới"'}
                        </legend>
                        <div className={`form-group`}>
                            <strong style={{ color: 'green' }}> Chỉ tiêu số lượng khách hàng mới  </strong>
                            <div style={{ marginLeft: '3%', width: '80%' }}>
                                <label>{'Số lượng khách hàng mới'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.numberOfNewCustomers.value : 0} onChange={handleChangeNumberOfNewCustomersValue} />
                                <label>{'Trọng số'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.numberOfNewCustomers.weight : 0} onChange={handleChangeNumberOfNewCustomersWeight} />
                            </div>
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>
                        <div className={`form-group`}>
                            <strong style={{ color: 'green' }}> Chỉ tiêu tỉ lệ mua hàng ở khách hàng mới  </strong>
                            <div style={{ marginLeft: '3%', width: '80%' }}>
                                <label>{'Tỉ lệ mua hàng ở khách hàng mới (%)'}<span className="attention" style={{ color: 'red' }} > * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.newCustomerBuyingRate.value : 0} onChange={handleChangeNewCustomerBuyingRateValue} />
                                <label>{'Trọng số'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.newCustomerBuyingRate.weight : 0} onChange={handleChangeNewCustomerBuyingRateWeight} />
                            </div>
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>

                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{'Chỉ tiêu cho công việc "Chăm sóc khách hàng"'}
                        </legend>
                        <div className={`form-group`}>
                            <strong style={{ color: 'green' }}> Chỉ tiêu số lượng hoạt động chăm sóc khách hàng  </strong>
                            <div style={{ marginLeft: '3%', width: '80%' }}>
                                <label>{'Số lượng hoạt động chăm sóc khách hàng'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.totalActions.value : 0} onChange={handleChangeTotalActionsValue} />
                                <label>{'Trọng số'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.totalActions.weight : 0} onChange={handleChangeTotalActionsWeight} />
                            </div>
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>
                        <div className={`form-group`}>
                            <strong style={{ color: 'green' }}> Chỉ tiêu tỉ lệ hoàn thành hoạt động  </strong>
                            <div style={{ marginLeft: '3%', width: '80%' }}>
                                <label>{'Tỉ lệ hoàn thành hoạt động (%)'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.completionRate.value : 0} onChange={handleChangeCompletionRateValue} />
                                <label>{'Trọng số'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.completionRate.weight : 0} onChange={handleChangeCompletionRateWeight} />
                            </div>
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>
                        <div className={`form-group`}>
                            <strong style={{ color: 'green' }}> Chỉ tiêu tỉ lệ hoạt động thành công  </strong>
                            <div style={{ marginLeft: '3%', width: '80%' }}>
                                <label>{'Tỉ lệ hoạt động thành công'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.solutionRate.value : 0} onChange={handleChangeSolutionRateValue} />
                                <label>{'Trọng số'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.solutionRate.weight : 0} onChange={handleChangeSolutionRateWeight} />
                            </div>
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>
                        <div className={`form-group`}>
                            <strong style={{ color: 'green' }}> Chỉ tiêu tỉ lệ khách hàng quay lại mua hàng  </strong>
                            <div style={{ marginLeft: '3%', width: '80%' }}>
                                <label>{'Tỉ lệ khách hàng quay lại mua hàng '}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.customerRetentionRate.value : 0} onChange={handleChangeCustomerRetentionRateValue} />
                                <label>{'Trọng số'}<span className="attention" style={{ color: 'red' }}> * </span></label>
                                <input type="number" className="form-control" style={{ borderRadius: '5px' }}
                                    value={crmUnitKPIState ? crmUnitKPIState.customerRetentionRate.weight : 0} onChange={handleChangeCustomerRetentionRateWeight} />
                            </div>
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>

                    </fieldset>
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
    editCrmUnitKPI: CrmUnitKPIActions.editCrmUnitKPI,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmUnitKPIEditForm));