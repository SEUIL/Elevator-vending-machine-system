import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // 또는 CSS 파일 사용

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  font-size: 2rem;
  cursor: pointer;
`;

const IntroPage = () => {
    const navigate = useNavigate();

    return (
        <FullScreen onClick={() => navigate('/list')}>
            <h1>화면을 터치하여 주문을 시작하세요</h1>
        </FullScreen>
    );
};

export default IntroPage;