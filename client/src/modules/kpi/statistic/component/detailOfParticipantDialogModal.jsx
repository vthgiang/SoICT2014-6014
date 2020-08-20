import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DataTableSetting, PaginateBar, TreeTable } from '../../../../common-components';

class DetailOfChildKpiDialogModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    render() {
        const { translate } = this.props;
        const { listChildKpi } = this.props;

        let column = [
            { name: "Tên mục tiêu", key: "name" },
            { name: "Mục tiêu cha", key: "parentName" },
            { name: "Tiêu chí đánh giá", key: "criteria" },
            { name: "Trọng số", key: "weight" },
            { name: "Trạng thái", key: "status" }
        ];
        console.log(listChildKpi)
        let data = listChildKpi;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-childKpi-detail" 
                    title="Chi tiết KPI con"
                    hasNote={false}
                    hasSaveButton={false}
                >
                    <DataTableSetting
                        tableId="tree-table"
                        tableContainerId="tree-table-container"
                        columnArr={[
                            "Tên mục tiêu",
                            "Mục tiêu cha",
                            "Tiêu chí đánh giá",
                            "Trọng số",
                            "Trạng thái"
                        ]}
                        hideColumnOption={true}
                    />

                    <div id="tree-table-container">
                        <TreeTable
                            column={column}
                            data={data}
                        />

                    </div>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailOfChildKpiDialogModal = connect(mapState, actions)(withTranslate(DetailOfChildKpiDialogModal));
export { connectDetailOfChildKpiDialogModal as DetailOfChildKpiDialogModal }