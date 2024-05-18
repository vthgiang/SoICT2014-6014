import React, { useState } from "react";
import { Popover, Box, Grid } from "@mui/material";
import styles from "./index.module.css";

const ThemeItem = ({ theme, onSelectTheme }) => {
    return (
        <div 
            className={styles["theme_item"]} 
            style={{ backgroundColor: theme.colors[0] }} 
            onClick={() => onSelectTheme(theme.id)}
        >
        </div>
    )
}

const ThemeSelector = ({ themes, onSelect, selectedTheme}) => {
    const selectedThemePrimaryColor = themes.find((theme) => theme.id === selectedTheme).colors[0];
    const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);

    const handleClick = (event) => {
        setThemeMenuAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setThemeMenuAnchor(null);
    };

    const handleSelectThem = (id) => {
        onSelect(id);
        setThemeMenuAnchor(null);
    }

    const open = Boolean(themeMenuAnchor);
    const id = open ? 'theme-menu-popover' : undefined;

    return (
        <>
            <button className={styles["theme_select-button"]} onClick={handleClick}>
                <div className={styles["theme_select-value"]}>
                    <div className={styles.selected_color} style={{backgroundColor: selectedThemePrimaryColor}}></div>
                </div>
                <i className="material-icons">arrow_drop_down</i>
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={themeMenuAnchor}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Grid container spacing={3} p="1.6rem">
                    {themes.map((theme) => (
                        <Grid key={theme.id} item xs={2}>
                            <ThemeItem theme={theme} onSelectTheme={handleSelectThem}/>
                        </Grid>
                    ))}
                </Grid>
            </Popover>
        </>
    )
}

export default ThemeSelector;
