import styled from "styled-components";
import bgImage from "../../assets/login-bg.jpg";

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px;

  display: flex;
  justify-content: center;
  align-items: center;

  /* ✅ Login/Register dagidek background */
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;
  overflow: hidden;

  /* ✅ Qoraytiruvchi overlay */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
  }
`;

export const FormContainer = styled.div`
  position: relative;
  z-index: 1;

  width: 100%;
  max-width: 420px;
  padding: 42px 36px;

  /* ✅ Glass effect (Login/Register bilan bir xil) */
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 22px;

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);

  .styled-form {
    .ant-form-item {
      margin-bottom: 20px;
    }

    /* ✅ OTP input – oq, center, katta */
    .ant-input {
      height: 56px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.65);
      background: rgba(255, 255, 255, 0.92);
      color: #2b2b2b;

      text-align: center;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 6px;

      padding: 0 16px;
      box-shadow: none;
    }

    .ant-input::placeholder {
      color: rgba(0, 0, 0, 0.35);
      letter-spacing: 4px;
    }

    .ant-input:focus {
      border-color: rgba(24, 144, 255, 0.85);
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.18);
    }

    /* ✅ Button Login/Register bilan bir xil */
    .ant-btn {
      width: 100%;
      height: 56px;
      border-radius: 14px;
      font-size: 16px;
      font-weight: 600;
      border: none;
    }
  }
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 14px;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
`;

export const Description = styled.p`
  text-align: center;
  margin-bottom: 26px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
`;
