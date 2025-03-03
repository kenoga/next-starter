import { InvitationEmail } from '../invitation-email';

export default function InvitationPreview() {
  return (
    <InvitationEmail
      inviteUrl="https://example.com/invite?token=sample-token"
      role="admin"
    />
  );
}
