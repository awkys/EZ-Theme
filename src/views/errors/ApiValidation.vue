<template>
  <div class="api-validation-page">
    <div class="validation-container">
      <!-- 加载动画 -->
      <div class="loading-animation">
        <div class="progress-ring">
          <svg viewBox="0 0 100 100">
            <circle class="progress-ring-bg" cx="50" cy="50" r="45" />
            <circle 
              class="progress-ring-circle" 
              cx="50" 
              cy="50" 
              r="45"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
            />
          </svg>
          <div class="progress-text">{{ progressPercent }}%</div>
        </div>
      </div>
      
      <!-- 状态信息 -->
      <div class="status-info">
        <h2 class="status-title">{{ $t('common.apiChecking') }}</h2>
        <p class="status-progress">
          {{ checkedCount }}/{{ totalApis }} {{ $t('common.completed') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { SITE_CONFIG } from '@/utils/baseConfig';
import { useTheme } from '@/composables/useTheme';

export default {
  name: 'ApiValidation',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const siteConfig = ref(SITE_CONFIG);
    const { theme } = useTheme();
    
    const isDarkTheme = computed(() => theme.value === 'dark');
    
    const isChecking = ref(true);
    const checkedCount = ref(0);
    const totalApis = ref(0);
    const availableApiUrl = ref(null);
    
    const circumference = 2 * Math.PI * 45;
    const dashOffset = computed(() => {
      if (totalApis.value === 0) return circumference;
      return circumference * (1 - checkedCount.value / totalApis.value);
    });
    
    const progressPercent = computed(() => {
      if (totalApis.value === 0) return 0;
      return Math.round((checkedCount.value / totalApis.value) * 100);
    });
    
    const redirectInfo = computed(() => {
      let path = route.query.redirect || '/';
      if (path.includes('?')) {
        path = path.split('?')[0];
      }
      
      const currentQuery = {...route.query};
      delete currentQuery.redirect;
      
      return {
        path,
        query: currentQuery
      };
    });
    
    const checkApiAvailability = async () => {
      if (typeof window === 'undefined' || !window.APP_CONFIG) {
        navigateToTarget();
        return;
      }
      
      if (window.APP_CONFIG.API_MIDDLEWARE_ENABLED === true) {
        navigateToTarget();
        return;
      }
      
      const apiConfig = window.APP_CONFIG.API_CONFIG;
      if (!apiConfig || apiConfig.urlMode !== 'static') {
        navigateToTarget();
        return;
      }
      
      const staticBaseUrls = apiConfig.staticBaseUrl;
      if (!Array.isArray(staticBaseUrls) || staticBaseUrls.length <= 1) {
        navigateToTarget();
        return;
      }
      
      const storedUrl = sessionStorage.getItem('app_api_available_url');
      if (storedUrl) {
        console.log('使用已验证的API URL');
        availableApiUrl.value = storedUrl;
        navigateToTarget();
        return;
      }
      
      totalApis.value = staticBaseUrls.length;
      console.log('开始检测API可用性...');
      
      for (const url of staticBaseUrls) {
        try {
          console.log(`检测API服务 ${checkedCount.value + 1}/${totalApis.value}`);
          const isAvailable = await testApiEndpoint(url);
          checkedCount.value++;
          
          if (isAvailable) {
            console.log('找到可用的API服务');
            sessionStorage.setItem('app_api_available_url', url);
            availableApiUrl.value = url;
            
            if (window.APP_CONFIG) {
              window.APP_CONFIG._AVAILABLE_API_URL = url;
            }
            
            checkedCount.value = totalApis.value;
            
            setTimeout(() => {
              navigateToTarget();
            }, 500);
            return;
          }
        } catch (error) {
          console.log(`API服务 ${checkedCount.value + 1}/${totalApis.value} 不可用`);
          checkedCount.value++;
        }
      }
      
      console.warn('没有找到可用的API服务，将使用默认服务');
      const defaultUrl = window.APP_CONFIG.API_CONFIG.staticBaseUrl[0];
      console.log('使用默认API服务');
      sessionStorage.setItem('app_api_available_url', defaultUrl);
      availableApiUrl.value = defaultUrl;
      
      checkedCount.value = totalApis.value;
      
      setTimeout(() => {
        navigateToTarget();
      }, 500);
    };
    
    const testApiEndpoint = async (baseUrl) => {
      try {
        const url = `${baseUrl}/guest/comm/config`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 
        
        const response = await fetch(url, { 
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          return false;
        }
        
        const data = await response.json();
        return data && (data.data !== undefined || data.message !== undefined);
      } catch (error) {
        console.log(`测试API服务失败`);
        return false;
      }
    };
    
    const navigateToTarget = () => {
      isChecking.value = false;
      
      try {
        let targetPath = redirectInfo.value.path;
        let targetQuery = {...redirectInfo.value.query};
        
        if (targetPath.includes('?')) {
          const [pathPart, queryPart] = targetPath.split('?');
          targetPath = pathPart;
          
          const searchParams = new URLSearchParams(queryPart);
          searchParams.forEach((value, key) => {
            targetQuery[key] = value;
          });
        }
        
        const originalQueryParams = sessionStorage.getItem('ez_original_query_params');
        if (originalQueryParams) {
          try {
            const parsedParams = JSON.parse(originalQueryParams);
            targetQuery = { ...targetQuery, ...parsedParams };
            sessionStorage.removeItem('ez_original_query_params');
          } catch (e) {
            console.error('解析存储的查询参数失败:', e);
          }
        }
        
        router.replace({
          path: targetPath,
          query: targetQuery
        });
      } catch (error) {
        console.error('导航跳转错误:', error);
        router.replace(redirectInfo.value.path);
      }
    };
    
    onMounted(() => {
      const originalQuery = { ...route.query };
      delete originalQuery.redirect;
      if (Object.keys(originalQuery).length > 0) {
        sessionStorage.setItem('ez_original_query_params', JSON.stringify(originalQuery));
      }
      
      checkApiAvailability();
    });
    
    return {
      siteConfig,
      isChecking,
      checkedCount,
      totalApis,
      availableApiUrl,
      circumference,
      dashOffset,
      progressPercent,
      isDarkTheme,
      redirectInfo
    };
  }
};
</script>

<style lang="scss" scoped>
.api-validation-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-color, #f8f9fc);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 30% 30%, rgba(var(--theme-color-rgb, 45, 85, 255), 0.05), transparent 30%),
                radial-gradient(circle at 70% 70%, rgba(var(--theme-color-rgb, 45, 85, 255), 0.03), transparent 40%);
    z-index: 0;
  }
}

