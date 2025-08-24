const multer = require("multer");
const { MulterAzureStorage } = require("multer-azure-blob-storage");
require("dotenv").config();

// Azure Storage 설정 - 직접 접근 URL 반환
const azureStorage = new MulterAzureStorage({
  connectionString: `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`,
  containerName: process.env.AZURE_CONTAINER_NAME,
  blobName: (req, file) => {
    // 파일명에 타임스탬프 추가하여 중복 방지
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_"); // 특수문자 제거
    return `uploads/${timestamp}-${originalName}`;
  },
  contentType: (req, file) => file.mimetype,
  metadata: (req, file) => ({
    fieldName: file.fieldname,
    uploadedAt: new Date().toISOString(),
  }),
  // SAS 토큰 없이 직접 접근 URL 생성
  url: (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobName = `uploads/${timestamp}-${originalName}`;
    return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}`;
  },
});

// multer 인스턴스 생성
const upload = multer({
  storage: azureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."), false);
    }
  },
});

// 단일파일 upload용, 다중파일 upload용
const uploadSingle = upload.single("file"); // 단일 파일 (field name: "file")
const uploadMultiple = upload.array("files", 10); // 다중 파일 (field name: "files", 최대 10개)

// 파일 URL 생성 함수 (백업용)
const getFileUrl = (blobName) => {
  return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}`;
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  getFileUrl,
};
