import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, PaginateBar, DateTimeConverter } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationReceiveredInfo from './notificationReiceiveredInfo';

class TabNotificationReceivered extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5, page: 1
        }
    }
    render() { 
        const {translate, notifications} = this.props;
        return ( 
            <React.Fragment>
                {
                    this.state.currentRow !== undefined &&
                    <NotificationReceiveredInfo
                        notificationId={this.state.currentRow._id}
                        notificationTitle={this.state.currentRow.title}
                        notificationContent={this.state.currentRow.content}
                        notificationLevel={this.state.currentRow.level}
                        notificationSender={this.state.currentRow.sender}
                        notificationReaded={this.state.currentRow.readed}
                        notificationCreatedAt={this.state.currentRow.createdAt}
                    />
                }
                <div id="tab-notification-receivered" style={{display: 'block'}}>
                    <ul className="todo-list">
                    {
                        notifications.receivered.paginate.length > 0 ? 
                        notifications.receivered.paginate.map(notification => 
                            <li key={notification._id} style={{border: "none", backgroundColor: "white"}}>
                                <div style={{marginBottom: 5}}>
                                    {
                                        notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue"/> :
                                        notification.level === 'general' ? <i className="fa fa-fw fa-bell text-green" /> :
                                        notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                        <i className="fa fa-fw fa-bomb text-red" />
                                    }
                                    <DateTimeConverter dateTime={notification.createdAt} type={1}/>
                                    {notification.readed?
                                        <div className="label" style={{width: 30, display:"inline-block", margin: "0 0 0 5px"}}></div>:
                                        <div className="label label-danger" style={{width: 30, display:"inline-block", margin: "0 0 0 5px"}}>Mới</div>
                                    }
                                    <div className="tools">
                                        <a href="#" onClick={() => this.handleEdit(notification)} className="text-aqua"><i className="material-icons">visibility</i></a>
                                        <DeleteNotification 
                                            content={translate('notification.delete')}
                                            data={{ id: notification._id, info: notification.title }}
                                            func={this.props.deleteNotification}
                                        />
                                    </div>
                                </div>
                                <span className="threedots" style={{maxWidth: "100%", display: "inline-block"}}><b>{notification.title}</b> - {notification.content}</span>
                                
                            </li>
                        ): notifications.isLoading ?
                        <div className="table-info-panel" style={{textAlign: "left"}}>{translate('general.loading')}</div>:
                        <div className="table-info-panel" style={{textAlign: "left"}}>{translate('general.no_data')}</div>
                    }
                    </ul>
                    <PaginateBar id="receivered" pageTotal={notifications.receivered.totalPages} currentPage={notifications.receivered.page} func={this.setPage}/>
                </div>
            </React.Fragment>
         );
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber, content: {level: this.props.notifications.receivered.level} };
        this.props.paginateNotifications(data);
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

    convertContent = (content) => {
        const newContent = content.slice(0,24);
        return newContent.concat(newContent, ' ... ');
    }

    componentDidMount(){
        this.props.getAllNotifications();
        this.props.paginateNotifications({
            limit: this.state.limit, page: this.state.page,
            content: {level: this.props.notifications.receivered.level}
        });
    }
}
 
const mapState = state => state;
const actions = {
    getAllNotifications: NotificationActions.getAllNotifications,
    paginateNotifications: NotificationActions.paginateNotifications,
    deleteNotification: NotificationActions.deleteNotification,
    readedNotification: NotificationActions.readedNotification
}
export default connect(mapState, actions)(withTranslate(TabNotificationReceivered));