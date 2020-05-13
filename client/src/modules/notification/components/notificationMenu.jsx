import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { NotificationActions } from '../redux/actions';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { showReceived: true }
    }
    
    getManualNotifications = async() => {
        await this.props.setLevelNotificationSent();
        await this.props.paginateManualNotifications({
            limit: 5,
            page: 1
        })
    }

    getNotifications = async() => {
        await this.props.setLevelNotificationReceivered();
        await this.props.paginateNotifications({
            limit: 5,
            page: 1
        })
    }

    showTabReceivered = async() => {
        window.$('#tab-notification-sent').hide();
        window.$('#tab-notification-receivered').show();
        this.setState({showReceived: true});
        await this.getNotifications();
    }

    showTabSent = async() => {
        window.$('#tab-notification-receivered').hide();
        window.$('#tab-notification-sent').show();
        this.setState({showReceived: false});
        await this.getManualNotifications();
    }

    setLevel = async(level) => {
        if(this.state.showReceived){
            const {limit} = this.props.notifications.receivered;
            await this.props.setLevelNotificationReceivered(level);
            await this.props.paginateNotifications({ limit, page:1, content: {level} })
        }else{
            const {limit} = this.props.notifications.sent;
            await this.props.setLevelNotificationSent(level);
            await this.props.paginateManualNotifications({ limit, page:1, content: {level} })
        }
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                {this.checkHasComponent('create-notification') &&
                    <div className="box box-solid">
                        <ul className="nav nav-pills nav-stacked">
                            <li onClick={this.showTabReceivered}>
                                <button className="btn btn-default" style={{padding: '10px', textAlign: 'center', width: '100%'}}>
                                    {this.state.showReceived && <i className="pull-right fa fa-star text-yellow"/>}
                                    <i className="fa fa-fw fa-inbox"/>{translate('notification.receivered')}
                                </button>
                            </li>
                            <li onClick={this.showTabSent}>
                                <button className="btn btn-default" style={{padding: '10px', textAlign: 'center', width: '100%'}}>
                                    {!this.state.showReceived && <i className="pull-right fa fa-star text-yellow"/>}
                                    <i className="fa fa-fw fa-envelope-o"/>{translate('notification.sent')}
                                </button>
                            </li>
                        </ul>
                    </div>  
                }

                <div className="box box-solid">
                    <div className="box-body">
                        <ul className="nav nav-pills nav-stacked">
                            <li onClick={()=>this.setLevel("info")}><a href="#" className="text-blue"><i className="fa fa-fw fa-info-circle text-blue" /> {translate('notification.type.info')}</a></li>
                            <li onClick={()=>this.setLevel("general")}><a href="#" className="text-green"><i className="fa fa-fw fa-bell" /> {translate('notification.type.general')}</a></li>
                            <li onClick={()=>this.setLevel("important")}><a href="#" className="text-orange"><i className="fa fa-fw fa-warning" /> {translate('notification.type.important')}</a></li>
                            <li onClick={()=>this.setLevel("emergency")}><a href="#" className="text-red"><i className="fa fa-fw fa-bomb" /> {translate('notification.type.emergency')}</a></li>
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
const action = {
    setLevelNotificationReceivered: NotificationActions.setLevelNotificationReceivered,
    setLevelNotificationSent: NotificationActions.setLevelNotificationSent,
    paginateNotifications: NotificationActions.paginateNotifications,
    paginateManualNotifications: NotificationActions.paginateManualNotifications,
}

export default connect(mapState, action)(withTranslate(NotificationMenu));