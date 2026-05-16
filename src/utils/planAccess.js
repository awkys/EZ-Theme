const hasPlanIdentity = (data = {}) => {
  const planId = data.plan_id ?? data.planId ?? data.plan?.id;

  return planId !== null && planId !== undefined && planId !== "";
};

const getPlanData = (input = {}) => {
  if (input && typeof input === "object" && input.data) {
    return input.data;
  }

  return input || {};
};

export const isPlanExpiredAtValid = (expiredAt) => {
  if (
    expiredAt === null ||
    expiredAt === undefined ||
    expiredAt === "" ||
    Number(expiredAt) === 0
  ) {
    return true;
  }

  const timestamp = Number(expiredAt);

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const expiresAtMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000;

  return expiresAtMs > Date.now();
};

export const hasActivePlan = (input = {}) => {
  const data = getPlanData(input);

  return hasPlanIdentity(data) && isPlanExpiredAtValid(data.expired_at);
};
