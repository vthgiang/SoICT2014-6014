import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManageUserTable from './ManageUserTable';

class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    render() { 
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <ManageUserTable/>
                </div>
            </div>
        );
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

    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/defindMultiSelect.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.handleResizeColumn();
    }

}
 
const mapStateToProps = state => state;

export default connect( mapStateToProps, null )( withTranslate(ManageUser) );
