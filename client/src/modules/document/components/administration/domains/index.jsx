import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DocumentActions } from '../../../redux/actions';
import { Tree, SlimScroll } from '../../../../../common-components';
import CreateForm from './createForm';
import EditForm from './editForm';
import './domains.css'
class AdministrationDocumentDomains extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domainParent: [],
            deleteNode: [],
        }
    }

    componentDidMount() {
        this.props.getDocumentDomains();
    }

    onChanged = async (e, data) => {
        await this.setState({ currentDomain: data.node })
        window.$(`#edit-document-domain`).slideDown();
    }

    checkNode = (e, data) => { //chọn xóa một node và tất cả các node con của nó
        this.setState({
            domainParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            domainParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    deleteDomains = () => {
        const { translate } = this.props;
        const { deleteNode } = this.state;
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
        const { domainParent, deleteNode } = this.state;
        const { translate } = this.props;
        const { list } = this.props.documents.administration.domains;
        const dataTree = list.map(node => {
            return {
                ...node,
                text: node.name,
                state: { "opened": true },
                parent: node.parent ? node.parent.toString() : "#"
            }
        })
        return (
            <React.Fragment>
                <button className="btn btn-success" onClick={() => {
                    window.$('#modal-create-document-domain').modal('show');
                }} title={translate('document.administration.domains.add')} disabled={domainParent.length > 1 ? true : false}>{translate('general.add')}</button>
                {
                    deleteNode.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteDomains}>{translate('general.delete')}</button>
                }
                <CreateForm domainParent={this.state.domainParent[0]} />
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
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
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        {
                            this.state.currentDomain &&
                            <EditForm
                                domainId={this.state.currentDomain.id}
                                domainName={this.state.currentDomain.text}
                                domainDescription={this.state.currentDomain.original.description ? this.state.currentDomain.original.description : ""}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentDomains));