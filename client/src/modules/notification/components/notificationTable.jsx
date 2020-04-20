import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar, DeleteNotification } from '../../../common-components';
import { NotificationActions } from '../redux/actions';

class NotificationTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            info: 'fa-info-circle text-blue',
            normal: 'fa-inbox text-green',
            warning: 'fa-warning text-orange',
            error: 'fa-hourglass-end text-red',
        }
        this.convertContent = this.convertContent.bind(this);
    }

    convertContent = (content) => {
        const newContent = content.slice(0,24);
        console.log("new content: ",newContent);
        return newContent.concat(newContent, ' ... ');
    }

    componentDidMount(){
        this.props.get();
        this.props.getReceivered();
        this.props.getSent();
    }

    render() { 
        const {translate, notifications, auth} = this.props;
        return ( 
            <React.Fragment>
                <div className="box" role="tabpanel">
                    {/* Tab panes */}
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane active" id="notification-receivered">
                            <div className="box-header with-border">
                                <div className="col-md-6">
                                    <div className="form-group col-md-3" style={{ paddingLeft: 0, paddingTop: '5px' }}>
                                        <label>Nội dung</label>
                                    </div>
                                    <div className="form-group col-md-9" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <input className="form-control" type="text" placeholder={translate('searchByValue')} ref={this.value}/>
                                    </div>
                                </div>
                                <div className="col-md-1">
                                    <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <button type="button" className="btn btn-success" title={translate('form.search')}>{translate('form.search')}</button>
                                    </div>
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="table-responsive mailbox-messages" style={{minHeight: '300px'}}>
                                    <table className="table table-hover table-striped">
                                    <tbody>
                                        {
                                            notifications.listReceivered.length > 0 ? 
                                            notifications.listReceivered.map(notification => 
                                                <tr key={notification._id}>
                                                    <td>
                                                        <i className={
                                                            notification.icon === 'info' ? "fa fa-info-circle text-green" :
                                                            notification.icon === 'normal' ? "fa fa-question-circle text-blue" :
                                                            notification.icon === 'warning' ? "fa fa-warning text-orange" : "fa fa-hourglass-end text-red"
                                                        } style={{fontSize: '14px'}}/><strong style={{fontSize:'14px'}}> {notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title}</strong>
                                                    </td>
                                                    <td>
                                                        <i style={{fontSize: '14px'}}>{notification.content.length > 80 ? `${notification.content.slice(0, 80)}...`: notification.content}</i>
                                                    </td>
                                                    <td style={{width: '5px'}}>
                                                    <DeleteNotification 
                                                        content={translate('notification.delete')}
                                                        data={{ id: notification._id, info: notification.title }}
                                                        func={this.props.deleteNotificationReceiverd}
                                                    />
                                                    </td>
                                                </tr>  
                                            ) : notifications.isLoading ?
                                            <tr><td colSpan={4}>{translate('confirm.loading')}</td></tr>:
                                            <tr><td colSpan={4}>{translate('confirm.no_data')}</td></tr>
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

                        <div role="tabpanel" className="tab-pane" id="notification-sent">
                            <div className="box-header with-border">
                                <div className="col-md-6">
                                    <div className="form-group col-md-3" style={{ paddingLeft: 0, paddingTop: '5px' }}>
                                        <label>Nội dung</label>
                                    </div>
                                    <div className="form-group col-md-9" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <input className="form-control" type="text" placeholder={translate('searchByValue')} ref={this.value}/>
                                    </div>
                                </div>
                                <div className="col-md-1">
                                    <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <button type="button" className="btn btn-success" title={translate('form.search')}>{translate('form.search')}</button>
                                    </div>
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="table-responsive mailbox-messages" style={{minHeight: '300px'}}>
                                    <table className="table table-hover table-striped">
                                    <tbody>
                                        {
                                            notifications.listSent.length > 0 ? 
                                            notifications.listSent.map(notification => 
                                                <tr key={notification._id}>
                                                    <td>
                                                        <i className={
                                                            notification.icon === 'info' ? "fa fa-info-circle text-green" :
                                                            notification.icon === 'normal' ? "fa fa-question-circle text-blue" :
                                                            notification.icon === 'warning' ? "fa fa-warning text-orange" : "fa fa-hourglass-end text-red"
                                                        } style={{fontSize: '14px'}}/><strong style={{fontSize:'14px'}}> {notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title}</strong>
                                                    </td>
                                                    <td>
                                                        <i style={{fontSize: '14px'}}>{notification.content.length > 80 ? `${notification.content.slice(0, 80)}...`: notification.content}</i>
                                                    </td>
                                                    <td style={{width: '5px'}}>
                                                        <DeleteNotification 
                                                            content={translate('notification.delete')+"KDFKSKDf"}
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
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const actions = {
    get: NotificationActions.get,
    getReceivered: NotificationActions.getNotificationReceivered,
    getSent: NotificationActions.getNotificationSent,
    deleteNotificationReceiverd: NotificationActions.deleteNotificationReceiverd,
    deleteNotificationSent: NotificationActions.deleteNotificationSent
}
export default connect(mapState, actions)(withTranslate(NotificationTable));