import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationSentInfo from './notificationSentInfo';

class TabNotificationSent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate, notifications} = this.props;
        return ( 
            <React.Fragment>
                {
                    this.state.currentRow !== undefined &&
                    <NotificationSentInfo
                        notificationId={this.state.currentRow._id}
                        notificationTitle={this.state.currentRow.title}
                        notificationContent={this.state.currentRow.content}
                        notificationLevel={this.state.currentRow.level}
                        notificationSender={this.state.currentRow.sender}
                        notificationReaded={this.state.currentRow.readed}
                        notificationCreatedAt={this.state.currentRow.createdAt}
                    />
                }
                <div role="tabpanel" className="tab-pane active" id="notification-sent">
                    <div className="box-body" style={{height: "430px"}}>
                        <ul className="todo-list">
                        {
                            notifications.sent.list.length > 0 ? 
                            notifications.sent.list.map(notification => 
                                <li>
                                   <span className="text"><b>{notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title}</b></span> - 
                                    <span className="text" style={{color: '#6B6B6B'}}>{notification.content.length > 40 ? `${notification.content.slice(0, 40)}...`: notification.content}</span>
                                    <div className="tools">
                                        <a href={`#${notification.title}`} type="button" onClick={() => this.showNotificationInformation(notification)} className="text-aqua"><i className="material-icons">visibility</i></a>
                                        <DeleteNotification 
                                            content={translate('notification.delete')}
                                            data={{ id: notification._id, info: notification.title }}
                                            func={this.props.deleteNotificationReceivered}
                                        />
                                    </div>
                                </li>
                            ): notifications.isLoading ?
                            translate('general.loading'):
                            translate('general.no_data')
                        }
                        </ul>
                    </div>
                    <div className="box-footer no-padding">
                        
                    </div>
                </div>
            </React.Fragment>
         );
    }

    showNotificationInformation = async (notification) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: notification
            }
        });
        window.$('#modal-notification-sent').modal('show');
    }

    convertContent = (content) => {
        const newContent = content.slice(0,24);
        return newContent.concat(newContent, ' ... ');
    }

    componentDidMount(){
        this.props.getAllManualNotifications();
    }
}
 
const mapState = state => state;
const actions = {
    getAllManualNotifications: NotificationActions.getAllManualNotifications
}
export default connect(mapState, actions)(withTranslate(TabNotificationSent));