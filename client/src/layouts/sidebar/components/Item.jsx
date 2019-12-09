import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { name, path, icon } = this.props;
        return ( 
            <li className={ window.location.pathname === path ? "active" : "" }>
                <Link to={ path }>
                    <i className={ icon } /> <span>{ name }</span>
                </Link>
            </li>
        );
    }
}
 
export default Item;