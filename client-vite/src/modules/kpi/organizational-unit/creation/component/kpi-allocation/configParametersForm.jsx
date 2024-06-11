import React from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
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
                <li><b>${translate('kpi.kpi_allocation.config_management.solution_size')}: </b>Đây là số lượng giải pháp được xem xét. Càng nhiều giải pháp thường sẽ đem lại kết quả tốt hơn. Tuy nhiên, chúng tôi khuyến nghị nên giữ số lượng giải pháp trong khoảng từ 30 đến 50 để đảm bảo hiệu suất và khả năng quản lý.</li>
                <li><b>${translate('kpi.kpi_allocation.config_management.harmony_memory_consideration_rate')}: </b>Chỉ số này cho biết tần suất thuật toán xem xét tập hợp các giải pháp hiện có (bộ nhớ hòa âm) khi hình thành giải pháp mới. HMCR càng cao thì giải pháp mới càng có khả năng dựa trên tập giải pháp ban đầu, giống như học từ kinh nghiệm trước đó.</li>
                <li><b>${translate('kpi.kpi_allocation.config_management.pitch_adjusting_rate')}: </b>Chỉ số này điều chỉnh mức độ giá trị của các giải pháp được điều chỉnh. PAR càng cao thì tập giải pháp càng đa dạng, tăng khả năng tìm ra giải pháp tối ưu.</li>
                <li><b>${translate('kpi.kpi_allocation.config_management.bandwidth')}: </b> Giá trị này xác định mức độ mà các giải pháp được điều chỉnh. Băng thông càng lớn thì tập giải pháp càng phong phú, làm giàu thêm tập giải pháp.</li>
                <li><b>Alpha: </b> Alpha là trọng số của giải pháp trong công thức xác suất dịch chuyển của thuật toán đàn kiến. Alpha càng lớn thì tầm quan trọng của nồng độ pheromone trên đường đi càng cao, hướng dẫn các kiến tốt hơn.</li>
                <li><b>Beta: </b> Beta là một trọng số khác trong công thức xác suất dịch chuyển. Beta càng lớn thì tầm quan trọng của giá trị heuristic (hay chất lượng) của giải pháp càng cao, làm cho các giải pháp tốt hơn hấp dẫn hơn.</li>
                <li><b>Gamma: </b>Gamma là trọng số cho thời gian thực hiện nhiệm vụ trong giải pháp trong công thức xác suất dịch chuyển. Gamma càng lớn thì tầm quan trọng của việc hoàn thành nhiệm vụ nhanh chóng càng cao, tối ưu hóa thời gian thực hiện tổng thể.</li>
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
    { label: translate('kpi.kpi_allocation.config_management.number_generation'), name: 'numberGeneration', min: 0, max: 5001 },
    { label: translate('kpi.kpi_allocation.config_management.solution_size'), name: 'solutionSize', min: 0, max: 50 },
    { label: translate('kpi.kpi_allocation.config_management.harmony_memory_consideration_rate'), name: 'hmcr', min: 0, max: 1 },
    { label: translate('kpi.kpi_allocation.config_management.pitch_adjusting_rate'), name: 'par', min: 0, max: 1 },
    { label: translate('kpi.kpi_allocation.config_management.bandwidth'), name: 'bandwidth', min: 0, max: 1 },
    { label: 'Alpha', name: 'alpha', min: 0, max: 1 },
    { label: 'Beta', name: 'beta', min: 0, max: 1 },
    { label: 'Gamma', name: 'gamma', min: 0, max: 1 }
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
            <input
              className='form-control'
              type='number'
              name={param.name}
              min={param.min}
              max={param.max}
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
