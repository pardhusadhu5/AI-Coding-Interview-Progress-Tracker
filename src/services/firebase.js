// Firebase integration & simulation layer
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Default configuration simulator
const STORAGE_PREFIX = 'codepilot_';

// Check if there is a custom firebase config saved in localStorage
export const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}firebase_config`);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export const saveFirebaseConfig = (config) => {
  if (config) {
    localStorage.setItem(`${STORAGE_PREFIX}firebase_config`, JSON.stringify(config));
  } else {
    localStorage.removeItem(`${STORAGE_PREFIX}firebase_config`);
  }
};

let app = null;
let auth = null;
let db = null;

// Initialize Firebase only if config is provided and valid
const config = getFirebaseConfig();
if (config && config.apiKey && config.authDomain && config.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Real Firebase initialized successfully.');
  } catch (e) {
    console.error('Error initializing real Firebase, falling back to mock:', e);
  }
}

// Check if we are running in simulated mode
export const isFirebaseSimulated = () => {
  return auth === null;
};

// Simulation Layer implementations
const mockAuth = {
  currentUser: null,
  listeners: [],
  onAuthStateChange(callback) {
    this.listeners.push(callback);
    // Trigger initial callback
    const storedUser = localStorage.getItem(`${STORAGE_PREFIX}current_user`);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  },
  async loginWithEmail(email, password) {
    // Basic simulator
    if (!email || !password) throw new Error('Email and password required');
    const mockUser = {
      uid: 'mock_uid_' + email.replace(/[^a-zA-Z0-9]/g, ''),
      email: email,
      displayName: email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      isAnonymous: false,
    };
    this.currentUser = mockUser;
    localStorage.setItem(`${STORAGE_PREFIX}current_user`, JSON.stringify(mockUser));
    this.listeners.forEach(l => l(mockUser));
    return { user: mockUser };
  },
  async registerWithEmail(email, password) {
    if (!email || !password) throw new Error('Email and password required');
    const mockUser = {
      uid: 'mock_uid_' + email.replace(/[^a-zA-Z0-9]/g, ''),
      email: email,
      displayName: email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      isAnonymous: false,
    };
    this.currentUser = mockUser;
    localStorage.setItem(`${STORAGE_PREFIX}current_user`, JSON.stringify(mockUser));
    this.listeners.forEach(l => l(mockUser));
    return { user: mockUser };
  },
  async loginWithGoogle() {
    const randomId = Math.random().toString(36).substring(2, 9);
    const mockUser = {
      uid: 'mock_google_uid_' + randomId,
      email: 'demo.developer@codepilot.ai',
      displayName: 'Demo Developer',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demodev',
      isAnonymous: false,
    };
    this.currentUser = mockUser;
    localStorage.setItem(`${STORAGE_PREFIX}current_user`, JSON.stringify(mockUser));
    this.listeners.forEach(l => l(mockUser));
    return { user: mockUser };
  },
  async logout() {
    this.currentUser = null;
    localStorage.removeItem(`${STORAGE_PREFIX}current_user`);
    this.listeners.forEach(l => l(null));
  }
};

// Database Mocking
const mockDb = {
  async saveDoc(collectionName, docId, data) {
    const key = `${STORAGE_PREFIX}db_${collectionName}_${docId}`;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  },
  async readDoc(collectionName, docId) {
    const key = `${STORAGE_PREFIX}db_${collectionName}_${docId}`;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
};

// Unified Export Wrapper
export const authService = {
  onAuthStateChanged(callback) {
    if (!isFirebaseSimulated()) {
      return auth.onAuthStateChanged(callback);
    }
    return mockAuth.onAuthStateChange(callback);
  },
  async signInWithEmail(email, password) {
    if (!isFirebaseSimulated()) {
      return signInWithEmailAndPassword(auth, email, password);
    }
    return mockAuth.loginWithEmail(email, password);
  },
  async signUpWithEmail(email, password) {
    if (!isFirebaseSimulated()) {
      return createUserWithEmailAndPassword(auth, email, password);
    }
    return mockAuth.registerWithEmail(email, password);
  },
  async signInWithGoogle() {
    if (!isFirebaseSimulated()) {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider);
    }
    return mockAuth.loginWithGoogle();
  },
  async logout() {
    if (!isFirebaseSimulated()) {
      return signOut(auth);
    }
    return mockAuth.logout();
  }
};

export const databaseService = {
  async setUserData(uid, data) {
    if (!isFirebaseSimulated()) {
      const docRef = doc(db, 'users', uid);
      return setDoc(docRef, data, { merge: true });
    }
    return mockDb.saveDoc('users', uid, data);
  },
  async getUserData(uid) {
    if (!isFirebaseSimulated()) {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    }
    return mockDb.readDoc('users', uid);
  }
};
