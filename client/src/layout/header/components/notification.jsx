import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { NotificationActions } from '../../../modules/notification/redux/actions';
import parse from 'html-react-parser';
import { DateTimeConverter, SlimScroll } from '../../../common-components';
import audioFile from './sound.mp3';

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
                audio.play();
            }
            this.props.receiveNofitication(data);
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
        let tabPaneScroll = window.$('.StyleScrollDiv.StyleScrollDiv-y');

        if (tabPaneScroll) {
            tabPaneScroll.removeClass("StyleScrollDiv StyleScrollDiv-y");
            tabPaneScroll.css("maxHeight", "");
        }
        
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


    render() {
        const { translate } = this.props;
        const { notify, sound, idTabPaneActive } = this.state;
        let notifyUnRead = notify.filter(notification => !notification.readed);
        const count = notifyUnRead.length;
        let notifyTaskUnRead = [], notifyAssetUnRead = [], notifyKPIUnRead = [], notifyDefault = [];
        notifyUnRead.forEach(obj => {
            let type = parseInt(obj.type);
            switch (type) {
                case 1:
                    notifyTaskUnRead = [...notifyTaskUnRead, obj]
                    break;
                case 2:
                    notifyAssetUnRead = [...notifyAssetUnRead, obj];
                    break;
                case 3:
                    notifyKPIUnRead = [...notifyKPIUnRead, obj];
                    break;
                default:
                    notifyDefault = [...notifyDefault, obj];
                    break
            }
        })


        return (
            <React.Fragment>
                <li className="dropdown mega-dropdown notifications-menu">
                    <a href="#abc" className="dropdown-toggle" data-toggle="dropdown" style={{ color: '#4C4C4C', maxHeight: '50px' }}>
                        <i className="material-icons" style={{ fontSize: '22px' }}>notifications_none</i>
                        {
                            count > 0 && <span className="label label-warning">{count}</span>
                        }
                    </a>
                    <ul className="dropdown-menu notify-dropdown" style={{ borderColor: 'gray', width: '400px' }}>
                        <li className="header text-center"><strong className="text-red">{notify.filter(notification => !notification.readed).length}</strong> {translate('notification.news')}</li>
                        <div className="nav-tabs-custom">
                            <ul className="notify-tabs nav nav-tabs">
                                <li className="active"><a className="notify-action" href="#allNotificationDefault" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationDefault")}>{`Chung (${notifyDefault.length})`}</a></li>
                                <li><a className="notify-action" href="#allNotificationOfTask" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationOfTask")}>{`Công việc (${notifyTaskUnRead.length})`}</a></li>
                                <li><a className="notify-action" href="#allNotificationOfAsset" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationOfAsset")}>{`Tài sản (${notifyAssetUnRead.length})`}</a></li>
                                <li><a className="notify-action" href="#allNotificationOfKPI" data-toggle="tab" onClick={() => this.checkTabPaneScroll("allNotificationOfKPI")}>{`KPI (${notifyKPIUnRead.length})`}</a></li>
                                <a style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
                                    <span className="material-icons" style={{ cursor: 'pointer' }} onClick={this.handleOnOffSound}>
                                        {
                                            sound ? `volume_up` : `volume_off`
                                        }
                                    </span></a>
                            </ul>

                            <div className="tab-content">
                                <div className="tab-pane active" id="allNotificationDefault">
                                    {
                                        notifyDefault.length > 0 ? notifyDefault.map((notification, index) => {
                                            return <div className="notify-wrapper" key={index}>
                                                <Link to="/notifications">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                            notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                                notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                    notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                        <i className="fa fa-bomb text-red" />
                                                        }
                                                        <p className="notify-title" >
                                                            {notification.shortContent ? parse(notification.shortContent) : notification.title}
                                                            <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        }) : <p style={{ textAlign: 'center', padding: '10px' }}>Không có thông báo nào</p>
                                    }
                                </div>
                                <div className="tab-pane" id="allNotificationOfTask">
                                    {
                                        notifyTaskUnRead.length > 0 ? notifyTaskUnRead.map((notification, index) => {
                                            return <div className="notify-wrapper" key={index}>
                                                <Link to="/notifications">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                            notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                                notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                    notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                        <i className="fa fa-bomb text-red" />
                                                        }
                                                        <p className="notify-title" >
                                                            {notification.shortContent ? parse(notification.shortContent) : notification.title}
                                                            <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>

                                        }) : <p style={{ textAlign: 'center', padding: '10px' }}>Không có thông báo nào</p>
                                    }
                                </div>
                                <div className="tab-pane" id="allNotificationOfAsset">
                                    {
                                        notifyAssetUnRead.length > 0 ? notifyAssetUnRead.map((notification, index) => {
                                            return <div className="notify-wrapper" key={index}>
                                                <Link to="/notifications">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                            notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                                notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                    notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                        <i className="fa fa-bomb text-red" />
                                                        }
                                                        <p className="notify-title" >
                                                            {notification.shortContent ? parse(notification.shortContent) : notification.title}
                                                            <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        }) : <p style={{ textAlign: 'center', padding: '10px' }}>Không có thông báo nào</p>
                                    }
                                </div>
                                <div className="tab-pane" id="allNotificationOfKPI">
                                    {
                                        notifyKPIUnRead.length > 0 ? notifyKPIUnRead.map((notification, index) => {
                                            return <div className="notify-wrapper" key={index}>
                                                <Link to="/notifications">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                            notification.level === 'info' ? <i className="fa fa-info-circle text-blue" /> :
                                                                notification.level === 'general' ? <i className="fa fa-bell " style={{ color: `${this.checkPriority(notification.associatedDataObject && notification.associatedDataObject.value)}`, fontSize: '15px' }} /> :
                                                                    notification.level === 'important' ? <i className="fa fa-warning text-yellow" /> :
                                                                        <i className="fa fa-bomb text-red" />
                                                        }
                                                        <p className="notify-title" >
                                                            {notification.shortContent ? parse(notification.shortContent) : notification.title}
                                                            <DateTimeConverter dateTime={notification.createdAt} style={{ display: 'block', fontSize: '12px', color: '#d47979' }} />
                                                        </p>
                                                    </div>
                                                </Link>
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
    receiveNofitication: NotificationActions.receiveNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Notification));