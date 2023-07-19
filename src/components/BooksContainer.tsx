import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import { BookDetails, getBooks, pageChange } from "../redux/slice";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../redux/store";
import { connect } from "react-redux";
import { Button, TextField } from "@mui/material";

export interface BooksContainerState {
    books: BookDetails[];
    count: number;
    page: number;
    itemsPerPage: number;
    filters: any[];
}

function getColumns() {
    return [
        { field: "index", headerName: "S.no." },
        {
            field: "book_title",
            headerName: "Title",
        },
        {
            field: "book_author",
            headerName: "Author",
        },
        {
            field: "book_publication_year",
            headerName: "Publication Year",
        },
        {
            field: "book_publication_city",
            headerName: "Publication city",
        },
        {
            field: "book_publication_country",
            headerName: "Publication country",
        },
        {
            field: "book_pages",
            headerName: "# pages",
        },
    ];
}

function changeQueryPage(page_number: number) {
    var url =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?page=" +
        (page_number + 1);
    window.history.pushState({ path: url }, "", url);
}

function getFilterObject(filter: string) {
    return [
        {
            type: "all",
            values: [filter],
        },
    ];
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

    /// process page value from query
    const query = new URLSearchParams(window.location.search);
    const pageFromQuery = Math.max(parseInt(query.get("page") ?? "1") - 1, 0);
    if (pageFromQuery !== props.page) {
        dispatch(
            pageChange({
                page: pageFromQuery,
                itemsPerPage: props.itemsPerPage,
                filters: props.filters,
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
                itemsPerPage: props.itemsPerPage,
                filters: props.filters,
            })
        );
    };

    const handleRowsPerPageChange = (rowsPerPage: number) => {
        dispatch(
            pageChange({
                page: props.page,
                itemsPerPage: rowsPerPage,
                filters: props.filters,
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
            />
            <TableContainer>
                {props.loading && <LinearProgress />}
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.field}>
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
                rowsPerPageOptions={[10, 20]}
                onRowsPerPageChange={(event) =>
                    handleRowsPerPageChange(parseInt(event.target.value))
                }
                showFirstButton
                showLastButton
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
