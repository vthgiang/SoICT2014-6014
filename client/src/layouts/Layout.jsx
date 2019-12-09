import React, { Component } from 'react';
import Header from './header/components/Header';
import Sidebar from './sidebar/components/SideBar';
import Footer from './footer/components/Footer';
import Content from './content/components/Content';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <Header />
                <Sidebar />
                <Content>{ this.props.children }</Content>
                <Footer />
            </React.Fragment>
         );
    }
}
 
export default Layout;