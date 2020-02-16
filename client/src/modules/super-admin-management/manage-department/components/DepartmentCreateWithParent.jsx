import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { create } from '../redux/actions';

class DepartmentCreateWithParent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null,
            description: null,
            dean: null,
            vice_dean: null,
            employee: null,
            parent: this.props.parentId
         }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save = (e) => {
        const { name, description, dean, vice_dean, employee, parent } = this.state;
        this.props.create({name, description, dean, vice_dean, employee, parent});
    }

    render() { 
        const { translate, department, parentId } = this.props;
        return ( 
            <React.Fragment>
                <div className="modal modal-full fade" id={`modal-create-department-with-parent-${parentId}`}>
                    <div className="modal-dialog-full">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">{ translate('manageDepartment.create') }</h4>
                            </div>
                            <div className="modal-body">
                                <form style={{ marginTop: '50px', marginBottom: '20px' }}>
                                    
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border">{ translate('manageDepartment.info') }</legend>
                                                <div className="form-group">
                                                    <label>{ translate('manageDepartment.nameDepartment')  }</label>
                                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange }/><br/>
                                                </div>
                                                <div className="form-group">
                                                    <label>{ translate('manageDepartment.description') }</label>
                                                    <textarea type="text" className="form-control" name="description" onChange={ this.inputChange }/><br/>
                                                </div>
                                                <div className="form-group">
                                                    <label>{ translate('manageDepartment.departmentParent') }</label>
                                                    <select 
                                                        className="form-control" 
                                                        style={{width: '100%'}} 
                                                        name="parent" 
                                                        value={ parentId    }
                                                        onChange={this.inputChange}>
                                                            <option>{ translate('manageDepartment.selectDepartment') }</option>
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
                                                <legend className="scheduler-border">{ translate('manageDepartment.rolesOfDepartment') }</legend>
                                                <div className="form-group">
                                                    <label>{ translate('manageDepartment.dean') }</label>
                                                    <input type="text" className="form-control" name="dean" onChange={ this.inputChange } placeholder={ translate('manageDepartment.sub_dean') }/><br/>
                                                </div> 
                                                <div className="form-group">
                                                    <label>{ translate('manageDepartment.vicedean') }</label>
                                                    <input type="text" className="form-control" name="vice_dean" onChange={ this.inputChange } placeholder={ translate('manageDepartment.sub_vicedean') }/><br/>
                                                </div>
                                                <div className="form-group">
                                                    <label>{ translate('manageDepartment.employee') }</label>
                                                    <input type="text" className="form-control" name="employee" onChange={ this.inputChange } placeholder={ translate('manageDepartment.sub_employee') }/><br/>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default pull-right" style={{ marginRight: '8px' }} data-dismiss="modal"> { translate('table.close') }</button>
                                <button type="button" className="btn btn-primary" onClick={ this.save } style={{ marginRight: '8px' }} data-dismiss="modal"> { translate('table.save') }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}

const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        create: (data) => {
            dispatch(create(data));
        },
    }
}
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateWithParent)); 
