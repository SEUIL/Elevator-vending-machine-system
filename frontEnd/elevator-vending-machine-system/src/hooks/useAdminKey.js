import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAdminKey = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // 🔑 F10 키 감지
            if (e.key === 'F10') {

                // 1. 이미 관리자 페이지(/admin...)에 있다면 -> 홈으로 복귀
                if (location.pathname.startsWith('/admin')) {
                    console.log("관리자 키 해제: 홈으로 이동");
                    navigate('/');
                }
                // 2. 아니면 -> 묻지도 따지지도 않고 바로 관리자 목록으로 이동
                else {
                    console.log("관리자 키 인식: 목록으로 이동");
                    // App.js에 설정된 라우트 주소로 이동 (/admin/list 또는 /adminList)
                    navigate('/adminList');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, location]);
};

export default useAdminKey;