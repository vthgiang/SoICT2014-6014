import React, { useState } from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import Swal from 'sweetalert2'

function ConfigManagementForm() {
  const translate = useTranslate()
  const [numberGeneration, setNumberGeneration] = useState(100)
  const [solutionSize, setSolutionSize] = useState(30)
  const [hmcr, setHmcr] = useState(0.5)
  const [par, setPar] = useState(0.5)
  const [bandwidth, setBandwith] = useState(0.5)
  const [alpha, setAlpha] = useState(0.5)
  const [beta, setBeta] = useState(0.5)
  const [gamma, setGamma] = useState(0.5)

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      showDetailAssetGroup()
    }
  }

  return (
    <>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>{translate('kpi.kpi_allocation.config_management.number_generation')}</label>
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
            min={0}
            max={5000}
            onChange={(event) => setNumberGeneration(event.target.value)}
            value={numberGeneration}
          />
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>{translate('kpi.kpi_allocation.config_management.solution_size')}</label>
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
            min={0}
            max={50}
            onChange={(event) => setSolutionSize(event.target.value)}
            value={solutionSize}
          />
          <span className='text-danger' style={{ display: 'flex', alignItems: 'center' }}>
            12
          </span>
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>{translate('kpi.kpi_allocation.config_management.harmony_memory_consideration_rate')}</label>
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

          <input className='form-control' type='number' min={0} max={1} onChange={(event) => setHmcr(event.target.value)} value={hmcr} />
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>{translate('kpi.kpi_allocation.config_management.pitch_adjusting_rate')}</label>
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

          <input className='form-control' type='number' min={0} max={1} onChange={(event) => setPar(event.target.value)} value={par} />
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>{translate('kpi.kpi_allocation.config_management.bandwidth')}</label>
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
            min={0}
            max={1}
            onChange={(event) => setBandwith(event.target.value)}
            value={bandwidth}
          />
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>Alpha</label>
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

          <input className='form-control' type='number' min={0} max={1} onChange={(event) => setAlpha(event.target.value)} value={alpha} />
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>Beta</label>
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

          <input className='form-control' type='number' min={0} max={1} onChange={(event) => setBeta(event.target.value)} value={beta} />
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <div className='flex gap-[8px] items-center'>
            <label>Gamma</label>
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

          <input className='form-control' type='number' min={0} max={1} onChange={(event) => setGamma(event.target.value)} value={gamma} />
        </div>
      </div>
    </>
  )
}

export default ConfigManagementForm
