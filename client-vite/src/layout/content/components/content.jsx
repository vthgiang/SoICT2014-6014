import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import { Loading } from '../../../common-components'

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
    this.checkLink = this.checkLink.bind(this)
  }

  checkLink(arrLink, url) {
    let result = false
    arrLink.forEach((link) => {
      switch (link.resource.url) {
        case '/admin/department/detail':
          if (url.indexOf(link.resource.url) !== -1) {
            result = true
          }
          break

        case '/admin/resource/link/edit':
          if (url.indexOf(link.resource.url) !== -1) {
            result = true
          }
          break

        default:
          if (link.resource.url === url) {
            result = true
          }
          break
      }
    })

    return result
  }

  createResizableColumn = (resizer, index, resizerList, table) => {
    let x = 0
    let currentColWidth = 0
    let nextColWidth = 0
    let currentCol = {}
    let nextCol = {}
    const MINIMUM_WIDTH = 40

    const updateResizerHeight = () => {
      const tableHeight = `${table.offsetHeight}px`
      if (resizer.offsetHeight != table.offsetHeight) {
        for (const resizer of resizerList) {
          resizer.style.height = tableHeight
        }
      }
    }

    // Không cho select text khi đang resize column
    const disableSelect = (event) => {
      event.preventDefault()
    }

    const mouseOverHandler = () => {
      updateResizerHeight()
    }

    const mouseDownHandler = (e) => {
      x = e.pageX
      currentCol = resizer.parentElement
      nextCol = null
      console.log(` ${index}`)

      for (let i = index + 1; i < resizerList.length; i++) {
        console.log(i)
        const col = resizerList[i].parentElement
        if (col.style.display !== null && col.style.display !== undefined && col.style.display !== 'none') {
          nextCol = col // Tìm cột chưa bị ẩn kế tiếp
          break
        }
      }
      if (nextCol === null || nextCol === undefined) {
        return
      }

      currentColWidth = parseInt(window.getComputedStyle(currentCol).width, 10)
      nextColWidth = parseInt(window.getComputedStyle(nextCol).width, 10)

      document.addEventListener('mousemove', disableSelect)
      document.addEventListener('mousemove', mouseMoveHandler)
      document.addEventListener('touchmove', mouseMoveHandler)

      document.addEventListener('mouseup', mouseUpHandler)
      document.addEventListener('touchend', mouseUpHandler)

      resizer.classList.add('resizing')
    }

    const mouseMoveHandler = (e) => {
      const dx = e.pageX - x
      updateResizerHeight()
      if (nextColWidth - dx > MINIMUM_WIDTH && currentColWidth + dx > MINIMUM_WIDTH) {
        // Độ rộng mỗi cột tối thiểu 60px
        currentCol.style.width = `${currentColWidth + dx}px`
        nextCol.style.width = `${nextColWidth - dx}px`
      }
    }

    const mouseUpHandler = () => {
      resizer.classList.remove('resizing')
      document.removeEventListener('mousemove', disableSelect)
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('touchmove', mouseMoveHandler)

      document.removeEventListener('mouseup', mouseUpHandler)
      document.removeEventListener('touchend', mouseUpHandler)
    }

    resizer.addEventListener('mousedown', mouseDownHandler)
    resizer.addEventListener('mouseover', mouseOverHandler)
    resizer.addEventListener('touchstart', mouseDownHandler)
  }

  // Thêm resizer vào mỗi cột
  createResizer = (table) => {
    const cols = table.querySelectorAll('thead>tr>th')
    const tableHeight = `${table.offsetHeight}px`
    const resizerList = []
    for (let i = 0; i < cols.length; ++i) {
      const currentCol = cols[i]

      const resizer = document.createElement('div')
      resizer.classList.add('resizeDiv')
      resizer.style.height = tableHeight

      currentCol.appendChild(resizer)

      resizerList.push(resizer)
    }

    for (const i in resizerList) {
      this.createResizableColumn(resizerList[i], parseInt(i, 10), resizerList, table)
    }
  }

  removeAllResizer = () => {
    const resizers = window.$('table>thead>tr>th>div.resizeDiv')
    ;[].forEach.call(resizers, (resizer) => {
      resizer.remove()
    })
  }

  // Duyệt từng bảng, thêm resizer vào các cột của bảng đó
  createResizableTable = () => {
    const tables = window.$('table')
    ;[].forEach.call(tables, (table) => {
      this.createResizer(table)
    })
  }

  adjustSize = () => {
    const headings = window.$('table thead tr th')
    for (let i = 0; i < headings.length; ++i) {
      if (!window.$(headings[i]).hasClass('col-fixed')) {
        // Riêng cột có class col-fixed sẽ không xóa thuộc tính width
        window.$(headings[i]).width('')
      }
    }
  }

  componentWillUpdate() {
    this.removeAllResizer() // Xoá resizer mỗi khi update lại để không tạo nhiều resizer
  }

  componentDidUpdate() {
    this.createResizableTable()
    this.handleDataTable()
  }

  handleDataTable = async (index) => {
    const tables = window.$('table:not(.not-sort)')

    const updateResizerHeight = (table) => {
      const resizers = table.querySelectorAll('thead>tr>th>div.resizeDiv')
      const tableHeight = `${table.offsetHeight}px`
      if (resizers[0].offsetHeight != table.offsetHeight) {
        for (let i = 0; i < resizers.length; ++i) {
          resizers[i].style.height = tableHeight
        }
      }
    }

    const nonAccentVietnamese = (str) => {
      if (str === null || str === undefined) return str
      str = str.toLowerCase()
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      str = str.replace(/đ/g, 'd')
      // Some system encode vietnamese combining accent as individual utf-8 characters
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
      return str
    }

    const convertDate = (str) => {
      if (moment(str, 'DD-MM-YYYY', true).isValid()) {
        str = str.split('-')
        str = [str[2], str[1], str[0]].join('-')
      }

      if (moment(str, 'MM-YYYY', true).isValid()) {
        str = str.split('-')
        str = [str[1], str[0]].join('-')
      }

      if (moment(str, 'HH:mm DD-MM-YYYY', true).isValid()) {
        const time = str.split(' ')
        let date = time[1].split('-')
        date = [date[2], date[1], date[0]].join('-')
        str = `${date} ${time[0]}`
      }

      if (moment(str, 'HH:mm:SS DD/MM/YYYY', true).isValid()) {
        const time = str.split(' ')
        let date = time[1].split('/')
        date = [date[2], date[1], date[0]].join('-')
        str = `${date} ${time[0]}`
      }
      return str
    }

    window.$('body').mouseup(function (e) {
      const container = window.$('.dropdown-menu-filter')
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide()
      }
    })
    for (let i = 0; i < tables.length; i++) {
      const table = window.$(tables[i])
      const tableHeadings = table.find('th:not(:last-child)').not('.not-sort')
      const tableHeadingsColSort = table.find('th.col-sort').not('.not-sort')
      if (tableHeadingsColSort && tableHeadingsColSort.length) {
        for (let k = 0; k < tableHeadingsColSort.length; ++k) {
          tableHeadings.push(tableHeadingsColSort[k])
        }
      }
      for (let j = 0; j < tableHeadings.length; j++) {
        const th = window.$(tableHeadings[j])
        if (th.find('div.sort').length < 1) {
          // hàm sort
          const sort = (ascOrder) => {
            const rows = table.find('tbody>tr')
            for (let k = 0; k < tableHeadings.length; ++k) {
              if (k !== j) {
                const thNotChoice = window.$(tableHeadings[k])
                const listdiv = thNotChoice.find('div.sort')
                window.$(listdiv[0]).find('i.fa.fa-sort-amount-asc')[0].style.display = 'none'
                window.$(listdiv[0]).find('i.fa.fa-sort-amount-desc')[0].style.display = 'none'
                window.$(listdiv[0]).find('i.fa.fa-sort')[0].style.display = 'block'
              } else {
                const thNotChoice = window.$(tableHeadings[j])
                const listdiv = thNotChoice.find('div.sort')
                if (ascOrder == true) {
                  window.$(listdiv[0]).find('i.fa.fa-sort-amount-asc')[0].style.display = 'block'
                  window.$(listdiv[0]).find('i.fa.fa-sort')[0].style.display = 'none'
                } else if (ascOrder == false) {
                  window.$(listdiv[0]).find('i.fa.fa-sort-amount-desc')[0].style.display = 'block'
                  window.$(listdiv[0]).find('i.fa.fa-sort-amount-asc')[0].style.display = 'none'
                } else {
                  window.$(listdiv[0]).find('i.fa.fa-sort-amount-desc')[0].style.display = 'none'
                  window.$(listdiv[0]).find('i.fa.fa-sort')[0].style.display = 'block'
                }
              }
            }

            if (th[0].className == 'col-sort-number') {
              rows.sort((a, b) => {
                const keyA = parseInt(window.$(window.$(a).find('td')[j]).text())
                const keyB = parseInt(window.$(window.$(b).find('td')[j]).text())
                if (keyA < keyB) return ascOrder ? -1 : 1
                if (keyA > keyB) return ascOrder ? 1 : -1
                return 0
              })
            } else {
              rows.sort((a, b) => {
                let keyA
                let keyB
                if (ascOrder == 'return') {
                  keyA = nonAccentVietnamese(window.$(window.$(a).find('td')[0]).text())
                  keyB = nonAccentVietnamese(window.$(window.$(b).find('td')[0]).text())
                } else {
                  keyA = nonAccentVietnamese(window.$(window.$(a).find('td')[j]).text())
                  keyB = nonAccentVietnamese(window.$(window.$(b).find('td')[j]).text())
                }

                keyA = convertDate(keyA)
                keyB = convertDate(keyB)
                if (keyA < keyB) return ascOrder ? -1 : 1
                if (keyA > keyB) return ascOrder ? 1 : -1
                return 0
              })
            }

            window.$.each(rows, function (index, row) {
              table.children('tbody').append(row)
            })
          }

          // icon sort
          const up = window.$('<i>', { style: 'width: 100%; float: left; cursor: pointer; color: rgb(226 222 222) ', class: 'fa fa-sort' })
          const down = window.$('<i>', {
            style: 'width: 100%; float: left; cursor: pointer; color: black; display: none ',
            class: 'fa fa-sort-amount-asc'
          })
          const requestReturn = window.$('<i>', {
            style: 'width: 100%; float: left; cursor: pointer; color: black; display: none ',
            class: 'fa fa-sort-amount-desc'
          })

          // icon filter
          const filterIcon = window.$('<button>', {
            style: 'width: 100%; float: right; cursor: pointer; color: rgb(226 222 222); border: none; background: none',
            class: 'fa fa-filter',
            target: 'dropdown-menu-filter'
          })
          const filterDropdown = window.$('<div>', {
            style:
              'display: none; cursor: auto; z-index: 1000; position: absolute;width: 200px;margin-top: 25px;text-align: left;border-radius: 5px;margin: 26px 0px 0px 19px;padding: 10px;background-color: rgb(232, 240, 244);box-sizing: border-box;border-top: 2px solid rgb(54, 156, 199);box-shadow: 4px 4px 15px rgba(50, 50, 50); ',
            class: 'collapse dropdown-menu-filter'
          })
          const closeButton = window.$('<button>', {
            style:
              'float: right; font-size: 11px;top: 7px;right: 8px;line-height: 15px;background-color: rgb(60 141 188);color: rgb(232, 240, 244);border-radius: 50%;width: 14px;height: 14px;font-weight: bold;text-align: center;margin: 0;padding: 0;border: 0',
            class: 'fa fa-times',
            target: 'dropdown-menu-filter'
          })
          const clearButton = window.$('<button>', {
            style:
              'float: right; font-size: 11px;height: 24px;font-weight: bold;color: rgb(60 141 188);background-color: transparent;margin: 0;border: 0',
            target: 'dropdown-menu-filter',
            text: 'Clear'
          })

          const filterInput = window.$('<input>', { style: 'width: 100%; display: block', class: 'form-control' })
          const filterTitle = window.$('<h6>', {
            style: 'margin: 0px 0px 15px;padding: 0px;font-weight: bold;color: #3c8dbc; text-align: center',
            text: 'kkk'
          })
          const filterLabel = window.$('<label>', { style: 'margin: 0; color: #3c8dbc', text: 'Filter' })

          filterDropdown.append(closeButton, filterTitle, filterLabel, filterInput, clearButton)

          for (let k = 0; k < tableHeadings.length; ++k) {
            if (k === j) {
              const thChoiced = window.$(tableHeadings[k])
              const title = thChoiced[0].innerText
              filterTitle[0].innerText = title
            }
          }

          up.click(() => {
            sort(true)
          })

          down.click(() => {
            sort(false)
          })

          requestReturn.click(() => {
            sort('return')
          })

          const filterFunc = () => {
            // tất cả input trong heading của table
            const inputs = table.find('th:not(:last-child) input')
            const rows = table.find('tbody tr')
            window.$(rows).show() // ban đầu tất cả rows đều show ra
            window.$.each(inputs, function (index, input) {
              const value = input.value.toLowerCase()
              const iconFilter = window.$(input).parent().parent().children()[0]
              if (value.replace(/\s/g, '') !== '') {
                // value khác rỗng
                iconFilter.style.color = 'black' // chuyển màu icon
                rows.filter((a) => {
                  const keyData = window.$(window.$(rows[a]).find(`td:eq(${index})`)).text() // value trong cột mình muốn filter
                  const re = new RegExp(nonAccentVietnamese(value), 'gi') // bỏ dấu giá trị mình tìm kiếm
                  if (keyData) {
                    // check xem 2 giá trị khác nhau hay không
                    if (nonAccentVietnamese(keyData).search(re) == -1) {
                      window.$(rows[a]).hide()
                    }
                  }
                })
              } else {
                iconFilter.style.color = 'rgb(226 222 222)'
              }
            })
          }
          // bắt sự kiện user nhập thông tin từ bàn phím
          const filterOnKeyUp = () => {
            table.find('.filter input').keyup(function (e) {
              filterFunc()
              updateResizerHeight(table[0])
            })
          }
          filterIcon.click(() => {
            console.log('filterDropdown :>> ', filterDropdown)
            console.log('window.innerWidth :>> ', window.innerWidth)
            console.log('filterDropdown :>> ', filterDropdown[0])

            for (let k = 0; k < tableHeadings.length; ++k) {
              if (k === j) {
                const thChoiced = window.$(tableHeadings[k])
                const filterDiv = thChoiced.find('div.filter')
                const x = window.$(filterDiv[0]).find('.dropdown-menu-filter')
                if (x[0].style.display == 'none') {
                  x.toggle('show')
                  x.find('input').focus()
                  x[0].style.display = 'block'
                }
              }
            }
            filterOnKeyUp()
          })

          closeButton.click(() => {
            for (let k = 0; k < tableHeadings.length; ++k) {
              if (j === k) {
                const thNotChoice = window.$(tableHeadings[k])
                const listdiv = thNotChoice.find('div.filter')

                const x = window.$(listdiv[0]).find('.dropdown-menu-filter')
                x.toggle('hide')
              }
            }
          })
          clearButton.click(() => {
            for (let k = 0; k < tableHeadings.length; ++k) {
              if (j === k) {
                const thNotChoice = window.$(tableHeadings[k])
                const listdiv = thNotChoice.find('div.filter')
                const input = thNotChoice.find('div.filter input')
                const x = window.$(listdiv[0]).find('.dropdown-menu-filter')
                input[0].value = ''
                x.find('input').focus()
              }
            }
            filterFunc()
          })
          const divSort = window.$('<div>', { style: 'float: left; margin-top: 3px; margin-right: 4px', class: 'sort' })
          const divFilter = window.$('<div>', { style: 'float: right; margin-top: 3px; margin-right: -10px', class: 'filter' })
          filterDropdown.hide()
          divSort.append(up, down, requestReturn, filterIcon)
          divFilter.append(filterIcon, filterDropdown)
          th.prepend(divSort)
          th.append(divFilter)
        }
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.adjustSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.adjustSize)
  }

  render() {
    const { translate, pageName, arrPage, isLoading } = this.props
    return (
      <div className='content-wrapper'>
        <section className='content-header'>
          <h1>
            {' '}
            {pageName} &nbsp; {isLoading && <Loading />}{' '}
          </h1>

          <ol className='breadcrumb'>
            {arrPage !== undefined &&
              arrPage.map((page) => (
                <li key={page.name}>
                  <a href={page.link}>
                    <i className={page.icon} />
                    {translate(`menu.${page.name}`)}
                  </a>
                </li>
              ))}
          </ol>
        </section>
        <section className='content'>{this.props.children}</section>
      </div>
    )
  }
}
const mapState = (state) => state

export default connect(mapState, null)(withTranslate(Content))
