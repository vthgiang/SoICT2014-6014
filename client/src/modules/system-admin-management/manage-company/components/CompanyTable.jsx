import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CompanyActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import CompanyEditForm from './CompanyEditForm';
import CompanyCreateForm from './CompanyCreateForm';
import { PaginateBar, ActionColumn, SearchBar } from '../../../../common-components';
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

    
    toggle = (id, data, title, name, btnNo, btnYes, value) => {
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
                    name: data.name,
                    short_name: data.short_name,
                    description: data.description,
                    log: value ? data.log : value,
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
                            { title: translate('manage_company.name'), value: 'name' },
                            { title: translate('manage_company.short_name'), value: 'short_name' },
                            { title: translate('manage_company.description'), value: 'description' },
                        ]}
                        option={this.state.option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <CompanyCreateForm/>
                    </div>
                </div>
                
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>{translate('manage_company.name')}</th>
                            <th>{translate('manage_company.short_name')}</th>
                            <th>{translate('manage_company.description')}</th>
                            <th style={{ width: "140px"}}>{translate('manage_company.log')}</th>
                            <th style={{ width: "120px", textAlign: 'center' }}>
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
                                        <tr 
                                            key={ com._id } 
                                            className={com.active ? "bg bg-white" : "bg bg-gray"}
                                        >
                                            <td>{ com.name }</td>
                                            <td>{ com.short_name }</td>
                                            <td>{ com.description }</td>
                                            <td>{ com.log ? <p><i className="fa fa-circle text-success" /> {translate('manage_company.on')} </p> : <p><i className="fa fa-circle text-danger" /> {translate('manage_company.off')} </p>}</td>
                                            <td style={{ textAlign: 'center'}}>
                                                <CompanyEditForm
                                                    companyID={ com._id }
                                                    companyName={ com.name }
                                                    companyShortName={ com.short_name }
                                                    comLog={com.log}
                                                    companyDescription={ com.description }
                                                />
                                                {
                                                    com.active === true ?
                                                    <a 
                                                        href="#abc" 
                                                        title={translate('manage_company.turning_on')}
                                                        onClick={() => this.toggle(
                                                            com._id, 
                                                            {
                                                                name: com.name,
                                                                description: com.description,
                                                                short_name: com.short_name,
                                                                log: com.log
                                                            },
                                                            translate('manage_company.off_service'), 
                                                            com.name, translate('confirm.no'), 
                                                            translate('confirm.yes'), 
                                                            false
                                                        )}
                                                    ><i className="material-icons">lock_open</i></a> :
                                                    <a 
                                                        href="#abc"
                                                        title={translate('manage_company.turning_on')}
                                                        onClick={() => this.toggle(
                                                            com._id, 
                                                            {
                                                                name: com.name,
                                                                description: com.description,
                                                                short_name: com.short_name,
                                                                log: com.log
                                                            },
                                                            translate('manage_company.on_service'), 
                                                            com.name, translate('confirm.no'), 
                                                            translate('confirm.yes'), 
                                                            true
                                                        )}
                                                    ><i className="material-icons">lock</i></a>
                                                }
                                            </td>
                                        </tr>    
                                    )
                                }
                            </React.Fragment> : 
                            <tr>
                                <td colSpan='5'>{translate('confirm.no_data')}</td>
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
