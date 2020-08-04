import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SelectBox } from './../../../../common-components/index';
import { withTranslate } from "react-redux-multilingual";
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { UserActions } from '../../../super-admin/user/redux/actions';
class FormInfoTask extends Component {

    constructor(props) {
        super(props);
        let { info, id, listOrganizationalUnit } = this.props;
        this.state = {
            id: id,
            nameTask: (info && info.nameTask) ? info.nameTask : '',
            description: (info && info.description) ? info.description : '',
            organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : [],
            responsible: (info && info.responsible) ? info.responsible : [],
            accountable: (info && info.accountable) ? info.accountable : [],
            // listRoles: [...listOrganizationalUnit[0]?.deans, ...listOrganizationalUnit[0]?.viceDeans, ...listOrganizationalUnit[0]?.employees]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;
            // let listRoles = [...listOrganizationalUnit[0].deans, ...listOrganizationalUnit[0].viceDeans, ...listOrganizationalUnit[0].employees];
            this.setState(state => {
            //     if(info && info.organizationalUnit) {
            //         let { listOrganizationalUnit } = this.props
            //         listOrganizationalUnit.forEach(x => {
            //             if(x._id === info.organizationalUnit) {
            //                 listRoles = [...x.deans, ...x.viceDeans, ...x.employees];
            //             }
            //         })
            // }
            return {
                id: nextProps.id,
                nameTask: (info && info.nameTask) ? info.nameTask : '',
                description: (info && info.description) ? info.description : '',
                organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : [],
                responsible: (info && info.responsible) ? info.responsible : [],
                accountable: (info && info.accountable) ? info.accountable : [],
            }
        })
        return false;
        } else return true;
    }


    handleChangeName = (e) => {
        const { value } = e.target;
        this.setState({
            nameTask: value,
        })
        this.props.handleChangeName(value);
    }
    handleChangeDescription = (e) => {
        const { value } = e.target;
        this.setState({
            description: value,
        })
        this.props.handleChangeDescription(value);
    }
    handleChangeOrganizationalUnit = (value) => {
        this.setState({
            organizationalUnit: value[0],
        });
        this.props.handleChangeOrganizationalUnit(value[0])
    }
    handleChangeResponsible = (value) => {
        this.setState({
            responsible: value,
        })
        this.props.handleChangeResponsible(value);
    }
    handleChangeAccountable = (value) => {
        this.setState({
            accountable: value,
        })
        this.props.handleChangeAccountable(value);
    }

    render() {
        const { user, translate, role } = this.props;
        const { nameTask, description, responsible, accountable, organizationalUnit, } = this.state;
        const { id, info, action, listOrganizationalUnit, disabled } = this.props;
        let usersOfChildrenOrganizationalUnit;
        if (user && user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        console.log(info)
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);
        let listRoles = [];
        listOrganizationalUnit.forEach(x => {
            if (x._id === info?.organizationalUnit) {
                listRoles = [...x.deans, ...x.viceDeans, ...x.employees]
            }
        })
        let listItem = listRoles.map(x => {
            return { text: x.name, value: x._id }
        })
        return (
            <div>
                <form>
                    <div className="form-group" >
                        <label style={{ float: 'left' }}>Tên công việc</label>
                        <input type="text"
                            disabled={disabled}
                            value={nameTask}
                            className="form-control" placeholder="Nhập tên công việc"
                            onChange={this.handleChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ float: 'left' }}>Mô tả</label>
                        <input type="text"
                            disabled={disabled}
                            value={description}
                            className="form-control" placeholder="Mô tả công việc"
                            onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1" style={{ float: 'left' }} >Đơn vị</label>
                        {
                            <SelectBox
                                id={`select-organizationalUnit-employee-${id}-${action}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                // items={unitMembers}
                                multiple={false}
                                items={listOrganizationalUnit.map(x => { return { text: x.name, value: x._id } })}
                                onChange={this.handleChangeOrganizationalUnit}
                                value={organizationalUnit}
                                disabled={disabled}
                            />
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1" style={{ float: 'left' }} >Người thực hiện</label>
                        {
                            // unitMembers &&
                            <SelectBox
                                id={`select-responsible-employee-${id}-${action}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                // items={unitMembers}
                                items={listItem}
                                onChange={this.handleChangeResponsible}
                                multiple={true}
                                value={responsible}
                                disabled={disabled}
                            />
                        }
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect2" style={{ float: 'left' }} >Người phê duyệt</label>
                        {
                            // unitMembers &&
                            <SelectBox
                                id={`select-accountable-employee-${id}-${action}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                // items={unitMembers}
                                items={listItem}
                                onChange={this.handleChangeAccountable}
                                multiple={true}
                                value={accountable}
                                disabled={disabled}
                            />
                        }
                    </div>


                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect2" style={{ float: 'left' }} >Proceed Task</label>
                        {
                            // unitMembers &&
                            <SelectBox
                                id={`proceed-task-${id}-${action}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                // items={unitMembers}
                                items={listItem}
                                onChange={this.handleChangeAccountable}
                                multiple={true}
                                value={accountable}
                                disabled={disabled}
                            />
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect2" style={{ float: 'left' }} >Following Task</label>
                        {
                            // unitMembers &&
                            <SelectBox
                                id={`following-task-${id}-${action}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                // items={unitMembers}
                                items={listItem}
                                onChange={this.handleChangeAccountable}
                                multiple={true}
                                value={accountable}
                                disabled={disabled}
                            />
                        }
                    </div>
                    


                    <button className= 'btn btn-primary' onClick = {this.props.done}> Hoàn thành</button>
                </form>
            </div>
        );
    }
}


function mapState(state) {
    const { user, auth, role } = state;
    return { user, auth, role };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    // getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
};
const connectedFormInfoTask = connect(mapState, actionCreators)(withTranslate(FormInfoTask));
export { connectedFormInfoTask as FormInfoTask };
