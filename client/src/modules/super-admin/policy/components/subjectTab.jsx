import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, AttributeTable } from '../../../../common-components';
import { AttributeAddForm } from "./attributeAddForm";
import './policyAttributeTable.css'
import ValidationHelper from '../../../../helpers/validationHelper';

function SubjectTab(props) {
    const [state, setState] = useState({
        userAttributes: [],
        roleAttributes: [],
        userRule: "",
        roleRule: "",
    })

    useEffect(() => {
        if (props.policyID !== state.policyID) {
            setState({
                ...state,
                policyID: props.policyID,
                userAttributes: props.userAttributes,
                roleAttributes: props.roleAttributes,
                userRule: props.userRule,
                roleRule: props.roleRule,
            })
        }
    }, [props.policyID])

    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
        props.handleChange(name, value);
    }

    console.log(state)

    const handleChangeAddRowAttribute = (name, value) => {
        props.handleChangeAddRowAttribute(name, value)
    }

    const { translate, attribute } = props;
    const { userAttributes, roleAttributes, userRule, roleRule } = state;

    return (
        <div id={props.id} className="tab-pane">

            {/* Form thêm thông tin sự cố */}
            <AttributeAddForm
                handleChange={handleChange}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
                id={`${props.id}-user`}
                attributeOwner={'userAttributes'}
                ruleOwner={'userRule'}
                translation={'manage_policy.user'}
                policyID={state.policyID}
                attributes={state.userAttributes}
                rule={state.userRule}
            />

            <AttributeAddForm
                handleChange={handleChange}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
                id={`${props.id}-role`}
                attributeOwner={'roleAttributes'}
                ruleOwner={'roleRule'}
                translation={'manage_policy.role'}
                policyID={state.policyID}
                attributes={state.roleAttributes}
                rule={state.roleRule}
            />

            <table className="table table-bordered policy-attribute-table not-sort">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_owner_table')}</label></th>
                        <th style={{ width: '20%' }}><label>{translate('manage_policy.rule_table')}</label></th>
                        <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_name')}</label></th>
                        <th style={{ width: '20%' }}><label>{translate('manage_policy.attribute_value')}</label></th>
                        <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}</th>
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
                        <td rowSpan={(!userAttributes || userAttributes.length == 0) ? 1 : userAttributes.length}>
                            {
                                (!userAttributes || userAttributes.length == 0) ?
                                    <a href="#add-attributes" className="text-green" onClick={() => window.$(`#modal-add-attribute-${props.id}-user`).modal('show')} title={translate('manage_policy.add_user_attribute')}><i className="material-icons">add_box</i></a>
                                    :
                                    <a onClick={() => window.$(`#modal-add-attribute-${props.id}-user`).modal('show')} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_policy.edit_user_attribute')}>
                                        <i className="material-icons">edit</i>
                                    </a>}
                        </td>
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
                        <td rowSpan={(!roleAttributes || roleAttributes.length == 0) ? 1 : roleAttributes.length}>
                            {
                                (!roleAttributes || roleAttributes.length == 0) ?
                                    <a href="#add-attributes" className="text-green" onClick={() => window.$(`#modal-add-attribute-${props.id}-role`).modal('show')} title={translate('manage_policy.add_role_attribute')}><i className="material-icons">add_box</i></a>
                                    :
                                    <a onClick={() => window.$(`#modal-add-attribute-${props.id}-role`).modal('show')} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_policy.edit_role_attribute')}>
                                        <i className="material-icons">edit</i>
                                    </a>}
                        </td>
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

            {/* <AttributeTable
                attributes={userAttributes}
                handleChange={handleChange}
                attributeOwner={'userAttributes'}
                translation={'manage_policy.user'}
                noDescription={true}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
            />

            <AttributeTable
                attributes={roleAttributes}
                handleChange={handleChange}
                attributeOwner={'roleAttributes'}
                translation={'manage_policy.role'}
                noDescription={true}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
            /> */}
        </div>
    );
};

function mapState(state) {
    const { policy, attribute } = state;
    return { policy, attribute };
};

const actionCreators = {

};
const subjectTab = connect(mapState, actionCreators)(withTranslate(SubjectTab));
export { subjectTab as SubjectTab };
