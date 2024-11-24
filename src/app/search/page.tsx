interface SearchPageParams {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}

const SearchPage = async ({params, searchParams}: SearchPageParams) => {



    return (
        <div>
            <h1>Search Page</h1>
            <p>Slug: {params.slug}</p>
            <p>Search Params: {JSON.stringify(searchParams)}</p>
        </div>
    );
}

export default SearchPage;