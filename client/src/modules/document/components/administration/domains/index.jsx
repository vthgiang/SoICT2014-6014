import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import CreateForm from './createForm';
import './domains.css'
class AdministrationDocumentDomains extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }

    componentDidMount(){
        this.props.getDocumentDomains();
    }

    // createDomain = async (value) => {
    //     await this.setState({
    //         documentParent: value
    //     })
    //     window.$('#modal-create-document-domain').modal('show');
    // }

    // editDomain = () => {
    //     window.$('#modal-create-document-domain').modal('show');
    // }

    // deleteDomain = () => {
    //     window.$('#modal-create-document-domain').modal('show');
    // }

    slideTreeElement = (id) => {
        window.$(`#tree-element-${id}`).slideToggle();
    }

    drawDomainTree = (dataTree) => {
        if(dataTree.length > 0){
            return dataTree.map(node => {
                        if(node.children === undefined)
                            return <li className="domain-tree" key={node.id} style={{paddingLeft: '0px', marginLeft: '0px'}}><a href="#node" className="domain-tree-content"> <i className="fa fa-tag text-gray"></i> {node.title} </a></li>
                        return <li className="domain-tree" key={node.id} style={{paddingLeft: '0px', marginLeft: '0px'}}>
                            <a href="#node" className="domain-tree-content"> <i className="fa fa-tags text-yellow" onClick={()=>this.slideTreeElement(node.id)}></i> {node.title} </a>
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
                <CreateForm documentParent={this.state.documentParent}/>
                {this.displayDomainTree(documents.administration.domains.tree)}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentDomains: DocumentActions.getDocumentDomains
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(AdministrationDocumentDomains) );