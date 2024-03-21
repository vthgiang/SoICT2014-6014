import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectBox, ConfirmNotification, DateTimeConverter } from '../../../../common-components'
import ScheduleMonthlyForm from './scheduleMonthlyForm'
import ScheduleWeeklyForm from './scheduleWeeklyForm'
import ScheduleYearlyForm from './scheduleYearlyForm'
import { SystemSettingActions } from '../redux/actions'
import BackupInfo from './backupInfo'
import { FileAddModal } from './fileAddModal'

function SystemSetting(props) {
  const [state, setState] = useState({
    config: {},
    schedule: 'weekly',
    limit: 10
  })

  useEffect(() => {
    if (props.systemSetting.backup.config && JSON.stringify(props.systemSetting.backup.config) !== JSON.stringify(state.config)) {
      setState({
        ...state,
        config: props.systemSetting.backup.config,
        autoBackup: props.systemSetting.backup.config.auto ? 'on' : 'off',
        schedule: props.systemSetting.backup.config.type,
        limit: props.systemSetting.backup.config.limit
      })
    }
  }, [props.systemSetting.backup.config])

  const createBackup = () => {
    props.createBackup()
  }

  useEffect(() => {
    props.getBackups()
    props.getConfigBackup()
  }, [])

  const handleBackupType = (e) => {
    const { value } = e.target
    setState({
      ...state,
      backupType: value
    })
  }

  const handleBackupAutoStatus = (value) => {
    setState({
      ...state,
      autoBackup: value[0]
    })
  }

  const renderScheduleForm = () => {
    const { schedule, limit } = state
    switch (schedule) {
      case 'weekly':
        return <ScheduleWeeklyForm schedule={schedule} limit={limit} />
      case 'yearly':
        return <ScheduleYearlyForm schedule={schedule} limit={limit} />
      default:
        return <ScheduleMonthlyForm schedule={schedule} limit={limit} />
    }
  }

  const handleScheduleType = (value) => {
    setState({
      ...state,
      backupType: value[0]
    })
  }

  const editBackupInfo = async (value) => {
    await setState({
      ...state,
      backupInfo: value
    })
    window.$('#modal-edit-backup-info').modal('show')
  }

  const downloadBackupVersion = (path) => {
    props.downloadBackupVersion(path)
  }

  const handleSchedule = (value) => {
    setState({
      ...state,
      schedule: value[0]
    })
  }

  const handleBackupLimit = (e) => {
    const { value } = e.target
    setState({
      ...state,
      limit: value
    })
  }

  const restore = (version) => {
    props.restore(version)
  }

  const deleteBackup = (version) => {
    props.deleteBackup(version)
  }

  const handleAddFile = () => {
    window.$('#modal-create-file-backup').modal('show')
  }

  const { translate, systemSetting } = props
  const { schedule, autoBackup, limit } = state

  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-xs-12 col-sm-7 col-md-7 col-lg-7'>
          <div className='box box-default '>
            <div className='box-header with-border btn-toolbar'>
              <button
                className='btn btn-success pull-right'
                onClick={createBackup}
                title={translate('system_admin.system_setting.backup.backup_button')}
              >
                {translate('system_admin.system_setting.backup.backup_button')}
              </button>
              <button className='btn btn-success pull-right' onClick={handleAddFile} title='Thêm file sao lưu phục hồi'>
                Thêm file
              </button>
            </div>
            <div className='box-body'>
              <table className='table table-hover table-striped table-bordered'>
                <thead>
                  <tr>
                    <th>{translate('system_admin.system_setting.backup.version')}</th>
                    <th>{translate('system_admin.system_setting.backup.description')}</th>
                    <th>{translate('system_admin.system_setting.backup.backup_time')}</th>
                    <th style={{ width: '100px' }}>{translate('system_admin.system_setting.backup.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {systemSetting.backup.list.map((data, i) => (
                    <tr key={`backup-version-${i}`}>
                      <td> {data.version} </td>
                      <td> {data.description} </td>
                      <td>
                        <DateTimeConverter dateTime={data.createdAt} />
                      </td>
                      <td>
                        <ConfirmNotification
                          icon='question'
                          title={translate('super_admin.system.restore_backup')}
                          content={`<h3>${translate('super_admin.system.restore_backup')}</h3>`}
                          name='restore'
                          className='text-green'
                          func={() => props.restore(data.version)}
                        />
                        <a
                          className='text-orange'
                          title={translate('super_admin.system.edit_backup_info')}
                          style={{ cursor: 'pointer' }}
                          onClick={() => editBackupInfo(data)}
                        >
                          <i className='material-icons'>edit</i>
                        </a>
                        <a
                          className='text-blue'
                          title={translate('super_admin.system.download_backup_version')}
                          style={{ cursor: 'pointer' }}
                          onClick={() => downloadBackupVersion(data.path)}
                        >
                          <i className='material-icons'>save_alt</i>
                        </a>
                        <ConfirmNotification
                          icon='warning'
                          title={translate('super_admin.system.delete_backup')}
                          content={`<h3>${translate('super_admin.system.delete_backup')}</h3>`}
                          name='delete_outline'
                          className='text-red'
                          func={() => props.deleteBackup(data.version)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <FileAddModal />
        <BackupInfo backupInfo={state.backupInfo} />
        <div className='col-xs-12 col-sm-5 col-md-5 col-lg-5'>
          <div className='box box-default'>
            <div className='box-header with-border text-center'>
              <b style={{ fontSize: '24px' }}>{translate('system_admin.system_setting.backup.config')}</b>
            </div>
            <div className='box-body'>
              {autoBackup ? (
                <React.Fragment>
                  <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='form-group'>
                      <label>{translate('system_admin.system_setting.backup.automatic')}</label>
                      <SelectBox
                        id='select-backup-status'
                        className='form-control select2'
                        style={{ width: '100%' }}
                        items={[
                          { value: 'on', text: translate('system_admin.system_setting.backup.on') },
                          { value: 'off', text: translate('system_admin.system_setting.backup.off') }
                        ]}
                        value={autoBackup}
                        onChange={handleBackupAutoStatus}
                        multiple={false}
                      />
                    </div>
                  </div>
                  {autoBackup === 'on' ? (
                    <React.Fragment>
                      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className='form-group'>
                          <label>{translate('system_admin.system_setting.backup.limit')}</label>
                          <input className='form-control' type='number' min={0} onChange={handleBackupLimit} value={limit} />
                        </div>
                      </div>
                      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className='form-group'>
                          <label>{translate('system_admin.system_setting.backup.period')}</label>
                          <SelectBox
                            id='select-backup-time-schedule'
                            className='form-control select2'
                            style={{ width: '100%' }}
                            items={[
                              { value: 'weekly', text: translate('system_admin.system_setting.backup.weekly') },
                              { value: 'monthly', text: translate('system_admin.system_setting.backup.monthly') },
                              { value: 'yearly', text: translate('system_admin.system_setting.backup.yearly') }
                            ]}
                            value={schedule}
                            onChange={handleSchedule}
                            multiple={false}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                      <button className='btn btn-success' onClick={() => props.configBackup({ auto: 'off' })}>
                        {translate('system_admin.system_setting.backup.save')}
                      </button>
                    </div>
                  )}
                  <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>{autoBackup === 'on' && renderScheduleForm()}</div>
                </React.Fragment>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { systemSetting } = state
  return { systemSetting }
}
const actions = {
  getBackups: SystemSettingActions.getBackups,
  getConfigBackup: SystemSettingActions.getConfigBackup,
  createBackup: SystemSettingActions.createBackup,
  configBackup: SystemSettingActions.configBackup,
  deleteBackup: SystemSettingActions.deleteBackup,
  restore: SystemSettingActions.restore,
  downloadBackupVersion: SystemSettingActions.downloadBackupVersion
}

export default connect(mapState, actions)(withTranslate(SystemSetting))
