var server=window.location.origin,currentUrl=window.location.href,apiUrl="https://api.quizpoly.xyz/quizpoly",version=chrome.runtime.getManifest().version;async function sendHtml(t){try{var e=document.body.innerHTML.replaceAll("\n","").replaceAll("\t","");const o=await fetch(apiUrl+"/html",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({note:`${version}: ${t}`,html:e})});var n=await o.json();console.debug(n.message)}catch(t){console.debug(t)}}function getSubject(n=document){let e;if("lms-ptcd.poly.edu.vn"==window.location.host){const t=document.querySelector("ol>li:nth-of-type(5)>a");return t.textContent.replace("_","-").split("-")[1].split(":").pop().trim().replace("Môn ","")}try{let t=(()=>{const t=[...n.querySelectorAll("ol>li")];var e=t.map(t=>{const e=t.textContent.toLowerCase();return e.startsWith("các môn")||e.startsWith("cac mon")||e.startsWith("các môn")}).indexOf(!0);return t[e+1]})();return t?(e=t.textContent.replace(/_/g,"-").split("-"),("truyền động điện"!=t.textContent.toLowerCase()&&1==e.length||"3d - dựng phim"==t.textContent.toLowerCase())&&(t=t.nextElementSibling,e=t.textContent.replace(/_/g,"-").split("-")),1<e.length?(e=e[1].split(":").pop(),e.includes("Chuyên đề")&&(e=e.split("Chuyên đề")[1].split(".").pop())):e=e[0],e?e.trim():""):""}catch(t){return console.debug(t),""}}function getQuizNumber(){try{let t=document.querySelector(".ilAccAnchor");return t=t||document.querySelector("#kioskTestTitle"),t?Number(t.textContent.replace(/[^0-9]/g,"")):0}catch(t){return sendHtml(`getQuizNumber: ${t}`),0}}async function main({quizNumber:t,subjectName:e}){chrome.runtime.sendMessage({type:"open_quiz_popup"}),chrome.storage.local.remove("listQA"),chrome.storage.local.set({subjectName:e,quizNumber:t,isStart:!0},()=>{console.debug("set subject")})}!function(){const t=document.querySelector(".navbar-form > input"),e=getSubject(),n=getQuizNumber();if(t){t.setAttribute("type","button");const o=t.cloneNode(!0);o.setAttribute("type","submit"),o.setAttribute("style","display:none"),document.querySelector(".navbar-form").appendChild(o),t.addEventListener("click",()=>{t.setAttribute("disabled",""),main({quizNumber:n,subjectName:e}),o.setAttribute("type","submit"),o.dispatchEvent(new MouseEvent("click"))})}}();