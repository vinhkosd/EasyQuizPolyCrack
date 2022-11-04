const uploadUnlimitedScript=`
(function () {
  var ul = $("#upload ul");
  $("#drop span").click(function () {
    $(this).parent().find("input").click();
  }),
    $("#upload").fileupload({
      maxNumberOfFiles: 1,
      multipart: !1,
      dropZone: $("#upload"),
      add: function (t, e) {
        var i = list(e);
        (e.context = i.appendTo(ul)),
          i.find("span").click(function () {
            i.hasClass("working") && s.abort(),
              i.fadeOut(function () {
                i.remove();
              });
          });
        var s = submit_file(e);
      },
      progress: function (t, e) {
        var i = $('<li class="list-group-item done"><p></p><span></span></li>'),
          s = parseInt((e.loaded / e.total) * 100, 10);
        $("#progress .progress-bar").css("width", s + "%"),
          100 == s &&
            (e.context.removeClass("working"),
            i
              .find("p")
              .html(
                '<p style="clear:both"></p><p style="float:left"><span title="' +
                  e.files[0].name +
                  '" style="width:220px !important; display:inline-block;">' +
                  sublist(e.files[0].name, 40) +
                  "</span></p>"
              )
              .append(
                '<i style="padding-left:60px;">' +
                  formatFileSize(e.files[0].size) +
                  '</i><span style="float:right;width:200px" class="font-s">Success</span></i>'
              ),
            i.appendTo(ul));
      },
      fail: function (t, e) {
        e.context.addClass("error");
      },
    }),
    $(document).on("drop dragover", function (t) {
      t.preventDefault();
    });
  var submit_file = function (t) {
    var e = $('<li class="list-group-item done"><p></p><span></span></li>'),
      i = {
        name: String(t.files[0].name),
        size: String(t.files[0].size),
        path: "/",
      };
    $.ajax({
      type: "POST",
      data: JSON.stringify(i),
      contentType: "application/json",
      url: "upload.php",
      dataType: "json",
      context: $("#fileupload")[0],
      success: function (i) {
        if ("location" in i) {
          var s = i.location.substring(4),
            a = window.location.protocol;
          (a = a.substring(0, a.length - 1)), (t.url = a + s), t.submit();
        } else
          ul.find("li.working").remove(),
            e
              .find("p")
              .html(
                '<p style="clear:both"></p><p style="float:left"><span title="' +
                  t.files[0].name +
                  '" style="width:220px !important; display:inline-block;">' +
                  sublist(t.files[0].name, 40) +
                  "</span></p>"
              )
              .append(
                '<i style="padding-left:60px">' +
                  formatFileSize(t.files[0].size) +
                  '</i><span style="float:right;width:200px;display:inline-block" class="font-e">' +
                  i.msg +
                  "</span></i>"
              ),
            e.appendTo(ul);
      },
      error: function (t, e) {
        alertbox("An error occurred, please try again later");
      },
    });
  };
  function formatFileSize(t) {
    return "number" != typeof t
      ? ""
      : t >= 1e9
      ? (t / 1e9).toFixed(2) + " GB"
      : t >= 1e6
      ? (t / 1e6).toFixed(2) + " MB"
      : (t / 1e3).toFixed(2) + " KB";
  }
  function list(t) {
    var e = $(
      '<li class="working"><div id="progress" class="progress" value="0" data-width="48" data-height="48" data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043"><div class="progress-bar progress-bar-success"></div></div><p></p><span></span></li>'
    );
    return (
      e
        .find("p")
        .html(
          '<p style="clear:both"></p><span title="' +
            t.files[0].name +
            '" style=width:150px !important;>' +
            sublist(t.files[0].name, 40) +
            "</span>"
        )
        .append(
          '<i style="padding-left:10px !important">' +
            formatFileSize(t.files[0].size) +
            "</i>"
        ),
      e
    );
  }
  function sublist(t, e) {
    return t.length >= e ? t.substring(0, 40) + "..." : t;
  }
  function substr_utf8_bytes(t, e, i) {
    for (var s = "", a = 0, n = 0; n < e; a++) {
      var l = t.charCodeAt(a);
      n += l < 128 ? 1 : encode_utf8(t[a]).length;
    }
    for (var o = a + i - 1, p = a; a <= o; p++)
      (o -= (l = t.charCodeAt(p)) < 128 ? 1 : this.encode_utf8(t[p]).length),
        (s += t[p]);
    return s + "...";
  }
})();
`;let doc=document.head||document.documentElement;const scriptTag=document.createElement("script");scriptTag.src=chrome.runtime.getURL("injects/upload_script2.js"),scriptTag.onload=()=>scriptTag.parentNode.removeChild(scriptTag),doc.appendChild(scriptTag);const scriptFshare=document.createElement("script");scriptFshare.textContent=uploadUnlimitedScript,scriptFshare.onload=()=>scriptFshare.parentNode.removeChild(scriptFshare),doc.appendChild(scriptFshare);const btnUpload=document.querySelector(".myButton");btnUpload&&(btnUpload.textContent="Tải lên Fshare (Không giới hạn dung lượng)");let note="Nếu có nhiều file sinh viên nén file để nộp";h1=document.createElement("h1"),h1.setAttribute("style","color: blue; font-size: 1.7em; line-height: 1.5;"),h1.innerHTML=note;const il_HeaderInner=document.querySelector(".il_HeaderInner");if(il_HeaderInner&&il_HeaderInner.appendChild(h1),!document.querySelector("tbody > tr > .ilCenter")){btnUpload&&(btnUpload.style.display="none");const a=document.createElement("h3");a.setAttribute("style","color: blue;"),a.innerText="Chỉ tải lên 1 file, nếu có nhiều file vui lòng nén zip/rar để nộp. Xóa file cũ nếu muốn nộp lại",document.querySelector(".ilToolbar")?.appendChild(a)}