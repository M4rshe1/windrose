export async function uploadPicture(route: string,body?: any, multi: boolean = false) {

    const files = await new Promise<File[]>((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg, image/png, image/gif, image/webp, image/bmp, image/tiff, image/svg+xml';
        input.multiple = multi;
        input.onchange = () => {
            resolve(Array.from(input.files!));
        };
        input.click();
    });
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    if (body) {
        Object.keys(body).forEach(key => {
            formData.append(key, body[key]);
        });
    }
    const response = await fetch(route, {
        method: 'POST',
        body: formData,
    });
    return {ok: response.ok, data: await response.json()};
}