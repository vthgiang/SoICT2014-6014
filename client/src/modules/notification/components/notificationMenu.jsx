import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { showReceived: true }
    }

    showTabReceivered = () => {
        window.$('#tab-notification-sent').hide();
        window.$('#tab-notification-receivered').show();
        this.setState(state => {
            return {
                ...state,
                showReceived: true,
            }
        });
    }

    showTabSent = () => {
        window.$('#tab-notification-receivered').hide();
        window.$('#tab-notification-sent').show();
        this.setState(state => {
            return {
                ...state,
                showReceived: false,
            }
        });
    }

    render() { 
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                {this.checkHasComponent('create-notification') &&
                    <div className="box box-solid">
                        <div className="box-body">
                            <ul className="nav nav-pills nav-stacked">
                                <li className={`${this.state.showReceived?"active":""}`}>
                                    <a href="#" onClick={this.showTabReceivered}><i className="fa fa-fw fa-inbox"/>{translate('notification.receivered')}</a>
                                </li>
                                <li className={`${this.state.showReceived?"":"active"}`}>
                                    <a href="#" onClick={this.showTabSent}><i className="fa fa-fw fa-envelope-o"/>{translate('notification.sent')}</a>
                                </li>
                            </ul>
                        </div>  
                    </div>
                }

                <div className="box box-solid">
                    <div className="box-body">
                        <ul className="nav nav-pills nav-stacked">
                            <li><a href="" className="text-blue"><i className="fa fa-fw fa-info-circle text-blue" /> {translate('notification.type.info')}</a></li>
                            <li><a href="" className="text-green"><i className="fa fa-fw fa-bell" /> {translate('notification.type.general')}</a></li>
                            <li><a href="" className="text-orange"><i className="fa fa-fw fa-warning" /> {translate('notification.type.important')}</a></li>
                            <li><a href="" className="text-red"><i className="fa fa-fw fa-bomb" /> {translate('notification.type.emergency')}</a></li>
                        </ul>
                    </div>
                </div>
            </React.Fragment>
         );
    }

    checkHasComponent = (name) => {
        var {auth} = this.props;
        var result = false;
        auth.components.forEach(component => {
            if(component.name === name) result=true;
        });

        return result;
    }
}
 
const mapState = state => state;

export default connect(mapState, null)(withTranslate(NotificationMenu));