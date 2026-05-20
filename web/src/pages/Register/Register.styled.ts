import styled from "styled-components";
import bgImage from "../../assets/login-bg.jpg";

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  overflow: hidden;

  /* ✅ RASM fixed layer: form balandligi o‘zgarsa ham rasm qimirlamaaydi */
  &::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: url(${bgImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }

  /* ✅ overlay ham fixed */
  &::after {
    content: "";
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 0;
  }
`;

export const FormContainer = styled.div`
  position: relative;
  z-index: 1;

  width: 100%;
  max-width: 440px;
  padding: 38px 34px;

  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 22px;

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);

  .styled-form {
    /* =========================================
       ✅ CHROME AUTOFILL FIX (ko'k bckni yo'q qiladi)
    ========================================= */

    /* Ant input + Password input (ichidagi input) */
    .ant-input:-webkit-autofill,
    .ant-input:-webkit-autofill:hover,
    .ant-input:-webkit-autofill:focus,
    .ant-input-affix-wrapper input:-webkit-autofill,
    .ant-input-affix-wrapper input:-webkit-autofill:hover,
    .ant-input-affix-wrapper input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
      box-shadow: 0 0 0px 1000px #ffffff inset !important;
      -webkit-text-fill-color: #0f172a !important;
      caret-color: #0f172a !important;
      border-radius: 12px !important;
      transition: background-color 9999s ease-in-out 0s !important;
    }

    /* react-phone-number-input ning inputi */
    .phone-input .PhoneInputInput:-webkit-autofill,
    .phone-input .PhoneInputInput:-webkit-autofill:hover,
    .phone-input .PhoneInputInput:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
      box-shadow: 0 0 0px 1000px #ffffff inset !important;
      -webkit-text-fill-color: #0f172a !important;
      caret-color: #0f172a !important;
      transition: background-color 9999s ease-in-out 0s !important;
    }

    .ant-form-item {
      margin-bottom: 16px;
    }

    /* ✅ Error joyi doim band bo‘lsin -> layout kamroq o‘ynaydi */
    .ant-form-item-explain,
    .ant-form-item-extra {
      min-height: 18px;
    }

    .ant-input {
      height: 48px;
      border-radius: 12px;
      font-size: 15px;
      padding: 12px 14px;

      background: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.55);
      box-shadow: none;
      color: #0f172a;
    }

    .ant-input::placeholder {
      color: rgba(15, 23, 42, 0.45);
    }

    .ant-input-affix-wrapper {
      height: 48px;
      border-radius: 12px;
      padding: 0 14px;

      display: flex;
      align-items: center;

      background: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.55);
      box-shadow: none;
    }

    .ant-input-affix-wrapper > input.ant-input {
      height: 46px;
      padding: 0;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      color: #0f172a;
    }

    .ant-input:focus,
    .ant-input-affix-wrapper-focused {
      background: #ffffff !important;
      border-color: rgba(24, 144, 255, 0.65) !important;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.25) !important;
    }

    .ant-input-password-icon {
      color: rgba(15, 23, 42, 0.45);
      transition: color 0.2s;
    }
    .ant-input-password-icon:hover {
      color: rgba(15, 23, 42, 0.75);
    }

    .phone-wrap {
      width: 100%;
    }

    .phone-input {
      width: 100%;
      height: 48px;

      display: flex;
      align-items: center;
      gap: 10px;

      border-radius: 12px;
      padding: 0 14px;

      background: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.55);
      box-shadow: none;
    }

    .phone-input:focus-within {
      border-color: rgba(24, 144, 255, 0.65) !important;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.25) !important;
    }

    .phone-input .PhoneInputCountry {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 0;
    }

    .phone-input .PhoneInputCountryIcon {
      width: 26px;
      height: 18px;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.08);
    }

    .phone-input .PhoneInputCountrySelect {
      border: none;
      outline: none;
      background: transparent;
      cursor: pointer;
      padding: 0;
      margin: 0;
    }

    .phone-input .PhoneInputInput {
      flex: 1;
      height: 46px;

      border: none;
      outline: none;
      background: transparent;

      font-size: 15px;
      padding: 0;
      color: #0f172a;
    }

    .phone-input .PhoneInputInput::placeholder {
      color: rgba(15, 23, 42, 0.45);
    }

    .ant-btn {
      height: 48px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      border: none;
      box-shadow: 0 10px 24px rgba(24, 144, 255, 0.35);
    }
  }
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 22px;
  font-family: "Inter", sans-serif;
  color: #fff;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
`;

export const LinkButton = styled.button`
  width: 100%;
  margin-top: 18px;

  background: none;
  border: none;
  cursor: pointer;

  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  text-decoration: underline;

  &:hover {
    color: #fff;
  }
`;
