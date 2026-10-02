import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, serverTimestamp, updateDoc, writeBatch, setDoc } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import { db } from './firebase.js';

const col = (uid, name) => collection(db, 'users', uid, name);
const ref = (uid, name, id) => doc(db, 'users', uid, name, id);
const byCreated = (a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0);

export function subscribeStudents(uid, onData, onError) {
  return onSnapshot(col(uid, 'students'), snap => onData(snap.docs.map(d => ({id:d.id,...d.data()})).sort(byCreated)), onError);
}
export function subscribeFees(uid, onData, onError) {
  return onSnapshot(col(uid, 'fees'), snap => onData(snap.docs.map(d => ({id:d.id,...d.data()})).sort(byCreated)), onError);
}
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
export async function upsertUserProfile(uid, profile) {
  await setDoc(doc(db, 'users', uid), { ...profile, updatedAt: serverTimestamp() }, { merge:true });
}

export function subscribeAttendance(uid, onData, onError) {
  return onSnapshot(col(uid, 'attendance'), snap => onData(snap.docs.map(d => ({id:d.id,...d.data()}))), onError);
}
export async function saveAttendance(uid, record) {
  const id = `${record.date}_${String(record.className||'').replace(/[^a-zA-Z0-9]+/g,'-')}_${String(record.batch||'all').replace(/[^a-zA-Z0-9]+/g,'-')}`;
  await setDoc(ref(uid,'attendance',id), { ...record, updatedAt: serverTimestamp() }, { merge:true });
  return id;
}
export function subscribeExpenses(uid, onData, onError) {
  return onSnapshot(col(uid, 'expenses'), snap => onData(snap.docs.map(d => ({id:d.id,...d.data()})).sort(byCreated)), onError);
}
export async function addExpense(uid, expense) {
  const r = await addDoc(col(uid,'expenses'), { ...expense, createdAt:serverTimestamp(), updatedAt:serverTimestamp() });
  return r.id;
}
export async function deleteExpense(uid, id) {
  await deleteDoc(ref(uid,'expenses',id));
}

export async function addStudent(uid, student) {
  const r = await addDoc(col(uid,'students'), { ...student, createdAt:serverTimestamp(), updatedAt:serverTimestamp() });
  return r.id;
}
export async function updateStudent(uid, id, student) {
  await updateDoc(ref(uid,'students',id), { ...student, updatedAt:serverTimestamp() });
}
export async function deleteStudent(uid, id) {
  const batch=writeBatch(db);
  batch.delete(ref(uid,'students',id));
  const fees=await getDocs(col(uid,'fees'));
  fees.docs.filter(d=>d.data().studentId===id).forEach(d=>batch.delete(d.ref));
  await batch.commit();
}
export async function createMissingMonthlyFees(uid, students, fees, month, options={}) {
  const existing=new Set(fees.filter(f=>f.month===month).map(f=>f.studentId));
  const batch=writeBatch(db); let created=0;
  const dueDay=Math.min(28,Math.max(1,Number(options?.dueDay||10)));
  const dueDate=`${month}-${String(dueDay).padStart(2,'0')}`;
  for(const s of students){
    if(existing.has(s.id)) continue;
    const feeRef=doc(col(uid,'fees'));
    batch.set(feeRef,{studentId:s.id,month,amount:Math.max(0,Number(s.fee||0)-Number(s.discount||0)),status:'Pending',dueDate,paymentDate:null,receiptNo:null,paymentMode:null,paymentNote:null,paidAmount:null,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
    created++;
  }
  if(created) await batch.commit();
  return created;
}
export async function updateFee(uid, id, patch) {
  await updateDoc(ref(uid,'fees',id), { ...patch, updatedAt:serverTimestamp() });
}
