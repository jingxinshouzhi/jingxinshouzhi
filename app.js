(() => {
  const questions = Array.isArray(window.QUESTIONS) ? window.QUESTIONS : [];
  const byId = new Map(questions.map((q) => [q.id, q]));
  const topics = [...new Set(questions.map((q) => q.topic))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  const root = document.querySelector("#viewRoot");
  const modalRoot = document.querySelector("#modalRoot");
  const toast = document.querySelector("#toast");

  const SOURCES = {
    questionBank: { title: "用户提供的《输气工（初级）题库》", note: "仅作为题目、选项和评分答案来源，不作为补充解析的事实依据。" },
    cugbAccumulation: { title: "中国地质大学：油气生成、运移与聚集科普资料", url: "https://bm.cugb.edu.cn/mrehemnew/c/2023-03-26/773683.shtml", note: "烃源岩生烃、油气运移、储集层、盖层与圈闭原理参考。" },
    gb17820: { title: "GB 17820—2018《天然气》", url: "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=C7F5861DFDE1788307F7B8E64C9B039C", note: "天然气质量与基础性质参考。" },
    gb37124: { title: "GB/T 37124—2018《进入天然气长输管道的气体质量要求》", url: "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=7E505C7B0CE070AD51EB2F2F975B3017", note: "长输管道入口气质参考。" },
    gb18603: { title: "GB/T 18603—2023《天然气计量系统技术要求》", url: "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=A2A330376FA09837A07504A0BB6D704B", note: "计量系统、仪表与配套条件参考。" },
    gb21447: { title: "GB/T 21447—2018《钢质管道外腐蚀控制规范》", url: "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=19F9240A5E9E0F96DCA7F915C96F68A8", note: "防腐层与阴极保护参考。" },
    gb12358: { title: "GB 12358—2024《作业场所环境气体检测报警仪器 通用技术要求》", url: "https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=CAB81EA2B8D4788DF49A803C73C0507E", note: "气体检测报警设备参考；已替代2006版。" },
    gbz21: { title: "国家卫生健康委 GBZ 2.1—2019《工作场所有害因素职业接触限值》", url: "https://www.nhc.gov.cn/wjw/pyl/202003/ef23dfd84a004d46963b060c5e01432a.shtml", note: "工作场所化学有害因素接触限值及限值使用规则参考。" },
    gb50251: { title: "GB 50251—2015《输气管道工程设计规范》相关合规指引", url: "https://yjglj.sh.gov.cn/xxgk/xxgkml/jcfb/aqsch/20251013/6515634d6d9943a98138fe6d4ad5f667.html", note: "输气管道、站场、清管、阀门和安全设施参考。" },
    safetyLaw: { title: "《中华人民共和国安全生产法》（2021年修订）", url: "https://www.mem.gov.cn/fw/flfgbz/fg/202107/t20210716_416558.shtml", note: "安全生产责任、从业人员权利义务与风险防控参考。" },
    specialEquipment: { title: "《中华人民共和国特种设备安全法》", url: "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/fgs/art/2023/art_ad5e293574484b48b45047ee0ede6099.html", note: "压力管道、压力容器等特种设备管理参考。" },
    oilGasOccupation: { title: "人力资源社会保障部《油气输送工国家职业技能标准（征求意见稿）》", url: "https://www.mohrss.gov.cn/SYrlzyhshbzb/zcfg/SYzhengqiuyijian/zq_zynljss/202109/W020210928312307254157.pdf", note: "站场操作、机械设备、电气、仪表、SCADA及初级岗位知识范围参考；文件状态已明确标注。" },
    fuelGasOccupation: { title: "人力资源社会保障部《燃气储运工国家职业技能标准（2021年版）》", url: "https://www.mohrss.gov.cn/xxgk2020/fdzdgknr/rcrs_4225/jnrc/202112/W020211227626975415962.pdf", note: "燃气场站设备运行、安全设施和泄漏处置参考。" },
    siBrochure: { title: "国际计量局（BIPM）《国际单位制手册》", url: "https://www.bipm.org/en/publications/si-brochure", note: "国际单位制、导出单位和单位符号参考。" },
    metrologyBasics: { title: "国际计量局（BIPM）《国际单位制手册》", url: "https://www.bipm.org/en/publications/si-brochure", note: "物理量、单位及换算关系参考。" },
    cybersecurityLaw: { title: "工业和信息化部《中华人民共和国网络安全法》", url: "https://www.miit.gov.cn/jgsj/zfs/fl/art/2020/art_85f74fb2531449ddbe0d14b0484d2507.html", note: "网络运行安全、监测预警和应急处置参考。" },
    firstAid: { title: "中国红十字会现场急救案例与救护流程", url: "https://www.redcross.org.cn/html/2025-06/107500.html", note: "现场判断意识与呼吸、呼叫急救和心肺复苏顺序参考。" },
    environmentLaw: { title: "《中华人民共和国环境保护法》", url: "https://www.gov.cn/zhengce/2014-04/25/content_2666434.htm", note: "环境保护责任及建设项目污染防治设施要求参考。" },
    emergencyLaw: { title: "《中华人民共和国突发事件应对法》", url: "https://www.gov.cn/yaowen/liebiao/202406/content_6957667.htm", note: "突发事件分类、预防与应急处置原则参考。" },
  };

  const readJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const savedAnswers = readJson("gasExamAnswers", {});
  const state = {
    view: "home",
    practiceIds: questions.map((q) => q.id),
    practiceIndex: 0,
    selected: null,
    revealed: false,
    answers: savedAnswers,
    studied: new Set(readJson("gasExamStudied", Object.keys(savedAnswers).map(Number))),
    mastered: new Set(readJson("gasExamMastered", [])),
    wrong: new Set(readJson("gasExamWrong", [])),
    favorites: new Set(readJson("gasExamFavorites", [])),
    history: readJson("gasExamHistory", []),
    bank: { query: "", topic: "全部", type: "全部", page: 1 },
    exam: null,
    timer: null,
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  };
  const formatDuration = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.max(0, seconds % 60)).padStart(2, "0")}`;
  const currentPractice = () => byId.get(state.practiceIds[state.practiceIndex]);
  const currentExam = () => state.exam ? byId.get(state.exam.ids[state.exam.index]) : null;

  function save() {
    localStorage.setItem("gasExamAnswers", JSON.stringify(state.answers));
    localStorage.setItem("gasExamStudied", JSON.stringify([...state.studied]));
    localStorage.setItem("gasExamMastered", JSON.stringify([...state.mastered]));
    localStorage.setItem("gasExamWrong", JSON.stringify([...state.wrong]));
    localStorage.setItem("gasExamFavorites", JSON.stringify([...state.favorites]));
    localStorage.setItem("gasExamHistory", JSON.stringify(state.history.slice(0, 30)));
    updateProgress();
  }

  function updateProgress() {
    const count = state.mastered.size;
    document.querySelector("#sideProgressLabel").textContent = `已掌握 ${count} / ${questions.length}`;
    document.querySelector("#sideProgressBar").style.width = `${questions.length ? count / questions.length * 100 : 0}%`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function setActiveNav(view) {
    document.querySelectorAll(".nav-item,.bottom-nav button").forEach((button) => button.classList.remove("active"));
    const selector = view === "home" ? '[data-view="home"]' : view === "practice" ? '[data-action="start-practice"]' : view === "exam" ? '[data-action="open-exam"]' : view === "bank" ? '[data-action="open-bank"]' : "";
    if (selector) document.querySelectorAll(selector).forEach((button) => button.classList.add("active"));
  }

  function renderHome() {
    state.view = "home";
    const answered = Object.keys(state.answers).length;
    const correct = Object.values(state.answers).filter((item) => item.correct).length;
    const accuracy = answered ? Math.round(correct / answered * 100) : 0;
    const today = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date());
    const latest = state.history[0];
    root.innerHTML = `
      <div class="page-head">
        <div><p class="eyebrow">学习概览</p><h1>把薄弱点一题一题练扎实</h1><p class="subtle">题库共 ${questions.length} 题，学习进度仅保存在当前设备。</p></div>
        <span class="date-chip">${today}</span>
      </div>
      <section class="home-grid">
        <article class="card hero-card">
          <span class="label">今日学习</span>
          <h2>${answered ? "从上次的进度继续" : "先做一组背题练习"}</h2>
          <p>每题均提供正确答案、知识点解析和参考依据。答错的题会自动进入错题清单。</p>
          <div class="hero-actions">
            <button class="primary-button" data-action="start-practice">开始背题</button>
            <button class="ghost-button" data-action="open-exam">模拟考试</button>
          </div>
        </article>
        <div class="dashboard-side">
          <article class="card metric-card">
            <div class="metric-top"><span>总体掌握度</span><span>${Math.round(state.mastered.size / questions.length * 100)}%</span></div>
            <div class="metric-value">${state.mastered.size}<small class="subtle"> / ${questions.length}</small></div>
            <div class="progress-line"><b style="width:${state.mastered.size / questions.length * 100}%"></b></div>
          </article>
          <article class="card quick-card">
            <h3>需要回看</h3>
            <div class="quick-list">
              <button class="quick-row" data-action="review-wrong"><span>错题复习<small>集中重做答错题目</small></span><strong>${state.wrong.size}</strong></button>
              <button class="quick-row" data-action="review-favorites"><span>我的收藏<small>保留易混与重点题</small></span><strong>${state.favorites.size}</strong></button>
            </div>
          </article>
        </div>
      </section>
      <div class="section-title"><h2>学习数据</h2><button class="text-button" data-action="open-bank">检索全部题目</button></div>
      <section class="stats-strip">
        <article class="card stat"><strong>${answered}</strong><span>已作答题目</span></article>
        <article class="card stat"><strong>${accuracy}%</strong><span>练习正确率</span></article>
        <article class="card stat"><strong>${state.wrong.size}</strong><span>当前错题</span></article>
        <article class="card stat"><strong>${latest ? `${latest.score}分` : "—"}</strong><span>最近考试</span></article>
      </section>`;
    setActiveNav("home");
  }

  function renderPractice() {
    state.view = "practice";
    const q = currentPractice();
    if (!q) {
      root.innerHTML = `<div class="card empty"><h2>当前题组没有题目</h2><p>可以从全部题库开始，或先做题积累错题和收藏。</p><div class="hero-actions center"><button class="secondary-button" data-action="start-all-practice">练习全部题目</button><button class="light-button ghost-button" data-view="home">返回首页</button></div></div>`;
      setActiveNav("practice");
      return;
    }
    const old = state.answers[q.id];
    state.selected = state.selected ?? old?.selected ?? null;
    state.revealed = state.revealed || Boolean(old);
    const options = Object.entries(q.options).map(([key, text]) => {
      const classes = ["option"];
      if (state.selected === key) classes.push("selected");
      if (state.revealed && key === q.answer) classes.push("correct");
      if (state.revealed && state.selected === key && key !== q.answer) classes.push("wrong");
      return `<button class="${classes.join(" ")}" data-answer="${key}" ${state.revealed ? "disabled" : ""}><span class="option-key">${key}</span><span>${escapeHtml(text)}</span></button>`;
    }).join("");
    const source = SOURCES[q.sourceKey] ?? SOURCES.questionBank;
    root.innerHTML = `
      <div class="page-head"><div><p class="eyebrow">背题模式</p><h1>${escapeHtml(q.topic)}</h1></div><span class="date-chip">${state.practiceIndex + 1} / ${state.practiceIds.length}</span></div>
      <section class="practice-layout">
        <article class="card question-card">
          <div class="question-meta"><div class="tag-row"><span class="tag">${q.type}</span><span class="tag">${q.topic}</span></div><button class="favorite-button" data-action="toggle-favorite">${state.favorites.has(q.id) ? "★ 已收藏" : "☆ 收藏"}</button></div>
          <h2 class="question-title">${escapeHtml(q.question)}</h2>
          <div class="option-list">${options}</div>
          ${state.revealed ? `<div class="explanation"><h3>解析</h3><div class="correct-answer">正确答案：${q.answer}（${escapeHtml(q.options[q.answer])}）</div><p>${escapeHtml(q.explanation)}</p><details class="source-details"><summary>查看依据来源</summary><span>${q.explanationOrigin} · ${source.url ? `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)} ↗</a>` : escapeHtml(source.title)}${q.standardWarning ? `<br>${escapeHtml(q.standardWarning)}` : ""}</span></details></div>` : ""}
          <div class="question-actions"><button class="ghost-button light-button" data-action="previous-question" ${state.practiceIndex === 0 ? "disabled" : ""}>上一题</button><div class="right">${state.revealed ? `<button class="secondary-button" data-action="toggle-mastered">${state.mastered.has(q.id) ? "已掌握" : "标记掌握"}</button><button class="primary-button" data-action="next-question">${state.practiceIndex === state.practiceIds.length - 1 ? "完成" : "下一题"}</button>` : `<button class="primary-button" data-action="reveal-answer" ${state.selected ? "" : "disabled"}>确认答案</button>`}</div></div>
        </article>
        <aside class="practice-side">
          <article class="card side-card"><h3>练习范围</h3><p class="subtle">本组 ${state.practiceIds.length} 题</p><button class="secondary-button full" data-action="open-practice-setup">重新筛选</button></article>
          <article class="card side-card number-card"><h3>快速定位</h3><div class="number-grid">${state.practiceIds.map((id, index) => `<button data-jump="${index}" class="${state.studied.has(id) ? "studied" : "unseen"} ${index === state.practiceIndex ? "active" : ""}" title="第 ${id} 题 · ${state.studied.has(id) ? "已背" : "未背"}">${id}</button>`).join("")}</div><div class="legend practice-legend"><span><i class="studied-dot"></i>已背 ${state.practiceIds.filter((id) => state.studied.has(id)).length}</span><span><i></i>未背 ${state.practiceIds.filter((id) => !state.studied.has(id)).length}</span><span><i class="current-dot"></i>当前</span></div></article>
        </aside>
      </section>`;
    setActiveNav("practice");
  }

  function openPracticeSetup() {
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="practiceSetupTitle">
      <div class="modal-head"><div><p class="eyebrow">练习设置</p><h2 id="practiceSetupTitle">选择背题范围</h2></div><button class="icon-button" data-action="close-modal" aria-label="关闭">×</button></div>
      <div class="form-grid">
        <div class="filter-row"><label for="practiceScope">题目范围</label><select id="practiceScope"><option value="all">全部题目</option><option value="unanswered">未背题目</option><option value="wrong">错题</option><option value="favorites">收藏题</option></select></div>
        <div class="filter-row"><label for="practiceTopic">知识分类</label><select id="practiceTopic"><option value="全部">全部分类</option>${topics.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")}</select></div>
        <div class="filter-row"><label for="practiceOrder">顺序</label><select id="practiceOrder"><option value="sequence">按题库顺序</option><option value="random">随机顺序</option></select></div>
      </div>
      <button class="primary-button full" data-action="confirm-practice-setup">开始练习</button>
    </section></div>`;
  }

  function startPractice(ids = questions.map((q) => q.id), startIndex = 0) {
    state.practiceIds = ids;
    state.practiceIndex = Math.max(0, Math.min(startIndex, ids.length - 1));
    state.selected = null;
    state.revealed = false;
    closeModal();
    renderPractice();
    document.querySelector("#mainContent")?.focus();
  }

  function openExamModal() {
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="examSetupTitle">
      <div class="modal-head"><div><p class="eyebrow">模拟考试</p><h2 id="examSetupTitle">设置试卷</h2><p class="subtle">单选题与判断题随机抽取，交卷后统一显示解析。</p></div><button class="icon-button" data-action="close-modal" aria-label="关闭">×</button></div>
      <div class="form-grid two-columns">
        <div class="filter-row"><label for="examCount">题目数量</label><select id="examCount"><option value="20">20题</option><option value="50" selected>50题</option><option value="100">100题</option></select></div>
        <div class="filter-row"><label for="examMinutes">考试时长</label><select id="examMinutes"><option value="30">30分钟</option><option value="60" selected>60分钟</option><option value="90">90分钟</option></select></div>
      </div>
      <button class="primary-button full" data-action="start-exam-confirm">开始考试</button>
    </section></div>`;
  }

  function startExam(count, minutes) {
    clearInterval(state.timer);
    state.exam = { ids: shuffle(questions.map((q) => q.id)).slice(0, count), index: 0, answers: {}, startedAt: Date.now(), durationSeconds: minutes * 60, submitted: false };
    closeModal();
    renderExam();
    state.timer = setInterval(updateExamTimer, 1000);
  }

  function remainingExamSeconds() {
    if (!state.exam) return 0;
    return Math.max(0, state.exam.durationSeconds - Math.floor((Date.now() - state.exam.startedAt) / 1000));
  }

  function updateExamTimer() {
    const remaining = remainingExamSeconds();
    const el = document.querySelector("#examTimer");
    if (el) el.textContent = formatDuration(remaining);
    if (remaining <= 0 && state.exam && !state.exam.submitted) submitExam(true);
  }

  function renderExam() {
    if (!state.exam) return openExamModal();
    state.view = "exam";
    const q = currentExam();
    const selected = state.exam.answers[q.id] ?? null;
    const answered = Object.keys(state.exam.answers).length;
    const options = Object.entries(q.options).map(([key, text]) => `<button class="option ${selected === key ? "selected" : ""}" data-exam-answer="${key}"><span class="option-key">${key}</span><span>${escapeHtml(text)}</span></button>`).join("");
    root.innerHTML = `
      <div class="exam-topbar"><div><p class="eyebrow">模拟考试</p><h1>随机试卷</h1></div><div class="exam-status"><span>已答 ${answered}/${state.exam.ids.length}</span><strong id="examTimer">${formatDuration(remainingExamSeconds())}</strong><button class="danger-button" data-action="confirm-submit-exam">交卷</button></div></div>
      <section class="practice-layout">
        <article class="card question-card">
          <div class="question-meta"><div class="tag-row"><span class="tag">${q.type}</span><span class="tag">第 ${state.exam.index + 1} 题</span></div><span>每题 1 分</span></div>
          <h2 class="question-title">${escapeHtml(q.question)}</h2>
          <div class="option-list">${options}</div>
          <div class="question-actions"><button class="ghost-button light-button" data-action="exam-previous" ${state.exam.index === 0 ? "disabled" : ""}>上一题</button><div class="right"><button class="primary-button" data-action="exam-next">${state.exam.index === state.exam.ids.length - 1 ? "检查答题卡" : "下一题"}</button></div></div>
        </article>
        <aside class="practice-side"><article class="card side-card number-card"><h3>答题卡</h3><div class="number-grid">${state.exam.ids.map((id, index) => `<button data-exam-jump="${index}" class="${index === state.exam.index ? "active" : state.exam.answers[id] ? "done" : ""}">${index + 1}</button>`).join("")}</div><div class="legend"><span><i class="answered-dot"></i>已答</span><span><i></i>未答</span></div></article></aside>
      </section>`;
    setActiveNav("exam");
    updateExamTimer();
  }

  function confirmSubmitExam() {
    if (!state.exam) return;
    const unanswered = state.exam.ids.length - Object.keys(state.exam.answers).length;
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal compact-modal" role="dialog" aria-modal="true"><h2>确认交卷？</h2><p class="subtle">${unanswered ? `还有 ${unanswered} 题未作答，未答题按错误计算。` : "所有题目都已作答。"}</p><div class="modal-actions"><button class="ghost-button light-button" data-action="close-modal">继续检查</button><button class="danger-button" data-action="submit-exam">确认交卷</button></div></section></div>`;
  }

  function submitExam(auto = false) {
    if (!state.exam || state.exam.submitted) return;
    state.exam.submitted = true;
    clearInterval(state.timer);
    const results = state.exam.ids.map((id) => {
      const q = byId.get(id); const selected = state.exam.answers[id] ?? null;
      return { id, selected, correct: selected === q.answer };
    });
    const correct = results.filter((r) => r.correct).length;
    const elapsed = Math.min(state.exam.durationSeconds, Math.floor((Date.now() - state.exam.startedAt) / 1000));
    results.forEach((r) => r.correct ? state.wrong.delete(r.id) : state.wrong.add(r.id));
    state.exam.results = results;
    state.history.unshift({ at: Date.now(), score: Math.round(correct / results.length * 100), correct, total: results.length, elapsed });
    save(); closeModal(); renderResults(auto);
  }

  function renderResults(auto = false) {
    state.view = "results";
    const results = state.exam?.results ?? [];
    const correct = results.filter((r) => r.correct).length;
    const wrongIds = results.filter((r) => !r.correct).map((r) => r.id);
    const score = results.length ? Math.round(correct / results.length * 100) : 0;
    root.innerHTML = `
      <div class="page-head"><div><p class="eyebrow">考试结果</p><h1>${auto ? "考试时间到" : "本次考试已完成"}</h1><p class="subtle">答错和未答题目已加入错题复习。</p></div></div>
      <section class="result-grid">
        <article class="card score-card"><span>本次得分</span><strong>${score}</strong><small>分</small><div class="progress-line"><b style="width:${score}%"></b></div></article>
        <article class="card result-stat"><strong>${correct}</strong><span>答对</span></article>
        <article class="card result-stat"><strong>${results.length - correct}</strong><span>答错/未答</span></article>
        <article class="card result-stat"><strong>${formatDuration(state.history[0]?.elapsed ?? 0)}</strong><span>用时</span></article>
      </section>
      <div class="section-title"><h2>答题回顾</h2><div><button class="secondary-button" data-action="review-current-exam-wrong" ${wrongIds.length ? "" : "disabled"}>复习本次错题</button></div></div>
      <section class="review-list">${results.slice(0, 12).map((r, index) => { const q = byId.get(r.id); return `<article class="card review-row"><span class="result-icon ${r.correct ? "ok" : "bad"}">${r.correct ? "✓" : "×"}</span><div><small>第 ${index + 1} 题 · ${q.topic}</small><h3>${escapeHtml(q.question)}</h3><p>${r.correct ? "回答正确" : `你的答案：${r.selected || "未答"}　正确答案：${q.answer}`}</p></div><button class="text-button" data-review-id="${q.id}">查看解析</button></article>`; }).join("")}</section>
      ${results.length > 12 ? `<p class="subtle center-text">仅展示前 12 题回顾，可进入错题复习查看全部答错题目。</p>` : ""}`;
    setActiveNav("exam");
  }

  function filteredBank() {
    const query = state.bank.query.trim().toLowerCase();
    return questions.filter((q) => {
      const matchesQuery = !query || q.question.toLowerCase().includes(query) || Object.values(q.options).some((value) => String(value).toLowerCase().includes(query));
      const matchesTopic = state.bank.topic === "全部" || q.topic === state.bank.topic;
      const matchesType = state.bank.type === "全部" || q.type === state.bank.type;
      return matchesQuery && matchesTopic && matchesType;
    });
  }

  function renderBank() {
    state.view = "bank";
    const filtered = filteredBank();
    const pageSize = 20;
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    state.bank.page = Math.min(state.bank.page, pages);
    const items = filtered.slice((state.bank.page - 1) * pageSize, state.bank.page * pageSize);
    root.innerHTML = `
      <div class="page-head"><div><p class="eyebrow">题库检索</p><h1>全部 ${questions.length} 道题</h1><p class="subtle">按题干、选项、题型或知识分类查找。</p></div></div>
      <section class="card bank-toolbar">
        <div class="search-field"><input id="bankSearch" type="search" placeholder="输入关键词，例如：硫化氢、清管器、压力表" value="${escapeHtml(state.bank.query)}"><button class="secondary-button" data-action="bank-search">搜索</button></div>
        <select id="bankTopic" aria-label="知识分类"><option value="全部">全部分类</option>${topics.map((t) => `<option value="${escapeHtml(t)}" ${state.bank.topic === t ? "selected" : ""}>${escapeHtml(t)}</option>`).join("")}</select>
        <select id="bankType" aria-label="题型"><option value="全部">全部题型</option><option value="单选题" ${state.bank.type === "单选题" ? "selected" : ""}>单选题</option><option value="判断题" ${state.bank.type === "判断题" ? "selected" : ""}>判断题</option></select>
      </section>
      <div class="bank-count">找到 ${filtered.length} 题</div>
      <section class="bank-list">${items.length ? items.map((q) => `<article class="card bank-item"><div class="bank-index">${q.id}</div><div><div class="tag-row"><span class="tag">${q.type}</span><span class="tag">${q.topic}</span>${state.favorites.has(q.id) ? `<span class="tag warm">已收藏</span>` : ""}</div><h2>${escapeHtml(q.question)}</h2><p class="subtle">答案：${q.answer} · ${escapeHtml(q.options[q.answer])}</p></div><button class="secondary-button" data-bank-id="${q.id}">开始作答</button></article>`).join("") : `<div class="card empty"><h2>没有找到匹配题目</h2><p>请尝试缩短关键词或清除筛选条件。</p></div>`}</section>
      <div class="pagination"><button class="ghost-button light-button" data-bank-page="${state.bank.page - 1}" ${state.bank.page <= 1 ? "disabled" : ""}>上一页</button><span>第 ${state.bank.page} / ${pages} 页</span><button class="ghost-button light-button" data-bank-page="${state.bank.page + 1}" ${state.bank.page >= pages ? "disabled" : ""}>下一页</button></div>`;
    setActiveNav("bank");
  }

  function openSources() {
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="sourcesTitle"><div class="modal-head"><div><p class="eyebrow">解析说明</p><h2 id="sourcesTitle">解析依据与版本提示</h2></div><button class="icon-button" data-action="close-modal" aria-label="关闭">×</button></div><p class="notice">网站按原题库答案评分。解析用于备考理解，不替代企业操作规程；涉及法规、限值和标准版本时，实际工作应以现行文件为准。</p><div class="source-list">${Object.values(SOURCES).map((source) => `<article><h3>${source.url ? `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)} ↗</a>` : escapeHtml(source.title)}</h3><p>${escapeHtml(source.note)}</p></article>`).join("")}</div></section></div>`;
  }

  function openQuestionExplanation(id) {
    const q = byId.get(Number(id));
    if (!q) return;
    const source = SOURCES[q.sourceKey] ?? SOURCES.questionBank;
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal wide-modal" role="dialog" aria-modal="true"><div class="modal-head"><div><p class="eyebrow">第 ${q.id} 题解析</p><h2>${escapeHtml(q.question)}</h2></div><button class="icon-button" data-action="close-modal" aria-label="关闭">×</button></div><div class="answer-callout">正确答案：${q.answer}（${escapeHtml(q.options[q.answer])}）</div><h3>解析</h3><p>${escapeHtml(q.explanation)}</p><details class="source-details"><summary>查看依据来源</summary><span>${q.explanationOrigin} · ${source.url ? `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)} ↗</a>` : escapeHtml(source.title)}${q.standardWarning ? `<br>${escapeHtml(q.standardWarning)}` : ""}</span></details></section></div>`;
  }

  function closeModal() { modalRoot.innerHTML = ""; }

  function selectPracticeGroup(scope, topic, order) {
    let ids = questions.filter((q) => topic === "全部" || q.topic === topic).map((q) => q.id);
    if (scope === "unanswered") ids = ids.filter((id) => !state.studied.has(id));
    if (scope === "wrong") ids = ids.filter((id) => state.wrong.has(id));
    if (scope === "favorites") ids = ids.filter((id) => state.favorites.has(id));
    if (order === "random") ids = shuffle(ids);
    startPractice(ids);
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    const action = target.dataset.action;
    if (target.dataset.view === "home") { clearInterval(state.timer); renderHome(); }
    if (action === "start-practice") openPracticeSetup();
    if (action === "start-all-practice") startPractice();
    if (action === "open-practice-setup") openPracticeSetup();
    if (action === "confirm-practice-setup") selectPracticeGroup(document.querySelector("#practiceScope").value, document.querySelector("#practiceTopic").value, document.querySelector("#practiceOrder").value);
    if (target.dataset.answer) { state.selected = target.dataset.answer; renderPractice(); }
    if (action === "reveal-answer") {
      const q = currentPractice(); if (!q || !state.selected) return;
      state.revealed = true;
      state.studied.add(q.id);
      state.answers[q.id] = { selected: state.selected, correct: state.selected === q.answer, at: Date.now() };
      state.selected === q.answer ? state.wrong.delete(q.id) : state.wrong.add(q.id);
      save(); renderPractice();
    }
    if (action === "next-question") {
      if (state.practiceIndex >= state.practiceIds.length - 1) { renderHome(); showToast("本组练习已完成"); }
      else { state.practiceIndex++; state.selected = null; state.revealed = false; renderPractice(); }
    }
    if (action === "previous-question") { state.practiceIndex = Math.max(0, state.practiceIndex - 1); state.selected = null; state.revealed = false; renderPractice(); }
    if (target.dataset.jump !== undefined) { state.practiceIndex = Number(target.dataset.jump); state.selected = null; state.revealed = false; renderPractice(); }
    if (action === "toggle-favorite") { const q = currentPractice(); state.favorites.has(q.id) ? state.favorites.delete(q.id) : state.favorites.add(q.id); save(); renderPractice(); showToast(state.favorites.has(q.id) ? "已收藏" : "已取消收藏"); }
    if (action === "toggle-mastered") { const q = currentPractice(); state.mastered.has(q.id) ? state.mastered.delete(q.id) : state.mastered.add(q.id); save(); renderPractice(); }
    if (action === "review-wrong") startPractice([...state.wrong]);
    if (action === "review-favorites") startPractice([...state.favorites]);
    if (action === "open-exam") openExamModal();
    if (action === "start-exam-confirm") startExam(Number(document.querySelector("#examCount").value), Number(document.querySelector("#examMinutes").value));
    if (target.dataset.examAnswer) { const q = currentExam(); state.exam.answers[q.id] = target.dataset.examAnswer; renderExam(); }
    if (action === "exam-next") { state.exam.index = Math.min(state.exam.index + 1, state.exam.ids.length - 1); renderExam(); }
    if (action === "exam-previous") { state.exam.index = Math.max(state.exam.index - 1, 0); renderExam(); }
    if (target.dataset.examJump !== undefined) { state.exam.index = Number(target.dataset.examJump); renderExam(); }
    if (action === "confirm-submit-exam") confirmSubmitExam();
    if (action === "submit-exam") submitExam(false);
    if (action === "review-current-exam-wrong") startPractice(state.exam.results.filter((r) => !r.correct).map((r) => r.id));
    if (target.dataset.reviewId) openQuestionExplanation(target.dataset.reviewId);
    if (action === "open-bank" || action === "open-search") renderBank();
    if (action === "bank-search") { state.bank.query = document.querySelector("#bankSearch").value; state.bank.topic = document.querySelector("#bankTopic").value; state.bank.type = document.querySelector("#bankType").value; state.bank.page = 1; renderBank(); }
    if (target.dataset.bankPage) { state.bank.page = Number(target.dataset.bankPage); renderBank(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    if (target.dataset.bankId) { const filtered = filteredBank().map((q) => q.id); startPractice(filtered, filtered.indexOf(Number(target.dataset.bankId))); }
    if (action === "open-sources") openSources();
    if (action === "close-modal") closeModal();
  });

  document.addEventListener("change", (event) => {
    if (["bankTopic", "bankType"].includes(event.target.id)) {
      state.bank.topic = document.querySelector("#bankTopic").value;
      state.bank.type = document.querySelector("#bankType").value;
      state.bank.query = document.querySelector("#bankSearch").value;
      state.bank.page = 1;
      renderBank();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
    if (event.key === "Enter" && event.target.id === "bankSearch") { state.bank.query = event.target.value; state.bank.page = 1; renderBank(); }
    if (!/^[a-dA-D]$/.test(event.key) || ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) return;
    const key = event.key.toUpperCase();
    if (state.view === "practice" && !state.revealed && currentPractice()?.options[key]) { state.selected = key; renderPractice(); }
    if (state.view === "exam" && currentExam()?.options[key]) { state.exam.answers[currentExam().id] = key; renderExam(); }
  });

  function registerWebMcp() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const safeRegister = (tool) => { try { void Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch {} };
    safeRegister({ name: "get_study_progress", title: "查看学习进度", description: "读取当前设备上的已背、答题、掌握、错题和考试进度。", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: () => ({ total: questions.length, studied: state.studied.size, answered: Object.keys(state.answers).length, mastered: state.mastered.size, wrong: state.wrong.size, examCount: state.history.length }) });
    safeRegister({ name: "start_practice_session", title: "开始背题练习", description: "按范围和知识分类打开背题练习。", inputSchema: { type: "object", properties: { scope: { type: "string", enum: ["all", "unanswered", "wrong", "favorites"] }, topic: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: ({ scope = "all", topic = "全部" } = {}) => { selectPracticeGroup(scope, topics.includes(topic) ? topic : "全部", "sequence"); return { started: true, questionCount: state.practiceIds.length, topic }; } });
    safeRegister({ name: "start_mock_exam", title: "开始模拟考试", description: "创建并打开一套随机模拟试卷。", inputSchema: { type: "object", properties: { questionCount: { type: "integer", enum: [20, 50, 100] }, durationMinutes: { type: "integer", enum: [30, 60, 90] } }, required: ["questionCount", "durationMinutes"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: ({ questionCount, durationMinutes }) => { startExam(questionCount, durationMinutes); return { started: true, questionCount, durationMinutes }; } });
    safeRegister({ name: "search_question_bank", title: "搜索题库", description: "按关键词搜索题干和选项并打开题库检索结果。", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: ({ query }) => { state.bank.query = String(query).slice(0, 80); state.bank.page = 1; renderBank(); return { matches: filteredBank().length, query: state.bank.query }; } });
  }

  updateProgress();
  renderHome();
  registerWebMcp();
})();
