import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { name, path, icon, translate } = this.props;
        return ( 
            <li className={ window.location.pathname === path ? "active" : "" }>
                <Link to={ path }>
                    <i className={ icon } /> <span>{ translate(`mainSideBar.${name}`) }</span>
                </Link>
            </li>
        );
    }
}
 
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, null )( withTranslate(Item) );