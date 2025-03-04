import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

import { env } from '@/env.mjs';

interface PasswordResetEmailProps {
  resetUrl: string;
  userName?: string;
}

export const PasswordResetEmail = ({
  resetUrl,
  userName,
}: PasswordResetEmailProps) => {
  const previewText = `【${env.NEXT_PUBLIC_APP_NAME}】パスワード設定のご案内`;
  const greeting = userName ? `${userName} 様` : 'お客様';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading
            style={h1}
          >{`${env.NEXT_PUBLIC_APP_NAME}パスワード設定のご案内`}</Heading>
          <Text style={text}>{greeting}</Text>
          <Text style={text}>
            {env.NEXT_PUBLIC_APP_NAME}
            をご利用いただきありがとうございます。パスワードの設定をお願いいたします。
          </Text>
          <Text style={text}>
            下記のボタンをクリックして、パスワードを設定してください：
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={{
                ...button,
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '12px',
                paddingBottom: '12px',
              }}
              href={resetUrl}
            >
              パスワードを設定する
            </Button>
          </Section>
          <Text style={text}>
            このリンクは24時間有効です。パスワード設定後は自動的にログイン画面に移動します。
          </Text>
          <Text style={text}>
            このメールに心当たりがない場合は、このメールを無視していただくか、サポートまでご連絡ください。
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            ※このメールは送信専用です。返信いただいてもお答えできませんのでご了承ください。
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20, 50, 70, 0.2)',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '20px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const buttonContainer = {
  margin: '30px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '30px 0',
};

const footer = {
  color: '#777',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '20px 0',
};
