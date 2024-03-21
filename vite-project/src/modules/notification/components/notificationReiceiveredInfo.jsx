import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, DateTimeConverter } from '../../../common-components'
import parse from 'html-react-parser'
import { AuthActions } from '../../../modules/auth/redux/actions'
import './notification.css'
class NotificationReiceiverdInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.notificationId !== prevState.notificationId) {
      let notificationFiles = []
      let notificationContentImage = []

      if (nextProps.notificationFiles && nextProps.notificationFiles.length > 0) {
        // Lọc ra file đính kèm khi dùng upload file
        notificationFiles = nextProps.notificationFiles.filter((obj) => obj.fileName)
        // lọc file ảnh khi gửi bằng quilEditor
        notificationContentImage = nextProps.notificationFiles.filter((obj) => !obj.fileName)
      }
      if (notificationContentImage && notificationContentImage.length > 0) {
        notificationContentImage.forEach((x) => {
          nextProps.downloadFile(`.${x.url}`, `${x.url}`, false)
        })
      }
      return {
        ...prevState,
        notificationId: nextProps.notificationId,
        notificationTitle: nextProps.notificationTitle,
        notificationSender: nextProps.notificationSender,
        notificationLevel: nextProps.notificationLevel,
        notificationContent: nextProps.notificationContent,
        notificationCreatedAt: nextProps.notificationCreatedAt,
        notificationFiles,
        notificationContentImage,
        notificationAssociatedDataObject: nextProps.notificationAssociatedDataObject
      }
    } else {
      return null
    }
  }

  requestDownloadFile = (e, path, fileName) => {
    e.preventDefault()
    this.props.downloadFile(`.${path}`, fileName)
  }

  checkPriority = (value) => {
    const valueConvert = parseInt(value)
    if (!value || valueConvert === 1) return '#808080'
    if (valueConvert === 2) return '#ffa707'
    if (valueConvert === 3) return '#28A745'
    if (valueConvert === 4) return '#ff5707'
    if (valueConvert === 5) return '#ff0707'
  }

  render() {
    const { notifications, translate, auth } = this.props
    const {
      notificationId,
      notificationTitle,
      notificationSender,
      notificationCreatedAt,
      notificationLevel,
      notificationContent,
      notificationFiles,
      notificationContentImage,
      imageConvertToBase64,
      notificationAssociatedDataObject
    } = this.state
    let content = notificationContent
    let cssTable = ' style="border: 1px solid black; padding-left: 3px; padding-right: 3px"'
    while (content.indexOf('<table>') !== -1) {
      let vt = content.indexOf('<table>')
      let str = content.slice(0, vt + 6)
      let strEnd = content.slice(vt + 6)
      str = str.concat(cssTable)
      str = str.concat(strEnd)
      content = str
    }
    while (content.indexOf('<td>') !== -1) {
      let vt = content.indexOf('<td>')
      let str = content.slice(0, vt + 3)
      let strEnd = content.slice(vt + 3)
      str = str.concat(cssTable)
      str = str.concat(strEnd)
      content = str
    }

    let base64fileConvert = []
    if (notificationContentImage && notificationContentImage.length > 0 && auth.showFiles && auth.showFiles.length > 0) {
      notificationContentImage.forEach((obj) => {
        auth.showFiles.forEach((obj2) => {
          if (obj.url === obj2.fileName) {
            base64fileConvert = [...base64fileConvert, obj2.file]
          }
        })
      })
    }
    // thay thế chuỗi base64 của ảnh vào content của quileditor
    if (content.includes('<img src="')) {
      const imgRex = /<img.*?src="(.*?)"[^"]+>/g
      for (let i = 0; i < base64fileConvert.length; i++) {
        let img = imgRex.exec(content)
        content = content.replace(img[1], base64fileConvert[i])
      }
    }

    return (
      <DialogModal
        func={this.save}
        isLoading={notifications.isLoading}
        modalID={`modal-notification-receivered-${notificationId}`}
        title={notificationTitle}
        hasSaveButton={false}
        hasNote={false}
      >
        <div className='qlcv'>
          <div className='form-inline'>
            <div className='form-group'>
              {notificationLevel === 'info' ? (
                <i className='fa fa-fw fa-info-circle text-blue'></i>
              ) : notificationLevel === 'general' ? (
                <i
                  className='fa fa-fw fa-bell'
                  style={{ color: `${this.checkPriority(notificationAssociatedDataObject && notificationAssociatedDataObject.value)}` }}
                ></i>
              ) : (notificationLevel === 'important') === 3 ? (
                <i className='fa fa-fw fa-warning text-orange'></i>
              ) : (
                <i className='fa fa-fw fa-bomb text-orange'></i>
              )}
              <div className='inline'>{translate('notification.from')}&nbsp;</div>
              <div className='inline'>
                <b>
                  {' '}
                  {notificationSender}, <DateTimeConverter dateTime={notificationCreatedAt} />
                </b>
              </div>
            </div>
          </div>
          <div className='notification' style={{ margin: '20px 0px 20px 0px' }}>
            {parse(content)}
          </div>
          {notificationFiles.length > 0 && (
            <div>
              <label>{translate('human_resource.profile.attached_files')}</label>
              <ul>
                {notificationFiles.map((obj, index) => (
                  <li key={index}>
                    <a href='' title='Tải xuống' onClick={(e) => this.requestDownloadFile(e, obj.url, obj.fileName)}>
                      {obj.fileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogModal>
    )
  }
}

function mapState(state) {
  const { notifications, auth } = state
  return { notifications, auth }
}
const actions = {
  downloadFile: AuthActions.downloadFile
}
export default connect(mapState, actions)(withTranslate(NotificationReiceiverdInfo))
