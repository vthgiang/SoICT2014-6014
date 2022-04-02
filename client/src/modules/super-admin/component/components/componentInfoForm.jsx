import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentActions } from '../redux/actions';
import { AttributeActions } from '../../attribute/redux/actions';
import { DialogModal, ErrorLabel, SelectBox, AttributeTable } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
function ComponentInfoForm(props) {
    const [state, setState] = useState({})

    const handleComponentDescription = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateDescription(translate, value);
        setState({
            ...state,
            componentDescription: value,
            componentDescriptionError: message
        });
    }

    const handleComponentLink = (value) => {
        setState({
            ...state,
            componentLink: value[0]
        });
    }

    const handleComponentRoles = (value) => {
        setState({
            ...state,
            componentRoles: value
        });
    }

    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    const handleChangeAddRowAttribute = (name, value) => {
        props.handleChangeAddRowAttribute(name, value)
    }

    const validateAttributes = () => {
        var componentAttributes = state.componentAttributes;
        let result = true;

        if (componentAttributes.length !== 0) {

            for (let n in componentAttributes) {
                if (!ValidationHelper.validateEmpty(props.translate, componentAttributes[n].attributeId).status || !ValidationHelper.validateEmpty(props.translate, componentAttributes[n].value).status) {
                    result = false;
                    break;
                }
            }
        }
        console.log(result);
        return result;
    }

    useEffect(() => {
        props.getAttribute();
    }, [])

    const save = () => {
        var keys_to_keep = ['attributeId', 'value', 'description']

        const component = {
            name: state.componentName,
            description: state.componentDescription,
            roles: state.componentRoles,
            attributes: state.componentAttributes.map(element => Object.assign({}, ...keys_to_keep.map(key => ({ [key]: element[key] }))))
        };

        if (isFormValidated()) {
            return props.editComponent(state.componentId, component);
        }
    }

    const isFormValidated = () => {
        let { componentDescription } = state;
        let { translate } = props;
        if (!ValidationHelper.validateDescription(translate, componentDescription).status || !validateAttributes()) return false;
        return true;
    }


    // Thiet lap cac gia tri tu props vao state
    useEffect(() => {
        if (props.componentId !== state.componentId || props.componentAttributes !== state.componentAttributes) {
            setState({
                ...state,
                componentId: props.componentId,
                componentName: props.componentName,
                componentLink: props.componentLink,
                componentDescription: props.componentDescription,
                componentRoles: props.componentRoles,
                componentDescriptionError: undefined,
                componentAttributes: props.componentAttributes.map((a, index) => a = { ...a, addOrder: index + props.componentId })

            })
        }
    }, [props.componentId, props.componentAttributes])

    const { translate, role, link } = props;
    const { componentId, componentName, componentDescription, componentLink, componentRoles, componentDescriptionError, componentAttributes } = state;

    return (
        <React.Fragment>
            <DialogModal
                func={save}
                modalID="modal-edit-component"
                formID="form-edit-component"
                title={translate('manage_component.edit')}
                disableSubmit={!isFormValidated()}
            >

                {/* Form chỉnh sửa thông tin về component */}
                <form id="form-edit-component">

                    {/* Tên của component */}
                    <div className="form-group">
                        <label>{translate('table.name')}<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={componentName} disabled />
                    </div>

                    {/* Thuộc về trang nào */}
                    <div className="form-group">
                        <label>{translate('manage_component.link')}</label>
                        <SelectBox
                            id={`component-link-${componentId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={link.list.map(link => { return { value: link.id, text: link.url } })}
                            onChange={handleComponentLink}
                            value={componentLink}
                            multiple={true}
                            disabled={true}
                        />
                    </div>

                    {/* Mô tả về component	 */}
                    <div className={`form-group ${!componentDescriptionError ? "" : "has-error"}`}>
                        <label>{translate('table.description')}<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={componentDescription} onChange={handleComponentDescription} />
                        <ErrorLabel content={componentDescriptionError} />
                    </div>

                    {/* Những role có component này */}
                    <div className="form-group">
                        <label>{translate('manage_component.roles')}</label>
                        <SelectBox
                            id={`component-roles-${componentId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })}
                            onChange={handleComponentRoles}
                            value={componentRoles}
                            multiple={true}
                        />
                    </div>

                    {/* Các thuộc tính của phân quyền */}
                    <AttributeTable
                        attributes={componentAttributes}
                        handleChange={handleChange}
                        attributeOwner={'componentAttributes'}
                        translation={'manage_component'}
                        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                        i={props.i}
                    />
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { role, link } = state;
    return { role, link };
}

const getState = {
    editComponent: ComponentActions.edit,
    getAttribute: AttributeActions.getAttributes
}

export default connect(mapState, getState)(withTranslate(ComponentInfoForm));
