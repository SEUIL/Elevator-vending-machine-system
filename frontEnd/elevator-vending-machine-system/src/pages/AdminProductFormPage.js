import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import HangulKeypad from '../components/HangulKeypad'; // 한글/문자 키패드
import NumberKeypad from '../components/NumberKeypad'; // 숫자 전용 키패드
import styled from 'styled-components';

// 📅 DatePicker 관련 임포트
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // 스타일 파일
import { ko } from 'date-fns/locale'; // 한국어 설정

// --- 스타일 정의 ---
const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  label {
    flex: 0 0 120px;
    font-weight: bold;
    color: #333;
  }
  
  input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    font-size: 1rem;
    cursor: pointer;
    
    &:focus {
      outline: 2px solid #3498db;
    }
  }
`;

// DatePicker 스타일 커스텀 (기존 input과 비슷하게 맞춤)
const StyledDatePicker = styled(DatePicker)`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    font-size: 1rem;
    cursor: pointer;
    box-sizing: border-box;

    &:focus {
        outline: 2px solid #3498db;
    }
`;

const ImageUploadBox = styled.div`
    width: 150px;
    height: 150px;
    border: 2px dashed #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: 0 auto 20px auto;
    background-color: #f0f0f0;
    cursor: pointer;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    span {
        color: #888;
        font-size: 0.9rem;
        position: absolute;
        pointer-events: none;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 30px;

    button {
        flex: 1;
        padding: 15px;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
    }

    .cancel { background-color: #ccc; color: #333; }
    .submit { background-color: #3498db; color: white; }
`;

const AdminProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // 폼 데이터 상태 (DTO 필드와 일치)
    const [product, setProduct] = useState({
        name: '',
        locationCode: '',
        volume: '',
        calories: '',
        expirationDate: '', // LocalDate 형식 (YYYY-MM-DD)
        allergyInfo: '',
        price: '',
        stock: ''
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // 키패드 상태 관리
    const [activeField, setActiveField] = useState(null);
    const [showKeyboard, setShowKeyboard] = useState(false);

    // 초기 데이터 로딩 (수정 모드)
    useEffect(() => {
        if (isEditMode) {
            client.get(`/products/${id}`)
                .then(res => {
                    setProduct(res.data);
                    // 이미지 URL 처리
                    if (res.data.imageUrl) {
                        const url = res.data.imageUrl.startsWith('http')
                            ? res.data.imageUrl
                            : `http://localhost:8080${res.data.imageUrl}`;
                        setPreview(url);
                    }
                })
                .catch(() => alert("상품 정보를 불러오지 못했습니다."));
        }
    }, [id, isEditMode]);

    // 입력 필드 터치 시 키보드 활성화
    const handleFieldClick = (fieldName) => {
        setActiveField(fieldName);
        setShowKeyboard(true);
    };

    // 키보드 입력 처리
    const handleInput = (text) => {
        if (activeField) {
            setProduct(prev => ({ ...prev, [activeField]: text }));
        }
    };

    // 📅 날짜 변경 핸들러 (Date 객체 -> YYYY-MM-DD 문자열 변환)
    const handleDateChange = (date) => {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;

            setProduct(prev => ({ ...prev, expirationDate: formattedDate }));
        } else {
            setProduct(prev => ({ ...prev, expirationDate: '' }));
        }
    };

    // 파일 선택
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    // 폼 제출
    const handleSubmit = async () => {
        // 1. 유효성 검사 (필수 항목 체크)
        // 빈 값이 있으면 서버로 보내기 전에 막습니다.
        if (!product.name || !product.price || !product.locationCode || !product.stock) {
            alert("필수 항목(이름, 가격, 위치번호, 재고)을 입력해주세요.");
            return;
        }

        // 2. 데이터 타입 변환 (핵심! ⭐)
        // 입력값(문자열)을 서버가 원하는 타입(숫자, Null)으로 변환합니다.
        const productToSend = {
            ...product,
            // "1500" -> 1500 (진짜 숫자로 변환)
            price: Number(product.price),
            stock: Number(product.stock),
            locationCode: Number(product.locationCode),

            // 값이 비어있으면 '' 대신 null을 보내야 에러가 안 납니다.
            calories: product.calories ? Number(product.calories) : null,
            // 날짜가 비어있으면 null 처리
            expirationDate: product.expirationDate || null,
            allergyInfo: product.allergyInfo || null
        };

        const formData = new FormData();
        // 3. 변환된 데이터(productToSend)를 JSON으로 포장
        formData.append("request", new Blob([JSON.stringify(productToSend)], { type: "application/json" }));

        // 파일 데이터 추가
        if (file) formData.append("file", file);

        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            if (isEditMode) await client.put(`/products/${id}`, formData, config);
            else await client.post('/products', formData, config);

            alert(isEditMode ? "수정 완료!" : "등록 완료!");
            navigate('/adminList');
        } catch (error) {
            console.error(error);
            // 에러 메시지 출력
            const errorMsg = error.response?.data?.message || "입력값을 확인해주세요. (중복된 위치 번호이거나 서버 오류입니다)";
            alert("저장 실패! " + errorMsg);
        }
    };
    // 숫자 키패드를 사용할 필드 목록
    const numericFields = ['locationCode', 'calories', 'price', 'stock'];

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '300px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                {isEditMode ? '상품 정보 수정' : '신규 상품 등록'}
            </h2>

            <FormContainer>
                {/* 이미지 업로드 영역 */}
                <label htmlFor="file-input">
                    <ImageUploadBox>
                        {preview ? <img src={preview} alt="미리보기" /> : <span>📷 사진 업로드</span>}
                    </ImageUploadBox>
                </label>
                <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

                {/* 1. 상품명 (한글) */}
                <FormGroup>
                    <label>상품명</label>
                    <input type="text" value={product.name} onClick={() => handleFieldClick('name')} readOnly placeholder="터치하여 입력" />
                </FormGroup>

                {/* 2. 위치 번호 (숫자) */}
                <FormGroup>
                    <label>위치 번호</label>
                    <input type="number" value={product.locationCode} onClick={() => handleFieldClick('locationCode')} readOnly placeholder="예: 101" />
                </FormGroup>

                {/* 3. 상품 용량 (문자 - ml 단위 때문) */}
                <FormGroup>
                    <label>상품 용량</label>
                    <input type="text" value={product.volume} onClick={() => handleFieldClick('volume')} readOnly placeholder="예: 350ml" />
                </FormGroup>

                {/* 4. 칼로리 (숫자) */}
                <FormGroup>
                    <label>칼로리</label>
                    <input type="number" value={product.calories} onClick={() => handleFieldClick('calories')} readOnly placeholder="kcal" />
                </FormGroup>

                {/* 5. 유통기한 (DatePicker 사용 - 키패드 대신 달력 팝업) */}
                <FormGroup>
                    <label>유통기한</label>
                    <StyledDatePicker
                        selected={product.expirationDate ? new Date(product.expirationDate) : null}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        locale={ko}
                        placeholderText="날짜를 선택하세요"
                        // onFocus 시 키패드가 뜨지 않도록 처리 (이미 readOnly 속성처럼 동작)
                        onFocus={() => setShowKeyboard(false)}
                    />
                </FormGroup>

                {/* 6. 알레르기 (문자) */}
                <FormGroup>
                    <label>알레르기 정보</label>
                    <input type="text" value={product.allergyInfo} onClick={() => handleFieldClick('allergyInfo')} readOnly placeholder="없음" />
                </FormGroup>

                {/* 7. 재고 (숫자) */}
                <FormGroup>
                    <label>재고 수량</label>
                    <input type="number" value={product.stock} onClick={() => handleFieldClick('stock')} readOnly placeholder="개" />
                </FormGroup>

                {/* 8. 가격 (숫자) */}
                <FormGroup>
                    <label>상품 가격</label>
                    <input type="number" value={product.price} onClick={() => handleFieldClick('price')} readOnly placeholder="원" />
                </FormGroup>

                {/* 하단 버튼 */}
                <ButtonGroup>
                    <button className="cancel" onClick={() => navigate('/adminList')}>취소</button>
                    <button className="submit" onClick={handleSubmit}>{isEditMode ? "수정 완료" : "등록 완료"}</button>
                </ButtonGroup>
            </FormContainer>

            {/* 키패드 컴포넌트 조건부 렌더링 */}
            {showKeyboard && (
                numericFields.includes(activeField) ? (
                    <NumberKeypad
                        onInput={handleInput}
                        onClose={() => setShowKeyboard(false)}
                    />
                ) : (
                    <HangulKeypad
                        onInput={handleInput}
                        onClose={() => setShowKeyboard(false)}
                    />
                )
            )}
        </div>
    );
};

export default AdminProductFormPage;