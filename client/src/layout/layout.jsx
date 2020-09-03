import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import SuperAdminLayout from './super-admin';
import SystemAdminLayout from './system-admin';
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }

    render() { 
        const {auth} = this.props;

        if(auth.user.company === undefined)
            return (
                <SystemAdminLayout
                    arrPage={this.props.arrPage}
                    isLoading={this.props.isLoading}
                    pageName={this.props.pageName}
                >
                    {this.props.children}
                </SystemAdminLayout>
            );
        else  
            return (
                <SuperAdminLayout
                    arrPage={this.props.arrPage}
                    isLoading={this.props.isLoading}
                    pageName={this.props.pageName}
                >
                    {this.props.children}
                </SuperAdminLayout>
            );
    }
}
 
const mapStateToProps = state => {
    const {auth} = state;
    return {auth};
}

export default connect( mapStateToProps, null )( withTranslate(Layout) );