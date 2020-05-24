import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';
import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, SalaryTab,
    DisciplineTab, AttachmentTab, ExperiencTab, CertificateTab, ContractTab
} from '../../employee-info/components/combinedContent';
class EmployeeDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                employees: nextProps.employees,
                salaries: nextProps.salaries,
                annualLeaves: nextProps.annualLeaves,
                commendations: nextProps.commendations,
                disciplines: nextProps.disciplines,
            }
        } else {
            return null;
        }
    }
    render() {
        const { employeesManager, translate } = this.props;
        var { _id, employees, salaries, annualLeaves, commendations, disciplines } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-view-employee" isLoading={employeesManager}
                    formID="form-view-employee"
                    title="Thông tin nhân viên"
                    hasSaveButton={false}
                >
                    <form className="form-group" id="form-view-employee" style={{ marginTop: "-15px" }}>
                        {(typeof employees !== 'undefined' && employees.length !== 0) &&
                            employees.map((x, index) => (
                                <div className="nav-tabs-custom" key={index}>
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a title={translate('manage_employee.menu_general_infor_title')} data-toggle="tab" href={`#view_general${_id}`}>{translate('manage_employee.menu_general_infor')}</a></li>
                                        <li><a title={translate('manage_employee.menu_contact_infor_title')} data-toggle="tab" href={`#view_contact${_id}`}>{translate('manage_employee.menu_contact_infor')}</a></li>
                                        <li><a title={translate('manage_employee.menu_education_experience_title')} data-toggle="tab" href={`#view_experience${_id}`}>{translate('manage_employee.menu_education_experience')}</a></li>
                                        <li><a title={translate('manage_employee.menu_diploma_certificate_title')} data-toggle="tab" href={`#view_diploma${_id}`}>{translate('manage_employee.menu_diploma_certificate')}</a></li>
                                        <li><a title={translate('manage_employee.menu_account_tax_title')} data-toggle="tab" href={`#view_account${_id}`}>{translate('manage_employee.menu_account_tax')}</a></li>
                                        <li><a title={translate('manage_employee.menu_insurrance_infor_title')} data-toggle="tab" href={`#view_insurrance${_id}`}>{translate('manage_employee.menu_insurrance_infor')}</a></li>
                                        <li><a title={translate('manage_employee.menu_contract_training_title')} data-toggle="tab" href={`#view_contract${_id}`}>{translate('manage_employee.menu_contract_training')}</a></li>
                                        <li><a title={translate('manage_employee.menu_reward_discipline_title')} data-toggle="tab" href={`#view_reward${_id}`}>{translate('manage_employee.menu_reward_discipline')}</a></li>
                                        <li><a title={translate('manage_employee.menu_salary_sabbatical_title')} data-toggle="tab" href={`#view_salary${_id}`}>{translate('manage_employee.menu_salary_sabbatical')}</a></li>
                                        <li><a title={translate('manage_employee.menu_attachments_title')} data-toggle="tab" href={`#view_attachments${_id}`}>{translate('manage_employee.menu_attachments')}</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <GeneralTab
                                            id={`view_general${_id}`}
                                            employee={x}
                                        />
                                        <ContactTab
                                            id={`view_contact${_id}`}
                                            employee={x}
                                        />
                                        <ExperiencTab
                                            id={`view_experience${_id}`}
                                            employee={x}
                                        />
                                        <TaxTab
                                            id={`view_account${_id}`}
                                            employee={x}
                                        />
                                        <CertificateTab
                                            id={`view_diploma${_id}`}
                                            degrees={x.degrees}
                                            certificates={x.certificates}
                                        />
                                        <InsurranceTab
                                            id={`view_insurrance${_id}`}
                                            employee={x}
                                            socialInsuranceDetails={x.socialInsuranceDetails}
                                        />
                                        <ContractTab
                                            id={`view_contract${_id}`}
                                            courses={x.courses}
                                            contracts={x.contracts}
                                        />
                                        <DisciplineTab
                                            id={`view_reward${_id}`}
                                            commendations={commendations}
                                            disciplines={disciplines}
                                        />
                                        <SalaryTab
                                            id={`view_salary${_id}`}
                                            annualLeaves={annualLeaves}
                                            salaries={salaries}
                                        />
                                        <AttachmentTab
                                            id={`view_attachments${_id}`}
                                            employee={x}
                                            files={x.files}
                                        />
                                    </div>
                                </div>
                            ))}
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    };
}

const detailEmployee = connect(null, null)(withTranslate(EmployeeDetailForm));
export { detailEmployee as EmployeeDetailForm };