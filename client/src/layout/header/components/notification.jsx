import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { NotificationActions } from '../../../modules/notification/redux/actions';
import parse from 'html-react-parser';
import { DateTimeConverter, SlimScroll } from '../../../common-components';
import audioFile from './sound.mp3';
import { NotificationFilterByModules } from '../../../helpers/NotificationFilterByModules';
import NotificationReceiveredInfo from '../../../modules/notification/components/notificationReiceiveredInfo';
import markAll from './mark_all.png';
class Notification extends Component {
    constructor(props) {
        super(props);
        let sound;
        if (!localStorage.getItem("sound")) {
            localStorage.setItem("sound", JSON.stringify(true));
            sound = JSON.parse(localStorage.getItem("sound"));
        } else {
            sound = JSON.parse(localStorage.getItem("sound"));
        }
        this.state = {
            notify: [],
            sound,
            idTabPaneActive: "allNotificationDefault"
        }
    }

    componentWillUnmount() {
        this.props.socket.io.off('new notifications');
    }

    componentDidMount() {
        this.props.getAllManualNotifications();
        this.props.getAllNotifications();
        this.props.socket.io.on('new notifications', data => {
            const { sound } = this.state;
            if (sound) {
                const audio = new Audio(audioFile);
                audio.volume = 0.7;
                audio.play();
            }
            this.props.receiveNotification(data);
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const list = nextProps.notifications.receivered.list.filter(notification => !notification.readed);
        if (JSON.stringify(list) !== JSON.stringify(prevState.notify)) {
            return {
                ...prevState,
                notify: list
            }
        } else {
            return null;
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.sound !== this.state.sound) {
            localStorage.setItem("sound", JSON.stringify(this.state.sound));
        }
    }

    checkTabPaneScroll = (idTabPane) => {
        // Bỏ scroll của tab hiện tại
        SlimScroll.removeVerticalScrollStyleCSS('notifi-tab-pane');

        // Cập nhật scroll cho tab mới mở
        this.setState(state => {
            return {
                ...state,
                idTabPaneActive: idTabPane
            }
        })
    }

    checkPriority = (value) => {
        const valueConvert = parseInt(value);
        if (!value || valueConvert === 1) return "#808080"
        if (valueConvert === 2) return "#ffa707"
        if (valueConvert === 3) return "#28A745"
        if (valueConvert === 4) return "#ff5707"
        if (valueConvert === 5) return "#ff0707"
    }

    handleOnOffSound = () => {
        this.setState({
            ...this.state,
            sound: !this.state.sound,
        })
    }

    showInfoNotification = (noti) => {
        this.setState({
            showInfoNotifycation: noti,
        }, () => {
            !noti.readed && this.props.readedNotification({ id: noti._id, readAll: false });
            window.$(`#modal-notification-receivered-${noti._id}`).appendTo("body").modal('show');//appendTo("body") di chuyển modal ra cạnh body tag, nhằm tránh bị backDrop đè lên modal
        })
    }

    handleReadAllNoti = () => {
        this.props.readedNotification({ id: null, readAll: true })
    }

    render() {
        const { translate } = this.props;
        const { notify, sound, idTabPaneActive, showInfoNotifycation } = this.state;
        let notifyUnRead = notify.filter(notification => !notification.readed);
        const count = notifyUnRead.length;
        let notifyTaskUnRead = [], notifyAssetUnRead = [], notifyKPIUnRead = [], notifyDefault = [];

        const data = NotificationFilterByModules(notifyUnRead);
        notifyTaskUnRead = data.notifyTask;
        notifyAssetUnRead = data.notifyAsset;
        notifyKPIUnRead = data.notifyKPI;
        notifyDefault = data.notifyDefault;

        return (
            <React.Fragment>
                {
                    showInfoNotifycation &&
                    <NotificationReceiveredInfo
                        notificationId={showInfoNotifycation._id}
                        notificationTitle={showInfoNotifycation.title}
                        notificationContent={showInfoNotifycation.content}
                        notificationLevel={showInfoNotifycation.level}
                        notificationSender={showInfoNotifycation.sender}
                        notificationReaded={showInfoNotifycation.readed}
                        notificationFiles={showInfoNotifycation.files}
                        notificationCreatedAt={showInfoNotifycation.createdAt}
                        notificationAssociatedDataObject={showInfoNotifycation.associatedDataObject}
                    />
                }
                <li className="dropdown mega-dropdown notifications-menu">
                    <a href="#abc" className="dropdown-toggle" data-toggle="dropdown" style={{ color: '#4C4C4C', maxHeight: '50px' }} onClick={() => this.checkTabPaneScroll(idTabPaneActive)}>
                        <i className="material-icons" style={{ fontSize: '22px' }}>notifications_none</i>
                        {
                            count > 0 && <span className="label label-warning">{count}</span>
                        }
                    </a>
                    <ul className="dropdown-menu notify-dropdown">
                        <div className="notification-header">
                            <p style={{ margin: 0 }} ><strong className="text-red">{notify.filter(notification => !notification.readed).length}</strong> {translate('notification.news')}</p>
                            <i className="fa fa-cog config-notification-icon" data-toggle="collapse" data-target={`#setting-notification`} aria-expanded="false" aria-hidden="true" ></i>
                        </div>
                        <div className="collapse popup-noti-setting" data-toggle="collapse" id={`setting-notification`} >
                            <p className="close-noti-setting" data-toggle="collapse" data-target={`#setting-notification`}><i className="fa fa-times" aria-hidden="true"></i></p>
                            <div className="mark-all-noti" onClick={this.handleReadAllNoti}>
                                <img src={markAll} alt="mark_all" style={{ height: '20px', width: '20px', marginRight: '4px' }} />
                                <p className="mark-all-text">Đánh dấu là xem tất cả</p>
                            </div>
                            <div className="notification-on-off" >
                                <p style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                                    <span className="material-icons" style={{ color: "#585757", marginRight: '6px' }}>
                                        {
                                            sound ? `volume_up` : `volume_off`
                                        }
                                    </span>
                                    <span>
                                        Âm thanh thông báo
                                    </span>
                                </p>
                                <div className="example">
                                    <button type="button" className={`btn btn-sm btn-toggle ${sound ? 'active' : ''}`} data-toggle="button" aria-pressed="true" autoComplete="off" onClick={this.handleOnOffSound}>
                                        <div className="handle"></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="nav-tabs-custom">
                            <ul className="notify-tabs nav nav-tabs">
                                <li className="active"><a className="notify-action" href="#allNotificationDefault" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationDefault")}>{`Chung (${notifyDefault.length})`}</a></li>
                                <li><a className="notify-action" href="#allNotificationOfTask" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationOfTask")}>{`Công việc (${notifyTaskUnRead.length})`}</a></li>
                                <li><a className="notify-action" href="#allNotificationOfAsset" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationOfAsset")}>{`Tài sản (${notifyAssetUnRead.length})`}</a></li>
                                <li><a className="notify-action" href="#allNotificationOfKPI" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationOfKPI")}>{`KPI (${notifyKPIUnRead.length})`}</a></li>
                            </ul>

                            <div className="tab-content">
                                <div className="tab-pane active notifi-tab-pane" id="allNotificationDefault">
                                    {
                                        notifyDefault.length > 0 ? notifyDefault.map((notification, index) => {
                                            return <div className="notify-wrapper" data-toggle="modal" key={index} onClick={() => this.showInfoNotification(notification)}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {
                                                        notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                            notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                    <i className="fa fa-bomb text-red" />
                                                    }
                                                    <span className="notify-title" >
                                                        {notification.associatedDataObject && notification.associatedDataObject.description ?
                                                            parse(notification.associatedDataObject.description) : notification.title}
                                                        <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                    </span>
                                                </div>
                                            </div>
                                        }) : <p style={{ textAlign: 'center', padding: '10px' }}>Không có thông báo nào</p>
                                    }
                                </div>
                                <div className="tab-pane notifi-tab-pane" id="allNotificationOfTask">
                                    {
                                        notifyTaskUnRead.length > 0 ? notifyTaskUnRead.map((notification, index) => {
                                            return <div className="notify-wrapper" key={index} onClick={() => this.showInfoNotification(notification)}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {
                                                        notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                            notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                    <i className="fa fa-bomb text-red" />
                                                    }
                                                    <span className="notify-title">
                                                        {notification.associatedDataObject && notification.associatedDataObject.description ?
                                                            parse(notification.associatedDataObject.description) : notification.title}
                                                        <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                    </span>
                                                </div>
                                            </div>

                                        }) : <p style={{ textAlign: 'center', padding: '10px' }}>Không có thông báo nào</p>
                                    }
                                </div>
                                <div className="tab-pane notifi-tab-pane" id="allNotificationOfAsset">
                                    {
                                        notifyAssetUnRead.length > 0 ? notifyAssetUnRead.map((notification, index) => {
                                            return <div className="notify-wrapper" key={index} onClick={() => this.showInfoNotification(notification)}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {
                                                        notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                            notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                    <i className="fa fa-bomb text-red" />
                                                    }
                                                    <span className="notify-title" >
                                                        {notification.associatedDataObject && notification.associatedDataObject.description ?
                                                            parse(notification.associatedDataObject.description) : notification.title}
                                                        <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                    </span>
                                                </div>
                                            </div>
                                        }) : <p style={{ textAlign: 'center', padding: '10px' }}>Không có thông báo nào</p>
                                    }
                                </div>
                                <div className="tab-pane notifi-tab-pane" id="allNotificationOfKPI">
                                    {
                                        notifyKPIUnRead.length > 0 ? notifyKPIUnRead.map((notification, index) => {
                                            return <div className="notify-wrapper" key={index} onClick={() => this.showInfoNotification(notification)}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {
                                                        notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                            notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                    <i className="fa fa-bomb text-red" />
                                                    }
                                                    <span className="notify-title" >
                                                        {notification.associatedDataObject && notification.associatedDataObject.description ?
                                                            parse(notification.associatedDataObject.description) : notification.title}
                                                        <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                    </span>
                                                </div>
                                            </div>
                                        }) : <p style={{ textAlign: 'center', padding: '10px' }}>Không có thông báo nào</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <SlimScroll
                            outerComponentId={idTabPaneActive}
                            maxHeight={300}
                            verticalScroll={true}
                            activate={true}
                        />
                        <li className="footer"><Link to="/notifications">{translate('notification.see_all')}</Link></li>
                    </ul>
                </li>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    getAllManualNotifications: NotificationActions.getAllManualNotifications,
    getAllNotifications: NotificationActions.getAllNotifications,
    receiveNotification: NotificationActions.receiveNotification,
    readedNotification: NotificationActions.readedNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Notification));