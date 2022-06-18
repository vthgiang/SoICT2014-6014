import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import store from '../../../redux/store'

class GroupItem extends Component {
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

    checkGroupItem = (groupItem, links) => {
        let result = false;
        for (let i = 0; i < groupItem.length; i++) {
            if (this.checkURL(groupItem[i].path, links)) {
                result = true;
                break;
            }
        }
        return result;
    }

    render() {
        const { groupItem, translate } = this.props;
        const { links } = this.props.auth;

        return (
            <React.Fragment>
                {
                    this.checkGroupItem(groupItem.list, links) &&
                    <li className="treeview" >
                        <a href="">
                            <i className={groupItem.icon} /> <span>{translate(groupItem.name)}</span>
                            <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right" />
                            </span>
                        </a>
                        <ul className="treeview-menu">
                            {
                                groupItem.list.map((item, key) => {
                                    if (!item.list)
                                        if (this.checkURL(item.path, links))
                                            return (
                                                <li key={key} className={window.location.pathname === item.path ? "active" : ""}>
                                                    <Link
                                                        to={item.path}
                                                        onClick={() => {
                                                            store.dispatch({ type: 'SWITCH_PAGE' });
                                                        }}
                                                    >
                                                        <i className={item.icon} />
                                                        {translate(`${item.name}`)}
                                                    </Link>
                                                </li>
                                            );
                                        else return null;
                                    if (item.list)
                                        return (
                                            <li key={key} className={item.list.some(c => c.path === window.location.pathname) ? "treeview active" : "treeview"}>
                                                <a href="">
                                                    <i className={item.icon} /> <span>{translate(item.name)}</span>
                                                    <span className="pull-right-container">
                                                        <i className="fa fa-angle-left pull-right" />
                                                    </span>
                                                </a>
                                                <ul className="treeview-menu">
                                                    {
                                                        item.list.map((itemChild, key) => {
                                                            if (this.checkURL(itemChild.path, links))
                                                                return (
                                                                    <li key={key} className={window.location.pathname === itemChild.path ? "active" : ""}>
                                                                        <Link
                                                                            to={itemChild.path}
                                                                            onClick={() => {
                                                                                store.dispatch({ type: 'SWITCH_PAGE' });
                                                                            }}
                                                                        >
                                                                            <i className={itemChild.icon} />
                                                                            {translate(`${itemChild.name}`)}
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            else return null;

                                                        })
                                                    }
                                                </ul>
                                            </li>

                                        );
                                })
                            }
                        </ul>
                    </li>
                }
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => {
    const { auth } = state;
    return { auth };
}

export default connect(mapStateToProps, null)(withTranslate(GroupItem));