import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../common-components';
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';
import { NotificationActions } from '../redux/actions';

class NotificationSentInfo extends Component {
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
                notificationLevel: nextProps.notificationLevel,
                notificationContent: nextProps.notificationContent,
                notificationSender: nextProps.notificationSender,
                notificationCreatedAt: nextProps.notificationCreatedAt,
                notificationOrganizationalUnits: nextProps.notificationOrganizationalUnits,
                notificationUsers: nextProps.notificationUsers
            }
        } else {
            return null;
        }
    }

    render() { 
        const {notifications, translate, departments} = this.props;
        const {notificationTitle, notificationLevel, notificationContent, notificationSender, notificationCreatedAt, notificationUsers, notificationOrganizationalUnits} = this.state;
        return ( 
            <DialogModal
                    size='50' func={this.save} isLoading={notifications.isLoading}
                    modalID={`modal-notification-sent`}
                    title={notificationTitle}
                    hasSaveButton={false} hasNote={false}
            >
                <div className="qlcv">
                    {
                        notificationLevel === 'info' ? <h4 className="text-blue">[ {translate('notification.type.info')}] </h4>:
                        notificationLevel === 'general' ? <h4 className="text-green">[ {translate('notification.type.general')}] </h4>:
                        notificationLevel === 'important' ? <h4 className="text-orange">[ {translate('notification.type.important')}] </h4>: <h4 className="text-red">[ {translate('notification.type.emergency')}] </h4>
                    }
                    <i>{`${translate('notification.sender')}: `}</i><b>{notificationSender}</b>

                    <p>{notificationCreatedAt}</p>
                    
                    <div style={{border: '1px solid lightgray', margin: '20px 0px 20px 0px' , padding: '15px'}}>{notificationContent}</div>
                    {
                        notificationOrganizationalUnits!==undefined && notificationOrganizationalUnits.length > 0 &&
                        <React.Fragment>
                            <p><b>{translate('notification.departments')}</b></p>
                            <ul>{
                                notificationOrganizationalUnits.map(organizationalUnit=><li>{organizationalUnit.name}</li>)
                            }</ul>
                        </React.Fragment>
                    }
                    {
                        notificationUsers!==undefined && notificationUsers.length > 0 &&
                        <React.Fragment>
                            <p><b>{translate('notification.users')}</b></p>
                            <ul>{
                                    
                                notificationUsers.map(user=><li>{user.name}</li>)
                            }</ul>
                        </React.Fragment>
                    }
                </div>
            </DialogModal>
         );
    }
}
 
const mapState = state => state;
const actions = {
}
export default connect(mapState, actions)(withTranslate(NotificationSentInfo));