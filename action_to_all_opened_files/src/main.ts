/// <reference types="types-for-adobe/Photoshop/2015.5"/>

// 書き換えるかもしれない定義
// const EXPORTDIRPATH = "D:/oekaki/paint/exports/"
// const SABUNNAME = "sbn"
// const FORCEVISIBLENAME = "p"

try {
  main();
} catch (e) {
  alert(e);
}

// メイン処理
function main() {
  const docs:any = app.documents 
  for (const doc of docs) {
    app.activeDocument = doc
    app.doAction('resize_chara_sheet_tip','my_actions');
  }

  alert("完了！", "完了！", false)
};