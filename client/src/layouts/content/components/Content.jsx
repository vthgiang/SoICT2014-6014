import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Alert from '../../../modules/alert/components';

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

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                pressed = true;
                startX = e.pageX;

                let currentTH = window.$(this);
                window.$(currentTH).addClass("resizing");
                tableHeadings = window.$(currentTH)[0].parentNode.childNodes;

                // Find the index of resizing column
                for (let i = 0; i<tableHeadings.length; ++i) {
                    if (tableHeadings[i] === window.$(currentTH)[0]){
                        resizingIndex = i;
                        break;
                    }
                }

                // Save the current widths of all columns
                for (let i = 0; i<tableHeadings.length; ++i) {
                    originalHeadingWidths[i] = window.$(tableHeadings[i]).width()
                }
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    let MINIMUM_WIDTH = 40;

                    /* Kích thước cột hiện tại được mượn/cho từ kích thước cột kế tiếp
                     * Điều kiện là cột hiện tại và cột kế tiếp luôn có kích thước tối thiểu nào đó
                     */
                    let additionalWidth = e.pageX - startX;
                    if (additionalWidth > originalHeadingWidths[resizingIndex + 1] - MINIMUM_WIDTH) {
                        additionalWidth = originalHeadingWidths[resizingIndex + 1] - MINIMUM_WIDTH;
                    }
                    if (originalHeadingWidths[resizingIndex] + additionalWidth <MINIMUM_WIDTH){
                        additionalWidth = MINIMUM_WIDTH - originalHeadingWidths[resizingIndex];
                    }

                    // Cập nhật kích thước cột hiện tại và cột kế tiếp
                    window.$(tableHeadings[resizingIndex]).width(originalHeadingWidths[resizingIndex] + additionalWidth);
                    window.$(tableHeadings[resizingIndex + 1]).width(originalHeadingWidths[resizingIndex + 1] - additionalWidth);

                    // Giữ nguyên kích thước các cột còn lại (Khi bảng có nhiều cột, resize 1 cột sẽ làm kích thước các cột khác sẽ bị ảnh hưởng)
                    for (let i = 0; i<tableHeadings.length; ++i){
                        if (i !== resizingIndex && i !== resizingIndex + 1)
                            window.$(tableHeadings[i]).width(originalHeadingWidths[i]);
                    }
                }
            });

            window.addEventListener("resize", function(){
                // Xóa thuộc tính width (nếu đã) thiết lập, để khi resize window, kích thước các cột tự cập nhật lại theo default, tránh bị lỗi
                for (let i = 0; i<tableHeadings.length; ++i){
                    window.$(tableHeadings[i]).width("");
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(tableHeadings[resizingIndex]).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }

    componentDidUpdate() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/defindMultiSelect.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.handleResizeColumn();
    }

    render() {
        const { translate, pageName, arrPage } = this.props;
        
        return (
            <React.Fragment>
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1> {pageName} </h1>
                        <ol className="breadcrumb">
                            {
                                arrPage !== undefined && arrPage.map( page => 
                                    <li key={page.name}> 
                                        <a href={page.link}>
                                            <i className={ page.icon }/>
                                            { translate(`menu.${page.name}`) }
                                        </a>
                                    </li> )
                            }
                        </ol>
                    </section>
                    <section className="content">
                        <Alert/>
                        { this.props.children }
                    </section>
                </div>
            </React.Fragment>
        );
    }
}
const mapState = state => state;

export default connect(mapState, null)(withTranslate(Content));