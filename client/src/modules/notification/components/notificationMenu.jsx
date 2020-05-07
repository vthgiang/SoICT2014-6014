import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class NotificationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    showTabReceivered = () => {
        window.$('#tab-notification-sent').hide();
        window.$('#tab-notification-receivered').show();
    }

    showTabSent = () => {
        window.$('#tab-notification-receivered').hide();
        window.$('#tab-notification-sent').show();
    }

    render() { 
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-body">
                        <button onClick={this.showTabReceivered} style={{width: '100%', marginBottom: '5px'}} className="btn btn-default">{translate('notification.receivered')}</button>
                        <button onClick={this.showTabSent} style={{width: '100%', marginBottom: '15px'}} className="btn btn-default">{translate('notification.sent')}</button>
                        <ul className="nav nav-pills nav-stacked">
                            <li className="text-blue"><i className="fa fa-info-circle"/> {translate('notification.type.info')}</li>
                            <li className="text-green"><i className="fa fa-bell"/> {translate('notification.type.general')}</li>
                            <li className="text-orange"><i className="fa fa-warning"/> {translate('notification.type.important')}</li>
                            <li className="text-red"><i className="fa fa-close"/> {translate('notification.type.emergency')}</li>
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