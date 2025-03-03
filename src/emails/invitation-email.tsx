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

interface InvitationEmailProps {
  inviteUrl: string;
  role: string;
}

export const InvitationEmail = ({ inviteUrl, role }: InvitationEmailProps) => {
  const previewText = 'Next Starterへのご招待';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Next Starterへのご招待</Heading>
          <Text style={text}>このたびは Next Starter へご招待いたします。</Text>
          <Text style={text}>
            あなたは「{role}」権限でサービスにご招待されました。
          </Text>
          <Text style={text}>
            下記リンクをクリックして招待を承認してください：
          </Text>
          <Section style={buttonContainer}>
            <Button pX={20} pY={12} style={button} href={inviteUrl}>
              招待を承認する
            </Button>
          </Section>
          <Text style={text}>このリンクは48時間有効です。</Text>
          <Hr style={hr} />
          <Text style={footer}>
            ※このメールは送信専用です。返信いただいてもお答えできませんのでご了承ください。
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InvitationEmail;

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
