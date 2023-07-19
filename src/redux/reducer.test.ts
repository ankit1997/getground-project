import reducer, { BookDetails, getBooks } from './slice';

function getRandomBetweenRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function getRandomBooks(n: number): BookDetails[] {
    const out: BookDetails[] = [];
    for (let i = 0; i < n; i++) {
        out.push({
            book_publication_country: 'XXX',
            book_author: ['XXX'],
            book_pages: getRandomBetweenRange(100, 200),
            book_publication_city: 'XXX',
            book_title: 'best book ever',
            book_publication_year: getRandomBetweenRange(1900, 2023),
            id: getRandomBetweenRange(1, 100000),
            index: i + 1
        })
    }
    return out;
}

describe('slice', () => {
    describe('reducers', () => {


        it('items returned less than page size', () => {
            // currently ui is on page 1 with 5 elements. page 2 will contain only 2 elements since full dataset is size 7. this should cover a high level of reducer functionality
            const booksDataset = getRandomBooks(7);
            const initialState = { "args": { "filters": [], "itemsPerPage": 5, "page": 1 }, "books": booksDataset.slice(0, 5), "count": 7, "loading": false };
            const action = {
                type: getBooks.fulfilled.type,
                meta: {
                    arg: {
                        page: 2,
                        itemsPerPage: 5,
                        filters: []
                    }
                },
                payload: {
                    count: 7,
                    books: booksDataset.slice(5, 7)
                }
            };
            const newState = reducer(initialState, action);
            expect(newState.books.length).toEqual(7);
            expect(newState.books.filter(book => book).length).toEqual(7);
        })

        it('count changed at backend', () => {
            // when count changes from backend and frontend, then we clear the store locally to avoid any issue with index
            const booksDataset = getRandomBooks(10); // note new count will be 10
            const initialState = { "args": { "filters": [], "itemsPerPage": 5, "page": 1 }, "books": booksDataset.slice(0, 5), "count": 7, "loading": false }; // note existing count is 7
            const action = {
                type: getBooks.fulfilled.type,
                meta: {
                    arg: {
                        page: 2, // note the page is still 2; so page 1 contents will not exist in the store (tested below)
                        itemsPerPage: 5,
                        filters: []
                    }
                },
                payload: {
                    count: 10,
                    books: booksDataset.slice(5, 10)
                }
            };
            const newState = reducer(initialState, action);
            expect(newState.count).toEqual(10);
            expect(newState.books.filter(book => book).length).toEqual(5);
        })


    })
})