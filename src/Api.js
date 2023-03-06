import { Base64 } from "js-base64";

export const DOMAIN = "http://22ae-213-226-205-142.eu.ngrok.io";
export const REGISTER = DOMAIN + "/api/rehab-app";
export const ANSWERS = DOMAIN + "/api/rehab-answer";
export const REHAB = (id) => DOMAIN + "/api/rehab-app/" + id + "/active-rehab";
export const VIDEO = DOMAIN + "/video/";
export const STEP = (id) => DOMAIN + "/api/rehab-step/" + id;

const USERNAME = "rehab_app";
const PASSWORD = "&X2U742QNGpA#_yr";

export const register = async (code, rehabCode, notifToken) => {
  const res = await fetch(REGISTER, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Base64.encode(USERNAME + ":" + PASSWORD),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
      rehabCode: rehabCode,
      notifToken: notifToken,
    }),
  })
    .catch((e) => null)
    .then((res) => (res ? res.json() : null));
  return res;
};

export const getRehab = async (appId) => {
  const res = await fetch(REHAB(appId), {
    method: "GET",
    headers: {
      Authorization: "Basic " + Base64.encode(USERNAME + ":" + PASSWORD),
      "Content-Type": "application/json",
    },
  })
    .catch((e) => null)
    .then((res) => (res ? res.json() : null));
  return res;
};

export const getAnswers = async () => {
  const res = await fetch(ANSWERS, {
    method: "GET",
    headers: {
      Authorization: "Basic " + Base64.encode(USERNAME + ":" + PASSWORD),
      "Content-Type": "application/json",
    },
  })
    .catch((e) => null)
    .then((res) => (res ? res.json() : null));
  return res;
};

export const updateStep = async (stepId, body) => {
  const res = await fetch(STEP(stepId), {
    method: "POST",
    headers: {
      Authorization: "Basic " + Base64.encode(USERNAME + ":" + PASSWORD),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .catch((e) => null)
    .then((res) => (res ? res.json() : null));
  return res;
};
