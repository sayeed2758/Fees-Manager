(() => {
  const STORAGE_KEY = 'mmt_fees_phase1';
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
    students: [], fees: [], selectedPage: 'home', counter: 1
  };
  const $ = id => document.getElementById(id);
  const money = n => '₹' + Number(n || 0).toLocaleString('en-IN');
  const monthKey = '2026-10';
  const monthLabel = 'Oct 2026';

  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function initials(name=''){ return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('') || 'S'; }
  function currentFees(){ return state.fees.filter(f=>f.month===monthKey); }
  function ensureFeeForStudent(student){
    let f = state.fees.find(x=>x.studentId===student.id && x.month===monthKey);
    if(!f){ f={id:'fee_'+Date.now()+'_'+Math.random().toString(16).slice(2),studentId:student.id,month:monthKey,amount:Math.max(0,(+student.fee||0)-(+student.discount||0)),status:'Pending',paymentDate:null,receiptNo:null}; state.fees.push(f); }
    return f;
  }

  function nav(page){
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    $('page-'+page)?.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.nav===page));
    document.querySelectorAll('.drawer-item[data-nav]').forEach(b=>b.classList.toggle('selected',b.dataset.nav===page));
    state.selectedPage=page; save(); $('profileMenu').classList.remove('show'); closeDrawer(); render(); window.scrollTo(0,0);
  }

  function openDrawer(){ $('overlay').classList.add('show'); $('drawer').classList.add('open'); }
  function closeDrawer(){ $('overlay').classList.remove('show'); $('drawer').classList.remove('open'); }

  function renderDashboard(){
    const students=state.students.length; const fees=currentFees();
    const total=fees.reduce((s,f)=>s+Number(f.amount||0),0); const paid=fees.filter(f=>f.status==='Paid').reduce((s,f)=>s+Number(f.amount||0),0); const pending=total-paid;
    $('dashStudents').textContent=students; $('dashCollected').textContent=money(paid); $('dashPending').textContent=money(pending); $('dashDue').textContent=money(0);
    const recent=state.students.slice(-3).reverse(); const box=$('recentStudents'); box.classList.toggle('empty',recent.length===0); box.innerHTML=recent.length?recent.map(s=>`<div style="padding:16px;border-bottom:1px solid #eee5ec;display:flex;align-items:center;gap:12px"><div class="student-avatar" style="width:44px;height:44px;font-size:16px">${initials(s.name)}</div><div><strong>${escapeHtml(s.name)}</strong><div style="color:#888;font-size:13px">${escapeHtml(s.className||'—')} • ${escapeHtml(s.batch||'—')}</div></div><div style="margin-left:auto;font-weight:800;color:#3438c8">${money(s.feeNet)}</div></div>`).join(''):'No recent students';
  }

  function renderStudents(){
    const q=($('studentSearch').value||'').toLowerCase().trim(); const list=state.students.filter(s=>[s.name,s.father,s.phone,s.className,s.batch].join(' ').toLowerCase().includes(q));
    $('studentsList').innerHTML=list.length?list.map(s=>`<article class="student-card"><div class="student-avatar">${initials(s.name)}</div><div><div class="student-name">${escapeHtml(s.name)}</div><div class="student-meta">${escapeHtml(s.father||'')} ${s.phone?`• ${escapeHtml(s.phone)}`:''}</div><div class="badges"><span class="badge">${escapeHtml(s.className||'Class —')}</span><span class="badge green">${escapeHtml(s.batch||'Batch —')}</span></div></div><div class="student-side"><div class="student-fee">${money(s.feeNet)}</div><div class="actions"><button class="action-btn wa" title="WhatsApp" onclick="window.mmtAction('wa','${s.id}')">◔</button><button class="action-btn call" title="Call" onclick="window.mmtAction('call','${s.id}')">☎</button><button class="action-btn edit" title="Edit" onclick="window.mmtAction('edit','${s.id}')">✎</button></div></div></article>`).join(''):`<div class="list-card empty">No students found</div>`;
  }

  function renderPayments(){
    const status=$('statusFilter').value, cls=$('classFilter').value, batch=$('batchFilter').value;
    const fees=currentFees(); const paid=fees.filter(f=>f.status==='Paid').length; const pending=fees.filter(f=>f.status!=='Paid').length;
    $('paidCountChip').textContent=`✓ ${paid} Paid`; $('pendingCountChip').textContent=`! ${pending} Pending`;
    let list=fees.map(f=>({f,s:state.students.find(s=>s.id===f.studentId)})).filter(x=>x.s);
    if(status!=='All') list=list.filter(x=>x.f.status===status); if(cls!=='All') list=list.filter(x=>x.s.className===cls); if(batch!=='All') list=list.filter(x=>x.s.batch===batch);
    $('paymentsList').innerHTML=list.length?list.map(({f,s})=>`<article class="payment-card ${f.status==='Paid'?'paid':''}"><div class="payment-top"><div class="payment-main"><div class="student-avatar" style="width:50px;height:50px;font-size:18px">${initials(s.name)}</div><div><div class="payment-name">${escapeHtml(s.name)}</div><div class="payment-date">📅 October 2026</div>${f.status==='Paid'?`<div class="payment-date">Paid on ${escapeHtml(f.paymentDate||'')}</div>`:''}</div></div><div style="text-align:right"><div class="payment-amount">${money(f.amount)}</div><span class="status-pill">${f.status.toUpperCase()}</span></div></div><div class="payment-actions">${f.status==='Paid'?`<button class="small-primary" onclick="window.mmtAction('receipt','${f.id}')">SEND RECEIPT</button><button class="outline-btn" onclick="window.mmtAction('revert','${f.id}')">REVERT</button>`:`<button class="small-primary" onclick="window.mmtAction('paid','${f.id}')">MARK PAID</button><button class="outline-btn" onclick="window.mmtAction('remind','${f.id}')">REMIND</button>`}</div></article>`).join(''):`<div class="list-card empty">No fee records</div>`;
  }

  function renderReports(){
    const fees=currentFees(), total=fees.reduce((s,f)=>s+Number(f.amount||0),0), paid=fees.filter(f=>f.status==='Paid').reduce((s,f)=>s+Number(f.amount||0),0), pending=total-paid, rate=total?Math.round(paid/total*100):0;
    $('reportTotal').textContent=money(total); $('reportCollected').textContent=money(paid); $('reportPending').textContent=money(pending); $('reportRate').textContent=rate+'%'; $('rateBar').style.width=rate+'%'; $('reportStudentCount').textContent=state.students.length; $('reportActiveCount').textContent=state.students.length; $('reportPendingCount').textContent=fees.filter(f=>f.status!=='Paid').length;
    const p=fees.filter(f=>f.status!=='Paid').map(f=>({f,s:state.students.find(s=>s.id===f.studentId)})).filter(x=>x.s);
    $('pendingReportList').innerHTML=p.length?p.map(({f,s})=>`<div style="padding:14px 0;border-top:1px solid #eee5ec;display:flex;align-items:center;gap:12px"><div class="student-avatar" style="width:44px;height:44px;font-size:15px">${initials(s.name)}</div><div><strong>${escapeHtml(s.name)}</strong><div class="student-meta">No due date</div></div><strong style="margin-left:auto;color:#c94b50">${money(f.amount)}</strong></div>`).join(''):'<div style="color:#898597">No pending fees</div>';
  }

  function renderFilters(){
    const classes=[...new Set(state.students.map(s=>s.className).filter(Boolean))]; const batches=[...new Set(state.students.map(s=>s.batch).filter(Boolean))];
    const cf=$('classFilter'), bf=$('batchFilter'); const cv=cf.value, bv=bf.value;
    cf.innerHTML='<option>All</option>'+classes.map(x=>`<option>${escapeHtml(x)}</option>`).join(''); bf.innerHTML='<option>All</option>'+batches.map(x=>`<option>${escapeHtml(x)}</option>`).join(''); if(classes.includes(cv)) cf.value=cv; if(batches.includes(bv)) bf.value=bv;
  }
  function render(){ $('currentMonthLabel').textContent=monthLabel; $('paymentMonthLabel').textContent=monthLabel; $('reportMonthLabel').textContent=monthLabel; $('reportMonthBtn').textContent=monthLabel+' ▾'; renderDashboard(); renderStudents(); renderFilters(); renderPayments(); renderReports(); }

  $('menuBtn').onclick=openDrawer; $('overlay').onclick=closeDrawer; $('profileBtn').onclick=()=> $('profileMenu').classList.toggle('show'); $('studentSearch').addEventListener('input',renderStudents); ['statusFilter','classFilter','batchFilter'].forEach(id=>$(id).addEventListener('change',renderPayments));
  document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>nav(el.dataset.nav)));
  $('addStudentBtn').onclick=()=>{$('studentModal').classList.add('show'); $('sDate').value=new Date().toISOString().slice(0,10)}; $('closeStudent').onclick=()=>$('studentModal').classList.remove('show');
  $('generateFeesBtn').onclick=()=>{ let made=0; state.students.forEach(s=>{const before=state.fees.length;ensureFeeForStudent(s); if(state.fees.length>before)made++}); save(); render(); alert(made?`${made} monthly fee record(s) generated.`:'All monthly fee records already exist.'); };
  $('subscribeBtn').onclick=()=>alert('Subscription module will be connected in Phase 3.'); $('monthBtn').onclick=()=>alert('Month selector will be expanded in the Reports/Fees phase.'); $('reportMonthBtn').onclick=()=>alert('Month selector will be expanded in the Reports/Fees phase.');
  $('studentForm').addEventListener('submit',e=>{e.preventDefault(); const fee=Number($('sFee').value||0), discount=Number($('sDiscount').value||0); const s={id:'st_'+Date.now(),name:$('sName').value.trim(),father:$('sFather').value.trim(),phone:$('sPhone').value.trim(),address:$('sAddress').value.trim(),className:$('sClass').value,batch:$('sBatch').value,subjects:[...$('sSubject').selectedOptions].map(o=>o.value),admissionDate:$('sDate').value,fee,discount,discountReason:$('sDiscountReason').value.trim(),feeNet:Math.max(0,fee-discount),createdAt:new Date().toISOString()}; state.students.push(s); ensureFeeForStudent(s); save(); $('studentModal').classList.remove('show'); e.target.reset(); $('sFee').value=1500; $('sDiscount').value=0; nav('students'); alert('Student saved successfully.'); });
  window.mmtAction=(type,id)=>{ if(type==='wa'){const s=state.students.find(x=>x.id===id); if(s?.phone) window.open('https://wa.me/91'+s.phone.replace(/\D/g,''),'_blank'); else alert('Phone number not available.'); return;} if(type==='call'){const s=state.students.find(x=>x.id===id); if(s?.phone) location.href='tel:'+s.phone; else alert('Phone number not available.'); return;} if(type==='edit'){alert('Edit screen will be enhanced in Phase 2.'); return;} const f=state.fees.find(x=>x.id===id); if(!f)return; if(type==='paid'){f.status='Paid';f.paymentDate=new Date().toISOString();f.receiptNo='000'+String(++state.counter).padStart(3,'0');save();render();return;} if(type==='revert'){if(confirm('Revert this payment to Pending?')){f.status='Pending';f.paymentDate=null;save();render();}return;} if(type==='remind'){const s=state.students.find(x=>x.id===f.studentId); if(s?.phone)window.open('https://wa.me/91'+s.phone.replace(/\D/g,'')+'?text='+encodeURIComponent(`Dear ${s.father||'Parent'},\n\nThis is a reminder regarding the coaching fee of ${s.name} for October 2026.\nPending Amount: ${money(f.amount)}\n\nThank you.\nEZEE VISION`),'_blank'); else alert('Phone number not available.'); return;} if(type==='receipt'){openReceipt(f.id);}};

  function openReceipt(id){ const f=state.fees.find(x=>x.id===id); const s=state.students.find(x=>x.id===f?.studentId); if(!f||!s)return; $('receiptDate').textContent=new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); $('receiptBody').innerHTML=`<div class="receipt-row"><span>Receipt No.</span><strong>#${escapeHtml(f.receiptNo||'000000')}</strong></div><div class="receipt-row"><span>Student Name</span><strong>${escapeHtml(s.name)}</strong></div><div class="receipt-row"><span>Father's Name</span><strong>${escapeHtml(s.father||'-')}</strong></div><div class="receipt-row"><span>Address</span><strong>${escapeHtml(s.address||'-')}</strong></div><div class="receipt-row"><span>Month / Period</span><strong>October 2026</strong></div><div class="receipt-row"><span>Payment Date</span><strong>${escapeHtml((f.paymentDate||'').slice(0,10)||'-')}</strong></div><div class="receipt-row"><span>Payment Mode</span><strong>Cash / Online</strong></div>`; $('receiptAmount').textContent=money(f.amount); $('receiptModal').classList.add('show'); $('receiptModal').onclick=e=>{if(e.target===$('receiptModal'))$('receiptModal').classList.remove('show')}; }

  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{ const a=btn.dataset.action; closeDrawer(); $('profileMenu').classList.remove('show'); if(['profile','logout','subscription','classes','batches','subjects','rate','about','privacy','terms'].includes(a)) alert(a==='logout'?'Logout will be connected to Firebase Auth in Phase 3.':`${a[0].toUpperCase()+a.slice(1)} module is planned for a later phase.`)}));
  nav(state.selectedPage||'home');
})();
