export function getColumns() {
    return [
        { field: "index", headerName: "S.no." },
        { field: "book_title", headerName: "Title", },
        { field: "book_author", headerName: "Author", },
        { field: "book_publication_year", headerName: "Publication Year", },
        { field: "book_publication_city", headerName: "Publication city", },
        { field: "book_publication_country", headerName: "Publication country", },
        { field: "book_pages", headerName: "# pages", },
    ];
}

export function getPageFromQueryParams() {
    const query = new URLSearchParams(window.location.search);
    return Math.max(parseInt(query.get("page") ?? "1") - 1, 0);
}

export function changeQueryPage(page_number: number) {
    // function to change the url of the page without reloading
    var url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?page=" + (page_number + 1);
    window.history.pushState({ path: url }, "", url);
}

export function getFilterObject(filter: string) {
    return [{ type: "all", values: [filter] }];
}