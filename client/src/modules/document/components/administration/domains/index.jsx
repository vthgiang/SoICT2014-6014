import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import CreateForm from './createForm';
import EditForm from './editForm';
import './domains.css'
import Swal from 'sweetalert2';
import {Tree} from '../../../../../common-components';
import {convertArrayToTree} from '../../../../../helpers/arrayToTree';
class AdministrationDocumentDomains extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteNode: []
        }
    }

    componentDidMount(){
        this.props.getDocumentDomains();
    }

    onChanged = async (e, data) => {
        await this.setState({currentDomain: data.node})
        window.$(`#modal-edit-document-domain`).modal('show');
    }

    checkNode = (e, data) => { //chọn xóa một node và tất cả các node con của nó
        this.setState({
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    openDomainsTree = async () => {
        console.log("open tree");
    }

    deleteDomains = () => {
        const {translate} = this.props;
        const {deleteNode} = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.administration.domains.delete')}</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && deleteNode.length > 0) {
                this.props.deleteDocumentDomain(deleteNode, "many");
            }
        })
    }

    render() { 
        const {deleteNode} = this.state;
        const {translate, documents} = this.props;
        const {list, tree} = this.props.documents.administration.domains;
        const dataTree = list.map(node=>{
            return {
                ...node,
                text: node.name,
                parent: node.parent !== undefined ? node.parent.toString() : "#"
            }
        })

        return ( 
            <React.Fragment>
                <div>
                    <button className="btn btn-primary" style={{marginRight: '4px'}} onClick={this.openDomainsTree}>Mở cây</button>
                    {
                        deleteNode.length > 0 && <button className="btn btn-danger" onClick={this.deleteDomains}>Xóa</button>
                    }
                    <CreateForm domainParent={this.state.domainParent} changedDataTree={this.changedDataTree}/>
                </div>
                {
                    this.state.currentDomain !== undefined &&
                    <EditForm
                        domainId={this.state.currentDomain.id}
                        domainName={this.state.currentDomain.text}
                        domainDescription={this.state.currentDomain.description}
                        domainParent={this.state.currentDomain.parent}
                    />
                }
                <div style={{paddingTop: '10px'}}>
                    {
                        dataTree.length > 0 &&
                        <Tree 
                            id="document-domains-tree"
                            onChanged={this.onChanged} 
                            checkNode={this.checkNode}
                            unCheckNode={this.unCheckNode}
                            data={dataTree}
                        />
                    }
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentDomains: DocumentActions.getDocumentDomains,
    editDocumentDomain: DocumentActions.editDocumentDomain,
    deleteDocumentDomain: DocumentActions.deleteDocumentDomain,
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(AdministrationDocumentDomains) );