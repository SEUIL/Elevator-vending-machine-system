import React, { useState } from 'react';
import styled from 'styled-components';

// --- 스타일 정의 (HangulKeypad와 동일) ---
const KeyboardContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #d1d5db;
  padding: 10px 0 30px 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const KeyRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  width: 98%;
  max-width: 500px; // 숫자 키패드는 너무 넓어지지 않게 제한
`;

const KeyButton = styled.button`
  flex: 1;
  max-width: ${props => props.width || '100%'}; // 기본 너비를 꽉 차게 변경
  height: 60px; // 숫자 키패드는 버튼이 적으므로 조금 더 높게
  background-color: ${props => props.bgColor || 'white'};
  border: none;
  border-radius: 5px;
  font-size: 1.5rem; // 글자 크기도 키움
  font-weight: bold;
  box-shadow: 0 2px 0px #888;
  cursor: pointer;
  color: #333;

  &:active {
    transform: translateY(2px);
    box-shadow: none;
  }
`;

// --- 레이아웃 데이터 ---
const NUM_LAYOUT = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '⌫']
];

const NumberKeypad = ({ onInput, onClose }) => {
    // 입력된 숫자들을 저장하는 스택 (HangulKeypad와 로직 일관성 유지)
    const [inputStack, setInputStack] = useState([]);

    // 숫자 입력 처리
    const handleKeyClick = (key) => {
        // C나 Backspace는 별도 함수로 처리하므로 여기선 숫자만 들어옴
        const newStack = [...inputStack, key];
        setInputStack(newStack);
        onInput(newStack.join('')); // 배열을 문자열로 합쳐서 전달
    };

    // 지우기 (Backspace)
    const handleDelete = () => {
        if (inputStack.length === 0) return;
        const newStack = inputStack.slice(0, -1);
        setInputStack(newStack);
        onInput(newStack.join(''));
    };

    // 전체 삭제 (Clear)
    const handleClear = () => {
        setInputStack([]);
        onInput("");
    };

    return (
        <KeyboardContainer>
            {/* 닫기 바 */}
            <div style={{width: '100%', textAlign: 'right', paddingRight: '20px'}}>
                <button
                    onClick={onClose}
                    style={{
                        padding: '5px 15px',
                        background: '#e74c3c',
                        color: 'white',
                        border:'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    닫기
                </button>
            </div>

            {/* 숫자 키 버튼들 */}
            {NUM_LAYOUT.map((row, rowIndex) => (
                <KeyRow key={rowIndex}>
                    {row.map((char) => {
                        // 특수 키에 대한 스타일 및 핸들러 분기
                        let bgColor = 'white';
                        let onClickHandler = () => handleKeyClick(char);

                        if (char === 'C') {
                            bgColor = '#ffcccc'; // 연한 빨강
                            onClickHandler = handleClear;
                        } else if (char === '⌫') {
                            bgColor = '#fca5a5'; // 조금 더 진한 빨강
                            onClickHandler = handleDelete;
                        }

                        return (
                            <KeyButton
                                key={char}
                                bgColor={bgColor}
                                onClick={onClickHandler}
                            >
                                {char}
                            </KeyButton>
                        );
                    })}
                </KeyRow>
            ))}
        </KeyboardContainer>
    );
};

export default NumberKeypad;