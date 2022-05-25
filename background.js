"use strict";
let userLoggedIn = !1;

function openRightPanel(e, o, n = !1, t = !1) {
    var s = .33 * screen.width,
        r = screen.width - s;
    chrome.windows.create({
        url: o,
        type: "panel",
        focused: t,
        width: Math.round(s),
        height: screen.availHeight,
        top: 0,
        left: Math.round(r)
    }, e => {
        n && chrome.storage.local.set({
            windowId: e.id
        })
    }), chrome.windows.update(e.tab.windowId, {
        state: "normal",
        top: 0,
        left: 0,
        width: Math.round(.677 * screen.width),
        height: screen.availHeight
    })
}
chrome.storage.local.get(["isLogged"], ({
    isLogged: e
}) => {
    e ? chrome.browserAction.setPopup({
        popup: "./popup/popup-logged.html"
    }) : chrome.browserAction.setPopup({
        popup: "./popup/popup.html"
    })
}), chrome.runtime.onInstalled.addListener(function(e) {
    "install" == e.reason && (chrome.tabs.create({
        url: "https://www.facebook.com/groups/easyquiz/"
    }, function(e) {
        alert(`Tham gia group để nhận
thông tin cập nhật, hỗ trợ fix lỗi nhé
Click vào icon tiện ích để sử dụng`)
    }), chrome.alarms.create("getUser", {
        when: getDateTomorrow()
    }), chrome.alarms.get("getUser", e => {
        console.debug(e)
    }), chrome.storage.local.set({
        quizSelf: {},
        linkIndex: 0
    }))
}), chrome.alarms.get("getUser", e => {
    console.debug("alarm bg", e), e || chrome.alarms.create("getUser", {
        when: getDateTomorrow()
    })
}), chrome.runtime.onMessage.addListener(function(e, o, m) {
    switch (e.type) {
        case "open_quiz_popup":
            console.debug("open_quiz_popup"), openRightPanel(o, "aqlist.html", !0), m(!0);
            break;
        case "open_online_popup":
            openRightPanel(o, "online.html", !1, !0), m(!0);
            break;
        case "focus_quiz_popup":
            chrome.storage.local.get(["windowId"], ({
                windowId: e
            }) => {
                chrome.windows.update(e, {
                    focused: !0
                })
            });
            break;
        case "close_quiz_popup":
            chrome.storage.local.get(["windowId"], ({
                windowId: e
            }) => {
                chrome.windows.remove(e)
            });
            break;
        case "update_user":
            updateUser(), m(!0);
            break;
        case "send_user_using":
            sendUserUsing(e);
            break;
        case "add_quiz":
            addQuiz(e.data);
            break;
        case "get_quiz_link":
            chrome.storage.local.get(["linkIndex", "getLinkTime"], ({
                linkIndex: e,
                getLinkTime: o
            }) => {
                var n;
                console.debug("getLinkTime 1", o), o && "number" == typeof o ? (console.debug("getLinkTime 2", o), n = getDiffHours(Date.now(), o), console.log("diffHours", n), 24 <= n && (e = 0)) : e = 0, 0 == e && (console.debug("set getLinkTime"), o = Date.now(), chrome.storage.local.set({
                    getLinkTime: o
                })), m(adsLinks[e]), console.debug("linkIndex", e), console.debug("getLinkTime 3", o), (e += 1) == adsLinks.length && (e = 1), chrome.storage.local.set({
                    linkIndex: e
                })
            });
            break;
        case "open_quiz_link":
            openAdsLink(m);
            break;
        case "login":
            n = Math.round(.5 * screen.width), t = Math.round(.85 * screen.height), s = Math.round(screen.width / 2 - n / 2), r = Math.round(screen.height / 2 - t / 2), chrome.windows.create({
                url: createAuthEndpoint(),
                type: "normal",
                focused: !0,
                width: n,
                height: t,
                left: s,
                top: r
            }, d => {
                var g = window.setInterval(function() {
                    chrome.tabs.query({
                        windowId: d.id
                    }, e => {
                        if (!e.length) return window.clearInterval(g), m("fail");
                        try {
                            const {
                                url: t,
                                title: s
                            } = e[0];
                            if (console.debug(s), t.includes(redirect_uri) && s.includes("EZQ ")) {
                                var o = s.replace("EZQ ", "");
                                if (window.clearInterval(g), chrome.windows.remove(d.id), !o) return m("fail"), notify({
                                    message: "Đăng nhập không thành công: Can't get userdata"
                                });
                                const {
                                    id: r,
                                    name: a,
                                    email: i,
                                    userType: c,
                                    premium: l,
                                    // userType: "Premium",
                                    // premium: true,
                                    studentCode: u
                                } = JSON.parse(o);
                                var n = {
                                    id: r,
                                    name: a,
                                    email: i,
                                    // userType: c,
                                    // premium: l,
                                    userType: "Premium",
                                    premium: {plan:"Premium","iatDate":"2022-03-08T16:19:51.303Z","expDate":"2025-03-13T00:00:00.000Z","isGift":1},
                                    studentCode: u
                                };
                                chrome.storage.local.set({
                                    user: n,
                                    isLogged: !0
                                }, () => {
                                    var e = "Premium" == c && "Trial3" == l.plan ? ". Bạn được dùng thử Premium 3 ngày" : "";
                                    notify({
                                        message: "Đăng nhập thành công" + e
                                    }), chrome.browserAction.setPopup({
                                        popup: "./popup/popup-logged.html"
                                    }), m("success")
                                })
                            }
                        } catch (e) {
                            return m("fail"), console.log(e), notify({
                                message: `Đăng nhập không thành công: ${e.message}`
                            })
                        }
                    })
                }, 500)
            });
            break;
        case "get_quiz_available":
            getQuizAvailable(e.subject, m);
            break;
        case "get_online_answer":
            getOnlineAnswer(e.subject, m);
            break;
        case "add_quiz_self":
            r = e.data.ans;
            r && "object" == typeof r && (e.data.ans = Object.values(r)), quizSelf[e.seq] = e.data, console.debug(e.data.ans), console.debug(quizSelf);
            break;
        case "finish_quiz":
            console.debug("finish_quiz"), setTimeout(finishQuiz, 1e4, e);
            break;
        case "get_cookies":
            chrome.cookies.getAll({
                domain: e.domain
            }, e => {
                console.debug(e);
                e = e.filter(e => "sessionid" == e.name || "PHPSESSID" == e.name).map(e => ({
                    name: e.name,
                    value: e.value
                })), e = e.length ? e[0].value : "";
                m({
                    cookie: e
                })
            });
            break;
        case "notify_upgraded_premium":
            notify({
                message: "Chúc mừng! Tài khoản của bạn đã được nâng cấp lên Premium"
            });
            break;
        case "notify_premium_expired":
            notify({
                message: "Hạn dùng Premium của bạn đã hết. Hãy nâng cấp để tiếp tục sử dụng Premium",
                buttons: [{
                    title: "Nâng cấp"
                }]
            }, "premium_expired");
            break;
        case "logout":
            chrome.storage.local.set({
                isLogged: !1,
                user: {}
            }, () => {
                chrome.browserAction.setPopup({
                    popup: "./popup/popup.html"
                }), m("success")
            });
        default:
            return !0
    }
    var n, t, s, r;
    return !0
}), chrome.runtime.onMessageExternal.addListener(function(o, e, t) {
    switch (o.message) {
        case "fetch":
            fetch(o.url).then(async e => {
                var o = await e.text();
                return {
                    status: e.status,
                    url: e.url,
                    text: o
                }
            }).then(e => t(e));
            break;
        case "fetch_post":
            let e = new FormData;
            for (var [n, s] of o.body) e.append(n, s);
            fetch(o.url, {
                method: "post",
                body: e,
                headers: o.headers
            }).then(e => e.json()).then(e => t(e));
            break;
        case "open_quiz_link":
            openAdsLink(t);
            break;
        case "get_quiz_link":
            chrome.storage.local.get(["linkIndex", "getLinkTime"], ({
                linkIndex: e,
                getLinkTime: o
            }) => {
                var n;
                console.debug("getLinkTime 1", o), o && "number" == typeof o ? (console.debug("getLinkTime 2", o), n = getDiffHours(Date.now(), o), console.log("diffHours", n), 24 <= n && (e = 0)) : e = 0, 0 == e && (console.debug("set getLinkTime"), o = Date.now(), chrome.storage.local.set({
                    getLinkTime: o
                })), t(adsLinks[e]), console.debug("linkIndex", e), console.debug("getLinkTime 3", o), (e += 1) == adsLinks.length && (e = 1), chrome.storage.local.set({
                    linkIndex: e
                })
            });
            break;
        case "get_cms_csrftoken":
            chrome.cookies.get({
                url: "https://cms.poly.edu.vn",
                name: "csrftoken"
            }, e => {
                t(e.value)
            });
            break;
        case "send_user_using":
            sendUserUsing(o);
            break;
        case "send_file":
            console.debug(o);
        case "get_token":
            chrome.storage.local.get(["token"], ({
                token: e
            }) => {
                t(e || "")
            });
            break;
        case "get_user":
            console.debug("getUser"), chrome.storage.local.get(["user"], ({
                user: e
            }) => t(e))
    }
    return !0
}), chrome.webRequest.onBeforeSendHeaders.addListener(({
    requestHeaders: e
}) => {
    return e.push({
        name: "Referer",
        value: "https://cms.poly.edu.vn"
    }), {
        requestHeaders: e
    }
}, {
    urls: ["https://cms.poly.edu.vn/*"]
}, ["blocking", "requestHeaders", "extraHeaders"]), chrome.alarms.onAlarm.addListener(e => {
    console.debug(e), "getUser" == e.name && (updateUser(), chrome.alarms.create("getUser", {
        when: getDateTomorrow()
    }))
}), chrome.notifications.onButtonClicked.addListener((e, o) => {
    "premium_expired" == e && 0 == o && chrome.tabs.create({
        url: "https://quizpoly.xyz/plans.html"
    })
});