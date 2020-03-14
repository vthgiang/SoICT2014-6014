import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer } from 'react-toastify';
import { DepartmentActions } from '../../../super-admin-management/manage-department/redux/actions';
import { RoleActions } from '../../../super-admin-management/manage-role/redux/actions';
import { UserActions } from '../../../super-admin-management/manage-user/redux/actions';
import { ModalEditDepartmentManage } from './ModalEditDepartmentManage';
class DepartmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handleResizeColumn()
    }
    componentDidMount() {
        this.props.getDepartment();
        this.props.getRole();
        this.props.getUser();

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
    componentDidUpdate() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/GridTableVers2.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    displayTreeView = (data, i) => {
        i = i + 1;
        if (data !== undefined) {
            if (typeof (data.children) === 'undefined') {
                return (
                    <tr key={data.id} data-id={data.id} data-parent={data.parent_id} data-level={i}>
                        <td data-column="name">{data.name}</td>
                        <td>{data.description}</td>
                        <td style={{ textAlign: 'center' }}><ModalEditDepartmentManage data={data} /></td>
                    </tr>
                )
            } else {
                return (
                    <React.Fragment key={data.id}>
                        <tr data-id={data.id} data-parent={data.parent_id} data-level={i}>
                            <td data-column="name">{data.name}</td>
                            <td>{data.description}</td>
                            <td style={{ textAlign: 'center' }}><ModalEditDepartmentManage data={data} /></td>
                        </tr>
                        {
                            data.children.map(tag => this.displayTreeView(tag, i))
                        }
                    </React.Fragment>
                )
            }

        }
        else return null
    }
    render() {
        const { tree } = this.props.department;
        console.log(tree);
        const { translate, department } = this.props;
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="box box-info">
                        {/* /.box-header */}
                        <div className="box-body">
                            <div className="col-md-12">
                                <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <div className="box-header col-md-6" style={{ paddingLeft: 0 }}>
                                        <h3 className="box-title">Danh sách các đơn vị:</h3>
                                    </div>
                                </div>
                                <table id="tree-table" className="table table-hover table-bordered">
                                    <thead>
                                        <tr id="task">
                                            <th style={{ width: "40%" }}>Tên đơn vị</th>
                                            <th style={{ width: "50" }} >Mô tả đơn vị</th>
                                            <th style={{ width: "10%" }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody id="taskTable" className="task-table">
                                        {
                                            tree !== null &&
                                            tree.map((tree, index) => this.displayTreeView(tree, 0))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* /.box-body */}
                    </div>
                    {/* /.box */}
                </div>
                <ToastContainer />
            </div >
        );
    };
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getRole: RoleActions.get,
    getUser: UserActions.get,
}
const departmentManage = connect(mapState, actionCreators)(DepartmentManage);

export { departmentManage as DepartmentManage };