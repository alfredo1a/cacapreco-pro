import { callMCPTool } from '@/sdk/core/mcp-client';

/**
 * MCP Response wrapper interface - MANDATORY
 * All MCP tools return responses in this wrapped format
 */
interface MCPToolResponse {
  content: Array<{
    type: "text";
    text: string; // JSON string containing actual tool data
  }>;
}

/**
 * Action to perform on a page before scraping
 */
export interface Action {
  /** Type of action to perform */
  type: "wait" | "click" | "write" | "press" | "scroll" | "screenshot";
  /** CSS selector for the element to interact with */
  selector?: string | null;
  /** Text to write (for 'write' action) */
  text?: string | null;
  /** Milliseconds to wait (for 'wait' action) */
  milliseconds?: number | null;
  /** Coordinate array [x, y] for click/scroll actions */
  coordinate?: number[] | null;
}

/**
 * Options for tracking changes between crawls
 */
export interface ChangeTrackingOptions {
  /** Tag for change tracking */
  tag?: string | null;
  /** Change tracking modes */
  modes?: string[] | null;
  /** Prompt for change tracking */
  prompt?: string | null;
  /** Schema for change tracking */
  data_schema?: Record<string, any> | null;
}

/**
 * Options for JSON format extraction including schema and prompts
 */
export interface JsonOptions {
  /** JSON schema for structured extraction */
  json_schema?: Record<string, any> | null;
  /** User prompt for JSON extraction */
  prompt?: string | null;
  /** System prompt for JSON extraction */
  systemPrompt?: string | null;
}

/**
 * Geolocation settings for the scraper
 */
export interface Location {
  /** Country code for geolocation */
  country?: string | null;
  /** Language preferences */
  languages?: string[] | null;
}

/**
 * Input parameters for initiating a Firecrawl web crawl
 */
export interface CrawlParams {
  /** The base URL to start crawling from. This is the initial entry point for the web crawler. */
  url: string;
  
  /** Maximum number of pages to crawl. The crawl will stop once this limit is reached. Default is 10. */
  limit?: number;
  
  /** Maximum depth of subpages to crawl relative to the base URL. A depth of 0 crawls only the base URL, 1 crawls the base URL and its direct links, etc. */
  maxDepth?: number | null;
  
  /** Maximum depth to crawl based on discovery order. The root site and sitemapped pages have a discovery depth of 0. For example, if you set it to 1 and set ignoreSitemap, you will only crawl the entered URL and all URLs that are linked on that page. */
  maxDiscoveryDepth?: number | null;
  
  /** DEPRECATED: Use 'crawlEntireDomain' instead. If true, allows the crawler to navigate to pages that were linked from pages already visited (i.e., navigate 'backwards'). */
  allowBackwardLinks?: boolean | null;
  
  /** If true, allows the crawler to follow links that lead to external websites (different domains). */
  allowExternalLinks?: boolean | null;
  
  /** If true, allows the crawler to follow internal links to sibling or parent URLs, not just child paths. This is the recommended replacement for 'allowBackwardLinks'. */
  crawlEntireDomain?: boolean | null;
  
  /** A list of Regular Expression (regex) patterns for URL paths to include in the crawl. Only URLs whose paths match one of these patterns will be processed. For example, `"products/featured/.*"` would only include paths under `/products/featured/`. */
  includePaths?: string[] | null;
  
  /** A list of Regular Expression (regex) patterns for URL paths to exclude from the crawl. URLs whose paths match any of these patterns will be ignored. For example, `"blog/archive/.*"` would exclude all paths under `/blog/archive/`. */
  excludePaths?: string[] | null;
  
  /** If true, ignore query parameters when determining if a URL has been visited */
  ignoreQueryParameters?: boolean | null;
  
  /** If true, the crawler will ignore any sitemap.xml found on the website. */
  ignoreSitemap?: boolean | null;
  
  /** Delay in milliseconds between requests to avoid overwhelming the server */
  delay?: number | null;
  
  /** An optional webhook URL to receive real-time updates on the crawl job. Events include crawl start (`crawl.started`), page crawled (`crawl.page`), and crawl completion (`crawl.completed` or `crawl.failed`). The payload structure matches the `/scrape` endpoint response. */
  webhook?: string | null;
  
  /** Specifies the desired output formats for the scraped content from each page. Default is `["markdown"]`. If format is json, jsonOptions is required. */
  scrapeOptions_formats?: Array<"markdown" | "html" | "rawHtml" | "links" | "screenshot" | "json">;
  
  /** If true, attempts to extract only the main content of each page, excluding common elements like headers, navigation bars, and footers. Default is true. */
  scrapeOptions_onlyMainContent?: boolean;
  
  /** A list of HTML tags to specifically include in the scraped output. Only content within these tags will be processed. If empty or null, all relevant content is considered based on other options. */
  scrapeOptions_includeTags?: string[] | null;
  
  /** A list of HTML tags to exclude from the scraped output. Content within these tags (and their children) will be removed before processing. */
  scrapeOptions_excludeTags?: string[] | null;
  
  /** Custom HTTP headers to send with each request */
  scrapeOptions_headers?: Record<string, string> | null;
  
  /** The duration in milliseconds to wait for page JavaScript to execute and content to load before scraping. Useful for pages with dynamically loaded content. Default is 123ms. */
  scrapeOptions_waitFor?: number;
  
  /** Timeout in milliseconds for each page request. Default is 30000ms (30 seconds) */
  scrapeOptions_timeout?: number | null;
  
  /** Options for JSON format extraction including schema and prompts */
  scrapeOptions_jsonOptions?: JsonOptions | null;
  
