## 使い方

1. パッケージをインストール
```bash
npm ci
```

2. Google Cloud プラットフォームでAPIキーを作成し、使用するGoogle Maps APIを有効化します。
- 使用するAPI：Maps JavaScript API, Geocoding API

3. .envファイルに`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`にAPIキーを設定
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
```

4. 以下のコマンドを実行
```bash
npm run dev
```
