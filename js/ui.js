import { getProductDetails, getCategoryDetails, getUserDetails } from './api.js';

export function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-box-open fa-3x mb-3 text-muted"></i>
                <p class="text-muted">No se encontraron productos</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="card product-card h-100">
                <img src="${product.images[0] || 'https://via.placeholder.com/300'}" 
                     class="card-img-top product-img" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-truncate">${product.description}</p>
                    <p class="text-primary fw-bold">$${product.price}</p>
                    <button class="btn btn-sm btn-primary view-details" 
                            data-id="${product.id}" data-type="product">
                        <i class="fas fa-eye me-1"></i>Ver detalles
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    addDetailsEventListeners();
}

export function displayCategories(categories) {
    const container = document.getElementById('categories-container');
    
    if (!categories || categories.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-tags fa-3x mb-3 text-muted"></i>
                <p class="text-muted">No se encontraron categorías</p>
            </div>
        `;
        return;
    }

    container.innerHTML = categories.map(category => `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="card h-100">
                <img src="${category.image || 'https://via.placeholder.com/300'}" 
                     class="card-img-top" alt="${category.name}" style="height: 120px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${category.name}</h5>
                    <button class="btn btn-sm btn-outline-success view-details" 
                            data-id="${category.id}" data-type="category">
                        <i class="fas fa-eye me-1"></i>Ver detalles
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    addDetailsEventListeners();
}

export function displayUsers(users) {
    const container = document.getElementById('users-container');
    
    if (!users || users.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <i class="fas fa-users fa-3x mb-3 text-muted"></i>
                    <p class="text-muted">No se encontraron usuarios</p>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = users.map(user => `
        <tr>
            <td>
                <img src="${user.avatar || 'https://via.placeholder.com/50'}" 
                     class="rounded-circle" width="40" alt="${user.name}">
            </td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.role}</span></td>
            <td>
                <button class="btn btn-sm btn-info view-details" 
                        data-id="${user.id}" data-type="user">
                    <i class="fas fa-eye me-1"></i>Detalles
                </button>
            </td>
        </tr>
    `).join('');

    addDetailsEventListeners();
}

export function updateCounters(productsCount, categoriesCount, usersCount) {
    document.getElementById('productsCount').textContent = productsCount;
    document.getElementById('categoriesCount').textContent = categoriesCount;
    document.getElementById('usersCount').textContent = usersCount;
}

export async function showDetailsModal(id, type) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
    
    try {
        let data, content;
        
        switch(type) {
            case 'product':
                data = await getProductDetails(id);
                modalTitle.textContent = data.title;
                content = `
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${data.images[0] || 'https://via.placeholder.com/400'}" 
                                 class="img-fluid rounded mb-3" alt="${data.title}">
                            <div class="d-flex overflow-auto mb-3">
                                ${data.images.map(img => `
                                    <img src="${img}" class="img-thumbnail me-2" width="80" alt="Miniatura">
                                `).join('')}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h4>${data.title}</h4>
                            <p class="text-primary fw-bold h3">$${data.price}</p>
                            <p><span class="badge bg-success">${data.category?.name || 'Sin categoría'}</span></p>
                            <p>${data.description}</p>
                            <div class="mt-4">
                                <p><strong>Creación:</strong> ${new Date(data.creationAt).toLocaleDateString()}</p>
                                <p><strong>Actualización:</strong> ${new Date(data.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'category':
                data = await getCategoryDetails(id);
                modalTitle.textContent = data.name;
                content = `
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${data.image || 'https://via.placeholder.com/400'}" 
                                 class="img-fluid rounded mb-3" alt="${data.name}">
                        </div>
                        <div class="col-md-6">
                            <h4>${data.name}</h4>
                            <p>${data.description || 'No hay descripción disponible para esta categoría.'}</p>
                            <div class="mt-4">
                                <p><strong>Creación:</strong> ${new Date(data.creationAt).toLocaleDateString()}</p>
                                <p><strong>Actualización:</strong> ${new Date(data.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'user':
                data = await getUserDetails(id);
                modalTitle.textContent = data.name;
                content = `
                    <div class="row">
                        <div class="col-md-4 text-center">
                            <img src="${data.avatar || 'https://via.placeholder.com/200'}" 
                                 class="img-fluid rounded-circle mb-3" width="200" alt="${data.name}">
                            <p><span class="badge ${data.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${data.role}</span></p>
                        </div>
                        <div class="col-md-8">
                            <h4>${data.name}</h4>
                            <p class="text-muted">${data.email}</p>
                            
                            <div class="mt-4">
                                <h5>Información</h5>
                                <p><strong>Registro:</strong> ${new Date(data.createdAt).toLocaleDateString()}</p>
                                <p><strong>Actualización:</strong> ${new Date(data.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        modalBody.innerHTML = content || `<div class="alert alert-danger">No se pudieron cargar los detalles</div>`;
    } catch (error) {
        console.error('Error loading details:', error);
        modalBody.innerHTML = `<div class="alert alert-danger">Error al cargar los detalles</div>`;
    }
}

function addDetailsEventListeners() {
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.closest('button').getAttribute('data-id');
            const type = e.target.closest('button').getAttribute('data-type');
            showDetailsModal(id, type);
        });
    });
}