.validation-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 320px;
  padding: 40px 20px;
  border-radius: 24px;
  background-color: rgba(30, 32, 35, 0.6);
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2),
              0 5px 15px rgba(0, 0, 0, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  
  .loading-animation {
    margin: 10px 0;
    
    .progress-ring {
      position: relative;
      width: 140px;
      height: 140px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        transform: rotate(-90deg);
        width: 100%;
        height: 100%;
      }
      
      .progress-ring-bg {
        fill: none;
        stroke: var(--border-color, rgba(0, 0, 0, 0.05));
        stroke-width: 4;
      }
      
      .progress-ring-circle {
        fill: none;
        stroke: var(--theme-color, #3d7eff);
        stroke-width: 4;
        stroke-linecap: round;
        transition: stroke-dashoffset 0.5s ease;
        filter: drop-shadow(0 0 6px rgba(var(--theme-color-rgb, 61, 126, 255), 0.4));
      }
      
      .progress-text {
        position: absolute;
        font-size: 32px;
        font-weight: 600;
        color: var(--text-color, #333333);
        text-shadow: 0 0 10px rgba(var(--theme-color-rgb, 61, 126, 255), 0.2);
      }
    }
  }
  
  .status-info {
    text-align: center;
    
    .status-title {
      font-size: 18px;
      font-weight: 500;
      color: var(--text-color, #333333);
      margin-bottom: 10px;
    }
    
    .status-progress {
      font-size: 16px;
      font-weight: 400;
      color: var(--secondary-text-color, #666666);
    }
  }
}


@media (max-width: 768px) {
  .validation-container {
    max-width: 85%;
    padding: 30px 20px;
  }
}


@media (prefers-color-scheme: light) {
  .api-validation-page {
    background-color: #f8f9fc;
    
    &::before {
      background: radial-gradient(circle at 30% 30%, rgba(45, 85, 255, 0.05), transparent 30%),
                  radial-gradient(circle at 70% 70%, rgba(45, 85, 255, 0.03), transparent 40%);
    }
  }
  
  .validation-container {
    background-color: var(--card-background, rgba(30, 32, 35, 0.6));
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2),
                0 5px 15px rgba(0, 0, 0, 0.1),
                inset 0 1px 1px rgba(255, 255, 255, 0.05);
    
    .progress-ring-bg {
      stroke: var(--border-color, rgba(255, 255, 255, 0.1));
    }
    
    .progress-text {
      color: var(--text-color, rgba(255, 255, 255, 0.95));
      text-shadow: 0 0 10px rgba(var(--theme-color-rgb, 61, 126, 255), 0.3);
    }
  }
}
</style> 
