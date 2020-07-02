import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import CreateForm from './createForm';
import EditForm from './editForm';
import './domains.css'
import Swal from 'sweetalert2';
class AdministrationDocumentDomains extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }

    componentDidMount(){
        this.props.getDocumentDomains();
    }

    deleteDocumentDomain = (id, info) => {
        const {translate} = this.props;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.administration.domains.delete')}</div> <div>"${info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                this.props.deleteDocumentDomain(id);
            }
        })
    }

    slideTreeElement = (id) => {
        window.$(`#tree-element-${id}`).slideToggle();
    }

    toggleDomainSetting = (id) => {
        window.$(`#domain-setting-${id}`).slideToggle();
    }

    openModalEditDomain = async(data) => {
        await this.setState({currentDomain: data})
        window.$(`#modal-edit-document-domain`).modal('show');
    } 

    drawDomainTree = (dataTree) => {
        const {translate} = this.props;
        if(dataTree.length > 0){
            return dataTree.map(node => {
                        if(node.children === undefined)
                            return <li className="domain-tree" key={node.id} style={{paddingLeft: '0px', marginLeft: '0px'}}>
                                    <a href="#node" className="domain-tree-content"> 
                                        <i className="fa fa-folder text-gray"></i> 
                                        <span onClick={()=>this.toggleDomainSetting(node.id)}>{node.title}</span> 
                                        <span id={`domain-setting-${node.id}`} style={{display: 'none'}}>
                                            <a className="text-orange" href="#abc" onClick={()=>this.openModalEditDomain(node)}><i className="material-icons">edit</i></a>
                                            <a className="text-red" href="#abc" onClick={()=>this.deleteDocumentDomain(node.id, node.title)} title={translate('document.administration.domains.delete')}><i className="material-icons">delete</i></a>
                                        </span>
                                    </a>
                                </li>
                        return <li className="domain-tree" key={node.id} style={{paddingLeft: '0px', marginLeft: '0px'}}>
                            <a href="#node" className="domain-tree-content"> 
                                <i className="fa fa-folder text-yellow" onClick={()=>this.slideTreeElement(node.id)}></i> 
                                <span onClick={()=>this.toggleDomainSetting(node.id)}>{node.title}</span> 
                                <span id={`domain-setting-${node.id}`} style={{display: 'none'}}>
                                    <a className="text-orange" href="#abc" onClick={()=>this.openModalEditDomain(node)}><i className="material-icons">edit</i></a>
                                    <a className="text-red" href="#abc" onClick={()=>this.deleteDocumentDomain(node.id, node.title)} title={translate('document.administration.domains.delete')}><i className="material-icons">delete</i></a>
                                </span>
                            </a>
                            <ul className="domain-tree" id={`tree-element-${node.id}`} style={{display: 'none'}}>
                                {this.drawDomainTree(node.children)}
                            </ul>
                        </li>
                    })
        }
        return null;
    }

    displayDomainTree = (dataTree) => {
        return <ul className="domain-tree">
            {
                this.drawDomainTree(dataTree)
            }
        </ul>
    }

    render() { 
        const {translate, documents} = this.props;
        return ( 
            <React.Fragment>
                <CreateForm domainParent={this.state.domainParent}/>
                {
                    this.state.currentDomain !== undefined &&
                    <EditForm
                        domainId={this.state.currentDomain.id}
                        domainName={this.state.currentDomain.name}
                        domainDescription={this.state.currentDomain.description}
                        domainParent={this.state.currentDomain.parent}
                    />
                }
                {this.displayDomainTree(documents.administration.domains.tree)}
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