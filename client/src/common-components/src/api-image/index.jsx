import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../modules/auth/redux/actions';

class ApiImage extends Component {
    static DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

    constructor(props) {
        super(props);
        this.state = {
            dataStatus: ApiImage.DATA_STATUS.NOT_AVAILABLE
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.src && nextProps.src !== prevState.src) {
            if (nextProps.src.search(';base64,') < 0) { // Cần download ảnh để hiển thị
                nextProps.downloadFile(nextProps.src, `${nextProps.src}`, false);
                return {
                    ...prevState,
                    src: nextProps.src,
                    dataStatus: ApiImage.DATA_STATUS.QUERYING,
                };
            } else { // Ảnh đã ở dạng base64, sẵn sàng hiển thị
                return {
                    ...prevState,
                    src: nextProps.src,
                    image: nextProps.src,
                    dataStatus: ApiImage.DATA_STATUS.AVAILABLE,
                }
            }
        }
        return null;
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (this.state.dataStatus === ApiImage.DATA_STATUS.QUERYING && nextProps.auth.showFiles && nextProps.auth.showFiles.find(x => x.fileName === nextState.src)) { // Dữ liệu đã về
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: ApiImage.DATA_STATUS.AVAILABLE,
                    image: nextProps.auth.showFiles.find(x => x.fileName === nextState.src).file,
                }
            });
            return false;
        }

        if (this.state.dataStatus === ApiImage.DATA_STATUS.AVAILABLE) {
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: ApiImage.DATA_STATUS.FINISHED,
                }
            });
            return true;
        };

        return false;
    }

    showImage = (index, image) => {
        const { alt = "File not available", showImg = true, arrImageIndex } = this.props;
        let haveNextImage = index < arrImageIndex?.[arrImageIndex.length - 1] ? true : false;
        let havePreviousImage = index > arrImageIndex?.[0] ? true : false;

        let showNextImage = () => {
            this.showNextImage(index);
        }

        let showPreviousImage = () => {
            this.showPreviousImage(index);
        }

        let handleKeyDown = (e) => {
            this.handleKeyDown(e, index);
        }

        if (arrImageIndex && arrImageIndex.length > 0) {
            document.addEventListener("keydown", handleKeyDown);
        }

        if (showImg) {
            Swal.fire({
                html:
                    '<button type="button" role="button" style="visibility: hidden; padding: 5px 20px;" id ="showPrevious">' + '<' + '</button>' +
                    '&emsp;' + '<button type="button" role="button" style="visibility: hidden;padding: 5px 20px;" id ="showNext">' + '>' + '</button>' + '<br/>' +
                    '<br/>' + `<img src=${image} alt=${alt} style="max-width: 100%; max-height: 100%" />`,
                width: 'auto',
                showCloseButton: true,
                showConfirmButton: false,
                showCancelButton: false,
                showClass: {
                    backdrop: 'swal2-noanimation',
                    popup: '',
                    icon: ''
                },
                hideClass: {
                    popup: '',
                }
            }).then((result) => {
                if (arrImageIndex && arrImageIndex.length > 0) {
                    document.removeEventListener("keydown", handleKeyDown);
                }

                if (haveNextImage) {
                    showNext.removeEventListener('click', showNextImage);
                }

                if (havePreviousImage) {
                    showPrevious.removeEventListener('click', showPreviousImage);
                }
            })
        }

        let showNext = document.getElementById("showNext");
        let showPrevious = document.getElementById("showPrevious");

        if (haveNextImage) {
            showNext.style.visibility = "visible";
            showNext.addEventListener('click', showNextImage);
        }

        if (havePreviousImage) {
            showPrevious.style.visibility = "visible";
            showPrevious.addEventListener('click', showPreviousImage);
        }
    }

    handleKeyDown = (e, index) => {
        if (e.key === "ArrowLeft") this.showPreviousImage(index);
        if (e.key === "ArrowRight") this.showNextImage(index);
        if (e.key === "Enter" || e.key === "Escape" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            Swal.close();
        }
    }

    showNextImage = async (index) => {
        Swal.close();
        const { arrImageIndex, listImage } = this.props;
        let i = arrImageIndex.findIndex((e) => e === index)
        if (i < arrImageIndex.length - 1) {
            let newIndex = arrImageIndex[i + 1];
            let src = listImage[i + 1];
            if ((src.search(';base64,') < 0) && !this.props.auth.showFiles.find(x => x.fileName === src).file) {
                await this.props.downloadFile(src, `${src}`, false);
            }
            let image = await this.props.auth.showFiles.find(x => x.fileName === src).file;
            this.showImage(newIndex, image);
        }
    }

    showPreviousImage = async (index) => {
        Swal.close();
        const { arrImageIndex, listImage } = this.props;
        let i = arrImageIndex.findIndex((e) => e === index)
        if (i > 0) {
            let newIndex = arrImageIndex[i - 1];
            let src = listImage[i - 1];
            if ((src.search(';base64,') < 0) && !this.props.auth.showFiles.find(x => x.fileName === src).file) {
                await this.props.downloadFile(src, `${src}`, false);
            }
            let image = await this.props.auth.showFiles.find(x => x.fileName === src).file;
            this.showImage(newIndex, image);
        }
    }

    render() {
        const { className, style = { cursor: "pointer" }, alt = "File not available", file, requestDownloadFile } = this.props;

        let { image } = this.state;

        return (
            <React.Fragment>
                <img className={className} style={style} src={image} alt={alt} onClick={() => this.showImage(this.props.index, this.state.image)} />
                {file && <a style={{ marginTop: "2px", cursor: "pointer" }} onClick={(e) => requestDownloadFile(e, file.url, file.name)}> {file.name} </a>}
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { auth } = state;
    return { auth };
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const apiImage = connect(mapState, actionCreators)(withTranslate(ApiImage));
export { apiImage as ApiImage }