function $(x) {return document.getElementById(x)}

function initializeGrid() {
  for(i=1;i<8;i++){
    for(j=1;j<8;j++){
      if(i==4&&j==6){
        continue;
      } else {
        let ii=i+1;
        let jj=j+1;
        var newSpan = document.createElement('span');
        newSpan.style="display:grid;grid-column:"+i+"/"+ii+";grid-row:"+j+"/"+jj;
        newSpan.class="blank";
        newSpan.id="blank"+i+j;
        $('gameSpace').appendChild(newSpan);
      }
    }
  }
}
