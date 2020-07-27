import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SelectBox } from './../../../../common-components/index';
import { withTranslate } from "react-redux-multilingual";
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
        const { id, info } = this.props;
        let { nameTask, description, responsible, accountable } = this.state;

        console.log('props from DEMO EDIT to FORM', this.props);
        return (
            <div>
                <form>
                    <div className="form-group" >
                        <label style={{ float: 'left' }}>Tên công việc</label>
                        <input type="text"
                            value={nameTask}
                            className="form-control" placeholder="Nhập tên công việc"
                            onChange={this.handleChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ float: 'left' }}>Mô tả</label>
                        <input type="text"
                            value={description}
                            className="form-control" placeholder="Mô tả công việc"
                            onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1" style={{ float: 'left' }} >Người thực hiện</label>
                        <SelectBox
                            id={`select-responsible-employee-${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                [
                                    { value: '1', text: 'Nguyen The Quang' },
                                    { value: '2', text: 'Nguyen The Gioi' },
                                    { value: '3', text: 'Nguyen The Ky' },
                                ]
                            }
                            onChange={this.handleChangeResponsible}
                            multiple={true}
                            value={responsible}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect2" style={{ float: 'left' }} >Người phê duyệt</label>
                        <SelectBox
                            id={`select-accountable-employee-${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                [
                                    { value: '4', text: 'Nguyen The Bon' },
                                    { value: '5', text: 'Nguyen The Nam' },
                                    { value: '6', text: 'Nguyen The Sau' },
                                ]
                            }
                            onChange={this.handleChangeAccountable}
                            multiple={true}
                            value={accountable}
                        />
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
    // getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
    // getDepartment: UserActions.getDepartmentOfUser,
    // _delete: taskTemplateActions._delete
};
const connectedFormInfoTask = connect(null, null)(withTranslate(FormInfoTask));
export { connectedFormInfoTask as FormInfoTask };
