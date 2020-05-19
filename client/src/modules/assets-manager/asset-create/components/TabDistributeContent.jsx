import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {ModalAddDistribute, ModalEditDistribute} from './CombineContent';
import {DataTableSetting, DatePicker, SelectMulti} from '../../../../common-components';

class TabDistributeContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    handleDistributeNumberChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleAssetNumberChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        ;
        this.setState({
            ...this.state,
            type: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSunmitSearch = async () => {
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
            })
        }

    }

    // Bắt sự kiện click edit phiếu
    handleEdit = async (value, index) => {
        console.log('value', {value});
        await this.setState(state => {
            return {
                ...state,
                currentRow: {...value, index: index}
            }
        });
        window.$(`#modal-edit-distributetransfer-editDistribute${index}`).modal('show');
    }

    // Function thêm thông tin phiếu
    handleAddDistribute = async (data) => {
        console.log('dât',data);
        const {distributeTransfer} = this.state;
        await this.setState({
            distributeTransfer: [...distributeTransfer, {
                ...data
            }]
        })
        this.props.handleAddDistributeTransfer(data)
    }

    // Function chỉnh sửa thông tin phiếu
    handleEditDistribute = async (data) => {
        const {distributeTransfer} = this.state;
        distributeTransfer[data.index] = data;
        await this.setState({
            distributeTransfer: distributeTransfer,

        })
        this.props.handleEditDistributeTransfer(data, 'edit')
    }

    // Function bắt sự kiện xoá thông tin phiếu
    delete = async (index) => {
        var distributeTransfer = this.state.distributeTransfer;
        distributeTransfer.splice(index, 1);
        await this.setState({
            ...this.state,
            distributeTransfer: [...distributeTransfer]
        })
        this.props.handleDeleteDistribute(this.state.distributeTransfer)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.isCloseModal !== prevState.isCloseModal) {
            return {
                ...prevState,
                id: nextProps.id,
                asset: nextProps.asset,
                distributeTransfer: nextProps.distributeTransfer,
                isCloseModal: nextProps.isCloseModal
            }
        } else {
            return null;
        }
    }


    render() {
        const {id, translate, user} = this.props;
        const {distributeTransfer} = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">

                    <ModalAddDistribute asset={this.state.asset} handleChange={this.handleAddDistribute} id={`addDistribute${id}`}/>
                    <div className="form-group">
                        <h5 className="box-title">Lịch sử cấp phát - điều chuyển - thu hồi:</h5>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu</label>
                            <input type="text" className="form-control" name="distributeNumber" onChange={this.handleDistributeNumberChange} placeholder="Mã phiếu" autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month1"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{marginBottom: 10}}>
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType1`} multiple="multiple1"
                                         options={{nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả các loại phiếu"}}
                                         onChange={this.handleTypeChange}
                                         items={[
                                             {value: "distribute", text: "Cấp phát"},
                                             {value: "transfer", text: "Điều chuyển"},
                                             {value: "revoke", text: "Thu hồi"}
                                         ]}
                            >
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()}>{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="distributetransfer-table" className="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th style={{width: "10%"}}>Mã phiếu</th>
                            <th style={{width: "10%"}}>Ngày lập</th>
                            <th style={{width: "10%"}}>Phân loại</th>
                            <th style={{width: "10%"}}>Người bàn giao</th>
                            <th style={{width: "10%"}}>Người tiếp nhận</th>
                            <th style={{width: "10%"}}>Vị trí tài sản</th>
                            <th style={{width: '100px', textAlign: 'center'}}>Hành động
                                <DataTableSetting
                                    tableId="distributetransfer-table"
                                    columnArr={[
                                        "Mã phiếu",
                                        "Ngày lập",
                                        "Phân loại",
                                        "Người bàn giao",
                                        "Người tiếp nhận",
                                        "Vị trí tài sản",
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    hideColumnOption={true}
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {(typeof distributeTransfer !== 'undefined' && distributeTransfer.length !== 0) &&
                        distributeTransfer.map((x, index) => (
                            <tr key={index}>
                                <td>{x.distributeNumber}</td>
                                <td>{x.dateCreate}</td>
                                <td>{x.type}</td>
                                <td>{x.handoverMan !== null ? user.list.filter(item => item._id === x.handoverMan).pop().name : ''}</td>
                                <td>{x.receiver !== null ? user.list.filter(item => item._id === x.receiver).pop().name : ''}</td>
                                <td>{x.nextLocation}</td>
                                <td>
                                    <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{width: '5px'}} title="Chỉnh sửa thông tin phiếu"><i
                                        className="material-icons">edit</i></a>
                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                </td>
                            </tr>))
                        }
                        </tbody>
                    </table>
                    {
                        (typeof distributeTransfer === 'undefined' || distributeTransfer.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditDistribute
                        id={`editDistribute${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        distributeNumber={this.state.currentRow.distributeNumber}
                        dateCreate={this.state.currentRow.dateCreate}
                        type={this.state.currentRow.type}
                        place={this.state.currentRow.place}
                        manager={this.state.currentRow.manager}
                        dateEndUse={this.state.currentRow.dateEndUse}
                        dateStartUse={this.state.currentRow.dateStartUse}
                        positionManager={this.state.currentRow.positionManager}
                        handoverMan={this.state.currentRow.handoverMan}
                        positionHandoverMan={this.state.currentRow.positionHandoverMan}
                        receiver={this.state.currentRow.receiver}
                        positionReceiver={this.state.currentRow.positionReceiver}
                        nowLocation={this.state.currentRow.nowLocation}
                        nextLocation={this.state.currentRow.nextLocation}
                        reason={this.state.currentRow.reason}
                        handleChange={this.handleEditDistribute}
                        asset={this.state.asset}
                    />
                }
            </div>
        );
    }
};

const tabDistribute = connect((state) => ({user: state.user}), null)(withTranslate(TabDistributeContent));
export {tabDistribute as TabDistributeContent};
