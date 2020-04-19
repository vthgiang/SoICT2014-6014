import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog } from '../../../../common-components';
import {
    TabGeneralViewContent, TabContactViewContent, TabTaxViewContent,
    TabInsurranceViewContent, TabSalaryViewContent, TabRearDisciplineViewContent, TabAttachmentsViewContent,
    TabExperiencViewContent, TabCertificateViewContent, TabContractViewContent
} from '../../employee-info/components/CombineContent';
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
                employee: nextProps.employee,
                employeeContact: nextProps.employeeContact,
                salary: nextProps.salary,
                sabbatical: nextProps.sabbatical,
                praise: nextProps.praise,
                discipline: nextProps.discipline,
            }
        } else {
            return null;
        }
    }
    render() {
        console.log(this.state._id);
        const { employeesManager, translate } = this.props;
        var { _id, employee, employeeContact, salary, sabbatical, praise, discipline } = this.state;
        return (
            <React.Fragment>
                <ModalDialog
                    size='100' modalID="modal-view-employee" isLoading={employeesManager}
                    formID="form-view-employee"
                    title={translate('manage_employee.edit_diploma')}
                // disableSubmit={false}
                >
                    <form className="form-group" id="form-view-employee" style={{ marginTop: "-15px" }}>
                        {(typeof employee !== 'undefined' && employee.length !== 0) &&
                            employee.map((x, index) => (
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
                                        <TabGeneralViewContent
                                            id={`view_general${_id}`}
                                            employee={x}
                                        />
                                        {
                                            employeeContact && employeeContact.map((y, indexs) => (
                                                <TabContactViewContent key={indexs}
                                                    id={`view_contact${_id}`}
                                                    employeeContact={y}
                                                />
                                            ))
                                        }
                                        <TabExperiencViewContent
                                            id={`view_experience${_id}`}
                                            employee={x}
                                        />
                                        <TabTaxViewContent
                                            id={`view_account${_id}`}
                                            employee={x}
                                        />
                                        <TabCertificateViewContent
                                            id={`view_diploma${_id}`}
                                            certificate={x.certificate}
                                            certificateShort={x.certificateShort}
                                        />
                                        <TabInsurranceViewContent
                                            id={`view_insurrance${_id}`}
                                            employee={x}
                                            BHXH={x.BHXH}
                                        />
                                        <TabContractViewContent
                                            id={`view_contract${_id}`}
                                            course={x.course}
                                            contract={x.contract}
                                        />
                                        <TabRearDisciplineViewContent
                                            id={`view_reward${_id}`}
                                            praise={praise}
                                            discipline={discipline}
                                        />
                                        <TabSalaryViewContent
                                            id={`view_salary${_id}`}
                                            sabbatical={sabbatical}
                                            salary={salary}
                                        />
                                        <TabAttachmentsViewContent
                                            id={`view_attachments${_id}`}
                                            employee={x}
                                            file={x.file}
                                        />
                                    </div>
                                </div>
                            ))}
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    };
}

const detailEmployee = connect(null, null)(withTranslate(EmployeeDetailForm));
export { detailEmployee as EmployeeDetailForm };