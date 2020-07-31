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
        console.log(listOrganizationalUnit)
        this.state = {
            id: id,
            nameTask: (info && info.nameTask) ? info.nameTask : '',
            description: (info && info.description) ? info.description : '',
            organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : listOrganizationalUnit[0]._id,
            responsible: (info && info.responsible) ? info.responsible : [],
            accountable: (info && info.accountable) ? info.accountable : [],
            listRoles: [...listOrganizationalUnit[0]?.deans, ...listOrganizationalUnit[0]?.viceDeans, ...listOrganizationalUnit[0]?.employees]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log(nextProps.info)
        // console.log(this.props.info)
        // if(nextProps.info !== this.props.info) {
        //     return true;
        // }
        if (nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;
            let listRoles = [...listOrganizationalUnit[0].deans, ...listOrganizationalUnit[0].viceDeans, ...listOrganizationalUnit[0].employees];
            this.setState(state => {
                if(info && info.organizationalUnit) {
                    let { listOrganizationalUnit } = this.props
                    listOrganizationalUnit.forEach(x => {
                        if(x._id === info.organizationalUnit) {
                            listRoles = [...x.deans, ...x.viceDeans, ...x.employees];
                        }
                    })

                }
                return {
                    id: nextProps.id,
                    nameTask: (info && info.nameTask) ? info.nameTask : '',
                    description: (info && info.description) ? info.description : '',
                    organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : listOrganizationalUnit[0]._id,
                    responsible: (info && info.responsible) ? info.responsible : [],
                    accountable: (info && info.accountable) ? info.accountable : [],
                    listRoles: listRoles,
                }
            })
            return false;
        }
        else return true;
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
        let { listOrganizationalUnit } = this.props
        listOrganizationalUnit.forEach(x => {
            if(x._id === value[0]) {
                this.setState({
                    organizationalUnit: value,
                    listRoles: [...x.deans, ...x.viceDeans, ...x.employees]
                });
            }
        })
        
        this.props.handleChangeOrganizationalUnit(value)
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
        const { nameTask, description, responsible, accountable, organizationalUnit, listRoles } = this.state;
        const { id, info, action, listOrganizationalUnit, disabled } = this.props;
        console.log(this.state)
        let usersOfChildrenOrganizationalUnit;
        if (user && user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);


        let listRole = [];
        if (role && role.list.length !== 0) listRole = role.list;
        let listItem = listRoles.map(item => { return { text: item.name, value: item._id } });
        let listOrganizationalUnit1 = listOrganizationalUnit.map(x => { return { text: x.name, value: x._id } })

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
                                items={listOrganizationalUnit1}
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


                    {/* <input type="button" className='btn btn-success' value='Gửi' onClick={this.props.save} /> */}
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
