(() => {
  "use strict";

  const STORAGE_KEY = "totte-demo-state-v2";
  const routes = [
    { id: "dashboard", label: "ダッシュボード", icon: "dashboard" },
    { id: "sales", label: "売上分析", icon: "sales" },
    { id: "inventory", label: "在庫管理", icon: "inventory" },
    { id: "orders", label: "発注管理", icon: "orders" },
  ];

  const stores = {
    main: { name: "中央通り本店", manager: "中央通り本店 店長" },
    station: { name: "北口駅前店", manager: "北口駅前店 店長" },
    park: { name: "水辺公園店", manager: "水辺公園店 店長" },
  };

  const baseProducts = [
    ["beans-dark", "深煎りブレンド", "コーヒー豆", "coffee", "g", 1800, 2000, 1000, "森灯ロースタリー"],
    ["beans-light", "浅煎りブレンド", "コーヒー豆", "coffee", "g", 3200, 2000, 0, "森灯ロースタリー"],
    ["beans-decaf", "デカフェ豆", "コーヒー豆", "coffee", "g", 900, 1000, 1000, "森灯ロースタリー"],
    ["milk", "牛乳 1L", "乳製品", "milk", "本", 4, 5, 12, "朝原デイリー"],
    ["oat-milk", "オーツミルク 1L", "乳製品", "milk", "本", 8, 4, 0, "朝原デイリー"],
    ["syrup", "バニラシロップ", "シロップ", "milk", "本", 3, 3, 0, "風見フーズ"],
    ["cocoa", "ココアパウダー", "パウダー", "package", "袋", 5, 3, 0, "風見フーズ"],
    ["matcha", "抹茶パウダー", "パウダー", "package", "袋", 2, 2, 3, "風見フーズ"],
    ["cup-s", "紙カップ S", "資材", "cup", "個", 160, 100, 0, "丸葉パッケージ"],
    ["cup-m", "紙カップ M", "資材", "cup", "個", 90, 100, 200, "丸葉パッケージ"],
    ["lid-m", "カップ蓋 M", "資材", "cup", "個", 180, 100, 0, "丸葉パッケージ"],
    ["napkin", "ペーパーナプキン", "資材", "package", "枚", 420, 200, 0, "丸葉パッケージ"],
    ["straw", "ストロー", "資材", "package", "本", 240, 150, 0, "丸葉パッケージ"],
    ["takeout-bag", "テイクアウト袋", "資材", "package", "枚", 70, 80, 100, "丸葉パッケージ"],
  ];

  const salesData = {
    main: {
      current: [72000, 80000, 76000, 90000, 82000, 88000, 84000],
      previous: [68000, 74000, 73000, 81000, 79000, 80000, 83000],
      customers: [104, 114, 108, 128, 116, 124, 120],
    },
    station: {
      current: [65000, 69000, 71000, 76000, 73000, 81000, 78000],
      previous: [61000, 65000, 67000, 70000, 69000, 72000, 75000],
      customers: [92, 98, 101, 108, 103, 116, 112],
    },
    park: {
      current: [52000, 56000, 59000, 65000, 62000, 72000, 68000],
      previous: [50000, 52000, 55000, 61000, 58000, 63000, 66000],
      customers: [76, 81, 86, 94, 90, 104, 99],
    },
  };

  function getDayLabels(endDate) {
    const end = new Date(`${endDate}T12:00:00`);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(end);
      date.setDate(end.getDate() - (6 - index));
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
  }

  function createInitialState() {
    const inventory = {};
    Object.keys(stores).forEach((storeId, storeIndex) => {
      inventory[storeId] = baseProducts.map((product, index) => {
        const [id, name, category, icon, unit, stock, threshold, pending, supplier] = product;
        const adjustment = storeIndex === 0 ? 0 : ((index + storeIndex) % 3) - 1;
        const adjustedStock = Math.max(0, stock + adjustment * Math.max(1, Math.round(threshold * .2)));
        return { id, name, category, icon, unit, stock: adjustedStock, threshold, pending, supplier };
      });
    });

    return {
      selectedStore: "main",
      selectedDate: "2026-10-10",
      inventory,
      orders: [
        { id: "PO-20261010-03", storeId: "main", itemId: "milk", quantity: 12, orderedAt: "2026-10-10", arrival: "2026-10-11", status: "ordered" },
        { id: "PO-20261010-02", storeId: "main", itemId: "cup-m", quantity: 200, orderedAt: "2026-10-10", arrival: "2026-10-12", status: "ordered" },
        { id: "PO-20261009-07", storeId: "main", itemId: "takeout-bag", quantity: 100, orderedAt: "2026-10-09", arrival: "2026-10-11", status: "ordered" },
        { id: "PO-20261008-02", storeId: "main", itemId: "beans-dark", quantity: 1000, orderedAt: "2026-10-08", arrival: "2026-10-10", status: "received" },
        { id: "PO-20261010-05", storeId: "station", itemId: "beans-decaf", quantity: 1000, orderedAt: "2026-10-10", arrival: "2026-10-12", status: "ordered" },
        { id: "PO-20261009-03", storeId: "park", itemId: "matcha", quantity: 3, orderedAt: "2026-10-09", arrival: "2026-10-11", status: "ordered" },
      ],
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && stores[saved.selectedStore] && saved.inventory && Array.isArray(saved.orders)) {
        return { ...createInitialState(), ...saved };
      }
    } catch (error) {
      console.warn("保存データを読み込めなかったため、初期データを使用します。", error);
    }
    return createInitialState();
  }

  let state = loadState();
  let inventoryFilters = { query: "", status: "all", category: "all" };
  let orderFilters = { query: "", status: "all" };
  let workflow = null;
  let lastDialogTrigger = null;
  let processingTimer = null;

  const appView = document.querySelector("#app-view");
  const storeSelector = document.querySelector("[data-store-selector]");
  const dialog = document.querySelector("#workflow-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const toastRegion = document.querySelector("#toast-region");

  const icon = (name, className = "icon") => `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  const yen = (value) => `${new Intl.NumberFormat("ja-JP").format(value)}円`;
  const formatDate = (value) => {
    const [year, month, day] = value.split("-");
    return `${year}年${Number(month)}月${Number(day)}日`;
  };

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentRoute() {
    const hash = location.hash.replace(/^#\/?/, "");
    return routes.some((route) => route.id === hash) ? hash : "dashboard";
  }

  function currentStore() {
    return stores[state.selectedStore];
  }

  function currentInventory() {
    return state.inventory[state.selectedStore] || [];
  }

  function findItem(itemId, storeId = state.selectedStore) {
    return (state.inventory[storeId] || []).find((item) => item.id === itemId);
  }

  function productThumb(item) {
    return `<span class="product-thumb" aria-hidden="true"><img src="./assets/images/products/${item.id}.png?v=20261010-2" width="40" height="40" alt="" decoding="async"></span>`;
  }

  function renderNavigation() {
    const route = currentRoute();
    const markup = routes.map((item) => `
      <a class="nav-link" href="#${item.id}" data-route="${item.id}" ${item.id === route ? 'aria-current="page"' : ""}>
        ${icon(item.icon)}<span>${item.label}</span>
      </a>`).join("");
    document.querySelector("[data-navigation]").innerHTML = markup;
    document.querySelector("[data-mobile-navigation]").innerHTML = markup;
  }

  function syncStoreUI() {
    const store = currentStore();
    storeSelector.value = state.selectedStore;
    document.querySelectorAll("[data-current-store]").forEach((node) => { node.textContent = store.name; });
    document.querySelector("[data-user-name]").textContent = store.manager;
  }

  function metricCard({ iconName, label, value, note, compare }) {
    return `<article class="card metric-card">
      <span class="metric-card__icon" aria-hidden="true">${icon(iconName)}</span>
      <div class="metric-card__body">
        <span class="metric-card__label">${label}</span>
        <strong class="metric-card__value">${value}</strong>
        ${compare ? `<span class="metric-card__compare">${compare}</span>` : `<span class="metric-card__note">${note}</span>`}
      </div>
    </article>`;
  }

  function pageHeader(title, description, actions = "") {
    return `<header class="page-header">
      <div class="page-title-group">
        <h2 class="page-title">${title}</h2>
        <p class="page-description">${description}</p>
      </div>
      <div class="page-actions">${actions}</div>
    </header>`;
  }

  function barChart(current, previous = null) {
    const max = Math.max(...current, ...(previous || []));
    const labels = getDayLabels(state.selectedDate);
    return `<div class="bar-chart" role="img" aria-label="${labels[0]}から${labels.at(-1)}までの売上推移">
      ${current.map((value, index) => `<div class="bar-chart__item">
        <div class="bar-chart__bars">
          ${previous ? `<span class="bar-chart__bar bar-chart__bar--previous" style="height:${Math.max(6, Math.round(previous[index] / max * 100))}%" title="直前期間 ${yen(previous[index])}"></span>` : ""}
          <span class="bar-chart__bar" style="height:${Math.max(6, Math.round(value / max * 100))}%" title="${labels[index]} ${yen(value)}"></span>
        </div>
        <span class="bar-chart__label">${labels[index]}</span>
      </div>`).join("")}
    </div>`;
  }

  function renderDashboard() {
    const sales = salesData[state.selectedStore];
    const dailySales = sales.current.at(-1);
    const customers = sales.customers.at(-1);
    const unitPrice = customers ? Math.round(dailySales / customers) : null;
    const restockItems = currentInventory().filter((item) => item.stock <= item.threshold).slice(0, 3);
    const openOrders = state.orders.filter((order) => order.storeId === state.selectedStore && order.status === "ordered");

    appView.innerHTML = `<section class="page page--dashboard">
      ${pageHeader("ダッシュボード", "今日の営業状況と、次に必要な対応を確認できます。", `<span class="date-chip">${icon("calendar")}対象日 ${formatDate(state.selectedDate)}</span>`)}
      <div class="kpi-grid">
        ${metricCard({ iconName: "sales", label: "売上", value: yen(dailySales), compare: "前日比 +2.4%" })}
        ${metricCard({ iconName: "store", label: "客数", value: `${customers}人`, compare: "前日比 +3.1%" })}
        ${metricCard({ iconName: "coffee", label: "客単価", value: unitPrice ? yen(unitPrice) : "—", note: "売上 ÷ 客数" })}
      </div>

      <div class="dashboard-grid">
        <section class="card section-card dashboard-alerts" aria-labelledby="restock-heading">
          <div class="section-heading">
            <div><h2 id="restock-heading">要補充の在庫</h2><p>現在・補充基準以下</p></div>
            <a class="button button--outline" href="#inventory">在庫を確認</a>
          </div>
          <div class="alert-list">
            ${restockItems.map((item) => `<article class="inventory-alert">
              ${productThumb(item)}
              <div class="product-main">
                <strong class="product-name">${item.name}</strong>
                <span class="product-meta">${item.category}</span>
                <div class="stock-values"><span>現在庫 <strong>${item.stock}${item.unit}</strong></span><span>基準 ${item.threshold}${item.unit}以下</span>${item.pending ? `<span class="pending-inline">${icon("truck")}入荷待ち ${item.pending}${item.unit}</span>` : ""}</div>
              </div>
              <button class="button button--primary" type="button" data-create-order="${item.id}">${icon("plus")}発注</button>
            </article>`).join("")}
          </div>
        </section>

        <section class="card section-card dashboard-chart" aria-labelledby="chart-heading">
          <div class="section-heading">
            <div><h2 id="chart-heading">過去7日間の売上推移</h2><p>単位：円</p></div>
            <div class="chart-legend"><span><i class="legend-dot"></i>売上</span></div>
          </div>
          ${barChart(sales.current)}
        </section>
      </div>

      <section class="card data-card" aria-labelledby="pending-orders-heading">
        <header class="data-card__header">
          <h2 id="pending-orders-heading">入荷待ちの発注</h2>
          <span>現在・${openOrders.length}件</span>
        </header>
        ${ordersTable(openOrders.slice(0, 5), true)}
        ${ordersMobileCards(openOrders.slice(0, 5), true)}
      </section>
    </section>`;
  }

  function renderSales() {
    const sales = salesData[state.selectedStore];
    const labels = getDayLabels(state.selectedDate);
    const total = sales.current.reduce((sum, value) => sum + value, 0);
    const previousTotal = sales.previous.reduce((sum, value) => sum + value, 0);
    const customers = sales.customers.reduce((sum, value) => sum + value, 0);
    const unitPrice = customers ? Math.round(total / customers) : null;
    const difference = ((total - previousTotal) / previousTotal * 100).toFixed(1);

    appView.innerHTML = `<section class="page">
      ${pageHeader("売上分析", "選択期間の売上と、同じ日数の直前期間を比較できます。", `<label class="date-chip" for="sales-date">${icon("calendar")}<input id="sales-date" class="form-control" type="date" value="${state.selectedDate}" data-sales-date></label>`)}
      <div class="kpi-grid">
        ${metricCard({ iconName: "sales", label: "期間売上", value: yen(total), compare: `直前期間比 +${difference}%` })}
        ${metricCard({ iconName: "store", label: "期間客数", value: `${customers}人`, compare: "直前期間比 +4.0%" })}
        ${metricCard({ iconName: "coffee", label: "客単価", value: unitPrice ? yen(unitPrice) : "—", note: "客数0の場合は—" })}
      </div>
      <section class="card section-card" aria-labelledby="sales-chart-heading">
        <div class="section-heading">
          <div><h2 id="sales-chart-heading">売上推移</h2><p>同じ日数の直前期間と比較</p></div>
          <div class="chart-legend"><span><i class="legend-dot"></i>選択期間</span><span><i class="legend-dot legend-dot--previous"></i>直前期間</span></div>
        </div>
        ${barChart(sales.current, sales.previous)}
        <div class="highlight-callout" style="margin-top:20px">${icon("sales")}<div><strong>期間最高売上：${labels[3]} ${yen(sales.current[3])}</strong><span>ランチ以降の来店が多く、期間平均を上回りました。</span></div></div>
      </section>
    </section>`;
  }

  function inventoryMatches(item) {
    const query = inventoryFilters.query.trim().toLowerCase();
    const matchesQuery = !query || `${item.name} ${item.category}`.toLowerCase().includes(query);
    const matchesStatus = inventoryFilters.status === "all" || (inventoryFilters.status === "low" ? item.stock <= item.threshold : item.stock > item.threshold);
    const matchesCategory = inventoryFilters.category === "all" || item.category === inventoryFilters.category;
    return matchesQuery && matchesStatus && matchesCategory;
  }

  function inventoryTable(items) {
    return `<div class="data-table-wrap"><table class="data-table">
      <thead><tr><th>品目</th><th>現在庫</th><th>補充基準</th><th>入荷待ち</th><th>在庫状態</th><th>操作</th></tr></thead>
      <tbody>${items.map((item) => {
        const low = item.stock <= item.threshold;
        const meter = Math.min(100, Math.round(item.stock / item.threshold * 100));
        return `<tr>
          <td><div class="table-product">${productThumb(item)}<div><strong class="product-name">${item.name}</strong><span class="product-meta">${item.category}</span></div></div></td>
          <td><strong>${item.stock}${item.unit}</strong><div class="stock-meter ${low ? "is-low" : ""}"><span style="width:${meter}%"></span></div></td>
          <td>${item.threshold}${item.unit}以下</td>
          <td>${item.pending ? `<span class="pending-inline">${icon("truck")} ${item.pending}${item.unit}</span>` : "—"}</td>
          <td><span class="status-badge ${low ? "status-badge--warning" : "status-badge--success"}">${icon(low ? "alert" : "check")}${low ? "要補充" : "適正"}</span></td>
          <td><button class="button ${low ? "button--primary" : "button--outline"}" type="button" data-create-order="${item.id}">${icon("plus")}発注</button></td>
        </tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function inventoryMobileCards(items) {
    return `<div class="mobile-card-list">${items.map((item) => {
      const low = item.stock <= item.threshold;
      return `<article class="card mobile-data-card">
        <div class="mobile-data-card__head"><div class="table-product">${productThumb(item)}<div><strong class="product-name">${item.name}</strong><span class="product-meta">${item.category}</span></div></div><span class="status-badge ${low ? "status-badge--warning" : "status-badge--success"}">${icon(low ? "alert" : "check")}${low ? "要補充" : "適正"}</span></div>
        <div class="mobile-data-card__details"><div class="detail-pair"><span>現在庫</span><strong>${item.stock}${item.unit}</strong></div><div class="detail-pair"><span>補充基準</span><strong>${item.threshold}${item.unit}以下</strong></div><div class="detail-pair"><span>入荷待ち</span><strong>${item.pending ? `${item.pending}${item.unit}` : "—"}</strong></div></div>
        <button class="button ${low ? "button--primary" : "button--outline"}" type="button" data-create-order="${item.id}">${icon("plus")}発注を作成</button>
      </article>`;
    }).join("")}</div>`;
  }

  function renderInventory() {
    const inventory = currentInventory();
    const filtered = inventory.filter(inventoryMatches);
    const lowCount = inventory.filter((item) => item.stock <= item.threshold).length;
    const pendingCount = inventory.filter((item) => item.pending > 0).length;
    const categories = [...new Set(inventory.map((item) => item.category))];

    appView.innerHTML = `<section class="page">
      ${pageHeader("在庫管理", "現在庫と入荷待ちを確認し、必要な品目を発注できます。", `<span class="current-chip">${icon("clock")}現在・10月10日 18:10更新</span>`)}
      <div class="summary-grid">
        ${metricCard({ iconName: "inventory", label: "登録品目", value: `${inventory.length}点`, note: `${currentStore().name}の現在庫` })}
        ${metricCard({ iconName: "alert", label: "要補充", value: `${lowCount}点`, note: "補充基準以下" })}
        ${metricCard({ iconName: "truck", label: "入荷待ち", value: `${pendingCount}件`, note: "発注済み" })}
      </div>
      <div class="toolbar">
        <div class="filter-group">
          <label class="search-control">${icon("search")}<span class="visually-hidden">品目を検索</span><input type="search" placeholder="品目を検索" value="${inventoryFilters.query}" data-inventory-query></label>
          <select class="form-control" aria-label="在庫状態" data-inventory-status><option value="all">状態：すべて</option><option value="low" ${inventoryFilters.status === "low" ? "selected" : ""}>状態：要補充</option><option value="ok" ${inventoryFilters.status === "ok" ? "selected" : ""}>状態：適正</option></select>
          <select class="form-control" aria-label="カテゴリ" data-inventory-category><option value="all">カテゴリ：すべて</option>${categories.map((category) => `<option value="${category}" ${inventoryFilters.category === category ? "selected" : ""}>${category}</option>`).join("")}</select>
        </div>
        <button class="button button--primary" type="button" data-create-order="milk">${icon("plus")}発注を作成</button>
      </div>
      <section class="card data-card" aria-labelledby="inventory-list-heading">
        <header class="data-card__header"><h2 id="inventory-list-heading">在庫一覧</h2><span>${filtered.length}件を表示</span></header>
        ${filtered.length ? `${inventoryTable(filtered)}${inventoryMobileCards(filtered)}` : `<div class="empty-state"><div class="empty-state__inner"><span class="empty-state__icon">${icon("search")}</span><h2>条件に一致する品目がありません</h2><p>検索語句や状態・カテゴリの条件を変更してください。</p><button class="button button--outline" type="button" data-clear-inventory-filters>${icon("reset")}絞り込みを解除</button></div></div>`}
      </section>
    </section>`;
  }

  function getOrderItem(order) {
    return findItem(order.itemId, order.storeId) || { id: order.itemId, name: "品目", category: "—", icon: "package", unit: "個", stock: 0, threshold: 0, pending: 0 };
  }

  function ordersTable(orders, compact = false) {
    return `<div class="data-table-wrap"><table class="data-table data-table--orders">
      <thead><tr><th>発注番号</th><th>品目</th><th>発注日</th><th>入荷予定</th><th>発注状態</th><th>操作</th></tr></thead>
      <tbody>${orders.map((order) => {
        const item = getOrderItem(order);
        const received = order.status === "received";
        return `<tr><td>${order.id}</td><td><div class="table-product">${productThumb(item)}<div><strong class="product-name">${item.name}</strong><span class="product-meta">${order.quantity}${item.unit}</span></div></div></td><td>${formatDate(order.orderedAt)}</td><td>${formatDate(order.arrival)}</td><td><span class="status-badge ${received ? "status-badge--success" : "status-badge--warning"}">${icon(received ? "check" : "clock")}${received ? "入荷済み" : "発注済み"}</span></td><td>${received ? `<button class="button" type="button" disabled>${icon("lock")}処理済み</button>` : `<button class="button button--primary" type="button" data-open-receive="${order.id}">${icon("package")}入荷処理</button>`}</td></tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function ordersMobileCards(orders, compact = false) {
    return `<div class="mobile-card-list">${orders.map((order) => {
      const item = getOrderItem(order);
      const received = order.status === "received";
      return `<article class="card mobile-data-card"><div class="mobile-data-card__head"><div class="table-product">${productThumb(item)}<div><strong class="product-name">${item.name}</strong><span class="product-meta">${order.id}</span></div></div><span class="status-badge ${received ? "status-badge--success" : "status-badge--warning"}">${icon(received ? "check" : "clock")}${received ? "入荷済み" : "発注済み"}</span></div><div class="mobile-data-card__details"><div class="detail-pair"><span>数量</span><strong>${order.quantity}${item.unit}</strong></div><div class="detail-pair"><span>入荷予定</span><strong>${formatDate(order.arrival)}</strong></div></div>${received ? `<button class="button" type="button" disabled>${icon("lock")}入荷処理済み</button>` : `<button class="button button--primary" type="button" data-open-receive="${order.id}">${icon("package")}入荷処理</button>`}</article>`;
    }).join("")}</div>`;
  }

  function renderOrders() {
    const storeOrders = state.orders.filter((order) => order.storeId === state.selectedStore);
    const filtered = storeOrders.filter((order) => {
      const item = getOrderItem(order);
      const query = orderFilters.query.trim().toLowerCase();
      return (!query || `${order.id} ${item.name}`.toLowerCase().includes(query)) && (orderFilters.status === "all" || order.status === orderFilters.status);
    });
    const openCount = storeOrders.filter((order) => order.status === "ordered").length;
    const receivedCount = storeOrders.filter((order) => order.status === "received").length;

    appView.innerHTML = `<section class="page">
      ${pageHeader("発注管理", "発注内容と入荷状況を確認し、入荷を現在庫へ反映します。", `<span class="current-chip">${icon("clock")}現在・10月10日 18:10更新</span><button class="button button--primary" type="button" data-create-order="milk">${icon("plus")}新しい発注</button>`)}
      <div class="summary-grid">
        ${metricCard({ iconName: "orders", label: "発注", value: `${storeOrders.length}件`, note: `${currentStore().name}の現在状況` })}
        ${metricCard({ iconName: "clock", label: "発注済み", value: `${openCount}件`, note: "入荷待ち" })}
        ${metricCard({ iconName: "check", label: "入荷済み", value: `${receivedCount}件`, note: "在庫へ反映済み" })}
      </div>
      <div class="toolbar"><div class="filter-group"><label class="search-control">${icon("search")}<span class="visually-hidden">発注を検索</span><input type="search" placeholder="発注番号・品目を検索" value="${orderFilters.query}" data-order-query></label><select class="form-control" aria-label="発注状態" data-order-status><option value="all">状態：すべて</option><option value="ordered" ${orderFilters.status === "ordered" ? "selected" : ""}>発注済み</option><option value="received" ${orderFilters.status === "received" ? "selected" : ""}>入荷済み</option></select></div><span class="product-meta">${filtered.length}件を表示</span></div>
      <section class="card data-card" aria-labelledby="orders-list-heading"><header class="data-card__header"><h2 id="orders-list-heading">発注一覧</h2><span>${icon("lock")}入荷済みは再処理できません</span></header>${ordersTable(filtered)}${ordersMobileCards(filtered)}</section>
    </section>`;
  }

  function renderRoute() {
    renderNavigation();
    syncStoreUI();
    const route = currentRoute();
    const routeInfo = routes.find((item) => item.id === route);
    document.title = `${routeInfo.label}｜totte`;
    ({ dashboard: renderDashboard, sales: renderSales, inventory: renderInventory, orders: renderOrders })[route]();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function flowSteps(currentIndex) {
    const labels = ["内容入力", "確認", "発注完了", "入荷待ち", "入荷済み"];
    return `<div class="flow-steps" aria-label="発注から入荷までの進行状況">${labels.map((label, index) => {
      const complete = index < currentIndex || currentIndex === 4;
      const current = index === currentIndex && currentIndex !== 4;
      return `<div class="flow-step ${complete ? "is-complete" : ""} ${current ? "is-current" : ""}"><span class="flow-step__dot">${complete ? icon("check") : index + 1}</span><span>${label}</span></div>`;
    }).join("")}</div>`;
  }

  function dialogHeader(title, description, processing = false) {
    return `<header class="dialog-header"><div><h2 id="dialog-title">${title}</h2><p>${description}</p></div><button class="icon-button" type="button" aria-label="閉じる" data-dialog-action="close" ${processing ? "disabled" : ""}>${icon("close")}</button></header>`;
  }

  function productPanel(item, meta) {
    return `<div class="dialog-product">${productThumb(item)}<div><strong class="product-name">${item.name}</strong><span class="product-meta">${meta}</span></div></div>`;
  }

  function renderOrderCreate() {
    const item = findItem(workflow.itemId);
    const hasQuantityError = Boolean(workflow.errors?.quantity);
    const hasArrivalError = Boolean(workflow.errors?.arrival);
    const hasError = hasQuantityError || hasArrivalError;
    dialogContent.innerHTML = `<form class="dialog-shell" data-order-form novalidate>
      ${dialogHeader("発注を作成", "店舗と品目を引き継いでいます。")}
      ${flowSteps(0)}
      <div class="dialog-body">
        <div class="field-grid"><div class="field"><span class="field__label">店舗</span><div class="field__static">${currentStore().name}</div></div><div class="field"><span class="field__label">品目</span>${productPanel(item, item.category)}</div></div>
        <div class="stock-context"><div class="stock-context__title">${icon("inventory")}現在の在庫状況</div><div class="key-value-list"><div class="key-value"><span>現在庫</span><strong>${item.stock}${item.unit}</strong></div><div class="key-value"><span>補充基準</span><strong>${item.threshold}${item.unit}以下</strong></div><div class="key-value"><span>入荷待ち</span><strong class="is-emphasis">${item.pending}${item.unit}</strong></div></div></div>
        <div class="field-grid"><div class="field ${hasQuantityError ? "is-error" : ""}"><label for="order-quantity">発注数量</label><input id="order-quantity" name="quantity" type="number" min="1" step="1" value="${workflow.quantity}" ${hasQuantityError ? 'aria-describedby="quantity-error" aria-invalid="true"' : ""}>${hasQuantityError ? `<span id="quantity-error" class="field-error">${icon("alert")}1以上の整数を入力してください。</span>` : ""}</div><div class="field ${hasArrivalError ? "is-error" : ""}"><label for="arrival-date">入荷予定日</label><input id="arrival-date" name="arrival" type="date" min="${state.selectedDate}" value="${workflow.arrival}" ${hasArrivalError ? 'aria-describedby="arrival-error" aria-invalid="true"' : ""} required>${hasArrivalError ? `<span id="arrival-error" class="field-error">${icon("alert")}対象日以降の日付を入力してください。</span>` : ""}</div></div>
        ${item.pending ? `<div class="highlight-callout">${icon("alert")}<div><strong>入荷待ちの商品があります</strong><span>すでに${item.pending}${item.unit}を発注済みです。数量を確認してください。</span></div></div>` : ""}
        ${hasError ? `<div class="error-summary" tabindex="-1" data-error-summary>${icon("alert")}<div><strong>入力内容を確認してください</strong><span>${hasQuantityError && hasArrivalError ? "発注数量と入荷予定日を修正してください。" : hasQuantityError ? "発注数量を1以上の整数で入力してください。" : "入荷予定日を対象日以降に設定してください。"}</span></div></div>` : ""}
      </div>
      <footer class="dialog-actions"><button class="button button--secondary" type="button" data-dialog-action="close">キャンセル</button><button class="button button--primary" type="submit" ${hasError ? "disabled" : ""}>${icon("arrow")}確認へ進む</button></footer>
    </form>`;
  }

  function renderOrderConfirm(processing = false) {
    const item = findItem(workflow.itemId);
    const total = item.pending + workflow.quantity;
    dialogContent.innerHTML = `<div class="dialog-shell">
      ${dialogHeader("発注内容を確認", "確定前に数量と入荷待ちを確認します。", processing)}
      ${flowSteps(1)}
      <div class="dialog-body">
        ${productPanel(item, `${currentStore().name}・${item.category}`)}
        <div class="key-value-list"><div class="key-value"><span>店舗</span><strong>${currentStore().name}</strong></div><div class="key-value"><span>仕入先</span><strong>${item.supplier}</strong></div><div class="key-value"><span>発注数量</span><strong class="is-emphasis">${workflow.quantity}${item.unit}</strong></div><div class="key-value"><span>入荷予定日</span><strong>${formatDate(workflow.arrival)}</strong></div><div class="key-value"><span>現在の入荷待ち</span><strong>${item.pending}${item.unit}</strong></div></div>
        <div class="highlight-callout">${icon("truck")}<div><strong>確定後の入荷待ち：合計${total}${item.unit}</strong><span>既存${item.pending}${item.unit}＋今回${workflow.quantity}${item.unit}。内容に間違いがないか確認してください。</span></div></div>
      </div>
      ${processing ? `<div class="processing-note"><span class="spinner" aria-hidden="true"></span><span>発注を確定しています。完了までこの画面を閉じずにお待ちください。</span></div>` : ""}
      <footer class="dialog-actions"><button class="button button--secondary" type="button" data-dialog-action="back-create" ${processing ? "disabled" : ""}>入力へ戻る</button><button class="button button--primary ${processing ? "is-processing" : ""}" type="button" data-dialog-action="confirm-order" ${processing ? "disabled" : ""}>${processing ? `<span class="spinner" aria-hidden="true"></span>発注を確定中…` : `${icon("check")}発注を確定`}</button></footer>
    </div>`;
  }

  function renderOrderComplete() {
    const order = state.orders.find((item) => item.id === workflow.createdOrderId);
    const item = getOrderItem(order);
    dialogContent.innerHTML = `<div class="dialog-shell">
      ${dialogHeader("発注完了", "発注済みとして一覧へ反映しました。")}
      ${flowSteps(2)}
      <div class="dialog-body"><div class="success-message"><span class="success-message__icon">${icon("check")}</span><h3>発注を確定しました</h3><p>入荷予定日まで発注管理で状況を確認できます。</p></div>${productPanel(item, `${currentStore().name}・${order.quantity}${item.unit}`)}<div class="key-value-list"><div class="key-value"><span>発注番号</span><strong>${order.id}</strong></div><div class="key-value"><span>仕入先</span><strong>${item.supplier}</strong></div><div class="key-value"><span>発注数量</span><strong class="is-emphasis">${order.quantity}${item.unit}</strong></div><div class="key-value"><span>入荷予定日</span><strong>${formatDate(order.arrival)}</strong></div><div class="key-value"><span>発注状態</span><strong style="color:var(--color-success)">発注済み</strong></div></div></div>
      <footer class="dialog-actions"><button class="button button--secondary" type="button" data-dialog-action="close">閉じる</button><button class="button button--primary" type="button" data-dialog-action="go-orders">${icon("orders")}発注一覧へ</button></footer>
    </div>`;
  }

  function renderReceiveConfirm(processing = false) {
    const order = state.orders.find((item) => item.id === workflow.orderId);
    const item = getOrderItem(order);
    const after = item.stock + order.quantity;
    dialogContent.innerHTML = `<div class="dialog-shell">
      ${dialogHeader("入荷処理を確認", "在庫へ反映する数量を確認します。", processing)}
      ${flowSteps(3)}
      <div class="dialog-body">${productPanel(item, `${currentStore().name}・${order.quantity}${item.unit}`)}<div class="inventory-equation"><div><span>現在庫</span><strong>${item.stock}${item.unit}</strong></div><b class="inventory-equation__operator">＋</b><div><span>今回の入荷</span><strong>${order.quantity}${item.unit}</strong></div><b class="inventory-equation__operator">＝</b><div><span>反映後</span><strong>${after}${item.unit}</strong></div></div><div class="key-value-list"><div class="key-value"><span>発注番号</span><strong>${order.id}</strong></div><div class="key-value"><span>入荷処理日</span><strong>${formatDate(state.selectedDate)}</strong></div><div class="key-value"><span>現在の発注状態</span><strong>発注済み</strong></div></div><div class="highlight-callout">${icon("alert")}<div><strong>入荷処理は一度だけ実行されます</strong><span>確定すると在庫へ${order.quantity}${item.unit}加算され、再処理できません。</span></div></div></div>
      ${processing ? `<div class="processing-note"><span class="spinner" aria-hidden="true"></span><span>在庫へ反映しています。完了までお待ちください。</span></div>` : ""}
      <footer class="dialog-actions"><button class="button button--secondary" type="button" data-dialog-action="close" ${processing ? "disabled" : ""}>キャンセル</button><button class="button button--primary ${processing ? "is-processing" : ""}" type="button" data-dialog-action="confirm-receive" ${processing ? "disabled" : ""}>${processing ? `<span class="spinner" aria-hidden="true"></span>反映中…` : `${icon("package")}入荷を確定`}</button></footer>
    </div>`;
  }

  function renderReceiveComplete() {
    const order = state.orders.find((item) => item.id === workflow.orderId);
    const item = getOrderItem(order);
    dialogContent.innerHTML = `<div class="dialog-shell">
      ${dialogHeader("入荷完了", "在庫への反映が完了しました。")}
      ${flowSteps(4)}
      <div class="dialog-body"><div class="success-message"><span class="success-message__icon">${icon("package")}</span><h3>入荷を在庫へ反映しました</h3><p>発注状態を入荷済みに変更しました。</p></div>${productPanel(item, `${currentStore().name}・${order.quantity}${item.unit}`)}<div class="success-summary"><div class="key-value"><span>処理前の在庫</span><strong>${workflow.stockBefore}${item.unit}</strong></div><div class="key-value"><span>入荷数量</span><strong style="color:var(--color-success)">+${order.quantity}${item.unit}</strong></div><div class="key-value"><span>現在庫</span><strong style="color:var(--color-success)">${item.stock}${item.unit}</strong></div></div><div class="locked-note">${icon("lock")}<span>この発注は入荷処理済みのため、再処理できません。</span></div></div>
      <footer class="dialog-actions"><button class="button button--secondary" type="button" data-dialog-action="close">閉じる</button><button class="button button--primary" type="button" data-dialog-action="go-inventory">${icon("inventory")}在庫を確認</button></footer>
    </div>`;
  }

  function renderDialog() {
    if (!workflow) return;
    if (workflow.kind === "order") {
      if (workflow.step === "create") renderOrderCreate();
      if (workflow.step === "confirm") renderOrderConfirm(false);
      if (workflow.step === "processing") renderOrderConfirm(true);
      if (workflow.step === "complete") renderOrderComplete();
    } else {
      if (workflow.step === "confirm") renderReceiveConfirm(false);
      if (workflow.step === "processing") renderReceiveConfirm(true);
      if (workflow.step === "complete") renderReceiveComplete();
    }
  }

  function openOrderDialog(itemId, trigger) {
    const tomorrow = new Date(`${state.selectedDate}T12:00:00`);
    tomorrow.setDate(tomorrow.getDate() + 1);
    workflow = { kind: "order", step: "create", itemId, quantity: "", arrival: tomorrow.toISOString().slice(0, 10), errors: {} };
    lastDialogTrigger = trigger;
    renderDialog();
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => dialog.querySelector("#order-quantity")?.focus());
  }

  function openReceiveDialog(orderId, trigger) {
    const order = state.orders.find((item) => item.id === orderId);
    if (!order || order.status !== "ordered") {
      showToast("この発注は入荷処理済みです。");
      return;
    }
    const item = getOrderItem(order);
    workflow = { kind: "receive", step: "confirm", orderId, stockBefore: item.stock };
    lastDialogTrigger = trigger;
    renderDialog();
    if (!dialog.open) dialog.showModal();
  }

  function closeDialog() {
    if (workflow?.step === "processing") return;
    clearTimeout(processingTimer);
    dialog.close();
    workflow = null;
    if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus();
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `${icon("check")}<span>${message}</span>`;
    toastRegion.append(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function confirmOrder() {
    if (workflow.step === "processing") return;
    workflow.step = "processing";
    renderDialog();
    processingTimer = window.setTimeout(() => {
      const item = findItem(workflow.itemId);
      const orderId = `PO-${state.selectedDate.replaceAll("-", "")}-${String(state.orders.length + 1).padStart(2, "0")}`;
      state.orders.unshift({ id: orderId, storeId: state.selectedStore, itemId: item.id, quantity: workflow.quantity, orderedAt: state.selectedDate, arrival: workflow.arrival, status: "ordered" });
      item.pending += workflow.quantity;
      workflow.createdOrderId = orderId;
      workflow.step = "complete";
      saveState();
      renderDialog();
      renderRoute();
      showToast("発注を作成しました。入荷待ち数量へ反映しています。");
    }, 900);
  }

  function confirmReceive() {
    if (workflow.step === "processing") return;
    const order = state.orders.find((item) => item.id === workflow.orderId);
    if (!order || order.status !== "ordered") {
      showToast("この発注はすでに処理されています。");
      closeDialog();
      renderRoute();
      return;
    }
    workflow.step = "processing";
    renderDialog();
    processingTimer = window.setTimeout(() => {
      const item = getOrderItem(order);
      item.stock += order.quantity;
      item.pending = Math.max(0, item.pending - order.quantity);
      order.status = "received";
      order.receivedAt = state.selectedDate;
      workflow.step = "complete";
      saveState();
      renderDialog();
      renderRoute();
      showToast("入荷数量を現在庫へ反映しました。");
    }, 900);
  }

  document.addEventListener("click", (event) => {
    const createButton = event.target.closest("[data-create-order]");
    if (createButton) {
      openOrderDialog(createButton.dataset.createOrder, createButton);
      return;
    }

    const receiveButton = event.target.closest("[data-open-receive]");
    if (receiveButton) {
      openReceiveDialog(receiveButton.dataset.openReceive, receiveButton);
      return;
    }

    const clearFilters = event.target.closest("[data-clear-inventory-filters]");
    if (clearFilters) {
      inventoryFilters = { query: "", status: "all", category: "all" };
      renderInventory();
      requestAnimationFrame(() => document.querySelector("[data-inventory-query]")?.focus());
      return;
    }

    const actionButton = event.target.closest("[data-dialog-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.dialogAction;
    if (action === "close") closeDialog();
    if (action === "back-create") { workflow.step = "create"; renderDialog(); }
    if (action === "confirm-order") confirmOrder();
    if (action === "confirm-receive") confirmReceive();
    if (action === "go-orders") { closeDialog(); location.hash = "orders"; }
    if (action === "go-inventory") { closeDialog(); location.hash = "inventory"; }
  });

  document.addEventListener("submit", (event) => {
    if (!event.target.matches("[data-order-form]")) return;
    event.preventDefault();
    const data = new FormData(event.target);
    const quantity = Number(data.get("quantity"));
    workflow.arrival = String(data.get("arrival"));
    const quantityIsValid = Number.isInteger(quantity) && quantity >= 1;
    const arrivalIsValid = /^\d{4}-\d{2}-\d{2}$/.test(workflow.arrival) && workflow.arrival >= state.selectedDate;
    if (!quantityIsValid || !arrivalIsValid) {
      workflow.quantity = data.get("quantity") || "";
      workflow.errors = { quantity: !quantityIsValid, arrival: !arrivalIsValid };
      renderDialog();
      requestAnimationFrame(() => (dialog.querySelector("[data-error-summary]") || dialog.querySelector("#order-quantity"))?.focus());
      return;
    }
    workflow.quantity = quantity;
    workflow.errors = {};
    workflow.step = "confirm";
    renderDialog();
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-inventory-query]")) {
      inventoryFilters.query = event.target.value;
      renderInventory();
      const input = document.querySelector("[data-inventory-query]");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }
    if (event.target.matches("[data-order-query]")) {
      orderFilters.query = event.target.value;
      renderOrders();
      const input = document.querySelector("[data-order-query]");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }
    if (event.target.matches("#order-quantity") && workflow?.kind === "order") {
      workflow.quantity = event.target.value;
      if (workflow.errors?.quantity && Number.isInteger(Number(event.target.value)) && Number(event.target.value) >= 1) {
        workflow.errors = { ...workflow.errors, quantity: false };
        renderDialog();
        requestAnimationFrame(() => dialog.querySelector("#order-quantity")?.focus());
      }
    }
    if (event.target.matches("#arrival-date") && workflow?.kind === "order") {
      workflow.arrival = event.target.value;
      if (workflow.errors?.arrival && /^\d{4}-\d{2}-\d{2}$/.test(event.target.value) && event.target.value >= state.selectedDate) {
        workflow.errors = { ...workflow.errors, arrival: false };
        renderDialog();
        requestAnimationFrame(() => dialog.querySelector("#arrival-date")?.focus());
      }
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-store-selector]")) {
      state.selectedStore = event.target.value;
      saveState();
      renderRoute();
    }
    if (event.target.matches("[data-sales-date]")) {
      state.selectedDate = event.target.value;
      saveState();
      renderSales();
    }
    if (event.target.matches("[data-inventory-status]")) { inventoryFilters.status = event.target.value; renderInventory(); }
    if (event.target.matches("[data-inventory-category]")) { inventoryFilters.category = event.target.value; renderInventory(); }
    if (event.target.matches("[data-order-status]")) { orderFilters.status = event.target.value; renderOrders(); }
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  window.addEventListener("hashchange", renderRoute);

  if (!location.hash) location.hash = "dashboard";
  renderRoute();
})();
