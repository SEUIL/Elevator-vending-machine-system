import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const ResultPage = () => {
    const navigate = useNavigate();
    const { selectedProduct, clearOrder } = useOrder();

    useEffect(() => {
        // 5초 뒤에 자동으로 초기 화면으로 복귀
        const timer = setTimeout(() => {
            clearOrder();
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, clearOrder]);

    if (!selectedProduct) return null;

    return (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1>주문이 완료되었습니다!</h1>
            <h2>{selectedProduct.name}</h2>
            <p>아래 취출구에서 상품을 가져가세요.</p>
            <p>5초 후 초기 화면으로 돌아갑니다.</p>
        </div>
    );
};

export default ResultPage;