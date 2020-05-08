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
            limit: 7, page: 1
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
                <div id="tab-notification-receivered" className="box-body" style={{display: 'block'}}>
                    <h4 className="text-center"><b>{translate('notification.receivered')}</b></h4>
                    <ul className="todo-list" style={{border: '1px solid #D2D6DE', minHeight: '300px', }}>
                    {
                        notifications.receivered.paginate.length > 0 ? 
                        notifications.receivered.paginate.map(notification => 
                            <li key={notification._id}>
                                {!notification.readed &&<small className="label label-danger"><i className="fa fa-clock-o" /> Mới</small>}
                                <DateTimeConverter dateTime={notification.createdAt} type={1}/>
                                <span className="text"><b>{notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title}</b></span> - 
                                <span className="text" style={{color: '#6B6B6B'}}>{notification.content.length > 40 ? `${notification.content.slice(0, 40)}...`: notification.content}</span>
                                
                                <div className="tools">
                                    <a href='#' onClick={() => this.handleEdit(notification)} className="text-aqua"><i className="material-icons">visibility</i></a>
                                    <DeleteNotification 
                                        content={translate('notification.delete')}
                                        data={{ id: notification._id, info: notification.title }}
                                        func={this.props.deleteNotification}
                                    />
                                </div>
                            </li>
                        ): notifications.isLoading ?
                        translate('general.loading'):
                        translate('general.no_data')
                    }
                    </ul>
                    <PaginateBar pageTotal={notifications.receivered.totalPages} currentPage={notifications.receivered.page} func={this.setPage}/>
                </div>
            </React.Fragment>
         );
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
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
        this.props.paginateNotifications({
            limit: this.state.limit, page: this.state.page
        });
    }
}
 
const mapState = state => state;
const actions = {
    paginateNotifications: NotificationActions.paginateNotifications,
    deleteNotification: NotificationActions.deleteNotification,
    readedNotification: NotificationActions.readedNotification
}
export default connect(mapState, actions)(withTranslate(TabNotificationReceivered));