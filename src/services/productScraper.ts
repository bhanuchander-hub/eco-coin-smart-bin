
// Product scraper service using CORS proxy for demonstration
// Note: In production, this should be done on backend for better security and performance

export interface ScrapedProduct {
  id: string;
  name: string;
  priceINR: number;
  priceCoins: number;
  imageUrl: string;
  category: string;
  stock: number;
  description: string;
  scrapedFromUrl: string;
}

// CORS proxy service (for demo purposes only)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export class ProductScraper {
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async scrapeProduct(url: string, category: string = 'General'): Promise<ScrapedProduct | null> {
    try {
      console.log(`Attempting to scrape: ${url}`);
      
      // Use CORS proxy to bypass CORS restrictions
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      
      // Create a DOM parser to extract product data
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Generic selectors - these would need to be customized for each website
      const productName = this.extractText(doc, [
        'h1.product-title',
        'h1[data-testid="product-title"]',
        '.product-name h1',
        'h1'
      ]) || 'Eco-Friendly Product';

      const priceText = this.extractText(doc, [
        '.product-price-value',
        '.price',
        '[data-testid="price"]',
        '.current-price'
      ]) || '0';

      const priceINR = this.parsePrice(priceText);
      const imageUrl = this.extractImageUrl(doc) || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop';
      
      const description = this.extractText(doc, [
        '.product-description',
        '.description',
        '.product-details'
      ]) || 'Made from recycled materials, contributing to a sustainable future.';

      const product: ScrapedProduct = {
        id: `scraped_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: productName,
        priceINR,
        priceCoins: Math.floor(priceINR * 10), // 1 INR = 10 coins
        imageUrl,
        category,
        stock: Math.floor(Math.random() * 100) + 20, // Random stock 20-120
        description,
        scrapedFromUrl: url
      };

      // Add delay to be respectful to the server
      await this.delay(2000);
      
      console.log(`Successfully scraped: ${productName}`);
      return product;

    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return null;
    }
  }

  private static extractText(doc: Document, selectors: string[]): string | null {
    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element && element.textContent) {
        return element.textContent.trim();
      }
    }
    return null;
  }

  private static extractImageUrl(doc: Document): string | null {
    const selectors = [
      '.product-main-image',
      '.product-image img',
      '[data-testid="product-image"]',
      '.hero-image img',
      'img[alt*="product"]'
    ];

    for (const selector of selectors) {
      const img = doc.querySelector(selector) as HTMLImageElement;
      if (img && img.src) {
        return img.src;
      }
    }
    return null;
  }

  private static parsePrice(priceText: string): number {
    const cleanPrice = priceText.replace(/[₹,\s]/g, '');
    const price = parseFloat(cleanPrice);
    return isNaN(price) ? Math.floor(Math.random() * 1000) + 100 : price;
  }

  // Demo method with sample eco-friendly product URLs
  static async scrapeSampleProducts(): Promise<ScrapedProduct[]> {
    const sampleUrls = [
      'https://www.example-eco-store.com/recycled-phone-case',
      'https://www.green-products.com/bamboo-toothbrush',
      'https://www.sustainable-goods.com/organic-cotton-bag'
    ];

    const products: ScrapedProduct[] = [];
    
    for (const url of sampleUrls) {
      const product = await this.scrapeProduct(url, 'Eco-Friendly');
      if (product) {
        products.push(product);
      }
    }

    return products;
  }

  // Fallback method with mock recycling products
  static getMockRecyclingProducts(): ScrapedProduct[] {
    return [
      {
        id: 'mock_1',
        name: 'Ocean Plastic Phone Case',
        priceINR: 299,
        priceCoins: 2990,
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
        category: 'Mobile Accessories',
        stock: 85,
        description: 'Durable phone case made from 100% ocean plastic waste',
        scrapedFromUrl: 'mock'
      },
      {
        id: 'mock_2',
        name: 'Recycled Storage Containers',
        priceINR: 450,
        priceCoins: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        category: 'Home & Garden',
        stock: 42,
        description: 'Stackable storage solution made from recycled materials',
        scrapedFromUrl: 'mock'
      },
      {
        id: 'mock_3',
        name: 'Upcycled Jewelry Set',
        priceINR: 699,
        priceCoins: 6990,
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
        category: 'Fashion',
        stock: 23,
        description: 'Beautiful jewelry crafted from upcycled electronic components',
        scrapedFromUrl: 'mock'
      },
      {
        id: 'mock_4',
        name: 'Smart Eco Planter',
        priceINR: 799,
        priceCoins: 7990,
        imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop',
        category: 'Smart Home',
        stock: 67,
        description: 'Self-watering planter made from recycled plastic bottles',
        scrapedFromUrl: 'mock'
      }
    ];
  }
}
