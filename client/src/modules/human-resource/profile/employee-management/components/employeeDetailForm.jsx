import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, SalaryTab,
    DisciplineTab, AttachmentTab, ExperiencTab, CertificateTab, ContractTab
} from '../../employee-info/components/combinedContent';

import { EmployeeInfoActions } from '../../employee-info/redux/actions';
import FamilyMemberTabInfo from '../../employee-info/components/familyMemberTab';

const EmployeeDetailForm = (props) => {

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    })

    const mountedRef = useRef(true)

    useEffect(() => {
        const shouldUpdate = async () => {
            if (props._id !== state._id && !props.employeesInfo.isLoading) {
                await props.getEmployeeProfile({ id: props._id, callAPIByUser: false });
                setState({
                    ...state,
                    _id: props._id,
                    dataStatus: DATA_STATUS.QUERYING,
                    employees: [],
                    annualLeaves: [],
                    commendations: [],
                    disciplines: [],
                    courses: [],
                    roles: [],
                    // career: [],
                    // major: [],
                })
            };
            if (state.dataStatus === DATA_STATUS.QUERYING && !props.employeesInfo.isLoading) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                    employees: props.employeesInfo?.employees,
                    annualLeaves: props.employeesInfo?.annualLeaves,
                    commendations: props.employeesInfo?.commendations,
                    disciplines: props.employeesInfo?.disciplines,
                    courses: props.employeesInfo?.courses,
                    roles: props.employeesInfo?.roles,
                    // career: props.employeesInfo?.employees?.[0]?.career,
                    // major: props.employeesInfo?.employees?.[0]?.major,
                    houseHold: props.employeesInfo.employees?.[0].houseHold,
                });
            };
        }

        shouldUpdate()
        return () => {
            mountedRef.current = false;
        }
    }, [props._id, props.employeesInfo.isLoading, state.dataStatus]);

    const { employeesInfo, translate } = props;

    let { _id, employees, annualLeaves, commendations, disciplines, courses, roles = [], career, major, houseHold } = state;
    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-detail-employee${props?._id}`} isLoading={employeesInfo.isLoading}
                formID={`form-detail-employee${_id}`}
                title={translate('human_resource.profile.employee_management.employee_infor')}
                hasSaveButton={false}
                hasNote={false}
            >
                <form className="form-group" id={`form-detail-employee${_id}`} style={{ marginTop: "-15px" }}>
                    {employees && employees.length !== 0 &&
                        employees.map((x, index) => (
                            <div className="nav-tabs-custom row" key={index}>
                                <ul className="nav nav-tabs">
                                    <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#view_general${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href={`#view_contact${_id}`}>{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href={`#view_experience${_id}`}>{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href={`#view_diploma${_id}`}>{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href={`#view_account${_id}`}>{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href={`#view_insurrance${_id}`}>{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href={`#view_contract${_id}`}>{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href={`#view_reward${_id}`}>{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                                    <li><a title={translate('menu.annual_leave_personal')} data-toggle="tab" href={`#view_salary${_id}`}>{translate('menu.annual_leave_personal')}</a></li>
                                    <li><a title={"Thành viên hộ gia đình"} data-toggle="tab" href={`#view_family_member${_id}`}>Thành viên hộ gia đình</a></li>
                                    <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href={`#view_attachments${_id}`}>{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                                </ul>
                                <div className="tab-content">
                                    {/* Thông tin chung */}
                                    <GeneralTab
                                        id={`view_general${_id}`}
                                        employee={x}
                                        roles={roles}
                                    />
                                    {/* Thông tin liên hệ */}
                                    <ContactTab
                                        id={`view_contact${_id}`}
                                        employee={x}
                                    />
                                    {/* Kinh nghiệm làm việc*/}
                                    <ExperiencTab
                                        id={`view_experience${_id}`}
                                        employee={x}
                                    />
                                    {/* Thuế thu nhập cá nhân */}
                                    <TaxTab
                                        id={`view_account${_id}`}
                                        employee={x}
                                    />
                                    {/* Bằng cấp - Chúng chỉ */}
                                    <CertificateTab
                                        id={`view_diploma${_id}`}
                                        degrees={x.degrees}
                                        certificates={x.certificates}
                                    />
                                    {/* bảo hiểm y tế */}
                                    <InsurranceTab
                                        id={`view_insurrance${_id}`}
                                        employee={x}
                                        socialInsuranceDetails={x.socialInsuranceDetails}
                                    />
                                    {/* Hợp đồng lao động */}
                                    <ContractTab
                                        id={`view_contract${_id}`}
                                        employee={x}
                                        courses={courses}
                                        contracts={x.contracts}
                                    />
                                    {/* thông tin khen thương - kỷ luật */}
                                    <DisciplineTab
                                        id={`view_reward${_id}`}
                                        commendations={commendations}
                                        disciplines={disciplines}
                                    />
                                    {/* Thông tin lương thưởng */}
                                    <SalaryTab
                                        id={`view_salary${_id}`}
                                        annualLeaves={annualLeaves}
                                    />
                                    {/* Tài liệu đính kèm*/}
                                    <AttachmentTab
                                        id={`view_attachments${_id}`}
                                        employee={x}
                                        files={x.files}
                                    />
                                    <FamilyMemberTabInfo
                                        id={`view_family_member${_id}`}
                                        houseHold={houseHold}
                                    />
                                </div>
                            </div>
                        ))}
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
};

const actionCreators = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
}

const detailEmployee = connect(mapState, actionCreators)(withTranslate(EmployeeDetailForm));
export { detailEmployee as EmployeeDetailForm };
