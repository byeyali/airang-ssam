// 카카오 주소 검색 API 서비스
const KAKAO_API_KEY =
  process.env.REACT_APP_KAKAO_API_KEY || "your_kakao_api_key_here";

// 카카오 주소 검색 API 호출
export const searchAddress = async (query, page = 1) => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        query
      )}&page=${page}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Kakao address search failed:", error);
    throw error;
  }
};

// 카카오 키워드 검색 API (상세 주소 검색용)
export const searchKeyword = async (query, page = 1) => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
        query
      )}&page=${page}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Kakao keyword search failed:", error);
    throw error;
  }
};

// 주소 데이터 정제 함수
export const formatAddressData = (addressData) => {
  return addressData.documents.map((doc) => ({
    id: doc.id,
    address_name: doc.address_name,
    road_address_name: doc.road_address_name,
    place_name: doc.place_name,
    x: doc.x, // 경도
    y: doc.y, // 위도
    address_type: doc.address_type,
    full_address: doc.road_address_name || doc.address_name,
  }));
};

// 지역 코드 추출 함수 (서울시 구 단위)
export const extractRegionCode = (address) => {
  const seoulDistricts = {
    강남구: "11680",
    강동구: "11740",
    강북구: "11305",
    강서구: "11500",
    관악구: "11620",
    광진구: "11215",
    구로구: "11530",
    금천구: "11545",
    노원구: "11320",
    도봉구: "11350",
    동대문구: "11230",
    동작구: "11590",
    마포구: "11440",
    서대문구: "11410",
    서초구: "11650",
    성동구: "11200",
    성북구: "11290",
    송파구: "11710",
    양천구: "11470",
    영등포구: "11560",
    용산구: "11170",
    은평구: "11380",
    종로구: "11110",
    중구: "11140",
    중랑구: "11260",
  };

  for (const [district, code] of Object.entries(seoulDistricts)) {
    if (address.includes(district)) {
      return {
        code,
        name: district,
        fullName: `서울특별시 ${district}`,
      };
    }
  }

  return null;
};

export default {
  searchAddress,
  searchKeyword,
  formatAddressData,
  extractRegionCode,
};
