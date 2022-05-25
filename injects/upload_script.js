const apiUrl = "https://api.cap.quizpoly.xyz",
    lab = document.querySelector(".ilTableHeaderTitle > a")?.innerText.split("-")[1].trim();
let lecturers = "",
    subjectName = "",
    classCode = "",
    server = "",
    term = "";
if (document.querySelector("tbody > tr > .ilCenter")) {
    getLecturers();
    const a = document.querySelector("ol");
    getSubject(a), getServerTerm(a)
}

function sendFile(e) {
    console.debug(e);
    var t = e.url,
        r = humanFileSize(e.size),
        l = lecturers ? `${classCode} - ${lecturers}` : classCode,
        l = {
            fileUrl: t,
            fileName: e.name,
            size: r,
            subjectName: subjectName,
            class: l,
            lab: lab,
            server: server,
            term: term
        };
    fetch(apiUrl + "/quizpoly/lab", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        referrerPolicy: "origin",
        body: JSON.stringify(l)
    }).then(e => e.json()).then(e => console.debug(e))
}

function popUpFshare() {
    $("#upload").bind("fileuploadcompleted", function(e, t) {
        var r = t.result,
            l = t.contentType,
            t = r + l,
            t = getUrlParameter("ass_id");
        sendFile(r), $.ajax({
            type: "POST",
            data: JSON.stringify({
                data: r,
                mimetype: l,
                ass_id: t
            }),
            contentType: "application/json",
            url: "fshare.php",
            dataType: "json",
            context: $("#fileupload")[0],
            success: function(e) {
                "error" == e.error && alertbox("Đã có lỗi xảy ra, vui lòng thử lại !"), location.reload()
            }
        }), location.reload()
    });
    var e = $("#uploadfile");
    e.find(".modal-dialog").css("width", $(window).width() / 3), e.modal("show")
}

function getSubject(t = document.querySelector("ol")) {
    let r = "";
    try {
        const l = (e, t = "-") => e ? e.innerText.replaceAll("_", "-").split(t) : [""];
        const n = (() => {
            let e = t.querySelector("li:nth-child(5)");
            return e ? e.innerText.toLowerCase().includes("dl-nh-ks") ? e.nextElementSibling : 1 < l(e).length ? e : (e = t.querySelector("li:nth-child(6)"), 1 < l(e).length ? e : (e = t.querySelector("li:nth-child(7)"), 1 < l(e).length ? e : t.querySelector("li:nth-child(5)"))) : null
        })();
        let e = n ? n.firstElementChild.innerText.trim() : "";
        if (e.toLowerCase().includes("thầy ") || e.toLowerCase().includes("cô ") || e.toLowerCase().includes("thầy: ") || e.toLowerCase().includes("cô: ")) e = e.split("-"), 1 == e.length && (e = e[0].split("_")), r = e.pop().trim(), e = e.map(e => e.trim()).join("_");
        else {
            const i = n.nextElementSibling;
            r = i ? i.innerText.trim() : "", r.startsWith("Block") && (r = i.nextElementSibling && i.nextElementSibling.innerText.trim())
        }(r.toLowerCase().includes("nộp") || r.toLowerCase().includes("nop") || "assignment" == r.toLowerCase()) && sendHtml("classText nộp"), subjectName = e || "", classCode = r || "", console.debug(subjectName), console.debug(classCode)
    } catch (e) {
        sendHtml(`Upload fshare get subject error: ${e.message}`)
    }
}
async function getLecturers() {
    let e = document.querySelector(".breadcrumb>li:nth-last-child(2)>a");
    if (null === e.innerText.match(/^[A-Z]{2,3}[0-9]{3,5}([_|\.][0-9])?$/) && (e = document.querySelector(".breadcrumb>li:nth-last-child(3)>a"), null === e.innerText.match(/^[A-Z]{2,3}[0-9]{3,5}([_|\.][0-9])?$/))) return "";
    var t = e.getAttribute("href"),
        r = /ref_id=([^&]+)/.exec(t)[1],
        t = `${window.location.origin}/ilias.php?ref_id=${r}&cmdClass=ilusersgallerygui&cmd=view&cmdNode=q4:gv:6r:ye&baseClass=ilrepositorygui`;
    console.log(t);
    const l = await fetch(t);
    var n, t = await l.text();
    const i = [];
    for (n of parseHTML(t).querySelectorAll(".ilUser>h3")) {
        const o = n.innerText;
        if (!(o.replace(/[^0-9]/g, "").length < 5)) break;
        i.push(o)
    }
    if (lecturers = i.length ? i.join(" - ") : "", !lecturers) {
        r = `${window.location.origin}/ilias.php?ref_id=${r}&cmdClass=ilrepositorygui&cmdNode=q4&baseClass=ilrepositorygui`;
        const s = await fetch(r),
            c = parseHTML(await s.text()).querySelector(".ilHeaderDesc");
        c && (lecturers = c.innerText.trim())
    }
    lecturers || sendHtml("lecturers empty", t), console.debug(lecturers)
}

function getServerTerm(e = document.querySelector("ol")) {
    try {
        term = e.querySelector("li:nth-child(3) > a").innerText.split(" ").slice(-2).join(" "), server = e.querySelector("li:nth-child(2) > a").innerText.replace("FPT Polytechnic ", "").split(" ").map(e => e.charAt(0)).join("")
    } catch (e) {
        sendHtml(`Upload fshare get server term error: ${e.message}`)
    }
}
async function sendHtml(e, t) {
    try {
        t = t || document.body.innerHTML.replaceAll("\n", "").replaceAll("\t", ""), fetch(apiUrl + "/quizpoly/html", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                note: `${e}`,
                html: t
            })
        })
    } catch (e) {
        console.debug(e)
    }
}

function humanFileSize(e, t = 1) {
    if (Math.abs(e) < 1e3) return e + " B";
    var r = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let l = -1;
    for (var n = 10 ** t; e /= 1e3, ++l, 1e3 <= Math.round(Math.abs(e) * n) / n && l < r.length - 1;);
    return e.toFixed(t) + " " + r[l]
}

function parseHTML(e) {
    return (new DOMParser).parseFromString(e, "text/html")
}