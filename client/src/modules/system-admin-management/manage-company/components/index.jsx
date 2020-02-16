import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompanyTable from './CompanyTable';

class Company extends Component {
    componentDidMount() {
        // this.props.getDepartment(localStorage.getItem('id'));
        // this.props.getTaskTemplateByUser(localStorage.getItem('id'), 1, "[]");
        //get department of current user
        this.loadJSMultiSelect();
        let script = document.createElement('script');
        script.src = 'main/js/defindMultiSelect.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.handleResizeColumn();
    }

    constructor(props) {
        super(props);
        this.state = { 
         }
    }

    loadJSMultiSelect = () => {
        window.$(document).ready(function () {
            window.$('#multiSelectShowColumn').multiselect({
                buttonWidth: '160px',
                //   includeSelectAllOption : true,
                nonSelectedText: 'Chọn cột muốn ẩn'
            });
        });
    }

    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }

    render() { 
        console.log("manage company index")
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <CompanyTable/>
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, null )( Company );