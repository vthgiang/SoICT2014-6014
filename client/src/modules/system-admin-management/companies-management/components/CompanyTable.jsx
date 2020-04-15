import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CompanyActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import CompanyEditForm from './CompanyEditForm';
import CompanyCreateForm from './CompanyCreateForm';
import { PaginateBar, ActionColumn, SearchBar } from '../../../../common-components';
import Swal from 'sweetalert2';
import { LinkDefaultActions } from '../../links-default-management/redux/actions';
import { ComponentDefaultActions } from '../../components-default-management/redux/actions';

class CompanyTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: { $regex: '', $options: 'i' }
        }
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

    handleEdit = async (company) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: company
            }
        });
        await window.$('#modal-edit-company').modal('show');
        await this.props.linksList(company._id);
        await this.props.linksPaginate(company._id, 1, 5);
        await this.props.componentsList(company._id);
        await this.props.componentsPaginate(company._id, 1, 5);
    }

    componentDidMount(){
        this.props.get();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
        this.props.getLinksDefault();
        this.props.getComponentsDefault();
    }

    render() { 
        const { company, translate } = this.props;
        const { currentRow } = this.state;
        
        return ( 
            <React.Fragment>
                <CompanyCreateForm/>
                {
                    currentRow !== undefined &&
                    <CompanyEditForm
                        companyId={ currentRow._id }
                        companyName={ currentRow.name }
                        companyShortName={ currentRow.short_name }
                        companyLog={currentRow.log}
                        companyDescription={ currentRow.description }
                        companyLinks={currentRow.links}
                        companyEmail={currentRow.super_admin !== undefined ? currentRow.super_admin.email : 'Chưa xác định'}
                        companyActive={currentRow.active}
                    />
                }
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
                
                <table className="table table-hover table-striped table-bordered" id="company-table">
                    <thead>
                        <tr>
                            <th>{translate('manage_company.name')}</th>
                            <th>{translate('manage_company.short_name')}</th>
                            <th>{translate('manage_company.description')}</th>
                            <th style={{ width: "130px"}}>{translate('manage_company.log')}</th>
                            <th style={{ width: "130px"}}>{translate('manage_company.service')}</th>
                            <th style={{ width: "120px", textAlign: 'center' }}>
                                {translate('table.action')}
                                <ActionColumn 
                                    tableId="company-table"
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
                                            <td>{ com.log ? <p><i className="fa fa-circle text-success" style={{fontSize: "1em", marginRight: "0.25em"}} /> {translate('manage_company.on')} </p> : <p><i className="fa fa-circle text-danger" /> {translate('manage_company.off')} </p>}</td>
                                            <td>{ com.active ? <p><i className="fa fa-circle text-success" style={{fontSize: "1em", marginRight: "0.25em"}} /> {translate('manage_company.on')} </p> : <p><i className="fa fa-circle text-danger" /> {translate('manage_company.off')} </p>}</td>
                                            <td style={{ textAlign: 'center'}}>
                                                <a onClick={() => this.handleEdit(com)} className="edit text-yellow" style={{width: '5px'}} title={translate('manage_company.edit')}><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>    
                                    )
                                }
                            </React.Fragment> : company.isLoading ?
                            <tr><td colSpan='6'>{translate('confirm.loading')}</td></tr>:
                            <tr><td colSpan='6'>{translate('confirm.no_data')}</td></tr>
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
    getPaginate: CompanyActions.getPaginate,
    getLinksDefault: LinkDefaultActions.get,
    getComponentsDefault: ComponentDefaultActions.get,
    linksList: CompanyActions.linksList,
    linksPaginate: CompanyActions.linksPaginate,
    componentsList: CompanyActions.componentsList,
    componentsPaginate: CompanyActions.componentsPaginate
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CompanyTable));
