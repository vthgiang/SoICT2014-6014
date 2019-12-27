import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ReactLoading from 'react-loading';

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
        const { translate, isLoading, pageName } = this.props;
        console.log("ISLOAIND: ", isLoading)
        return ( 
            <React.Fragment>
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1> { pageName } </h1>
                        {/* <ol className="breadcrumb">
                            <li><a href="/admin"><i className="fa fa-dashboard" /> Menu1 </a></li> 
                            <li className="active"> Pagename </li>
                        </ol> */}
                    </section>
                    <section className="content">
                        
                        <div className="box" style={{ minHeight: '400px'}}>
                            <div className="box-body">
                                {
                                    isLoading &&
                                    <div>
                                        <p style={{textAlign: 'center', color: '#605CA8', marginTop:'120px'}}>
                                            <strong>{ translate('loading') }</strong>
                                        </p>
                                        <div style={{ marginLeft: '46%', width: '8%'}}>
                                            <ReactLoading type={"bars"} color={"#605CA8"} width={'100%'}/> 
                                        </div>
                                    </div>
                                }
                                <div hidden={isLoading}>
                                    {
                                        this.props.children 
                                    }
                                </div>
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