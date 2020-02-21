import React, { Component } from 'react';
class ModalEditContract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:this.props.index,
            nameContract: this.props.data.nameContract,
            typeContract: this.props.data.typeContract,
            startDate:this.props.data.startDate,
            endDate:this.props.data.endDate,
            file: this.props.data.file,
            urlFile: this.props.data.urlFile,
            fileUpload: this.props.data.fileLoad,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    handleChangeFile(event) {
        const { name } = event.target;
        var file = event.target.files[0];
        var url = URL.createObjectURL(file);
        var fileLoad = new FileReader();
        fileLoad.readAsDataURL(file);
        fileLoad.onload = () => {
            this.setState({
                [name]: file.name,
                urlFile: url,
                fileUpload: file
            })
        };
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleSubmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        this.props.handleChange(this.state);
        window.$(`#modal-editNewContract-${this.props.index}`).modal("hide");
    }
    render() {
        var index = this.props.index;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editNewContract-${this.props.index}`} className="edit" title="Chỉnh sửa hợp đồng lao động" data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal fade" id={`modal-editNewContract-${this.props.index}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Chỉnh sửa hợp đồng lao động:</h4>
                            </div>
                                <div className="modal-body">
                                    <div className="col-md-12">
                                        <div className="checkbox" style={{ marginTop: 0 }}>
                                            <label style={{ paddingLeft: 0 }}>
                                                (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nameContract">Tên hợp đồng:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="nameContract" defaultValue={this.state.nameContract} onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="typeContract">Loại hợp đồng:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" name="typeContract" defaultValue={this.state.typeContract} onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="startDate">Ngày có hiệu lực:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control datepicker" defaultValue={this.state.startDate} name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                            <label htmlFor="endDate">Ngày hết hạn:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control datepicker" defaultValue={this.state.endDate} name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="file">Chọn file đính kèm:</label>
                                            <input type="file" style={{height:34,paddingTop:2}} className="form-control" name="file" onChange={this.handleChangeFile} />
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSubmit()} title="Lưu thay đổi" >Lưu lại</button>
                                </div>
                        </div>
                    </div >
                </div>
            </div>
        );
    }
};
export { ModalEditContract };
