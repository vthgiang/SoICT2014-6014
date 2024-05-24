// import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { withTranslate } from 'react-redux-multilingual'
// import parse from 'html-react-parser'
// import Swal from 'sweetalert2'
// import { configQuillEditor, convertImageBase64ToFile } from './configQuillEditor'
// import { ToolbarQuillEditor } from './toolbarQuillEditor'
// import { SlimScroll } from '../slim-scroll/slimScroll'
// import { AuthActions } from '../../../modules/auth/redux/actions'
// import './quillEditor.css'

import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch, connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import parse from 'html-react-parser'
import Swal from 'sweetalert2'
import { configQuillEditor } from './configQuillEditor'
import { ToolbarQuillEditor } from './toolbarQuillEditor'
import { SlimScroll } from '../slim-scroll/slimScroll'
import { AuthActions } from '../../../modules/auth/redux/actions'
import './quillEditor.css'

function QuillEditor(props) {
  const [quill, setQuill] = useState(null)
  const editorRef = useRef(null)
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const {
    translate,
    id,
    isText = false,
    quillValueDefault,
    toolbar = true,
    maxHeight = 200,
    enableEdit = true,
    placeholder = null,
    enableDropImage = true,
    showDetail = false,
    getTextData,
    showDropFileHere
  } = props

  useEffect(() => {
    const quillInstance = window.initializationQuill(
      `#editor-container${id}`,
      configQuillEditor(id, toolbar, enableEdit, placeholder, enableDropImage)
    )

    if (quillValueDefault || quillValueDefault === '') {
      if (quillInstance && quillInstance.container && quillInstance.container.firstChild) {
        quillInstance.container.firstChild.innerHTML = quillValueDefault
      }
      const imgs = Array.from(quillInstance?.container?.querySelectorAll('img[src^="upload/private"]'))
      if (imgs?.length > 0) {
        imgs.map((item) => {
          dispatch(AuthActions.downloadFile(item.getAttribute('src'), item.getAttribute('src'), false))
        })
      }
      setHeightContainer(id, maxHeight)
    }

    if (!isText) {
      quillInstance.on('text-change', (e) => {
        setHeightContainer(id, maxHeight)

        const imageSources = []
        const selection = quillInstance.getSelection()?.index
        let imgs = Array.from(quillInstance?.container?.querySelectorAll('img[src^="data:"]:not(.loading)'))

        if (imgs && imgs.length !== 0) {
          imgs = imgs.map((item, index) => {
            imageSources.push({
              originalName: `image${index}`,
              url: item.getAttribute('src')
            })
            item.src = `image${index}`
            return item
          })
        }

        let insert = null
        if (e && e.ops && e.ops.length !== 0) {
          e.ops.map((item) => {
            if (item?.insert && !item?.attributes) {
              insert = item?.insert
            }
          })
        }

        if (insert === ' ' || insert === '\n') {
          let text
          let temp = selection - 2

          while (temp >= 0) {
            text = quillInstance.getText(temp, 1)
            if (text?.toString() === ' ' || text?.toString() === '\n') {
              break
            } else {
              temp--
            }
          }

          text = quillInstance.getText(temp + 1, selection - temp - 2)?.toString()
          if ((text?.startsWith('http://') || text?.startsWith('https://')) && text !== 'https://' && text !== 'http://') {
            quillInstance.deleteText(temp + 1, selection - temp - 2)
            quillInstance.insertText(temp + 1, text, 'link', text)
          } else if (text?.endsWith('@gmail.com') || text?.endsWith('@sis.hust.edu.vn')) {
            quillInstance.deleteText(temp + 1, selection - temp - 2)
            quillInstance.insertText(temp + 1, text, 'link', `mailto:${text}`)

            window.$('.ql-editor a').map(function () {
              if (this.href?.startsWith('mailto:')) {
                window.$(this).removeAttr('target')
              }
            })
          }
        } else if (insert && insert.length > 1) {
          if ((insert?.startsWith('http://') || insert?.startsWith('https://')) && insert !== 'https://' && insert !== 'http://') {
            quillInstance.deleteText(selection, insert.length)
            quillInstance.insertText(selection, insert, 'link', insert)
          } else if (insert?.endsWith('@gmail.com') || insert?.endsWith('@sis.hust.edu.vn')) {
            quillInstance.deleteText(selection, insert.length)
            quillInstance.insertText(selection, insert, 'link', `mailto:${insert}`)

            window.$('.ql-editor a').map(function () {
              if (this.href?.startsWith('mailto:')) {
                window.$(this).removeAttr('target')
              }
            })
          }
        }

        if (quillInstance && quillInstance.root && getTextData) {
          getTextData(quillInstance.root.innerHTML, imageSources)
        }

        if (imgs && imgs.length !== 0) {
          imgs = imgs.map((item, index) => {
            item.src = imageSources?.[index]?.url
            return item
          })
        }
      })

      window.$(`#insert-tabletoolbar${id}`).click(() => {
        const table = quillInstance.getModule('table')
        table.insertTable(3, 3)
      })

      quillInstance.enable(enableEdit)
    }

    if (showDetail?.enable) {
      window.$(`#editor-container${id}`).on('dblclick', () => {
        Swal.fire({
          title: showDetail?.titleShowDetail ?? translate('general.detail'),
          html: quillInstance?.container?.firstChild?.innerHTML,
          width: showDetail?.width ?? '75%',
          customClass: {
            content: 'ql-editor ql-blank'
          }
        })
      })
    }

    setQuill(quillInstance)
    setHeightContainer(id, maxHeight)

    return () => {
      if (quillInstance) {
        quillInstance.off('text-change')
        window.$(`#editor-container${id}`).off('dblclick')
      }
    }
  }, [])

  useEffect(() => {
    if (quill && !isText) {
      quill.enable(enableEdit)
    }

    if (quill?.container) {
      let imgs = Array.from(quill.container.querySelectorAll('img[src^="upload/private"]'))
      if (imgs?.length > 0) {
        imgs = imgs.map((img) => {
          if (auth?.showFiles?.length > 0) {
            const image = auth.showFiles.filter((item) => item.fileName === img.getAttribute('src'))
            if (image?.[0]?.file) {
              img.src = image[0].file
            }
          }
          return img
        })
      }
    }

    if (props.dataDriver) {
      let dataText = ''
      for (let i = 0; i < props.dataDriver.length; i++) {
        dataText += `<p>${props.dataDriver[i].name} : <a href="${props.dataDriver[i].url} " target="_blank">${props.dataDriver[i].url}</a></p>`
      }
      if (quill.root.innerHTML === '<p><br></p>') {
        quill.root.innerHTML = dataText
      } else {
        quill.root.innerHTML = quill.root.innerHTML + dataText
      }
    }

    setHeightContainer(id, maxHeight)
  }, [auth, enableEdit, props.dataDriver])

  const setHeightContainer = (id, maxHeight) => {
    SlimScroll.removeVerticalScrollStyleCSS(`editor-container${id}`)
    SlimScroll.addVerticalScrollStyleCSS(`editor-container${id}`, maxHeight, true)
  }

  return (
    <>
      {!isText ? (
        <>
          {toolbar && (
            <ToolbarQuillEditor
              id={`toolbar${id}`}
              font={props.font}
              header={props.header}
              typography={props.typography}
              fontColor={props.fontColor}
              alignAndList={props.alignAndList}
              embeds={props.embeds}
              table={props.table}
              inputCssClass={props.inputCssClass}
            />
          )}
          <div id={`editor-container${id}`} ref={editorRef} className={`quill-editor ${props.inputCssClass}`}>
            {showDropFileHere && (
              <div
                style={{
                  fontSize: '2em',
                  pointerEvents: 'none',
                  width: '100%',
                  height: '100%',
                  border: '2px dashed black',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  top: '0',
                  left: 0,
                  position: 'absolute',
                  textAlign: 'center'
                }}
              >
                DROP FILES HERE
              </div>
            )}
          </div>
        </>
      ) : (
        parse(quillValueDefault)
      )}
    </>
  )
}

