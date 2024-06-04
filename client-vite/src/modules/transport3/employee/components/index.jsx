import React from "react";
import EmployeeTable from './employeeTable.jsx'


export default function Employee(){
    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <EmployeeTable/>
            </div>
        </div>
    );
}

