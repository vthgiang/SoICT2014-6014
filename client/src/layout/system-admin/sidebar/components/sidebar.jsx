import React, { Component } from 'react';
import Item from './item';
import GroupItem from './groupItem';
import { connect } from 'react-redux';
import Role from  '../../header/components/roles';
import { withTranslate } from 'react-redux-multilingual';

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    checkURL = (urlName, linkArr) => {
        var result = false;
        if (linkArr !== undefined) {
            linkArr.forEach(link => {
                if (link.url === urlName) {
                    result = true;
                }
            });
        }

        return result;
    }

    render() {
        const { translate, auth } = this.props;
        const { user, links } = this.props.auth;

        return (
            <React.Fragment>
                <div className="collapse navbar-collapse pull-left" id="navbar-collapse">
                    <ul className="nav navbar-nav">
                        
                        {/* Trang chủ */}
                        <Item item={{ name: 'menu.home', path: '/', icon: 'fa fa-home' }}/>
                        {/* Quản lý doanh nghiệp */}
                        <Item item={{ name: 'menu.manage_company', icon: 'fa fa-building', path: '/system/companies-management' }}/>
                        {/* Quản trị của system admin */}
                        <GroupItem groupItem={{
                            name: 'menu.system',
                            icon: 'fa fa-gears',
                            list: [
                                { name: 'menu.manage_system', icon: 'fa fa-gear', path: '/system/settings' },
                                { name: 'menu.manage_role', icon: 'fa fa-lock', path: '/system/roles-default-management' },
                                { name: 'menu.manage_link', icon: 'fa fa-link', path: '/system/links-default-management' },
                                { name: 'menu.manage_component', icon: 'fa fa-object-group', path: '/system/components-default-management' },
                            ]
                        }}/>
                    </ul>
                    <Role/>
                </div>
            </React.Fragment>
        );
    }
}

const mapStates = state => state;

const dispatchStateToProps = {

}

export default connect(mapStates, dispatchStateToProps)(withTranslate(SideBar));
