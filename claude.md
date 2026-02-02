以下の仕様で、Chrome拡張（Manifest v3）をローカルに自動生成してください。

目的：
任意のJavaScriptを保存・選択・実行できる汎用スクリプトランナー拡張「DOMRider」を作る。

フォルダ名：
dom-rider

構成：

dom-rider/
├ manifest.json
├ background.js
├ popup.html
└ popup.js


① manifest.json

- manifest_version: 3
- name: DOMRider
- version: 1.0.0
- description: Hacker-style universal script runner
- permissions:
  - storage
  - activeTab
  - scripting
  - clipboardWrite
- host_permissions: <all_urls>
- background: service_worker = background.js
- action: default_popup = popup.html


② background.js

- popup から受け取ったJSコードを
  chrome.scripting.executeScript で
  現在のアクティブタブに注入実行する
- new Function(code) を使って実行する


③ popup.html

- select（スクリプト一覧）
- Run ボタン
- textarea（コード編集）
- Save ボタン
- 幅360px程度
- monospaceフォント
- popup.js を読み込む


④ popup.js

機能：

- chrome.storage.local に scripts オブジェクトを保存
- 起動時に読み込み
- select に一覧表示
- Saveで保存
- Runで background.js に送信


⑤ 実装条件

- ES6対応
- async/await可
- 例外は alert で表示
- 省略しない


⑥ 出力形式

- 実際にファイルを作成する
- 各ファイルに正しい内容を書き込む


⑦ 最後に

README形式で導入手順も表示する：

1. chrome://extensions
2. デベロッパーモードON
3. 「パッケージ化されていない拡張機能を読み込む」
4. dom-rider フォルダを指定

以上を満たして実装してください。

