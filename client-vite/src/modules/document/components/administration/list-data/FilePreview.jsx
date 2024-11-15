import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'
import { AuthActions } from '../../../../auth/redux/actions'

function FilePreview(props) {
  useEffect(() => {
    let { file } = props
    props.FileData(file, 'filename', false)
  }, [props.file])

  let encode = ''
  let blob = props.auth.showFiles.length ? props.auth.showFiles[0].blob : ''
  if (blob) encode = URL.createObjectURL(blob)

  return (
    <React.Fragment>
      <DialogModal size={100} modalID={`modal-file-preview`} title='Preview' hasSaveButton={false} hasNote={false} hasCloseButton={false}>
        <div>
          <div style={{ margin: '0px', padding: '0px', overflow: 'hidden' }}>
            <iframe
              src={encode}
              frameborder='0'
              style={{ overflow: 'hidden', height: '85vh', width: '100%' }}
              height='100%'
              width='100%'
            ></iframe>
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  FileData: AuthActions.downloadFile
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(FilePreview))
