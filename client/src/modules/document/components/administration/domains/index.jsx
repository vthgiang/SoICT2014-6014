import React, { Component } from 'react';
import { Tree, Popover, Button  } from 'antd';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import CreateForm from './createForm';

class AdministrationDocumentDomains extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            expandedKeys: [],
            autoExpandParent: true
        }
    }
    
    onExpand = expandedKeys => {
        this.setState({
        expandedKeys,
        autoExpandParent: false,
        });
    };

    componentDidMount(){
        this.props.getDocumentDomains();
    }

    createDomain = async (value) => {
        await this.setState({
            documentParent: value
        })
        window.$('#modal-create-document-domain').modal('show');
    }

    editDomain = () => {
        window.$('#modal-create-document-domain').modal('show');
    }

    deleteDomain = () => {
        window.$('#modal-create-document-domain').modal('show');
    }

    render() { 
        const { autoExpandParent } = this.state;
        
        const {translate, documents} = this.props;
        const loop = data =>
            data.map(item => {
                const title = <Popover content={()=>{
                        return <React.Fragment>
                            <a class="text-green" onClick={() => this.createDomain(item.key)}><i className="material-icons">add</i></a>
                            <a class="text-yellow" onClick={this.editDomain}><i className="material-icons">edit</i></a>
                            <a class="text-red" onClick={this.deleteDomain}><i className="material-icons">delete</i></a>
                        </React.Fragment>
                    }} trigger="click">
                        {item.title}
                    </Popover>;
                if (item.children) {
                return { title, key: item.key, children: loop(item.children) };
                }

                return {
                title,
                key: item.key,
            };
        });

        return ( 
            <React.Fragment>
                <CreateForm documentParent={this.state.documentParent}/>
                {
                    documents.administration.domains.length > 0 &&
                    <Tree
                        onExpand={this.onExpand}
                        defaultExpandAll 
                        autoExpandParent={autoExpandParent}
                        treeData={loop(documents.administration.domains)}
                    />
                }
                
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentDomains: DocumentActions.getDocumentDomains
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(AdministrationDocumentDomains) );