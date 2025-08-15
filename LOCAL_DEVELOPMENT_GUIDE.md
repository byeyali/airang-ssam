# 로컬 개발 환경 가이드

## 현재 상황

로컬에서 `npm start`로 프론트엔드를 실행할 때 `http://localhost:8080/auth/login net::ERR_CONNECTION_REFUSED` 오류가 발생합니다.

## 원인

백엔드 API 서버가 `localhost:8080`에서 실행되지 않고 있기 때문입니다.

## 해결 방법

### 방법 1: Azure API 사용 (권장)

로컬 프론트엔드에서 Azure에 배포된 백엔드 API를 사용합니다.

1. **환경 변수 설정**
   프로젝트 루트에 `.env.development` 파일을 생성하고 다음 내용을 추가:

   ```
   REACT_APP_BACKEND_URL=https://airang-apin.azurewebsites.net
   REACT_APP_API_URL=https://airang-apin.azurewebsites.net
   REACT_APP_BASEURL=https://airang-apin.azurewebsites.net
   ```

2. **개발 서버 재시작**
   ```bash
   npm start
   ```

### 방법 2: 로컬 백엔드 서버 실행

백엔드 프로젝트가 있다면 로컬에서 실행합니다.

1. **백엔드 프로젝트로 이동**

   ```bash
   cd ../backend  # 백엔드 프로젝트 디렉토리
   ```

2. **백엔드 서버 실행**

   ```bash
   npm start
   # 또는
   node server.js
   # 또는
   python app.py
   ```

3. **포트 확인**
   백엔드 서버가 `8080` 포트에서 실행되는지 확인

4. **환경 변수 설정**
   `.env.development` 파일에서 로컬 URL 사용:

   ```
   REACT_APP_BACKEND_URL=http://localhost:8080
   REACT_APP_API_URL=http://localhost:8080
   REACT_APP_BASEURL=http://localhost:8080
   ```

### 방법 3: 프록시 설정 사용

`package.json`에 프록시 설정을 추가하여 CORS 문제를 해결합니다.

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "proxy": "https://airang-apin.azurewebsites.net",
  ...
}
```

## 현재 설정 확인

### 1. 환경 변수 확인

브라우저 개발자 도구 콘솔에서 다음 명령어 실행:

```javascript
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
```

### 2. API 연결 테스트

디버그 컴포넌트(🐛 버튼)를 사용하여 API 연결 상태를 확인합니다.

### 3. 네트워크 탭 확인

브라우저 개발자 도구의 Network 탭에서:

- API 요청이 올바른 URL로 전송되는지 확인
- 응답 상태 코드 확인
- CORS 오류 확인

## 문제 해결 체크리스트

- [ ] 환경 변수 파일 (`.env.development`) 생성
- [ ] 개발 서버 재시작 (`npm start`)
- [ ] 브라우저 캐시 삭제
- [ ] 환경 변수 값 확인
- [ ] API 연결 테스트 실행
- [ ] 네트워크 탭에서 요청/응답 확인

## 일반적인 문제와 해결책

### 1. "ERR_CONNECTION_REFUSED"

- 백엔드 서버가 실행되지 않음
- **해결책**: Azure API 사용 또는 로컬 백엔드 서버 실행

### 2. "CORS Error"

- 브라우저의 CORS 정책 위반
- **해결책**: 프록시 설정 또는 백엔드 CORS 설정

### 3. "404 Not Found"

- API 엔드포인트 경로 오류
- **해결책**: API URL 확인

### 4. "401 Unauthorized"

- 인증 토큰 문제
- **해결책**: 로그인 재시도

## 개발 팁

1. **환경 변수 우선순위**

   - `.env.development` (개발 환경)
   - `.env.local` (로컬 오버라이드)
   - `package.json`의 빌드 스크립트

2. **디버깅 도구 활용**

   - 디버그 컴포넌트 사용
   - 브라우저 개발자 도구 활용
   - 네트워크 탭 모니터링

3. **환경별 설정**
   - 개발: Azure API 또는 로컬 백엔드
   - 프로덕션: Azure API

## 백엔드 서버 정보

- **Azure API URL**: `https://airang-apin.azurewebsites.net`
- **로컬 기본 포트**: `8080`
- **주요 엔드포인트**:
  - 로그인: `/auth/login`
  - 회원가입: `/members`
  - 사용자 정보: `/auth/me`
  - 건강 체크: `/health`
