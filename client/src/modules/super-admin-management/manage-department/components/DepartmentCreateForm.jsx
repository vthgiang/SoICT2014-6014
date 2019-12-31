import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { create } from '../redux/actions';
import { reactLocalStorage } from 'reactjs-localstorage';

class DepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null,
            description: null,
            dean: null,
            vice_dean: null,
            employee: null,
            parent: null
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
        const com = reactLocalStorage.getObject('company');
        this.props.create({name, description, dean, vice_dean, employee, company: com._id, parent});
    }

    render() { 
        const { translate,department } = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-create-department">{ translate('manageDepartment.create') }</a>
                <div className="modal fade" id="modal-create-department">
                    <div className="modal-dialog" style={{ width: '96%'}}>
                        <div className="modal-content">
                            <div className="modal-header bg bg-green">
                                <h4 className="modal-title">{ translate('manageDepartment.create') }</h4>
                            </div>
                            <div className="modal-body">
                                <form style={{ marginBottom: '20px' }}>
                                    
                                    <div className="row">
                                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
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
                                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
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
                            <button type="button" className="btn btn-danger pull-left" data-dismiss="modal"> { translate('table.close') }</button>
                            <button type="button" className="btn btn-primary" onClick={ this.save } data-dismiss="modal"> { translate('table.save') }</button>
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
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateForm)); 