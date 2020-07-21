import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RootRoleActions } from '../../root-role/redux/actions';
import { LinkDefaultActions } from '../redux/actions';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { LinkDefaultValidator } from './systemLinkValidator';

class CreateLinkForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkUrl: '',
            linkDescription: ''
        }
        this.save = this.save.bind(this);
    }

    render() { 
        const { translate, rootRoles, linksDefault } = this.props;
        const {linkUrl, linkCategory, linkDescription, linkRoles, linkUrlError, linkDescriptionError} = this.state;
        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-page" button_name={translate('general.add')} title={translate('system_admin.system_link.add')}/>
                <DialogModal
                    modalID="modal-create-page"
                    formID="form-create-page"
                    title={translate('system_admin.system_link.add')}
                    func={this.save} disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-page">
                        <div className={`form-group ${linkUrlError===undefined?"":"has-error"}`}>
                            <label>{ translate('system_admin.system_link.table.url') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleUrl}/>
                            <ErrorLabel content={linkUrlError}/>
                        </div>
                        <div className={`form-group ${linkDescriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('system_admin.system_link.table.description') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleDescription}/>
                            <ErrorLabel content={linkDescriptionError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('system_admin.system_link.table.category') }<span className="text-red"> * </span></label>
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
                            <label>{ translate('system_admin.system_link.table.roles') }</label>
                            <SelectBox
                                id={`select-link-default-roles`}
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
        this.props.getAllRootRoles();
    }
}
 
const mapState = state => state;
const getState = {
    getAllRootRoles: RootRoleActions.getAllRootRoles,
    createLink: LinkDefaultActions.create
}
 
export default connect(mapState, getState) (withTranslate(CreateLinkForm));
