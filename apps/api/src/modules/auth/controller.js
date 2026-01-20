import { requestOtp, verifyOtp } from "./service.js";

export async function requestOtpController(req, res, next) {
  try {
    const { email } = req.body; // şimdilik sadece email
    await requestOtp({ email, ip: req.ip });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtpController(req, res, next) {
  try {
    const { email, code } = req.body;
    await verifyOtp({ email, code, ip: req.ip });

    // B1-T1'de sadece "ok" dön; B1-T2'de burada JWT üretilecek
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}