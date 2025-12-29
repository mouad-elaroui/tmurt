
const API_URL = "http://localhost:9000/store/products";
const API_KEY = "pk_de57ae3fca5f8247b8c3ae90b60d8d8be4a59b28b11c9e00b1d6a5042c6cf225";

async function checkProducts() {
    try {
        console.log(`Fetching from ${API_URL}...`);
        const res = await fetch(API_URL, {
            headers: {
                'x-publishable-api-key': API_KEY
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Product Count:', data.products.length);
        console.log('Product Titles:', data.products.map((p: any) => p.title));

        if (data.products.length === 0) {
            console.log("No products found. Checking Sales Channel linkage or status.");
        }

    } catch (err) {
        console.error('Fetch error:', err);
    }
}

checkProducts();
