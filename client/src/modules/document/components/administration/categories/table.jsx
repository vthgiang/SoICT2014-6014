import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SearchBar, DataTableSetting, PaginateBar } from '../../../../../common-components';
import CreateForm from './createForm';
import { DocumentActions } from '../../../redux/actions';
import Swal from 'sweetalert2';
import EditForm from './editForm';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = { option: 'name', value: '', limit: 5, page: 1 }
    }

    componentDidMount(){
        this.props.getDocumentCategories();
        this.props.getDocumentCategories({page: this.state.page, limit: this.state.limit});
    }

    
    deleteDocumentCategory = (id, info) => {
        const {translate} = this.props;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.administration.categories.delete')}</div> <div>"${info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                this.props.deleteDocumentCategory(id);
            }
        })
    }

    showModalEditCategory = async (currentRow) => {
        await this.setState({currentRow});
        window.$('#modal-edit-document-category').modal('show');
    }

    render() { 
        const {translate} = this.props;
        const {categories} = this.props.documents.administration;
        const {paginate} = categories;
        const {isLoading} = this.props.documents;
        const {currentRow} = this.state;

        return ( 
            <React.Fragment>
                <CreateForm/>
                {
                    currentRow !== undefined &&
                    <EditForm
                        categoryId={currentRow._id}
                        categoryName={currentRow.name}
                        categoryDescription={currentRow.description}
                    />
                }
                <SearchBar 
                    columns={[
                        { title: translate('document.administration.categories.name'), value: 'name' },
                        { title: translate('document.administration.categories.description'), value: 'description' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                <table className="table table-hover table-striped table-bordered" id="table-manage-document-categories">
                    <thead>
                        <tr>
                            <th>{translate('document.administration.categories.name')}</th>
                            <th>{translate('document.administration.categories.description')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('general.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('document.administration.categories.name'), 
                                        translate('document.administration.categories.description')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    hideColumnOption = {true}
                                    tableId="table-manage-document-types"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            paginate.length > 0 ?
                            paginate.map(docType => 
                            <tr key={docType._id}>
                                <td>{docType.name}</td>
                                <td>{docType.description}</td>
                                <td>
                                    <a className="text-yellow" onClick={()=>this.showModalEditCategory(docType)} title={translate('document.administration.categories.edit')}><i className="material-icons">edit</i></a>
                                    <a className="text-red" onClick={()=>this.deleteDocumentCategory(docType._id, docType.name)} title={translate('document.administration.categories.delete')}><i className="material-icons">delete</i></a>
                                </td>
                            </tr>):
                            isLoading ? 
                            <tr><td colSpan={3}>{translate('general.loading')}</td></tr>:<tr><td colSpan={3}>{translate('general.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                <PaginateBar pageTotal={categories.totalPages} currentPage={categories.page} func={this.setPage}/> 
            </React.Fragment>
         );
    }

    
    setPage = async(page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getDocumentCategories(data);
    }

    setLimit = (number) => {
        if (this.state.limit !== number){
            this.setState({ limit: number });
            const data = { limit: number, page: this.state.page };
            this.props.getDocumentCategories(data);
        }
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }
    
    searchWithOption = async() => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.getDocumentCategories(data);
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentCategories: DocumentActions.getDocumentCategories,
    deleteDocumentCategory: DocumentActions.deleteDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Table) );