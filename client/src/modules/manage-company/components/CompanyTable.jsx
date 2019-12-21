import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get as getCompanies } from '../redux/actions';
import CompanyEditForm from './CompanyEditForm';

class CompanyTable extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
        this.props.getCompanies();
    }

    render() { 
        console.log("TAO DANG RENDER")
        const { company } = this.props;
        return ( 
            <React.Fragment>
                <table className="table table-bordered table-hover" style={{ marginTop: '50px'}}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Short name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            company.list.length > 0 ?
                            <React.Fragment>
                                {
                                    company.list.map( com => 
                                        <tr key={ com._id }>
                                            <td>{ com.name }</td>
                                            <td>{ com.short_name }</td>
                                            <td>{ com.description }</td>
                                            <td>
                                                <CompanyEditForm
                                                    companyID={ com._id }
                                                    companyName={ com.name }
                                                    companyShortName={ com.short_name }
                                                    companyDescription={ com.description }
                                                />
                                            </td>
                                        </tr>    
                                    )
                                }
                            </React.Fragment> : 
                            <tr>
                                <td colSpan='2'>No data</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
        getCompanies: () => {
            console.log("THUC HIEN LAY DU LIEU CAC CONG TY");
            dispatch(getCompanies()); 
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( CompanyTable );