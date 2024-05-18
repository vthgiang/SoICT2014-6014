
import React from "react"
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../../common-components";
import RoutingFlowCreate from "./routingFlowCreate";
import RoutingFlowDetail from "./routingFlowDetail";
import OperationConnection from "./operationConnection";
import OperationNode from "./operationNode";
import "./routingFlow.css";

const edgeTypes = {
    operationConnection: OperationConnection
}

const nodeTypes = {
    operationNode: OperationNode,
}

const RoutingFlowBuilder = (props) => {
    const { translate, operations, mode, connectOperation } = props

    return (
        <>
            {mode === "view" && (
                <>
                    <a
                        className="btn btn-primary pull-right" href={`#modal-create-flow-${mode}`}
                        style={{ margin: "5px 0 5px 10px" }}
                        title={translate(`manufacturing.routing.${mode}_flow_title`)}
                        data-toggle='modal' data-backdrop='static'
                    >
                        <i className="fa fa-sitemap" style={{ marginLeft: "5px" }}></i>
                    </a>
                    <DialogModal
                        modalID={`modal-create-flow-${mode}`}
                        isLoading={false}
                        formID="form-create-flow"
                        title={translate(`manufacturing.routing.${mode}_flow_title`)}
                        msg_success=""
                        msg_failure=""
                        size={100}
                        hasSaveButton={false}
                        maxWidth={1000}
                    >
                        <RoutingFlowDetail operations={operations} edgeTypes={edgeTypes} nodeTypes={nodeTypes} />
                    </DialogModal>
                </>

            )}
            {mode === "create" && (
                <RoutingFlowCreate operations={operations} connectOperation={connectOperation} edgeTypes={edgeTypes} nodeTypes={nodeTypes} />
            )}
        </>
    )
}

export default connect(null, null)(withTranslate(RoutingFlowBuilder));
