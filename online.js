const apiUrl="https://api.cap.quizpoly.xyz";let subjectName="",studentCode="";async function addQuiz(e){try{var t={subjectName:subjectName,contribute:studentCode,quizzes:e};const n=await fetch(apiUrl+"/quizpoly/online",{method:"POST",headers:{"Content-Type":"application/json"},referrerPolicy:"origin",body:JSON.stringify(t)});var a=await n.json();console.debug(a.message),setTimeout(()=>{message.value("Gửi đáp án thành công!"),btnContribute.set("disabled",!1)},1e3)}catch(e){console.log(e),message.value(`Lỗi: ${e.message}`)}}function capitalize(e){return e.trim().charAt(0).toUpperCase()+e.slice(1)}chrome.storage.local.get(["subjectName_","user"],({subjectName_:e,user:t})=>{subjectName=e,studentCode=t&&t.email&&t.email.split("@")[0],DOM.find("h1").value(subjectName),DOM.find("#note>span").value(studentCode)}),chrome.runtime.onMessage.addListener(function(e,t,a){return chrome.runtime.lastError?alert(`Có lỗi xảy ra, thử lại hoặc báo lỗi admin: ${chrome.runtime.lastError}`):("online_data"==e.type&&(subjectName=e.subject,studentCode=studentCode||e.studentCode,DOM.find("h1").value(subjectName),DOM.find("#note>span").value(studentCode)),!0)});const form=DOM.find("form"),inputGroup=DOM.find("form>div"),inputItem=`
  <div>
    <label for="ques" class="block text-sm font-medium text-gray-600 my-2">
      Câu hỏi
    </label>
    <textarea type="text" name="ques" 
      class="px-4 py-2 text-base w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" rows="1"></textarea>
    <label for="ans" class="block text-sm font-medium text-gray-600 my-2">
      Đáp án
    </label>
    <textarea type="text" name="ans"
    class="px-4 py-2 text-base w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" rows="1"></textarea>
  </div>
`,note=DOM.create(`
  <div id="note" class="self-start text-base">
  Cố tình gửi đáp án lung tung, sai sẽ bị ban acc<br>
  Gửi đáp án với tư cách là
  <span class="text-blue-400"></span>
  </div>
`),message=DOM.create(`
  <div id="message" class="self-start text-base text-blue-400 font-semibold">
  </div>
`),btnContribute=DOM.create(`
  <button class="bg-yellow-400 text-white text-base py-2 rounded-xl float-right w-full">
    Gửi đáp án
  </button>
`);btnContribute.on("click",["target"],e=>{e.set("disabled",!0);const t=DOM.findAll("textarea[name=ques]").map((e,t)=>[e,DOM.findAll("textarea[name=ans]")[t]]);var a=t.map(([e,t])=>({ques:capitalize(e.value()),ans:capitalize(t.value())})).filter(e=>e.ques&&e.ans);console.debug(a),a.length?addQuiz(a):(alert("Bạn chưa nhập câu nào!"),e.set("disabled",!1))});const btnAddItem=DOM.create(`
  <div class="bg-blue-400 text-white px-3 py-1.5 rounded-xl float-right mt-5 cursor-pointer">
    Thêm câu hỏi
  </div>
`);btnAddItem.on("click",()=>inputGroup.append(inputItem)),inputGroup.append(inputItem,inputItem,inputItem);const div=DOM.create('<div class="flex flex-col items-end space-y-4"></div>');div.append(btnAddItem,note,message,btnContribute),form.after(div);