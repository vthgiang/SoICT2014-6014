import React, { Component } from 'react';
import {connect} from 'react-redux';

import { SystemComponentActions } from '../redux/actions';

import { ComponentDefaultValidator } from './systemComponentValidator';

import { DialogModal, ErrorLabel, SelectBox} from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';
class ComponentInfoForm extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.componentId !== prevState.componentId) {
            return {
                ...prevState,
                componentId: nextProps.componentId,
                componentName: nextProps.componentName,
                componentDescription: nextProps.componentDescription,
                componentRoles: nextProps.componentRoles,
                componentLink: nextProps.componentLink,
                componentNameError: undefined,
                componentDescriptionError: undefined
            } 
        } else {
            return null;
        }
    }

    // Xy ly va validate name
    handleName = (e) => {
        const {value} = e.target;
        this.validateName(value, true);
    }

    validateName = (value, willUpdateState=true) => {
        let msg = ComponentDefaultValidator.validateName(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    componentNameError: msg,
                    componentName: value,
                }
            });
        }

        return msg === undefined;
    }

    // Xy ly va validate description
    handleDescription = (e) => {
        const {value} = e.target;
        this.validateDescription(value, true);
    }

    validateDescription = (value, willUpdateState=true) => {
        let msg = ComponentDefaultValidator.validateDescription(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    componentDescriptionError: msg,
                    componentDescription: value,
                }
            });
        }

        return msg === undefined;
    }

    handleLink = (value) => {
        this.setState(state => {
            return {
                ...state,
                componentLink: value
            }
        })
    }

    handleRoles = (value) => {
        this.setState(state => {
            return {
                ...state,
                componentRoles: value
            }
        })
    }

    isFormValidated = () => {
        let result = 
            this.validateName(this.state.componentName, false) &&
            this.validateDescription(this.state.componentDescription, false);

        return result;
    }

    save = () => {
        const component = { 
            name: this.state.componentName, 
            description: this.state.componentDescription, 
            link: this.state.componentLink,
            roles: this.state.componentRoles 
        };

        if(this.isFormValidated()) return this.props.editSystemComponent(this.state.componentId, component);
    }

    render() { 
        const { translate, linksDefault, rootRoles } = this.props;
        const { componentId, componentName, componentDescription, componentLink, componentRoles, componentNameError, componentDescriptionError } = this.state;

        return ( 
            <React.Fragment>
                <DialogModal
                    size='50' func={this.save}
                    modalID="modal-edit-component-default"
                    formID="form-edit-component-default"
                    title={translate('manage_component.edit')}
                    msg_success={translate('manage_component.edit_success')}
                    msg_faile={translate('manage_component.edit_faile')}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-component-default">
                        <div className={`form-group ${componentNameError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_component.name') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={componentName} onChange={this.handleName} />
                            <ErrorLabel content={componentNameError}/>
                        </div>
                        <div className={`form-group ${componentDescriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_component.description') }</label>
                            <input type="text" className="form-control" value={componentDescription} onChange={this.handleDescription} />
                            <ErrorLabel content={componentDescriptionError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.link') }</label>
                            {
                                linksDefault.list.length > 0 &&
                                <SelectBox
                                    id={`select-component-default-link-${componentId}`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {
                                        linksDefault.list.map( link => {return {value: link._id, text: link.url}})
                                    }
                                    options={{placeholder: translate('system_admin.system_component.select_link')}}
                                    onChange={this.handleLink}
                                    value={componentLink}
                                    multiple={false}
                                />
                            }
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.roles') }</label>
                            <SelectBox
                                id={`select-component-default-roles-${componentId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    rootRoles.list.map( role => {return {value: role._id, text: role.name}})
                                }
                                onChange={this.handleRoles}
                                value={componentRoles}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
function mapState(state) {
    const { linksDefault, rootRoles } = state;
    return { linksDefault, rootRoles }
}
const actions = {
    editSystemComponent: SystemComponentActions.editSystemComponent
}
 
const connectedComponentInfoForm = connect(mapState, actions)(withTranslate(ComponentInfoForm));
export { connectedComponentInfoForm as ComponentInfoForm }