import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const AdminProductListPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    // 상품 목록 불러오기
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await client.get('/products');
            setProducts(res.data);
        } catch (err) {
            alert("목록을 불러오지 못했습니다.");
        }
    };

    // 상품 삭제 핸들러 (이벤트 버블링 방지 필요)
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // ⭐️ 중요: 카드 클릭 이벤트가 발생하지 않도록 막음

        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await client.delete(`/products/${id}`);
                alert("삭제되었습니다.");
                fetchProducts(); // 목록 새로고침
            } catch (err) {
                alert("삭제 실패");
            }
        }
    };

    // 수정 페이지 이동 핸들러 (이벤트 버블링 방지)
    const handleEdit = (e, id) => {
        e.stopPropagation();
        navigate(`/adminForm/${id}`); // 라우트 경로 주의 (/adminForm/:id 인지 /edit/:id 인지 App.js 확인)
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>상품 관리</h2>
                <div>
                    <button
                        onClick={() => navigate('/create')} // 라우트 경로 주의 (/adminForm 인지 /create 인지 App.js 확인)
                        style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px', cursor: 'pointer' }}
                    >
                        + 신규 상품 등록
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        사용자 모드로 돌아가기
                    </button>
                </div>
            </div>

            {/* 리스트형 UI (관리자용) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {products.map((product) => (
                    <div
                        key={product.id}
                        // ⭐️ 카드 전체 클릭 시 상세 페이지로 이동
                        onClick={() => navigate(`/adminDetail/${product.id}`)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'white',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            cursor: 'pointer', // 클릭 가능하다는 표시
                            transition: 'transform 0.1s', // 살짝 눌리는 효과
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {/* 왼쪽: 상품 정보 (이미지 + 이름 + 가격) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 2 }}>
                            <div style={{ fontWeight: 'bold', color: '#555', minWidth: '40px' }}>#{product.locationCode}</div>
                            <img
                                src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`) : "https://via.placeholder.com/50"}
                                alt={product.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                            />
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{product.name}</h3>
                                <span style={{ color: '#888' }}>{product.price.toLocaleString()}원</span>
                            </div>
                        </div>

                        {/* 가운데: 재고 상태 */}
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>현재 재고</span>
                            <strong style={{ fontSize: '1.3rem', color: product.stock <= 2 ? '#e74c3c' : '#2980b9' }}>
                                {product.stock}개
                            </strong>
                        </div>

                        {/* 오른쪽: 관리 버튼 (수정/삭제) */}
                        <div style={{ display: 'flex', gap: '10px', flex: 1, justifyContent: 'flex-end' }}>
                            <button
                                onClick={(e) => handleEdit(e, product.id)}
                                style={{ padding: '8px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                수정
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, product.id)}
                                style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                        등록된 상품이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductListPage;