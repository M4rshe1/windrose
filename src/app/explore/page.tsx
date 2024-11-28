interface SearchPageParams {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const SearchPage = async (props: SearchPageParams) => {
    const searchParams = await props.searchParams;
    const params = await props.params;



    return (
        <div>
            <h1>Search Page</h1>
            <p>Slug: {params.slug}</p>
            <p>Search Params: {JSON.stringify(searchParams)}</p>
        </div>
    );
}

export default SearchPage;