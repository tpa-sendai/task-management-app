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
  // URL中の:idの値を取得
  let id = req.params.id;

  // データの取得
  let query = 'SELECT id, title, completed FROM tasks WHERE id = $1';
  let values = [id];
  let result = await client.query(query, values);
  
  // 指定したidのタスクが存在しない場合は404Not Foundとする
  if (result.rowCount === 0) {
    return res.status(404).send('Task not found');
  }

  res.render('tasks/edit', {
    task: result.rows[0]
  });
});

app.post('/tasks/edit/:id', async (req, res) => {
  // URL中の:idの値を取得
  let id = req.params.id;

  // フォームに入力したデータを取得
  let title = req.body.title;
  let completed = req.body.completed === '完了';

  // データの取得
  let query = 'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3';
  let values = [title, completed, id];
  await client.query(query, values);

  res.redirect('/tasks');
});

/* ---- ④タスク削除処理 ---- */
app.post('/tasks/delete', async (req, res) => {
  // フォーム中のidの値を取得
  let id = req.body.id;

  // データの削除
  let query = 'DELETE FROM tasks WHERE id = $1';
  let values = [id];
  await client.query(query, values);

  res.redirect('/tasks');
});

/* ---- ⑤タスク完了処理 ---- */
app.post('/tasks/complete/:id', async (req, res) => {
  // URL中の:idの値を取得
  let id = req.params.id;

  // データの更新
  let query = 'UPDATE tasks SET completed = TRUE WHERE id = $1';
  let values = [id];
  await client.query(query, values);

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
