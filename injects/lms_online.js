const subject = document.querySelector(".ilc_rte_tlink_RTETreeLink")?.textContent.replace(/\?/g, ""),
    apiUrl = "https://api.cap.quizpoly.xyz",
    server = window.location.origin;
async function main() {
    const e = await getUserInfo(),
        t = await getOnlineAnswer(subject);
    if (t && t.length) {
        if (5 <= t.length)
            if (!await u()) return chrome.runtime.sendMessage({
                type: "close_quiz_popup"
            });
        chrome.runtime.sendMessage({
            type: "open_quiz_popup"
        }, () => {
            chrome.storage.local.set({
                subjectName_: subject
            }), sendUserUsing(e, "lms-online", subject), writeHTML(t, e.name)
        })
    } else confirm("Bài này chưa có đáp án, bạn có muốn đóng góp đáp án cho người làm sau?") && chrome.runtime.sendMessage({
        type: "open_online_popup"
    }, () => {
        chrome.storage.local.set({
            subjectName_: subject
        }), setTimeout(() => chrome.runtime.sendMessage({
            type: "online_data",
            subject: subject,
            studentCode: e.studentCode
        }), 1e3)
    })
}

function writeHTML(e, t) {
    let n = "",
        s = 1,
        r = document.createElement("em");
    var o;
    for (o of e) r.innerText = o.ans, n += `
    <tr><td style='width:2.5rem; text-align:center';>${s++}</td><td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></td><td>${o.ques}</td></tr>
    <tr><td></td><td><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></td><td>${r.outerHTML}</td></tr>
    `;
    setTimeout(() => chrome.runtime.sendMessage({
        type: "quiz_data",
        html: n,
        name: t,
        online: !0
    }), 1e3)
}

function parseHTML(e) {
    return (new DOMParser).parseFromString(e, "text/html")
}
async function sendUserUsing(e, t, n) {
    chrome.runtime.sendMessage({
        type: "send_user_using",
        domain: window.location.host,
        data: {
            ...e,
            getQuizType: t,
            subjectName: n
        }
    })
}

function u() {
    return new Promise(t => {
        chrome.runtime.sendMessage({
            type: "open_quiz_link"
        }, e => {
            console.debug(e), "success" == e || "p" == e ? t(!0) : ("not_logged" == e && alert("Bạn chưa đăng nhập tiện ích. Click vào icon tiện ích sau đó đăng nhập để sử dụng"), t(!1))
        })
    })
}
async function getOnlineAnswer(e) {
    return new Promise((t, n) => {
        chrome.runtime.sendMessage({
            type: "get_online_answer",
            subject: e
        }, e => chrome.runtime.lastError ? n() : void(e ? t(e) : n()))
    })
}
async function getUserInfo() {
    let e = "Unknow",
        t = "Unknow",
        n = "Unknow",
        s = server;
    var r = `${server}/ilias.php?baseClass=ilPersonalDesktopGUI&cmd=jumpToProfile`;
    try {
        const o = await fetch(r, {
                method: "GET",
                redirect: "follow"
            }),
            i = parseHTML(await o.text());
        e = i.querySelector("#usr_firstname").value, n = i.querySelector("#usr_lastname").value.replace("(", "").replace(")", ""), n.includes(" ") && (e = n, n = ""), t = i.querySelector("#hiddenne_un").value, s = "lms-ptcd.poly.edu.vn" == window.location.host ? "PTCD" : s = i.querySelector("#hiddenne_dr").value.replace("USER_", "")
    } catch (e) {
        console.log(e)
    }
    return {
        name: e,
        studentCode: t,
        term: n,
        userServer: s
    }
}
setTimeout(main, 1e3);