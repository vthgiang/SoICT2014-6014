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
                    dataStatus: ApiImage.DATA_STATUS.FINISHED
                }
            });
            return true;
        };

        return false;
    }

    showImage = (index, image) => {
        const { alt = "File not available", showImg = true, listImage } = this.props;
        let haveNextImage = listImage ? index < listImage.length - 1 : false;
        let havePreviousImage = index > 0 ? true : false;

        let showNextImage = () => {
            this.showNextImage(index);
        }

        let showPreviousImage = () => {
            this.showPreviousImage(index);
        }

        let handleKeyDown = (e) => {
            this.handleKeyDown(e, index);
        }

        if (showImg) {
            Swal.fire({
                html:
                    '<button class="btn" role="button" style="padding: 3px 15px;background-color: rgb(48, 133, 214);visibility:hidden" id ="showPrevious">'
                    + '<i class="fa fa-long-arrow-left" style="font-size:17px;color:white">' + '</i>' + '</button>' + '&emsp;'
                    + '<button class="btn" role="button" style="padding: 3px 15px;background-color: rgb(48, 133, 214);visibility:hidden" id ="showNext">'
                    + '<i class="fa fa-long-arrow-right" style="font-size:17px;color: white">' + '</i>' + '</button>' + '<br/>' +
                    '<br/>' + `<img src=${image} alt=${alt} style="max-width: 100%; max-height: 100%" />`,
                width: 'auto',
                stopKeydownPropagation: false,
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
                if (listImage && listImage.length > 1) {
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

        if (listImage && listImage.length > 1) {
            document.addEventListener("keydown", handleKeyDown);
            showNext.style.visibility = "visible";
            showPrevious.style.visibility = "visible";
        }

        if (haveNextImage) {
            showNext.addEventListener('click', showNextImage);
        }
        else {
            showNext.disabled = true;
            showNext.style.cursor = "not-allowed";
            showNext.style.opacity = "0.6";
        }

        if (havePreviousImage) {
            showPrevious.addEventListener('click', showPreviousImage);
        }
        else {
            showPrevious.disabled = true;
            showPrevious.style.cursor = "not-allowed";
            showPrevious.style.opacity = "0.6";
        }
    }

    handleKeyDown = (e, index) => {
        const { listImage } = this.props;
        if (e.key === "ArrowLeft" && index > 0) this.showPreviousImage(index);
        if (e.key === "ArrowRight" && index < listImage.length - 1) this.showNextImage(index);
        if (e.key === "Enter" || e.key === "Escape" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            Swal.close();
        }
    }

    showNextImage = async (i) => {
        Swal.close();
        const { listImage } = this.props;
        if (i < listImage.length - 1) {
            let src = listImage[i + 1];
            if ((src.search(';base64,') < 0) && !this.props.auth.showFiles.find(x => x.fileName === src).file) {
                await this.props.downloadFile(src, `${src}`, false);
            }
            let image = await this.props.auth.showFiles.find(x => x.fileName === src).file;
            this.showImage(i + 1, image);
        }
    }

    showPreviousImage = async (i) => {
        Swal.close();
        const { listImage } = this.props;
        if (i > 0) {
            let src = listImage[i - 1];
            if ((src.search(';base64,') < 0) && !this.props.auth.showFiles.find(x => x.fileName === src).file) {
                await this.props.downloadFile(src, `${src}`, false);
            }
            let image = await this.props.auth.showFiles.find(x => x.fileName === src).file;
            this.showImage(i - 1, image);
        }
    }

    render() {
        const { className, style = { cursor: "pointer" }, alt = "File not available", file, requestDownloadFile, listImage } = this.props;

        let { image, src } = this.state;
        let index = 0;

        if (listImage && listImage.length > 0) {
            index = listImage.findIndex((e, i) => e === src)
        }

        return (
            <React.Fragment>
                <img className={className} style={style} src={image} alt={alt} onClick={() => this.showImage(index, this.state.image)} />
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