




/*
     FILE ARCHIVED ON 23:56:09 Feb 21, 2006 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:13:40 Jul 31, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
<!--
// Under Water Mouse - Kurt Grigg - /web/20060221235609/http://www.btinternet.com/~kurt.grigg/javascript
// Script featured on Able2Know.com
// Find free scripts & get free help: /web/20060221235609/http://search.able2know.com/web_development/scripts/

n4=(document.layers);
n6=(document.getElementById&&!document.all);
ie=(document.all);
o6=(navigator.appName.indexOf("Opera") != -1)?true:false;

img0=new Image();
img0.src="/web/20060221235609/http://www.team-loekke.dk/starlord/trail05/heart.gif";

//Netscape 6 struggles, again! Always use a lower amount for this browser.
num=(n6)?30:30;

//Nothing needs altering past here.......................
y=0;
x=0;
if (n4||n6){
window.captureEvents(Event.MOUSEMOVE);
function mouse1(e){
 y = e.pageY-20-window.pageYOffset;
 x = e.pageX-4;
 } 
if (n4) window.onMouseMove=mouse1;
else document.onmousemove=mouse1;
}
if (ie||o6){
 function mouse2(){
 y = (ie)?event.clientY-20:event.clientY-20-window.pageYOffset;
 x = event.clientX-4;
 } 
document.onmousemove=mouse2;
}
yp=new Array();
xp=new Array();
sp=new Array();
rt=new Array();
gr=new Array();
s1=new Array();
s2=new Array();
nz=new Array();
wh=(ie)?window.document.body.clientHeight:window.innerHeight;
for (i=0; i < num; i++){                                                                
 yp[i]=Math.random()*wh-y;
 xp[i]=x;
 sp[i]= 6+Math.random()*3;
 s1[i]=0;
 s2[i]=Math.random()*0.1+0.05;
 gr[i]=4;
 nz[i]=Math.random()*15+5;
 rt[i]=Math.random()*0.5+0.1;
}
if (n4){
 for (i=0; i < num; i++){
 document.write("<LAYER NAME='bub"+i+"' LEFT=0 TOP=-50>"
+"<img src='/web/20060221235609/http://www.team-loekke.dk/starlord/trail05/heart.gif' width="+nz[i]+" height="+nz[i]+"></LAYER>");
 }
}
if (ie){
document.write('<div style="position:absolute;top:0px;left:0px"><div style="position:relative">');
 for (i=0; i < num; i++){
 document.write('<img id="bub'+i+'" src="'+img0.src+'" style="position:absolute;top:-50px;left:0px">');
 }
 document.write('</div></div>');
}
if (n6||o6){
 for (i=0; i < num; i++){
 document.write("<div id='bub"+i+"' style='position:absolute;top:-50px;left:0px'>"
+"<img src="+img0.src+" width="+nz[i]+" height="+nz[i]+"></div>");
 }
}
function MouseBubbles(){
scy=(document.all)?document.body.scrollTop:window.pageYOffset;
scx=(document.all)?document.body.scrollLeft:window.pageXOffset;
for (i=0; i < num; i++){
sy = sp[i]*Math.sin(270*Math.PI/180);
sx = sp[i]*Math.cos(s1[i]*5);
yp[i]+=sy;
xp[i]+=sx; 
if (yp[i] < -40){
 yp[i]=y;
 xp[i]=x;
 sp[i]= 6+Math.random()*1;
 gr[i]=4;
 nz[i]=Math.random()*15+5;
}
if (n4){
 document.layers["bub"+i].left=xp[i]+scx;
 document.layers["bub"+i].top=yp[i]+scy;
}
if (ie){
 document.getElementById("bub"+i).style.left=xp[i]+scx;
 document.getElementById("bub"+i).style.top=yp[i]+scy;
 document.getElementById("bub"+i).style.width=gr[i];
 document.getElementById("bub"+i).style.height=gr[i]; 
}
if (n6||o6){
 document.getElementById("bub"+i).style.left=xp[i]+scx;
 document.getElementById("bub"+i).style.top=yp[i]+scy;
}
gr[i]+=rt[i]; 
s1[i]+=s2[i];
if (gr[i] > 14) gr[i]=15;
}
setTimeout('MouseBubbles()',10);
}
MouseBubbles();
//SL-->