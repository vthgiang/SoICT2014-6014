import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleDefaultActions } from '../../roles-default-management/redux/actions';
import { LinkDefaultActions } from '../redux/actions';
import {ModalDialog, ErrorLabel, SelectBox} from '../../../../common-components';
import {LinkDefaultValidator} from './LinkDefaultValidator';

class LinkInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { translate, rolesDefault } = this.props;
        const {linkId, linkUrl, linkDescription, linkRoles, linkUrlError, linkDescriptionError} = this.state;
        console.log("link: ", this.state)

        return ( 
            <ModalDialog
                size='50' func={this.save} isLoading={this.props.linksDefault.isLoading}
                modalID="modal-edit-link-default"
                formID="form-edit-link-default"
                title={translate('manage_user.edit')}
                msg_success={translate('manage_user.edit_success')}
                msg_faile={translate('manage_user.edit_faile')}
                disableSubmit={!this.isFormValidated()}
            >
                <form id="form-edit-link-default">
                    <div className={`form-group ${linkUrlError===undefined?"":"has-error"}`}>
                        <label>{ translate('manage_link.url') }<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={linkUrl} onChange={this.handleUrl}/>
                        <ErrorLabel content={linkUrlError}/>
                    </div>
                    <div className={`form-group ${linkDescriptionError===undefined?"":"has-error"}`}>
                        <label>{ translate('manage_link.description') }<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={linkDescription} onChange={this.handleDescription}/>
                        <ErrorLabel content={linkDescriptionError}/>
                    </div>
                    <div className="form-group">
                        <label>{ translate('manage_link.roles') }</label>
                        <SelectBox
                            id={`select-link-default-roles-${linkId}`}
                            className="form-control select2"
                            style={{width: "100%"}}
                            items = {
                                rolesDefault.list.map( role => {return {value: role._id, text: role.name}})
                            }
                            onChange={this.handleRoles}
                            value={linkRoles}
                            multiple={true}
                        />
                    </div>
                </form>
            </ModalDialog>
         );
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.linkId !== prevState.linkId) {
            return {
                ...prevState,
                linkId: nextProps.linkId,
                linkUrl: nextProps.linkUrl,
                linkDescription: nextProps.linkDescription,
                linkRoles: nextProps.linkRoles,
                linkUrlError: undefined,
                linkDescriptionError: undefined
            } 
        } else {
            return null;
        }
    }

    // Xy ly va validate role name
    handleUrl = (e) => {
        const {value} = e.target;
        console.log("url value: ", value)
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
        const {linkId, linkUrl, linkDescription, linkRoles} = this.state;
        if(this.isFormValidated())
            return this.props.editLink(linkId, {
                url: linkUrl,
                description: linkDescription,
                roles: linkRoles
            });
    }

    componentDidMount(){
        this.props.getRole();
    }
}
 
const mapState = state => state;
const getState = {
    getRole: RoleDefaultActions.get,
    editLink: LinkDefaultActions.edit
}
 
export default connect(mapState, getState) (withTranslate(LinkInfoForm));