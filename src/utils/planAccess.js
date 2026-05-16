const hasPlanIdentity = (data = {}) => {
  const planId = data.plan_id ?? data.planId ?? data.plan?.id;

  return planId !== null && planId !== undefined && planId !== "";
};

const getPlanId = (data = {}) => data.plan_id ?? data.planId ?? data.plan?.id;

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

export const hasActivePlanFromSources = (...sources) => {
  const planSources = sources.map(getPlanData).filter(Boolean);
  const planId = planSources.reduce((selectedPlanId, data) => {
    const currentPlanId = getPlanId(data);

    return currentPlanId !== null &&
      currentPlanId !== undefined &&
      currentPlanId !== ""
      ? currentPlanId
      : selectedPlanId;
  }, undefined);
  const expirySource = [...planSources]
    .reverse()
    .find((data) => Object.prototype.hasOwnProperty.call(data, "expired_at"));

  return hasActivePlan({
    plan_id: planId,
    expired_at: expirySource ? expirySource.expired_at : undefined,
  });
};

export const fetchActivePlanStatus = async () => {
  try {
    const { getUserInfo, getSubscribe } = await import("@/api/dashboard");
    const [userInfoResult, subscribeResult] = await Promise.allSettled([
      getUserInfo(),
      getSubscribe(),
    ]);
    const userInfo =
      userInfoResult.status === "fulfilled" ? userInfoResult.value : null;
    const subscribe =
      subscribeResult.status === "fulfilled" ? subscribeResult.value : null;

    return hasActivePlanFromSources(userInfo, subscribe);
  } catch (error) {
    console.error("检查套餐状态失败:", error);

    return false;
  }
};
