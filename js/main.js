(function () {
  "use strict";

  var milestones = [
    { year: "2025", title: "아기유니콘 선정", body: "중소벤처기업부 '아기유니콘 육성사업(수익성장형)' 최종 선정" },
    { year: "2024", title: "국책과제 수주", body: "과학기술정보통신부·정보통신기획평가원 정보보호 핵심원천기술 개발사업 수주 — 디지털자산 위험거래 추적 기술 개발" },
    { year: "2024", title: "국제표준 인증", body: "통합입출금서비스 블록체인 고위험거래 검증 관련 인증 획득 (2024.01~2027.01)" },
    { year: "2022", title: "업계 최초 외부감사 대상", body: "가상자산거래소 AML 전문기업 중 최초로 외부감사대상 법인 선정" },
    { year: "2021", title: "벤처기업 인증", body: "중소벤처기업부 '혁신성장형 벤처기업 인증' 획득" },
    { year: "2021", title: "경찰청장 감사장", body: "금융범죄 예방 및 수사 공조 기여로 경찰청장 행정발전 기여 감사장 수상" },
    { year: "2020", title: "실명계좌 연계 서비스 런칭", body: "케이뱅크-업비트 국내 최초 실명계좌 연계 TranSafer 서비스 런칭" },
    { year: "2020", title: "금융위 핀테크위크 선정", body: "금융위원회 '코리아 핀테크위크 2020' 선정" },
    { year: "2019", title: "규제 샌드박스 위탁테스트", body: "금융위원회 규제 샌드박스 위탁테스트 기업 선정" }
  ];

  var DPATH = "M185.879 0.471136C187.37 -0.157067 189.05 -0.157067 190.541 0.471136L372.751 77.28C377.702 79.367 377.625 86.4096 372.629 88.3875L190.419 160.529C189 161.091 187.42 161.091 186.001 160.529L3.79093 88.3875C-1.20465 86.4096 -1.28193 79.367 3.66904 77.28L185.879 0.471136Z";

  function diamondSvg(i, isSel) {
    var gid = "bfdg-" + i + "-" + (isSel ? "b" : "w");
    var stops = isSel
      ? [["#4566E2", 0, 1], ["#0A2895", 1, 0.9]]
      : [["#F1F8FC", 0, 1], ["#A2B3F1", 1, 0.7]];
    var stopMarkup = stops.map(function (s) {
      return '<stop offset="' + s[1] + '" stop-color="' + s[0] + '" stop-opacity="' + s[2] + '"></stop>';
    }).join("");
    return (
      '<svg width="100%" height="100%" viewBox="0 0 377 161" preserveAspectRatio="none">' +
      '<defs><linearGradient id="' + gid + '" x1="188.21" y1="168.703" x2="188.21" y2="1.724" gradientUnits="userSpaceOnUse">' +
      stopMarkup +
      '</linearGradient></defs>' +
      '<path d="' + DPATH + '" fill="url(#' + gid + ')"></path>' +
      '</svg>'
    );
  }

  var stackEl = document.getElementById("bf-stack");
  var sel = 0;

  function centerY(i, top, DH, step, gap) {
    return top + DH / 2 + i * step + (i < sel ? -gap : i > sel ? gap : 0);
  }

  function renderStack() {
    if (!stackEl) return;
    var W = 1120, DW = 300, DH = 128, step = 46, cx = 540, top = 96, gap = 26;
    var tipX = cx - DW / 2 + 6;
    var H = top + DH / 2 + (milestones.length - 1) * step + gap + DH / 2 + 60;

    var connectors = "", diamonds = "", titles = "";

    milestones.forEach(function (m, i) {
      var isSel = i === sel;
      var cy = centerY(i, top, DH, step, gap);

      connectors +=
        '<div class="bf-connector" data-idx="' + i + '" style="left:250px;width:' + (tipX - 250) + 'px;top:' + cy + 'px;border-top:1px solid ' + (isSel ? "#4566E2" : "rgba(255,255,255,0.35)") + ';"></div>';

      diamonds +=
        '<div class="bf-diamond" data-idx="' + i + '" style="left:' + (cx - DW / 2) + 'px;top:' + (cy - DH / 2) + 'px;width:' + DW + 'px;height:' + DH + 'px;z-index:' + (isSel ? 200 : (milestones.length - i)) + ';transform:' + (isSel ? "scale(1.05)" : "none") + ';transform-origin:center;filter:' + (isSel ? "drop-shadow(0 26px 48px rgba(22,64,219,.55))" : "drop-shadow(0 10px 20px rgba(0,0,0,.35))") + ';">' +
        diamondSvg(i, isSel) +
        '</div>';

      titles +=
        '<div class="bf-title" data-idx="' + i + '" style="left:-40px;width:290px;top:' + cy + 'px;color:' + (isSel ? "#738DE9" : "#ffffff") + ';">' + m.title + '</div>';
    });

    var picked = milestones[sel];
    var panel =
      '<div style="position:absolute;left:760px;top:150px;width:320px;">' +
      '<div style="color:#BFBFBF;font-size:18px;font-weight:400;margin-bottom:26px;">' + picked.year + '</div>' +
      '<div style="color:#738DE9;font-size:32px;font-weight:700;line-height:1.25;margin-bottom:22px;">' + picked.title + '</div>' +
      '<div style="color:#ffffff;font-size:16px;font-weight:400;line-height:1.75;">' + picked.body + '</div>' +
      '</div>';

    var stage =
      '<div class="bf-stack-stage" style="width:' + W + 'px;height:' + H + 'px;">' +
      connectors + diamonds + titles + panel +
      '</div>';

    var mobile =
      '<div class="bf-stack-mobile">' +
      milestones.map(function (m) {
        return (
          '<div class="bf-stack-mobile-item">' +
          '<div style="color:#738DE9;font-size:13px;font-weight:700;margin-bottom:6px;">' + m.year + '</div>' +
          '<div style="color:#fff;font-size:19px;font-weight:700;margin-bottom:8px;">' + m.title + '</div>' +
          '<div style="color:rgba(255,255,255,.7);font-size:14px;line-height:1.6;">' + m.body + '</div>' +
          '</div>'
        );
      }).join("") +
      '</div>';

    stackEl.innerHTML = stage + mobile;
  }

  if (stackEl) {
    renderStack();
    stackEl.addEventListener("mouseover", function (e) {
      var target = e.target.closest("[data-idx]");
      if (!target) return;
      var idx = parseInt(target.getAttribute("data-idx"), 10);
      if (idx === sel) return;
      sel = idx;
      renderStack();
    });
  }

  // logos (placeholder trust-network grid)
  var logosEl = document.getElementById("bf-logos");
  if (logosEl) {
    var html = "";
    for (var i = 0; i < 16; i++) {
      var mark = String.fromCharCode(65 + i);
      html +=
        '<div class="bf-logotile" style="height:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:#fff;cursor:pointer;">' +
        '<div style="width:34px;height:34px;border-radius:8px;background:var(--grey-100);display:flex;align-items:center;justify-content:center;color:var(--grey-400);font-weight:800;font-size:15px;">' + mark + '</div>' +
        '<span style="font-size:12px;font-weight:600;color:var(--grey-400);letter-spacing:0.04em;">LOGO</span>' +
        '</div>';
    }
    logosEl.innerHTML = html;
  }

  // lucide icons
  (function drawIcons() {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    else setTimeout(drawIcons, 120);
  })();

  // nav shadow on scroll
  var nav = document.getElementById("bf-nav");
  var burger = document.getElementById("bf-burger");
  function applyNav() {
    if (!nav) return;
    var solid = window.scrollY > 20;
    nav.style.boxShadow = solid ? "var(--shadow-sm)" : "none";
    nav.style.borderBottomColor = solid ? "var(--border)" : "transparent";
  }
  applyNav();
  window.addEventListener("scroll", applyNav, { passive: true });

  // mobile menu
  var panel = document.getElementById("bf-mobile");
  if (burger && panel) {
    burger.addEventListener("click", function () {
      var open = panel.dataset.open === "1";
      panel.dataset.open = open ? "0" : "1";
      panel.style.opacity = open ? "0" : "1";
      panel.style.transform = open ? "translateY(-8px)" : "none";
      panel.style.pointerEvents = open ? "none" : "auto";
    });
  }

  // smooth anchor scroll with nav offset + close mobile menu
  document.querySelectorAll("a[data-anchor]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (!href || href[0] !== "#") return;
      var t = document.getElementById(href.slice(1));
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - 113;
      window.scrollTo({ top: y, behavior: "smooth" });
      if (panel && panel.dataset.open === "1") {
        panel.dataset.open = "0";
        panel.style.opacity = "0";
        panel.style.transform = "translateY(-8px)";
        panel.style.pointerEvents = "none";
      }
    });
  });

  // stat counters
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400;
    var start = performance.now();
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var v = target * easeOut(p);
      el.textContent = v.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function (el) { io.observe(el); });
})();
