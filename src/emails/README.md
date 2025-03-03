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

React Emailには開発サーバー機能があり、作成したメールテンプレートを
ブラウザでプレビューすることができます。この機能を使用するには、
[React Email公式ドキュメント](https://react.email/docs/cli-reference/email-dev)を参照してください。

```
npx email dev
```

## 利用可能なテンプレート

現在、次のメールテンプレートが利用可能です：

- `invitation-email.tsx` - ユーザー招待メール