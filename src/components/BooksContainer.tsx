import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination, {
    LabelDisplayedRowsArgs,
} from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import { BookDetails, getBooks, pageChange } from "../redux/slice";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../redux/store";
import { connect } from "react-redux";
import { TextField } from "@mui/material";
import {
    changeQueryPage,
    getColumns,
    getFilterObject,
    getPageFromQueryParams,
} from "./helper";

export interface BooksContainerState {
    books: BookDetails[];
    count: number;
    page: number;
    itemsPerPage: number;
    filters: any[];
}

function BooksContainer(props: {
    loading: boolean;
    count: number;
    page: number;
    itemsPerPage: number;
    filters: any[];
    books: BookDetails[];
}) {
    const dispatch = useAppDispatch();
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const startIndex = props.page * props.itemsPerPage;
        const endIndex = startIndex + props.itemsPerPage;
        const slice = props.books.slice(startIndex, endIndex);
        if (
            slice.length !== props.itemsPerPage ||
            slice.filter((book) => book).length === 0
        ) {
            dispatch(
                getBooks({
                    page: props.page,
                    itemsPerPage: props.itemsPerPage,
                    filters: props.filters,
                })
            );
        }
    }, [props.page, props.itemsPerPage]);

    useEffect(() => {
        dispatch(
            getBooks({
                page: props.page,
                itemsPerPage: props.itemsPerPage,
                filters: getFilterObject(filter),
            })
        );
    }, [filter]);

    const pageFromQuery = getPageFromQueryParams();
    if (pageFromQuery !== props.page) {
        dispatch(
            pageChange({
                page: pageFromQuery,
            })
        );
    }

    const handlePageChange = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        page_number: number
    ) => {
        changeQueryPage(page_number);
        dispatch(
            pageChange({
                page: page_number,
            })
        );
    };

    const handleRowsPerPageChange = (rowsPerPage: number) => {
        dispatch(
            pageChange({
                itemsPerPage: rowsPerPage,
            })
        );
    };

    const columns = getColumns();
    const startIndex = props.page * props.itemsPerPage;
    const endIndex = startIndex + props.itemsPerPage;

    return (
        <>
            <TextField
                label="Filter books"
                color="secondary"
                focused
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFilter(event.target.value);
                }}
                style={{ width: "400px" }}
            />
            <TableContainer>
                {props.page !== 0 &&
                    filter !== null &&
                    filter !== undefined &&
                    filter.length > 0 && (
                        <small>Go to first page after using filter above</small>
                    )}
                {props.loading && <LinearProgress />}
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.field}
                                    style={{
                                        fontWeight: "bold",
                                        minWidth: "200px",
                                    }}
                                >
                                    {col.headerName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.books
                            .slice(startIndex, endIndex)
                            .map((book: BookDetails) => (
                                <TableRow key={book.id}>
                                    {columns.map((col) => {
                                        return (
                                            <TableCell key={col.field + "2"}>
                                                {
                                                    book[
                                                        col.field as keyof BookDetails
                                                    ]
                                                }
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                data-testid="table-pagination"
                component="div"
                count={props.count}
                page={props.page}
                onPageChange={handlePageChange}
                rowsPerPage={props.itemsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                onRowsPerPageChange={(event) =>
                    handleRowsPerPageChange(parseInt(event.target.value))
                }
                showFirstButton
                showLastButton
                labelDisplayedRows={(
                    paginationInfo: LabelDisplayedRowsArgs
                ) => {
                    const { from, to, count, page } = paginationInfo;
                    return (
                        <>
                            Page {page + 1} with Rows {from} - {to} of {count}
                        </>
                    );
                }}
            />
        </>
    );
}

const mapStateToProps = function (state: RootState) {
    return {
        loading: state.getBooks.loading,
        count: state.getBooks.count,
        books: state.getBooks.books,
        page: state.getBooks.args.page,
        itemsPerPage: state.getBooks.args.itemsPerPage,
        filters: state.getBooks.args.filters,
    };
};

export default connect(mapStateToProps)(BooksContainer);
