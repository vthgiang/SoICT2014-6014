import React, { Component } from "react";
import QuoteManageTable from "./quoteManageTable";

function Quote(props) {

    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <QuoteManageTable />
            </div>
        </div>
    );
}


export default Quote;
