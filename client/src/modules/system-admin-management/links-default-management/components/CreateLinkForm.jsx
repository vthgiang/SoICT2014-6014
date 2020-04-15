import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleDefaultActions } from '../../roles-default-management/redux/actions';
import { LinkDefaultActions } from '../redux/actions';
import { ModalDialog, ModalButton, ErrorLabel, SelectBox } from '../../../../common-components';
import { LinkDefaultValidator } from './LinkDefaultValidator';

class CreateLinkForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    render() { 
        const { translate, rolesDefault, linksDefault } = this.props;
        const {linkUrl, linkCategory, linkDescription, linkRoles, linkUrlError, linkDescriptionError} = this.state;
        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-page" button_name={translate('manage_link.add')} title={translate('manage_link.add_title')}/>
                <ModalDialog
                    modalID="modal-create-page"
                    formID="form-create-page"
                    title={translate('manage_link.add_title')}
                    msg_success={translate('manage_link.add_success')}
                    msg_faile={translate('manage_link.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-page">
                        <div className={`form-group ${linkUrlError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_link.url') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleUrl}/>
                            <ErrorLabel content={linkUrlError}/>
                        </div>
                        <div className={`form-group ${linkDescriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_link.description') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleDescription}/>
                            <ErrorLabel content={linkDescriptionError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_link.category') }<span className="text-red"> * </span></label>
                            <SelectBox
                                id={`select-link-default-category`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    linksDefault.categories.map( category => {return {value: category.name, text: category.name+"-"+category.description}})
                                }
                                onChange={this.handleCategory}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_link.roles') }</label>
                            <SelectBox
                                id={`select-link-default-roles`}
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
                </ModalDialog>
            </React.Fragment>
         );
    }
    
    // Xy ly va validate role name
    handleUrl = (e) => {
        const {value} = e.target;
        this.validateUrl(value, true);
    }
    validateUrl = (value, willUpdateState=true) => {
        let msg = LinkDefaultValidator.validateUrl(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    linkUrlError: msg,
                    linkUrl: value,
                }
            });
        }
        return msg === undefined;
    }

    // Xy ly va validate role name
    handleDescription = (e) => {
        const {value} = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState=true) => {
        let msg = LinkDefaultValidator.validateDescription(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    linkDescriptionError: msg,
                    linkDescription: value,
                }
            });
        }
        return msg === undefined;
    }

    handleCategory = (value) => {
        this.setState(state => {
            return {
                ...state,
                linkCategory: value
            }
        })
    }

    handleRoles = (value) => {
        this.setState(state => {
            return {
                ...state,
                linkRoles: value
            }
        })
    }

    isFormValidated = () => {
        let result = 
            this.validateUrl(this.state.linkUrl, false) &&
            this.validateDescription(this.state.linkDescription, false);
        return result;
    }

    save = () => {
        const {linkUrl, linkDescription, linkRoles, linkCategory} = this.state;
        if(this.isFormValidated())
            return this.props.createLink({
                url: linkUrl,
                description: linkDescription,
                roles: linkRoles,
                category: linkCategory
            });
    }

    componentDidMount(){
        this.props.getRole();
    }
}
 
const mapState = state => state;
const getState = {
    getRole: RoleDefaultActions.get,
    createLink: LinkDefaultActions.create
}
 
export default connect(mapState, getState) (withTranslate(CreateLinkForm));
