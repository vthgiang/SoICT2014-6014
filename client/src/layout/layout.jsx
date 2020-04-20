import React, { Component } from 'react';
import Header from './header/components/header';
import Sidebar from './sidebar/components/sidebar';
import Footer from './footer/components/footer';
import Content from './content/components/content';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { translate, auth } = this.props;
        
        return ( 
            <React.Fragment>
                <Header
                    userId={auth.user._id}
                    userName={auth.user.name}
                    userEmail={auth.user.email}
                />
                <Sidebar />
                <Content arrPage={this.props.arrPage} isLoading={this.props.isLoading} pageName={ translate(`menu.${this.props.pageName}`) }>{ this.props.children }</Content>
                <Footer />
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, null )( withTranslate(Layout) );