const scriptTag=document.createElement("script");scriptTag.src=chrome.runtime.getURL("injects/classroom_upload.js"),scriptTag.onload=()=>scriptTag.parentNode.removeChild(scriptTag);let doc=document.head||document.documentElement;doc.appendChild(scriptTag);