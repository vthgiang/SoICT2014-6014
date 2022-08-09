import React, { useState, useEffect } from 'react';
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
import useDeepCompareEffect from 'use-deep-compare-effect'

const checkPriority = (value) => {
    const valueConvert = parseInt(value);
    if (!value || valueConvert === 1) return "#808080"
    if (valueConvert === 2) return "#ffa707"
    if (valueConvert === 3) return "#28A745"
    if (valueConvert === 4) return "#ff5707"
    if (valueConvert === 5) return "#ff0707"
}


function Notification(props) {
    const [state, setState] = useState(() => {
        let sound;
        if (!localStorage.getItem("sound")) {
            localStorage.setItem("sound", JSON.stringify(true));
            sound = JSON.parse(localStorage.getItem("sound"));
        } else {
            sound = JSON.parse(localStorage.getItem("sound"));
        }
        return {
            notify: [],
            sound,
            idTabPaneActive: "allNotificationDefault"
        }
    })

    useDeepCompareEffect(() => {
        const list = props?.notifications?.receivered?.list.filter(notification => !notification.readed);
        if (list)
            setState({
                ...state,
                notify: list
            })
    }, [props?.notifications?.receivered?.list])

    useEffect(() => {
        props.getAllManualNotifications();
        props.getAllNotifications();
    }, [])

    useEffect(() => {
        props.socket.io.on('new notifications', data => {
            console.log('new notificationsEFECT')
            const { sound } = state;
            if (sound) {
                const audio = new Audio(audioFile);
                audio.volume = 0.7;
                //nếu trình duyệt khác safari thì có tiếng
                if (!/apple/i.test(navigator.vendor)) {
                    audio.play();
                }
            }
            props.receiveNotification(data);
        });

        return () => props.socket.io.off('new notifications');
    })


    useEffect(() => {
        if (state.showInfoNotifycation)
            window.$(`#modal-notification-receivered-${state.showInfoNotifycation._id}`).appendTo("body").modal('show');//appendTo("body") di chuyển modal ra cạnh body tag, nhằm tránh bị backDrop đè lên modal
    }, [JSON.stringify(state?.showInfoNotifycation)])

    const checkTabPaneScroll = (idTabPane) => {
        // Bỏ scroll của tab hiện tại
        SlimScroll.removeVerticalScrollStyleCSS('notifi-tab-pane');

        // Cập nhật scroll cho tab mới mở
        setState(state => {
            return {
                ...state,
                idTabPaneActive: idTabPane
            }
        })
    }


    const handleOnOffSound = () => {
        const { sound } = state;
        setState({
            ...state,
            sound: !state.sound,
        })
        localStorage.setItem("sound", JSON.stringify(!sound));
    }

    const showInfoNotification = (noti) => {
        setState({
            showInfoNotifycation: noti,
        })
        !noti.readed && props.readedNotification({ id: noti._id, readAll: false });
        window.$(`#modal-notification-receivered-${noti._id}`).appendTo("body").modal('show');//appendTo("body") di chuyển modal ra cạnh body tag, nhằm tránh bị backDrop đè lên modal
    }



    const handleReadAllNoti = () => {
        props.readedNotification({ id: null, readAll: true })
    }

    const { translate } = props;
    const { notify, sound, idTabPaneActive, showInfoNotifycation } = state;
    let notifyUnRead = notify?.length ? notify.filter(notification => !notification.readed) : [];
    const count = notifyUnRead.length;
    let notifyTaskUnRead = [], notifyAssetUnRead = [], notifyKPIUnRead = [], notifyProductionUnRead = [], notifyDefault = [], notifyProcessUnRead = [];

    const data = NotificationFilterByModules(notifyUnRead);
    notifyTaskUnRead = data.notifyTask;
    notifyAssetUnRead = data.notifyAsset;
    notifyKPIUnRead = data.notifyKPI;
    notifyProductionUnRead = data.notifyProduction;
    notifyDefault = data.notifyDefault;
    notifyProcessUnRead = data.notifyProcess?data.notifyProcess:[]
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
                <a href="#abc" className="dropdown-toggle" data-toggle="dropdown" style={{ color: '#4C4C4C', maxHeight: '50px' }} onClick={() => checkTabPaneScroll(idTabPaneActive)}>
                    <i className="material-icons" style={{ fontSize: '22px' }}>notifications_none</i>
                    {
                        count > 0 && <span className="label label-warning">{count}</span>
                    }
                </a>
                <ul className="dropdown-menu notify-dropdown">
                    <div className="notification-header">
                        <p style={{ margin: 0 }} ><strong className="text-red">{notify?.length ? notify.filter(notification => !notification.readed).length : 0}</strong> {translate('notification.news')}</p>
                        <i className="fa fa-cog config-notification-icon" data-toggle="collapse" data-target={`#setting-notification`} aria-expanded="false" aria-hidden="true" ></i>
                    </div>
                    <div className="collapse popup-noti-setting" data-toggle="collapse" id={`setting-notification`} >
                        <p className="close-noti-setting" data-toggle="collapse" data-target={`#setting-notification`}><i className="fa fa-times" aria-hidden="true"></i></p>
                        <div className="mark-all-noti" onClick={handleReadAllNoti}>
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
                                <button type="button" className={`btn btn-sm btn-toggle ${sound ? 'active' : ''}`} data-toggle="button" aria-pressed="true" autoComplete="off" onClick={handleOnOffSound}>
                                    <div className="handle"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="nav-tabs-custom">
                        <ul className="notify-tabs nav nav-tabs">
                            <li className="active"><a className="notify-action" href="#allNotificationDefault" data-toggle="tab" onClick={() => checkTabPaneScroll("allNotificationDefault")}>{`Chung (${notifyDefault.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationOfTask" data-toggle="tab" onClick={() => checkTabPaneScroll("allNotificationOfTask")}>{`Công việc (${notifyTaskUnRead.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationOfAsset" data-toggle="tab" onClick={() => checkTabPaneScroll("allNotificationOfAsset")}>{`Tài sản (${notifyAssetUnRead.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationOfKPI" data-toggle="tab" onClick={() => checkTabPaneScroll("allNotificationOfKPI")}>{`KPI (${notifyKPIUnRead.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationOfProduction" data-toggle="tab" onClick={() => checkTabPaneScroll("allNotificationOfProduction")}>{`Sản phẩm (${notifyProductionUnRead.length})`}</a></li>
                            <li><a className="notify-action" href="#allNotificationOfProcess" data-toggle="tab" onClick={() => checkTabPaneScroll("allNotificationOfProcess")}>{`Quy trình (${notifyProcessUnRead.length})`}</a></li>
                        </ul>

                        <div className="tab-content">
                            <div className="tab-pane active notifi-tab-pane" id="allNotificationDefault">
                                {
                                    notifyDefault.length > 0 ? notifyDefault.map((notification, index) => {
                                        return <div className="notify-wrapper" data-toggle="modal" key={index} onClick={() => showInfoNotification(notification)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {
                                                    notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                        notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
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
                                        return <div className="notify-wrapper" key={index} onClick={() => showInfoNotification(notification)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {
                                                    notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                        notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
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
                                        return <div className="notify-wrapper" key={index} onClick={() => showInfoNotification(notification)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {
                                                    notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                        notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
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
                                        return <div className="notify-wrapper" key={index} onClick={() => showInfoNotification(notification)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {
                                                    notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                        notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
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
                            <div className="tab-pane notifi-tab-pane" id="allNotificationOfProduction">
                                {
                                    notifyProductionUnRead.length > 0 ? notifyProductionUnRead.map((notification, index) => {
                                        return <div className="notify-wrapper" key={index} onClick={() => showInfoNotification(notification)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {
                                                    notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                        notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
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
                            <div className="tab-pane notifi-tab-pane" id="allNotificationOfProcess">
                                {
                                    notifyProcessUnRead.length > 0 ? notifyProcessUnRead.map((notification, index) => {
                                        return <div className="notify-wrapper" key={index} onClick={() => showInfoNotification(notification)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {
                                                    notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                        notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
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
