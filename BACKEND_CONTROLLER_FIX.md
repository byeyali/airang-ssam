# 백엔드 컨트롤러 수정 가이드

## 발견된 문제점

### 1. createTutor 함수의 오타

현재 코드:

```javascript
const photo_path = req.file ? req.file.u : null; // ❌ 오타: req.file.u
```

수정된 코드:

```javascript
const photo_path = req.file ? req.file.url : null; // ✅ 올바른 속성: req.file.url
```

### 2. Azure Storage 사용 시 올바른 속성

Azure Storage를 사용할 때 `req.file` 객체의 올바른 속성들:

```javascript
// Azure Storage multer에서 제공하는 속성들
console.log("req.file 객체:", {
  fieldname: req.file.fieldname, // 필드명 ('file')
  originalname: req.file.originalname, // 원본 파일명
  encoding: req.file.encoding, // 인코딩
  mimetype: req.file.mimetype, // MIME 타입
  size: req.file.size, // 파일 크기
  url: req.file.url, // Azure Blob URL (✅ 이것을 사용해야 함)
  path: req.file.path, // Azure Blob URL (대안)
  filename: req.file.filename, // Azure Blob 이름
  container: req.file.container, // 컨테이너명
  blobName: req.file.blobName, // Blob 이름
});
```

## 수정된 createTutor 함수

```javascript
const createTutor = async (req, res) => {
  const memberId = req.member.id;

  try {
    const {
      school,
      major,
      is_graduate,
      birth_year,
      gender,
      career_years,
      introduction,
      certification,
    } = req.body;

    // Azure Storage에서 파일 정보 확인
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("File URL:", req.file?.url);
    console.log("File path:", req.file?.path);
    console.log("Member ID:", memberId);

    // Azure Storage에서는 req.file.url을 사용 (오타 수정)
    const photo_path = req.file ? req.file.url : null; // ✅ 수정된 부분
    console.log("Photo path to save:", photo_path);

    const newTutor = await Tutor.create({
      member_id: memberId,
      school: school,
      major: major,
      is_graduate: is_graduate,
      birth_year: birth_year,
      gender: gender,
      career_years: career_years,
      introduction: introduction,
      certification: certification,
      photo_path: photo_path, // Azure Blob URL 저장
    });

    console.log("Created tutor:", newTutor.toJSON());
    res.status(201).json(newTutor);
  } catch (err) {
    console.error("Tutor creation error:", err);
    res.status(500).json({ error: err.message });
  }
};
```

## updateTutor 함수도 수정 필요

현재 `updateTutor` 함수도 로컬 파일 시스템을 가정하고 있습니다:

```javascript
// 현재 코드 (로컬 파일 시스템)
if (req.file) {
  if (photo_path && fs.existsSync(photo_path)) {
    fs.unlinkSync(photo_path);
  }
  photo_path = req.file.path; // ❌ Azure Storage에서는 적절하지 않음
}
```

Azure Storage를 사용하는 경우 수정:

```javascript
// 수정된 코드 (Azure Storage)
if (req.file) {
  // Azure Storage에서는 파일 삭제가 별도로 처리되어야 함
  // 기존 파일 URL을 저장해두고 나중에 삭제 처리
  const oldPhotoPath = photo_path;
  photo_path = req.file.url; // ✅ Azure Blob URL 사용

  // 기존 파일 삭제는 별도 API로 처리하거나 무시
  console.log("Old photo path:", oldPhotoPath);
  console.log("New photo path:", photo_path);
}
```

## 디버깅을 위한 로그 추가

```javascript
const createTutor = async (req, res) => {
  const memberId = req.member.id;

  try {
    // 요청 정보 로깅
    console.log("=== createTutor 요청 정보 ===");
    console.log("Member ID:", memberId);
    console.log("Request body:", req.body);
    console.log("Request file exists:", !!req.file);

    if (req.file) {
      console.log("File details:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: req.file.url,
        path: req.file.path,
        filename: req.file.filename,
        container: req.file.container,
        blobName: req.file.blobName,
      });
    }

    const {
      school,
      major,
      is_graduate,
      birth_year,
      gender,
      career_years,
      introduction,
      certification,
    } = req.body;

    // Azure Storage에서 파일 URL 추출 (오타 수정)
    const photo_path = req.file ? req.file.url : null;
    console.log("Photo path to save:", photo_path);

    const newTutor = await Tutor.create({
      member_id: memberId,
      school: school,
      major: major,
      is_graduate: is_graduate,
      birth_year: birth_year,
      gender: gender,
      career_years: career_years,
      introduction: introduction,
      certification: certification,
      photo_path: photo_path,
    });

    console.log("=== 생성된 Tutor 정보 ===");
    console.log("Created tutor:", newTutor.toJSON());
    res.status(201).json(newTutor);
  } catch (err) {
    console.error("Tutor creation error:", err);
    res.status(500).json({ error: err.message });
  }
};
```

## 즉시 수정해야 할 부분

1. **createTutor 함수에서 오타 수정**:

   ```javascript
   // 변경 전
   const photo_path = req.file ? req.file.u : null;

   // 변경 후
   const photo_path = req.file ? req.file.url : null;
   ```

2. **디버깅 로그 추가**:

   - `req.file` 객체의 모든 속성 출력
   - `photo_path` 값 확인

3. **updateTutor 함수도 수정** (필요시):
   - Azure Storage에 맞게 파일 경로 처리

## 테스트 방법

1. **백엔드 로그 확인**:

   ```bash
   # 백엔드 서버 콘솔에서
   === createTutor 요청 정보 ===
   Member ID: 123
   Request file exists: true
   File details: { url: 'https://...', ... }
   Photo path to save: https://...
   ```

2. **데이터베이스 확인**:
   ```sql
   SELECT id, photo_path FROM tutors WHERE member_id = 123;
   ```

이 오타를 수정하면 `photo_path`가 정상적으로 저장될 것입니다!
