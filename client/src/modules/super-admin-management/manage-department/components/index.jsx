import React, { Component } from 'react';
import DepartmentTreeView from './DepartmentTreeView';
import DepartmentCreateForm from './DepartmentCreateForm';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get } from '../redux/actions';
// import DepartmentTable from './DepartmentTable';

class ManageDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.get();
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <DepartmentCreateForm/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <DepartmentTreeView/>
                    </div>
                    {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <DepartmentTable />
                    </div> */}
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        get: () => {
            dispatch(get());
        },
    }
}
 
export default connect(mapState, getState) (withTranslate(ManageDepartment)); 