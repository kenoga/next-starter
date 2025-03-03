// スクリプト: 指定メールアドレスのユーザーを管理者に設定する
// .envファイルを読み込む
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function makeAdmin(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`ユーザーが見つかりません: ${email}`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    });

    console.log(`ユーザーを管理者に更新しました:`);
    console.log(`- ID: ${updatedUser.id}`);
    console.log(`- メール: ${updatedUser.email}`);
    console.log(`- ロール: ${updatedUser.role}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 引数からメールアドレスを取得、なければnogaken1107@gmail.comをデフォルトに
const email = process.argv[2] || 'nogaken1107@gmail.com';
makeAdmin(email);
