document.addEventListener('DOMContentLoaded', () => {
    const contentElement = document.getElementById('blog-content');

    // Get the 'post' query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post'); // Default to 'post.md' if no parameter

    fetch(postFile)
        .then(response => response.text())
        .then(markdown => {
            // Parse markdown to HTML
            const html = marked.parse(markdown);
            contentElement.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching markdown file:', error);
            contentElement.innerHTML = '<p>Failed to load blog content.</p>';
        });
});
