import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeInfoActions } from '../redux/actions';
import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, SalaryTab,
    DisciplineTab, AttachmentTab, ExperiencTab, CertificateTab, ContractTab,
} from './combinedContent';
class EmployeeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount = async () => {
        this.props.getEmployeeProfile();
    }
    render() {
        var employees, salaries, annualLeaves, commendations, disciplines;
        const { employeesInfo, translate } = this.props;
        if (employeesInfo.employees) employees = employeesInfo.employees;
        if (employeesInfo.salarys) salaries = employeesInfo.salarys;
        if (employeesInfo.annualLeaves) annualLeaves = employeesInfo.annualLeaves;
        if (employeesInfo.commendations) commendations = employeesInfo.commendations;
        if (employeesInfo.disciplines) disciplines = employeesInfo.disciplines;
        return (
            <React.Fragment>
                {
                    typeof employees !== 'undefined' && employees.length === 0 && employeesInfo.isLoading === false && < span className="text-red">{translate('manage_employee.no_data_personal')}</span>
                }
                {(typeof employees !== 'undefined' && employees.length !== 0) &&
                    employees.map((x, index) => (
                        <div className="row" key={index}>
                            {/* left column */}
                            <div className="col-sm-12">
                                <div className="nav-tabs-custom">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a title={translate('manage_employee.menu_general_infor_title')} data-toggle="tab" href="#view_general">{translate('manage_employee.menu_general_infor')}</a></li>
                                        <li><a title={translate('manage_employee.menu_contact_infor_title')} data-toggle="tab" href="#view_contact">{translate('manage_employee.menu_contact_infor')}</a></li>
                                        <li><a title={translate('manage_employee.menu_education_experience_title')} data-toggle="tab" href="#view_experience">{translate('manage_employee.menu_education_experience')}</a></li>
                                        <li><a title={translate('manage_employee.menu_diploma_certificate_title')} data-toggle="tab" href="#view_diploma">{translate('manage_employee.menu_diploma_certificate')}</a></li>
                                        <li><a title={translate('manage_employee.menu_account_tax_title')} data-toggle="tab" href="#view_account">{translate('manage_employee.menu_account_tax')}</a></li>
                                        <li><a title={translate('manage_employee.menu_insurrance_infor_title')} data-toggle="tab" href="#view_insurrance">{translate('manage_employee.menu_insurrance_infor')}</a></li>
                                        <li><a title={translate('manage_employee.menu_contract_training_title')} data-toggle="tab" href="#view_contract">{translate('manage_employee.menu_contract_training')}</a></li>
                                        <li><a title={translate('manage_employee.menu_reward_discipline_title')} data-toggle="tab" href="#view_reward">{translate('manage_employee.menu_reward_discipline')}</a></li>
                                        <li><a title={translate('manage_employee.menu_salary_sabbatical_title')} data-toggle="tab" href="#view_salary">{translate('manage_employee.menu_salary_sabbatical')}</a></li>
                                        <li><a title={translate('manage_employee.menu_attachments_title')} data-toggle="tab" href="#view_attachments">{translate('manage_employee.menu_attachments')}</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        <GeneralTab
                                            id="view_general"
                                            employee={x}
                                        />
                                        <ContactTab
                                            id="view_contact"
                                            employee={x}
                                        />
                                        <ExperiencTab
                                            id="view_experience"
                                            employee={x}
                                        />
                                        <TaxTab
                                            id="view_account"
                                            employee={x}
                                        />
                                        <CertificateTab
                                            id="view_diploma"
                                            degrees={x.degrees}
                                            certificates={x.certificates}
                                        />
                                        <InsurranceTab
                                            id="view_insurrance"
                                            employee={x}
                                            socialInsuranceDetails={x.socialInsuranceDetails}
                                        />
                                        <ContractTab
                                            id="view_contract"
                                            courses={x.courses}
                                            contracts={x.contracts}
                                        />
                                        <DisciplineTab
                                            id="view_reward"
                                            commendations={commendations}
                                            disciplines={disciplines}
                                        />
                                        <SalaryTab
                                            id="view_salary"
                                            annualLeaves={annualLeaves}
                                            salaries={salaries}
                                        />
                                        <AttachmentTab
                                            id="view_attachments"
                                            employee={x}
                                            files={x.files}

                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
            </React.Fragment>
        );
    };
}

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
}
const actionCreators = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
}
const connectDetaiEmployee = connect(mapState, actionCreators)(withTranslate(EmployeeDetail));
export { connectDetaiEmployee as EmployeeDetail };