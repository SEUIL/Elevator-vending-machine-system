import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useOrder } from '../context/OrderContext';

const PaymentPage = () => {
    const { selectedProduct } = useOrder();
    const navigate = useNavigate();
    const [paymentStep, setPaymentStep] = useState('SELECT');
    const [message, setMessage] = useState('');

    if (!selectedProduct) {
        navigate('/list');
        return null;
    }

    const processPayment = async (method) => {
        setPaymentStep('PROCESS');
        setMessage(method === 'CARD' ? '카드를 투입구에 넣어주세요...' : '현금을 투입해주세요...');

        // 백엔드 PaymentDto.Request 구조에 맞춰 데이터 생성
        const paymentData = {
            productId: selectedProduct.id,
            method: method,                 // "CARD" or "CASH"
            insertedAmount: selectedProduct.price, // 현금 투입 기능 없으므로 기본값
            needReceipt: false
        };

        try {
            // PaymentController의 @PostMapping 실행
            const response = await client.post('/api/payments', paymentData);

            if (response.data.success) {
                // 결제 성공
                navigate('/result');
            } else {
                // 결제 실패 (재고 부족, 잔액 부족 등)
                alert('결제 실패: ' + response.data.message);
                navigate('/list');
            }
        } catch (error) {
            console.error("결제 에러:", error);
            alert("시스템 오류로 결제가 취소되었습니다.");
            navigate('/');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>결제 화면</h2>
            <h3>상품명: {selectedProduct.name}</h3>
            <h3>총 결제 금액: {selectedProduct.price}원</h3>

            {paymentStep === 'SELECT' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '50px' }}>
                    <button onClick={() => processPayment('CASH')} style={{ padding: '30px', fontSize: '1.2rem' }}>
                        현금 결제
                    </button>
                    <button onClick={() => processPayment('CARD')} style={{ padding: '30px', fontSize: '1.2rem' }}>
                        카드 결제
                    </button>
                </div>
            )}

            {paymentStep === 'PROCESS' && (
                <div style={{ marginTop: '50px' }}>
                    <p>{message}</p>
                    <p>서버와 통신 중입니다...</p>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;