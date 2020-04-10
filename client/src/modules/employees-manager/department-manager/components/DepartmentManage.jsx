import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer } from 'react-toastify';
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { ModalEditDepartmentManage } from './ModalEditDepartmentManage';
import { TreeTable } from '../../../../common-components';

class DepartmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: ""
        }
    }
    componentDidMount() {
        this.props.getDepartment();
    }
    handleShowEdit = async (id) => {
        await this.setState({
            ...this.state,
            showEdit: id
        })
        window.$(`#modal-viewUnit-${id}`).modal('show');
        // var element = document.getElementsByTagName("BODY")[0];
        // element.classList.add("modal-open");
        // var modal = document.getElementById(`modal-viewUnit-${id}`);
        // modal.classList.add("in");
        // modal.style = "display: block";
    }
    render() {
        var data = [];
        const { translate } = this.props;
        var { list } = this.props.department;
        if (list.length !== 0) {
            data = list;
            for (let n in data) {
                data[n] = { ...data[n], action: ["edit"] }
            }
        }
        var column = [{ name: "Tên đơn vị", key: "name" }, { name: "Mô tả đơn vị", key: "description" }];
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-group">
                        <h4 className="box-title">Danh sách các đơn vị:</h4>
                    </div>
                    <TreeTable
                        nameClass="show-children"
                        column={column}
                        data={data}
                        titleAction={[{
                            edit: "Chỉnh sửa nhân viên các đơn vị",
                        }]}
                        funcEdit={this.handleShowEdit}
                    />
                </div>
                {
                    this.state.showEdit !== "" && <ModalEditDepartmentManage id={this.state.showEdit} />
                }
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
const departmentManage = connect(mapState, actionCreators)(withTranslate(DepartmentManage));

export { departmentManage as DepartmentManage };