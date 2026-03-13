/**
 * Product API/Data Management
 */

const PRODUCTS = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 89.99,
        oldPrice: 129.99,
        category: 'electronics',
        rating: 5,
        reviews: 234,
        description: 'High-quality sound with noise cancellation and 30-hour battery life.',
        image: 'https://via.placeholder.com/300x300?text=Headphones',
        stock: 15,
        brand: 'AudioPro',
        sku: 'AP-001'
    },
    {
        id: 2,
        name: 'Classic Cotton T-Shirt',
        price: 24.99,
        oldPrice: 34.99,
        category: 'clothing',
        rating: 4,
        reviews: 156,
        description: '100% organic cotton, comfortable and durable.',
        image: 'https://via.placeholder.com/300x300?text=T-Shirt',
        stock: 50,
        brand: 'StyleComfort',
        sku: 'SC-001'
    },
    {
        id: 3,
        name: 'Running Shoes Pro',
        price: 129.99,
        category: 'shoes',
        rating: 5,
        reviews: 312,
        description: 'Lightweight and cushioned for maximum comfort during runs.',
        image: 'https://via.placeholder.com/300x300?text=Running+Shoes',
        stock: 25,
        brand: 'SportFit',
        sku: 'SF-001'
    },
    {
        id: 4,
        name: 'Leather Crossbody Bag',
        price: 79.99,
        oldPrice: 99.99,
        category: 'accessories',
        rating: 5,
        reviews: 89,
        description: 'Premium leather with adjustable strap and multiple compartments.',
        image: 'https://via.placeholder.com/300x300?text=Bag',
        stock: 12,
        brand: 'LuxeCarry',
        sku: 'LC-001'
    },
    {
        id: 5,
        name: 'Smart Watch Ultra',
        price: 299.99,
        oldPrice: 399.99,
        category: 'electronics',
        rating: 4,
        reviews: 423,
        description: 'Advanced fitness tracking and heart rate monitoring.',
        image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
        stock: 8,
        brand: 'TechFlow',
        sku: 'TF-001'
    },
    {
        id: 6,
        name: 'Winter Jacket',
        price: 179.99,
        category: 'clothing',
        rating: 5,
        reviews: 267,
        description: 'Water-resistant with thermal insulation for cold weather.',
        image: 'https://via.placeholder.com/300x300?text=Jacket',
        stock: 20,
        brand: 'WarmTech',
        sku: 'WT-001'
    },
    {
        id: 7,
        name: 'Casual Sneakers',
        price: 69.99,
        oldPrice: 89.99,
        category: 'shoes',
        rating: 4,
        reviews: 198,
        description: 'Comfortable everyday shoes with modern design.',
        image: 'https://via.placeholder.com/300x300?text=Sneakers',
        stock: 35,
        brand: 'StyleStep',
        sku: 'SS-001'
    },
    {
        id: 8,
        name: 'Stainless Steel Watch',
        price: 189.99,
        category: 'accessories',
        rating: 5,
        reviews: 145,
        description: 'Elegant timepiece with automatic movement.',
        image: 'https://via.placeholder.com/300x300?text=Watch',
        stock: 10,
        brand: 'TimeLux',
        sku: 'TL-001'
    },
    {
        id: 9,
        name: 'Wireless Charger',
        price: 49.99,
        oldPrice: 69.99,
        category: 'electronics',
        rating: 4,
        reviews: 234,
        description: 'Fast charging for all compatible devices.',
        image: 'https://via.placeholder.com/300x300?text=Charger',
        stock: 40,
        brand: 'PowerTech',
        sku: 'PT-001'
    },
    {
        id: 10,
        name: 'Slim Fit Jeans',
        price: 59.99,
        category: 'clothing',
        rating: 4,
        reviews: 178,
        description: 'Stylish and comfortable denim pants.',
        image: 'https://via.placeholder.com/300x300?text=Jeans',
        stock: 45,
        brand: 'DenimStyle',
        sku: 'DS-001'
    }
];

function getProducts() {
    return PRODUCTS;
}

function getProductById(id) {
    return PRODUCTS.find(p => p.id === parseInt(id));
}

function searchProducts(query) {
    return PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
}

function getProductsByCategory(category) {
    return PRODUCTS.filter(p => p.category === category);
}