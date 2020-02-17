import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CompanyActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import CompanyEditForm from './CompanyEditForm';
import CompanyCreateForm from './CompanyCreateForm';
import PaginateBar from '../../../../common-components/PaginateBar';
import ActionColumn from '../../../../common-components/ActionColumn';
import SearchBar from '../../../../common-components/SearchBar';
import Swal from 'sweetalert2';

class CompanyTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: null
        }

        this.inputChange = this.inputChange.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setOption = this.setOption.bind(this);
        this.searchWithOption = this.searchWithOption.bind(this);
        this.setLimit = this.setLimit.bind(this);
    }

    
    toggle = (id, title, name, btnNo, btnYes, value) => {
        Swal.fire({
            title: title,
            html: `<h4>${name}</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: btnNo,
            confirmButtonText: btnYes
        }).then((result) => {
            if (result.value) {
                this.props.edit(id, {
                    name: null,
                    short_name: null,
                    description: null,
                    active: value
                });
            }
        })
    }

    componentDidMount(){
        this.props.get();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
    }

    render() { 
        const { company, translate } = this.props;
        
        return ( 
            <React.Fragment>
                <div className="row">
                    <SearchBar 
                        columns={[
                            { title: translate('table.name'), value: 'name' },
                            { title: translate('table.shortName'), value: 'short_name' },
                            { title: translate('table.description'), value: 'description' },
                        ]}
                        option={this.state.option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <CompanyCreateForm/>
                </div>
                
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('table.name')}</th>
                            <th>{translate('table.shortName')}</th>
                            <th>{translate('table.description')}</th>
                            <th style={{ width: "120px" }}>
                                <ActionColumn 
                                    columnName={translate('table.action')} 
                                    hideColumn={false}
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            company.listPaginate.length > 0 ?
                            <React.Fragment>
                                {
                                    company.listPaginate.map( com => 
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
                                                {
                                                    com.active === true ?
                                                    <a 
                                                        href="#abc" 
                                                        title="Đang bật dịch vụ"
                                                        onClick={() => this.toggle(com._id, "Tắt cung cấp dịch vụ?", com.name, translate('question.no'), translate('question.yes'), false)}
                                                    ><i className="material-icons">lock_open</i></a> :
                                                    <a 
                                                        href="#abc"
                                                        title="Đang tắt dịch vụ"
                                                        onClick={() => this.toggle(com._id, "Bật cung cấp dịch vụ", com.name, translate('question.no'), translate('question.yes'), true)}
                                                    ><i className="material-icons">lock</i></a>
                                                }
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
                <PaginateBar pageTotal={company.totalPages} currentPage={company.page} func={this.setPage}/>
            </React.Fragment>
         );
    }
    
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async() => {
        const data = {
            limit: this.state.limit,
            page: 1
        };
        data[this.state.option] = this.state.value;
        await this.props.getPaginate(data);
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }
    
    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }
    
    setLimit = (number) => {
        this.setState({ limit: number });
        const data = { limit: number, page: this.state.page };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    get: CompanyActions.get,
    edit: CompanyActions.edit,
    getPaginate: CompanyActions.getPaginate
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CompanyTable));