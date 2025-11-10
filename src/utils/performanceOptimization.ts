// 页面性能优化工具

// 图片懒加载优化
export function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// 预加载关键资源
export function preloadCriticalResources() {
  // 预加载关键字体
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/critical-font.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // 预加载关键图片
  const heroImage = new Image();
  heroImage.src = '/assets/hero-image.webp';
}

// 代码分割和动态导入
export async function loadComponent(componentName: string) {
  try {
    switch (componentName) {
      case 'reactflow':
        return await import('reactflow');
      default:
        throw new Error(`Component ${componentName} not found`);
    }
  } catch (error) {
    console.error(`Failed to load component: ${componentName}`, error);
  }
}

// 服务工作者缓存策略
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
}

// Core Web Vitals 监控
export function initWebVitals() {
  if (typeof window !== 'undefined') {
    // 动态导入web-vitals库
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(console.log);
      onINP(console.log); // INP replaces FID in web-vitals v4+
      onFCP(console.log);
      onLCP(console.log);
      onTTFB(console.log);
    });
  }
}