const actions = {
  downloadFile: AuthActions.downloadFile
}

export default connect(null, actions)(withTranslate(QuillEditor))

// class QuillEditor extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       quill: null,
//       showDropFileHere: false
//     }
//   }

//   componentDidMount() {
//     const { translate } = this.props
//     const {
//       id,
//       isText = false,
//       quillValueDefault,
//       toolbar = true,
//       maxHeight = 200,
//       enableEdit = true,
//       placeholder = null,
//       enableDropImage = true,
//       showDetail = false
//     } = this.props

//     // Khởi tạo Quill Editor trong thẻ có id = id truyền vào
//     const quill = window.initializationQuill(
//       `#editor-container${id}`,
//       configQuillEditor(id, toolbar, enableEdit, placeholder, enableDropImage)
//     )

//     // Insert value ban đầu
//     if (quillValueDefault || quillValueDefault === '') {
//       if (quill && quill.container && quill.container.firstChild) {
//         quill.container.firstChild.innerHTML = quillValueDefault
//       }
//       if (quill?.container) {
//         const imgs = Array.from(quill?.container?.querySelectorAll('img[src^="upload/private"]'))
//         if (imgs?.length > 0) {
//           imgs.map((item) => {
//             this.props.downloadFile(item.getAttribute('src'), item.getAttribute('src'), false)
//           })
//         }
//       }

