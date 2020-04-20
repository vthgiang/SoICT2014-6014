import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleDefaultActions } from '../../root-role/redux/actions';
import { ComponentDefaultActions } from '../redux/actions';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { LinkDefaultActions } from '../../providing-link/redux/actions';
import { ComponentDefaultValidator } from './providingComponentValidator';

class ComponentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    render() { 
        const { translate, rolesDefault, linksDefault } = this.props;
        const { componentNameError, componentDescriptionError } = this.state;

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-component" button_name={translate('manage_component.add')} title={translate('manage_component.add_title')}/>
                <DialogModal
                    modalID="modal-create-component"
                    formID="form-create-component"
                    title={translate('manage_component.add_title')}
                    msg_success={translate('manage_component.add_success')}
                    msg_faile={translate('manage_component.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-component">
                    <div className={`form-group ${componentNameError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_component.name') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                            <ErrorLabel content={componentNameError}/>
                        </div>
                        <div className={`form-group ${componentDescriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_component.description') }</label>
                            <input type="text" className="form-control" onChange={this.handleDescription} />
                            <ErrorLabel content={componentDescriptionError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.link') }</label>
                            {
                                linksDefault.list.length > 0 &&
                                <SelectBox
                                    id={`select-component-default-link`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {
                                        linksDefault.list.map( link => {return {value: link._id, text: link.url}})
                                    }
                                    onChange={this.handleLink}
                                    multiple={false}
                                />
                            }
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_component.roles') }</label>
                            <SelectBox
                                id={`select-component-default-roles`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    rolesDefault.list.map( role => {return {value: role._id, text: role.name}})
                                }
                                onChange={this.handleRoles}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }


    // Xy ly va validate name
    handleName = (e) => {
        const {value} = e.target;
        this.validateName(value, true);
    }
    validateName = (value, willUpdateState=true) => {
        let msg = ComponentDefaultValidator.validateName(value);
        if (willUpdateState){
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
        if(this.isFormValidated()) return this.props.createComponent(component);
    }

    componentDidMount(){
        this.props.getRole();
        this.props.getLink();
    }
}
 
const mapState = state => state;
const getState = {
    getRole: RoleDefaultActions.get,
    getLink: LinkDefaultActions.get,
    createComponent: ComponentDefaultActions.create
}
 
export default connect(mapState, getState) (withTranslate(ComponentCreateForm));
