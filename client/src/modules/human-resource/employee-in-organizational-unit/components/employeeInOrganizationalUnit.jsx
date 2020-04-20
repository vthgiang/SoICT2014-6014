import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { EmployeeInOrganizationalUnitEditForm } from './employeeInOrganizationalUnitEditForm';
import { TreeTable } from '../../../../common-components';

class DepartmentManage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getDepartment();
        this.props.getRole();
    }
    handleShowEdit = async (id) => {
        await this.setState({
            ...this.state,
            currentRow: id
        })
        window.$(`#modal-edit-unit`).modal('show');
    }
    render() {
        var data = [];
        const { translate, department } = this.props;
        if (department.list.length !== 0) {
            data = department.list;
            for (let n in data) {
                data[n] = { ...data[n], action: ["edit"] }
            }
        }
        var column = [{ name: translate('manage_department.name'), key: "name" }, { name: translate('manage_department.description'), key: "description" }];
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-group">
                        <h4 className="box-title">{translate('manage_unit.list_unit')}:</h4>
                    </div>
                    <TreeTable
                        behaviour="show-children"
                        column={column}
                        data={data}
                        titleAction={{
                            edit: translate('manage_unit.edit_unit'),
                        }}
                        funcEdit={this.handleShowEdit}
                    />
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <EmployeeInOrganizationalUnitEditForm
                        _id={this.state.currentRow}
                        department={department.list.filter(x => x._id === this.state.currentRow)}
                        role={this.props.role.list} />
                }
            </div >
        );
    };
}

function mapState(state) {
    const { role, department } = state;
    return { role, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getRole: RoleActions.get,
}
const departmentManage = connect(mapState, actionCreators)(withTranslate(DepartmentManage));

export { departmentManage as DepartmentManage };