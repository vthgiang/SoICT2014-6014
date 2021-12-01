import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { SystemSettingActions } from '../redux/actions';

const BackupInfo = ({ backupInfo = {}, editBackupInfo, translate }) => {
    const [state, setState] = useState({});

    const _handleBackupDescription = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            description: value
        });
    }

    useEffect(() => {
        setState({
            ...state,
            version: backupInfo.version,
            description: backupInfo.description
        });
    }, [backupInfo.version])

    const _save = () => {
        let { version, description } = state;
        editBackupInfo(version, {
            description: description
        });
    }

    return (
        <DialogModal
            modalID="modal-edit-backup-info"
            title={translate('super_admin.system.edit_backup_info')}
            func={_save}
        >
            <form id="form-edit-backup-info">
                <div className="form-group">
                    <label>{translate('super_admin.system.backup_description')}</label>
                    <textarea className="form-control" value={state.description} type="text" style={{ height: '200px' }} onChange={_handleBackupDescription}></textarea>
                </div>
            </form>
        </DialogModal>
    );
}

const mapDispatchToProps = {
    editBackupInfo: SystemSettingActions.editBackupInfo
}

export default connect(null, mapDispatchToProps)(withTranslate(BackupInfo));