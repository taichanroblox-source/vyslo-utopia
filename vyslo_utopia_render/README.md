
# VYSLO UTOPIA

暗色テーマのWebページビューア。Flask製でRenderにデプロイできる構成です。

## Renderへの公開

1. このZIPを解凍する。
2. GitHubで新しいリポジトリを作り、`app.py`、`requirements.txt`、`Procfile`、`runtime.txt`、`templates`、`static` をアップロードする。
3. Renderで **New + → Web Service** を選び、そのGitHubリポジトリを接続する。
4. 設定：
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Deployを押す。

## ローカルで試す（Mac）

ターミナルでこのフォルダへ移動してから：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

ブラウザで `http://127.0.0.1:5000` を開く。

## 制限について

これはサーバー側で外部サイトを取得するプロキシではなく、ページをiframe内に表示するビューアです。サイト側の `X-Frame-Options` や Content Security Policy で埋め込みを禁止しているページは表示できません。その場合は「新しいタブで開く」を使います。すべてのWebサイトをプロキシ経由で開く機能はありません。
