import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client'; // 위에서 만든 설정 파일 임포트
import styled from 'styled-components';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
`;

const Card = styled.div`
    border: 1px solid #ddd;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    opacity: ${props => (props.soldOut ? 0.5 : 1)};
    pointer-events: ${props => (props.soldOut ? 'none' : 'auto')};

    &:hover { background-color: #f9f9f9; }
`;

const ProductListPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // 데이터를 담을 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(res => res.json())
            .then(data => console.log("연결 성공:", data))
            .catch(err => console.error("연결 실패:", err));
    }, []);

    // 화면이 켜지면 스프링부트에 데이터 요청
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // ProductController의 @GetMapping 실행
                const response = await client.get('/products');
                setProducts(response.data); // 받아온 데이터를 상태에 저장
            } catch (error) {
                console.error("상품 불러오기 실패:", error);
                alert("상품 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>상품 정보를 불러오는 중...</div>;

    return (
        <div>
            <h2>상품을 선택하세요</h2>
            <Grid>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        // DTO 필드명에 맞춰서 수정 (예: stock -> stockQuantity 등 확인 필요)
                        soldOut={product.stock <= 0}
                        onClick={() => navigate(`/detail/${product.id}`)}
                    >
                        {/* 이미지 경로가 절대경로(http...)인지 상대경로(/images...)인지에 따라 처리 필요 */}
                        {product.imageUrl ? (
                            <img
                                src={`http://localhost:8080${product.imageUrl}`}
                                alt={product.name}
                                style={{ height: '100px' }}
                            />

                        ) : (
                            <div style={{height: '100px', background: '#eee'}}>이미지 없음</div>
                        )}
                        <h3>{product.name}</h3>
                        <p>{product.price}원</p>
                        {product.stock <= 0 && <span style={{color: 'red'}}>품절</span>}
                    </Card>
                ))}
            </Grid>
        </div>
    );
};

export default ProductListPage;