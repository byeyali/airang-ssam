# Azure Static Web Apps 배포 가이드

## 로컬 vs 배포 환경 차이점

### 로컬 환경 (정상 작동)

- `npm start`로 개발 서버 실행
- 환경 변수가 `.env` 파일에서 로드됨
- CORS 제한이 없음
- API 호출이 직접 이루어짐

### Azure Static Web Apps 환경 (문제 발생 가능)

- 정적 파일만 서빙
- 환경 변수가 빌드 시점에 주입됨
- CORS 정책이 엄격함
- API 호출이 외부 도메인으로 이루어짐

## 환경 변수 설정

Azure Static Web Apps에서 환경 변수를 설정하려면:

### 1. Azure Portal에서 설정

1. Azure Portal에서 Static Web App 리소스로 이동
2. 왼쪽 메뉴에서 "Configuration" 선택
3. "Application settings" 탭에서 다음 환경 변수 추가:

```
REACT_APP_BACKEND_URL=https://airang-apin.azurewebsites.net
REACT_APP_API_URL=https://airang-apin.azurewebsites.net
REACT_APP_BASEURL=https://airang-apin.azurewebsites.net
```

### 2. Azure CLI를 통한 설정

```bash
az staticwebapp appsettings set \
  --name your-app-name \
  --setting-names REACT_APP_BACKEND_URL=https://airang-apin.azurewebsites.net \
  REACT_APP_API_URL=https://airang-apin.azurewebsites.net \
  REACT_APP_BASEURL=https://airang-apin.azurewebsites.net
```

### 3. 빌드 시 환경 변수 주입

```bash
# 프로덕션 빌드
npm run build

# 개발용 빌드 (로컬 테스트용)
npm run build:dev
```

## 로그인 오류 해결 방법

### 1. CORS 설정 확인

백엔드 API 서버에서 다음 CORS 설정이 되어 있는지 확인:

```javascript
// 백엔드 CORS 설정 예시
app.use(
  cors({
    origin: [
      "https://your-static-web-app.azurestaticapps.net",
      "http://localhost:3000",
      "https://airang-apin.azurewebsites.net",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 2. API 엔드포인트 확인

- 백엔드 API가 정상적으로 실행 중인지 확인
- API URL이 올바른지 확인
- 네트워크 탭에서 실제 요청/응답 확인

### 3. 인증 토큰 관리

- localStorage에 저장된 토큰이 올바른지 확인
- 토큰 만료 시 자동 로그아웃 처리

### 4. 네트워크 오류 처리

- 인터넷 연결 상태 확인
- API 서버 상태 확인
- 브라우저 개발자 도구에서 네트워크 오류 확인

## 디버깅 도구 사용

### 1. 디버그 컴포넌트 활용

- 배포된 사이트에서 우하단의 🐛 버튼 클릭
- 환경 변수 값 확인
- API 연결 테스트 실행
- 디버그 정보 복사하여 개발팀에 전달

### 2. 브라우저 개발자 도구

- Network 탭에서 API 요청/응답 확인
- Console 탭에서 오류 메시지 확인
- Application 탭에서 localStorage 확인

## 배포 후 확인 사항

1. **환경 변수 적용 확인**

   - 디버그 컴포넌트에서 환경 변수 값 확인
   - 브라우저 개발자 도구에서 `process.env.REACT_APP_BACKEND_URL` 값 확인

2. **API 연결 테스트**

   - 디버그 컴포넌트의 "API 연결 테스트" 버튼 클릭
   - 로그인 페이지에서 네트워크 탭 확인
   - API 요청이 올바른 URL로 전송되는지 확인

3. **CORS 오류 확인**
   - 브라우저 콘솔에서 CORS 관련 오류 메시지 확인
   - Network 탭에서 OPTIONS 요청 확인

## 문제 해결 체크리스트

- [ ] Azure Static Web Apps 환경 변수 설정 완료
- [ ] 백엔드 API 서버 정상 실행 확인
- [ ] CORS 설정 확인 (백엔드)
- [ ] API URL 올바른지 확인
- [ ] 네트워크 연결 상태 확인
- [ ] 브라우저 캐시 삭제
- [ ] 개발자 도구에서 오류 메시지 확인
- [ ] 디버그 컴포넌트로 환경 변수 확인
- [ ] API 연결 테스트 실행

## 추가 디버깅 방법

1. **브라우저 개발자 도구 사용**

   - Network 탭에서 API 요청/응답 확인
   - Console 탭에서 오류 메시지 확인
   - Application 탭에서 localStorage 확인

2. **API 테스트**

   - Postman이나 curl로 API 직접 테스트
   - API 엔드포인트 정상 작동 확인

3. **환경 변수 디버깅**
   - 디버그 컴포넌트에서 환경 변수 값 확인
   - 브라우저 콘솔에서 `console.log(process.env)` 실행

## 일반적인 문제와 해결책

### 1. "Network Error" 발생

- 백엔드 API 서버가 실행 중인지 확인
- API URL이 올바른지 확인
- 네트워크 연결 상태 확인

### 2. "CORS Error" 발생

- 백엔드에서 CORS 설정 확인
- Azure Static Web Apps의 CORS 헤더 설정 확인

### 3. "404 Not Found" 발생

- API 엔드포인트 경로가 올바른지 확인
- 백엔드 라우팅 설정 확인

### 4. "401 Unauthorized" 발생

- 로그인 토큰이 올바른지 확인
- 토큰 만료 여부 확인
- Authorization 헤더 설정 확인
