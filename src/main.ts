/// <reference types="types-for-adobe/Photoshop/2015.5"/>

// 書き換えるかもしれない定義
const EXPORTDIRPATH = "D:/oekaki/paint/exports/"
const SABUNNAME = "sbn"
const FORCEVISIBLENAME = "p"

try {
  main();
} catch (e) {
  alert(e);
}

// メイン処理
function main() {
  this.AllLayerSets = [];
  const docObj = duplicateResize(497, 942)
  app.activeDocument = docObj

  createAllLayerSets(this.AllLayerSets, docObj.layerSets)
  const savedVisibleInfoArray = getAllLayerSetsVisible()
  // すべて非表示
  setVisibleAllLayers(false)
  // 差分レイヤーセット情報をすべて取得
  const sbns = getAllSabunCountsObjs()
  for (const sbnName in sbns) {
    // 差分レイヤーのみを表示する
    setVisibleSabunLayers(true, sbnName)
    // 差分画像を出力する
    const fileObj = new File(EXPORTDIRPATH + sbnName + ".png")
    // const options  = new ExportOptionsSaveForWeb()
    // options.format = SaveDocumentType.PNG;
    // options.quality = 100
    // docObj.exportDocument(fileObj, ExportType.SAVEFORWEB, options);
    const options = new PNGSaveOptions();
    options.interlaced = false;
    docObj.saveAs(fileObj, options, true, Extension.LOWERCASE);
  }

  setAllLayerSetsVisible(savedVisibleInfoArray)
  alert("完了！", "完了！", false)
};

/**
 * 再帰でレイヤーセットをすべて取得する
 * @param array 
 * @param layerSets 
 */
function createAllLayerSets(array, layerSets) {
  for (const layerSet of layerSets) {
    array.push(layerSet)
    if (layerSet.typename == "LayerSet") {
      if (layerSet.layerSets.length != 0) {
        createAllLayerSets(array, layerSet.layerSets)
      }
    }
  }
}

/**
 * 現在のドキュメントを複製してリサイズする
 * @param width 幅
 * @param height 高さ
 * @returns 
 */
function duplicateResize(width: number, height: number) {
  const dupObj = app.activeDocument.duplicate();
  dupObj.resizeImage(width, height)
  return dupObj
}

/**
 * すべてのレイヤーセットの表示情報を取得する
 * @returns 
 */
function getAllLayerSetsVisible() {
  const array: boolean[] = []
  for (const layerSet of this.AllLayerSets) {
    array.push(layerSet.visible)
  }
  return array
}

/**
 * すべてのレイヤーセットの表示情報を設定する
 * 配列の数、順番が同じである前提
 * @param boolArray 
 */
 function setAllLayerSetsVisible(boolArray: boolean[]) {
  for (let i = 0; i < this.AllLayerSets.length; i++) {
    const layerSet = this.AllLayerSets[i];
    layerSet.visible = boolArray[i]
  }
}


/**
 * 全レイヤーセットに対して表示か非表示を設定する
 * @param visible 
 */
function setVisibleAllLayers(visible: boolean) {
  for (const layerSet of this.AllLayerSets) {
    let layerName = layerSet.name
    let splitUnderScores = layerName.split("_")
    for (const splitUnderScore of splitUnderScores) {
      if (splitUnderScore == "hidden") {
        layerSet.visible = false;
        break
      }
    }
    layerSet.visible = visible;
  }
}


/**
 * 全て走査して差分レイヤーセット情報を取得する
 * （名前だけ使う）
 * @returns 
 */
function getAllSabunCountsObjs() {
  const obj: Object = {}
  for (const layerSet of this.AllLayerSets) {
    let layerName = layerSet.name
    let splitUnderScores = layerName.split("_")
    let index = 0
    for (const splitUnderScore of splitUnderScores) {
      if (splitUnderScore == SABUNNAME && obj[splitUnderScores[index + 1]] == undefined) {
        obj[splitUnderScores[index + 1]] = 1
      } else if (splitUnderScore == SABUNNAME && obj[splitUnderScores[index + 1]] >= 1) {
        obj[splitUnderScores[index + 1]] = obj[splitUnderScores[index + 1]] + 1
      }
    }
  }
  return obj
}

/**
 * 指定する差分レイヤーセットのみ表示にし、他のレイヤーセットは非表示にする
 * 親レイヤーセット（p）のみ表示状態にする
 * @param visible 
 * @param sabunName 
 */
function setVisibleSabunLayers(visible: boolean, sabunName: String) {
  for (const layerSet of this.AllLayerSets) {
    // 差分の該当名があるものを表示する
    let isSabun = false
    let layerName = layerSet.name
    let splitUnderScores = layerName.split("_")
    let index = 0
    for (const splitUnderScore of splitUnderScores) {
      if (splitUnderScore == SABUNNAME && splitUnderScores[index + 1] == sabunName) {
        layerSet.visible = true;
        isSabun = true
        break
      } else if (splitUnderScore == FORCEVISIBLENAME) {
        // 強制Visible
        layerSet.visible = true;
        isSabun = true
        break
      }
      index = index + 1
    }
    if (!isSabun) {
      layerSet.visible = false;
    }
  }
}