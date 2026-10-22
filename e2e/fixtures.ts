import { test as base, expect } from '@playwright/test';

const appStub = `
export function initializeApp() {
  return {};
}
`;

const firestoreStub = `
const MOVEMENTS_KEY = 'fake_movements';
const STOCK_KEY = 'fake_stock';

export function getFirestore() {
  return {};
}

export function collection() {
  return {};
}

export function doc() {
  return {};
}

export async function addDoc(_collection, data) {
  const list = JSON.parse(localStorage.getItem(MOVEMENTS_KEY) || '[]');
  list.push(data);
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(list));
  return { id: String(list.length) };
}

export async function getDocs() {
  const list = JSON.parse(localStorage.getItem(MOVEMENTS_KEY) || '[]');

  return {
    forEach(callback) {
      list.forEach(record => callback({ data: () => record, ref: {} }));
    },
  };
}

export async function setDoc(_ref, data) {
  localStorage.setItem(STOCK_KEY, JSON.stringify(data));
}

export async function getDoc() {
  const raw = localStorage.getItem(STOCK_KEY);

  if (!raw) return { exists: () => false };

  return {
    exists: () => true,
    data: () => JSON.parse(raw),
  };
}

export async function deleteDoc() {
  localStorage.removeItem(MOVEMENTS_KEY);
}
`;

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/firebase-app.js', route =>
      route.fulfill({ contentType: 'application/javascript', body: appStub })
    );

    await page.route('**/firebase-firestore.js', route =>
      route.fulfill({ contentType: 'application/javascript', body: firestoreStub })
    );

    await use(page);
  },
});

export { expect };