//       this.setHeightContainer(id, maxHeight)
//     }

//     if (!isText) {
//       // Bắt sự kiện text-change
//       quill.on('text-change', (e) => {
//         this.setHeightContainer(id, maxHeight)

//         let imgs
//         const imageSources = []
//         let selection = quill.getSelection()?.index

//         if (quill?.container) {
//           imgs = Array.from(quill?.container?.querySelectorAll('img[src^="data:"]:not(.loading)'))

//           // Lọc base64 ảnh
//           if (imgs && imgs.length !== 0) {
//             imgs = imgs.map((item, index) => {
//               imageSources.push({
//                 originalName: `image${index}`,
//                 url: item.getAttribute('src')
//               })
//               item.src = `image${index}`
//               return item
//             })
//           }
//         }

//         // Auto Insert URL and email
//         let insert = null
//         if (e && e.ops && e.ops.length !== 0) {
//           e.ops.map((item) => {
//             if (item?.insert && !item?.attributes) {
//               insert = item?.insert
//             }
//           })
//         }

//         if (insert === ' ' || insert === '\n') {
//           // Handle event type space and enter
//           let text
//           let temp
//           if (insert === '\n') {
//             selection += 1
//           }
//           temp = selection - 2

//           while (temp >= 0) {
//             text = quill.getText(temp, 1)
//             if (text?.toString() === ' ' || text?.toString() === '\n') {
//               break
//             } else {
//               temp--
//             }
//           }

//           text = quill.getText(temp + 1, selection - temp - 2)?.toString()
//           if ((text?.startsWith('http://') || text?.startsWith('https://')) && text !== 'https://' && text !== 'http://') {
//             quill.deleteText(temp + 1, selection - temp - 2)
//             quill.insertText(temp + 1, text, 'link', text)
//           } else if (text?.endsWith('@gmail.com') || text?.endsWith('@sis.hust.edu.vn')) {
//             quill.deleteText(temp + 1, selection - temp - 2)
//             quill.insertText(temp + 1, text, 'link', `mailto:${text}`)

//             // Remove attr target for link email
//             window.$('.ql-editor a').map(function () {
//               if (this.href?.startsWith('mailto:')) {
//                 window.$(this).removeAttr('target')
//               }
//             })
//           }
//         } else if (insert && insert.length > 1) {
//           // Handle event paste
//           if ((insert?.startsWith('http://') || insert?.startsWith('https://')) && insert !== 'https://' && insert !== 'http://') {
//             quill.deleteText(selection, insert.length)
//             quill.insertText(selection, insert, 'link', insert)
//           } else if (insert?.endsWith('@gmail.com') || insert?.endsWith('@sis.hust.edu.vn')) {
//             quill.deleteText(selection, insert.length)
//             quill.insertText(selection, insert, 'link', `mailto:${insert}`)

//             // Remove attr target for link email
//             window.$('.ql-editor a').map(function () {
//               if (this.href?.startsWith('mailto:')) {
//                 window.$(this).removeAttr('target')
//               }
//             })
//           }
//         }

//         // Trả về html quill
//         if (quill && quill.root && this.props.getTextData) {
//           this.props.getTextData(quill.root.innerHTML, imageSources)
//         }

//         // Add lại base64 ảnh
//         if (imgs && imgs.length !== 0) {
//           imgs = imgs.map((item, index) => {
//             item.src = imageSources?.[index]?.url
//             return item
//           })
//         }
//       })

//       // Custom insert table
//       window.$(`#insert-tabletoolbar${id}`).click(() => {
//         const table = quill.getModule('table')
//         table.insertTable(3, 3)
//       })

//       // Disable edit
//       if (quill && !isText) {
//         quill.enable(enableEdit)
//       }
//     }

//     // Bắt sự kiện phóng to nội dung
//     if (showDetail?.enable) {
//       window.$(`#editor-container${id}`).on('dblclick', () => {
//         Swal.fire({
//           title: showDetail?.titleShowDetail ?? translate('general.detail'),
//           html: quill?.container?.firstChild?.innerHTML,
//           width: showDetail?.width ?? '75%',
//           customClass: {
//             content: 'ql-editor ql-blank'
//           }
//         })
//       })
//     }

