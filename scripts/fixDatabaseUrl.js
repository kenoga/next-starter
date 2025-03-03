// データベースURLの環境変数の値を修正するスクリプト
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

try {
  // .envファイルを読み込む
  const envContent = fs.readFileSync(envPath, 'utf8');

  // DATABASE_URLの行を修正（ダブルクォートを削除）
  const updatedContent = envContent.replace(
    /DATABASE_URL=["'](.+)["']/,
    'DATABASE_URL=$1'
  );

  // 変更を書き込む
  fs.writeFileSync(envPath, updatedContent);

  console.log('✅ DATABASE_URLを修正しました');
} catch (error) {
  console.error('❌ エラーが発生しました:', error);
}
