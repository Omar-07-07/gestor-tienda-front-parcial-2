import { getProducts, getCategories, getUsers } from './api.js';
import { displayProducts, displayCategories, displayUsers, updateCounters } from './ui.js';

function showLoadingState(containerId, type) {
    const icons = {
        products: 'fa-box-open',
        categories: 'fa-tags',
        users: 'fa-users'
    };
    
    const container = document.getElementById(containerId);
    if (container) {
        if (containerId === 'users-container') {
            container.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <div class="spinner-border text-info" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-2">Cargando ${type}...</p>
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas ${icons[type]} fa-3x mb-3 text-muted"></i>
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2">Cargando ${type}...</p>
                </div>
            `;
        }
    }
}

function setupRefreshButtons() {
    document.getElementById('refreshProducts')?.addEventListener('click', async () => {
        showLoadingState('products-container', 'products');
        const products = await getProducts();
        displayProducts(products);
    });

    document.getElementById('refreshCategories')?.addEventListener('click', async () => {
        showLoadingState('categories-container', 'categories');
        const categories = await getCategories();
        displayCategories(categories);
    });

    document.getElementById('refreshUsers')?.addEventListener('click', async () => {
        showLoadingState('users-container', 'users');
        const users = await getUsers();
        displayUsers(users);
    });
}

async function loadInitialData() {
    try {
        showLoadingState('products-container', 'products');
        showLoadingState('categories-container', 'categories');
        showLoadingState('users-container', 'users');

        const [products, categories, users] = await Promise.all([
            getProducts(),
            getCategories(),
            getUsers()
        ]);

        if (products) displayProducts(products);
        if (categories) displayCategories(categories);
        if (users) displayUsers(users);
        
        updateCounters(
            products?.length || 0,
            categories?.length || 0,
            users?.length || 0
        );

    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    if (document.getElementById('products-container')) {
        setupRefreshButtons();
        loadInitialData();
    }
});