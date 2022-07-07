import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, AttributeTable } from '../../../../common-components';
import { AttributeAddForm } from "./attributeAddForm";
import './policyAttributeTable.css'
import ValidationHelper from '../../../../helpers/validationHelper';

function DelegationTab(props) {
    const [state, setState] = useState({
        delegatorAttributes: [],
        delegateeAttributes: [],
        delegatedObjectAttributes: [],
        resourceAttributes: [],
        delegatorRule: "",
        delegateeRule: "",
        delegatedObjectRule: "",
        resourceRule: "",
        delegateType: 'Role',
        policyID: ""
    })

    useEffect(() => {
        if (props.policyID !== state.policyID) {
            setState({
                ...state,
                policyID: props.policyID,
                delegatorAttributes: props.delegatorAttributes,
                delegateeAttributes: props.delegateeAttributes,
                delegatedObjectAttributes: props.delegatedObjectAttributes,
                resourceAttributes: props.resourceAttributes,
                delegatorRule: props.delegatorRule,
                delegateeRule: props.delegateeRule,
                delegatedObjectRule: props.delegatedObjectRule,
                resourceRule: props.resourceRule,
                delegateType: props.delegateType
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

    const handleDelegateTypeChange = (e) => {
        const { value } = e.target;
        handleChange('delegateType', value);
    }

    const { translate, attribute } = props;
    const { delegateType, delegatorRule, delegateeRule, delegatedObjectRule, resourceRule, delegatorAttributes, delegateeAttributes, delegatedObjectAttributes, resourceAttributes } = state;

    return (

        <div id={props.id} className="tab-pane">

            {/* Form thêm thông tin sự cố */}
            <AttributeAddForm
                handleChange={handleChange}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
                id={`${props.id}-delegator`}
                attributeOwner={'delegatorAttributes'}
                ruleOwner={'delegatorRule'}
                translation={'manage_delegation_policy.delegator'}
                policyID={state.policyID}
                attributes={state.delegatorAttributes}
                rule={state.delegatorRule}
            />

            <AttributeAddForm
                handleChange={handleChange}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
                id={`${props.id}-delegatee`}
                attributeOwner={'delegateeAttributes'}
                ruleOwner={'delegateeRule'}
                translation={'manage_delegation_policy.delegatee'}
                policyID={state.policyID}
                attributes={state.delegateeAttributes}
                rule={state.delegateeRule}
            />

            <AttributeAddForm
                handleChange={handleChange}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
                id={`${props.id}-delegatedObject`}
                attributeOwner={'delegatedObjectAttributes'}
                ruleOwner={'delegatedObjectRule'}
                translation={state.delegateType == 'Role' ? 'manage_delegation_policy.delegatedObject' : 'manage_delegation_policy.delegatedObjectTask'}
                policyID={state.policyID}
                attributes={state.delegatedObjectAttributes}
                rule={state.delegatedObjectRule}
            />

            <AttributeAddForm
                handleChange={handleChange}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
                id={`${props.id}-resource`}
                attributeOwner={'resourceAttributes'}
                ruleOwner={'resourceRule'}
                translation={'manage_delegation_policy.resource'}
                policyID={state.policyID}
                attributes={state.resourceAttributes}
                rule={state.resourceRule}
            />

            <div className="form-group row">
                <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12`}>
                    <label style={{ paddingLeft: '9px' }} className={`col-lg-3 col-md-3 col-ms-4 col-xs-4`}>{translate('manage_delegation_policy.delegateType')}:</label>
                    <div style={{ display: 'inline-block' }} className={`col-lg-9 col-md-9 col-ms-8 col-xs-8`}>
                        <div className="radio-inline ">
                            <label style={{ fontWeight: 'normal' }}>
                                <input type="radio" name={`delegateType${state?.policyID}`} value="Role" onChange={handleDelegateTypeChange} checked={state.delegateType == 'Role' ? true : false} />&nbsp;&nbsp;{translate('manage_delegation_policy.delegateTypeRole')}</label>
                        </div>
                        <div className="radio-inline " style={{ marginLeft: '38px' }}>
                            <label style={{ fontWeight: 'normal' }}>
                                <input type="radio" name={`delegateType${state?.policyID}`} value="Task" onChange={handleDelegateTypeChange} checked={state.delegateType === 'Task' ? true : false} />&nbsp;&nbsp;{translate('manage_delegation_policy.delegateTypeTask')}</label>
                        </div>
                    </div>
                </div>

            </div>

            <table className="table table-bordered policy-attribute-table not-sort">
                <thead>
                    <tr>
                        <th style={{ width: '23%' }}><label>{translate('manage_delegation_policy.attribute_owner_table')}</label></th>
                        <th style={{ width: '13%' }}><label>{translate('manage_delegation_policy.rule_table')}</label></th>
                        <th style={{ width: '34%' }}><label>{translate('manage_delegation_policy.attribute_name')}</label></th>
                        <th style={{ width: '17%' }}><label>{translate('manage_delegation_policy.attribute_value')}</label></th>
                        <th style={{ width: '13%', textAlign: 'center' }}>{translate('table.action')}</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td rowSpan={(!delegatorAttributes || delegatorAttributes.length == 0) ? 1 : delegatorAttributes.length}>
                            {translate('manage_delegation_policy.delegator_table')}
                        </td>
                        {
                            (!delegatorAttributes || delegatorAttributes.length == 0) ?
                                <td colSpan={3}>
                                    <center> {translate('table.no_data')}</center>
                                </td> :
                                <React.Fragment>
                                    <td rowSpan={delegatorAttributes.length}>{delegatorRule}</td>
                                    <td>{attribute.lists.map(a => a._id == delegatorAttributes[0].attributeId ? a.attributeName : "")}</td>
                                    <td>{delegatorAttributes[0].value}</td>
                                </React.Fragment>

                        }
                        <td rowSpan={(!delegatorAttributes || delegatorAttributes.length == 0) ? 1 : delegatorAttributes.length}>
                            {
                                (!delegatorAttributes || delegatorAttributes.length == 0) ?
                                    <a href="#add-attributes" className="text-green" onClick={() => window.$(`#modal-add-attribute-${props.id}-delegator`).modal('show')} title={translate('manage_delegation_policy.add_delegator_attribute')}><i className="material-icons">add_box</i></a>
                                    :
                                    <a onClick={() => window.$(`#modal-add-attribute-${props.id}-delegator`).modal('show')} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation_policy.edit_delegator_attribute')}>
                                        <i className="material-icons">edit</i>
                                    </a>}
                        </td>
                    </tr>
                    {
                        (!delegatorAttributes || delegatorAttributes.length <= 1) ? null :
                            delegatorAttributes.slice(1).map((attr, index) => {
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
                        <td rowSpan={(!delegateeAttributes || delegateeAttributes.length == 0) ? 1 : delegateeAttributes.length}>
                            {translate('manage_delegation_policy.delegatee_table')}
                        </td>
                        {
                            (!delegateeAttributes || delegateeAttributes.length == 0) ?
                                <td colSpan={3}>
                                    <center> {translate('table.no_data')}</center>
                                </td> :
                                <React.Fragment>
                                    <td rowSpan={delegateeAttributes.length}>{delegateeRule}</td>
                                    <td>{attribute.lists.map(a => a._id == delegateeAttributes[0].attributeId ? a.attributeName : "")}</td>
                                    <td>{delegateeAttributes[0].value}</td>
                                </React.Fragment>

                        }
                        <td rowSpan={(!delegateeAttributes || delegateeAttributes.length == 0) ? 1 : delegateeAttributes.length}>
                            {
                                (!delegateeAttributes || delegateeAttributes.length == 0) ?
                                    <a href="#add-attributes" className="text-green" onClick={() => window.$(`#modal-add-attribute-${props.id}-delegatee`).modal('show')} title={translate('manage_delegation_policy.add_delegatee_attribute')}><i className="material-icons">add_box</i></a>
                                    :
                                    <a onClick={() => window.$(`#modal-add-attribute-${props.id}-delegatee`).modal('show')} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation_policy.edit_delegatee_attribute')}>
                                        <i className="material-icons">edit</i>
                                    </a>}
                        </td>
                    </tr>
                    {
                        (!delegateeAttributes || delegateeAttributes.length <= 1) ? null :
                            delegateeAttributes.slice(1).map((attr, index) => {
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
                        <td rowSpan={(!delegatedObjectAttributes || delegatedObjectAttributes.length == 0) ? 1 : delegatedObjectAttributes.length}>
                            {delegateType == 'Role' ? translate('manage_delegation_policy.delegatedObject_table') : translate('manage_delegation_policy.delegatedObject_tableTask')}
                        </td>
                        {
                            (!delegatedObjectAttributes || delegatedObjectAttributes.length == 0) ?
                                <td colSpan={3}>
                                    <center> {translate('table.no_data')}</center>
                                </td> :
                                <React.Fragment>
                                    <td rowSpan={delegatedObjectAttributes.length}>{delegatedObjectRule}</td>
                                    <td>{attribute.lists.map(a => a._id == delegatedObjectAttributes[0].attributeId ? a.attributeName : "")}</td>
                                    <td>{delegatedObjectAttributes[0].value}</td>
                                </React.Fragment>

                        }
                        <td rowSpan={(!delegatedObjectAttributes || delegatedObjectAttributes.length == 0) ? 1 : delegatedObjectAttributes.length}>
                            {
                                (!delegatedObjectAttributes || delegatedObjectAttributes.length == 0) ?
                                    <a href="#add-attributes" className="text-green" onClick={() => window.$(`#modal-add-attribute-${props.id}-delegatedObject`).modal('show')} title={delegateType == 'Role' ? translate('manage_delegation_policy.add_delegatedObject_attribute') : translate('manage_delegation_policy.add_delegatedObject_attributeTask')}><i className="material-icons">add_box</i></a>
                                    :
                                    <a onClick={() => window.$(`#modal-add-attribute-${props.id}-delegatedObject`).modal('show')} className="edit text-yellow" style={{ width: '5px' }} title={delegateType == 'Role' ? translate('manage_delegation_policy.edit_delegatedObject_attribute') : translate('manage_delegation_policy.edit_delegatedObject_attributeTask')}>
                                        <i className="material-icons">edit</i>
                                    </a>}
                        </td>
                    </tr>
                    {
                        (!delegatedObjectAttributes || delegatedObjectAttributes.length <= 1) ? null :
                            delegatedObjectAttributes.slice(1).map((attr, index) => {
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

                    {delegateType == 'Role' ?
                        <tr>
                            <td rowSpan={(!resourceAttributes || resourceAttributes.length == 0) ? 1 : resourceAttributes.length}>
                                {translate('manage_delegation_policy.resource_table')}
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
                            <td rowSpan={(!resourceAttributes || resourceAttributes.length == 0) ? 1 : resourceAttributes.length}>
                                {
                                    (!resourceAttributes || resourceAttributes.length == 0) ?
                                        <a href="#add-attributes" className="text-green" onClick={() => window.$(`#modal-add-attribute-${props.id}-resource`).modal('show')} title={translate('manage_delegation_policy.add_resource_attribute')}><i className="material-icons">add_box</i></a>
                                        :
                                        <a onClick={() => window.$(`#modal-add-attribute-${props.id}-resource`).modal('show')} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation_policy.edit_resource_attribute')}>
                                            <i className="material-icons">edit</i>
                                        </a>}
                            </td>
                        </tr> : null
                    }
                    {delegateType == 'Role' ?
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
                        : null
                    }
                </tbody>
            </table>

            {/* <AttributeTable
                attributes={userAttributes}
                handleChange={handleChange}
                attributeOwner={'userAttributes'}
                translation={'manage_delegation_policy.user'}
                noDescription={true}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
            />

            <AttributeTable
                attributes={roleAttributes}
                handleChange={handleChange}
                attributeOwner={'roleAttributes'}
                translation={'manage_delegation_policy.role'}
                noDescription={true}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
            /> */}
        </div>
    );
};

function mapState(state) {
    const { policyDelegation, attribute } = state;
    return { policyDelegation, attribute };
};

const actionCreators = {

};
const delegationTab = connect(mapState, actionCreators)(withTranslate(DelegationTab));
export { delegationTab as DelegationTab };
