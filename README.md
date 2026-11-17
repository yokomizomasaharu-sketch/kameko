# まさてゃんカメコ

推しの写真をまとめて保存・閲覧できるアイドル写真アーカイブ（PWA）。

- 公開URL: https://yokomizomasaharu-sketch.github.io/kameko/
- iPhoneは Safari で開いて「共有 → ホーム画面に追加」でアプリとして使えます。

## v2（2026-11-18）

- 画面下タブ（ホーム／ギャラリー／＋追加／お気に入り／マイページ）のネイティブアプリ風UI
- グループを選ぶとテーマカラーが切り替わる（＝LOVE / ≠ME / ≒JOY / AKB48 / iLiFE!）
- ストーリー風の丸型グループアイコン。長押しでスマホの写真からアイコンを設定
- マイページのプロフィールアイコンも写真から設定（端末内に保存）
- ホーム画面アイコンから開いたとき用のメール＋パスワード導線を明確化
- iPhone Safe Area 対応、相対パス化、Service Worker キャッシュ更新

## 中身

`index.html` / `assets/` / `icons/` / `manifest.json` / `sw.js` はViteのビルド成果物です。
`demo/` はUI確認用のサンプル写真（`?demo=1` のときだけ表示され、実際の写真データには触れません）。
ソースは手元の `work/kameko-inspect/repo` にあり、`npm run build` → `dist/` をこのフォルダへコピーして更新します。
