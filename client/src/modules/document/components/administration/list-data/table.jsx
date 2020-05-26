import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox, DataTableSetting } from '../../../../../common-components';
import CreateForm from './createForm';
import { DocumentActions } from '../../../redux/actions';
import EditForm from './editForm';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getAllDocuments();
    }

    toggleEditDocument = async (data) => {
        await this.setState({
            currentRow: data
        });
        window.$('#modal-edit-document').modal('show');
    }

    render() { 
        const {translate} = this.props;
        const {list} = this.props.documents.administration.data;
        const {isLoading} = this.props.documents;
        const {currentRow} = this.state;
        return ( 
            <React.Fragment>
                <CreateForm/>
                <EditForm data={currentRow}/>
                <table className="table table-hover table-striped table-bordered" id="table-manage-document">
                    <thead>
                        <tr>
                            <th>{translate('document.name')}</th>
                            <th>{translate('document.description')}</th>
                            <th>{translate('document.created_at')}</th>
                            <th>{translate('document.apply_at')}</th>
                            <th>{translate('document.views')}</th>
                            <th>{translate('document.downloads')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('general.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('document.name'), 
                                        translate('document.description'), 
                                        translate('document.created_at'), 
                                        translate('document.apply_at'), 
                                        translate('document.views'), 
                                        translate('document.downloads')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    hideColumnOption = {true}
                                    tableId="table-manage-document"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.length > 0 ?
                            list.map(doc => 
                            <tr key={doc._id}>
                                <td>{doc.name}</td>
                                <td>{doc.description}</td>
                                <td>{doc.description}</td>
                                <td>{doc.description}</td>
                                <td>{doc.description}</td>
                                <td>{doc.description}</td>
                                <td>
                                    <a className="text-yellow" title={translate('document.edit')} onClick={()=>this.toggleEditDocument(doc)}><i className="material-icons">edit</i></a>
                                    <a className="text-red" title={translate('document.delete')}><i className="material-icons">delete</i></a>
                                </td>
                            </tr>):
                            isLoading ? 
                            <tr><td colSpan={7}>{translate('general.loading')}</td></tr>:<tr><td colSpan={7}>{translate('general.no_data')}</td></tr>
                        }
                        
                    </tbody>
                </table>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Table) );