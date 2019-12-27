import React, { Component } from 'react';
import Item from './Item';
import { connect } from 'react-redux';

// ,{
//     name: 'Manage ComponentUI',
//     path: '/manage-component-ui',
//     icon: 'fa fa-simplybuilt'
// },

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.checkURL = this.checkURL.bind(this);
    }

    checkURL = (urlName, linkArr) => {
        var result = false;
        if(linkArr !== undefined){
            linkArr.forEach(link => {
                if(link.url === urlName){
                    result = true;
                }
            });
        }

        return result;
    }

    render() {
        const { links } = this.props.auth;
        return (
            <React.Fragment>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src="/adminLTE/dist/img/user2-160x160.jpg" className="img-circle" alt="User avatar" />
                            </div>
                            <div className="pull-left info">
                                <p>User</p>
                                <a href="#abc"><i className="fa fa-circle text-success" /> Online</a>
                            </div>
                        </div>
                        <form action="#" method="get" className="sidebar-form">
                            <div className="input-group">
                                <input type="text" name="q" className="form-control" placeholder="Search" />
                                <span className="input-group-btn">
                                    <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search" />
                                    </button>
                                </span>
                            </div>
                        </form>
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header">MENU</li>
                                <Item
                                    key= 'home'
                                    name= 'home'
                                    path= '/'
                                    icon= 'fa fa-home'
                                />
                            {
                                this.checkURL('/manage-company', links) === true &&
                                <Item
                                    key= 'manageCompany'
                                    name= 'manageCompany'
                                    path= '/manage-company'
                                    icon= 'fa fa-building'
                                />
                            }
                            {
                                this.checkURL('/manage-department', links) === true &&
                                <Item
                                    key= 'manageDepartment'
                                    name= 'manageDepartment'
                                    path= '/manage-department'
                                    icon= 'fa fa-sitemap'
                                />
                            }
                            {
                                this.checkURL('/manage-user', links) === true &&
                                <Item
                                    key= 'manageUser'
                                    name= 'manageUser'
                                    path= '/manage-user'
                                    icon= 'fa fa-users'
                                />
                            }
                            {
                                this.checkURL('/manage-role', links) === true &&
                                <Item
                                    key= 'manageRole'
                                    name= 'manageRole'
                                    path= '/manage-role'
                                    icon= 'fa fa-lock'
                                />
                            }
                            {
                                this.checkURL('/manage-link', links) === true &&
                                <Item
                                    key= 'manageLink'
                                    name= 'manageLink'
                                    path= '/manage-link'
                                    icon= 'fa fa-link'
                                />
                            }
                            {
                                this.checkURL('/manage-component', links) === true &&
                                <Item
                                    key= 'manageComponent'
                                    name= 'manageComponent'
                                    path= '/manage-component'
                                    icon= 'fa fa-object-group'
                                />
                            }
                            {
                                this.checkURL('/manage-form-document', links) === true &&
                                <Item
                                    key= 'manageFormDocument'
                                    name= 'manageFormDocument'
                                    path= '/manage-form-document'
                                    icon= 'fa fa-folder-open'
                                />
                            }
                        </ul>
                    </section>
                </aside>
            </React.Fragment>
        );
    }
}

const mapStates = state => {
    return state;
}

const dispatchStateToProps = (dispatch, props) => {
    return {
    }
}

export default connect(mapStates, dispatchStateToProps)(SideBar);
