import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentActions } from '../redux/actions';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { ComponentValidator} from './componentValidator';

class ComponentInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { translate, role } = this.props;
        const {componentId, componentName, componentDescription, componentRoles, componentDescriptionError} = this.state;
        return ( 
            <React.Fragment><DialogModal
                    size='50' func={this.save}
                    modalID="modal-edit-component"
                    formID="form-edit-component"
                    title={translate('manage_component.edit')}
                    msg_success={translate('manage_component.edit_success')}
                    msg_faile={translate('manage_component.edit_faile')}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-component">
                        <div className="form-group">
                            <label>{ translate('table.name') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" value={componentName} disabled/>
                        </div>
                        <div className={`form-group ${componentDescriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('table.description') }</label>
                            <input type="text" className="form-control" value={componentDescription} onChange={this.handleDescription} />
                            <ErrorLabel content={componentDescriptionError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.roles') }</label>
                            <SelectBox
                                id={`component-roles-${componentId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {role.list.map( role => {return {value: role._id, text: role.name}})}
                                onChange={this.handleComponentRoles}
                                value={componentRoles}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }

    // Xy ly va validate role name
    handleDescription = (e) => {
        const {value} = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState=true) => {
        let msg = ComponentValidator.validateDescription(value);
        if (willUpdateState){
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

    handleComponentRoles = (value) => {
        this.setState({
            componentRoles: value
        });
    }

    save = () => {
        const component = {
            name: this.state.componentName,
            description: this.state.componentDescription,
            roles: this.state.componentRoles
        };

        if(this.isFormValidated()) return this.props.editComponent(this.state.componentId, component);
    }

    isFormValidated = () => {
        let result = this.validateDescription(this.state.componentDescription, false);
        return result;
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
                componentDescriptionError: undefined,
            } 
        } else {
            return null;
        }
    }
}
 
const mapState = state => state;
const getState = {
    editComponent: ComponentActions.edit
}
 
export default connect(mapState, getState) (withTranslate(ComponentInfoForm));