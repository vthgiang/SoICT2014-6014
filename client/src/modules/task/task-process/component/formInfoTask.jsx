import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SelectBox } from './../../../../common-components/index';
import { withTranslate } from "react-redux-multilingual";
class FormInfoTask extends Component {

    render() { 
        console.log('props from DEMO EDIT to FORM', this.props);
        return (
            <div>
                <form>
                    <div className="form-group" >
                        <label style={{ float: 'left' }}>Tên công việc</label>
                        <input type="text"
                            value={(this.props.info[`${this.props.id}`] && this.props.info[`${this.props.id}`].nameTask) ? this.props.info[`${this.props.id}`].nameTask : ''}
                            className="form-control" placeholder="Nhập tên công việc"
                            onChange={this.props.handleChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ float: 'left' }}>Mô tả</label>
                        <input type="text" 
                            value={(this.props.info[`${this.props.id}`] && this.props.info[`${this.props.id}`].description) ? this.props.info[`${this.props.id}`].description : ''} 
                            className="form-control" placeholder="Mô tả công việc" 
                            onChange={this.props.handleChangeDescription} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1" style={{ float: 'left' }} >Người thực hiện</label>
                        <SelectBox
                            id={`select-responsible-employee-${this.props.id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                [
                                    { value: '1', text: 'Nguyen The Quang' },
                                    { value: '2', text: 'Nguyen The Gioi' },
                                    { value: '3', text: 'Nguyen The Ky' },
                                ]
                            }
                            onChange={this.props.handleChangeResponsible}
                            multiple={true}
                            value={(this.props.info[`${this.props.id}`] && this.props.info[`${this.props.id}`].responsible) ? this.props.info[`${this.props.id}`].responsible : []}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect2" style={{ float: 'left' }} >Người phê duyệt</label>
                        <SelectBox
                            id={`select-accountable-employee-${this.props.id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                [
                                    { value: '4', text: 'Nguyen The Bon' },
                                    { value: '5', text: 'Nguyen The Nam' },
                                    { value: '6', text: 'Nguyen The Sau' },
                                ]
                            }
                            onChange={this.props.handleChangeAccountable}
                            multiple={true}
                            value={(this.props.info[`${this.props.id}`] && this.props.info[`${this.props.id}`].accountable) ? this.props.info[`${this.props.id}`].accountable : [] }
                        />
                    </div>


                    <input type="button" className='btn btn-success' value='Gửi' onClick={this.props.save} />
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
const connectedFormInfoTask = connect(mapState, actionCreators)(withTranslate(FormInfoTask));
export { connectedFormInfoTask as FormInfoTask };
