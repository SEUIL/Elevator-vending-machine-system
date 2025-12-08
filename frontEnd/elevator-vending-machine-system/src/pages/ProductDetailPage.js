import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useOrder } from '../context/OrderContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setSelectedProduct } = useOrder();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                // ProductController의 @GetMapping("/{id}") 실행
                const response = await client.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("상세 정보 불러오기 실패:", error);
                alert("상품 정보를 찾을 수 없습니다.");
                navigate('/list');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id, navigate]);

    if (loading) return <div>로딩 중...</div>;
    if (!product) return null;

    const handleOrder = () => {
        if (product.stock <= 0) {
            alert("재고가 부족하여 주문할 수 없습니다.");
            return;
        }
        setSelectedProduct(product);
        navigate('/payment');
    };

    // 이미지 URL 처리 (http로 시작하지 않으면 서버 주소 붙여주기 등 상황에 맞게 조정 가능)
    // 현재는 DB에 저장된 URL을 그대로 사용한다고 가정합니다.
    const imageUrl = product.imageUrl
        ? `http://localhost:8080${product.imageUrl}`
        : "https://via.placeholder.com/300x400?text=No+Image";


    return (
        <div style={{
            padding: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            backgroundColor: '#f8f9fa'
        }}>
            {/* 메인 카드 컨테이너 */}
            <div style={{
                border: '2px solid #e0c188', // 디자인 시안의 금색 테두리
                borderRadius: '20px',
                padding: '40px',
                width: '100%',
                maxWidth: '700px',
                backgroundColor: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ textAlign: 'left', marginBottom: '30px', fontSize: '1.2rem', color: '#333' }}>
                    상세 정보
                </h2>

                <div style={{ display: 'flex', gap: '40px', flexDirection: 'row' }}>

                    {/* 왼쪽: 상품 이미지 */}
                    <div style={{ flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            style={{
                                width: '100%',
                                maxHeight: '300px',
                                objectFit: 'contain',
                                borderRadius: '10px'
                            }}
                        />
                    </div>

                    {/* 오른쪽: 텍스트 정보 */}
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            {/* [위치번호] 상품명 */}
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.8rem', fontWeight: 'bold' }}>
                                [{product.locationCode}] {product.name}
                            </h3>

                            {/* 상세 스펙 */}
                            <div style={{ color: '#555', fontSize: '1rem', lineHeight: '1.8' }}>
                                <p style={{ margin: 0 }}>
                                    {product.volume} / {product.calories}kcal
                                </p>
                                <p style={{ margin: 0 }}>
                                    유통기한: {product.expirationDate}
                                </p>
                                <p style={{ margin: 0 }}>
                                    알레르기 항목: {product.allergyInfo || '없음'}
                                </p>
                            </div>
                        </div>

                        {/* 가격 및 재고 (오른쪽 아래 정렬) */}
                        <div style={{ textAlign: 'right', marginTop: '30px' }}>
                            <p style={{ fontSize: '1.2rem', margin: '5px 0', color: '#666' }}>
                                구매 가능 재고 : <strong style={{ color: product.stock > 0 ? '#333' : 'red' }}>{product.stock}</strong>
                            </p>
                            <h2 style={{ margin: '0', fontSize: '2rem', color: '#000' }}>
                                {product.price.toLocaleString()}원
                            </h2>
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            flex: 1,
                            padding: '20px',
                            fontSize: '1.2rem',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: '#e0e0e0',
                            cursor: 'pointer'
                        }}>
                        뒤로 가기
                    </button>
                    <button
                        onClick={handleOrder}
                        disabled={product.stock <= 0}
                        style={{
                            flex: 1,
                            padding: '20px',
                            fontSize: '1.2rem',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: product.stock > 0 ? 'blue' : '#ccc',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                        }}>
                        {product.stock > 0 ? '결제 하기' : '품절'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;