import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get as getCompanies } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import CompanyEditForm from './CompanyEditForm';
import CompanyCreateForm from './CompanyCreateForm';
import PaginateBar from '../../../../common-components/PaginateBar';
import ActionColumn from '../../../../common-components/ActionColumn';
import SearchBar from '../../../../common-components/SearchBar';

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
        const { company, translate } = this.props;

        return ( 
            <React.Fragment>
                <div class="row">
                    <SearchBar 
                        columns={[
                            { title: 'Name', name: 'name' },
                            { title: 'Short Name', name: 'short_name' },
                            { title: 'Description', name: 'description' },
                        ]}
                    />
                    <CompanyCreateForm/>
                </div>
                
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Short name</th>
                            <th>Description</th>
                            <th style={{ width: "120px" }}>
                                <ActionColumn columnName={ translate('table.action') }/>
                            </th>
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
                                                <a href="#abc" className="lock" title="Xóa mẫu công việc này"><i className="material-icons">lock</i></a>
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
                {/* Paginate Bar */}
                <PaginateBar pageTotal={50} currentPage={3}/>
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
            dispatch(getCompanies()); 
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CompanyTable));