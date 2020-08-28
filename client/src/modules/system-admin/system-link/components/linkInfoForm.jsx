import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RootRoleActions } from '../../root-role/redux/actions';
import { SystemLinkActions } from '../redux/actions';
import { SYSTEM_LINK_VALIDATOR } from './systemLinkValidator';
import {DialogModal, ErrorLabel, SelectBox} from '../../../../common-components';

class LinkInfoForm extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        this.props.getAllRootRoles();
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
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

    handleUrl = (e) => {
        let {value} = e.target;
        this.setState({ linkUrl: value });

        let {translate} = this.props;
        let {msg} = SYSTEM_LINK_VALIDATOR.checkUrl(value);
        
        let error = msg ? translate(msg) : undefined;
        this.setState({ linkUrlError: error})
    }

    handleDescription = (e) => {
        let {value} = e.target;
        this.setState({ linkDescription: value });

        let {translate} = this.props;
        let {msg} = SYSTEM_LINK_VALIDATOR.checkDescription(value, 6, 1204);
        let error = msg ? translate(msg, {min: 6, max: 1024}) : undefined;
        this.setState({ linkDescriptionError: error})
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
        let {linkUrl, linkDescription} = this.state;
        if(!SYSTEM_LINK_VALIDATOR.checkUrl(linkUrl).status  || !SYSTEM_LINK_VALIDATOR.checkDescription(linkDescription).status) return false;
        return true;
    }

    save = () => {
        const { linkId, linkUrl, linkDescription, linkRoles, linkCategory } = this.state;
        if(this.isFormValidated()) {
            return this.props.editSystemLink(linkId, {
                url: linkUrl,
                description: linkDescription,
                roles: linkRoles,
                category: linkCategory
            });
        }  
    }

    render() { 
        const { translate, rootRoles, systemLinks } = this.props;
        const { linkId, linkUrl, linkCategory, linkDescription, linkRoles, linkUrlError, linkDescriptionError } = this.state;
        
        return ( 
            <DialogModal
                size='50' func={this.save} isLoading={systemLinks.isLoading}
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
                                systemLinks.categories.map( category => {return {value: category.name, text: category.name+"-"+category.description}})
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
                                rootRoles.list.map( role => {return {value: role._id, text: role.name}})
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
}
 
function mapState(state) {
    const { rootRoles, systemLinks } = state
    return { rootRoles, systemLinks }
}
const actions = {
    getAllRootRoles: RootRoleActions.getAllRootRoles,
    editSystemLink: SystemLinkActions.editSystemLink
}
 
const connectedLinkInfoForm = connect(mapState, actions)(withTranslate(LinkInfoForm))
export { connectedLinkInfoForm as LinkInfoForm }