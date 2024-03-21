import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

class RevokeNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.notification = this.notification.bind(this)
  }

  notification = (
    content, //json - tiêu đề, tên các button
    data, //thông tin về đối tượng
    func //hàm thực hiện tương ứng
  ) => {
    Swal.fire({
      html: `<h4 style="color: coral"><div>${content}</div> ${data.info ? `<div>"${data.info}"</div>` : ''}</h4><br> <div class="form-group">
            <label>${this.props.translate('manage_delegation.revoke_reason')}</label>
            <textarea id="revokeReason-${data.id}" class="form-control" placeholder="${this.props.translate('manage_delegation.revoke_reason_placeholder')}"></textarea>
        </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: this.props.translate('general.no'),
      confirmButtonText: this.props.translate('general.yes')
    }).then((result) => {
      if (result.value) {
        console.log(result)
        func(data.id)
      }
    })
  }

  render() {
    const { content, data, func } = this.props
    return (
      <a className='delete text-red' title={content} onClick={() => this.notification(content, data, func)}>
        <i className='material-icons'>settings_backup_restore</i>
      </a>
    )
  }
}

const mapState = (state) => state
const RevokeNotificationExport = connect(mapState, null)(withTranslate(RevokeNotification))

export { RevokeNotificationExport as RevokeNotification }
