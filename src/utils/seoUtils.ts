// SEO工具函数
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  lastModified?: Date;
}

// 生成页面标题
export function generatePageTitle(pageTitle: string, siteTitle: string): string {
  if (pageTitle === siteTitle) return siteTitle;
  return `${pageTitle} | ${siteTitle}`;
}

// 生成描述meta标签
export function generateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3).trim() + "...";
}

// 生成关键词标签
export function generateKeywords(keywords: string[] = []): string {
  return keywords.join(", ");
}

// 生成结构化数据 - 网站导航
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem", 
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// 生成结构化数据 - 作品集
export function generateCreativeWorkStructuredData(work: {
  name: string;
  description: string;
  author: string;
  dateCreated: string;
  image: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": work.name,
    "description": work.description,
    "author": {
      "@type": "Person",
      "name": work.author
    },
    "dateCreated": work.dateCreated,
    "image": work.image,
    "url": work.url
  };
}

// 生成结构化数据 - 图片库
export function generateImageGalleryStructuredData(gallery: {
  name: string;
  description: string;
  images: Array<{url: string, caption: string}>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": gallery.name, 
    "description": gallery.description,
    "associatedMedia": gallery.images.map(img => ({
      "@type": "ImageObject",
      "contentUrl": img.url,
      "caption": img.caption
    }))
  };
}