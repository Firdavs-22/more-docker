# DockerでNodeJS、Express、PostgreSQL、Jestを使った環境を構築する（＋SSH接続）

## 概要
Docker環境で動作するTodoアプリについて説明します。このアプリケーションは、コードコンテナとデータベースコンテナの2つのコンテナで構成されています。
1. **コードコンテナ** 
   - Node.jsとExpressで構築されたアプリケーションが動作します。
   - SSH接続が可能です。
   - 2つのSSHユーザが存在します。
     - `root`ユーザ: 制限なしのユーザ。パスワードは`.env`ファイルに記載されています。
     - 一般ユーザ: 制限付きのユーザ。認証情報は`.env`ファイルに記載されています。
   - Jestを使ったテストが実行できます。
   - ホットリロードが有効になっており、コードの変更が即座に反映されます。
2. **データベースコンテナ**
   - PostgreSQLデータベースが動作します。
   - データはDockerボリューム`pgdata`に永続化されます。これにより、コンテナが再起動されてもデータベースである情報が失われません。

## 技術スタック
- **プログラミング言語**: `TypeScript`, `JavaScript`
- **フレームワーク**: `Node.js`, `Express`
- **ホットリロード**: `nodemon`
- **データベース**: `PostgreSQL`
- **コンテナ化**: `Docker`
- **テスト**: `Jest`
- **バージョン管理**: `Git`
- **環境管理**: `.env`

## 必要なもの
- **Docker**: コンテナ化されたアプリケーションを実行するために必要です。インストール方法は[こちら](https://docs.docker.com/get-started/get-docker/)。
- **Node.js**: JavaScriptランタイム。インストール方法は[こちら](https://nodejs.org/ja/download/)。
- **npm**: Node.jsのパッケージマネージャ。Node.jsをインストールすると自動的に含まれます。詳細は[こちら](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)。

## 環境構築
1. `.env.development`ファイルを作成し、以下の内容を記載します。必要に応じて編集してください。
```dotenv
NODE_ENV=development
PORT=80

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=docker-database

SSH_PORT=2222
SSH_ROOT_PASSWORD=nopassword
SSH_USER=new_user
SSH_USER_PASSWORD=password
```
  - `NODE_ENV`: 環境名。`development`、`production`、`test`のいずれかを指定します。
  - `PORT`: アプリケーションのポート番号。
  - `DB_HOST`: データベースのホスト名。
  - `DB_PORT`: データベースのポート番号。
  - `DB_USER`: データベースのユーザ名。
  - `DB_PASSWORD`: データベースのパスワード。
  - `DB_NAME`: データベース名。
  - `SSH_PORT`: SSH接続に使用するポート番号。
  - `SSH_ROOT_PASSWORD`: `root`ユーザのパスワード。
  - `SSH_USER`: 一般ユーザのユーザ名。
  - `SSH_USER_PASSWORD`: 一般ユーザのパスワード。

2. Dockerコンテナを起動します。
```bash
  npm run docker:dev-compose
```

## SSH接続
1. 実行中のコンテナを確認します。
```bash
  docker ps
```
- このコマンドは、現在実行中のDockerコンテナのリストを表示します。コンテナID、名前、ステータスなどの情報が表示されます。
2. `docker-backend`コンテナにSSH接続します。
```bash
    ssh root@localhost -p 2222
```
- このコマンドは、`root`ユーザとして`docker-backend`コンテナにSSH接続します。
- `localhost`は接続先ホストを示し、`-p 2222`はSSH接続に使用するポート番号を指定します。

または、一般ユーザで接続する場合は以下のコマンドを使用します。
```bash
    ssh new_user@localhost -p 2222
```
- `new_user`ユーザは`.env.development`ファイルで指定されたユーザ名です。

3. パスワードを入力します。パスワードは.env.developmentファイルに記載されています。

## テスト
1. SSH接続。
2. コンテナの中である`app`フォルダに移動。
```bash
  cd app
```
3. テストを実行。
```bash
  npm test
```
