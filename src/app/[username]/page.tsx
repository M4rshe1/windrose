
export default async function ProfilePage(props: {params: Promise<{username: string}>}) {
    const params = await props.params;
    return (
        <div>
            <h1>{params.username}</h1>
        </div>
    );
}