import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';

class UserEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            status: [
                { id: 1, name: "disable", value: false },
                { id: 2, name: "enable", value: true }
            ]
        }
        this.save = this.save.bind(this);
    }

    save = () => {

        return this.props.edit(this.props.userId, {
            name: this.refs.name.value,
            active: this.refs.active.value,
            roles: [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value)
        });
    }

    render() { 
        const { userId, userEmail, userName, userActive, userRoles, translate, role } = this.props;
        const { status } = this.state;
        return ( 
            <React.Fragment>
                <ModalButton 
                    modalID={`modal-edit-user-${userId}`} 
                    button_type="edit" 
                    title={translate('manage_user.edit')}
                    color="yellow"
                />
                <ModalDialog
                    size='50' func={this.save} type="edit"
                    modalID={`modal-edit-user-${userId}`}
                    formID={`form-edit-user-${userId}`}
                    title={translate('manage_user.edit')}
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('manage_user.edit_faile')}
                >
                    <form id={`form-edit-user-${userId}`}>
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label>{ translate('table.email') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" defaultValue={ userEmail } disabled/>
                            </div>
                            <div className="form-group col-sm-4">
                                <label>{ translate('table.status') }<span className="text-red">*</span></label>
                                <select 
                                    className="form-control" 
                                    style={{width: '100%'}} 
                                    name="active" 
                                    defaultValue={ userActive }
                                    ref="active"
                                    onChange={this.inputChange}>
                                    {   
                                        status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)    
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>{ translate('table.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" ref="name" defaultValue={ userName }/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_user.roles') }</label>
                            <select
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                defaultValue={userRoles}
                                ref="roles"
                            >
                                {
                                    role.list.map( role => <option key={role._id} value={role._id}>{role.name}</option>)
                                }
                            </select>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;
const action = {
    edit: UserActions.edit
}


export default connect( mapStateToProps, action )( withTranslate(UserEditForm) );