import React from "react";
import "./App.css";
import BooksContainer from "./components/BooksContainer";

class App extends React.Component {
    render() {
        return (
            <div style={{ margin: "10px" }}>
                <h1>List of Books</h1>
                <BooksContainer />
            </div>
        );
    }
}

export default App;
