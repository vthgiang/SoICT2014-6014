import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import FilePreviewer from 'react-file-previewer';

import { DialogModal } from '../../../../../common-components';
import { AuthActions } from '../../../../auth/redux/actions';
import FileViewer from 'react-file-viewer';
//import docx2html from 'docx2html';
class FilePreview extends Component {


    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING,
            data: "",

        }
    }

    componentDidMount = () => {
        let { file } = this.props;
        console.log('aloooooooooo', file)
        this.props.FileData(file, 'filename', false);

    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
    //         if (nextProps.auth.showFiles.length && nextProps.auth.showFiles.length[0]) {
    //             this.setState(state => {
    //                 return {
    //                     ...state,
    //                     dataStatus: this.DATA_STATUS.AVAILABLE
    //                 }
    //             })
    //         }
    //         return false;
    //     }
    //     else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
    //         // this.pieChart();
    //         // this.barChart();
    //         // this.barChartDocumentInDomain();
    //         // this.barChartDocumentInArchive();
    //         // window.$(`#list-document`).slideDown();

    //         this.setState(state => {
    //             return {
    //                 ...state,
    //                 data: nextProps.auth.showFiles.length[0].file,
    //                 dataStatus: this.DATA_STATUS.FINISHED,
    //             }
    //         })

    //     }
    //     return false;
    // }


    render() {
        const { translate, file } = this.props;
        const { data } = this.state;
        let encode = this.props.auth.showFiles.length ? this.props.auth.showFiles[0].file : "";

        // docx2html(encode, { container: document.getElementById('a') }).then(function (html) {
        //     html.toString()
        // })

        //   let dataEncode = this.props.auth.showFiles.length ? atob(encode) : "";
        // if (this.props.auth.showFiles.length) {
        //     console.log('pppppppppppppppp', this.props.auth.showFiles[0].file);
        //     let encode = this.props.auth.showFiles.length ? this.props.auth.showFiles[0].file.split(",")[1] : "";
        //     //var reader = new FileReader();

        //     console.log('eeeeeeeeeeeee', encode);
        //    // reader.readAsDataURL(encode);
        //     reader.onload = function () {
        //         console.log(reader.result);
        //     };
        // }
        // let link = `https://docs.google.com/gview?url${encode} &embedded=true`
        // console.log('filleee', link);



        return (
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-file-preview`}
                    title='Preview'
                    hasSaveButton={false}
                    hasNote={false}
                >

                    <div>
                        <h1>My App</h1>
                        {/* <FilePreviewer
                            file={{
                                data: file,
                                mimeType: 'application/pdf',
                                name: 'sample.pdf' // for download
                            }}
                        /> */}
                        <iframe
                            src={encode}
                        >


                        </iframe>

                        <div id='a'>

                        </div>
                        {/* <FileViewer
                            fileType='docx'
                            filePath={encode}
                        // errorComponent={CustomErrorComponent}
                        // onError={this.onError} 
                        /> */}
                    </div>
                </DialogModal>
            </React.Fragment >
        )
    }
}


const mapStateToProps = state => state;

const mapDispatchToProps = {
    FileData: AuthActions.downloadFile,
}



export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(FilePreview));