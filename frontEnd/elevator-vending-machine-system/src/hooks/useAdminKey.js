import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../api/client'; // axios 클라이언트

const useAdminKey = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleKeyDown = async (e) => {
            // 🔑 F10 키를 '물리적 관리자 키 삽입'이라고 가정
            if (e.key === 'F10') {

                // 1. 이미 관리자 메뉴에 있다면? -> 키를 뽑는(돌리는) 행위로 간주하여 홈으로 이동
                if (location.pathname.startsWith('/admin')) {
                    console.log("관리자 키 해제: 홈으로 이동");
                    navigate('/');
                    return;
                }

                // 2. 관리자 모드가 아니라면? -> "자동 로그인" 시도
                console.log("관리자 키 인식됨: 자동 로그인 시도 중...");

                try {
                    // 📡 백엔드에 '미리 약속된' 관리자 계정으로 인증 요청
                    // (실제로는 하드웨어 고유 ID 등을 사용하지만, 여기선 admin/1234로 가정)
                    await client.get('/auth/login', {
                        auth: {
                            username: 'admin', // 스프링부트 Security 설정에 맞는 ID
                            password: '1234'   // 스프링부트 Security 설정에 맞는 PW
                        }
                    });

                    // ✅ 인증 성공 시 바로 메뉴로 이동 (화면 입력 없음!)
                    alert("관리자 모드로 전환됩니다.");
                    navigate('/adminList');

                } catch (error) {
                    // ❌ 인증 실패 (서버 꺼짐, 비번 틀림 등)
                    console.error("키 인증 실패:", error);
                    alert("관리자 키 인증에 실패했습니다. (서버 연결 또는 권한 확인)");
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, location]);
};

export default useAdminKey;