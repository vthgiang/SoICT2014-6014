export const ValidateDateOfEvaluation = {
  validateDateTime
}

/**
 * hàm validate ngày tháng đánh giá
 * @param {*} evaluatingMonth tháng đánh giá
 * @param {*} startDate ngày bắt đầu đánh giá
 * @param {*} startTime giờ bắt đầu đánh giá
 * @param {*} endDate ngày đánh giá kết thúc
 * @param {*} endTime giờ đánh giá kết thúc
 * @param {*} type kiểu validate cho ngày bắt đầu hoặc kết thúc, có giá trị là start || end
 * @returns
 */
const validateDateTime = (evaluatingMonth, startDate, startTime, endDate, endTime, type) => {
  let { translate } = this.props
  let { isEval, storedEvaluatingMonth, task } = this.state

  // init data
  let msg
  let endOfMonth = moment(evaluatingMonth, 'MM-YYYY').endOf('month').toDate()
  let startOfMonth = moment(evaluatingMonth, 'MM-YYYY').startOf('month').toDate()
  let monthOfEval = startOfMonth.getMonth()
  let yearOfEval = startOfMonth.getFullYear()

  // convert ISO date
  let startDateISO = this.convertDateTime(startDate, startTime)
  let endDateISO = this.convertDateTime(endDate, endTime)

  // tìm đánh giá tháng này
  let monthOfEvalStart = startDateISO.getMonth()
  let yearOfEvalStart = startDateISO.getFullYear()
  let monthOfEvalEnd = endDateISO.getMonth()
  let yearOfEvalEnd = endDateISO.getFullYear()
  let tmpStart = task.evaluations.find(
    (e) => monthOfEvalStart === new Date(e.evaluatingMonth).getMonth() && yearOfEvalStart === new Date(e.evaluatingMonth).getFullYear()
  )
  let tmpEnd = task.evaluations.find(
    (e) => monthOfEvalEnd === new Date(e.evaluatingMonth).getMonth() && yearOfEvalEnd === new Date(e.evaluatingMonth).getFullYear()
  )

  // kiểm tra sâu rỗng
  if (startDate.trim() === '' || startTime.trim() === '' || endDate.trim() === '' || endTime.trim() === '') {
    msg = translate('task.task_management.add_err_empty_end_date')
  }
  // kiểm tra ngày bắt đầu so với ngày kết thúc
  else if (startDateISO > endDateISO) {
    msg = translate('task.task_management.add_err_end_date')
  } else if (type === 'start') {
    // kiểm tra điều kiện trong tháng đánh giá
    if (startDateISO > endOfMonth) {
      console.log('startDateISO > endOfMonth')
      msg = 'Khoảng đánh giá phải chứa tháng đánh giá'
    }

    // kiểm tra ngày đánh giá so với các ngày khác
    else if (tmpStart) {
      if (
        !(monthOfEval === new Date(tmpStart.evaluatingMonth).getMonth() && yearOfEval === new Date(tmpStart.evaluatingMonth).getFullYear())
      ) {
        if (startDateISO < new Date(tmpStart.endDate)) {
          msg = 'Ngày đánh giá tháng này không được đè lên ngày đánh giá của tháng khác'
        }
      }
    }
  } else if (type === 'end') {
    if (endDateISO < startOfMonth) {
      console.log('endDateISO < startOfMonth')
      msg = 'Khoảng đánh giá phải chứa tháng đánh giá'
    }

    // kiểm tra ngày đánh giá so với các ngày khác
    else if (tmpEnd) {
      if (!(monthOfEval === new Date(tmpEnd.evaluatingMonth).getMonth() && yearOfEval === new Date(tmpEnd.evaluatingMonth).getFullYear())) {
        if (endDateISO > new Date(tmpEnd.startDate)) {
          msg = 'Ngày đánh giá tháng này không được đè lên ngày đánh giá của tháng khác'
        }
      }
    }
  }

  return msg
}
