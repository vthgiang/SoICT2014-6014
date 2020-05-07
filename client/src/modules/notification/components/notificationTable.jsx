import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar, DeleteNotification } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationReceiveredInfo from './notificationReiceiveredInfo';
import NotificationSentInfo from './notificationSentInfo';
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';

class NotificationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const {translate, notifications, auth} = this.props;
        return ( 
            <React.Fragment>
                {
                    this.state.currentRow !== undefined &&
                    <React.Fragment>
                        <NotificationReceiveredInfo
                            notificationId={this.state.currentRow._id}
                            notificationTitle={this.state.currentRow.title}
                            notificationContent={this.state.currentRow.content}
                            notificationLevel={this.state.currentRow.level}
                            notificationSender={this.state.currentRow.sender}
                            notificationReaded={this.state.currentRow.readed}
                            notificationCreatedAt={this.state.currentRow.createdAt}
                        />
                        <NotificationSentInfo
                            notificationId={this.state.currentRow._id}
                            notificationTitle={this.state.currentRow.title}
                            notificationContent={this.state.currentRow.content}
                            notificationLevel={this.state.currentRow.level}
                            notificationSender={this.state.currentRow.sender}
                            notificationReaded={this.state.currentRow.readed}
                            notificationCreatedAt={this.state.currentRow.createdAt}
                            notificationOrganizationalUnits={this.state.currentRow.organizationalUnits}
                            notificationUsers={this.state.currentRow.users}
                        />
                    </React.Fragment>
                }
                <div className="box" role="tabpanel">
                    {/* Tab panes */}
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane active" id="notification-receivered">
                            <div className="box-body">
                                <div className="table-responsive mailbox-messages" style={{minHeight: '450px'}}>
                                    <table className="table table-hover table-striped">
                                    <tbody>
                                        {
                                            notifications.receivered.list.length > 0 ? 
                                            notifications.receivered.list.map(notification => 
                                                <tr key={notification._id}>
                                                    <td>
                                                        <strong> {notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title} </strong>
                                                        {
                                                            !notification.readed && <span className="label bg-green">Mới</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        <p>{notification.content.length > 80 ? `${notification.content.slice(0, 80)}...`: notification.content}</p>
                                                    </td>
                                                    <td style={{width: '5px'}}>
                                                    <a onClick={() => this.handleEdit(notification)} className="text-aqua"><i className="material-icons">visibility</i></a>
                                                    <DeleteNotification 
                                                        content={translate('notification.delete')}
                                                        data={{ id: notification._id, info: notification.title }}
                                                        func={this.props.deleteNotificationReceivered}
                                                    />
                                                    </td>
                                                </tr>  
                                            ) : notifications.isLoading ?
                                            <tr><td colSpan={4}>{translate('general.loading')}</td></tr>:
                                            <tr><td colSpan={4}>{translate('general.no_data')}</td></tr>
                                        }
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* <div className="box-footer no-padding">
                                <div className="mailbox-controls">
                                    <PaginateBar pageTotal={20} currentPage={2}/>
                                </div>
                            </div> */}
                        </div>
                        { this.checkHasComponent('create-notification') &&   
                        <div role="tabpanel" className="tab-pane" id="notification-sent">
                            <div className="box-header with-border">
                                
                            </div>
                            <div className="box-body">
                                <div className="table-responsive mailbox-messages" style={{minHeight: '300px'}}>
                                    <table className="table table-hover table-striped">
                                    <tbody>
                                        {
                                            notifications.sent.list.length > 0 ? 
                                            notifications.sent.list.map(notification => 
                                                <tr key={notification._id}>
                                                    <td>
                                                        <strong> {notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title}</strong>
                                                    </td>
                                                    <td>
                                                    <p>{notification.content.length > 80 ? `${notification.content.slice(0, 80)}...`: notification.content}</p>
                                                    </td>
                                                    <td style={{width: '5px'}}>
                                                        <a onClick={() => this.showNotificationInformation(notification)} className="text-aqua"><i className="material-icons">visibility</i></a>
                                                        <DeleteNotification 
                                                            content={translate('notification.delete')}
                                                            data={{ id: notification._id, info: notification.title }}
                                                            func={this.props.deleteNotificationSent}
                                                        />
                                                    </td>
                                                </tr>  
                                            ) : <tr style={{textAlign: 'center'}}><td colSpan={4}>notification null</td></tr>
                                        }
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="box-footer no-padding">
                                {/* <div className="mailbox-controls">
                                    <PaginateBar pageTotal={20} currentPage={2}/>
                                </div> */}
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
    
    handleEdit = async (notification) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: notification
            }
        });
        !notification.readed && await this.props.readedNotification(notification._id)
        window.$('#modal-notification-receivered').modal('show');
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
        this.props.getAllNotifications();
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
const actions = {
    getAllManualNotifications: NotificationActions.getAllManualNotifications,
    getAllNotifications: NotificationActions.getAllNotifications,

    getReceivered: NotificationActions.getNotificationReceivered,
    getSent: NotificationActions.getNotificationSent,
    deleteNotificationReceivered: NotificationActions.deleteNotificationReceivered,
    deleteNotificationSent: NotificationActions.deleteNotificationSent,
    readedNotification: NotificationActions.readedNotification
}
export default connect(mapState, actions)(withTranslate(NotificationTable));