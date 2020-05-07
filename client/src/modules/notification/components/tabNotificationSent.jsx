import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, PaginateBar } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationSentInfo from './notificationSentInfo';

class TabNotificationSent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 7,
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
                    />
                }
                <div id="tab-notification-sent" className="box-body" style={{display: 'none'}}>
                    <h4 className="text-center"><b>{translate('notification.sent')}</b></h4>
                    <ul className="todo-list" style={{border: '1px solid #D2D6DE', minHeight: '300px', }}>
                    {
                        notifications.sent.paginate.length > 0 ? 
                        notifications.sent.paginate.map(notification => 
                            <li key={notification._id}>
                            <span className="text"><b>{notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title}</b></span> - 
                                <span className="text" style={{color: '#6B6B6B'}}>{notification.content.length > 40 ? `${notification.content.slice(0, 40)}...`: notification.content}</span>
                                <div className="tools">
                                    <a href={`#${notification.title}`} type="button" onClick={() => this.showNotificationInformation(notification)} className="text-aqua"><i className="material-icons">visibility</i></a>
                                    <DeleteNotification 
                                        content={translate('notification.delete')}
                                        data={{ id: notification._id, info: notification.title }}
                                        func={this.props.deleteManualNotification}
                                    />
                                </div>
                            </li>
                        ): notifications.isLoading ?
                        translate('general.loading'):
                        translate('general.no_data')
                    }
                    </ul>
                    <PaginateBar pageTotal={notifications.sent.totalPages} currentPage={notifications.sent.page} func={this.setPage}/>
                </div>
            </React.Fragment>
         );
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
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
        this.props.paginateManualNotifications({limit: this.state.limit, page: this.state.page});
    }
}
 
const mapState = state => state;
const actions = {
    paginateManualNotifications: NotificationActions.paginateManualNotifications,
    deleteManualNotification: NotificationActions.deleteManualNotification
}
export default connect(mapState, actions)(withTranslate(TabNotificationSent));