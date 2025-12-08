import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    // 주문 초기화 함수
    const clearOrder = () => setSelectedProduct(null);

    return (
        <OrderContext.Provider value={{ selectedProduct, setSelectedProduct, clearOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);