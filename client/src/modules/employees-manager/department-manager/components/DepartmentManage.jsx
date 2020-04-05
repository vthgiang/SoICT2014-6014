import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer } from 'react-toastify';
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { ModalEditDepartmentManage } from './ModalEditDepartmentManage';
class DepartmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.loadJS = this.loadJS.bind(this);
    }
    componentDidMount() {
        this.props.getDepartment();
    }
    componentDidUpdate() {
        this.loadJS();
    }
    loadJS() {
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
        const { translate } = this.props;
        return (
            <div className="box" id="qlcv">
                <div className="box-body">
                    <div className="form-group">
                        <h4 className="box-title">Danh sách các đơn vị:</h4>
                    </div>
                    <table id="tree-table" className="table table-striped table-hover table-bordered">
                        <thead>
                            <tr id="task">
                                <th style={{ width: "40%" }}>Tên đơn vị</th>
                                <th style={{ width: "50" }} >Mô tả đơn vị</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
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
                <ToastContainer />
            </div >
        );
    };
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
}
const departmentManage = connect(mapState, actionCreators)(DepartmentManage);

export { departmentManage as DepartmentManage };