import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleDefaultActions } from '../../roles-default-management/redux/actions';
import { LinkDefaultActions } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';

class LinkInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    save(){
        return this.props.editLink(this.props.linkDefaultId, {
            url: this.refs.url.value,
            description: this.refs.description.value,
            roles: [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value)
        });
    }

    componentDidMount(){
        this.props.getRole();
    }

    render() { 
        const { translate, linkDefaultId, linkDefaultName, linkDefaultRoles, linkDefaultDescription, rolesDefault } = this.props;
        
        return ( 
            <React.Fragment>
                <ModalButton modalID={`modal-edit-link-default-${linkDefaultId}`} button_type="edit" title={translate('manage_link.edit')}/>
                <ModalDialog
                    size='50' func={this.save} type="edit"
                    modalID={`modal-edit-link-default-${linkDefaultId}`}
                    formID={`form-edit-link-default-${linkDefaultId}`}
                    title={translate('manage_link.edit')}
                    msg_success={translate('manage_link.edit_success')}
                    msg_faile={translate('manage_link.edit_faile')}
                >
                    <form id={`form-edit-link-default-${linkDefaultId}`}>
                        <div className="form-group">
                            <label>{ translate('manage_link.url') }<span className="text-red"> * </span></label>
                            <input ref="url" type="text" className="form-control" defaultValue={linkDefaultName}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_link.description') }<span className="text-red"> * </span></label>
                            <input ref="description" type="text" className="form-control" defaultValue={linkDefaultDescription}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_link.roles') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                defaultValue={ linkDefaultRoles }
                                ref="roles"
                            >
                                {
                                    
                                    rolesDefault.list.map( role => 
                                        <option key={role._id} value={role._id}>
                                            { role.name }
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = {
    getRole: RoleDefaultActions.get,
    editLink: LinkDefaultActions.edit
}
 
export default connect(mapState, getState) (withTranslate(LinkInfoForm));