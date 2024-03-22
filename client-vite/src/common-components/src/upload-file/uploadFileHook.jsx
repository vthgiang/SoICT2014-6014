import React, { Component, useState } from 'react'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import './uploadFile.css'
function UploadFileHook(props) {
  const [state, setState] = useState({})

  useEffect(() => {
    if (props.value && props.value.length) {
      setState((state) => {
        return {
          ...state,
          files: props.value
        }
      })
    } else {
      setState({
        files: []
      })
    }
  }, [props.value])

  /** Bắt sự kiện thay đổi file đính kèm */
  const handleUploadFile = (e) => {
    const { multiple = false, importFile } = props
    let fileList = e.target.files
    if (importFile) {
      importFile(fileList)
    }
    if (fileList.length !== 0) {
      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i]
        if (file) {
          let url = URL.createObjectURL(file)
          let fileLoad = new FileReader()
          fileLoad.readAsDataURL(file)
          fileLoad.onload = () => {
            let item = { fileName: file.name, urlFile: url, fileUpload: file }
            props.onChange(item ? [item] : [])
            setState((state) => {
              if (!state.files) {
                state.files = []
              }
              return {
                ...state,
                files: multiple ? [...state.files, item] : [item]
              }
            })
          }
        }
      }
    } else if (multiple === false) {
      setState({
        files: undefined
      })
    }
  }

  // useEffect(()=> {
  //     props.onChange(state.files ? state.files : []);
  // }, [state.files])

  /**
   * Bắt sự kiện xóa file đính kèm
   * @param {*} name : Têm file muốn xoá
   */
  const handleDeleteFile = (index) => {
    let { files } = state
    let { deleteValue = true } = props

    if (deleteValue) {
      console.log('file', files)
      files.splice(index, 1)
      setState({
        files: files
      })
      props.onChange(files)
    }
  }

  const { id, translate } = props

  const { multiple = false, disabled = false, accept = '', deleteValue = true } = props

  const { files } = state

  return (
    <React.Fragment>
      <div className='form-group' id={id}>
        <div className='upload btn btn-primary' disabled={disabled}>
          <i className='fa fa-folder'></i>
          {' ' + translate('document.choose_file')}
          <input
            className='upload'
            type='file'
            name='file'
            accept={accept}
            disabled={disabled}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            onChange={handleUploadFile}
            multiple={multiple}
          />
        </div>
      </div>
      {files && files.length ? (
        <div className='list-upload-file-cmc'>
          <ul className='ul-upload-file-cmc'>
            {files.map((child, index) => {
              return (
                <li key={index}>
                  <label className='delete-label-upfile-cmc'>
                    <a style={{ cursor: deleteValue ? 'pointer' : 'text' }} title='Xóa file này'>
                      <i
                        className='fa fa-times'
                        id='delete-icon-upload-cmc'
                        style={{ pointerEvents: deleteValue ? '' : 'none' }}
                        onClick={(e) => handleDeleteFile(index)}
                      />
                    </a>
                  </label>
                  <a className='file-name-upfile'>{child.fileName}</a>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </React.Fragment>
  )
}

const mapState = (state) => state
const UploadFileHookExport = connect(mapState, null)(withTranslate(UploadFileHook))

export { UploadFileHookExport as UploadFileHook }
