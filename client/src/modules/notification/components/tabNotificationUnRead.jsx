import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DeleteNotification, PaginateBar, DateTimeConverter } from '../../../common-components';
import { NotificationActions } from '../redux/actions';
import NotificationReceiveredInfo from './notificationReiceiveredInfo';
import parse from 'html-react-parser';
import innerText from 'react-innertext';
import { NotificationFilterByModules } from '../../../helpers/NotificationFilterByModules';
class TabNotificationUnRead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 10, page: 1
        }
    }
    checkPriority = (value) => {
        const valueConvert = parseInt(value);
        if (!value || valueConvert === 1) return "#808080"
        if (valueConvert === 2) return "#ffa707"
        if (valueConvert === 3) return "#28A745"
        if (valueConvert === 4) return "#ff5707"
        if (valueConvert === 5) return "#ff0707"
    }

    render() {
        const { translate, notifications } = this.props;
        const { currentRow } = this.state;
        let content = [];
        let notifyTaskUnRead = [], notifyAssetUnRead = [], notifyKPIUnRead = [], notifyDefault = [];

        if (notifications.isLoading === false) {
            content = notifications.receivered.paginate.map(x => x.content);
            content = content.map(x => {
                let y = x.split('');
                let i = 0;
                while (i < y.length) {
                    if (y[i] === '&') {
                        y.splice(i, 6);
                        i = i - 2;
                    }
                    i++;
                }
                i = 1;
                while (i < y.length) {
                    if (y[i] === ' ' && y[i - 1] === ' ') {
                        y.splice(i, 1);
                        i = i - 1;
                    }
                    i++;
                }
                y = y.join('');
                return innerText(parse(y));
            });
        }

        if (notifications.receivered.paginate.length > 0) {
            const data = NotificationFilterByModules(notifications.receivered.paginate);
            notifyTaskUnRead = data.notifyTask;
            notifyAssetUnRead = data.notifyAsset;
            notifyKPIUnRead = data.notifyKPI;
            notifyDefault = data.notifyDefault;
        }

        return (
            <React.Fragment>
                {
                    currentRow &&
                    <NotificationReceiveredInfo
                        notificationId={currentRow._id}
                        notificationTitle={currentRow.title}
                        notificationContent={currentRow.content}
                        notificationLevel={currentRow.level}
                        notificationSender={currentRow.sender}
                        notificationReaded={currentRow.readed}
                        notificationCreatedAt={currentRow.createdAt}
                        notificationFiles={currentRow.files}
                        notificationAssociatedDataObject={currentRow.associatedDataObject}
                    />
                }
                <div id="tab-notification-un-read" style={{ display: 'block' }}>
                    <div className="nav-tabs-custom">
                        <ul className="notify-tabs nav nav-tabs">
                            <li className="active"><a className="notify-action" href="#allNotificationUnread" data-toggle="tab" >{`Tất cả (${notifications.receivered.paginate.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationUnreadDefault" data-toggle="tab" >{`Chung (${notifyDefault.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationUnreadOfTask" data-toggle="tab" >{`Công việc (${notifyTaskUnRead.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationUnreadOfAsset" data-toggle="tab" >{`Tài sản (${notifyAssetUnRead.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationUnreadOfKPI" data-toggle="tab" >{`KPI (${notifyKPIUnRead.length})`}</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane active notifi-tab-pane" id="allNotificationUnread">
                                <ul className="todo-list">
                                    {
                                        notifications.receivered.paginate.length > 0 ?
                                            notifications.receivered.paginate.map((notification, index) =>
                                                <li key={index} style={{ border: "none", backgroundColor: "white", cursor: "pointer", overflow: "hidden", borderBottom: '1px solid #ececec' }}>
                                                    <div className="row" >
                                                        <div style={{ marginBottom: 5 }} className="col-sm-11" onClick={() => this.handleEdit(notification)}>
                                                            <div>{
                                                                notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue" /> :
                                                                    notification.level === 'general' ? <i className="fa fa-fw fa-bell" style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}` }} /> :
                                                                        notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                                                            <i className="fa fa-fw fa-bomb text-red" />
                                                            }
                                                                <DateTimeConverter dateTime={notification.createdAt} type={1} />
                                                                {notification.readed ?
                                                                    <div className="label" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}></div> :
                                                                    <div className="label label-danger" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}>{translate('notification.new')}</div>
                                                                }</div>
                                                            <span className="threedots" style={{ maxWidth: "100%", display: "inline-block" }}><b>{notification.title}</b> {content[index]}</span>
                                                        </div>
                                                        <div className="col-sm-1">
                                                            <DeleteNotification
                                                                content={translate('notification.delete')}
                                                                data={{ id: notification._id, info: notification.title }}
                                                                func={this.props.deleteNotification}
                                                            />

                                                        </div>
                                                    </div>
                                                </li>
                                            ) : notifications.isLoading ?
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.loading')}</div> :
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.no_data')}</div>
                                    }
                                </ul>
                            </div>

                            {/* Tab thông báo chung */}
                            <div className="tab-pane notifi-tab-pane" id="allNotificationUnreadDefault">
                                <ul className="todo-list">
                                    {
                                        notifyDefault.length > 0 ?
                                            notifyDefault.map((notification, index) =>
                                                <li key={index} style={{ border: "none", backgroundColor: "white", cursor: "pointer", overflow: "hidden", borderBottom: '1px solid #ececec' }}>
                                                    <div className="row" >
                                                        <div style={{ marginBottom: 5 }} className="col-sm-11" onClick={() => this.handleEdit(notification)}>
                                                            <div>{
                                                                notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue" /> :
                                                                    notification.level === 'general' ? <i className="fa fa-fw fa-bell" style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}` }} /> :
                                                                        notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                                                            <i className="fa fa-fw fa-bomb text-red" />
                                                            }
                                                                <DateTimeConverter dateTime={notification.createdAt} type={1} />
                                                                {notification.readed ?
                                                                    <div className="label" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}></div> :
                                                                    <div className="label label-danger" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}>{translate('notification.new')}</div>
                                                                }</div>
                                                            <span className="threedots" style={{ maxWidth: "100%", display: "inline-block" }}><b>{notification.title}</b> {content[index]}</span>
                                                        </div>
                                                        <div className="col-sm-1">
                                                            <DeleteNotification
                                                                content={translate('notification.delete')}
                                                                data={{ id: notification._id, info: notification.title }}
                                                                func={this.props.deleteNotification}
                                                            />

                                                        </div>
                                                    </div>
                                                </li>
                                            ) : notifications.isLoading ?
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.loading')}</div> :
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.no_data')}</div>
                                    }
                                </ul>
                            </div>

                            {/* Tab thông công việc */}
                            <div className="tab-pane notifi-tab-pane" id="allNotificationUnreadOfTask">
                                <ul className="todo-list">
                                    {
                                        notifyTaskUnRead.length > 0 ?
                                            notifyTaskUnRead.map((notification, index) =>
                                                <li key={index} style={{ border: "none", backgroundColor: "white", cursor: "pointer", overflow: "hidden", borderBottom: '1px solid #ececec' }}>
                                                    <div className="row" >
                                                        <div style={{ marginBottom: 5 }} className="col-sm-11" onClick={() => this.handleEdit(notification)}>
                                                            <div>{
                                                                notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue" /> :
                                                                    notification.level === 'general' ? <i className="fa fa-fw fa-bell" style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}` }} /> :
                                                                        notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                                                            <i className="fa fa-fw fa-bomb text-red" />
                                                            }
                                                                <DateTimeConverter dateTime={notification.createdAt} type={1} />
                                                                {notification.readed ?
                                                                    <div className="label" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}></div> :
                                                                    <div className="label label-danger" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}>{translate('notification.new')}</div>
                                                                }</div>
                                                            <span className="threedots" style={{ maxWidth: "100%", display: "inline-block" }}><b>{notification.title}</b> {content[index]}</span>
                                                        </div>
                                                        <div className="col-sm-1">
                                                            <DeleteNotification
                                                                content={translate('notification.delete')}
                                                                data={{ id: notification._id, info: notification.title }}
                                                                func={this.props.deleteNotification}
                                                            />

                                                        </div>
                                                    </div>
                                                </li>
                                            ) : notifications.isLoading ?
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.loading')}</div> :
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.no_data')}</div>
                                    }
                                </ul>
                            </div>

                            {/* Tab thông báo tài sản */}
                            <div className="tab-pane notifi-tab-pane" id="allNotificationUnreadOfAsset">
                                <ul className="todo-list">
                                    {
                                        notifyAssetUnRead.length > 0 ?
                                            notifyAssetUnRead.map((notification, index) =>
                                                <li key={index} style={{ border: "none", backgroundColor: "white", cursor: "pointer", overflow: "hidden", borderBottom: '1px solid #ececec' }}>
                                                    <div className="row" >
                                                        <div style={{ marginBottom: 5 }} className="col-sm-11" onClick={() => this.handleEdit(notification)}>
                                                            <div>{
                                                                notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue" /> :
                                                                    notification.level === 'general' ? <i className="fa fa-fw fa-bell" style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}` }} /> :
                                                                        notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                                                            <i className="fa fa-fw fa-bomb text-red" />
                                                            }
                                                                <DateTimeConverter dateTime={notification.createdAt} type={1} />
                                                                {notification.readed ?
                                                                    <div className="label" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}></div> :
                                                                    <div className="label label-danger" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}>{translate('notification.new')}</div>
                                                                }</div>
                                                            <span className="threedots" style={{ maxWidth: "100%", display: "inline-block" }}><b>{notification.title}</b> {content[index]}</span>
                                                        </div>
                                                        <div className="col-sm-1">
                                                            <DeleteNotification
                                                                content={translate('notification.delete')}
                                                                data={{ id: notification._id, info: notification.title }}
                                                                func={this.props.deleteNotification}
                                                            />

                                                        </div>
                                                    </div>
                                                </li>
                                            ) : notifications.isLoading ?
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.loading')}</div> :
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.no_data')}</div>
                                    }
                                </ul>
                            </div>

                            {/* Tab thông báo KPI */}
                            <div className="tab-pane notifi-tab-pane" id="allNotificationUnreadOfKPI">
                                <ul className="todo-list">
                                    {
                                        notifyKPIUnRead.length > 0 ?
                                            notifyKPIUnRead.map((notification, index) =>
                                                <li key={index} style={{ border: "none", backgroundColor: "white", cursor: "pointer", overflow: "hidden", borderBottom: '1px solid #ececec' }}>
                                                    <div className="row" >
                                                        <div style={{ marginBottom: 5 }} className="col-sm-11" onClick={() => this.handleEdit(notification)}>
                                                            <div>{
                                                                notification.level === 'info' ? <i className="fa fa-fw fa-info-circle text-blue" /> :
                                                                    notification.level === 'general' ? <i className="fa fa-fw fa-bell" style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}` }} /> :
                                                                        notification.level === 'important' ? <i className="fa fa-fw fa-warning text-yellow" /> :
                                                                            <i className="fa fa-fw fa-bomb text-red" />
                                                            }
                                                                <DateTimeConverter dateTime={notification.createdAt} type={1} />
                                                                {notification.readed ?
                                                                    <div className="label" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}></div> :
                                                                    <div className="label label-danger" style={{ width: 30, display: "inline-block", margin: "0 0 0 5px" }}>{translate('notification.new')}</div>
                                                                }</div>
                                                            <span className="threedots" style={{ maxWidth: "100%", display: "inline-block" }}><b>{notification.title}</b> {content[index]}</span>
                                                        </div>
                                                        <div className="col-sm-1">
                                                            <DeleteNotification
                                                                content={translate('notification.delete')}
                                                                data={{ id: notification._id, info: notification.title }}
                                                                func={this.props.deleteNotification}
                                                            />

                                                        </div>
                                                    </div>
                                                </li>
                                            ) : notifications.isLoading ?
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.loading')}</div> :
                                                <div className="table-info-panel" style={{ textAlign: "left" }}>{translate('general.no_data')}</div>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }}><span style={{ cursor: "pointer", color: "#385898" }} onClick={() => this.handleClick()}>{translate('notification.mark_all_readed')}</span></div>
                    <PaginateBar id="un-read" pageTotal={notifications.receivered.totalPages} currentPage={notifications.receivered.page} func={this.setPage} />
                </div>
            </React.Fragment>
        );
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber, content: { level: this.props.notifications.receivered.level }, readed: false };
        this.props.paginateNotifications(data);
    }

    handleEdit = async (notification) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: notification
            }
        });
        !notification.readed && await this.props.readedNotification({ id: notification._id, readAll: false })
        window.$(`#modal-notification-receivered-${notification._id}`).modal('show');
    }

    convertContent = (content) => {
        const newContent = content.slice(0, 24);
        return newContent.concat(newContent, ' ... ');
    }

    componentDidMount() {
        this.props.getAllNotifications();
        this.props.paginateNotifications({
            limit: this.state.limit, page: this.state.page,
            content: { level: this.props.notifications.receivered.level, readed: false }
        });
    }

    handleClick = async () => {
        await this.props.readedNotification({ id: null, readAll: true })
    }
}

function mapState(state) {
    const { notifications } = state;
    return { notifications };
}
const actions = {
    getAllNotifications: NotificationActions.getAllNotifications,
    paginateNotifications: NotificationActions.paginateNotifications,
    deleteNotification: NotificationActions.deleteNotification,
    readedNotification: NotificationActions.readedNotification,
}
export default connect(mapState, actions)(withTranslate(TabNotificationUnRead));