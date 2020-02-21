import React, { Component } from 'react';
import Item from './Item';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
        const { links } = this.props.auth;
        return (
            <React.Fragment>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src="/lib/adminLTE/dist/img/user2-160x160.jpg" className="img-circle" alt="User avatar" />
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
                                key='home'
                                name='home'
                                path='/'
                                icon='fa fa-home'
                            />
                            {
                                this.checkURL('/system', links) === true &&
                                <Item
                                    key='manage_system'
                                    name='manage_system'
                                    path='/system'
                                    icon='fa fa-gears'
                                />
                            }
                            {
                                this.checkURL('/manage-company', links) === true &&
                                <Item
                                    key='manage_company'
                                    name='manage_company'
                                    path='/manage-company'
                                    icon='fa fa-building'
                                />
                            }
                            {
                                this.checkURL('/manage-department', links) === true &&
                                <Item
                                    key='manage_department'
                                    name='manage_department'
                                    path='/manage-department'
                                    icon='fa fa-sitemap'
                                />
                            }
                            {
                                this.checkURL('/manage-user', links) === true &&
                                <Item
                                    key='manage_user'
                                    name='manage_user'
                                    path='/manage-user'
                                    icon='fa fa-users'
                                />
                            }
                            {
                                this.checkURL('/manage-role', links) === true &&
                                <Item
                                    key='manage_role'
                                    name='manage_role'
                                    path='/manage-role'
                                    icon='fa fa-lock'
                                />
                            }
                            {
                                this.checkURL('/manage-link', links) === true &&
                                <Item
                                    key='manage_page'
                                    name='manage_page'
                                    path='/manage-link'
                                    icon='fa fa-link'
                                />
                            }
                            {
                                this.checkURL('/manage-component', links) === true &&
                                <Item
                                    key='manage_component'
                                    name='manage_component'
                                    path='/manage-component'
                                    icon='fa fa-object-group'
                                />
                            }
                            {
                                this.checkURL('/manage-document', links) === true &&
                                <Item
                                    key='manage_document'
                                    name='manage_document'
                                    path='/manage-form-document'
                                    icon='fa fa-folder-open'
                                />
                            }

                            {/* Quan ly nhan su */}
                            {
                                this.checkURL('/manage-Employee', links) === true &&
                                <li className="treeview">
                                    <a href="#abc">
                                        <i className="fa fa-address-book" /> <span>Quản lý nhân sự</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="/dashboard-employee"><i className="fa fa-dashboard" />DashBoard quản lý nhân sự </a></li>
                                        <li><Link to="/add-employee"><i className="fa fa-user-plus" />Thêm nhân viên </Link></li>
                                        <li><a href="/list-employee"><i className="fa fa-address-card" />Quản lý thông tin nhân viên</a></li>
                                        <li><a href="/salary-employee"><i className="fa fa-line-chart" />Lương nhân viên</a></li>
                                        <li><a href="/time-keeping"><i className="fa fa-calculator" />Chấm công nhân viên</a></li>
                                        <li><a href="/discipline"><i className="fa fa-balance-scale" />Quản lý khen thưởng - kỷ luật</a></li>
                                        <li><a href="/sabbatical"><i className="fa fa-calendar-times-o" />Quản lý nghỉ phép</a></li>
                                    </ul>
                                </li>
                            }
                            {
                                this.checkURL('/account', links) === true &&
                                <li className="treeview">
                                    <a href="#abc">
                                        <i className="fa fa-user-circle" /> <span>Tài khoản</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="/detail-employee"><i className="fa fa-user-o" />Thông tin cá nhân</a></li>
                                        <li><a href="/update-employee"><i className="fa fa-pencil-square-o" />Cập nhật thông tin nhân viên</a></li>
                                    </ul>
                                </li>
                            }
                            {
                                this.checkURL('/trainning-course', links) === true &&
                                <li className="treeview">
                                    <a href="#abc">
                                        <i className="fa fa-graduation-cap" /> <span>Quản lý đào tạo</span>
                                        <span className="pull-right-container">
                                            <i className="fa fa-angle-left pull-right" />
                                        </span>
                                    </a>
                                    <ul className="treeview-menu">
                                        <li><a href="/list-course"><i className="fa fa-university" />Chương trình đào tạo bắt buộc</a></li>
                                        <li><a href="/training-plan"><i className="fa fa-list-alt"  />Quản lý khoá đào tạo</a></li>
                                    </ul>
                                </li>
                            }
                        </ul>
                    </section>
                </aside>
            </React.Fragment>
        );
    }
}

const mapStates = state => state;

const dispatchStateToProps = {

}

export default connect(mapStates, dispatchStateToProps)(SideBar);
