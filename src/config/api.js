// 백엔드 서버 URL
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

// VWorld API 설정
const VWORLD_API_KEY =
  process.env.REACT_APP_VWORLD_API_KEY ||
  "F675C9F2-3FC4-36D7-8247-D74644AFB996";
const VWORLD_BASE_URL = "https://api.vworld.kr/req/search";

// 테스트용 로컬 검색 함수
export const searchRegionLocal = async (query) => {
  console.log("로컬 검색 함수 호출됨, 쿼리:", query);

  // 실제 지역 데이터 (한국 주요 지역)
  const localRegions = [
    { title: "서울특별시 관악구", id: "seoul_gwanak" },
    { title: "서울특별시 강남구", id: "seoul_gangnam" },
    { title: "서울특별시 서초구", id: "seoul_seocho" },
    { title: "서울특별시 마포구", id: "seoul_mapo" },
    { title: "서울특별시 영등포구", id: "seoul_yeongdeungpo" },
    { title: "서울특별시 동작구", id: "seoul_dongjak" },
    { title: "경기도 안양시", id: "gyeonggi_anyang" },
    { title: "경기도 성남시", id: "gyeonggi_seongnam" },
    { title: "경기도 부천시", id: "gyeonggi_bucheon" },
    { title: "인천광역시", id: "incheon" },
    { title: "부산광역시", id: "busan" },
    { title: "대구광역시", id: "daegu" },
    { title: "광주광역시", id: "gwangju" },
    { title: "대전광역시", id: "daejeon" },
    { title: "울산광역시", id: "ulsan" },
  ];

  // 검색어로 필터링
  const filteredResults = localRegions.filter((region) =>
    region.title.toLowerCase().includes(query.toLowerCase())
  );

  console.log("로컬 검색 결과:", filteredResults);
  return filteredResults;
};

// 지역 검색 API
export const searchRegion = async (query) => {
  try {
    console.log("searchRegion 호출됨, 쿼리:", query);

    // CORS 문제를 해결하기 위해 프록시 서버 사용 또는 다른 방법 시도
    const url = `${VWORLD_BASE_URL}?service=search&request=search&version=2.0&crs=EPSG:900913&bbox=14140071.146077,4494339.6527027,14160071.146077,4496339.6527027&size=10&page=1&query=${encodeURIComponent(
      query
    )}&type=district&category=L4&format=json&errorformat=json&key=${VWORLD_API_KEY}`;

    console.log("API URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors", // CORS 모드 명시적 설정
    });

    console.log("API 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      console.log("API 응답이 실패했습니다. 상태:", response.status);
      throw new Error(`지역 검색에 실패했습니다. 상태: ${response.status}`);
    }

    const data = await response.json();
    console.log("API 응답 데이터:", data);

    const results = data.response?.service?.result || [];
    console.log("추출된 결과:", results);

    // API 호출이 실패하거나 결과가 없을 경우 모의 데이터 반환
    if (results.length === 0) {
      console.log("API 결과가 없어서 모의 데이터를 반환합니다.");
      return getMockAddressResults(query);
    }

    return results;
  } catch (error) {
    console.error("지역 검색 오류:", error);
    console.log("오류로 인해 모의 데이터를 반환합니다.");
    return getMockAddressResults(query);
  }
};

// 모의 주소 검색 결과 생성
const getMockAddressResults = (query) => {
  const mockResults = [
    {
      title: `${query} (서울특별시)`,
      id: "mock_1",
    },
    {
      title: `${query} (경기도)`,
      id: "mock_2",
    },
    {
      title: `${query} (인천광역시)`,
      id: "mock_3",
    },
  ];

  console.log("모의 데이터 반환:", mockResults);
  return mockResults;
};

