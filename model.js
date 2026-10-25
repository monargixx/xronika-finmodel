/* Финмодель «Хроники»: помесячный расчёт проекта зала прощания.
   Считаем две компании: «Хроника как сейчас» (агентство без помещения) и «Хроника после проекта».
   Разница между ними и есть деньги проекта: на неё смотрит инвестор. */

// Строки сметы и расходов собираются из параметров, чтобы площадь и ставки двигали всё сразу.
// Каждая строка: [id, название, сумма]. Любую сумму можно переопределить через p.over[id].
const VARIANTS = {
  brand: {
    name: 'Этап 0: только бренд, без помещения',
    short: 'Этап 0 · бренд',
    area: 0, checkHall: 90000, marginHall: 0.50, sessionsTarget: 0, ordersTarget: 25,
    capex: p => [
      ['b_site', 'Новый сайт и страницы под районы, кладбища, крематории', 350000],
      ['b_shoot', 'Съёмка команды, фото и видео для соцсетей', 250000],
      ['b_launch', 'Запуск соцсетей и первые вечера с партнёрами', 400000],
      ['b_crm', 'CRM, телефония, обучение координаторов', 200000]
    ],
    opex: p => [
      ['o_smm', 'SMM и монтаж контента', 120000],
      ['o_events', 'Вечера с партнёрами (1 в месяц, в доле с брендами)', 70000],
      ['o_seo', 'SEO и статьи', 40000],
      ['o_crm', 'CRM, телефония', 15000]
    ]
  },
  stage1: {
    name: 'Этап 1: зал прощания и комната для семьи, хранение у партнёров',
    short: 'Этап 1 · зал',
    area: 130, checkHall: 110000, marginHall: 0.52, sessionsTarget: 35, ordersTarget: 35,
    capex: p => [
      ['c_proj', 'Проект, согласования, юрист', 400000],
      ['c_repair', `Ремонт и инженерия (${p.area} м² × ${fmtInt(p.repairRate)} ₽)`, p.area * p.repairRate],
      ['c_hall', 'Зал прощания: мебель, постаменты, свет, звук, камера для онлайн-трансляции', 900000],
      ['c_family', 'Комната для семьи и образцы', 400000],
      ['c_rentfree', 'Аренда на время ремонта (2 мес.)', 2 * p.area * p.rentRate],
      ['c_deposit', 'Депозит по аренде (2 мес.)', 2 * p.area * p.rentRate],
      ['c_launch', 'Маркетинг запуска: бренд, сайт, съёмка, открытие', 600000]
    ],
    opex: p => [
      ['o_rent', `Аренда ${p.area} м² × ${fmtInt(p.rentRate)} ₽`, p.area * p.rentRate],
      ['o_util', 'Коммунальные, уборка', 45000],
      ['o_staff', 'Зарплаты: 2 администратора-координатора, SMM', 200000],
      ['o_tax', 'Взносы с зарплат (~25%)', 50000],
      ['o_brand', 'Бренд: соцсети, вечера, контент', 150000],
      ['o_it', 'Связь, CRM, банк, эквайринг', 25000],
      ['o_sec', 'Охрана, страхование', 15000],
      ['o_acc', 'Бухгалтерия и юрист (аутсорс)', 35000],
      ['o_other', 'Прочее', 40000]
    ]
  },
  full: {
    name: 'Похоронный дом: зал прощания и своё хранение',
    short: 'Похоронный дом',
    area: 220, checkHall: 125000, marginHall: 0.55, sessionsTarget: 40, ordersTarget: 35,
    capex: p => [
      ['c_proj', 'Проект, согласования, юрист, санитарная и пожарная экспертиза', 900000],
      ['c_repair', `Ремонт и инженерия: вентиляция, климат, сантехника, моющаяся отделка зоны хранения (${p.area} м² × ${fmtInt(p.repairRate)} ₽)`, p.area * p.repairRate],
      ['c_cold', 'Холодильная камера на 6 мест с регистрационным удостоверением', 1300000],
      ['c_prep', 'Оборудование зоны подготовки: стол, тележки, подъёмник, дезинфекция', 600000],
      ['c_hall', 'Зал прощания: мебель, постаменты, свет, звук, камера для онлайн-трансляции', 1100000],
      ['c_family', 'Комната для семьи и образцы (гробы, урны)', 500000],
      ['c_car', 'Специальный транспорт, б/у с переоборудованием', 3500000],
      ['c_rentfree', 'Аренда на время ремонта (3 мес.)', 3 * p.area * p.rentRate],
      ['c_deposit', 'Депозит по аренде (2 мес.)', 2 * p.area * p.rentRate],
      ['c_launch', 'Маркетинг запуска: бренд, сайт, съёмка, открытие', 800000]
    ],
    opex: p => [
      ['o_rent', `Аренда ${p.area} м² × ${fmtInt(p.rentRate)} ₽`, p.area * p.rentRate],
      ['o_util', 'Коммунальные, электричество холода 24/7, уборка, дезинфекция, вывоз отходов', 85000],
      ['o_staff', 'Зарплаты: 2 администратора-координатора, специалист по подготовке и подмена, водитель, SMM', 415000],
      ['o_tax', 'Взносы с зарплат (~25%)', 104000],
      ['o_brand', 'Бренд: соцсети, вечера, контент', 150000],
      ['o_car', 'Транспорт: топливо, страховка, ТО', 55000],
      ['o_it', 'Связь, CRM, банк, эквайринг', 30000],
      ['o_sec', 'Охрана, сигнализация, страхование имущества', 25000],
      ['o_acc', 'Бухгалтерия и юрист (аутсорс)', 40000],
      ['o_other', 'Прочее', 60000]
    ]
  }
};

