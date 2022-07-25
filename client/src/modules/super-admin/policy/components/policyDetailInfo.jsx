import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import './policyAttributeTable.css'

import { DialogModal } from '../../../../common-components';

const PolicyDetailInfo = (props) => {
    const [state, setState] = useState({
        policyID: undefined,
    })

    const { translate, policy, attribute } = props;
    const { policyID } = state;

    // Nhận giá trị từ component cha
    useEffect(() => {
        if (policy?.policySatisfied) {
            setState({
                ...state,
                curentRowDetail: props.curentRowDetail,
                policyID: props.policyID,
                policyName: props.policyName,
                description: props.description,
                userAttributes: props.userAttributes,
                roleAttributes: props.roleAttributes,
                resourceAttributes: props.resourceAttributes,
                userRule: props.userRule,
                roleRule: props.roleRule,
                resourceRule: props.resourceRule,
                satisfiedSubjects: policy?.policySatisfied?.satisfiedSubjects,
                satisfiedResources: policy?.policySatisfied?.satisfiedResources,

            })


        }
    }, [policy?.policySatisfied])

    console.log(state)
    const { satisfiedSubjects, satisfiedResources, policyName, description, userRule, roleRule, resourceRule, userAttributes, roleAttributes, resourceAttributes } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-policy-hooks`} isLoading={policy.isLoading}
                title={translate('manage_policy.detail_info_policy')}
                formID={`form-detail-policy-hooks`}
                size={50}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('manage_policy.policy_information')} data-toggle="tab" href={`#policy_information`}>{translate('manage_policy.policy_information')}</a></li>
                        <li><a title={translate('manage_policy.satisfied_information')} data-toggle="tab" href={`#satisfied_information`}>{translate('manage_policy.satisfied_information')}</a></li>

                    </ul>

                    <div className="tab-content">
                        <div id="policy_information" className="tab-pane active">
                            {/* Tên ví dụ */}
                            <div className={`form-group`}>
                                <label>{translate('manage_policy.policyName')}:</label>
                                <span> {policyName}</span>
                            </div>

                            {/* Mô tả ví dụ */}
                            <div className={`form-group`}>
                                <label>{translate('manage_policy.description')}:</label>
                                <span> {description}</span>
                            </div>

                            <div className={`form-group`}>
                                <label>{translate('manage_policy.subject_information')}:</label>
                                <table className="table table-hover table-bordered detail-policy-attribute-table not-sort">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_owner_table')}</label></th>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.rule_table')}</label></th>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_name')}</label></th>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_value')}</label></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr>
                                            <td rowSpan={(!userAttributes || userAttributes.length == 0) ? 1 : userAttributes.length + 1}>
                                                {translate('manage_policy.user_table')}
                                            </td>
                                            {
                                                (!userAttributes || userAttributes.length == 0) ?
                                                    <td colSpan={3}>
                                                        <center> {translate('table.no_data')}</center>
                                                    </td> :
                                                    <React.Fragment>
                                                        <td rowSpan={userAttributes.length + 1}>{userRule}</td>

                                                    </React.Fragment>

                                            }

                                        </tr>
                                        {
                                            (!userAttributes || userAttributes.length <= 0) ? null :
                                                userAttributes.map((attr, index) => {
                                                    return <tr key={index}>
                                                        <td>
                                                            {attribute.lists.map(a => a._id == attr.attributeId ? a.attributeName : "")}
                                                        </td>

                                                        <td style={{ textAlign: "left" }}>
                                                            {attr.value}
                                                        </td>
                                                    </tr>
                                                })
                                        }

                                        <tr>
                                            <td rowSpan={(!roleAttributes || roleAttributes.length == 0) ? 1 : roleAttributes.length + 1}>
                                                {translate('manage_policy.role_table')}
                                            </td>
                                            {
                                                (!roleAttributes || roleAttributes.length == 0) ?
                                                    <td colSpan={3}>
                                                        <center> {translate('table.no_data')}</center>
                                                    </td> :
                                                    <React.Fragment>
                                                        <td rowSpan={roleAttributes.length + 1}>{roleRule}</td>

                                                    </React.Fragment>

                                            }

                                        </tr>
                                        {
                                            (!roleAttributes || roleAttributes.length <= 0) ? null :
                                                roleAttributes.map((attr, index) => {
                                                    return <tr key={index}>
                                                        <td>
                                                            {attribute.lists.map(a => a._id == attr.attributeId ? a.attributeName : "")}
                                                        </td>

                                                        <td style={{ textAlign: "left" }}>
                                                            {attr.value}
                                                        </td>
                                                    </tr>
                                                })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className={`form-group`}>
                                <label>{translate('manage_policy.resource_information')}:</label>
                                <table className="table table-hover table-bordered detail-policy-attribute-table not-sort">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_owner_table')}</label></th>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.rule_table')}</label></th>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_name')}</label></th>
                                            <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_value')}</label></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr>
                                            <td rowSpan={(!resourceAttributes || resourceAttributes.length == 0) ? 1 : resourceAttributes.length + 1}>
                                                {translate('manage_policy.resource_table')}
                                            </td>
                                            {
                                                (!resourceAttributes || resourceAttributes.length == 0) ?
                                                    <td colSpan={3}>
                                                        <center> {translate('table.no_data')}</center>
                                                    </td> :
                                                    <React.Fragment>
                                                        <td rowSpan={resourceAttributes.length + 1}>{resourceRule}</td>

                                                    </React.Fragment>

                                            }

                                        </tr>
                                        {
                                            (!resourceAttributes || resourceAttributes.length <= 0) ? null :
                                                resourceAttributes.map((attr, index) => {
                                                    return <tr key={index}>
                                                        <td>
                                                            {attribute.lists.map(a => a._id == attr.attributeId ? a.attributeName : "")}
                                                        </td>

                                                        <td style={{ textAlign: "left" }}>
                                                            {attr.value}
                                                        </td>
                                                    </tr>
                                                })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        <div id="satisfied_information" className="tab-pane">
                            <div className={`form-group`}>
                                <label>{translate('manage_policy.satisfied_subject')}:</label>
                                <table className="table table-hover table-bordered detail-policy-attribute-table not-sort">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed">{translate('manage_policy.index')}</th>
                                            <th >{translate('manage_policy.satisfied_subject_name')}</th>
                                            <th >{translate('manage_policy.satisfied_subject_email')}</th>
                                            <th >{translate('manage_policy.satisfied_subject_role')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {
                                            (!satisfiedSubjects || satisfiedSubjects.length <= 0) ? null :
                                                satisfiedSubjects.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td> {item.userId.name}
                                                        </td>
                                                        <td> {item.userId.email}
                                                        </td>
                                                        <td> {item.roleId.name}
                                                        </td>
                                                    </tr>
                                                })
                                        }
                                    </tbody>
                                </table>
                                {
                                    (!satisfiedSubjects || satisfiedSubjects.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>

                            <div className={`form-group`}>
                                <label>{translate('manage_policy.satisfied_resource')}:</label>
                                <table className="table table-hover table-bordered detail-policy-attribute-table not-sort">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed">{translate('manage_policy.index')}</th>
                                            <th >{translate('manage_policy.satisfied_resource_name')}</th>
                                            <th >{translate('manage_policy.satisfied_resource_type')}</th>
                                            <th >{translate('manage_policy.satisfied_resource_description')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {
                                            (!satisfiedResources || satisfiedResources.length <= 0) ? null :
                                                satisfiedResources.map((item, index) => {
                                                    return <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td> {item.resourceType == "Link" ? item.resourceId.url : item.resourceId.name}
                                                        </td>
                                                        <td> {item.resourceType}
                                                        </td>
                                                        <td> {item.resourceId.description}
                                                        </td>
                                                    </tr>
                                                })
                                        }
                                    </tbody>
                                </table>
                                {
                                    (!satisfiedResources || satisfiedResources.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>


            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { policy, attribute } = state;
    return { policy, attribute };
}

const connectedPolicyDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(PolicyDetailInfo)));
export { connectedPolicyDetailInfo as PolicyDetailInfo }