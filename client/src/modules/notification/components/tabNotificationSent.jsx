import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, PaginateBar, DateTimeConverter } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationSentInfo from './notificationSentInfo';

class TabNotificationSent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1
         }
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
                        notificationOrganizationalUnits={this.state.currentRow.organizationalUnits}
                        notificationUsers={this.state.currentRow.users}
                    />
                }
                <div id="tab-notification-sent" style={{display: 'none'}}>
                    <ul className="todo-list">
                    {
                        notifications.sent.paginate.length > 0 ? 
                        notifications.sent.paginate.map(notification => 
                            <li key={notification._id}  style={{border: "none", backgroundColor: "white"}}>

                                <div style={{marginBottom: 5}}>
                                    {
                                        notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue"/> :
                                        notification.level === 'general' ? <i className="fa fa-fw fa-bell text-green" /> :
                                        notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                        <i className="fa fa-fw fa-bomb text-red" />
                                    }
                                    <DateTimeConverter dateTime={notification.createdAt} type={1}/>
                                    
                                    <div className="tools">
                                        <a href='#' onClick={() => this.showNotificationInformation(notification)} className="text-aqua"><i className="material-icons">visibility</i></a>
                                        <DeleteNotification 
                                            content={translate('notification.delete')}
                                            data={{ id: notification._id, info: notification.title }}
                                            func={this.props.deleteManualNotification}
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
                    <PaginateBar pageTotal={notifications.sent.totalPages} currentPage={notifications.sent.page} func={this.setPage}/>
                </div>
            </React.Fragment>
         );
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber, content: {level: this.props.notifications.sent.level}};
        this.props.paginateManualNotifications(data);
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
        this.props.paginateManualNotifications({
            limit: this.state.limit, 
            page: this.state.page,
            content: {level: this.props.notifications.sent.level}
        });
    }
}
 
const mapState = state => state;
const actions = {
    paginateManualNotifications: NotificationActions.paginateManualNotifications,
    deleteManualNotification: NotificationActions.deleteManualNotification
}
export default connect(mapState, actions)(withTranslate(TabNotificationSent));