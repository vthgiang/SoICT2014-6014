import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { setStorage, getStorage } from '../../../config';
import { getLinksOfRole } from '../../../modules/auth/redux/actions';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            currentRole: getStorage('currentRole') ? getStorage('currentRole') : null 
        }
        this.selectRole = this.selectRole.bind(this);
    }

    selectRole(e) {
        this.setState({ currentRole: e.target.value });
        setStorage('currentRole', e.target.value);
        this.props.getLinksOfRole(e.target.value);
    }

    componentDidMount() {
        this.props.getLinksOfRole(this.state.currentRole);
    }
    
    render() { 
        const {auth}=this.props;
        const { currentRole } = this.state;
        return ( 
            <li>
                {
                    auth.user.roles && auth.user.roles.length > 0 &&
                    <select
                        className="form-control"
                        style={{ marginTop: '9px' }}
                        onChange={this.selectRole}
                        name='currentRole'
                        defaultValue={currentRole}>
                        {
                            auth.user.roles.map(role => {
                                return (
                                    <option key={role.roleId._id} value={role.roleId._id}>
                                        {role.roleId.name}
                                    </option>
                                )
                            })
                        }
                    </select>
                }
            </li>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => { //lưu các users lên store
    return {
        getLinksOfRole: (idRole) => {
            dispatch(getLinksOfRole(idRole));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Roles));