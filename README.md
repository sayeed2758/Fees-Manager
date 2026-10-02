# MMT Fees Manager — Phase 3

Phase 3 builds on the working Phase 2 Firebase-connected app without changing the existing Students and Payments data model.

## Phase 3 focus
- Global month selector for Dashboard, Payments and Reports.
- Reports month selection with native Android/browser month picker.
- Monthly overview: total, collected, pending, collection rate.
- Report search by student/father/phone/class/batch.
- Class and Batch report filters.
- Pending-fee report filtered by selected month and filters.
- Fee Ledger showing every fee record in the selected scope.
- Collection breakdown by payment mode.
- Export filtered report as CSV.
- Print/A4 report window with summary and ledger.
- Receipt amount in words.
- Existing Firebase Auth, Students, Fees and Payment flows preserved.

## Firebase setup
This project continues to use the Firebase project configuration already added in `assets/firebase-config.js`.
Do not replace `assets/firebase-data.js`; it is the current Firestore data layer.

## Vercel
Push the project to the same GitHub repository. Vercel should redeploy automatically from the connected branch.

## Test checklist
1. Login.
2. Confirm existing student still appears.
3. Select another month from Dashboard or Reports.
4. Generate monthly fees for that month.
5. Open Reports and apply Class/Batch/Search filters.
6. Export CSV.
7. Print Report.
8. Return to Payments and verify the same selected month/records.
9. Confirm existing Mark Paid/Revert/Send Receipt behavior still works.
