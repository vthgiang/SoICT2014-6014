import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import NotificationTable from './NotificationTable';
import NotificationMenu from './NotificationMenu';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                        <NotificationMenu />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10">
                        <NotificationTable/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


const mapState = state => state;
const NotificationExport = connect(mapState, null)(withTranslate(Notifications));
export { NotificationExport as Notifications }