# 백엔드 photo_path 저장 문제 디버깅 가이드

## 문제 상황

`photo_path` 컬럼이 데이터베이스에 저장되지 않는 문제

## Azure Storage 사용 시 주의사항

### 1. Azure Storage 설정 확인

현재 multer 설정이 Azure Storage를 사용하고 있음:

```javascript
const azureStorage = new MulterAzureStorage({
  connectionString: `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`,
  containerName: process.env.AZURE_CONTAINER_NAME,
  blobName: (req, file) => {
    return `${Date.now()}-${file.originalname}`;
  },
  contentType: (req, file) => file.mimetype,
  metadata: (req, file) => ({ fieldName: file.fieldname }),
});
```

### 2. Azure Storage에서 파일 경로 확인

Azure Storage를 사용할 때 `req.file.path`는 Azure Blob URL이 됩니다:

```javascript
// 백엔드 컨트롤러에서
const createTutor = async (req, res) => {
  const memberId = req.member.id;

  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("File URL:", req.file?.url); // Azure Blob URL
  console.log("File path:", req.file?.path); // Azure Blob URL
  console.log("Member ID:", memberId);

  // Azure Storage에서는 req.file.url 또는 req.file.path가 Azure Blob URL
  const photo_path = req.file ? req.file.url : null; // 또는 req.file.path
  console.log("Photo path:", photo_path);

  try {
    const newTutor = await Tutor.create({
      member_id: memberId,
      school: req.body.school,
      major: req.body.major,
      is_graduate: req.body.is_graduate,
      birth_year: req.body.birth_year,
      gender: req.body.gender,
      career_years: req.body.career_years,
      introduction: req.body.introduction,
      certification: req.body.certification,
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

### 3. 환경 변수 확인

Azure Storage 설정에 필요한 환경 변수들이 설정되어 있는지 확인:

```bash
# .env 파일에 다음 변수들이 있어야 함
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
AZURE_CONTAINER_NAME=your_container_name
```

### 4. 라우터 설정 확인

tutors 라우터에서 Azure Storage multer가 제대로 적용되어 있는지 확인:

```javascript
// tutors 라우터
const { uploadSingle } = require("../middleware/azureStorage");

router.post("/", uploadSingle, createTutor);
```

## 가능한 원인과 해결책

### 1. Multer 미들웨어 설정 확인

백엔드 라우터에서 Azure Storage multer가 제대로 설정되어 있는지 확인:

```javascript
// tutors 라우터에서
const { uploadSingle } = require("../middleware/azureStorage");

router.post("/", uploadSingle, createTutor);
```

### 2. 파일 업로드 필드명 확인

프론트엔드에서 `file` 필드로 전송하고 있으므로, 백엔드에서도 `file` 필드명을 사용해야 함:

```javascript
// Azure Storage multer 설정
const uploadSingle = upload.single("file"); // 단일 파일 (field name: "file")
```

### 3. 데이터베이스 스키마 확인

Tutor 모델에 `photo_path` 컬럼이 정의되어 있는지 확인:

```javascript
// Tutor 모델
const Tutor = sequelize.define("Tutor", {
  // ... 다른 필드들
  photo_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
```

### 4. Azure Storage 연결 확인

Azure Storage 연결이 정상적으로 작동하는지 확인:

```javascript
// 테스트용 엔드포인트
app.post("/test-azure-upload", uploadSingle, (req, res) => {
  console.log("Azure file upload test:");
  console.log("File:", req.file);
  console.log("File URL:", req.file?.url);
  console.log("File path:", req.file?.path);
  res.json({
    success: true,
    file: req.file,
    url: req.file?.url,
    path: req.file?.path,
  });
});
```

### 5. 백엔드 디버깅 로그 추가

백엔드 컨트롤러에 Azure Storage 디버깅 로그 추가:

```javascript
const createTutor = async (req, res) => {
  const memberId = req.member.id;

  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("File URL:", req.file?.url);
  console.log("File path:", req.file?.path);
  console.log("Member ID:", memberId);

  // Azure Storage에서는 req.file.url 또는 req.file.path가 Azure Blob URL
  const photo_path = req.file ? req.file.url : null; // 또는 req.file.path
  console.log("Photo path to save:", photo_path);

  try {
    const newTutor = await Tutor.create({
      member_id: memberId,
      school: req.body.school,
      major: req.body.major,
      is_graduate: req.body.is_graduate,
      birth_year: req.body.birth_year,
      gender: req.body.gender,
      career_years: req.body.career_years,
      introduction: req.body.introduction,
      certification: req.body.certification,
      photo_path: photo_path,
    });

    console.log("Created tutor:", newTutor.toJSON());
    res.status(201).json(newTutor);
  } catch (err) {
    console.error("Tutor creation error:", err);
    res.status(500).json({ error: err.message });
  }
};
```

### 6. Azure Storage 권한 확인

Azure Storage 계정과 컨테이너에 대한 권한이 올바른지 확인:

1. Storage Account 접근 권한
2. Container 존재 여부
3. Blob 쓰기 권한

### 7. 프론트엔드에서 확인할 사항

1. **파일이 실제로 선택되었는지 확인**
2. **FormData에 파일이 제대로 추가되었는지 확인**
3. **Content-Type이 multipart/form-data인지 확인**

### 8. 네트워크 탭에서 확인할 사항

1. **요청이 multipart/form-data로 전송되는지**
2. **파일 데이터가 요청 본문에 포함되는지**
3. **서버 응답에서 photo_path(Azure Blob URL)가 포함되는지**

## 테스트 방법

### 1. Azure Storage 연결 테스트

```javascript
// 백엔드에서 테스트용 엔드포인트
app.post("/test-azure-upload", uploadSingle, (req, res) => {
  console.log("Azure file upload test:");
  console.log("File:", req.file);
  console.log("File URL:", req.file?.url);
  console.log("File path:", req.file?.path);
  res.json({
    success: true,
    file: req.file,
    url: req.file?.url,
    path: req.file?.path,
  });
});
```

### 2. Postman으로 테스트

1. POST 요청 설정
2. Body → form-data 선택
3. file 필드에 파일 첨부
4. 다른 필드들도 추가
5. 요청 전송 후 응답 확인

## 일반적인 해결책

1. **Azure Storage 연결 확인**
2. **환경 변수 설정 확인**
3. **Multer 설정 확인**
4. **필드명 일치 확인**
5. **데이터베이스 스키마 확인**
6. **Azure Storage 권한 확인**
7. **에러 로그 확인**
