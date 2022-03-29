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
        if (props.policyID !== policyID || props.curentRowDetail != state.curentRowDetail) {
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
                resourceRule: props.resourceRule
            })
        }
    }, [props.policyID, props.curentRowDetail])

    const { policyName, description, userRule, roleRule, resourceRule, userAttributes, roleAttributes, resourceAttributes } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-policy-hooks`} isLoading={policy.isLoading}
                title={translate('manage_policy.detail_info_policy')}
                formID={`form-detail-policy-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
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
                                <td rowSpan={(!userAttributes || userAttributes.length == 0) ? 1 : userAttributes.length}>
                                    {translate('manage_policy.user_table')}
                                </td>
                                {
                                    (!userAttributes || userAttributes.length == 0) ?
                                        <td colSpan={3}>
                                            <center> {translate('table.no_data')}</center>
                                        </td> :
                                        <React.Fragment>
                                            <td rowSpan={userAttributes.length}>{userRule}</td>
                                            <td>{attribute.lists.map(a => a._id == userAttributes[0].attributeId ? a.attributeName : "")}</td>
                                            <td>{userAttributes[0].value}</td>
                                        </React.Fragment>

                                }

                            </tr>
                            {
                                (!userAttributes || userAttributes.length <= 1) ? null :
                                    userAttributes.slice(1).map((attr, index) => {
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
                                <td rowSpan={(!roleAttributes || roleAttributes.length == 0) ? 1 : roleAttributes.length}>
                                    {translate('manage_policy.role_table')}
                                </td>
                                {
                                    (!roleAttributes || roleAttributes.length == 0) ?
                                        <td colSpan={3}>
                                            <center> {translate('table.no_data')}</center>
                                        </td> :
                                        <React.Fragment>
                                            <td rowSpan={roleAttributes.length}>{roleRule}</td>
                                            <td>{attribute.lists.map(a => a._id == roleAttributes[0].attributeId ? a.attributeName : "")}</td>
                                            <td>{roleAttributes[0].value}</td>
                                        </React.Fragment>

                                }

                            </tr>
                            {
                                (!roleAttributes || roleAttributes.length <= 1) ? null :
                                    roleAttributes.slice(1).map((attr, index) => {
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
                                <td rowSpan={(!resourceAttributes || resourceAttributes.length == 0) ? 1 : resourceAttributes.length}>
                                    {translate('manage_policy.resource_table')}
                                </td>
                                {
                                    (!resourceAttributes || resourceAttributes.length == 0) ?
                                        <td colSpan={3}>
                                            <center> {translate('table.no_data')}</center>
                                        </td> :
                                        <React.Fragment>
                                            <td rowSpan={resourceAttributes.length}>{resourceRule}</td>
                                            <td>{attribute.lists.map(a => a._id == resourceAttributes[0].attributeId ? a.attributeName : "")}</td>
                                            <td>{resourceAttributes[0].value}</td>
                                        </React.Fragment>

                                }

                            </tr>
                            {
                                (!resourceAttributes || resourceAttributes.length <= 1) ? null :
                                    resourceAttributes.slice(1).map((attr, index) => {
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