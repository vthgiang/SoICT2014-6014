import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DateTimeConverter, ConfirmNotification } from '../../../../common-components';
import { SystemActions } from '../redux/actions';

class SystemManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { translate, system } = this.props;

        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-header">
                    <button className="btn btn-success pull-right" title={translate("general.add")} onClick={this.props.createBackup}>{translate('general.add')}</button>
                </div>
                <div className="box-body">
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>{translate('system_admin.system_setting.backup.version')}</th>
                                <th>{translate('system_admin.system_setting.backup.description')}</th>
                                <th>{translate('system_admin.system_setting.backup.backup_time')}</th>
                                <th style={{width: '100px'}}>{translate('system_admin.system_setting.backup.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                system.backup.list.map( (data, i) => 
                                    <tr key={ `backup-version-${i}` }>
                                        <td> { data.version } </td>
                                        <td> { data.description } </td>
                                        <td><DateTimeConverter dateTime={data.createdAt}/></td>
                                        <td>
                                            <ConfirmNotification
                                                icon="question"
                                                title={translate('super_admin.system.restore_backup')}
                                                content={`<h3>${translate('super_admin.system.restore_backup')}</h3>`}
                                                name="restore"
                                                className="text-green"
                                                func={()=>this.props.restore(data.version)}
                                            />
                                            <ConfirmNotification
                                                icon="warning"
                                                title={translate('super_admin.system.delete_backup')}
                                                content={`<h3>${translate('super_admin.system.delete_backup')}</h3>`}
                                                name="delete_outline"
                                                className="text-red"
                                                func={()=>this.props.deleteBackup(data.version)}
                                            />
                                        </td>
                                    </tr>       
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.getBackups();
    }
}

function mapState(state) {
    return {
        system: state.system
    };
}

const dispatchStateToProps = {
    getBackups: SystemActions.getBackups,
    createBackup: SystemActions.createBackup,
    deleteBackup: SystemActions.deleteBackup,
    restore: SystemActions.restore
}

export default connect(mapState, dispatchStateToProps)(withTranslate(SystemManagement));