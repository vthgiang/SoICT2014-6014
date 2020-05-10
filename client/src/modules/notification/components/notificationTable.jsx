import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { NotificationActions } from '../redux/actions';
import TabNotificationSent from './tabNotificationSent';
import TabNotificationReceivered from './tabNotificationReceivered';

class NotificationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        
        return ( 
            <React.Fragment>
                <div className="" role="tabpanel">
                    <div className="tab-content">
                        <TabNotificationReceivered/>
                        { 
                            this.checkHasComponent('create-notification') && <TabNotificationSent/>
                        }
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
export default connect(mapState)(withTranslate(NotificationTable));