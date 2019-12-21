import React, { Component } from 'react';
import Item from './Item';
import { connect } from 'react-redux';

const menu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa fa-home'
    },{
        name: 'Manage Company',
        path: '/manage-company',
        icon: 'fa fa-building'
    },{
        name: 'Manage User',
        path: '/manage-user',
        icon: 'fa fa-users'
    },{
        name: 'Manage Role',
        path: '/manage-role',
        icon: 'fa fa-lock'
    },{
        name: 'Manage Link',
        path: '/manage-link',
        icon: 'fa fa-link'
    },{
        name: 'Manage Department',
        path: '/manage-department',
        icon: 'fa fa-object-group'
    },{
        name: 'Manage Form-Document',
        path: '/manage-form-document',
        icon: 'fa fa-folder-open'
    }
    // ,{
    //     name: 'Manage ComponentUI',
    //     path: '/manage-component-ui',
    //     icon: 'fa fa-simplybuilt'
    // },
];

class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {

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
                            {
                                menu.map( item => 
                                    <Item
                                        key={ item.name }
                                        name={ item.name }
                                        path={ item.path }
                                        icon={ item.icon }
                                    />
                                )
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
