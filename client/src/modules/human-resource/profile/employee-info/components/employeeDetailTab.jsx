import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeInfoActions } from '../redux/actions';
import {
    TabGeneralViewContent, TabContactViewContent, TabTaxViewContent,
    TabInsurranceViewContent, TabSalaryViewContent, TabRearDisciplineViewContent, AttachmentTab,
    TabExperiencViewContent, TabCertificateViewContent, TabContractViewContent,

} from './combinedContent';
class EmployeeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount = async () => {
        this.props.getInformationPersonal();
    }
    render() {
        var employee, employeeContact, salary, sabbatical, praise, discipline;
        const { employeesInfo, translate } = this.props;
        if (employeesInfo.employee) employee = employeesInfo.employee;
        if (employeesInfo.employeeContact) employeeContact = employeesInfo.employeeContact;
        if (employeesInfo.salary) salary = employeesInfo.salary;
        if (employeesInfo.sabbatical) sabbatical = employeesInfo.sabbatical;
        if (employeesInfo.praise) praise = employeesInfo.praise;
        if (employeesInfo.discipline) discipline = employeesInfo.discipline;
        return (
            <React.Fragment>
                {
                    typeof employee !== 'undefined' && employee.length === 0 && employeesInfo.isLoading === false && < span className="text-red">{translate('manage_employee.no_data_personal')}</span>
                }
                {(typeof employee !== 'undefined' && employee.length !== 0) &&
                    employee.map((x, index) => (
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
                                        <TabGeneralViewContent
                                            id="view_general"
                                            employee={x}
                                        />
                                        {
                                            employeeContact && employeeContact.map((y, indexs) => (
                                                <TabContactViewContent key={indexs}
                                                    id="view_contact"
                                                    employeeContact={y}
                                                />
                                            ))
                                        }
                                        <TabExperiencViewContent
                                            id="view_experience"
                                            employee={x}
                                        />
                                        <TabTaxViewContent
                                            id="view_account"
                                            employee={x}
                                        />
                                        <TabCertificateViewContent
                                            id="view_diploma"
                                            certificate={x.certificate}
                                            certificateShort={x.certificateShort}
                                        />
                                        <TabInsurranceViewContent
                                            id="view_insurrance"
                                            employee={x}
                                            BHXH={x.BHXH}
                                        />
                                        <TabContractViewContent
                                            id="view_contract"
                                            course={x.course}
                                            contract={x.contract}
                                        />
                                        <TabRearDisciplineViewContent
                                            id="view_reward"
                                            praise={praise}
                                            discipline={discipline}
                                        />
                                        <TabSalaryViewContent
                                            id="view_salary"
                                            sabbatical={sabbatical}
                                            salary={salary}
                                        />
                                        <AttachmentTab
                                            id="view_attachments"
                                            employee={x}
                                            file={x.file}

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
    getInformationPersonal: EmployeeInfoActions.getInformationPersonal,
}
const connectDetaiEmployee = connect(mapState, actionCreators)(withTranslate(EmployeeDetail));
export { connectDetaiEmployee as EmployeeDetail };