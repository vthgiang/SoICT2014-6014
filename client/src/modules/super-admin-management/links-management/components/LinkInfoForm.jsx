import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../../../super-admin-management/manage-role/redux/actions';
import { LinkActions } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';

class LinkInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.linkId,
            url: this.props.linkName,
            description: this.props.linkDescription
         }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save(){
        let select = this.refs.roles;
        let roles = [].filter.call(select.options, o => o.selected).map(o => o.value);
        const { id, url, description } = this.state;
        const link = { url, description, roles };

        return this.props.editLink(id, link);
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getRole();
    }

    render() { 
        const { translate, role, linkId, linkName, linkDescription, linkRoles } = this.props;
        
        return ( 
            <React.Fragment>
                <ModalButton modalID={`modal-edit-page-${linkId}`} button_type="edit" title={translate('manage_page.edit')}/>
                <ModalDialog
                    size='50' func={this.save} type="edit"
                    modalID={`modal-edit-page-${linkId}`}
                    formID={`form-edit-page-${linkId}`}
                    title={translate('manage_page.edit')}
                    msg_success={translate('manage_page.edit_success')}
                    msg_faile={translate('manage_page.edit_faile')}
                >
                    <form id={`form-edit-page-${linkId}`}>
                        <div className="form-group">
                            <label>{ translate('manage_page.url') }<span className="text-red"> * </span></label>
                            <input name="url" type="text" className="form-control" defaultValue={linkName} onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_page.description') }<span className="text-red"> * </span></label>
                            <input name="description" type="text" className="form-control" defaultValue={linkDescription} onChange={this.inputChange} />
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_page.roles') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                defaultValue={ linkRoles }
                                ref="roles"
                            >
                                {
                                    
                                    role.list.map( role => 
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
    getRole: RoleActions.get,
    editLink: LinkActions.edit
}
 
export default connect(mapState, getState) (withTranslate(LinkInfoForm));