import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { AuthActions } from '../../../../auth/redux/actions'
function AttachmentTab(props) {
  const [state, setState] = useState({})

  useEffect(() => {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        files: props.files,
        archivedRecordNumber: props.employee.archivedRecordNumber
      }
    })
  }, [props.id])

  const { translate } = props

  const { id, files, archivedRecordNumber } = state

  const requestDownloadFile = (e, path, fileName) => {
    e.preventDefault()
    props.downloadFile(path, fileName)
  }

  return (
    <div id={id} className='tab-pane'>
      <div className='row box-body'>
        {/* Nơi lưu trữ bản cứng */}
        <div className='col-md-4'>
          <div className='form-group'>
            <strong>{translate('human_resource.profile.attachments_code')}&emsp;</strong>
            {archivedRecordNumber}
          </div>
        </div>
        {/* Danh sách tài liệu đính kèm */}
        <div className='col-md-12'>
          <h4 className='row col-md-6'>{translate('human_resource.profile.list_attachments')}:</h4>
          <table className='table table-striped table-bordered table-hover' style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>{translate('human_resource.profile.file_name')}</th>
                <th>{translate('general.description')}</th>
                <th>{translate('human_resource.profile.number')}</th>
                <th>{translate('general.status')}</th>
                <th>{translate('human_resource.profile.attached_files')}</th>
              </tr>
            </thead>
            <tbody>
              {files &&
                files.length !== 0 &&
                files.map((x, index) => (
                  <tr key={index}>
                    <td>{x.name}</td>
                    <td>{x.description}</td>
                    <td>{x.number}</td>
                    <td>{translate(`human_resource.profile.${x.status}`)}</td>
                    <td>
                      {!x.urlFile ? (
                        translate('human_resource.profile.no_files')
                      ) : (
                        <a
                          className='intable'
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}
                        >
                          <i className='fa fa-download'> &nbsp;Download!</i>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {(!files || files.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
        </div>
      </div>
    </div>
  )
}

const actionCreators = {
  downloadFile: AuthActions.downloadFile
}

const tabAttachments = connect(null, actionCreators)(withTranslate(AttachmentTab))
export { tabAttachments as AttachmentTab }
