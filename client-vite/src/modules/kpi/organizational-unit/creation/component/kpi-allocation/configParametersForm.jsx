import React from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'

import Slider from '@mui/material/Slider'
import { ConfigParametersAction } from './redux/actions'

function ConfigParametersForm() {
  const translate = useTranslate()
  const configData = useSelector((state) => state.configParametersReducer)
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target

    dispatch(ConfigParametersAction.updateConfigSetting(name, parseFloat(value)))
  }

  const showDetailAssetGroup = () => {
    Swal.fire({
      icon: 'question',
      html: `<h3 style="color: red">Giải thích tham số truyền vào của giải thuật</h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <ul>
                <li><b>${translate('kpi.kpi_allocation.config_management.number_generation')}: </b>Sau mỗi lần chạy thuật toán, kết quả sẽ được cải thiện. Số thế hệ chính là số lần kết quả được tối ưu hóa. Số thế hệ càng nhiều thì kết quả cuối cùng càng tốt.</li>
                <li><b>${translate('kpi.kpi_allocation.config_management.solution_size')}: </b>Đây là số lượng giải pháp được xem xét. Càng nhiều giải pháp thường sẽ đem lại kết quả tốt hơn. Tuy nhiên, chúng tôi khuyến nghị nên giữ số lượng giải pháp là 50 để đảm bảo hiệu suất và khả năng quản lý.</li>
            </ul>
            </div>`,
      width: '50%'
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      showDetailAssetGroup()
    }
  }

  const parameters = [
    { label: translate('kpi.kpi_allocation.config_management.number_generation'), name: 'numberGeneration', min: 0, max: 500 },
    { label: translate('kpi.kpi_allocation.config_management.solution_size'), name: 'solutionSize', min: 0, max: 100 }
  ]

  return (
    <>
      {parameters.map((param) => (
        <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6' key={param.name}>
          <div className='form-group'>
            <div className='flex gap-[8px] items-center'>
              <label>{param.label}</label>
              <i
                className='fa fa-question-circle mb-[5px]'
                style={{ cursor: 'pointer', color: '#dd4b39' }}
                onClick={showDetailAssetGroup}
                tabIndex='0'
                role='button'
                aria-label='Show details'
                onKeyDown={handleKeyDown}
              />
            </div>
            {/* <input
              className='form-control'
              type='number'
              name={param.name}
              min={param.min}
              max={param.max}
              onChange={handleInputChange}
              value={configData[param.name]}
            /> */}
            <Slider
              defaultValue={param.max}
              name={param.name}
              min={param.min}
              max={param.max}
              aria-label='Default'
              valueLabelDisplay='on'
              onChange={handleInputChange}
              value={configData[param.name]}
            />
          </div>
        </div>
      ))}
    </>
  )
}

export default ConfigParametersForm
