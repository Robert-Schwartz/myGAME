async function PostFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#post-title').value;
    const content = document.querySelector('#post-content').value;

        const response = await fetch('/api/posts',{
            method: 'POST',
            body: JSON.stringify({
                title,
                content
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            document.location.replace('/popular');
        } else {
            alert(response.statusText);
        }
}

document.querySelector('.new-post-form').addEventListener('submit', PostFormHandler);
