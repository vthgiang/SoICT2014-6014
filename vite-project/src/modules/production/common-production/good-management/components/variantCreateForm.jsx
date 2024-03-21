import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ErrorLabel, SelectMulti, DataTableSetting } from '../../../../../common-components'
import ModalAddVariantOption from './modalAddVariantOption'
import Swal from 'sweetalert2'

function VariantCreateForm(props) {
  const [state, setState] = useState({
    variants: []
  })

  const addVariantOptions = () => {
    window.$('#modal-add-variant-option').modal('show')
  }

  const handleAddVariantOptions = async (data) => {
    const { variants } = state
    const { productCode } = props
    let arr = []
    let length = 0
    let array1 = []
    let array2 = []
    if (data.length !== 0) {
      array1 = Object.entries(data[0]).map(([key, value]) => ({ key, value }))
      length = array1[1].value.length
      array1[1].value.forEach((item, index) => {
        arr.push(item)
      })
      for (let i = 0; i < data.length; i++) {
        if (i === data.length - 1) break
        array2 = Object.entries(data[i + 1]).map(([key, value]) => ({ key, value }))
        arr.map((item1, index1) => {
          array2[1].value.map((item2, index2) => {
            arr.push(item1 + '-' + item2)
          })
        })
        length = length * array2[1].value.length
      }
    }
    if (arr.length !== 0) {
      arr.slice(-length).forEach((item, index) => {
        variants[index] = { ...variants[index], variantName: item }
        variants[index] = { ...variants[index], sku: productCode + '-' + (index + 1) + '-' + item }
        variants[index] = { ...variants[index], variantOptions: data }
      })
      setState({
        ...state,
        variants: variants
      })
      props.handleChange(state.variants)
    }
  }

  const handleVariantFieldChange = (e, inputField, index) => {
    var { value } = e.target
    variants[index] = { ...variants[index], [inputField]: value }
    setState({
      ...state,
      variants: variants
    })
    props.handleChange(state.variants)
  }

  const showListExplainVariant = () => {
    Swal.fire({
      icon: 'question',
      html: `<h3 style="color: red"><div>Biến thể hàng hóa</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Sử dụng Tùy chọn biến thể để tạo Biến thể, mỗi Biến thể có một SKU duy nhất có thể được sử dụng để theo dõi hàng tồn kho. </p>
            <p>Gán các thuộc tính như Giá mặc định và Trọng lượng ở cấp Biến thể.</p>
            <p>Ví dụ: Màu sắc: xanh, đỏ; Kích cỡ: M, L => sẽ tạo ra 4 biến thể gồm: </p>
            <p>Xanh-M, Xanh-L, Đỏ-M, Đỏ-L</p>`,
      width: '50%'
    })
  }

  const { translate, productWeight, productDefaultPrice } = props
  let { variants } = state
  return (
    <fieldset className='scheduler-border'>
      <ModalAddVariantOption onDataChange={handleAddVariantOptions} />
      <legend className='scheduler-border'>
        Biến thể hàng hóa
        <a onClick={() => showListExplainVariant()}>
          <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
        </a>
      </legend>

      <div className={`form-group`}>
        <label className='control-label'>Tùy chọn biến thể</label>
        <div>
          {typeof variants['variantOptions'] === 'undefined' || variants['variantOptions'].length === 0 ? (
            <p>Chưa có tùy chọn nào được thêm</p>
          ) : (
            ''
          )}
          <p type='button' className='btn btn-success' onClick={() => addVariantOptions()}>
            Thêm mới
          </p>
        </div>
      </div>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th title='STT'>STT</th>
            <th title='Tên tùy chọn'>Tên tùy chọn</th>
            <th title='Giá trị'>Giá trị</th>
          </tr>
        </thead>
        <tbody id={`variant_option`}>
          {typeof variants === 'undefined' || variants.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <center>{translate('task_template.no_data')}</center>
              </td>
            </tr>
          ) : (
            variants[0].variantOptions.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{Object.entries(item).map(([key, value]) => ({ key, value }))[0].value}</td>
                <td>
                  {Object.entries(item)
                    .map(([key, value]) => ({ key, value }))[1]
                    .value.map((variantOptionValue, i) => (
                      <div key={i}>{variantOptionValue} &nbsp;</div>
                    ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={`form-group`} style={{ marginTop: '15px' }}>
        <label className='control-label'>Biến thể</label>
        {typeof variants === 'undefined' || variants.length === 0 ? <p>Biến thể sẽ tự động khởi tạo sau khi thêm mới tùy chọn.</p> : ''}
      </div>

      <table id={`good-table`} className='table table-striped table-bordered table-hover' style={{ marginTop: '15px' }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Biến thể</th>
            <th>SKU</th>
            <th>Giá mặc định</th>
            <th>Giá sale</th>
            <th>MSRP</th>
            <th>Khối lượng</th>
            <th>Chiều rộng</th>
            <th>Chiều cao</th>
            <th>Độ sâu</th>
            <th>Chi phí</th>
            <th>UPC/EAN</th>
            <th>MPN</th>
            <th style={{ width: '120px', textAlign: 'center' }}>
              {translate('table.action')}
              <DataTableSetting
                tableId={`good-table`}
                columnArr={[
                  'STT',
                  'Biến thể',
                  'SKU',
                  'Giá mặc định',
                  'Giá sale',
                  'MSRP',
                  'Khối lượng',
                  'Chiều rộng',
                  'Chiều cao',
                  'Chi phí',
                  'Độ sâu',
                  'UPC/EAN',
                  'MPN'
                ]}
                // limit={state.limit}
                // setLimit={setLimit}
                hideColumnOption={true}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {typeof variants === '' || variants === 0 ? (
            <tr>
              <td colSpan={13}>
                <center>{translate('task_template.no_data')}</center>
              </td>
            </tr>
          ) : (
            variants.map((x, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{x.variantName}</td>
                <td>{x.sku}</td>
                <td>
                  <input
                    value={x.defaultPrice ? x.defaultPrice : productDefaultPrice ? productDefaultPrice : ''}
                    type='text'
                    className='form-control'
                    onChange={(e) => handleVariantFieldChange(e, 'defaultPrice', index)}
                  />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'salePrice', index)} />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'msrp', index)} />
                </td>
                <td>
                  <input
                    value={x.weight ? x.weight : productWeight ? productWeight : ''}
                    type='text'
                    className='form-control'
                    onChange={(e) => handleVariantFieldChange(e, 'weight', index)}
                  />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'width', index)} />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'height', index)} />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'depth', index)} />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'cost', index)} />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'upcEan', index)} />
                </td>
                <td>
                  <input type='text' className='form-control' onChange={(e) => handleVariantFieldChange(e, 'mpn', index)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </fieldset>
  )
}

export default connect(null, null)(withTranslate(VariantCreateForm))
