"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappWebhook = exports.moveCard = exports.sendWhatsappMediaMessage = exports.sendWhatsappMessage = void 0;
// src/index.ts
const admin = require("firebase-admin");
// This check prevents the app from being initialized multiple times,
// which is important in a modular structure.
if (admin.apps.length === 0) {
    admin.initializeApp();
}
// --- Export all functions from their new, organized locations ---
// Functions that can be called directly from the web application
var whatsapp_1 = require("./callable/whatsapp");
Object.defineProperty(exports, "sendWhatsappMessage", { enumerable: true, get: function () { return whatsapp_1.sendWhatsappMessage; } });
Object.defineProperty(exports, "sendWhatsappMediaMessage", { enumerable: true, get: function () { return whatsapp_1.sendWhatsappMediaMessage; } });
var cardActions_1 = require("./cardActions"); // Now included!
Object.defineProperty(exports, "moveCard", { enumerable: true, get: function () { return cardActions_1.moveCard; } });
// Functions that act as webhooks for external services
var whatsapp_2 = require("./webhooks/whatsapp");
Object.defineProperty(exports, "whatsappWebhook", { enumerable: true, get: function () { return whatsapp_2.whatsappWebhook; } });
//# sourceMappingURL=index.js.map