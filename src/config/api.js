// VWorld API 설정
const VWORLD_API_KEY =
  process.env.REACT_APP_VWORLD_API_KEY ||
  "F675C9F2-3FC4-36D7-8247-D74644AFB996";
const VWORLD_BASE_URL = "https://api.vworld.kr/req/search";

// 지역 검색 API
export const searchRegion = async (query) => {
  try {
    const response = await fetch(
      `${VWORLD_BASE_URL}?service=search&request=search&version=2.0&crs=EPSG:900913&bbox=14140071.146077,4494339.6527027,14160071.146077,4496339.6527027&size=10&page=1&query=${encodeURIComponent(
        query
      )}&type=district&category=L4&format=json&errorformat=json&key=${VWORLD_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("지역 검색에 실패했습니다.");
    }

    const data = await response.json();
    return data.response?.service?.result || [];
  } catch (error) {
    console.error("지역 검색 오류:", error);
    return [];
  }
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
