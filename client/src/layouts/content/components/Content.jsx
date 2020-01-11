import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.checkLink = this.checkLink.bind(this);
    }

    checkLink(arrLink, url) {
        var result = false;
        arrLink.forEach(link => {
            switch (link.resource.url) {
                case '/admin/department/detail':
                    if (url.indexOf(link.resource.url) !== -1) {
                        result = true;
                    }
                    break;

                case '/admin/resource/link/edit':
                    if (url.indexOf(link.resource.url) !== -1) {
                        result = true;
                    }
                    break;

                default:
                    if (link.resource.url === url) {
                        result = true;
                    }
                    break;
            }
        });

        return result;
    }

    render() {
        const { translate, isLoading, pageName, arrPage } = this.props;
        console.log("ISLOAIND: ", isLoading)
        return (
            <React.Fragment>
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1> {pageName} </h1>
                        <ol className="breadcrumb">
                            {
                                arrPage !== undefined && arrPage.map( page => 
                                    <li>
                                        <a href={page.link}>
                                            <i className={ page.icon }/>
                                            { translate(`mainSideBar.${page.name}`) }
                                        </a>
                                    </li> )
                            }
                        </ol>
                    </section>
                    <section className="content">
                        {
                            this.props.children
                        }
                    </section>
                </div>
            </React.Fragment>
        );
    }
}
const mapState = state => {
    return state;
}

export default connect(mapState, null)(withTranslate(Content));