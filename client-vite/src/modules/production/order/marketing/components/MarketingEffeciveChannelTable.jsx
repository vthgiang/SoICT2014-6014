import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { sendRequest } from '../../../../../helpers/requestHelper';
import { Loading } from '../../../../../common-components';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        // color: theme.palette.common.black,
        color: '#33333',
        fontSize: 14,
        fontWeight: 700
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}))

function formatNumber(totalCost) {
    if (totalCost >= 1e9) {  // nếu totalCost lớn hơn hoặc bằng 1 tỉ
        return (totalCost / 1e9).toFixed(1) + 'B';  // chia cho 1 tỉ và làm tròn đến 1 chữ số thập phân
    } else if (totalCost >= 1e6) {  // nếu totalCost lớn hơn hoặc bằng 1 triệu
        return (totalCost / 1e6).toFixed(1) + 'M';  // chia cho 1 triệu và làm tròn đến 1 chữ số thập phân
    } else if (totalCost >= 1e3) {  // nếu totalCost lớn hơn hoặc bằng 1 nghìn
        return (totalCost / 1e3).toFixed(1) + 'K';  // chia cho 1 nghìn và làm tròn đến 1 chữ số thập phân
    } else {
        return totalCost.toFixed(0);  // nếu totalCost nhỏ hơn 1 nghìn, chỉ hiển thị số nguyên
    }
}

const MarketingEffeciveChannelTable = ({isLoading, marketingEffectiveChannel}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#asad' }}>
                        <StyledTableCell>Channels </StyledTableCell>
                        <StyledTableCell>
                            Costs
                            <ArrowDropDownIcon />
                        </StyledTableCell>
                        <StyledTableCell>Clicks</StyledTableCell>
                        <StyledTableCell>Impressions</StyledTableCell>
                        <StyledTableCell>Transactions</StyledTableCell>
                        <StyledTableCell>Revenue</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading && <StyledTableRow>
                        <StyledTableCell component='th' scope='row'>
                            <Loading />
                        </StyledTableCell>
                        <StyledTableCell><Loading /></StyledTableCell>
                        <StyledTableCell><Loading /></StyledTableCell>
                        <StyledTableCell><Loading /></StyledTableCell>
                        <StyledTableCell><Loading /></StyledTableCell>
                        <StyledTableCell><Loading /></StyledTableCell>
                    </StyledTableRow>}
                    {marketingEffectiveChannel.length ? marketingEffectiveChannel.map((row) => (
                        <StyledTableRow key={row._id}>
                            <StyledTableCell component='th' scope='row'>
                                {row._id}
                            </StyledTableCell>
                            <StyledTableCell>{formatNumber(row.totalCost)}</StyledTableCell>
                            <StyledTableCell>{formatNumber(row.totalClick)}</StyledTableCell>
                            <StyledTableCell>{formatNumber(row.totalImpression)}</StyledTableCell>
                            <StyledTableCell>{formatNumber(row.totalTransaction)}</StyledTableCell>
                            <StyledTableCell>{formatNumber(row.totalRevenue)}</StyledTableCell>
                        </StyledTableRow>
                    )) : null}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MarketingEffeciveChannelTable