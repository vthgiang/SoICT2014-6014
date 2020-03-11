import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import NotificationCreate from './NotificationCreate';
import { PaginateBar } from '../../../common-components';
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

    hello = () => {
        alert("Chi tiết");
    }

    componentDidMount(){
        this.props.get();
    }

    render() { 
        const {translate, notification} = this.props;
        return ( 
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                    <div className="col-md-6">
                        <div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <input className="form-control" type="text" placeholder={translate('searchByValue')} ref={this.value}/>
                        </div>
                    </div>
                    <div className="col-md-1">
                        <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <button type="button" className="btn btn-success" title={translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>
                    <div className="pull-right">
                        <NotificationCreate/>
                    </div>
                    </div>
                    <div className="box-body">
                    
                    <div className="table-responsive mailbox-messages">
                        <table className="table table-hover table-striped">
                        <tbody>
                            {
                                notification.list.length > 0 ? 
                                notification.list.map(notification => 
                                    <tr key={notification._id} onClick={this.hello}>
                                        <td>
                                            <strong style={{fontSize:'14px'}}> {notification.title.length > 40 ? `${notification.title.slice(0, 40)}...`: notification.title}</strong>
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
                        <PaginateBar pageTotal={20} currentPage={5}/>
                    </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const actions = {
    get: NotificationActions.get
}
export default connect(mapState, actions)(withTranslate(NotificationTable));