import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'

import moment from 'moment'
function ListView(props) {
  const { translate } = props
  const { views } = props.docs
  return (
    <React.Fragment>
      <DialogModal
        size={50}
        modalID={`modal-list-view`}
        title={`${translate('document.views')} ${props.docs.name}`}
        hasSaveButton={false}
        hasNote={false}
      >
        <div>
          {views &&
            views.map((item) => (
              <div key={item._id} className='item-box'>
                <a style={{ fontWeight: 700, cursor: 'pointer' }}>{item.viewer?.name} </a>
                đã xem lúc&nbsp;
                {moment(item.time).format('HH:mm:ss DD/MM/YYYY')}
              </div>
            ))}
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(ListView))