// 쌤 검색 함수
export const searchTeacher = async (teacherName) => {
  console.log("searchTeacher 호출됨, 쌤 이름:", teacherName);

  // 실제 쌤 데이터 (시뮬레이션)
  const mockTeachers = [
    {
      id: "teacher_001",
      name: "김영희",
      regions: ["관악구", "동작구"],
      skills: ["돌봄", "놀이"],
      rating: 4.8,
      gender: "여성",
      age: 28,
      experience: "5년",
      education: "보육교사 2급",
      hourlyWage: 15000,
      description: "아이들과 함께하는 시간을 가장 소중하게 생각하는 쌤입니다.",
    },
    {
      id: "teacher_002",
      name: "박민수",
      regions: ["강남구", "서초구"],
      skills: ["스터디", "영어"],
      rating: 4.9,
      gender: "남성",
      age: 32,
      experience: "7년",
      education: "초등교사 2급",
      hourlyWage: 18000,
      description: "체계적이고 재미있는 학습을 제공하는 쌤입니다.",
    },
    {
      id: "teacher_003",
      name: "이수진",
      regions: ["마포구", "영등포구"],
      skills: ["돌봄", "음식"],
      rating: 4.7,
      gender: "여성",
      age: 26,
      experience: "3년",
      education: "보육교사 2급",
      hourlyWage: 14000,
      description: "영양가 있는 간식과 따뜻한 돌봄을 제공하는 쌤입니다.",
    },
    {
      id: "teacher_004",
      name: "최지영",
      regions: ["관악구", "동작구"],
      skills: ["놀이", "스터디"],
      rating: 4.6,
      gender: "여성",
      age: 29,
      experience: "4년",
      education: "보육교사 2급",
      hourlyWage: 16000,
      description:
        "창의적인 놀이와 학습을 통해 아이들의 잠재력을 키우는 쌤입니다.",
    },
    {
      id: "teacher_005",
      name: "한미영",
      regions: ["강남구", "서초구"],
      skills: ["돌봄", "영어"],
      rating: 4.8,
      gender: "여성",
      age: 31,
      experience: "6년",
      education: "보육교사 1급",
      hourlyWage: 17000,
      description: "영어와 돌봄을 함께하는 특별한 경험을 제공하는 쌤입니다.",
    },
    {
      id: "teacher_006",
      name: "정성훈",
      regions: ["마포구", "영등포구"],
      skills: ["스터디", "수학"],
      rating: 4.9,
      gender: "남성",
      age: 35,
      experience: "8년",
      education: "중등교사 2급",
      hourlyWage: 20000,
      description: "수학의 재미를 발견할 수 있도록 도와주는 쌤입니다.",
    },
    {
      id: "teacher_007",
      name: "김태현",
      regions: ["관악구", "동작구"],
      skills: ["놀이", "음식"],
      rating: 4.7,
      gender: "남성",
      age: 27,
      experience: "4년",
      education: "보육교사 2급",
      hourlyWage: 15000,
      description: "즐거운 놀이와 맛있는 간식을 함께하는 쌤입니다.",
    },
    {
      id: "teacher_008",
      name: "박성훈",
      regions: ["강남구", "서초구"],
      skills: ["돌봄", "스터디"],
      rating: 4.8,
      gender: "남성",
      age: 30,
      experience: "5년",
      education: "보육교사 2급",
      hourlyWage: 16000,
      description: "체계적인 학습과 따뜻한 돌봄을 제공하는 쌤입니다.",
    },
  ];

  // 이름으로 필터링 (부분 일치)
  const filteredTeachers = mockTeachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(teacherName.toLowerCase())
  );

  console.log("쌤 검색 결과:", filteredTeachers);
  return filteredTeachers;
};

// 지역 매칭 함수
export const isRegionMatch = (parentRegion, teacherRegions) => {
  if (!parentRegion || !teacherRegions || teacherRegions.length === 0) {
    return false;
  }

  // 부모의 지역이 쌤의 지역 중 하나와 일치하는지 확인
  return teacherRegions.some(
    (teacherRegion) =>
      teacherRegion.includes(parentRegion) ||
      parentRegion.includes(teacherRegion)
  );
};

// 지역 정규화 함수 (시/구 단위로 통일)
export const normalizeRegion = (region) => {
  // 서울특별시 관악구 -> 관악구
  // 경기도 안양시 -> 안양시
  const normalized = region
    .replace(/^서울특별시\s*/, "")
    .replace(/^경기도\s*/, "")
    .replace(/^인천광역시\s*/, "")
    .replace(/^부산광역시\s*/, "")
    .replace(/^대구광역시\s*/, "")
    .replace(/^광주광역시\s*/, "")
    .replace(/^대전광역시\s*/, "")
    .replace(/^울산광역시\s*/, "");

  return normalized;
};

// 지역 매칭 점수 계산
export const calculateRegionMatchScore = (parentRegion, teacherRegions) => {
  const normalizedParentRegion = normalizeRegion(parentRegion);

  for (let i = 0; i < teacherRegions.length; i++) {
    const normalizedTeacherRegion = normalizeRegion(teacherRegions[i]);

    if (normalizedTeacherRegion === normalizedParentRegion) {
      return 1.0; // 완전 일치
    }

    if (
      normalizedTeacherRegion.includes(normalizedParentRegion) ||
      normalizedParentRegion.includes(normalizedTeacherRegion)
    ) {
      return 0.8; // 부분 일치
    }
  }

  return 0.0; // 불일치
};

// 백엔드 API 호출 함수들
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};

// 백엔드 서버 상태 확인
export const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("백엔드 서버 연결 실패:", error);
    return false;
  }
};
