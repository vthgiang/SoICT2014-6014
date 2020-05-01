import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        const { translate, notifications } = this.props;
        return ( 
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-body no-padding">
                        <ul className="nav nav-pills nav-stacked">
                            <li className="active">
                                <a 
                                    href="#notification-receivered" 
                                    data-toggle="tab"
                                >
                                    <i className="fa fa-download"/>
                                    {translate('notification.receivered')}
                                    <span className="label label-default pull-right">
                                        {notifications.listReceivered.length}
                                    </span>
                                </a>
                            </li>
                            { this.checkHasComponent('create-notification') &&
                            <li>
                                <a 
                                    href="#notification-sent" 
                                    data-toggle="tab"
                                >
                                    <i className="fa fa-upload"/>
                                    {translate('notification.added')}
                                    <span className="label label-default pull-right">
                                        {notifications.listSent.length}
                                    </span>
                                </a>
                            </li> }
                        </ul>
                    </div>  
                </div>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <h3 className="box-title">Chú thích</h3>
                    </div>
                    <div className="box-body">
                        <ul className="nav nav-pills nav-stacked">
                            <li className="text-blue"><i className="material-icons">info</i>Thông tin</li>
                            <li className="text-green"><i className="material-icons">notifications</i>Thông báo chung</li>
                            <li className="text-orange"><i className="material-icons">warning</i>Thông báo quan trọng</li>
                            <li className="text-red"><i className="material-icons">new_releases</i>Thông báo khẩn</li>
                        </ul>
                    </div>  
                </div>
            </React.Fragment>
         );
    }

    checkHasComponent = (name) => {
        var {auth} = this.props;
        var result = false;
        auth.components.forEach(component => {
            if(component.name === name) result=true;
        });

        return result;
    }
}
 
const mapState = state => state;

export default connect(mapState, null)(withTranslate(NotificationMenu));