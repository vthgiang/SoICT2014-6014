import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DocumentActions } from '../../../redux/actions';
import { Tree, SlimScroll } from '../../../../../common-components';
import CreateForm from './createForm';
import EditForm from './editForm';
import './archive.css';

class AdministrationDocumentArchives extends Component {
    constructor(props) {
        super(props);
        this.state = {
            archiveParent: [],
            deleteNode: [],
        }
    }

    componentDidMount() {
        this.props.getDocumentArchive();
    }
    onChanged = async (e, data) => {
        await this.setState({
            currentArchive: data.node,
        })
        window.$(`#edit-document-archive`).slideDown();
    }

    checkNode = (e, data) => {
        this.setState({
            archiveParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            archiveParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d],

        })
    }

    deleteArchive = () => {
        const { translate } = this.props;
        const { deleteNode } = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            if (result.value && deleteNode.length > 0) {
                this.props.deleteDocumentArchive(deleteNode, "many");
                this.setState({
                    deleteNode: []
                });
            }
        })
    }

    render() {
        const { archiveParent, deleteNode } = this.state;
        const { translate } = this.props;
        const { list } = this.props.documents.administration.archives;
        const dataTree = list ? list.map(node => {
            return {
                ...node,
                text: node.name,
                state: { "open": true },
                parent: node.parent ? node.parent.toString() : "#"
            }
        }) : null
        return (
            <React.Fragment>
                <button className="btn btn-success" onClick={() => {
                    window.$('#modal-create-document-archive').modal('show');
                }} title={`Thêm`} disable={archiveParent.length > 1 ? true : false}>Thêm</button>
                {
                    deleteNode.length > 0 && <button class="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteDocumentArchive}>Xóa</button>
                }
                <CreateForm domainParent={this.state.archiveParent[0]} />
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <div className="archive-tree" id="archive-tree">
                            <Tree
                                id="tree-qlcv-document-archive"
                                onChanged={this.onChanged}
                                checkNode={this.checkNode}
                                unCheckNode={this.unCheckNode}
                                data={dataTree}
                            />
                        </div>
                        <SlimScroll outerComponentId="archive-tree" innerComponentId="tree-qlcv-document-archive" innerComponentWidth={"100%"} activate={true} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        {
                            this.state.currentArchive &&
                            <EditForm
                                archiveId={this.state.currentArchive.id}
                                archiveName={this.state.currentArchive.text}
                                archiveDescription={this.state.currentArchive.original.description ? this.state.currentArchive.original.description : ""}
                                archiveParent={this.state.currentArchive.parent}
                            />
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentArchive: DocumentActions.getDocumentArchive,
    editDocumentArchive: DocumentActions.editDocumentArchive,
    deleteDocumentArchive: DocumentActions.deleteDocumentArchive,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentArchives));