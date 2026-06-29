// src/pages/auth/Login.jsx
import { memo } from "react";
import { Spin } from "antd";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AiOutlineWarning } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import Logo from "../../assets/images/logo.webp"

import { useLogin } from "./useLogin";
import {
  PageWrapper,
  Card,
  BrandRow,
  BrandLogo,
  BrandName,
  BrandTagline,
  BrandText,
  FormSection,
  FormTitle,
  FieldGroup,
  FieldLabel,
  InputWrapper,
  InputIcon,
  StyledInput,
  PasswordToggle,
  ErrorMessage,
  GlobalError,
  LoginButton,
  GoogleButton,
  ForgotLink,
  Divider,
} from "./Login.styled";

// ── Sub-components ────────────────────────────────────────────────────────────

const Brand = memo(function Brand() {
  return (
    <BrandRow>
      <BrandLogo
        src={Logo}
        alt="Leidi Bud Dentals logo"
        width={70}
        height={70}
        loading="eager"
        fetchpriority="high"
      />
      <BrandText>
        <BrandName>Leidi Bud Dentals</BrandName>
        <BrandTagline>Trusted Dental Care</BrandTagline>
      </BrandText>
    </BrandRow>
  );
});

const GoogleSVG = memo(function GoogleSVG() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
});


function Login() {
  const {
    fields,
    errors,
    globalError,
    loading,
    googleLoading,
    showPassword,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
    handleForgotPassword,
    togglePassword,
  } = useLogin();

  const isLoading = loading || googleLoading;

  return (
    <PageWrapper>
      <Card role="main">
        <Brand />

        <FormSection aria-labelledby="login-heading">
          <FormTitle id="login-heading">Welcome Back</FormTitle>

          {globalError && (
            <GlobalError role="alert" aria-live="assertive">
              <AiOutlineWarning aria-hidden="true" /> {globalError}
            </GlobalError>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Login form"
            autoComplete="on"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <FieldGroup>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputWrapper>
                  <InputIcon aria-hidden="true">
                    <MdEmail />
                  </InputIcon>
                  <StyledInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={fields.email}
                    onChange={handleChange}
                    $hasError={!!errors.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={isLoading}
                    maxLength={256}
                    spellCheck={false}
                  />
                </InputWrapper>
                {errors.email && (
                  <ErrorMessage id="email-error" role="alert">
                    <AiOutlineWarning aria-hidden="true" />
                    {errors.email}
                  </ErrorMessage>
                )}
              </FieldGroup>

              {/* Password */}
              <FieldGroup>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputWrapper>
                  <InputIcon aria-hidden="true">
                    <MdLock />
                  </InputIcon>
                  <StyledInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={fields.password}
                    onChange={handleChange}
                    $hasError={!!errors.password}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    disabled={isLoading}
                    maxLength={128}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={togglePassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={0}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </PasswordToggle>
                </InputWrapper>
                {errors.password && (
                  <ErrorMessage id="password-error" role="alert">
                    <AiOutlineWarning aria-hidden="true" />
                    {errors.password}
                  </ErrorMessage>
                )}
              </FieldGroup>

              {/* Submit */}
              <LoginButton
                type="submit"
                disabled={isLoading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Spin size="small" />
                    Signing in…
                  </>
                ) : (
                  "Login"
                )}
              </LoginButton>

              {/* Divider */}
              <Divider aria-hidden="true">or</Divider>

              {/* Google */}
              <GoogleButton
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                aria-busy={googleLoading}
              >
                {googleLoading ? (
                  <FiLoader aria-hidden="true" />
                ) : (
                  <GoogleSVG />
                )}
                Continue with Google
              </GoogleButton>

              {/* Forgot password */}
              <ForgotLink
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot password?
              </ForgotLink>
            </div>
          </form>
        </FormSection>
      </Card>
    </PageWrapper>
  );
}

export default memo(Login);