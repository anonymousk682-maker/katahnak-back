// src/middlewares/visitor.js
const { randomUUID } = require('crypto');
const Visitor = require('../models/Visitor');
const DailyVisit = require('../models/DailyVisit');

const VISITOR_COOKIE_NAME = process.env.VISITOR_COOKIE_NAME || 'visitorId';

function todayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// ensure visitorId cookie exists and visitor doc updated
async function ensureVisitor(req, res, next) {
  try {
    let visitorId = req.cookies?.[VISITOR_COOKIE_NAME];
    if (!visitorId) {
      visitorId = randomUUID();
      // choose httpOnly: false so frontend can read it if needed; set true if you want server-only cookie
      res.cookie(VISITOR_COOKIE_NAME, visitorId, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
        sameSite: 'lax'
      });
      await Visitor.create({ visitorId });
    } else {
      await Visitor.findOneAndUpdate({ visitorId }, { lastSeenAt: new Date() }, { upsert: true });
    }
    req.visitorId = visitorId;
    next();
  } catch (err) {
    console.error('ensureVisitor error', err);
    next(err);
  }
}

// try to insert daily visit; returns true if unique (insert succeeded)
async function recordDailyVisitIfNew(visitorId, path = '/') {
  const date = todayString();
  try {
    await DailyVisit.create({ date, visitorId, path });
    return true;
  } catch (err) {
    // duplicate key or other -> not unique for today
    return false;
  }
}

module.exports = { ensureVisitor, recordDailyVisitIfNew, todayString };
