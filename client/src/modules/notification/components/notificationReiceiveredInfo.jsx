import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, DateTimeConverter } from '../../../common-components';
import parse from 'html-react-parser';

class NotificationReiceiverdInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.notificationId !== prevState.notificationId) {
            return {
                ...prevState,
                notificationId: nextProps.notificationId,
                notificationTitle: nextProps.notificationTitle,
                notificationSender: nextProps.notificationSender,
                notificationLevel: nextProps.notificationLevel,
                notificationContent: nextProps.notificationContent,
                notificationCreatedAt: nextProps.notificationCreatedAt
            }
        } else {
            return null;
        }
    }

    render() { 
        const { notifications, translate } = this.props;
        const { notificationTitle, notificationSender, notificationCreatedAt, notificationLevel, notificationContent } = this.state;
        
        return ( 
            <DialogModal
                func={this.save} isLoading={notifications.isLoading}
                modalID={`modal-notification-receivered`}
                title={notificationTitle}
                hasSaveButton={false} hasNote={false}
            >
                <div className="qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            {
                            notificationLevel === 'info' ? <i className="fa fa-fw fa-info-circle text-blue"></i> :
                            notificationLevel === 'general' ? <i className="fa fa-fw fa-bell text-green"></i> :
                            notificationLevel === 'important' === 3 ? <i className="fa fa-fw fa-warning text-orange"></i> :
                            <i className="fa fa-fw fa-bomb text-orange"></i> 
                            }
                            <div className="inline">{translate('notification.from')}</div>
                            <div className="inline"><b> {notificationSender}, <DateTimeConverter dateTime={notificationCreatedAt}/></b></div>
                        </div>
                    </div>
                    <div style={{ margin: '20px 0px 20px 0px'}}>{parse(notificationContent)}</div>
                </div>
            </DialogModal>
         );
    }
}
 
function mapState(state){
    const { notifications } = state;
    return { notifications } ;
}
const actions = {
}
export default connect(mapState, actions)(withTranslate(NotificationReiceiverdInfo));