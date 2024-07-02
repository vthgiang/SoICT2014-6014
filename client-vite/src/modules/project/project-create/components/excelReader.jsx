import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { requiredFields } from './consts'
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual"
// tmp object
/*
[
    {
        "name": "介護会社5Staff",
        "code": "A1",
        "description": "",
        "preceedingTasks": [], => conver từ xâu => mảng
        "estimateNormalTime": 2,
        "requireAssignee": {
            "manual_test": 1
        },
        "requireAsset": [
            {
                "type": "66659c35e7f74549b898525c",
                "number": 1,
                "capacityValue": 1,
                "requireType": "obligatory"
            }
        ],
        "tags": [
          "planning" => conver từ xâu sang mảng
        ],
        "kpiInTask": "66659c3f169e3547d0e0a883", => conver từ tên => ID
        "taskKPIWeight": 0
    }
]
 */

const ExcelReader = (props) => {
  const { onDataLoad, setErrorUpload, translate } = props
  const { multiple = false, disabled = false, accept = '', deleteValue = true } = props
  
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const containsRequiredFields = (array, requiredFields) => {
    return requiredFields.every((field) => array.includes(field))
  }

  const convertStringToArray = (str) => {
    return str && str?.length
      ? str
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== '')
      : []
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      const binaryStr = event.target.result
      const workbook = XLSX.read(binaryStr, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      const listAttributeKey = jsonData[11]
      if (!listAttributeKey || listAttributeKey?.length !== 23 || !containsRequiredFields(listAttributeKey, requiredFields)) {
        // TODO: translate
        setErrorUpload('File import không hợp lệ!')
        return
      }
      let filteredData = jsonData
        .slice(12)
        .filter((row) => row.some((cell) => cell !== null && cell !== ''))
        .map((row, index) => {
          let obj = {
            name: '',
            code: '',
            tags: [],
            preceedingTasks: [],
            kpiInTask: '',
            taskKPIWeight: 0,
            description: '',
            requireAssignee: {},
            requireAsset: []
          }
          let requireAssetObj = {}
          row.forEach((cell, cellIndex) => {
            // cases of cellIndex
            if (cellIndex >= 10 - 1 && cellIndex <= 19 - 1) {
              obj.requireAssignee[listAttributeKey[cellIndex]] = cell
            } else if (cellIndex >= 20 - 1 && cellIndex <= 23 - 1) {
              if (cellIndex === 23 - 1) {
                requireAssetObj[listAttributeKey[cellIndex]] = cell ? 'obligatory' : 'optional'
              } else {
                requireAssetObj[listAttributeKey[cellIndex]] = cell
              }
            } else {
              obj[listAttributeKey[cellIndex]] = cell
            }
          })
          obj.requireAsset.push({
            ...requireAssetObj
          })
          return obj
        })

      if (!filteredData || !filteredData?.length) {
        setErrorUpload('File import rỗng!')
        return
      }

      filteredData = filteredData.map((item) => {
        const { tags, preceedingTasks } = item
        return {
          ...item,
          preceedingTasks: convertStringToArray(preceedingTasks),
          tags: convertStringToArray(tags)
        }
      })

      const listTaskCode = filteredData.map((item) => item.code)

      filteredData.forEach((item) => {
        const { preceedingTasks, tags, code, name, kpiInTask, estimateNormalTime } = item
        if (preceedingTasks && preceedingTasks?.length) {
          preceedingTasks.forEach((taskCode) => {
            if (!listTaskCode.includes(taskCode)) {
              setErrorUpload('Lỗi! Tồn tại công việc trong file có danh sách công việc tiền nhiệm không hợp lệ!')
              return
            }
          })
        }

        if (!tags || !tags?.length || !code || !name || !estimateNormalTime || !kpiInTask) {
          setErrorUpload("Lỗi! Tồn tại công việc trong file không điền đủ các trường thông tin bắt buộc!")
        }

      })



      onDataLoad(filteredData)
    }

    reader.readAsBinaryString(file)
  }

  const handleRemoveFile = () => {
    setFileName('')
    setErrorUpload('')
    onDataLoad([])
    // Reset giá trị của input file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='form-group'>
      <div className='upload btn btn-primary' disabled={disabled}>
        <i className='fa fa-folder'></i>
        {' ' + translate('document.choose_file')}
        <input
          className='upload'
          type='file'
          accept='.xls,.xlsx'
          onChange={handleFileUpload}
          disabled={disabled}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          ref={fileInputRef} // Thêm ref cho input file
        />
      </div>
      {fileName && (
        <div>
          <label className='delete-label-upfile-cmc flex'>
            <a className="inline-block max-w-xs truncate" title={fileName}>{fileName}</a>
            <a style={{ cursor: deleteValue ? 'pointer' : 'text', paddingLeft: 4 }} title='Xóa file này'>
              <i
                className='fa fa-times'
                id='delete-icon-upload-cmc'
                style={{ pointerEvents: deleteValue ? '' : 'none' }}
                onClick={handleRemoveFile}
              />
            </a>
          </label>
        </div>
      )}
    </div>
  )
}

const mapState = (state) => state
export default connect(mapState, null)(withTranslate(ExcelReader))


