import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import { ModalDialog, ModalButton } from '../../../../common-components';

class DepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.save = this.save.bind(this);
    }

    save = () => {
        console.log("parentrole:", this.refs.parent.value);
        return this.props.create({
            name: this.refs.name.value,
            description: this.refs.description.value,
            dean: this.refs.dean.value,
            vice_dean: this.refs.vice_dean.value,
            employee: this.refs.employee.value,
            parent: this.refs.parent.value
        });     
    }

    render() { 
        const { translate,department } = this.props;

        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-department" button_name={translate('manage_department.add')} title={translate('manage_department.add_title')}/>
                <ModalDialog
                    size="75" isLoading={department.isLoading}
                    modalID="modal-create-department"
                    formID="form-create-department"
                    title={translate('manage_department.add_title')}
                    msg_success={translate('manage_department.add_success')}
                    msg_faile={translate('manage_department.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-department">    
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><span>{ translate('manage_department.info') }</span></legend>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.name')  }<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" ref="name"/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.description') }<span className="attention"> * </span></label>
                                        <textarea type="text" className="form-control" ref="description"/><br/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('manage_department.parent') }</label>
                                        <select 
                                            className="form-control select2" 
                                            style={{width: '100%'}} 
                                            ref="parent">
                                                <option key={'noparent'} value={null}>{translate('manage_department.no_parent')}</option>
                                            {   
                                                department.list.map(department => 
                                                    <option key={department._id} value={department._id}>{department.name}</option>    
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
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateForm)); 