//     this.setState({
//       quill
//     })
//     this.setHeightContainer(id, maxHeight)
//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     const { auth } = this.props
//     const { enableEdit, quillValueDefault } = this.props
//     const { quill } = nextState
//     // render lại khi download ảnh
//     if (JSON.stringify(nextProps.auth) !== JSON.stringify(auth)) {
//       return true
//     }
//     if (nextProps.showDropFileHere !== this.props.showDropFileHere) {
//       return true
//     }
//     // download ảnh
//     if (nextProps.quillValueDefault !== quillValueDefault) {
//       // Insert value ban đầu
//       // Lưu ý: quillValueDefault phải được truyền vào 1 giá trị cố định, không thay đổi
//       if (nextProps.quillValueDefault || nextProps.quillValueDefault === '') {
//         if (quill && quill.container && quill.container.firstChild) {
//           quill.container.firstChild.innerHTML = nextProps.quillValueDefault
//         }
//       }

//       if (quill?.container) {
//         const imgs = Array.from(quill?.container?.querySelectorAll('img[src^="upload/private"]'))
//         if (imgs?.length > 0) {
//           imgs.map((item) => {
//             this.props.downloadFile(item.getAttribute('src'), item.getAttribute('src'), false)
//           })
//         }
//       }
//     }
//     if (JSON.stringify(nextProps.dataDriver) !== JSON.stringify(this.props.dataDriver)) {
//       return true
//     }
//     if (nextProps.quillValueDefault === quillValueDefault) {
//       return false
//     }

//     if (nextProps.enableEdit !== enableEdit) {
//       return true
//     }

//     return true
//   }

//   componentDidUpdate(nextProps) {
//     const { auth } = this.props
//     const { id, maxHeight = 200, enableEdit = true, isText = false, quillValueDefault } = this.props
//     const { quill } = this.state

//     if (quill && !isText) {
//       quill.enable(enableEdit)
//     }

//     if (quill?.container) {
//       // Add lại base64 ảnh download từ server
//       let imgs = Array.from(quill.container.querySelectorAll('img[src^="upload/private"]'))

//       if (imgs?.length > 0) {
//         imgs = imgs.map((img) => {
//           if (auth?.showFiles?.length > 0) {
//             const image = auth.showFiles.filter((item) => item.fileName === img.getAttribute('src'))
//             if (image?.[0]?.file) {
//               img.src = image[0].file
//             }
//           }
//           return img
//         })
//       }
//     }
//     if (this.props.dataDriver) {
//       if (JSON.stringify(this.props.dataDriver) !== JSON.stringify(nextProps.dataDriver)) {
//         let dataText = ''
//         for (let i = 0; i < this.props.dataDriver.length; i++) {
//           dataText += `<p>${this.props.dataDriver[i].name} : <a href="${this.props.dataDriver[i].url} " target="_blank">${this.props.dataDriver[i].url}</a></p>`
//         }
//         if (quill.root.innerHTML === '<p><br></p>') {
//           quill.root.innerHTML = dataText
//         } else {
//           quill.root.innerHTML = quill.root.innerHTML + dataText
//         }
//       }
//     }

//     this.setHeightContainer(id, maxHeight)
//   }

//   setHeightContainer = (id, maxHeight) => {
//     SlimScroll.removeVerticalScrollStyleCSS(`editor-container${id}`)
//     SlimScroll.addVerticalScrollStyleCSS(`editor-container${id}`, maxHeight, true)
//   }

//   render() {
//     const {
//       isText = false,
//       inputCssClass = '',
//       id,
//       quillValueDefault,
//       toolbar = true,
//       font = true,
//       header = true,
//       typography = true,
//       fontColor = true,
//       alignAndList = true,
//       embeds = true,
//       table = true
//     } = this.props
//     return (
//       <>
//         {!isText ? (
//           <>
//             {toolbar && (
//               <ToolbarQuillEditor
//                 id={`toolbar${id}`}
//                 font={font}
//                 header={header}
//                 typography={typography}
//                 fontColor={fontColor}
//                 alignAndList={alignAndList}
//                 embeds={embeds}
//                 table={table}
//                 inputCssClass={inputCssClass}
//               />
//             )}
//             <div id={`editor-container${id}`} className={`quill-editor ${inputCssClass}`}>
//               {this.props.showDropFileHere && (
//                 <div
//                   style={{
//                     fontSize: '2em',
//                     pointerEvents: 'none',
//                     width: '100%',
//                     height: '100%',
//                     border: '2px dashed black',
//                     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//                     top: '0',
//                     left: 0,
//                     position: 'absolute',
//                     textAlign: 'center'
//                   }}
//                 >
//                   DROP FILES HERE
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           parse(quillValueDefault)
//         )}
//       </>
//     )
//   }
// }

// function mapState(state) {
//   const { auth } = state
//   return { auth }
// }
// const actions = {
//   downloadFile: AuthActions.downloadFile
// }

// const connectedQuillEditor = connect(mapState, actions)(withTranslate(QuillEditor))
// export { connectedQuillEditor as QuillEditor, convertImageBase64ToFile }
