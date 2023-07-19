import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

const GET_BOOKS_URL = 'http://nyx.vima.ekt.gr:3000/api/books';

export interface BookDetails {
    index?: number;
    id: number;
    book_title: string;
    book_author: string[];
    book_publication_year: number;
    book_publication_country: string;
    book_publication_city: string;
    book_pages: number;
}

export interface BookListResponse {
    loading: boolean;
    count: number;
    books: BookDetails[];
    args: { page: number; itemsPerPage: number; filters: any[] }
}

export const getBooks = createAsyncThunk('books/fetchByPage',
    async (payload: { page: number; itemsPerPage: number; filters: any[] }) => {
        const response = await fetch(GET_BOOKS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: payload.page + 1,
                itemsPerPage: payload.itemsPerPage,
                filters: payload.filters
            })
        });
        let bookListResponse = (await response.json()) as BookListResponse;
        let startIndex = payload.page * payload.itemsPerPage + 1;
        bookListResponse.books = bookListResponse.books.map(book => {
            book.index = startIndex++;
            return book;
        });
        return bookListResponse;
    });

const initialState: BookListResponse = {
    loading: false,
    count: 0,
    books: [],
    args: {
        page: 0,
        itemsPerPage: 5,
        filters: []
    }
}

export const slice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        pageChange: (state, action: PayloadAction<{ page?: number, itemsPerPage?: number, filters?: any[] }>) => {
            if (action.payload.page !== undefined)
                state.args.page = action.payload.page;
            if (action.payload.itemsPerPage !== undefined)
                state.args.itemsPerPage = action.payload.itemsPerPage;
            if (action.payload.filters !== undefined)
                state.args.filters = action.payload.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBooks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBooks.fulfilled, (state, action) => {
                state.args.page = action.meta.arg.page;
                state.args.itemsPerPage = action.meta.arg.itemsPerPage;
                state.args.filters = action.meta.arg.filters;
                if (state.count !== action.payload.count) {
                    state.count = action.payload.count;
                    state.books = [];
                }
                for (let book of action.payload.books) {
                    if (book.index !== undefined && book.index !== null)
                        state.books[book.index - 1] = book;
                }
                state.loading = false;
            })
            .addCase(getBooks.rejected, (state, action) => {
                alert(action.error.message);
                state.loading = false;
            })
    }
});

export default slice.reducer;

export const { pageChange } = slice.actions;