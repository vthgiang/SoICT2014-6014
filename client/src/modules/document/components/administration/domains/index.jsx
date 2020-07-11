import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import CreateForm from './createForm';
import EditForm from './editForm';
import './domains.css'
import Swal from 'sweetalert2';
import { Tree, SlimScroll} from '../../../../../common-components';
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
        console.log("CLICK NODE TREE - data", data)
        await this.setState({currentDomain: data.node})
        window.$(`#edit-document-domain`).slideDown();;
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
                this.setState({
                    deleteNode: []
                });
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
                state : {"opened" : true },
                parent: node.parent !== undefined ? node.parent.toString() : "#"
            }
        })
        console.log("edit choice: ", this.state)

        return ( 
            <React.Fragment>
                <button className="btn btn-success" onClick={()=>{
                    window.$('#modal-create-document-domain').modal('show');
                }} title={translate('document.administration.domains.add')}>{translate('general.add')}</button>
                {
                    deleteNode.length > 0 && <button className="btn btn-danger" style={{marginLeft: '5px'}} onClick={this.deleteDomains}>Xóa</button>
                }
                <CreateForm/>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        <div className="domain-tree" id="domain-tree">
                            <Tree 
                                id="tree-qlcv-document"
                                onChanged={this.onChanged} 
                                checkNode={this.checkNode}
                                unCheckNode={this.unCheckNode}
                                data={dataTree}
                            />
                        </div>
                        <SlimScroll outerComponentId="domain-tree" innerComponentId="tree-qlcv-document" innerComponentWidth={"100%"} activate={true} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        {
                            this.state.currentDomain !== undefined &&
                            <EditForm
                                domainId={this.state.currentDomain.id}
                                domainName={this.state.currentDomain.text}
                                domainDescription={this.state.currentDomain.original.description}
                                domainParent={this.state.currentDomain.parent}
                            />
                        }
                    </div>
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