import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../redux/actions';
import Swal from 'sweetalert2';

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

    save(message){
        let select = this.refs.parents;
        let parents = [].filter.call(select.options, o => o.selected).map(o => o.value);

        let selectUsers = this.refs.users;
        let users = [].filter.call(selectUsers.options, o => o.selected).map(o => o.value);

        const { name } = this.state;
        var role = { id: this.props.roleInfo._id, name, parents, users };
        this.props.edit(role).then(res => {
            Swal.fire({
                icon: 'success',
                title: message,
                showConfirmButton: false,
                timer: 5000
            }) 
        })
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
                <a className="edit" data-toggle="modal" href={`#role-info-${roleInfo._id}`} title={translate('manage_role.edit')}><i className="material-icons">edit</i></a>
                <div className="modal fade" id={`role-info-${roleInfo._id}`}  style={{ textAlign: 'left' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 className="modal-title">{ translate('manage_role.info') }</h4>
                            </div>
                            <div className="modal-body">
                                <React.Fragment>
                                    <div className="form-group">
                                        <label>{ translate('manage_role.name') }</label>
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
                                    
                                </React.Fragment>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal">{ translate('form.close') }</button>
                                <button type="button" className="btn btn-success" data-dismiss="modal" 
                                    onClick={()  => this.save(translate('manage_role.edit_success'))}
                                >{ translate('form.save') }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;

const dispatchStateToProps =  {
    edit: RoleActions.edit
}

export default connect(mapState, dispatchStateToProps)(withTranslate( RoleInfoForm ));