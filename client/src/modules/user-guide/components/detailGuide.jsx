import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import FilePreviewer from 'react-file-previewer'

import { DialogModal } from '../../../common-components'
// import { AuthActions } from '../../../../auth/redux/actions';
// import FileViewer from 'react-file-viewer';

function DetailGuide(props) {
  const [state, setState] = useState({
    link: ''
  })

  useEffect(() => {}, [])

  const link = process.env.REACT_APP_SERVER + props.link.url
  return (
    <React.Fragment>
      <DialogModal size={100} modalID={`modal-detail-guide`} title='Preview' hasSaveButton={false} hasNote={false}>
        <div>
          {/* <h3>Mô tả chi tiết</h3> */}

          <iframe width='100%' height='100vh' src={link} />
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

// const mapStateToProps = state => state;

// const mapDispatchToProps = {
//     FileData: AuthActions.downloadFile,
// }

export default connect(null, null)(withTranslate(DetailGuide))
