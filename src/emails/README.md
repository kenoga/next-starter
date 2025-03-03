# メールテンプレート

このディレクトリには、アプリケーションで使用するメールテンプレートが含まれています。
テンプレートは [React Email](https://react.email/) を使用して作成されています。

## 使用方法

1. `src/emails/` ディレクトリに新しいテンプレートファイルを作成します
2. `@react-email/components` からコンポーネントをインポートします
3. `@react-email/render` の `render` 関数を使用してHTMLに変換します

## テンプレートの追加方法

新しいメールテンプレートを追加するには：

1. 適切な名前の新しい `.tsx` ファイルを作成します（例：`welcome-email.tsx`）
2. 必要なプロパティを受け取るインターフェースを定義します
3. Reactコンポーネントを作成し、スタイリングを適用します
4. `src/lib/mail.ts` に新しい送信関数を追加します

## テンプレートのプレビュー

開発サーバーでメールテンプレートをプレビューする方法：

```bash
# プロジェクトルートで実行
npm run email:dev
```

これにより http://localhost:3000 でプレビューサーバーが起動します。
`src/emails/preview/` 内の各ファイルがプレビューとして表示されます。

新しいテンプレートを追加する際は、同時に対応するプレビューファイルも作成してください：

```tsx
// src/emails/preview/welcome.tsx の例
import { WelcomeEmail } from '../welcome-email';

export default function WelcomePreview() {
  return (
    <WelcomeEmail
      name="山田太郎"
      loginUrl="https://example.com/login"
    />
  );
}
```

## 実装の詳細

1. **コンポーネント**: `@react-email/components` は、メール互換性の高いReactコンポーネントを提供
2. **レンダリング**: `@react-email/render` の `render()` 関数でHTMLに変換
3. **送信**: 生成されたHTMLを SendGrid APIで送信

## セキュリティとベストプラクティス

- テンプレートにユーザー入力を含める場合は、XSS攻撃を防ぐためにサニタイズしてください
- 機密情報やトークンの有効期限を設定し、メール内のリンクには短い有効期限を設定してください
- 大量のメール送信は、バッチ処理やキューを使用して行ってください

## 利用可能なテンプレート

現在、次のメールテンプレートが利用可能です：

- `invitation-email.tsx` - ユーザー招待メール