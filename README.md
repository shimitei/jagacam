# jagacam

ブラウザを通じてカメラの映像をやり取りします。  
特徴としては、低速回線向けや通信容量の制限を回避するためにリアルタイム性を追求しません。
1fpsの1秒1コマ程度でやり取りします。

## 対応ブラウザ、条件

- Google Chrome（他は未確認）
- PC内蔵カメラまたは外付けカメラ

## 技術情報

ブラウザのクライアント側は、Navigator.getUserMedia APIを利用してカメラ映像をキャプチャします。  
キャプチャした画像データをWebSocketでサーバーと送受信します。

サーバー側は、Node.js（expressフレームワーク）で構築、WebSocketの処理はSocket.IOライブラリを使用しています。

## ToDo

- 1対1以外(3人以上)への対応
- Chrome以外のブラウザでの確認。Firefox、Edge。
