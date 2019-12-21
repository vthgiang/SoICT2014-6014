import React, { Component } from 'react';
import { connect } from 'react-redux';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.checkLink = this.checkLink.bind(this);
    }

    checkLink(arrLink, url){
        var result = false;
        arrLink.forEach(link => {
            switch(link.resource.url){
                case '/admin/department/detail':
                    if(url.indexOf(link.resource.url) !== -1){
                        result = true;
                    }
                    break;

                case '/admin/resource/link/edit':
                    if(url.indexOf(link.resource.url) !== -1){
                        result = true;
                    }
                    break;
                    
                default:
                    if(link.resource.url === url){
                        result = true;
                    }
                    break;
            }
        });

        return result;
    }

    render() {
        return ( 
            <React.Fragment>
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1>
                            Pagename
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="/admin"><i className="fa fa-dashboard" /> Menu1 </a></li> 
                            <li className="active"> Pagename </li>
                        </ol>
                    </section>
                    <section className="content">
                        <div className="box">
                            <div className="box-body">
                                { this.props.children }
                            </div>
                        </div>
                    </section>
                </div>
            </React.Fragment>
         );
    }
}
const mapState = state => {
    return state;
}
 
export default connect(mapState, null)(Content);