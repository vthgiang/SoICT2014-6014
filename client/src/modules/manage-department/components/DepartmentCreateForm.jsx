import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
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

    }

    render() { 
        const { translate } = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-create-department">{ translate('manageDepartment.create') }</a>
                <div className="modal fade" id="modal-create-department">
                    <div className="modal-dialog modal-department">
                        <div className="modal-content">
                            <div className="modal-header bg bg-purple">
                                <h4 className="modal-title">{ translate('manageDepartment.create') }</h4>
                            </div>
                            <div className="modal-body">
                                <form style={{ marginBottom: '20px' }}>
                                    <div className="row">
                                        <div className="form-group col-sm-12">
                                            <label>{ translate('manageDepartment.nameDepartment')  }</label>
                                            <input type="text" className="form-control" name="name" onChange={ this.inputChange }/><br/>
                                        </div>
                                        <div className="form-group col-sm-12">
                                            <label>{ translate('manageDepartment.description') }</label>
                                            <textarea style={{ height: '200px'}} type="text" className="form-control" name="description" onChange={ this.inputChange }/><br/>
                                        </div>
                                        <div className="form-group col-sm-12">
                                            <label>{ translate('manageDepartment.dean') }</label>
                                            <input type="text" className="form-control" name="dean" onChange={ this.inputChange } placeholder={ translate('manageDepartment.sub_dean') }/><br/>
                                        </div> 
                                        <div className="form-group col-sm-12">
                                            <label>{ translate('manageDepartment.vicedean') }</label>
                                            <input type="text" className="form-control" name="vice_dean" onChange={ this.inputChange } placeholder={ translate('manageDepartment.sub_vicedean') }/><br/>
                                        </div>
                                        <div className="form-group col-sm-12">
                                            <label>{ translate('manageDepartment.employee') }</label>
                                            <input type="text" className="form-control" name="employee" onChange={ this.inputChange } placeholder={ translate('manageDepartment.sub_employee') }/><br/>
                                        </div>
                                        <div className="form-group col-sm-12">
                                            <label>{ translate('manageDepartment.departmentParent') }</label>
                                            {/* <select 
                                                className="form-control" 
                                                style={{width: '100%'}} 
                                                name="parent" 
                                                onChange={inputChange}>
                                                    <option disabled>{ translate('manageDepartment.selectDepartment') }</option>
                                                {   
                                                    parent !== undefined &&
                                                    parent.map(department => 
                                                        <option key={department._id} value={department._id}>{department.name}</option>    
                                                    )
                                                }
                                            </select> */}
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
        // getLinks: () => {
        //     dispatch(get());
        // },
    }
}
 
export default connect(mapState, getState) (withTranslate(DepartmentCreateForm)); 