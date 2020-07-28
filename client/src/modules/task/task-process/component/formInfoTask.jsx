import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SelectBox } from './../../../../common-components/index';
import { withTranslate } from "react-redux-multilingual";
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { UserActions } from '../../../super-admin/user/redux/actions';
class FormInfoTask extends Component {

    constructor(props) {
        super(props);
        let { info, id } = this.props;
        this.state = {
            id: id,
            nameTask: (info && info.nameTask) ? info.nameTask : '',
            description: (info && info.description) ? info.description : '',
            responsible: (info && info.responsible) ? info.responsible : [],
            accountable: (info && info.accountable) ? info.accountable : [],
        }
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextProps.info)
        console.log(this.props.info)
        if(nextProps.info !== this.props.info) {
            return true;
        }
        if (nextProps.id !== this.state.id) {
            let { info } = nextProps;
            this.setState(state => {
                return {
                    id: nextProps.id,
                    nameTask: (info && info.nameTask) ? info.nameTask : '',
                    description: (info && info.description) ? info.description : '',
                    responsible: (info && info.responsible) ? info.responsible : [],
                    accountable: (info && info.accountable) ? info.accountable : [],
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
        const { user, translate, disabled} = this.props;
        const { id, info } = this.props;
        let { nameTask, description, responsible, accountable } = this.state;

        let usersOfChildrenOrganizationalUnit;
        if (user && user.usersOfChildrenOrganizationalUnit) {
            usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit;
        }
        let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit);

        return (
            <div>
                <form>
                    <div className="form-group" >
                        <label style={{ float: 'left' }}>Tên công việc</label>
                        <input type="text"
                            disabled = {disabled}
                            value={nameTask}
                            className="form-control" placeholder="Nhập tên công việc"
                            onChange={this.handleChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ float: 'left' }}>Mô tả</label>
                        <input type="text"
                            disabled = {disabled}
                            value={description}
                            className="form-control" placeholder="Mô tả công việc"
                            onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1" style={{ float: 'left' }} >Người thực hiện</label>
                        {
                        // unitMembers &&
                            <SelectBox
                                id={`select-responsible-employee-${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={unitMembers}
                                onChange={this.handleChangeResponsible}
                                multiple={true}
                                value={responsible}
                            />
                        }
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect2" style={{ float: 'left' }} >Người phê duyệt</label>
                        { 
                        // unitMembers &&
                            <SelectBox
                                id={`select-accountable-employee-${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={unitMembers}
                                onChange={this.handleChangeAccountable}
                                multiple={true}
                                value={accountable}
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
    const { user, auth } = state;
    return { user, auth };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    // getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
};
const connectedFormInfoTask = connect(mapState, actionCreators)(withTranslate(FormInfoTask));
export { connectedFormInfoTask as FormInfoTask };
