import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RootRoleActions } from '../../root-role/redux/actions';
import { SystemComponentActions } from '../redux/actions';
import { SystemLinkActions } from '../../system-link/redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

class ComponentCreateForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            componentName: '',
            componentDescription: '',
            componentLink: undefined,
            componentRoles: []
        }
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        this.props.getAllRootRoles();
        this.props.getAllSystemLinks();
    }

    handleName = (e) => {
        let {value} = e.target;
        this.setState({ componentName: value });

        let {translate} = this.props;
        let {msg} = ValidationHelper.validateName(value, 6, 255);
        let error = msg ? translate(msg, {min: 6, max: 255}) : undefined;
        this.setState({ componentNameError: error})
    }

    handleDescription = (e) => {
        let {value} = e.target;
        this.setState({ componentDescription: value });

        let {translate} = this.props;
        let {msg} = ValidationHelper.validateDescription(value);
        let error = msg ? translate(msg) : undefined;
        this.setState({ componentDescriptionError: error})
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
        let {componentName, componentDescription} = this.state;
        if(!ValidationHelper.validateName(componentName).status  || !ValidationHelper.validateDescription(componentDescription).status) return false;
        return true;
    }

    save = () => {
        const component = { 
            name: this.state.componentName, 
            description: this.state.componentDescription, 
            links: this.state.componentLink,
            roles: this.state.componentRoles 
        };

        if (this.isFormValidated()) return this.props.createSystemComponent(component);
    }

    render() { 
        const { translate, rootRoles, systemLinks } = this.props;
        const { componentLink, componentNameError, componentDescriptionError } = this.state;

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-component" button_name={translate('manage_component.add')} title={translate('manage_component.add_title')}/>
                <DialogModal
                    modalID="modal-create-component"
                    formID="form-create-component"
                    title={translate('manage_component.add_title')}
                    func={this.save} disableSubmit={!this.isFormValidated()}
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
                                systemLinks.list.length > 0 &&
                                <SelectBox
                                    id={`select-component-default-link`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {
                                        systemLinks.list.map( link => {return {value: link._id, text: link.url}})
                                    }
                                    value={componentLink}
                                    onChange={this.handleLink}
                                    options={{placeholder: translate('system_admin.system_component.select_link')}}
                                    multiple={true}
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
                                    rootRoles.list.map( role => {return {value: role._id, text: role.name}})
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
}
 
function mapState(state) {
    const { rootRoles, systemLinks } = state;
    return { rootRoles, systemLinks }
}
const actions = {
    getAllRootRoles: RootRoleActions.getAllRootRoles,
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks,
    createSystemComponent: SystemComponentActions.createSystemComponent
}
 
const connectedComponentCreateForm = connect(mapState, actions)(withTranslate(ComponentCreateForm))
export { connectedComponentCreateForm as ComponentCreateForm }
