// ProductsContext.js
import React, { createContext, useContext, useState } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const addProduct = product => {
        setProducts(currentProducts => [...currentProducts, product]);
    };

    const removeProduct = productName => {
        setProducts(currentProducts => currentProducts.filter(p => p.name !== productName));
    };

    const updateProduct = updatedProduct => {
        setProducts(currentProducts => currentProducts.map(p =>
            p.name === updatedProduct.name ? updatedProduct : p
        ));
    };

    const getProduct = productName => {
        return products.find(p => p.name === productName);
    };

    return (
        <ProductsContext.Provider value={{ products, addProduct, removeProduct, updateProduct, getProduct }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};
