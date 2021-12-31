import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { translate } from "react-redux-multilingual/lib/utils";
import parse from 'html-react-parser';
import { ShowMoreShowLess } from "../../../../common-components";

function InvoiceLogTab(props) {
   
    const [state, setState] = useState({
    })

    const [prevProps, setPrevProps] = useState({
        id: null
    })

    if (prevProps.id !== props.id) {
        setState({
            ...state,
            id: props.id,
            logs: props.logs,
        })
        setPrevProps(props)
    }

    const { id, translate, purchaseInvoiceReducer } = props;

    const {
        logs,
    } = state;

    return (
        <div id={id} className="tab-pane">
            <div className="box-body" >
                <div className="row" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                    {/* Thông tin cơ bản */}
                    <div className="col-md-12" style={{ paddingRight: '0px', paddingLeft: '0px', minWidth: '350px' }}>
                        {logs &&
                            <ShowMoreShowLess
                                id={`invoiceLog${id}`}
                                styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                            >
                                {
                                    logs.map((item, index) =>
                                        <div key={item._id} className={`item-box ${index > 3 ? "hide-component" : ""}`}>
                                            <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.creator?.name} </a>
                                            {item.title ? item.title : translate("supplies.general_information.none_description")}&nbsp;
                                            ({moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY")})
                                            <div>
                                                {item.description ? parse(item.description) : translate("supplies.general_information.none_description")}
                                            </div>
                                        </div>
                                    )
                                }
                            </ShowMoreShowLess>
                        }
                    </div>
                        
                </div>
            </div>
        </div>
    );
};

function mapState(state) {
    const { purchaseInvoiceReducer } = state;
    return { purchaseInvoiceReducer };
}
const actions = {
    
}
const invoiceLogTab = connect(mapState, actions)(withTranslate(InvoiceLogTab));
export { invoiceLogTab as InvoiceLogTab };