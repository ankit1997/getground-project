// import React from "react";
// import { Provider } from "react-redux";
// import configureStore, { MockStoreEnhanced } from "redux-mock-store";
// import renderer, { ReactTestRenderer } from "react-test-renderer";
// import BooksContainer from "./BooksContainer";

// const mockStore = configureStore([]);

// describe("component", () => {
//     let store: MockStoreEnhanced<unknown, {}>;
//     let component: ReactTestRenderer;
//     beforeEach(() => {
//         store = mockStore({
//             getBooks: {
//                 args: { filters: [], itemsPerPage: 5, page: 1 },
//                 books: [],
//                 count: 7,
//                 loading: false,
//             },
//         });
//         component = renderer.create(
//             <Provider store={store}>
//                 <BooksContainer />
//             </Provider>
//         );
//     });

//     it("filter change", () => {
//         renderer.act(() => {
//             console.log(component.root.findAllByType("input"));
//             component.root
//                 .findByType("input")
//                 .props.onChange({ target: { value: "1654" } });
//         });
//         expect(store.dispatch).toHaveBeenCalledTimes(1);
//         expect(store.dispatch).toHaveBeenCalledWith({
//             payload: "1654",
//         });
//     });
// });

export {};
