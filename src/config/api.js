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
  const mockTeachers = [];

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

// 공고에서 아이의 성별 추출
export const extractChildGender = (application) => {
  if (!application || !application.target) {
    return null;
  }

  const target = application.target.toLowerCase();

  // "남아", "남자아이", "boy" 등 남성 관련 키워드 확인
  if (
    target.includes("남아") ||
    target.includes("남자") ||
    target.includes("boy")
  ) {
    return "male";
  }

  // "여아", "여자아이", "girl" 등 여성 관련 키워드 확인
  if (
    target.includes("여아") ||
    target.includes("여자") ||
    target.includes("girl")
  ) {
    return "female";
  }

  return null;
};

// 선생님 성별 매칭 점수 계산
export const calculateGenderMatchScore = (childGender, teacherGender) => {
  if (!childGender || !teacherGender) {
    return 0.5; // 성별 정보가 없으면 중간 점수
  }

  // 같은 성별이면 높은 점수, 다르면 낮은 점수
  if (childGender === teacherGender) {
    return 1.0; // 같은 성별 우선
  } else {
    return 0.3; // 다른 성별 (완전 배제하지 않고 낮은 점수)
  }
};

// 종합 매칭 점수 계산 (지역 + 성별)
export const calculateOverallMatchScore = (application, teacher) => {
  const regionScore = calculateRegionMatchScore(
    application.region?.title,
    teacher.regions
  );
  const childGender = extractChildGender(application);
  const genderScore = calculateGenderMatchScore(childGender, teacher.gender);

  // 지역 점수 70%, 성별 점수 30%로 가중치 적용
  const overallScore = regionScore * 0.7 + genderScore * 0.3;

  return {
    overallScore,
    regionScore,
    genderScore,
    childGender,
  };
};

// 매칭 가능한 선생님들을 점수순으로 정렬
export const getMatchingTeachersByScore = (application, teachers) => {
  return teachers
    .map((teacher) => {
      const matchScore = calculateOverallMatchScore(application, teacher);
      return {
        ...teacher,
        matchScore: matchScore.overallScore,
        regionScore: matchScore.regionScore,
        genderScore: matchScore.genderScore,
        childGender: matchScore.childGender,
      };
    })
    .filter((teacher) => teacher.matchScore > 0) // 매칭 점수가 있는 선생님만
    .sort((a, b) => b.matchScore - a.matchScore); // 점수 높은 순으로 정렬
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
