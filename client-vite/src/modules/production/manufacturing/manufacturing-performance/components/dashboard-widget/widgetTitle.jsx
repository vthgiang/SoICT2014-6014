import React, { useState } from "react";
import { Box, Popover, IconButton, Paper } from "@mui/material";

import styles from "./index.module.css";

const Action = ({ name, icon, iconColor, callback }) => {
    return (
        <Box
            display="flex"
            gap={2}
            px={2} py={1}
            borderRadius={1}
            sx={{ color: "#333", cursor: "pointer", ":hover": { bgcolor: "#e9ecef" } }}
            onClick={callback}
        >
            <i className="material-icons" style={{ color: iconColor }} >{icon}</i>
            <span>{name}</span>
        </Box>

    )
}

const WidgetTitle = ({ title, onDelete, onRedirectToDetail }) => {
    const [actionAnchor, setActionAnchor] = useState(null)

    const handleClick = (event) => {
        event.stopPropagation();
        setActionAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setActionAnchor(null);
    };

    const open = Boolean(actionAnchor);
    const id = open ? 'simple-popover' : undefined;


    return (
        <div className={styles["chart-title"]}>
            <span>{title}</span>
            <div>
                <IconButton className="cancelSelectorName" aria-describedby={id} onMouseDown={handleClick}>
                    <i className="material-icons" >more_horiz</i>
                </IconButton>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={actionAnchor}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Paper p={1} display="flex" flexDirection="column">
                        <Action name="Chi tiết" icon="visibility" iconColor="#333" callback={onRedirectToDetail} />
                        <Action name="Xóa" icon="delete" iconColor="#dc3545" callback={onDelete} />
                    </Paper>

                </Popover>
            </div>

        </div>
    )
}


export default WidgetTitle;
