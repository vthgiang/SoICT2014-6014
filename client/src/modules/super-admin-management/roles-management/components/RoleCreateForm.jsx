import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton } from '../../../../common-components';
import { toast } from 'react-toastify';


class RoleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    render() { 
        const{ translate, role, user } = this.props;
        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')}/>
                <ModalDialog
                    modalID="modal-create-role" isLoading={role.isLoading}
                    formID="form-create-role" 
                    title={translate('manage_role.add_title')}
                    msg_success={translate('manage_role.add_success')}
                    msg_faile={translate('manage_role.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-role">
                        <div className="form-group">
                            <label>{ translate('manage_role.name') }<span className="text-red"> * </span></label>
                            <input className="form-control" type="text" ref="name"/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_role.extends') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                ref="parents"
                            >
                                {
                                    role.list !== undefined
                                    ? role.list.map( role => 
                                        role.name !== 'Super Admin' ? <option key={role._id} value={role._id}>{role.name}</option> : null
                                    )
                                    :null
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_role.users') }</label>
                            <select 
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
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

    componentDidMount(){
        this.props.get();
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    save(){
        
        return this.props.create({
            name: this.refs.name.value,
            parents: [].filter.call(this.refs.parents.options, o => o.selected).map(o => o.value),
            users: [].filter.call(this.refs.users.options, o => o.selected).map(o => o.value)
        });
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleCreateForm) );