import React, { Component } from 'react';
class ModalEditContract extends Component {
    constructor(props){
        super(props);
        this.state={
            nameContract: "",
            typeContract: "",
            file:"",
            urlFile:"",
            fileUpload:" "
        }
        this.handleChange= this.handleChange.bind(this);
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
                fileUpload:file
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
        this.setState ({
            nameContract: "",
            typeContract: "",
            file:"",
            urlFile:"",
            fileUpload:" "
        })
        window.$(`#modal-addNewContract`).modal("hide");
    }
    render() {
        return (
            <div className="modal fade" id="modal-addNewContract" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới hợp đồng lao động:</h4>
                        </div>
                        <form>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="checkbox" style={{ marginTop: 0 }}>
                                    <label style={{ paddingLeft: 0 }}>
                                        (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nameContract">Tên hợp đồng:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="nameContract" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="typeContract">Loại hợp đồng:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="typeContract" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="startDate">Ngày có hiệu lực:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="endDate">Ngày hết hạn:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="file">Chọn file đính kèm:</label>
                                    <input type="file" className="form-control" name="file" onChange={this.handleChangeFile} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="reset" className="btn btn-success" onClick={()=>this.handleSubmit()} title="Thêm mới hợp đồng lao động" >Thêm mới</button>
                        </div>
                        </form>
                    </div>
                </div >
            </div>
        );
    }
};
export { ModalEditContract };
