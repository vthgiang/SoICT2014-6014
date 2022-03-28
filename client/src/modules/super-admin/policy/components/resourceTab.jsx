import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, AttributeTable } from '../../../../common-components';
import { AttributeAddForm } from "./attributeAddForm";
// import { AttributeEditForm } from "./attributeEditForm";
import ValidationHelper from '../../../../helpers/validationHelper';

function ResourceTab(props) {
    const [state, setState] = useState({
        resourceAttributes: [],
        resourceRule: ""
    })

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
    const { resourceAttributes, resourceRule } = state;

    return (
        <div id={props.id} className="tab-pane">

            {/* Form thêm thông tin sự cố */}
            <AttributeAddForm
                handleChange={handleChange}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={props.i}
                id={`resource`}
                attributeOwner={'resourceAttributes'}
                ruleOwner={'resourceRule'}
                translation={'manage_policy.resource'}
            />

            <table className="table table-hover table-bordered">
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
                        <td rowSpan={(!resourceAttributes || resourceAttributes.length == 0) ? 1 : resourceAttributes.length}>
                            {
                                (!resourceAttributes || resourceAttributes.length == 0) ?
                                    <a href="#add-attributes" className="text-green" onClick={() => window.$('#modal-add-attribute-resource').modal('show')} title={translate('manage_policy.add_resource_attribute')}><i className="material-icons">add_box</i></a>
                                    :
                                    <a onClick={() => window.$('#modal-add-attribute-resource').modal('show')} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_policy.edit_resource_attribute')}>
                                        <i className="material-icons">edit</i>
                                    </a>}
                        </td>
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
const resourceTab = connect(mapState, actionCreators)(withTranslate(ResourceTab));
export { resourceTab as ResourceTab };
