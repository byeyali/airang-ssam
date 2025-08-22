//
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 네트워크 연결 상태 확인
      if (!navigator.onLine) {
        setError("인터넷 연결을 확인해주세요.");
        setIsLoading(false);
        return;
      }

      const loginData = { email: formData.email, password: formData.password };
      const result = await login(loginData);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "로그인에 실패했습니다.");
        alert(result.message);
      }
    } catch (error) {
      if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error") ||
        error.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        setError(
          "백엔드 서버에 연결할 수 없습니다. Azure API를 사용하여 로그인을 시도합니다."
        );
        console.log("로컬 백엔드 서버가 실행되지 않아 Azure API를 사용합니다.");
      } else if (error.response?.status === 404) {
        setError("로그인 서비스를 찾을 수 없습니다.");
      } else if (error.response?.status === 500) {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else if (error.response?.status === 0) {
        setError("CORS 오류가 발생했습니다. 브라우저 설정을 확인해주세요.");
      }
      if (error.response && error.response.status === 401) {
        setError(error.response.data.message || "로그인에 실패했습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleMainPageClick = () => {
    navigate("/");
  };

  return (
    <div className="login-form-container">
      {/* 아이랑쌤이랑 로고 */}
      <div className="login-header-section" onClick={handleMainPageClick}>
        <div className="login-header-content">
          <img
            src="/img/Image_fx.png"
            alt="아이랑쌤이랑 로고"
            className="login-header-logo"
          />
          <span className="login-header-title">아이랑 쌤이랑</span>
        </div>
      </div>

      <h1 className="login-title">로그인</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group login-form-group-inline">
          <div className="login-label-button">이메일</div>
          <input
            type="email"
            className="login-input-field"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <div className="login-form-group login-form-group-inline">
          <div className="login-label-button">비밀번호</div>
          <input
            type="password"
            className="login-input-field"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="login-action-button login-submit-button"
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="login-footer">
        <p>계정이 없으신가요?</p>
        <button
          type="button"
          onClick={handleSignUpClick}
          className="signup-link-button"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../../contexts/UserContext";
// import "./Login.css";

// function Login() {
//   const navigate = useNavigate();
//   const { login } = useUser();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       // 네트워크 연결 상태 확인
//       if (!navigator.onLine) {
//         setError("인터넷 연결을 확인해주세요.");
//         setIsLoading(false);
//         return;
//       }

//       const loginData = { email: formData.email, password: formData.password };
//       const result = await login(loginData);

//       if (result.success) {
//         navigate("/");
//       } else {
//         setError(result.message || "로그인에 실패했습니다.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);

//       // 구체적인 에러 메시지 처리
//       if (
//         error.code === "NETWORK_ERROR" ||
//         error.message.includes("Network Error")
//       ) {
//         setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
//       } else if (error.response?.status === 404) {
//         setError("로그인 서비스를 찾을 수 없습니다.");
//       } else if (error.response?.status === 500) {
//         setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
//       } else if (error.response?.status === 0) {
//         setError("CORS 오류가 발생했습니다. 브라우저 설정을 확인해주세요.");
//       } else {
//         setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignUpClick = () => {
//     navigate("/signup");
//   };

//   const handleMainPageClick = () => {
//     navigate("/");
//   };

//   return (
//     <div className="login-form-container">
//       {/* 아이랑 쌤 이미지와 텍스트 */}
//       <div className="login-header-section" onClick={handleMainPageClick}>
//         <div className="login-header-content">
//           <div className="login-header-images">
//             <img
//               src="/img/boy.png"
//               alt="아이"
//               className="login-header-image child-image"
//             />
//             <span className="login-header-text">랑</span>
//             <img
//               src="/img/teacher-20-woman.png"
//               alt="쌤"
//               className="login-header-image teacher-image"
//             />
//           </div>
//           <div className="login-header-title">아이랑 쌤</div>
//         </div>
//       </div>

//       <h1 className="login-title">로그인</h1>

//       <form onSubmit={handleSubmit} className="login-form">
//         <div className="login-form-group login-form-group-inline">
//           <div className="login-label-button">이메일</div>
//           <input
//             type="email"
//             className="login-input-field"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="이메일을 입력하세요"
//             required
//           />
//         </div>

//         <div className="login-form-group login-form-group-inline">
//           <div className="login-label-button">비밀번호</div>
//           <input
//             type="password"
//             className="login-input-field"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             placeholder="비밀번호를 입력하세요"
//             required
//           />
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <button
//           type="submit"
//           className="login-action-button login-submit-button"
//           disabled={isLoading}
//         >
//           {isLoading ? "로그인 중..." : "로그인"}
//         </button>
//       </form>

//       <div className="login-footer">
//         <p>계정이 없으신가요?</p>
//         <button
//           type="button"
//           onClick={handleSignUpClick}
//           className="signup-link-button"
//         >
//           회원가입
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;
