import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox, DataTableSetting } from '../../../../../common-components';
import CreateForm from './createForm';
import { DocumentActions } from '../../../redux/actions';
import Swal from 'sweetalert2';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getDocumentCategories();
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

    render() { 
        const {translate} = this.props;
        const {list} = this.props.documents.administration.categories;
        const {isLoading} = this.props.documents;

        return ( 
            <React.Fragment>
                <CreateForm/>
                <table className="table table-hover table-striped table-bordered" id="table-manage-document-types">
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
                            list.length > 0 ?
                            list.map(docType => 
                            <tr key={docType._id}>
                                <td>{docType.name}</td>
                                <td>{docType.description}</td>
                                <td>
                                    <a className="text-yellow" title={translate('document.administration.categories.edit')}><i className="material-icons">edit</i></a>
                                    <a className="text-red" onClick={()=>this.deleteDocumentCategory(docType._id, docType.name)} title={translate('document.administration.categories.delete')}><i className="material-icons">delete</i></a>
                                </td>
                            </tr>):
                            isLoading ? 
                            <tr><td colSpan={3}>{translate('general.loading')}</td></tr>:<tr><td colSpan={3}>{translate('general.no_data')}</td></tr>
                        }
                        
                    </tbody>
                </table>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentCategories: DocumentActions.getDocumentCategories,
    deleteDocumentCategory: DocumentActions.deleteDocumentCategory
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Table) );