const DEFAULTS = {
  variant: 'stage1',
  horizon: 60,
  startYear: 2027, startMonth: 1,
  prepMonths: 6,
  // «Хроника» сейчас: всё это нужно сверить с реальными цифрами Даниила
  ordersNow: 15, checkNow: 85000, marginNow: 0.50, cpa: 10000, fixedNow: 100000, sqGrowth: 0.05,
  // «Хроника» после проекта
  area: 130, rentRate: 1700, repairRate: 25000,
  ordersTarget: 35, rampMonths: 18,
  checkHall: 110000, marginHall: 0.52,
  sessionsTarget: 35, sessionPrice: 8000, sessionMargin: 0.85,
  capexMult: 1, opexMult: 1, contingency: 0.10,
  over: {},
  seasonality: true,
  taxRate: 0.15, minTax: 0.01,
  discount: 0.25, tvMultiple: 3, reserve: 0.15,
  // инвестор
  investment: 0, // 0 = подобрать под пиковую потребность в деньгах
  rsPct: 0.12, rsCap: 1.8,
  loanRate: 0.26, loanGrace: 18, loanTerm: 42,
  profitShare: 0.35
};

const REPAIR_RATE = { brand: 0, stage1: 25000, full: 32000 };

// Зимой в Петербурге уходит больше людей, летом меньше. Приблизительные индексы, в среднем 1.
const SEASON = [1.12, 1.06, 1.04, 1.00, 0.97, 0.93, 0.95, 0.94, 0.94, 0.99, 1.01, 1.05];

const SCENARIOS = {
  pess: { label: 'Осторожный', ordersMult: 0.72, rampMonths: 24, checkMult: 0.92, marginDelta: -0.04, sessionsMult: 0.4, capexMult: 1.2, prepMonths: 9 },
  base: { label: 'Базовый' },
  opt: { label: 'Смелый', ordersMult: 1.43, rampMonths: 14, checkMult: 1.06, marginDelta: 0.02, sessionsMult: 1.5, capexMult: 1, prepMonths: 5 }
};

