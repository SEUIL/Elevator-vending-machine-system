import React, { useState } from 'react';
import styled from 'styled-components';
import * as Hangul from 'hangul-js'; // 한글 조합 라이브러리

// --- 스타일 정의 (기존 유지) ---
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
`;

const KeyButton = styled.button`
    flex: 1;
    max-width: ${props => props.width || '60px'};
    height: 55px;
    background-color: ${props => props.bgColor || 'white'};
    border: none;
    border-radius: 5px;
    font-size: 1.2rem;
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
const LAYOUTS = {
    ENG: [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ],
    ENG_SHIFT: [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ],
    KOR: [
        ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
        ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
        ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']
    ],
    KOR_SHIFT: [
        ['ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅒ', 'ㅖ'],
        ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
        ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']
    ],
    // ➕ 숫자 및 특수문자 레이아웃 추가
    NUM: [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['-', '/', ':', ';', '(', ')', '₩', '&', '@', '"'],
        ['.', ',', '?', '!', "'", '[', ']']
    ]
};

const HangulKeypad = ({ onInput, onClose }) => {
    const [lang, setLang] = useState('KOR'); // KOR or ENG
    const [isNumMode, setIsNumMode] = useState(false); // 숫자 모드 여부
    const [shift, setShift] = useState(false);
    const [inputStack, setInputStack] = useState([]); // 낱자(자소) 저장용 스택

    // 현재 보여줄 레이아웃 결정
    const getLayout = () => {
        if (isNumMode) return LAYOUTS.NUM; // 숫자 모드면 숫자 레이아웃 반환
        if (lang === 'ENG') return shift ? LAYOUTS.ENG_SHIFT : LAYOUTS.ENG;
        return shift ? LAYOUTS.KOR_SHIFT : LAYOUTS.KOR;
    };

    // 입력 처리
    const handleKeyClick = (key) => {
        const newStack = [...inputStack, key];
        setInputStack(newStack);
        // hangul-js는 숫자나 특수문자가 섞여도 문제없이 처리합니다 (그대로 붙임)
        onInput(Hangul.assemble(newStack));
    };

    // 지우기 (Backspace)
    const handleDelete = () => {
        if (inputStack.length === 0) return;
        const newStack = inputStack.slice(0, -1);
        setInputStack(newStack);
        onInput(Hangul.assemble(newStack));
    };

    // 띄어쓰기
    const handleSpace = () => {
        const newStack = [...inputStack, ' '];
        setInputStack(newStack);
        onInput(Hangul.assemble(newStack));
    };

    // 전체 삭제
    const handleClear = () => {
        setInputStack([]);
        onInput("");
    };

    return (
        <KeyboardContainer>
            {/* 닫기 바 */}
            <div style={{width: '100%', textAlign: 'right', paddingRight: '20px'}}>
                <button onClick={onClose} style={{padding: '5px 15px', background: '#e74c3c', color: 'white', border:'none', borderRadius: '4px'}}>닫기</button>
            </div>

            {/* 키 버튼들 렌더링 */}
            {getLayout().map((row, rowIndex) => (
                <KeyRow key={rowIndex}>
                    {row.map((char) => (
                        <KeyButton key={char} onClick={() => handleKeyClick(char)}>
                            {char}
                        </KeyButton>
                    ))}
                </KeyRow>
            ))}

            {/* 기능 키 행 */}
            <KeyRow>
                {/* 1. Shift 키 (숫자 모드일 땐 비활성화 처리) */}
                <KeyButton
                    width="80px"
                    bgColor={isNumMode ? "#e5e7eb" : "#a5b4fc"}
                    onClick={() => !isNumMode && setShift(!shift)}
                    disabled={isNumMode} // 숫자 모드에선 Shift 불필요
                    style={{ opacity: isNumMode ? 0.5 : 1 }}
                >
                    {shift ? 'Shift ⬆' : 'Shift'}
                </KeyButton>

                {/* 2. 숫자/문자 전환 키 */}
                <KeyButton
                    width="80px"
                    bgColor="#fbbf24"
                    onClick={() => setIsNumMode(!isNumMode)}
                >
                    {isNumMode ? (lang === 'KOR' ? '한글' : 'Eng') : '123'}
                </KeyButton>

                {/* 3. 한/영 전환 키 (숫자 모드일 땐 숨기거나 비활성화, 여기선 비활성화) */}
                <KeyButton
                    width="80px"
                    bgColor="#fbbf24"
                    onClick={() => {
                        if (!isNumMode) {
                            setLang(lang === 'KOR' ? 'ENG' : 'KOR');
                            setShift(false);
                        } else {
                            // 숫자 모드 상태에서 누르면 문자 모드로 돌아가면서 언어 변경
                            setIsNumMode(false);
                            setLang(lang === 'KOR' ? 'ENG' : 'KOR');
                        }
                    }}
                >
                    {lang === 'KOR' ? '한/영' : 'Eng/Kor'}
                </KeyButton>

                <KeyButton width="150px" onClick={handleSpace}>Space</KeyButton>
                <KeyButton width="70px" bgColor="#fca5a5" onClick={handleDelete}>⌫</KeyButton>
                <KeyButton width="50px" bgColor="#ffcccc" onClick={handleClear}>C</KeyButton>
            </KeyRow>
        </KeyboardContainer>
    );
};

export default HangulKeypad;