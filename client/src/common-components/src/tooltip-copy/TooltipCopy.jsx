import React, { useState, useEffect } from 'react';
import Tooltip from 'rc-tooltip';

const TooltipCopy = ({ copyText, copySuccessNoti, className }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                setShow(false);
            }, 1000);
        }
    }, [show]);

    const handleCopyApi = async (copyText) => {
        await navigator.clipboard.writeText(copyText);
        setShow(true);
    }

    return (
        <Tooltip placement="top" overlay={'Copied'} visible={show}>
            <button
                onClick={() => handleCopyApi(copyText)}
                className={className}
                style={{
                    position: "absolute",
                    right: 10,
                    border: '1px solid gray',
                    borderRadius: 3,
                    width: 25,
                    height: 25,
                }}
                onBlur={() => setShow(false)}
            >
                <i className="material-icons" style={{
                }}>content_copy</i>
            </button>
        </Tooltip >
    )
}

export default TooltipCopy;