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

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (!nextProps.auth.user.company && prevState.type === 'super-admin') {
    //         document.body.classList.add('layout-top-nav');
    //         return {
    //             ...prevState,
    //             type: 'system-admin',
    //         }
    //     } else if(nextProps.auth.user.company !== undefined && prevState.type === 'system-admin'){
    //         document.body.classList.remove('layout-top-nav');
    //         return {
    //             ...prevState,
    //             type: 'super-admin',
    //         }
    //     } else return null;
    // }

    render() { 
        const {auth} = this.props;
        // console.log("render layout type: ", this.state.type)
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