function fmtInt(x) { return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function sum(a) { return a.reduce((s, x) => s + x, 0); }

function rows(p, kind) {
  return VARIANTS[p.variant][kind](p).map(([id, label, v]) => {
    const val = p.over && p.over[id] != null ? p.over[id] : v;
    return { id, label, base: v, value: val, edited: p.over && p.over[id] != null };
  });
}
function capexTotal(p) { return sum(rows(p, 'capex').map(r => r.value)) * p.capexMult * (1 + p.contingency); }
function opexTotal(p) { return sum(rows(p, 'opex').map(r => r.value)) * p.opexMult; }

function tax(p, revenue, ebitda) {
  return Math.max(p.taxRate * Math.max(ebitda, 0), p.minTax * revenue);
}

function irr(cfs) {
  // помесячная IRR бисекцией, возвращаем годовую
  const npv = r => cfs.reduce((s, c, i) => s + c / Math.pow(1 + r, i), 0);
  let lo = -0.99, hi = 1;
  if (npv(lo) * npv(hi) > 0) return null;
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid;
  }
  return Math.pow(1 + (lo + hi) / 2, 12) - 1;
}

function normalize(input) {
  const p = Object.assign({}, DEFAULTS, input);
  p.over = Object.assign({}, input && input.over);
  return p;
}

function run(input) {
  const p = normalize(input);
  const H = p.horizon, prep = p.prepMonths;
  const capex = capexTotal(p), opex = opexTotal(p);
  const months = [];
  let cum = 0, minCum = 0;
  const orderAtOpen = p.ordersNow * Math.pow(1 + p.sqGrowth, prep / 12);

  for (let m = 1; m <= H; m++) {
    const cal = (p.startMonth - 1 + m - 1) % 12;
    const s = p.seasonality ? SEASON[cal] : 1;
    const open = m > prep, t = m - prep;

    // Без проекта: агентство растёт само по себе на sqGrowth в год
    const plain = p.ordersNow * Math.pow(1 + p.sqGrowth, m / 12);
    const sqOrders = plain * s;
    const sqRev = sqOrders * p.checkNow;
    const sqEbitda = sqOrders * (p.checkNow * p.marginNow - p.cpa) - p.fixedNow;
    const sqNet = sqEbitda - tax(p, sqRev, sqEbitda);

    // С проектом
    let orders, check, margin, sessions = 0, fixed = p.fixedNow;
    if (!open) {
      orders = sqOrders; check = p.checkNow; margin = p.marginNow;
    } else {
      const k = Math.min(1, t / p.rampMonths);
      orders = Math.max(plain, orderAtOpen + (p.ordersTarget - orderAtOpen) * k) * s;
      check = p.checkHall; margin = p.marginHall;
      sessions = p.sessionsTarget * k;
      fixed += opex;
    }
    const rev = orders * check + sessions * p.sessionPrice;
    const ebitda = orders * (check * margin - p.cpa) + sessions * p.sessionPrice * p.sessionMargin - fixed;
    const net = ebitda - tax(p, rev, ebitda);
    const capexM = m <= prep ? capex / prep : 0;

    const inc = net - sqNet - capexM;
    cum += inc; minCum = Math.min(minCum, cum);
    months.push({ m, cal, open, orders, sessions, rev, ebitda, net, sqOrders, sqRev, sqNet,
      incRev: rev - sqRev, incOp: net - sqNet, capex: capexM, inc, cum });
  }

  const peak = -minCum;
  const investment = p.investment > 0 ? p.investment : Math.ceil(peak * (1 + p.reserve) / 500000) * 500000;
  const firstPos = months.find(x => x.open && x.incOp > 0);
  let payback = null;
  for (let i = prep; i < months.length; i++) {
    if (months[i].cum >= 0) { payback = months[i].m; break; }
  }
  const last12 = sum(months.slice(-12).map(x => x.incOp));
  const tv = Math.max(0, last12) * p.tvMultiple;
  const flows = months.map(x => x.inc);
  const flowsTV = flows.slice(); flowsTV[flowsTV.length - 1] += tv;
  const mr = Math.pow(1 + p.discount, 1 / 12) - 1;
  const npv = flowsTV.reduce((s, c, i) => s + c / Math.pow(1 + mr, i + 1), 0);
  const projIrr = irr([0].concat(flowsTV));

  const years = [];
  for (let y = 0; y < H / 12; y++) {
    const sl = months.slice(y * 12, y * 12 + 12);
    years.push({
      y: y + 1, year: p.startYear + y,
      orders: sum(sl.map(x => x.orders)), sessions: sum(sl.map(x => x.sessions)),
      rev: sum(sl.map(x => x.rev)), ebitda: sum(sl.map(x => x.ebitda)), net: sum(sl.map(x => x.net)),
      sqOrders: sum(sl.map(x => x.sqOrders)), sqRev: sum(sl.map(x => x.sqRev)), sqNet: sum(sl.map(x => x.sqNet)),
      incRev: sum(sl.map(x => x.incRev)), incOp: sum(sl.map(x => x.incOp)), capex: sum(sl.map(x => x.capex)),
      inc: sum(sl.map(x => x.inc)), cum: sl[sl.length - 1].cum
    });
  }

  // Сколько семей в месяц нужно, чтобы «Хроника» с проектом зарабатывала не меньше, чем без него
  const unitHall = p.checkHall * p.marginHall - p.cpa;
  const unitNow = p.checkNow * p.marginNow - p.cpa;
  const sessContr = p.sessionsTarget * p.sessionPrice * p.sessionMargin;
  const sqMature = p.ordersNow * Math.pow(1 + p.sqGrowth, (prep + p.rampMonths) / 12);
  const beOrders = (sqMature * unitNow + opex - sessContr) / unitHall;

  return { p, capex, opex, capexRows: rows(p, 'capex'), opexRows: rows(p, 'opex'), months, years, peak, investment,
    firstPos: firstPos ? firstPos.m : null, payback, npv, irr: projIrr, tv, last12,
    unitHall, unitNow, beOrders, sqMature, investor: investorCalc(p, months, investment, tv) };
}

