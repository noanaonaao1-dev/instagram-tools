# Lumi - Instagram Story Diagnostic Tools

Instagramストーリーでシェアされることを目的とした、診断・占いツールのプラットフォームです。

## コンセプト
- **系統**: 淡色女子、ニュアンスカラー、透明感、ミニマル
- **目的**: 雑誌の目次のような洗練されたデザインを通じて、友達同士のコミュニケーションを促進する

## 技術スタック
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Cloudflare Pages Functions (Hono)
- **Database**: Cloudflare KV
- **Image Generation**: html-to-image (ブラウザ側での生成)

## 主要機能
1. **ランディングページ**: 診断ツールがタイル状に並ぶミニマルなポータル。KVから外部サイトの登録も可能。
2. **私を構成する成分表 (The Palette of Me)**:
   - ユーザーが自分用のリンクを発行。
   - 友達が回答すると、リアルタイムに背景の水彩グラデーションが変化。
   - 最終結果をInstagramストーリー（9:16）比率で画像化。
   - メンション用の余白を設けたデザイン。

## 開発・セットアップ

本プロジェクトは npm workspaces を使用しています。ルートディレクトリで一度インストールを行うだけで、全てのパッケージの準備が整います。

### インストール
```bash
npm install
```

### フロントエンド（開発モード）
```bash
npm run dev -w frontend
```

### バックエンド / 全体ローカル実行
```bash
# フロントエンドをビルド
npm run build -w frontend

# wranglerでFunctionsを含めて実行
npx wrangler pages dev frontend/dist --port 3000
```

### デプロイ
1. Cloudflare Pagesにリポジトリを連携します。
2. ビルド設定を以下のように入力します：
   - **Framework preset**: `Vite`
   - **Build command**: `cd frontend && npm run build`
   - **Build output directory**: `frontend/dist`
3. **重要：KVバインディングの設定**
   デプロイ後、Cloudflareダッシュボードから以下を設定してください：
   - 「設定」>「関数」>「KV名前空間バインディング」
   - **変数名**: `LUMI_KV`
   - **KV名前空間**: 事前に作成したKVを選択

## ライセンス
MIT
