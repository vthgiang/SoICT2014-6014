import React, { Component } from 'react';
import DepartmentTreeView from './DepartmentTreeView';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { get } from '../redux/actions';
import DepartmentTable from './DepartmentTable';

class ManageDepartment extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
   
    componentDidMount(){
        this.props.get();
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        let script2 = document.createElement('script');
        script2.src = '/lib/main/js/defindMultiSelect.js';
        script2.async = true;
        script2.defer = true;
        document.body.appendChild(script2);
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="box" style={{ minHeight: '450px' }}>
                    <div className="box-body">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <DepartmentTreeView/>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <DepartmentTable />
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
        get: () => {
            dispatch(get());
        },
    }
}
 
export default connect(mapState, getState) (withTranslate(ManageDepartment)); 
