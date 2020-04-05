import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import { ModalDialog } from '../../../../common-components';

class DepartmentCreateWithParent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            description: '',
            dean: '',
            vice_dean: '',
            employee: '',
            parent: this.props.parentId
         }
        this.save = this.save.bind(this);
    }

    save = () => {

        return this.props.create({
            name: this.refs.name.value, 
            description: this.refs.description.value, 
            dean: this.refs.dean.value, 
            vice_dean: this.refs.vice_dean.value, 
            employee: this.refs.employee.value, 
            parent: this.props.parentId
        });
    }

    render() { 
        const { translate, department, parentId } = this.props;

        return ( 
            <React.Fragment>
                <ModalDialog
                    size="75" isLoading={department.isLoading}
                    modalID={`modal-create-department-${parentId}`}
                    formID={`form-create-department-${parentId}`}
                    title={translate('manage_department.add_title')}
                    msg_success={translate('manage_department.add_success')}
                    msg_faile={translate('manage_department.add_faile')}
                    func={this.save}
                >
                    <form id={`form-create-department-${parentId}`}>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><span>{ translate('manage_department.info') }</span></legend>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="name"/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.description') }<span className="attention"> * </span></label>
                                        <textarea type="text" style={{height: '54px'}} className="form-control" ref="description"/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.parent') }</label>
                                        <select 
                                            className="form-control" 
                                            style={{width: '100%'}} 
                                            ref="parent" 
                                            defaultValue={parentId}
                                            disabled
                                            >
                                                <option key="select-parent">---{ translate('manage_department.select_parent') }---</option>
                                            {   
                                                department.list.map(department => 
                                                    <option key={`department-${department._id}`} value={department._id}>{department.name}</option>    
                                                )
                                            }
                                        </select>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><span>{ translate('manage_department.roles_of_department') }</span></legend>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="dean" placeholder={ translate('manage_department.dean_example') }/><br/>
                                    </div> 
                                    <div className="form-group">
                                        <label>{ translate('manage_department.vice_dean_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="vice_dean" placeholder={ translate('manage_department.vice_dean_example') }/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.employee_name') }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="employee" placeholder={ translate('manage_department.employee_example') }/><br/>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}

const mapState = state => state;
const getState = {
    create: DepartmentActions.create
}
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateWithParent)); 
