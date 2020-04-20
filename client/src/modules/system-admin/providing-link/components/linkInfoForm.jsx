import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleDefaultActions } from '../../root-role/redux/actions';
import { LinkDefaultActions } from '../redux/actions';
import {DialogModal, ErrorLabel, SelectBox} from '../../../../common-components';
import {LinkDefaultValidator} from './providingLinkValidator';

class LinkInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { translate, rolesDefault, linksDefault } = this.props;
        const {linkId, linkUrl, linkCategory, linkDescription, linkRoles, linkUrlError, linkDescriptionError} = this.state;
        console.log("state link: ", this.state)
        return ( 
            <DialogModal
                size='50' func={this.save} isLoading={this.props.linksDefault.isLoading}
                modalID="modal-edit-link-default"
                formID="form-edit-link-default"
                title={translate('manage_link.edit')}
                msg_success={translate('manage_link.edit_success')}
                msg_faile={translate('manage_link.edit_faile')}
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
                        <label>{ translate('manage_link.category') }<span className="text-red"> * </span></label>
                        <SelectBox
                            id={`select-link-default-category-${linkId}`}
                            className="form-control select2"
                            style={{width: "100%"}}
                            items = {
                                linksDefault.categories.map( category => {return {value: category.name, text: category.name+"-"+category.description}})
                            }
                            onChange={this.handleCategory}
                            value={linkCategory}
                            multiple={false}
                        />
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
            </DialogModal>
         );
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.linkId !== prevState.linkId) {
            return {
                ...prevState,
                linkId: nextProps.linkId,
                linkUrl: nextProps.linkUrl,
                linkCategory: nextProps.linkCategory,
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
        const {linkId, linkUrl, linkDescription, linkRoles, linkCategory} = this.state;
        if(this.isFormValidated())
            return this.props.editLink(linkId, {
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
    editLink: LinkDefaultActions.edit
}
 
export default connect(mapState, getState) (withTranslate(LinkInfoForm));