var dataInit = {
    'data':[
        {'src':'0.jpg'}
        , {'src':'1.jpg'}
        , {'src':'2.jpg'}
        , {'src':'3.jpg'}
        , {'src':'4.jpg'}
        , {'src':'5.jpg'}
    ]
};

var iMinZindex = 2;


function getByClassName(oParent, sClass) {
    var aResult = new Array();
    var aElements = oParent.getElementsByTagName('*');
    for(var i = 0 ; i < aElements.length; i++){
        if(aElements[i].className == sClass){
            aResult.push(aElements[i]);
        }
    }
    return aResult;
}

function getIndex(arr, value) {
    for(var i in arr){
        if(arr[i] == value)return i;
    }
}

function cdTest (obj1, obj2){
    var l1 = obj1.offsetLeft;
    var r1 = obj1.offsetLeft + obj1.offsetWidth;
    var t1 = obj1.offsetTop;
    var b1 = obj1.offsetTop + obj1.offsetHeight;

    var l2 = obj2.offsetLeft;
    var r2 = obj2.offsetLeft + obj2.offsetWidth;
    var t2 = obj2.offsetTop;
    var b2 = obj2.offsetTop + obj2.offsetHeight;

    if(r1 <= l2 || l1 >= r2 || b1 <= t2 || t1 >= b2){
        return false;
    }
    else return true;
}

function setDrag(index, boxs){
    var obj = boxs[index];
    obj.onmousedown = function (ev){
        var oEvent = ev || event;
        obj.style.zIndex = iMinZindex++;
        var disX = oEvent.clientX - obj.offsetLeft;
        var disY = oEvent.clientY - obj.offsetTop;
        document.onmousemove = function (ev){
            var oEvent = ev || event;
            obj.style.left = oEvent.clientX - disX + 'px';
            obj.style.top = oEvent.clientY - disY + 'px';
            for(i = 0; i < boxs.length; i++){
                if(cdTest(obj, boxs[i])){
                    boxs[i].className = "box active";
                }
            }
        }
        document.onmouseup = function (){
            document.onmousemove = null;
            document.onmouseup = null;
        }
        return false;
    }
}

function waterfall(parent, sclass) {
    var oParent = document.getElementById(parent);
    var aBox = getByClassName(oParent, sclass);
    var boxwidth = aBox[0].offsetWidth;
    var documentwidth = document.body.clientWidth || document.documentElement.clientWidth;
    var cnum = Math.floor(documentwidth/boxwidth);
    oParent.style.width = boxwidth * cnum + 'px';

    var aBoxHeight = new Array();
    for(var i = 0; i < aBox.length; i++){
        if(i < cnum){
            aBox[i].style.position = 'absolute';
            aBox[i].style.top = 0 + 'px';
            aBox[i].style.left = boxwidth * i + 'px';
            aBoxHeight.push(aBox[i].offsetHeight);
        }
        else {
            var minHeight = Math.min.apply(null, aBoxHeight);
            var minIndex = getIndex(aBoxHeight, minHeight);
            aBox[i].style.position = 'absolute';
            aBox[i].style.top = minHeight + 'px';
            aBox[i].style.left = aBox[minIndex].offsetLeft + 'px';
            aBoxHeight[minIndex] += aBox[i].offsetHeight;
        }
    }
    for(var i = 0; i < aBox.length; i++){
        setDrag(i, aBox);
    }
}

function checkScrollside(sParent, sClass) {
    var oParent = document.getElementById(sParent);
    var aBox = getByClassName(oParent, sClass);
    var lastImgIn = aBox[aBox.length-1].offsetTop + Math.floor(aBox[aBox.length-1].offsetHeight/2);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var documentheight = document.body.clientHeight || document.documentElement.clientHeight;
    return (lastImgIn < scrollTop + documentheight);
}

window.onload = function() {
    waterfall('main', 'box');
}
window.onscroll = function () {
    if(checkScrollside('main', 'box')){
        var oParent = document.getElementById('main');
        for(var i = 0; i < dataInit.data.length; i++) {
            var oBox = document.createElement('div');
            oBox.className = 'box';
            var oPic = document.createElement('div');
            oPic.className = 'pic';
            var oImg = document.createElement('img');
            oImg.src = './images/' + dataInit.data[i].src;
            oPic.appendChild(oImg);
            oBox.appendChild(oPic);
            oParent.appendChild(oBox);
        }
        waterfall('main', 'box');
    }
}
window.onresize = function(){
    waterfall('main', 'box');
}