import React, { Component } from 'react';
import { connect } from 'react-redux';

class Footer extends Component {
    render() {
        return (
            <footer className="main-footer">
                <div className="pull-right hidden-xs">
                    <b>version</b> 2019.1
                </div>
                <strong>copyright <span style={{color: 'blue'}}>Quản Lý Công Việc</span></strong>
            </footer>
        );
    }
}

const mapState = state => state ;

export default connect(mapState, null)(Footer);