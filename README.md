# DOMRider

Hacker-style universal script runner - 任意のJavaScriptを保存・選択・実行できる汎用スクリプトランナーChrome拡張

## 機能

- JavaScriptコードの保存・管理・削除
- 保存したスクリプトの選択・実行
- **Run**: 現在のアクティブタブにスクリプトを注入実行
- **Run+Copy**: 実行結果をクリップボードにコピー
- Chrome Debugger APIによる強力なスクリプト実行

## 導入手順

1. `chrome://extensions` を開く
2. 右上の「デベロッパーモード」をONにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `dom-rider` フォルダを指定

## 使い方

1. 拡張機能アイコンをクリックしてポップアップを開く
2. textareaにJavaScriptコードを入力
3. Script Nameを入力して「Save」で保存
4. selectから保存済みスクリプトを選択可能
5. 「Run」で実行、「Run+Copy」で実行結果をコピー
6. 「Delete」で選択中のスクリプトを削除

## ファイル構成

```
dom-rider/
├── manifest.json   # 拡張機能の設定
├── background.js   # Service Worker（Debugger APIでスクリプト実行）
├── popup.html      # ポップアップUI（ダークテーマ）
├── popup.js        # ポップアップのロジック
└── README.md
```

## 技術仕様

- Manifest V3
- ES6 / async-await対応
- chrome.storage.local でスクリプト保存
- chrome.debugger API でコード実行（userGesture対応）
- clipboardWrite でクリップボード書き込み

## 注意事項

- 実行するスクリプトは自己責任で管理してください
- Debugger使用時にChromeが警告バナーを表示します
- 一部のページ（chrome://など）では実行できません
