const apiUrl="https://api.quizpoly.xyz",lab=document.querySelector(".ilTableHeaderTitle > a")?.innerText.split("-")[1].trim();let lecturers="",subjectName="",classCode="",server="",term="";function sendFile(e){console.debug(e);var t=e.url,r=humanFileSize(e.size),n=lecturers?`${classCode} - ${lecturers}`:classCode,n={fileUrl:t,fileName:e.name,size:r,subjectName:subjectName,class:n,lab:lab,server:server,term:term};fetch(apiUrl+"/quizpoly/lab",{method:"POST",headers:{"Content-Type":"application/json"},referrerPolicy:"origin",body:JSON.stringify(n)}).then(e=>e.json()).then(e=>console.debug(e))}function popUpFshare(){$("#upload").bind("fileuploadcompleted",function(e,t){var r=t.result,n=t.contentType,t=r+n,t=getUrlParameter("ass_id");sendFile(r),$.ajax({type:"POST",data:JSON.stringify({data:r,mimetype:n,ass_id:t}),contentType:"application/json",url:"fshare.php",dataType:"json",context:$("#fileupload")[0],success:function(e){"error"==e.error&&alertbox("Đã có lỗi xảy ra, vui lòng thử lại !"),location.reload()}}),location.reload()});var e=$("#uploadfile");e.find(".modal-dialog").css("width",$(window).width()/3),e.modal("show")}function getSubject(){let r="";try{let e=(()=>{const e=[...document.querySelectorAll("ol>li")];var t=e.map(e=>{const t=e.textContent.toLowerCase();return t.startsWith("các môn")||t.startsWith("cac mon")||t.startsWith("các môn")}).indexOf(!0);return e[t+1]})();if(!e)return"";var n=e.textContent.replace("_","-").split("-");("truyền động điện"!=e.textContent.toLowerCase()&&1==n.length||"3d - dựng phim"==e.textContent.toLowerCase())&&(e=e.nextElementSibling);let t=e?e.textContent.trim():"";t||sendHtml("can not get classText uploadscript");const l=t.replace("_","-").split("-");if(t.toLowerCase().includes("thầy ")||t.toLowerCase().includes("cô ")||t.toLowerCase().includes("thầy: ")||t.toLowerCase().includes("cô: "))t=l,r=t.pop().trim(),t=t.map(e=>e.trim()).join("_");else if(4<=l.length)r=l.slice(-2).join("-").trim(),t=l.slice(0,2).join("-").trim();else{const i=e.nextElementSibling;r=i?i.innerText.trim():"",r.startsWith("Block")&&(r=i.nextElementSibling&&i.nextElementSibling.innerText.trim())}(r.toLowerCase().includes("nộp")||r.toLowerCase().includes("nop")||"assignment"==r.toLowerCase())&&sendHtml("classText nộp"),subjectName=t||"",classCode=r||"",console.debug(subjectName),console.debug(classCode)}catch(e){sendHtml(`Upload fshare get subject error: ${e.message}`)}}async function getLecturers(){let e=document.querySelector(".breadcrumb>li:nth-last-child(2)>a");if(null===e.innerText.match(/^[A-Z]{2,3}[0-9]{3,5}([_|\.][0-9]{1,2})?$/)&&(e=document.querySelector(".breadcrumb>li:nth-last-child(3)>a"),null===e.innerText.match(/^[A-Z]{2,3}[0-9]{3,5}([_|\.][0-9]{1,2})?$/)))return"";var t,r=e.getAttribute("href"),n=/ref_id=([^&]+)/.exec(r)[1],r=`${window.location.origin}/ilias.php?ref_id=${n}&cmdClass=ilusersgallerygui&cmd=view&cmdNode=q4:gv:6r:ye&baseClass=ilrepositorygui`;const l=await fetch(r),i=await l.text(),o=[];for(t of parseHTML(i).querySelectorAll(".ilUser>h3")){const s=t.innerText;if(!(s.replace(/[^0-9]/g,"").length<5))break;o.push(s)}if(lecturers=o.length?o.join(" - "):"",!lecturers){n=`${window.location.origin}/ilias.php?ref_id=${n}&cmdClass=ilrepositorygui&cmdNode=q4&baseClass=ilrepositorygui`;const a=await fetch(n),c=parseHTML(await a.text()).querySelector(".ilHeaderDesc");c&&(lecturers=c.innerText.trim()),lecturers||i.includes("Sorry, an error occurred")||sendHtml(`lecturers empty - ${l.status} - ${classCode}`,i)}console.debug(lecturers)}function getServerTerm(e=document.querySelector("ol")){try{term=e.querySelector("li:nth-child(3) > a").innerText.split(" ").slice(-2).join(" "),server=e.querySelector("li:nth-child(2) > a").innerText.replace("FPT Polytechnic ","").split(" ").map(e=>e.charAt(0)).join("")}catch(e){sendHtml(`Upload fshare get server term error: ${e.message}`)}}async function sendHtml(e,t){try{t=t||document.body.innerHTML.replaceAll("\n","").replaceAll("\t",""),fetch(apiUrl+"/quizpoly/html",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({note:`${e}`,html:t})})}catch(e){console.debug(e)}}function humanFileSize(e,t=1){if(Math.abs(e)<1e3)return e+" B";var r=["kB","MB","GB","TB","PB","EB","ZB","YB"];let n=-1;for(var l=10**t;e/=1e3,++n,1e3<=Math.round(Math.abs(e)*l)/l&&n<r.length-1;);return e.toFixed(t)+" "+r[n]}function parseHTML(e){return(new DOMParser).parseFromString(e,"text/html")}document.querySelector("tbody > tr > .ilCenter")&&(getSubject(),getLecturers(),getServerTerm());