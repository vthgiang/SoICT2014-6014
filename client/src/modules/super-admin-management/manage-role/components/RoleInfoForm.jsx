import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { edit } from '../redux/actions';

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

    save(e){
        e.preventDefault();
        let select = this.refs.abstract;
        let abstract = [].filter.call(select.options, o => o.selected).map(o => o.value);

        let selectUsers = this.refs.users;
        let users = [].filter.call(selectUsers.options, o => o.selected).map(o => o.value);

        const { name } = this.state;
        var role = { id: this.props.roleInfo._id, name, abstract, users }; // IDrole, tên , abstract roles, những người có role này
        console.log("Dữ liệu ROLE cập nhật: ", role);
        this.props.editRole(role);
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.setState({ name: this.props.roleInfo.name });
    }

    render() { 
        const { roleInfo, role, user, translate } = this.props;
        return ( 
            <React.Fragment>
                <div className="modal fade" id={`role-info-${roleInfo._id}`}>
                <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 className="modal-title">{ translate('manageRole.roleInfo') }</h4>
                            </div>
                            <div className="modal-body">
                                    <React.Fragment>
                                        <div className="form-group">
                                            <label>{ translate('manageRole.roleName') }</label>
                                            <input className="form-control" name="name" defaultValue={ roleInfo.name } onChange={ this.inputChange }></input>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('manageRole.abstract') }</label>
                                            <select 
                                                name="abstract" 
                                                className="form-control select2" 
                                                multiple="multiple" 
                                                onChange={ this.inputChange }
                                                style={{ width: '100%' }} 
                                                value={ roleInfo.abstract }
                                                ref="abstract"
                                            >
                                                {   
                                                    role.list.map( role => <option key={role._id} value={role._id}>{role.name}</option>)
                                                } 
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('manageRole.users') } { roleInfo.name }</label>
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
                                <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('table.close') }</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={ this.save }>{ translate('table.save') }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;

const dispatchStateToProps = (dispatch, props) => {
    return {
        editRole: ( role ) => {
            dispatch(edit( role )); 
        },
    }
}

export default connect(mapState, dispatchStateToProps)(withTranslate( RoleInfoForm ));