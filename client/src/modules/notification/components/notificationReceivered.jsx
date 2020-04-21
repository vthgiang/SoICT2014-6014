import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar } from '../../../common-components';
import { NotificationActions } from '../redux/actions';

class NotificationReceivered extends Component {
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

    hello = () => {
        alert("Chi tiết");
    }

    componentDidMount(){
        this.props.getReceivered();
    }

    render() { 
        const {translate, notification, auth} = this.props;
        return ( 
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <div className="col-md-6">
                            <div className="form-group col-md-3" style={{ paddingLeft: 0, paddingTop: '5px' }}>
                                <label>Nội dung :</label>
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
                    
                    <div className="table-responsive mailbox-messages" style={{minHeight: '250px'}}>
                        <table className="table table-hover table-striped">
                        <tbody>
                            {
                                notification.listReceivered.length > 0 ? 
                                notification.listReceivered.map(notification => 
                                    <tr key={notification._id} onClick={this.hello}>
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
                                            <a className="delete pull-right">
                                                <i className="material-icons">delete</i>
                                            </a>
                                        </td>
                                    </tr>  
                                ) : <tr style={{textAlign: 'center'}}><td colSpan={4}>notification null</td></tr>
                            }
                        </tbody>
                        </table>
                    </div>
                    </div>
                    <div className="box-footer no-padding">
                        <div className="mailbox-controls">
                            <PaginateBar pageTotal={20} currentPage={2}/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const actions = {
    getReceivered: NotificationActions.getNotificationReceivered
}
export default connect(mapState, actions)(withTranslate(NotificationReceivered));