// nav.js - Shared navigation component
document.addEventListener('DOMContentLoaded', function() {
    const navHTML = `
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="identifying.html">Identifying and defining</a></li>
                <li><a href="researching.html">Researching and planning</a></li>
                <li><a href="producing.html">Producing and implementing</a></li>
                <li><a href="testing.html">Testing and evaluating</a></li>
            </ul>
        </nav>
    `;
    
    // Insert navigation at the top of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
});