// Function format ngày hiện tại thành dạnh mm-yyyy
export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }

  if (day.length < 2) {
    day = '0' + day
  }

  return [month, year].join('-')
}
export function formatDate2(date, monthYear = false) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }

  if (day.length < 2) {
    day = '0' + day
  }

  if (monthYear === true) {
    return [month, year].join('-')
  } else {
    return [day, month, year].join('-')
  }
}
