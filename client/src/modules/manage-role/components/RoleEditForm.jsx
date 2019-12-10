import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get, show } from '../redux/actions';

const roleAbstract = ['5dedfc3646dfc14306297357', '5dedfc3646dfc14306297358', '5dedfc3646dfc14306297359'];

class RoleEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null
        }
        this.inputChange = this.inputChange.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() { 
        const { roleID, role } = this.props;
        var abstractRole = role.item !== null ? role.item.abstract : [];
        console.log("roleAb: ", abstractRole);
        return ( 
            <React.Fragment>
                <div className="modal fade" id={roleID}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 className="modal-title">Role id : { roleID }</h4>
                            </div>
                            <div className="modal-body">
                                    <React.Fragment>
                                        <div className="form-group">
                                            <label>Role name</label>
                                            <input className="form-control" name="name" defaultValue={ role.item && role.item.name } onChange={ this.inputChange }></input>
                                        </div>
                                        <div className="form-group">
                                            <label>Ke thua quyen</label>
                                            <select 
                                                name="abstract" 
                                                className="form-control select2" 
                                                multiple="multiple" 
                                                style={{ width: '100%' }} 
                                                // onChange={ this.inputChange }
                                                value={ abstractRole }
                                                ref="abstract"
                                            >
                                                {   
                                                    role.list.map( role => <option key={role._id} value={role._id}>{role.name}</option>)
                                                } 
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Những người có quyền của { role.item && role.item.name }</label>
                                            <select 
                                                name="users"
                                                className="form-control select2" 
                                                multiple="multiple" 
                                                onChange={ this.inputChange }
                                                style={{ width: '100%' }} 
                                                defaultValue={ role.item !== null ? role.item.users.map( user => user._id) : []}
                                                ref="users"
                                            >
                                                {   
                                                    role.item !== null && role.item.users.map( user => <option key={user._id} value={user._id}>{ `${user.email} - ${user.name}` }</option>)
                                                }
                                            </select>
                                        </div>
                                       
                                    </React.Fragment>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save</button>
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
        
    }
}

export default connect(mapState, dispatchStateToProps)(withTranslate( RoleEditForm ));