import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SelectBox } from './../../../../common-components/index';
import { withTranslate } from "react-redux-multilingual";
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../../task-template/redux/actions';
class FormInfoTask extends Component {

    constructor(props) {
        super(props);
        let { info, id, listOrganizationalUnit } = this.props;
        this.state = {
            id: id,
            nameTask: (info && info.nameTask) ? info.nameTask : '',
            description: (info && info.description) ? info.description : '',
            organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : [],
            taskTemplate: (info && info.taskTemplate) ? info.taskTemplate : "",
            responsible: (info && info.responsible) ? info.responsible : [],
            accountable: (info && info.accountable) ? info.accountable : [],
            // listRoles: [...listOrganizationalUnit[0]?.deans, ...listOrganizationalUnit[0]?.viceDeans, ...listOrganizationalUnit[0]?.employees]
        }
    }

    componentDidMount() {
        this.props.getTaskTemplateByUser("1", "0", "[]");
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id) {
            let { info, listOrganizationalUnit } = nextProps;
            this.setState(state => {
                return {
                    id: nextProps.id,
                    nameTask: (info && info.nameTask) ? info.nameTask : '',
                    description: (info && info.description) ? info.description : '',
                    organizationalUnit: (info && info.organizationalUnit) ? info.organizationalUnit : [],
                    taskTemplate: (info && info.taskTemplate) ? info.taskTemplate : "",
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
    handleChangeTemplate = (value) => {
        this.setState({
            taskTemplate: value[0],
        });
        this.props.handleChangeTemplate(value[0])
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
        const { user, translate, role, tasktemplates } = this.props;
        const { nameTask, description, responsible, accountable, organizationalUnit, taskTemplate} = this.state;
        const { id, info, action, listOrganizationalUnit, disabled } = this.props;
        let usersOfChildrenOrganizationalUnit, listTaskTemplate;
        if (user && user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        // console.log(info)
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

        if (tasktemplates.items && organizationalUnit) {
            listTaskTemplate = tasktemplates.items.filter(function (taskTemplate) {
                return taskTemplate.organizationalUnit._id === organizationalUnit;
            });
        }
        // list template
        let listTemp = [{value: "", text: "--Chọn mẫu công việc--" }];
        if (listTaskTemplate && listTaskTemplate.length !== 0) {
            listTaskTemplate.map(item => {
                listTemp.push({ value: item._id, text: item.name })
            })
        }

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
                    {(listTaskTemplate && listTaskTemplate.length !== 0) &&
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1" style={{ float: 'left' }} >Mẫu công việc</label>
                        {
                            <SelectBox
                                id={`select-template-employee-${id}-${action}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                multiple={false}
                                items={listTemp}
                                onChange={this.handleChangeTemplate}
                                value={taskTemplate}
                                disabled={disabled}
                            />
                        }
                    </div>
                    }
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
    const { user, auth, role, tasktemplates } = state;
    return { user, auth, role, tasktemplates };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    // getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
};
const connectedFormInfoTask = connect(mapState, actionCreators)(withTranslate(FormInfoTask));
export { connectedFormInfoTask as FormInfoTask };
