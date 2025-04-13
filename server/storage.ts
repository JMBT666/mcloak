import { 
  users, 
  type User, 
  type InsertUser, 
  blacklistedIps, 
  type BlacklistedIp, 
  type InsertBlacklistedIp,
  visitorLogs,
  type VisitorLog,
  type InsertVisitorLog,
  blogPosts,
  type BlogPost,
  type InsertBlogPost
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blacklisted IP methods
  isIpBlacklisted(ipAddress: string): Promise<boolean>;
  blacklistIp(ip: InsertBlacklistedIp): Promise<BlacklistedIp>;
  
  // Visitor log methods
  logVisitor(visitorLog: InsertVisitorLog): Promise<VisitorLog>;
  
  // Blog posts methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  initBlogPosts(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blacklist: Map<string, BlacklistedIp>;
  private logs: Map<number, VisitorLog>;
  private posts: Map<number, BlogPost>;
  private userCurrentId: number;
  private blacklistCurrentId: number;
  private logsCurrentId: number;
  private postsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.blacklist = new Map();
    this.logs = new Map();
    this.posts = new Map();
    this.userCurrentId = 1;
    this.blacklistCurrentId = 1;
    this.logsCurrentId = 1;
    this.postsCurrentId = 1;
    
    // Initialize with blog posts data
    this.initBlogPosts();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async isIpBlacklisted(ipAddress: string): Promise<boolean> {
    return Array.from(this.blacklist.values()).some(
      (item) => item.ipAddress === ipAddress
    );
  }
  
  async blacklistIp(insertBlacklistedIp: InsertBlacklistedIp): Promise<BlacklistedIp> {
    const id = this.blacklistCurrentId++;
    const now = new Date();
    const blacklistedIp: BlacklistedIp = { 
      ...insertBlacklistedIp, 
      id, 
      createdAt: now 
    };
    this.blacklist.set(insertBlacklistedIp.ipAddress, blacklistedIp);
    return blacklistedIp;
  }
  
  async logVisitor(insertVisitorLog: InsertVisitorLog): Promise<VisitorLog> {
    const id = this.logsCurrentId++;
    const now = new Date();
    const log: VisitorLog = { 
      ...insertVisitorLog, 
      id, 
      timestamp: now 
    };
    this.logs.set(id, log);
    return log;
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.posts.values());
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.posts.get(id);
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.postsCurrentId++;
    const post: BlogPost = { ...insertBlogPost, id };
    this.posts.set(id, post);
    return post;
  }
  
  async initBlogPosts(): Promise<void> {
    // Initial blog posts data
    const initialPosts: InsertBlogPost[] = [
      {
        title: "Crypto in Focus: Get swept away by Avalanche! 🏔️",
        category: "Investing Strategy",
        date: "April 1, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669497869ac4e55ac62ff66_markets.png",
        url: "https://www.changeinvest.com/blog/crypto-in-focus-get-swept-away-by-avalanche"
      },
      {
        title: "Markets in Focus: Understanding Bid/Ask Price and Spread",
        category: "Investing Strategy",
        date: "March 26, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669497869ac4e55ac62ff66_markets.png",
        url: "https://www.changeinvest.com/blog/markets-in-focus-understanding-bid-ask-price-and-spread"
      },
      {
        title: "Markets in Focus: Understanding CFD Trading",
        category: "Investing Strategy",
        date: "March 12, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669497869ac4e55ac62ff66_markets.png",
        url: "https://www.changeinvest.com/blog/markets-in-focus-understanding-cfd-trading"
      },
      {
        title: "Crypto in Focus: Polygon in 2025 - DIP or RIP?",
        category: "Investing Strategy",
        date: "March 6, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669a6aa0ba0a6a4d904b91f_crypto.png",
        url: "https://www.changeinvest.com/blog/crypto-in-focus-polygon-in-2025-dip-or-rip"
      },
      {
        title: "Markets in Focus: Exploring the Forex Market",
        category: "Investing Strategy",
        date: "February 26, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669497869ac4e55ac62ff66_markets.png",
        url: "https://www.changeinvest.com/blog/markets-in-focus-exploring-the-forex-market"
      },
      {
        title: "Crypto in Focus: The Future of Crypto is Being Built on Sui 🛸",
        category: "Investing Strategy",
        date: "February 18, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669a6aa0ba0a6a4d904b91f_crypto.png",
        url: "https://www.changeinvest.com/blog/the-future-of-crypto-is-being-built-on-sui"
      },
      {
        title: "Markets in Focus: A Closer Look at Day Trading",
        category: "Investing Strategy",
        date: "February 13, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669497869ac4e55ac62ff66_markets.png",
        url: "https://www.changeinvest.com/blog/markets-in-focus-a-closer-look-at-day-trading"
      },
      {
        title: "Crypto in Focus: Polkadot 2.0 – The Rebirth of the Network 🟣",
        category: "Investing Strategy",
        date: "February 4, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/6669a6aa0ba0a6a4d904b91f_crypto.png",
        url: "https://www.changeinvest.com/blog/crypto-in-focus-polkadot-2-0-the-rebirth-of-the-network"
      },
      {
        title: "Best Bitcoin Trading Apps for Beginners (2025 Guide)",
        category: "CFD trading",
        date: "January 29, 2025",
        imageUrl: "https://cdn.prod.website-files.com/5e6ba7d72f23ac61d5042cf4/67ee817c27c6e515af94d27d_20caf8e3-79aa-4350-901b-8cd2dadb24c2.jpeg",
        url: "https://www.changeinvest.com/blog/bitcoin-trading-apps-for-beginners"
      }
    ];
    
    for (const post of initialPosts) {
      await this.createBlogPost(post);
    }
  }
}

export const storage = new MemStorage();
