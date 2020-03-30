import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleDefaultActions } from '../../roles-default-management/redux/actions';
import { LinkDefaultActions } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';

class CreateLinkForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    render() { 
        const { translate, rolesDefault } = this.props;
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
                        <div className="form-group">
                            <label>{ translate('manage_link.url') }<span className="text-red">*</span></label>
                            <input ref="url" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_link.description') }<span className="text-red">*</span></label>
                            <input ref="description" type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_link.roles') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                defaultValue={[]}
                                style={{ width: '100%' }} 
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
    
    save = () => {
        let select = this.refs.roles;
        let roles = [].filter.call(select.options, o => o.selected).map(o => o.value);

        return this.props.createLink({
            url: this.refs.url.value,
            description: this.refs.description.value,
            roles
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