  /** List of actions to perform on each page before scraping (e.g., clicking buttons, waiting) */
  scrapeOptions_actions?: Action[] | null;
  
  /** Geolocation settings for the scraper */
  scrapeOptions_location?: Location | null;
  
  /** If true, emulate a mobile device when scraping */
  scrapeOptions_mobile?: boolean | null;
  
  /** If true, skip TLS certificate verification */
  scrapeOptions_skipTlsVerification?: boolean | null;
  
  /** If true, remove base64-encoded images from the scraped content */
  scrapeOptions_removeBase64Images?: boolean | null;
  
  /** If true, attempt to parse PDF files encountered during crawling */
  scrapeOptions_parsePDF?: boolean | null;
  
  /** Maximum age in seconds for cached content. If content is older than this, it will be re-scraped */
  scrapeOptions_maxAge?: number | null;
  
  /** If true, store scraped content in cache for future use */
  scrapeOptions_storeInCache?: boolean | null;
  
  /** If true, block advertisements during scraping */
  scrapeOptions_blockAds?: boolean | null;
  
  /** Proxy configuration for requests */
  scrapeOptions_proxy?: string | null;
  
  /** Options for tracking changes between crawls */
  scrapeOptions_changeTrackingOptions?: ChangeTrackingOptions | null;
}

/**
 * Page metadata container
 */
export interface PageMetadata {
  /** Original URL that was requested for crawling */
  sourceURL: string;
  
  /** HTTP status code returned when accessing the page */
  statusCode: number;
  
  /** Final URL after any redirects */
  url?: string | null;
  
  /** Page title from the title tag */
  title?: string | null;
  
  /** Meta description of the page */
  description?: string | null;
  
  /** Meta keywords from the page */
  keywords?: string | null;
  
  /** Detected language of the page content */
  language?: string | null;
  
  /** Array of alternative locale versions from Open Graph tags */
  ogLocaleAlternate?: string[] | null;
  
  /** Unique identifier for this specific scrape operation */
  scrapeId?: string | null;
  
  /** Error message if the page scrape failed */
  error?: string | null;
}

/**
 * Data from a single crawled page
 */
export interface CrawledPage {
  /** Page metadata container */
  metadata: PageMetadata;
  
  /** Page content converted to clean, LLM-ready markdown format */
  markdown?: string | null;
  
  /** Processed HTML content of the page */
  html?: string | null;
  
  /** Original unprocessed HTML content of the page */
  rawHtml?: string | null;
  
  /** Array of URLs found on the page */
  links?: string[] | null;
  
  /** Base64-encoded screenshot or URL of the rendered page */
  screenshot?: string | null;
  
  /** Structured data extracted from the page using LLM extraction */
  extract?: Record<string, any> | null;
  
  /** Record of automated actions performed on the page (click, scroll, write, wait, press, etc.) */
  actions?: Array<Record<string, any>> | null;
}

/**
 * Output data from a Firecrawl crawl operation
 */
export interface CrawlData {
  /** Indicates whether the API call was successful */
  success: boolean;
  
  /** Current state of the crawl job. Possible values: 'scraping', 'completed', 'failed' */
  status: string;
  
  /** Whether or not the action execution was successful or not */
  successful: boolean;
  
  /** Total number of pages identified to crawl */
  total: number;
  
  /** Number of pages successfully crawled */
  completed: number;
  
  /** API credits consumed by this crawl job */
  creditsUsed: number;
  
  /** ISO 8601 timestamp indicating when the crawl results will expire and be deleted */
  expiresAt: string;
  
  /** Array of crawled page results */
  data: CrawledPage[];
  
  /** URL for retrieving the next batch of results when response exceeds 10MB. Null when all data has been retrieved */
  next?: string | null;
  
  /** Warning message for issues like robots.txt limitations, low results, or other non-fatal problems. Null when no warnings */
  warning?: string | null;
  
  /** Error if any occurred during the execution of the action */
  error?: string | null;
}

/**
 * Internal response wrapper interface from outputSchema
 */
interface CrawlResponse {
  successful: boolean;
  data?: CrawlData;
  error?: string;
}

/**
 * Initiates a web crawl using Firecrawl, allowing customization of crawl depth, 
 * path inclusion/exclusion (regex), content extraction formats, and more, 
 * starting from a base URL.
 *
 * @param params - The crawl configuration parameters
 * @returns Promise resolving to the crawl results with page data
 * @throws Error if the url parameter is missing or if the crawl execution fails
 *
 * @example
 * const result = await request({ 
 *   url: 'https://example.com', 
 *   limit: 10,
 *   scrapeOptions_formats: ['markdown']
 * });
 */
export async function request(params: CrawlParams): Promise<CrawlData> {
  // Validate required parameters
  if (!params.url) {
    throw new Error('Missing required parameter: url');
  }
  
  // CRITICAL: Use MCPToolResponse and parse JSON response
  const mcpResponse = await callMCPTool<MCPToolResponse, CrawlParams>(
    '68f0a290f81ae7b79782adc9',
    'FIRECRAWL_CRAWL',
    params
  );
  
  if (!mcpResponse.content?.[0]?.text) {
    throw new Error('Invalid MCP response format: missing content[0].text');
  }
  
  let toolData: CrawlResponse;
  try {
    toolData = JSON.parse(mcpResponse.content[0].text);
  } catch (parseError) {
    throw new Error(
      `Failed to parse MCP response JSON: ${
        parseError instanceof Error ? parseError.message : 'Unknown error'
      }`
    );
  }
  
  if (!toolData.successful) {
    throw new Error(toolData.error || 'MCP tool execution failed');
  }
  
  if (!toolData.data) {
    throw new Error('MCP tool returned successful response but no data');
  }
  
  return toolData.data;
}