import React, { useState } from "react";
import { DialogModal, ErrorLabel } from "../../../../common-components";


function AlgorithmModal(props) {
  const { algorithm, setAlgorithmParams, algorithmParams } = props
  const [params, setParams] = useState({
    ...algorithmParams
  })
  const { dlhs, hs } = params

  const saveParams = () => {
    setAlgorithmParams({
      ...params
    })
  }

  const handleChangeParams = (e, algorithmKey, paramKey) => {
    setParams({
      ...params,
      [algorithmKey]: {
        ...params[algorithmKey],
        [paramKey]: Number(e.target.value)
      }
    })
  }
  
  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-params-${algorithm}`}
        isLoading={false}
        func={saveParams}
        size={75}
        disableSubmit={false}
        title={'Thuật toán và điều chỉnh tham số'}
      >
        {algorithm === 'DLHS' ? (
          <div className="row px-40">
            <div className="row">
              {/* Thuật toán đã chọn */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Thuật toán đã chọn'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  disabled
                  value={algorithm}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'HMS')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
              {/* Số thế hệ */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Số thế hệ (số vòng lặp thực hiện)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={dlhs?.Max_FEs}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'Max_FEs')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
            </div>
            <div className="row">
              {/* HMS */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Kích thước bộ nhớ hài hòa (Harmony Size)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={dlhs?.HMS}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'HMS')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>

              {/* PSL Size */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Kích thước bảng chứa tham số chiến thắng (HMCR, PAR)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={dlhs?.PSLSize}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'PSLSize')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
            </div>
            <div className="row">
              {/* Num of sub */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Số lượng quần thể con'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={dlhs?.numOfSub}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'numOfSub')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>

              {/* R */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Chu kỳ tái tạo và chia lại quần thể con'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={dlhs?.R}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'R')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
            </div>
            <div className="row">
              {/* BW_min */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Khoảng cách điều chỉnh cao độ cực tiểu (bw min)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={dlhs?.BW_min}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'BW_min')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>

              {/* BW_max */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Khoảng cách điều chỉnh cao độ cực đại (bw max)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={dlhs?.BW_max}
                  onChange={(e) => handleChangeParams(e, 'dlhs', 'BW_max')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row px-40">
            <div className="row">
              {/* Thuật toán đã chọn */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Thuật toán đã chọn'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  disabled
                  value={algorithm}
                  onChange={(e) => handleChangeParams(e, 'hs', 'HMS')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
              {/* Số thế hệ */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Số thế hệ (số vòng lặp thực hiện)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={hs?.maxIter}
                  onChange={(e) => handleChangeParams(e, 'hs', 'maxIter')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
            </div>
            <div className="row">
              {/* HMS */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Kích thước bộ nhớ hài hòa (Harmony Size)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={hs?.HMS}
                  onChange={(e) => handleChangeParams(e, 'hs', 'HMS')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>

              {/* PSL Size */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Tỷ lệ xem xét bộ nhớ hài hòa (HMCR)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={hs?.HMCR}
                  onChange={(e) => handleChangeParams(e, 'hs', 'HMCR')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
            </div>
            <div className="row">
              {/* Num of sub */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Tỷ lệ điều chỉnh cao độ (PAR)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={hs?.PAR}
                  onChange={(e) => handleChangeParams(e, 'hs', 'PAR')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>

              {/* bw */}
              <div className={`form-group col-md-6 col-xs-12`}>
                <label>
                  {'Khoảng cách điều chỉnh cao độ (bw)'}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={hs?.bw}
                  onChange={(e) => handleChangeParams(e, 'hs', 'bw')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={''} />
                </div>
              </div>
            </div>
          </div> 
        )}
        <div className="font-bold text-center">Các bước thực hiện thuật toán</div>
        <div className="px-40">
          <ul>
            <li>
              <span className="font-semibold">Bước 1: Sắp thứ tự thực hiện công việc, định hình thời gian của tập công việc</span>
              <div className="px-10">
                1.1. Sắp topo: để đảm bảo thứ tự trước-sau của công việc <br />
                1.2. Áp dụng phương pháp CPM (Critical Path Method): tìm ra LS, LF, ES, EF từng công việc, định hình các luồng song song có thể thực hiện.
              </div>
            </li>
            <li>
              <span className="font-semibold">Bước 2: Gán khung thời gian, tài sản thực hiện công việc</span>
              <div className="px-10">
                Bước này thực hiện gán khung thời gian, tài sản (mang tính bắt buộc cho các công việc).
              </div>
            </li>
            <li>
              <span className="font-semibold">Bước 3: Gán nhân lực thực hiện công việc</span>
              <div className="px-10">
                Bước này thực hiện gán nhân viên thực hiện các công việc. Trong trường hợp công việc yêu cầu tài sản không bắt buộc, xem xét và gán nếu hợp lý.
                Bước này có thể chọn thuật toán DLHS hoặc HS tùy chọn. Ở đây bạn đang chọn <span className="text-blue-500">{algorithm}</span>. <br />
                <i>Nếu không gian tìm kiếm lớn, mong muốn chiến lược tìm kiếm tối ưu cục bộ, thời gian thực hiện nhanh thì nên chọn <span className="text-blue-500">DLHS</span></i> <br/>
                <i>Nếu không gian tìm kiếm không quá lớn, mong muốn chiến lược tìm kiếm tối ưu cục bộ tốt hơn, thì nên chọn <span className="text-blue-500">HS</span></i>
                
              </div>
            </li>
            <li>
              <span className="font-semibold">Bước 4: Điều chỉnh lại các công việc xung đột</span>
              <div className="px-10">
                Bước này thực hiện điều chỉnh lại lịch các công việc bị xung đột thời gian nếu có thể.
              </div>
            </li>
          </ul>

        </div>
      </DialogModal>
    </React.Fragment>
  )
}

export default AlgorithmModal
