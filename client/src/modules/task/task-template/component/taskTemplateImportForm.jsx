import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, } from '../../../../common-components';
import XLSX from 'xlsx';
class TaskTemplateImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleChangeFile =(e) =>{
        let configData = this.state.configData;
        let sheets = configData.sheets;
        let file = e.target.files[0];
        
        if(file !== undefined){
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (evt) =>{
                let sheet_lists = [];
                const fileImport = evt.target.result;
                const workbook = XLSX.read(fileImport, {type: 'binary'});
                
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title="Thêm mẫu công việc bằng import file excel"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <div>
                            <button type="button" data-toggle="collapse" data-target="#confic_import_file" className="pull-right" ><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>
                            <div id="confic_import_file" className="box box-solid box-default collapse col-sm-12 col-xs-12" style={{ padding: 0 }}>
                                <div className="box-header with-border">
                                    <h3 className="box-title">Cấu hình file import</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-toggle="collapse" data-target={`#confic_import_file`}><i className="fa fa-times"></i></button>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Tên các sheet<span className="text-red">*</span></label>
                                        <input type="text" className="form-control" name="" value="" placeholder="Tên các sheet VD:sheet1, sheet2"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Số dòng của tiêu đề báng<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Số dòng của tiêu đề bảng"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Tên đơn vị<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với tên đơn vị"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Người được xem<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với người được xem"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Tên mẫu<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với tên mẫu"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Độ ưu tiên<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với độ ưu tiên"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Mô tả<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với mô tả"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Người thực hiện<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với người thực hiện"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Người hỗ trợ<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với người được xem"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Người quan sát<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với người quan sát"/>
                                    </div>
                                    <div className="form-group col-sm-6 col-xs-12">
                                        <label>Công thức tính điểm<span className="text-red">*</span></label>
                                        <input type="number" className= "form-control" name="" value="" placeholder="Tiêu đề cột ứng với công thức tính điểm"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </DialogModal>
            </React.Fragment>
        )
    }
};
const importFileExcel = connect(null, null)(withTranslate(TaskTemplateImportForm));
export { importFileExcel as TaskTemplateImportForm };