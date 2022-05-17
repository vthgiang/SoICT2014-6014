import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { setStorage, getStorage } from '../../../config';
import { AuthActions } from '../../../modules/auth/redux/actions';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: getStorage("currentRole") ? getStorage("currentRole") : null
        }
        this.selectRole = this.selectRole.bind(this);
    }

    selectRole = async (e) => {
        this.setState({ currentRole: e.target.value });
        setStorage("currentRole", e.target.value);
        await this.props.getLinksOfRole(e.target.value);
        var { links } = this.props.auth;
        var path = window.location.pathname;
        var linkId;
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            if (element.url === path) {
                linkId = element._id;
                break;
            }
        }
        var currentRole = getStorage("currentRole");
        await this.props.getComponentsOfUserInLink(currentRole, linkId);
    }

    render() {
        const { auth, translate } = this.props;
        const { currentRole } = this.state;
        return (
            <li style={{ marginLeft: '5px', marginRight: '5px' }}>
                {
                    auth.user.roles && auth.user.roles.length > 0 &&
                    <select
                        className="form-control"
                        onChange={this.selectRole}
                        style={{ height: '34px', marginTop: '8px' }}
                        name="currentRole"
                        defaultValue={currentRole}>
                        {
                            auth.user.roles.map(role => {
                                return (
                                    <option key={role.roleId._id} value={role.roleId._id}>
                                        {(!role.delegation) ? role.roleId.name : role.roleId.name + " (" + translate('general.delegation_role') + " " + role.delegation.delegator.name + ")"}
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

const mapDispatchToProps = { //lưu các users lên store
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Roles));