✅ 정리 및 프론트엔드 주의사항
이제 백엔드는 진짜 이미지를 받아서 서버(C:/elevator-vending-uploads/)에 저장하고, DB에는 /images/파일명.jpg라는 주소를 저장합니다.

프론트엔드 팀원에게 전달할 내용:

보내는 방식 변경: 상품 등록/수정 시 JSON만 보내는 게 아니라 FormData 객체를 사용해야 합니다.


```javascript
const formData = new FormData();
// JSON 데이터는 Blob으로 감싸서 'request'라는 이름으로 추가
formData.append("request", new Blob([JSON.stringify(productData)], { type: "application/json" }));
// 이미지 파일은 'file'이라는 이름으로 추가
formData.append("file", fileInput.files[0]);

// axios 요청 (헤더 Content-Type은 axios가 자동으로 multipart/form-data로 설정함)
axios.post('/api/products', formData);
```
