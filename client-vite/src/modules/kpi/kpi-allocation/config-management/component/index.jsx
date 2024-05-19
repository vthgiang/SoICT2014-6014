import React, { useState } from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import Swal from 'sweetalert2'
import { SelectBox } from '../../../../../common-components'
import ConfigManagementForm from './form'

function ConfigManagement() {
  const translate = useTranslate()
  const [isAutomatic, setIsAutomatic] = useState('on')

  const showDetailAssetGroup = () => {
    Swal.fire({
      icon: 'question',

      html: `<h3 style="color: red"><div>Các nhóm tài sản</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <ul>
                <li><b>Mặt bằng: </b>bao gồm nhà, công trình xây dựng, vật kiến trúc,...</li>
                <li><b>Xe cộ: </b>bao gồm các phương tiện vận tải</li>
                <li><b>Máy móc: </b>bao gồm các loại máy móc, thiết bị văn phòng, thiết bị truyền dẫn, thiết bị động lực, thiết bị chuyên dùng, thiết bị đo lường thí nghiệm,...</li>
                <li><b>Khác: </b> bao gồm cây lâu năm, súc vật, trang thiết bị dễ hỏng dễ vỡ hay các tài sản cố định hữu hình khác, các tài sản cố định vô hình, các tài sản cố định đặc thù,...</li>
            </ul>
            <p>Ví dụ một số tài sản được phân lần lượt vào các nhóm như sau:</p>
            <ul>
               <li><b>Mặt bằng: </b>như nhà văn hóa,....</li>
                <li><b>Xe cộ: </b>một số tài sản như xe ô tô, xe mô tô/gắn máy,...</li>
                <li><b>Máy móc: </b>bao gồm một số loại tài sản như máy sưởi, máy hút bụi,....</li>
                <li><b>Khác: </b> gồm một số tài sản như cây xanh, bản quyền phần mềm, ứng dụng,....</li>
            </ul>`,
      width: '50%'
    })
  }

  return (
    <div className='row'>
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        <div className='box box-default'>
          <div className='box-header with-border text-center'>
            <b style={{ fontSize: '24px' }}>{translate('kpi.kpi_allocation.config_management.config_component')}</b>
          </div>
          <div className='box-body'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <label>{translate('kpi.kpi_allocation.config_management.automatic')}</label>
                <SelectBox
                  id='select-backup-status'
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={[
                    { value: 'on', text: translate('kpi.kpi_allocation.config_management.automatic_on') },
                    { value: 'off', text: translate('kpi.kpi_allocation.config_management.automatic_off') }
                  ]}
                  value={isAutomatic}
                  onChange={(value) => setIsAutomatic(value[0])}
                  multiple={false}
                />
              </div>
            </div>

            <ConfigManagementForm />
          </div>
          <div className='box-footer text-center'>
            <button type='button' className='btn btn-success' onClick={showDetailAssetGroup}>
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigManagement
