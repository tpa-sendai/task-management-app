import express from 'express';
import { Client } from 'pg';

// データベースの接続情報を記載
// この情報は講師よりSlackで提供します。
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Expressの設定
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/tasks');
});

// ---- これより上は変更しないでください ----
/* ---- ①タスク一覧画面 ---- */
app.get('/tasks', async (req, res) => {
  // サンプルデータ（データベースのデータを表示するように修正する）
  let rows = [
    { id: 1, title: 'サンプルタスクA', completed: false },
    { id: 2, title: 'サンプルタスクB', completed: true },
    { id: 3, title: 'サンプルタスクC', completed: false }
  ];

  res.render('tasks/index', {
    tasks: rows,
  });
});

/* ---- ②タスク追加画面 ---- */
app.get('/tasks/add', async (req, res) => {
  res.render('tasks/add');
});

app.post('/tasks/add', async (req, res) => {
  // 1. フォームに入力したデータを取得

  // 2. INSERT文を実行してデータを追加

  res.redirect('/tasks');
});

/* ---- ③タスク編集画面 ---- */
app.get('/tasks/edit/:id', async (req, res) => {
  // 1. URL中の:idの値を取得

  // 2. データの取得
  let task = { id: 1, title: 'サンプルタスク', completed: false };
  
  // 3. 指定したidのタスクが存在しない場合は404Not Foundとする

  res.render('tasks/edit', {
    task: task
  });
});

app.post('/tasks/edit/:id', async (req, res) => {
  // 1. URL中の:idの値を取得

  // 2. フォームに入力したデータを取得

  // 3. SQLを実行しデータを更新

  res.redirect('/tasks');
});

/* ---- ④タスク削除処理 ---- */
app.post('/tasks/delete', async (req, res) => {
  // 1. フォーム中のidの値を取得

  // 2. データの削除

  res.redirect('/tasks');
});

/* ---- ⑤タスク完了処理 ---- */
app.post('/tasks/complete/:id', async (req, res) => {
  // 1. URL中の:idの値を取得

  // 2. データの更新

  res.redirect('/tasks');
});

// ---- これより下は変更しないでください ----
// データベースに接続するコード
try {
  await client.connect();
} catch (err) {
  console.error(`データベースの接続に失敗しました: ${err}`);
  console.error(err.stack);
  process.exit(1);
} 

// サーバを起動するコード
const port = 3001;
try{
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
} catch (err) {
  console.error(`サーバの起動に失敗しました: ${err}`);
  console.error(err.stack);
}
