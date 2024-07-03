import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DatePicker } from "../../../../common-components";

function ProjectStatisticPage(props) {
  const { translate } = props


  
  return (
    <React.Fragment>
      <div className='qlcv' style={{ textAlign: 'left' }}>
        {/**Chọn ngày bắt đầu */}
        <div className='form-inline'>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.from')}</label>
            <DatePicker
              id='monthStartInProjectStatistic'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              // value={startMonthTitle} // giá trị mặc định cho datePicker
              // onChange={handleSelectMonthStart}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          {/**Chọn ngày kết thúc */}
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.to')}</label>
            <DatePicker
              id='monthEndInProjectStatistic'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              // value={endMonthTitle} // giá trị mặc định cho datePicker
              // onChange={handleSelectMonthEnd}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          {/**button tìm kiếm data để vẽ biểu đồ */}
          <div className='form-group'>
            <button type='button' className='btn btn-success'
              // onClick={handleSearchData}
            >
              {translate('kpi.evaluation.employee_evaluation.search')}
            </button>
          </div>
        </div>

        {/* Project Quantity => TODO split component */}
        <div className='row'>
          <div className='col-md-3 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-yellow'>
                <i className='fa fa-archive'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số dự án</span>
                {/* <a className="info-box-number" style="cursor: pointer; font-size: 20px;">1</a> */}
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{10}</span>
              </div>
            </div>
          </div>
          <div className='col-md-3 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-aqua'>
                <i className='fa fa-handshake-o'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số nhân viên</span>
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{200}</span>
              </div>
            </div>
          </div>
          <div className='col-md-3 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-green'>
                <i className='fa fa-tasks'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số dự án chưa thực hiện</span>
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{12}</span>
              </div>
            </div>
          </div>

          <div className='col-md-3 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-green'>
                <i className='fa fa-tasks'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số tài sản</span>
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{12}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='box'>
          <ul class='todo-list'>
            <li>
              <span class='handle'>
                <i class='fa fa-ellipsis-v'></i>
                <i class='fa fa-ellipsis-v'></i>
              </span>
              <span class='text'>
                {/* {numOfBP >= 10 && <span style={{ fontWeight: 600, color: "red", lineHeight: 2 }}>* Hiện đang có 10 gói thầu đang thực hiện, hãy tạm dừng tìm kiếm gói thầu mới để đảm bảo tiến độ *<br /></span>} */}
                <span style={{ fontWeight: 600, color: 'green', lineHeight: 2 }}>
                  Xem danh sách dự án tại{' '}
                  <a style={{ fontWeight: 600 }} href='/project/projects-list' target='_blank'>
                    đây
                  </a>
                </span>
              </span>
            </li>
          </ul>
        </div>

        


      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { translate } = state
  return { translate }
}

const actions = {

}

export default connect(mapState, actions)(withTranslate(ProjectStatisticPage))

