document.addEventListener('DOMContentLoaded', () => {
    const contentElement = document.getElementById('blog-content');

    // Get the 'post' query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post'); // Default to 'post.md' if no parameter

    // fetch(postFile)
    // .then(response => response.text())
    // .then(markdown => {
    // Parse markdown to HTML
    let markdown = `
# The Joy of Building with Rust

As a software developer, I've worked with multiple programming languages, but Rust has been a game-changer in many ways. It's fast, safe, and offers modern concurrency without compromising on performance. In this post, I want to share some reasons why I love working with Rust and why it might just be the perfect language for your next project.

## Why Choose Rust?

### 1. Memory Safety without a Garbage Collector
One of the most powerful features of Rust is its ownership system, which ensures memory safety without needing a garbage collector. This allows Rust programs to be highly efficient, especially in low-level systems programming.

### 2. Modern Tooling and Developer Experience
Rust’s tooling is top-notch. The \`cargo\` build system and package manager make managing dependencies, compiling code, and running tests incredibly simple. Rust also has great error messages that make debugging less painful.

### 3. Concurrency Made Easy
Concurrency can be a daunting task in most languages, but Rust’s ownership model makes it easier to reason about shared state, preventing common bugs like data races.

## Real-World Applications of Rust
Rust has gained significant traction in areas like blockchain, game development, and web assembly. I’ve personally used it for blockchain projects, and its performance and safety guarantees are perfect for building high-assurance systems in this domain.

## Conclusion
If you haven’t tried Rust yet, give it a shot! Whether you’re building a systems-level project, a web application, or something entirely different, Rust’s combination of safety, performance, and tooling will make the process enjoyable and productive.

Happy coding!

---

*Feel free to connect with me on [Twitter](https://twitter.com/yourhandle) for more Rust tips and insights.*

    `;
    const html = marked.parse(markdown);
    contentElement.innerHTML = html;
    // })
    // .catch(error => {
    //     console.error('Error fetching markdown file:', error);
    //     contentElement.innerHTML = '<p>Failed to load blog content.</p>';
    // });
});
