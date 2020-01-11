import React, { Component } from 'react';
import Header from './header/components/Header';
import Sidebar from './sidebar/components/SideBar';
import Footer from './footer/components/Footer';
import Content from './content/components/Content';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
// import ReactLoading from 'react-loading';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { translate } = this.props;
        console.log("ISLOADING LAYOUT: ", this.props.isLoading)
        return ( 
            <React.Fragment>
                <Header />
                <Sidebar />
                <Content arrPage={this.props.arrPage} pageName={ translate(`mainSideBar.${this.props.pageName}`) } isLoading={this.props.isLoading}>{ this.props.children }</Content>
                <Footer />
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, null )( withTranslate(Layout) );