import { DayTableSlicer } from '@fullcalendar/daygrid';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { Loading } from '../../../common-components';
import moment from 'moment'

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.checkLink = this.checkLink.bind(this);
    }

    checkLink(arrLink, url) {
        var result = false;
        arrLink.forEach(link => {
            switch (link.resource.url) {
                case '/admin/department/detail':
                    if (url.indexOf(link.resource.url) !== -1) {
                        result = true;
                    }
                    break;

                case '/admin/resource/link/edit':
                    if (url.indexOf(link.resource.url) !== -1) {
                        result = true;
                    }
                    break;

                default:
                    if (link.resource.url === url) {
                        result = true;
                    }
                    break;
            }
        });

        return result;
    }

    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;

            var tableHeadings = [];
            var originalHeadingWidths = [];
            var resizingIndex = -1;
            var startX = undefined;

            window.$("table thead tr th:not(:last-child)").on("touchstart mousedown", function (e) {
                pressed = true;

                // Touch or mouse
                startX = (e.changedTouches === undefined) ? e.pageX : e.changedTouches[0].pageX;

                let currentTH = window.$(this);
                window.$(currentTH).addClass("resizing");
                tableHeadings = window.$(currentTH)[0].parentNode.childNodes;

                // Find the index of resizing column
                for (let i = 0; i < tableHeadings.length; ++i) {
                    if (tableHeadings[i] === window.$(currentTH)[0]) {
                        resizingIndex = i;
                        break;
                    }
                }

                // Save the current widths of all columns
                for (let i = 0; i < tableHeadings.length; ++i) {
                    originalHeadingWidths[i] = window.$(tableHeadings[i]).width()
                }
            });

            window.$("table thead tr th:not(:last-child)").on("touchmove mousemove", function (e) {
                if (pressed) {
                    let MINIMUM_WIDTH = 40;

                    /* Kích thước cột hiện tại được mượn/cho từ kích thước cột kế tiếp
                     * Điều kiện là cột hiện tại và cột kế tiếp luôn có kích thước tối thiểu nào đó
                     */
                    let additionalWidth = ((e.changedTouches === undefined) ? e.pageX : e.changedTouches[0].pageX) - startX;

                    if (additionalWidth > originalHeadingWidths[resizingIndex + 1] - MINIMUM_WIDTH) {
                        additionalWidth = originalHeadingWidths[resizingIndex + 1] - MINIMUM_WIDTH;
                    }
                    if (originalHeadingWidths[resizingIndex] + additionalWidth < MINIMUM_WIDTH) {
                        additionalWidth = MINIMUM_WIDTH - originalHeadingWidths[resizingIndex];
                    }

                    // Cập nhật kích thước cột hiện tại và cột kế tiếp
                    window.$(tableHeadings[resizingIndex]).width(originalHeadingWidths[resizingIndex] + additionalWidth);
                    window.$(tableHeadings[resizingIndex + 1]).width(originalHeadingWidths[resizingIndex + 1] - additionalWidth);

                    // Giữ nguyên kích thước các cột còn lại (Khi bảng có nhiều cột, resize 1 cột sẽ làm kích thước các cột khác sẽ bị ảnh hưởng)
                    for (let i = 0; i < tableHeadings.length; ++i) {
                        if (i !== resizingIndex && i !== resizingIndex + 1)
                            window.$(tableHeadings[i]).width(originalHeadingWidths[i]);
                    }
                }
            });

            window.$("table thead tr th:not(:last-child)").on("mouseup touchend", function () {
                if (pressed) {
                    window.$(tableHeadings[resizingIndex]).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }

    adjustSize = () => {
        let headings = window.$("table thead tr th");
        for (let i = 0; i < headings.length; ++i) {
            if (!window.$(headings[i]).hasClass("col-fixed")) { // RIêng cột có class col-fixed sẽ không xóa thuộc tính width
                window.$(headings[i]).width("");
            }
        }
    }

    componentDidUpdate() {
        this.handleResizeColumn();
        this.handleDataTable();
    }



    handleDataTable = async (index) => {
        let tables = window.$("table:not(.not-sort)");

        for (let i = 0; i < tables.length; ++i) {
            let table = window.$(tables[i]);
            let tableHeadings = table.find("th:not(:last-child)").not(".not-sort");
            let tableHeadingsColSort = table.find("th.col-sort").not(".not-sort");
            if (tableHeadingsColSort && tableHeadingsColSort.length) {
                for (let k = 0; k < tableHeadingsColSort.length; ++k) {
                    tableHeadings.push(tableHeadingsColSort[k])
                }
            }
            for (let j = 0; j < tableHeadings.length; ++j) {
                let th = window.$(tableHeadings[j]);

                if (th.find("div.sort").length < 1) {
                    let nonAccentVietnamese = (str) => {
                        str = str.toLowerCase();
                        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
                        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
                        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
                        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
                        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
                        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
                        str = str.replace(/đ/g, "d");
                        // Some system encode vietnamese combining accent as individual utf-8 characters
                        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
                        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
                        return str;
                    }

                    let convertDate = (str) => {
                        if (moment(str, 'DD-MM-YYYY', true).isValid()) {
                            str = str.split("-")
                            str = [str[2], str[1], str[0]].join("-")
                        }

                        if (moment(str, 'MM-YYYY', true).isValid()) {
                            str = str.split("-")
                            str = [str[1], str[0]].join("-")
                        }

                        if (moment(str, 'HH:mm DD-MM-YYYY', true).isValid()) {
                            let time = str.split(" ")
                            let date = time[1].split("-")
                            date = [date[2], date[1], date[0]].join("-")
                            str = date + " " + time[0]
                        }

                        if (moment(str, 'HH:mm:SS DD/MM/YYYY', true).isValid()) {
                            let time = str.split(" ")
                            let date = time[1].split("/")
                            date = [date[2], date[1], date[0]].join("-")
                            str = date + " " + time[0]
                        }
                        return str;
                    }


                    let sort = (ascOrder) => {
                        let rows = table.find("tbody>tr");
                        for (let k = 0; k < tableHeadings.length; ++k) {
                            if (k !== j) {
                                let thNotChoice = window.$(tableHeadings[k]);
                                let listdiv = thNotChoice.find("div.sort")
                                window.$(listdiv[0]).find("i.fa.fa-sort-amount-asc")[0].style.display = "none"
                                window.$(listdiv[0]).find("i.fa.fa-sort-amount-desc")[0].style.display = "none"
                                window.$(listdiv[0]).find("i.fa.fa-sort")[0].style.display = "block"
                            }
                            else {
                                let thNotChoice = window.$(tableHeadings[j]);
                                let listdiv = thNotChoice.find("div.sort")
                                if (ascOrder == true) {
                                    window.$(listdiv[0]).find("i.fa.fa-sort-amount-asc")[0].style.display = "block"
                                    window.$(listdiv[0]).find("i.fa.fa-sort")[0].style.display = "none"
                                } else if (ascOrder == false) {
                                    window.$(listdiv[0]).find("i.fa.fa-sort-amount-desc")[0].style.display = "block"
                                    window.$(listdiv[0]).find("i.fa.fa-sort-amount-asc")[0].style.display = "none"
                                } else {
                                    window.$(listdiv[0]).find("i.fa.fa-sort-amount-desc")[0].style.display = "none"
                                    window.$(listdiv[0]).find("i.fa.fa-sort")[0].style.display = "block"
                                }
                            }
                        }
                        if (th[0].className == "col-sort-number") {
                            rows.sort((a, b) => {
                                let keyA = parseInt(window.$(window.$(a).find("td")[j]).text());
                                let keyB = parseInt(window.$(window.$(b).find("td")[j]).text());
                                if (keyA < keyB) return ascOrder ? -1 : 1;
                                if (keyA > keyB) return ascOrder ? 1 : -1;
                                return 0;
                            });
                        } else {
                            rows.sort((a, b) => {
                                let keyA, keyB;
                                if (ascOrder == "return") {
                                    keyA = nonAccentVietnamese(window.$(window.$(a).find("td")[0]).text());
                                    keyB = nonAccentVietnamese(window.$(window.$(b).find("td")[0]).text());
                                } else {
                                    keyA = nonAccentVietnamese(window.$(window.$(a).find("td")[j]).text());
                                    keyB = nonAccentVietnamese(window.$(window.$(b).find("td")[j]).text());
                                }

                                keyA = convertDate(keyA);
                                keyB = convertDate(keyB);
                                if (keyA < keyB) return ascOrder ? -1 : 1;
                                if (keyA > keyB) return ascOrder ? 1 : -1;
                                return 0;
                            });
                        }

                        window.$.each(rows, function (index, row) {
                            table.children('tbody').append(row);
                        });
                    }

                    let filter = (data) => {
                        let rows = table.find("tbody>tr");
                        for (let k = 0; k < tableHeadings.length; ++k) {
                            if (k !== j) {
                                let thNotChoice = window.$(tableHeadings[k]);
                                let listdiv = thNotChoice.find("div.filter")
                                window.$(listdiv[0]).find("i.fa.fa-filter")[0].style.color = "rgb(226 222 222)"
                            } else {
                                let thNotChoice = window.$(tableHeadings[j]);
                                let listdiv = thNotChoice.find("div.filter")
                                if (data == "") {
                                    window.$(listdiv[0]).find("i.fa.fa-filter")[0].style.color = "rgb(226 222 222)"

                                } else {
                                    window.$(listdiv[0]).find("i.fa.fa-filter")[0].style.color = "black"
                                }
                            }
                        }

                        if (data == "") {
                            rows.map((a) => {
                                rows[a].style = ""
                            })
                        } else {
                            rows.map((a) => {
                                let keyData = window.$(window.$(rows[a]).find("td")[j]).text();
                                if (keyData.indexOf(data) == -1) {
                                    rows[a].style = "display: none"
                                } else {
                                    rows[a].style = ""
                                }
                            })
                        }

                        window.$.each(rows, function (index, row) {
                            table.children('tbody').append(row);
                        });
                    }
                    let up = window.$("<i>", { style: 'width: 100%; float: left; cursor: pointer; color: rgb(226 222 222) ', class: 'fa fa-sort' });
                    let down = window.$("<i>", { style: 'width: 100%; float: left; cursor: pointer; color: black; display: none ', class: 'fa fa-sort-amount-asc' });
                    let requestReturn = window.$("<i>", { style: 'width: 100%; float: left; cursor: pointer; color: black; display: none ', class: 'fa fa-sort-amount-desc' });
                    let filterData = window.$("<i>", { style: 'width: 100%; float: left; cursor: pointer; color: rgb(226 222 222) ', class: 'fa fa-filter' });
                    up.click(() => {
                        sort(true);
                    })

                    down.click(() => {
                        sort(false);
                    })

                    requestReturn.click(() => {
                        sort("return")
                    })


                    filterData.click(async () => {
                        const { value: text } = await Swal.fire({
                            input: 'text',
                            inputLabel: 'Message',
                            inputPlaceholder: 'Nhập thông tin tìm kiếm',
                            inputAttributes: {
                                'aria-label': 'Type your message here'
                            },
                            showCancelButton: true
                        })

                        filter(text);
                    })
                    let div = window.$("<div>", { style: 'float: left; margin-top: 3px; margin-right: 4px', class: 'sort' });
                    let divFilter = window.$("<div>", { style: 'float: left; margin-top: 3px; margin-right: 2px', class: 'filter' });
                    div.append(up, down, requestReturn, filterData);
                    divFilter.append(filterData)
                    th.prepend(div, divFilter);
                }
            }
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.adjustSize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.adjustSize);
    }

    render() {
        const { translate, pageName, arrPage, isLoading } = this.props;
        return (
            <React.Fragment>
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1> {pageName} &nbsp; {isLoading && <Loading />} </h1>

                        <ol className="breadcrumb">
                            {
                                arrPage !== undefined && arrPage.map(page =>
                                    <li key={page.name}>
                                        <a href={page.link}>
                                            <i className={page.icon} />
                                            {translate(`menu.${page.name}`)}
                                        </a>
                                    </li>)
                            }
                        </ol>
                    </section>
                    <section className="content">
                        {this.props.children}
                    </section>
                </div>
            </React.Fragment>
        );
    }
}
const mapState = state => state;

export default connect(mapState, null)(withTranslate(Content));