function investorCalc(p, months, I, tv) {
  // 1. Процент от выручки проекта, пока партнёр не получит сумму × множитель
  const cap = I * p.rsCap; let paid = 0; let capMonth = null;
  const rsFlows = [-I]; let rsMinCash = Infinity, cash = I;
  for (const x of months) {
    let pay = 0;
    if (x.open && paid < cap) { pay = Math.min(cap - paid, Math.max(0, x.incRev) * p.rsPct); paid += pay; if (paid >= cap - 1 && !capMonth) capMonth = x.m; }
    rsFlows.push(pay);
    cash += x.inc - pay; rsMinCash = Math.min(rsMinCash, cash);
  }
  const rs = { paid, cap, capMonth, irr: irr(rsFlows), multiple: paid / I, minCash: rsMinCash };

  // 2. Заём: льготный период с капитализацией процентов, потом равные платежи
  const r = p.loanRate / 12;
  const bal = I * Math.pow(1 + r, p.loanGrace);
  const pmt = bal * r / (1 - Math.pow(1 + r, -p.loanTerm));
  const lFlows = [-I]; let lPaid = 0, cash2 = I, lMin = Infinity, dscrMin = Infinity;
  for (const x of months) {
    const on = x.m > p.loanGrace && x.m <= p.loanGrace + p.loanTerm;
    const pay = on ? pmt : 0;
    if (on) dscrMin = Math.min(dscrMin, x.incOp / pmt);
    lFlows.push(pay); lPaid += pay;
    cash2 += x.inc - pay; lMin = Math.min(lMin, cash2);
  }
  const loan = { pmt, paid: lPaid, irr: irr(lFlows), multiple: lPaid / I, minCash: lMin, dscrMin, endsMonth: p.loanGrace + p.loanTerm, fits: p.loanGrace + p.loanTerm <= months.length };

  // 3. Доля в прибыли проекта (ООО или договор простого товарищества)
  const psFlows = [-I]; let psPaid = 0;
  for (const x of months) { const pay = Math.max(0, x.incOp) * p.profitShare; psFlows.push(pay); psPaid += pay; }
  const psTV = tv * p.profitShare;
  const psFlowsTV = psFlows.slice(); psFlowsTV[psFlowsTV.length - 1] += psTV;
  const ps = { paid: psPaid, tv: psTV, irr: irr(psFlowsTV), multiple: (psPaid + psTV) / I, irrNoTV: irr(psFlows) };

  return { I, rs, loan, ps };
}

