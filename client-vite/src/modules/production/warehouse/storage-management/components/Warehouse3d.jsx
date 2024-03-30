import React, { useEffect } from 'react';
import $ from 'jquery';

const Warehouse3d = () => {
    useEffect(() => {
        // var scriptType = "";
        if (window.location.pathname.includes('/storage-management')) {
            $.getScript("library/warehouse/myWarehouseVisualizer.js");
        }
    }, []);

    return (
        <div>

        </div>
    )
}

export default Warehouse3d;