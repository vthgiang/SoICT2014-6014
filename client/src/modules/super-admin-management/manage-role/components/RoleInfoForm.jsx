import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';

class RoleInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null
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
        let select = this.refs.parents;
        let parents = [].filter.call(select.options, o => o.selected).map(o => o.value);

        let selectUsers = this.refs.users;
        let users = [].filter.call(selectUsers.options, o => o.selected).map(o => o.value);

        const { name } = this.state;
        var role = { id: this.props.roleInfo._id, name, parents, users };
        
        return this.props.edit(role);
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.setState({ name: this.props.roleInfo.name });
    }

    render() { 
        const { roleInfo, role, user, translate } = this.props;
        return ( 
            <React.Fragment>
                <ModalButton modalID={`modal-edit-role-${roleInfo._id}`} button_type="edit" title={translate('manage_role.edit')}/>
                <ModalDialog
                    size='50' func={this.save} type="edit"
                    modalID={`modal-edit-role-${roleInfo._id}`}
                    formID={`form-edit-role-${roleInfo._id}`}
                    title={translate('manage_role.edit')}
                    msg_success={translate('manage_role.edit_success')}
                    msg_faile={translate('manage_role.edit_faile')}
                >
                    <form id={`form-edit-role-${roleInfo._id}`}>
                        <div className="form-group">
                            <label>{ translate('manage_role.name') }<span className="text-red">*</span></label>
                            <input className="form-control" name="name" defaultValue={ roleInfo.name } onChange={ this.inputChange }></input>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_role.extends') }</label>
                            <select 
                                name="parents" 
                                className="form-control select2" 
                                multiple="multiple" 
                                onChange={ this.inputChange }
                                style={{ width: '100%' }} 
                                value={ roleInfo.parents }
                                ref="parents"
                            >
                                {   
                                    role.list.map( role => <option key={role._id} value={role._id}>{role.name}</option>)
                                } 
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_role.users') } { roleInfo.name }</label>
                            <select 
                                name="users"
                                className="form-control select2" 
                                multiple="multiple" 
                                onChange={ this.inputChange }
                                style={{ width: '100%' }} 
                                value={ roleInfo.users !== undefined ? roleInfo.users.map( user => user.userId ) : [] }
                                ref="users"
                            >
                                {   
                                    user.list.map( user => <option key={user._id} value={user._id}>{ `${user.email} - ${user.name}` }</option>)
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

const dispatchStateToProps =  {
    edit: RoleActions.edit
}

export default connect(mapState, dispatchStateToProps)(withTranslate( RoleInfoForm ));