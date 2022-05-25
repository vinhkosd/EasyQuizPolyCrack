"use strict";
var lmsMessage = `Vào lms làm bài như bình thường tiện ích sẽ tự giải đáp án
<span class="text-green-600">Nếu đợi lâu không hiện đáp áp, nhấn vào icon chọn Giải Quiz LMS lại</span>
<span class="text-red-500">Nếu không được thì báo lỗi trong group fb</span>`,
    apiUrl = "https://api.cap.quizpoly.xyz";

function u() {
    return new Promise(t => {
        chrome.runtime.sendMessage({
            type: "open_quiz_link"
        }, e => {
            console.debug(e), t("success" == e || "p" == e)
        })
    })
}
async function getUserType(e) {
    try {
        const t = await fetch(apiUrl + "/user/userType/" + e);
        return t.json()
    } catch (e) {
        return console.log(e), null
    }
}

function LMS() {
    chrome.tabs.query({
        active: !0,
        currentWindow: !0
    }, async e => {
        const t = e[0].url;
        if (t.includes("&sequence=") || t.includes("outUserPassDetails")) chrome.storage.local.set({
            execute: !0
        }, () => {
            chrome.tabs.executeScript(null, {
                file: "injects/lms_script.js"
            }), window.close()
        });
        else {
            const n = document.getElementById("result");
            n.classList.remove("hidden"), document.getElementById("menu").classList.add("mb-8"), n.innerHTML = `<span style="white-space: pre-line" class="leading-loose">${lmsMessage}</span>`, document.getElementById("resolveCmsBtn").disabled = !1, appendResult(`
        <a class="text-blue-500 hover:text-blue-400 font-semibold mt-1" href="https://quizpoly.xyz/huong-dan-lms" target="_blank">Xem video hướng dẫn giải quiz</a>
        <a class="text-blue-500 hover:text-blue-400 font-semibold mt-1.5" href="https://www.facebook.com/groups/easyquiz/posts/308684547796300" target="_blank">Xem hướng dẫn bài online trong group</a>
        <a class="text-blue-500 hover:text-blue-400 font-semibold mt-1.5" href="https://quizpoly.xyz/online.html" target="_blank">Xem danh sách đáp án bài online hiện có</a>
      `)
        }
    })
}

function appendResult(e) {
    let t = document.createElement("div");
    t.setAttribute("class", "flex flex-col"), t.innerHTML = e, document.getElementById("result").appendChild(t)
}

function addBtnUpgradePre() {
    const e = document.createElement("a");
    e.setAttribute("href", "https://quizpoly.xyz/plans.html"), e.setAttribute("target", "_blank"), e.setAttribute("class", "hover:text-blue-300"), e.innerText = "Nâng cấp Premium", document.getElementById("bot-items").prepend(e)
}

function addBtnGroup() {
    const e = document.createElement("a");
    e.setAttribute("href", "https://fb.com/hi.trfi"), e.setAttribute("target", "_blank"), e.setAttribute("class", "hover:text-blue-300"), e.innerText = "Liên hệ", document.getElementById("bot-items").prepend(e)
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("resolveLmsBtn").addEventListener("click", LMS), document.getElementById("logout").addEventListener("click", () => {
        chrome.runtime.sendMessage({
            type: "logout"
        }, function(e) {
            console.debug(e), window.close()
        })
    }), chrome.storage.local.get(["user"], async ({
        user: e
    }) => {
        document.getElementById("userName").innerText = e.name;
        var {
            userType: t,
            premium: n
        } = await getUserType(e.id);
        const s = document.getElementById("userType");
        s.innerText = t;
        const r = document.getElementById("expDate");
        "Free" !== t ? (s.classList.add("text-transparent", "bg-gradient-to-r", "from-purple-300", "to-pink-400"), r.innerText = "Exp: " + new Date(n.expDate).toLocaleDateString(), addBtnGroup()) : addBtnUpgradePre(), e.userType !== t && ("Premium" === t && "Free" == e.userType ? chrome.runtime.sendMessage({
            type: "notify_upgraded_premium"
        }) : "Free" === t && "Premium" == e.userType && chrome.runtime.sendMessage({
            type: "notify_premium_expired"
        }), e.userType = t, e.premium = n, chrome.storage.local.set({
            user: e
        }))
    })
});