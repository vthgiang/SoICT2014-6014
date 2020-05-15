import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox, DataTableSetting } from '../../../../../common-components';
import CreateForm from './createForm';
import { DocumentActions } from '../../../redux/actions';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getDocumentTypes();
    }

    render() { 
        const {translate} = this.props;
        const {list} = this.props.documents.administration.types;
        const {isLoading} = this.props.documents;

        return ( 
            <React.Fragment>
                <CreateForm/>
                <table className="table table-hover table-striped table-bordered" id="table-manage-document-types">
                    <thead>
                        <tr>
                            <th>{translate('document.administration.types.name')}</th>
                            <th>{translate('document.administration.types.description')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('general.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('document.administration.types.name'), 
                                        translate('document.administration.types.description')
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
                                    <a className="text-yellow" title={translate('document.administration.types.edit')}><i className="material-icons">edit</i></a>
                                    <a className="text-red" title={translate('document.administration.types.delete')}><i className="material-icons">delete</i></a>
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
    getDocumentTypes: DocumentActions.getDocumentTypes
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Table) );