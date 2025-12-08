import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import styled from 'styled-components';

// 스타일 컴포넌트 (재사용 가능하지만 관리자용 특색 반영)
const PageContainer = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f0f2f5; // 관리자 페이지는 살짝 다른 톤의 배경색 추천
`;

const DetailCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 700px;
  background-color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  background-color: ${props => props.stock > 5 ? '#2ecc71' : (props.stock > 0 ? '#f1c40f' : '#e74c3c')};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
  
  span:first-child { color: #666; font-weight: 500; }
  span:last-child { color: #333; font-weight: bold; }
`;

const Button = styled.button`
  flex: 1;
  padding: 15px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;

  &.edit { background-color: #3498db; color: white; &:hover { background-color: #2980b9; } }
  &.delete { background-color: #e74c3c; color: white; &:hover { background-color: #c0392b; } }
  &.back { background-color: #95a5a6; color: white; &:hover { background-color: #7f8c8d; } }
`;

const AdminProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await client.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("상세 정보 불러오기 실패:", error);
                alert("상품 정보를 찾을 수 없습니다.");
                navigate('/admin/list');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id, navigate]);

    // 상품 삭제 핸들러
    const handleDelete = async () => {
        if (window.confirm(`정말로 '[${product.name}]' 상품을 삭제하시겠습니까?`)) {
            try {
                await client.delete(`/products/${id}`);
                alert("상품이 삭제되었습니다.");
                navigate('/admin/list');
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!product) return null;

    // 이미지 URL 처리
    const imageUrl = product.imageUrl
        ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`)
        : "https://via.placeholder.com/300x300?text=No+Image";

    return (
        <PageContainer>
            <DetailCard>
                {/* 재고 상태 배지 */}
                <Badge stock={product.stock}>
                    {product.stock > 5 ? '재고 여유' : (product.stock > 0 ? '재고 부족 임박' : '품절')}
                </Badge>

                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
                    상품 관리 상세
                </h2>

                <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', marginBottom: '30px' }}>
                    {/* 상품 이미지 */}
                    <div style={{ flex: '0 0 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: '10px' }}>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                        />
                    </div>

                    {/* 상세 정보 테이블 */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <InfoRow><span>상품명</span> <span>{product.name}</span></InfoRow>
                        <InfoRow><span>위치 번호</span> <span>#{product.locationCode}</span></InfoRow>
                        <InfoRow><span>가격</span> <span>{product.price.toLocaleString()}원</span></InfoRow>
                        <InfoRow><span>재고 수량</span> <span style={{color: product.stock <= 2 ? 'red' : 'inherit'}}>{product.stock}개</span></InfoRow>
                        <InfoRow><span>용량</span> <span>{product.volume}</span></InfoRow>
                        <InfoRow><span>칼로리</span> <span>{product.calories}kcal</span></InfoRow>
                        <InfoRow><span>유통기한</span> <span>{product.expirationDate}</span></InfoRow>
                        <InfoRow><span>알레르기 정보</span> <span>{product.allergyInfo || '-'}</span></InfoRow>
                    </div>
                </div>

                {/* 관리 버튼 영역 */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Button className="back" onClick={() => navigate('/adminList')}>
                        목록으로
                    </Button>
                    <Button className="edit" onClick={() => navigate(`/adminForm/${product.id}`)}>
                        수정하기
                    </Button>
                    <Button className="delete" onClick={handleDelete}>
                        삭제하기
                    </Button>
                </div>
            </DetailCard>
        </PageContainer>
    );
};

export default AdminProductDetailPage;