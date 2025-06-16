
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
  rating?: number;
  reviews?: number;
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
        scrapedFromUrl: url,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        reviews: Math.floor(Math.random() * 500) + 50
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

  // Enhanced method with 20+ eco-friendly recycling products
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
        scrapedFromUrl: 'mock',
        rating: 4.8,
        reviews: 342
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
        scrapedFromUrl: 'mock',
        rating: 4.6,
        reviews: 128
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
        scrapedFromUrl: 'mock',
        rating: 4.9,
        reviews: 89
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
        scrapedFromUrl: 'mock',
        rating: 4.7,
        reviews: 234
      },
      {
        id: 'mock_5',
        name: 'Recycled Yoga Mat',
        priceINR: 1299,
        priceCoins: 12990,
        imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&h=300&fit=crop',
        category: 'Fitness',
        stock: 38,
        description: 'Non-slip yoga mat made from recycled rubber and plastic',
        scrapedFromUrl: 'mock',
        rating: 4.8,
        reviews: 156
      },
      {
        id: 'mock_6',
        name: 'Eco-Friendly Water Bottle',
        priceINR: 549,
        priceCoins: 5490,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
        category: 'Lifestyle',
        stock: 94,
        description: 'BPA-free water bottle made from recycled ocean plastic',
        scrapedFromUrl: 'mock',
        rating: 4.5,
        reviews: 267
      },
      {
        id: 'mock_7',
        name: 'Upcycled Laptop Sleeve',
        priceINR: 899,
        priceCoins: 8990,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
        category: 'Tech Accessories',
        stock: 56,
        description: 'Protective laptop sleeve made from upcycled textiles',
        scrapedFromUrl: 'mock',
        rating: 4.6,
        reviews: 203
      },
      {
        id: 'mock_8',
        name: 'Recycled Desk Organizer',
        priceINR: 649,
        priceCoins: 6490,
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        category: 'Office',
        stock: 71,
        description: 'Multi-compartment desk organizer from recycled cardboard',
        scrapedFromUrl: 'mock',
        rating: 4.4,
        reviews: 145
      },
      {
        id: 'mock_9',
        name: 'Ocean Plastic Sunglasses',
        priceINR: 1599,
        priceCoins: 15990,
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
        category: 'Fashion',
        stock: 29,
        description: 'Stylish sunglasses crafted from ocean waste plastic',
        scrapedFromUrl: 'mock',
        rating: 4.9,
        reviews: 78
      },
      {
        id: 'mock_10',
        name: 'Recycled Garden Tools Set',
        priceINR: 1899,
        priceCoins: 18990,
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        category: 'Home & Garden',
        stock: 45,
        description: 'Complete gardening set made from recycled materials',
        scrapedFromUrl: 'mock',
        rating: 4.7,
        reviews: 189
      },
      {
        id: 'mock_11',
        name: 'Eco-Friendly Backpack',
        priceINR: 2199,
        priceCoins: 21990,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        category: 'Lifestyle',
        stock: 33,
        description: 'Durable backpack made from recycled plastic bottles',
        scrapedFromUrl: 'mock',
        rating: 4.8,
        reviews: 234
      },
      {
        id: 'mock_12',
        name: 'Upcycled Picture Frames',
        priceINR: 399,
        priceCoins: 3990,
        imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        category: 'Home Decor',
        stock: 88,
        description: 'Beautiful picture frames made from reclaimed wood',
        scrapedFromUrl: 'mock',
        rating: 4.5,
        reviews: 167
      },
      {
        id: 'mock_13',
        name: 'Recycled Phone Stand',
        priceINR: 249,
        priceCoins: 2490,
        imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop',
        category: 'Tech Accessories',
        stock: 76,
        description: 'Adjustable phone stand from recycled aluminum',
        scrapedFromUrl: 'mock',
        rating: 4.3,
        reviews: 298
      },
      {
        id: 'mock_14',
        name: 'Ocean Plastic Wallet',
        priceINR: 799,
        priceCoins: 7990,
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop',
        category: 'Fashion',
        stock: 52,
        description: 'Slim wallet crafted from ocean plastic waste',
        scrapedFromUrl: 'mock',
        rating: 4.6,
        reviews: 143
      },
      {
        id: 'mock_15',
        name: 'Recycled Bluetooth Speaker',
        priceINR: 2499,
        priceCoins: 24990,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
        category: 'Electronics',
        stock: 19,
        description: 'Portable speaker with housing from recycled materials',
        scrapedFromUrl: 'mock',
        rating: 4.7,
        reviews: 87
      },
      {
        id: 'mock_16',
        name: 'Upcycled Tote Bag',
        priceINR: 699,
        priceCoins: 6990,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        category: 'Lifestyle',
        stock: 64,
        description: 'Stylish tote bag made from upcycled fabric scraps',
        scrapedFromUrl: 'mock',
        rating: 4.4,
        reviews: 176
      },
      {
        id: 'mock_17',
        name: 'Recycled LED Lamp',
        priceINR: 1299,
        priceCoins: 12990,
        imageUrl: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=300&fit=crop',
        category: 'Home Decor',
        stock: 41,
        description: 'Energy-efficient LED lamp with recycled plastic base',
        scrapedFromUrl: 'mock',
        rating: 4.8,
        reviews: 134
      },
      {
        id: 'mock_18',
        name: 'Ocean Plastic Keychain',
        priceINR: 149,
        priceCoins: 1490,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        category: 'Accessories',
        stock: 127,
        description: 'Colorful keychain made from ocean plastic debris',
        scrapedFromUrl: 'mock',
        rating: 4.2,
        reviews: 456
      },
      {
        id: 'mock_19',
        name: 'Recycled Notebook Set',
        priceINR: 499,
        priceCoins: 4990,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
        category: 'Stationery',
        stock: 83,
        description: 'Set of notebooks made from recycled paper and cardboard',
        scrapedFromUrl: 'mock',
        rating: 4.5,
        reviews: 289
      },
      {
        id: 'mock_20',
        name: 'Upcycled Mirror Frame',
        priceINR: 1599,
        priceCoins: 15990,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        category: 'Home Decor',
        stock: 27,
        description: 'Decorative mirror with frame from upcycled materials',
        scrapedFromUrl: 'mock',
        rating: 4.9,
        reviews: 98
      },
      {
        id: 'mock_21',
        name: 'Recycled Lunch Box',
        priceINR: 899,
        priceCoins: 8990,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        category: 'Kitchen',
        stock: 59,
        description: 'BPA-free lunch box made from recycled plastic',
        scrapedFromUrl: 'mock',
        rating: 4.6,
        reviews: 213
      },
      {
        id: 'mock_22',
        name: 'Ocean Plastic Pen Set',
        priceINR: 349,
        priceCoins: 3490,
        imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
        category: 'Stationery',
        stock: 92,
        description: 'Set of 5 pens made from ocean plastic waste',
        scrapedFromUrl: 'mock',
        rating: 4.3,
        reviews: 367
      }
    ];
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
}
