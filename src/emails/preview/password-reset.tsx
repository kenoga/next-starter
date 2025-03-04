import PasswordResetEmail from '../password-reset-email';

export default function PasswordResetEmailPreview() {
  return (
    <PasswordResetEmail
      resetUrl="https://example.com/reset-password?token=abc123"
      userName="テスト ユーザー"
    />
  );
}
