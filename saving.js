let saveName = "(un)LimitedSave"
let initPlayerFunctionName = "getDefaultUser"
let playerVarName = "user" // DO NOT USE THE WORD "SAVE"
let importDangerAlertText = "Your imported save seems to be missing some values, which means importing this save might be destructive, if you have made a backup of your current save and are sure about importing this save please press OK, if not, press cancel and the save will not be imported."

function onImportError() {
    alert("Error: Imported save is in invalid format, please make sure you've copied the save correctly and isn't just typing gibberish.")
}

function onLoadError() {
    return // I will leave this to you
}

function onImportSuccess() {
    console.log("Save imported successfully.")
}
// Only change things above to fit your game UNLESS you know what you're doing

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function saveGame() {
  localStorage.setItem(saveName,btoa(JSON.stringify(window[playerVarName])))
}

function loadGame(save, imported = false) {
    let reference = window[initPlayerFunctionName]()
    try {
        var save = JSON.parse(atob(save))
        let refLists = listItems(reference)
        let saveLists = listItems(save)
        let missingItem = refLists[0].diff(saveLists[0])
        if (missingItem.includes("save")) {
            console.log("Unrecoverable corrupted save detected, loading default save...")
            return
        }
        if (missingItem.length != 0 && imported) {
            if (!confirm(importDangerAlertText)) {
                return
            }
        }
      
        missingItem.forEach(function(value) {
            eval(`save${generateArrayAccessCode(value)} = reference${generateArrayAccessCode(value)}`) // No one will exploit their browser with localStorage right
        })
      
        let decimalList = saveLists[1].diff(refLists[1])
        decimalList.forEach(function(value) {
            eval(`save${generateArrayAccessCode(value)} = new Decimal(save${generateArrayAccessCode(value)})`)
        })

        window[playerVarName] = save
        if (imported) onImportSuccess()
    } catch (err) {
        if (imported) {
            console.log(err)
            onImportError()
            return
        } else {
            console.log(err)
            onLoadError()
            return
        }
    }
}

function generateArrayAccessCode(keys) {
    let out = ""
    keys.split(".").forEach(function(value) {
        out += `["${value}"]`
    })
    return out
}

function listItems(data,nestIndex="") {
  let itemList = []
  let stringList = []
  Object.keys(data).forEach(function (index) {
    let value = data[index]
    let thisIndex = nestIndex + (nestIndex===""?"":".") + index
    itemList.push(thisIndex)
    switch (typeof value) {
      case "object":
        if (!(value instanceof Decimal)) {
          let temp = listItems(value, thisIndex)
          itemList = itemList.concat(temp[0])
          stringList = stringList.concat(temp[1])
        }
        break;
      case "string":
        stringList.push(thisIndex)
        break;
    }
  });
  return [itemList,stringList]
};
