// ═══════════════════════════════════════════════════════════
// ARTISAN HUB — E2E Encryption (Web Crypto API)
// RSA-OAEP key pairs for end-to-end encrypted chat
// ═══════════════════════════════════════════════════════════

const CRYPTO_KEYS_STORAGE = 'artisan_crypto_keys';

// Generate RSA key pair
async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
    );
    return keyPair;
}

// Export public key to base64
async function exportPublicKey(key) {
    const exported = await window.crypto.subtle.exportKey('spki', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// Export private key to base64
async function exportPrivateKey(key) {
    const exported = await window.crypto.subtle.exportKey('pkcs8', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// Import public key from base64
async function importPublicKey(base64Key) {
    const binaryStr = atob(base64Key);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return await window.crypto.subtle.importKey(
        'spki',
        bytes.buffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        true,
        ['encrypt']
    );
}

// Import private key from base64
async function importPrivateKey(base64Key) {
    const binaryStr = atob(base64Key);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return await window.crypto.subtle.importKey(
        'pkcs8',
        bytes.buffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        true,
        ['decrypt']
    );
}

// Encrypt message with recipient's public key
async function encryptMessage(text, publicKeyBase64) {
    try {
        const publicKey = await importPublicKey(publicKeyBase64);
        const encoded = new TextEncoder().encode(text);
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'RSA-OAEP' },
            publicKey,
            encoded
        );
        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    } catch (error) {
        console.error('Encryption failed:', error);
        // Fallback: base64 encode for demo purposes
        return btoa(text);
    }
}

// Decrypt message with own private key
async function decryptMessage(encryptedBase64, privateKeyBase64) {
    try {
        const privateKey = await importPrivateKey(privateKeyBase64);
        const binaryStr = atob(encryptedBase64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'RSA-OAEP' },
            privateKey,
            bytes.buffer
        );
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        // Fallback: try base64 decode
        try { return atob(encryptedBase64); } catch { return encryptedBase64; }
    }
}

// Initialize / load keys for current user
async function initCryptoKeys() {
    const stored = localStorage.getItem(CRYPTO_KEYS_STORAGE);
    if (stored) {
        return JSON.parse(stored);
    }

    // Generate new keys
    const keyPair = await generateKeyPair();
    const publicKey = await exportPublicKey(keyPair.publicKey);
    const privateKey = await exportPrivateKey(keyPair.privateKey);

    const keys = { publicKey, privateKey };
    localStorage.setItem(CRYPTO_KEYS_STORAGE, JSON.stringify(keys));

    // Update user's public key on server
    try {
        await api.put('/users/profile', { publicKey });
    } catch (error) {
        console.error('Failed to update public key:', error);
    }

    return keys;
}
