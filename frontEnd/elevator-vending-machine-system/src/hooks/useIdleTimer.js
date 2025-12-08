import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const useIdleTimer = (timeout = 30000) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearOrder } = useOrder();

    useEffect(() => {
        // 대기 화면('/')에서는 타이머 작동 안 함
        if (location.pathname === '/') return;

        let timer;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                console.log("30초 비활동 -> 초기화");
                clearOrder(); // 주문 정보 초기화
                navigate('/'); // 홈으로 이동
            }, timeout);
        };

        // 터치나 클릭 이벤트 발생 시 타이머 리셋
        window.addEventListener('click', resetTimer);
        window.addEventListener('touchstart', resetTimer);

        resetTimer(); // 초기 실행

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
        };
    }, [navigate, location.pathname, timeout, clearOrder]);
};

export default useIdleTimer;