const DRIVERS = [
  ['ordersTarget', 'Семей в месяц после выхода на план'],
  ['checkHall', 'Средний чек после проекта'],
  ['marginHall', 'Маржа с заказа'],
  ['rentRate', 'Ставка аренды за м²'],
  ['opexMult', 'Остальные постоянные расходы'],
  ['capexMult', 'Вложения на запуск'],
  ['rampMonths', 'Месяцев до выхода на план'],
  ['sessionsTarget', 'Аренды зала другим агентствам'],
  ['cpa', 'Цена привлечения одной семьи']
];

function sensitivity(input) {
  const base = run(input).npv;
  const p = normalize(input);
  return { base, rows: DRIVERS.filter(([k]) => p[k] > 0).map(([k, label]) => {
    const lo = run(Object.assign({}, input, { [k]: p[k] * 0.8 })).npv;
    const hi = run(Object.assign({}, input, { [k]: p[k] * 1.2 })).npv;
    return { k, label, lo: lo - base, hi: hi - base };
  }).sort((a, b) => Math.max(Math.abs(b.lo), Math.abs(b.hi)) - Math.max(Math.abs(a.lo), Math.abs(a.hi))) };
}

// Сколько семей в месяц нужно, чтобы проект окупился к нужному месяцу
function ordersForPayback(input, month) {
  let lo = 1, hi = 200;
  const ok = o => { const r = run(Object.assign({}, input, { ordersTarget: o })); return r.payback != null && r.payback <= month; };
  if (!ok(hi)) return null;
  for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (ok(mid)) hi = mid; else lo = mid; }
  return Math.ceil(hi);
}

// Какой процент выручки отдавать партнёру, чтобы он вернул сумму × множитель к нужному месяцу
function rsPctNeeded(input, month) {
  const ok = pct => { const r = run(Object.assign({}, input, { rsPct: pct })); return r.investor.rs.capMonth != null && r.investor.rs.capMonth <= month; };
  if (!ok(0.6)) return null;
  let lo = 0.005, hi = 0.6;
  for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (ok(mid)) hi = mid; else lo = mid; }
  return hi;
}

// Какая доля прибыли проекта нужна партнёру, чтобы он получил нужную годовую доходность (с учётом стоимости бизнеса в конце)
function psShareNeeded(input, targetIrr) {
  const ok = sh => { const r = run(Object.assign({}, input, { profitShare: sh })); return r.investor.ps.irr != null && r.investor.ps.irr >= targetIrr; };
  if (!ok(1)) return null;
  let lo = 0.01, hi = 1;
  for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (ok(mid)) hi = mid; else lo = mid; }
  return hi;
}

function variantInput(variant) {
  const v = VARIANTS[variant];
  return { variant, area: v.area, repairRate: REPAIR_RATE[variant], checkHall: v.checkHall, marginHall: v.marginHall,
    sessionsTarget: v.sessionsTarget, ordersTarget: v.ordersTarget };
}

function scenarioInput(name, variant, extra) {
  const inp = variantInput(variant);
  const sc = SCENARIOS[name];
  if (sc.ordersMult) inp.ordersTarget = Math.round(inp.ordersTarget * sc.ordersMult);
  if (sc.rampMonths) inp.rampMonths = sc.rampMonths;
  if (sc.checkMult) inp.checkHall = Math.round(inp.checkHall * sc.checkMult / 1000) * 1000;
  if (sc.marginDelta) inp.marginHall = +(inp.marginHall + sc.marginDelta).toFixed(2);
  if (sc.sessionsMult) inp.sessionsTarget = Math.round(inp.sessionsTarget * sc.sessionsMult);
  if (sc.capexMult) inp.capexMult = sc.capexMult;
  if (sc.prepMonths) inp.prepMonths = variant === 'brand' ? Math.min(sc.prepMonths, 3) : sc.prepMonths;
  if (variant === 'brand' && !sc.prepMonths) inp.prepMonths = 2;
  return Object.assign(inp, extra || {});
}

if (typeof module !== 'undefined') module.exports = { VARIANTS, DEFAULTS, SEASON, SCENARIOS, DRIVERS, run, sensitivity, scenarioInput, variantInput, ordersForPayback, rsPctNeeded, psShareNeeded, capexTotal, opexTotal };
