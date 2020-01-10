import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
// import ReactLoading from 'react-loading';

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
        const { pageName } = this.props;
        return ( 
            <React.Fragment>
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1> { pageName } </h1>
                    </section>
                    <section className="content">
                        
                        <div className="box" style={{ minHeight: '400px'}}>
                            <div className="box-body">
                                {
                                    this.props.children 
                                }
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
 
export default connect( mapState, null )( withTranslate(Content) );