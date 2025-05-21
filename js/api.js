
const API_BASE_URL = 'https://fakestoreapi.com';


async function fetchData(endpoint) {
    try {
        console.log(`Fetching: ${API_BASE_URL}${endpoint}`); 
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data); 
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        showErrorNotification(`Error al cargar datos: ${error.message}`);
        return null;
    }
}

export async function getProducts(limit = 12, offset = 0) {
    return await fetchData(`/products?offset=${offset}&limit=${limit}`);
}

export async function getProductDetails(id) {
    return await fetchData(`/products/${id}`);
}

export async function getCategories(limit = 8, offset = 0) {
    return await fetchData(`/categories?offset=${offset}&limit=${limit}`);
}

export async function getCategoryDetails(id) {
    return await fetchData(`/categories/${id}`);
}

export async function getUsers(limit = 10, offset = 0) {
    return await fetchData(`/users?offset=${offset}&limit=${limit}`);
}

export async function getUserDetails(id) {
    return await fetchData(`/users/${id}`);
}

function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}