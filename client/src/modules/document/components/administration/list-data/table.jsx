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
    }

    render() { 
        const {translate} = this.props;
        const {list} = this.props.documents.administration.listData;
        const {isLoading} = this.props.documents;
        if(this.props.documents.value)
            console.log("this.propfsdfsdfsdfsfsd.")
        return ( 
            <React.Fragment>
                <CreateForm/>
                <table className="table table-hover table-striped table-bordered" id="table-manage-document">
                    <thead>
                        <tr>
                            <th>{translate('document.name')}</th>
                            <th>{translate('document.description')}</th>
                            <th>{translate('document.createdAt')}</th>
                            <th>{translate('document.applyAt')}</th>
                            <th>{translate('document.views')}</th>
                            <th>{translate('document.downloads')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('general.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('document.name'), 
                                        translate('document.description'), 
                                        translate('document.createdAt'), 
                                        translate('document.applyAt'), 
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
                            list.map(docType => 
                            <tr key={docType._id}>
                                <td>{docType.name}</td>
                                <td>{docType.description}</td>
                                <td>
                                    <a className="text-yellow" title={translate('document.edit')}><i className="material-icons">edit</i></a>
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
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(Table) );