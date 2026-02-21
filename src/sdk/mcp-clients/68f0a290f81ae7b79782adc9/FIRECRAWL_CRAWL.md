# Firecrawl Crawl - MCP Tool Client

## Overview

This module provides a TypeScript client for the Firecrawl web crawling tool via MCP (Model Context Protocol). It allows you to crawl websites with extensive customization options including depth control, path filtering, content extraction formats, and more.

## Installation/Import

```typescript
import { request as requestFirecrawlCrawl } from '@/sdk/mcp-clients/68f0a290f81ae7b79782adc9/FIRECRAWL_CRAWL';
```

## Function Signature

```typescript
async function request(params: CrawlParams): Promise<CrawlData>
```

## Parameters

### Required Parameters

- **`url`** (string): The base URL to start crawling from. This is the initial entry point for the web crawler.

### Optional Crawl Configuration

- **`limit`** (number): Maximum number of pages to crawl. Default is 10.
- **`maxDepth`** (number | null): Maximum depth of subpages to crawl relative to the base URL.
- **`maxDiscoveryDepth`** (number | null): Maximum depth to crawl based on discovery order.
- **`crawlEntireDomain`** (boolean | null): If true, allows crawling internal links to sibling or parent URLs.
- **`allowExternalLinks`** (boolean | null): If true, allows following links to external websites.
- **`includePaths`** (string[] | null): Regex patterns for URL paths to include in the crawl.
- **`excludePaths`** (string[] | null): Regex patterns for URL paths to exclude from the crawl.
- **`ignoreQueryParameters`** (boolean | null): If true, ignore query parameters when determining if a URL has been visited.
- **`ignoreSitemap`** (boolean | null): If true, ignore any sitemap.xml found on the website.
- **`delay`** (number | null): Delay in milliseconds between requests.
- **`webhook`** (string | null): Webhook URL to receive real-time updates on the crawl job.

### Scrape Options

- **`scrapeOptions_formats`** (array): Output formats for scraped content. Options: `"markdown"`, `"html"`, `"rawHtml"`, `"links"`, `"screenshot"`, `"json"`. Default: `["markdown"]`.
- **`scrapeOptions_onlyMainContent`** (boolean): Extract only main content, excluding headers/footers. Default: true.
- **`scrapeOptions_includeTags`** (string[] | null): HTML tags to specifically include in output.
- **`scrapeOptions_excludeTags`** (string[] | null): HTML tags to exclude from output.
- **`scrapeOptions_headers`** (object | null): Custom HTTP headers to send with each request.
- **`scrapeOptions_waitFor`** (number): Milliseconds to wait for page JavaScript to execute. Default: 123ms.
- **`scrapeOptions_timeout`** (number | null): Timeout in milliseconds for each page request. Default: 30000ms.
- **`scrapeOptions_jsonOptions`** (JsonOptions | null): Options for JSON format extraction.
- **`scrapeOptions_actions`** (Action[] | null): List of actions to perform on each page before scraping.
- **`scrapeOptions_location`** (Location | null): Geolocation settings for the scraper.
- **`scrapeOptions_mobile`** (boolean | null): If true, emulate a mobile device.
- **`scrapeOptions_parsePDF`** (boolean | null): If true, attempt to parse PDF files.
- **`scrapeOptions_maxAge`** (number | null): Maximum age in seconds for cached content.
- **`scrapeOptions_blockAds`** (boolean | null): If true, block advertisements during scraping.

## Return Value

Returns a `Promise<CrawlData>` containing:

- **`success`** (boolean): Whether the API call was successful
- **`status`** (string): Current state of the crawl job ('scraping', 'completed', 'failed')
- **`successful`** (boolean): Whether the action execution was successful
- **`total`** (number): Total number of pages identified to crawl
- **`completed`** (number): Number of pages successfully crawled
- **`creditsUsed`** (number): API credits consumed by this crawl job
- **`expiresAt`** (string): ISO 8601 timestamp when results expire
- **`data`** (CrawledPage[]): Array of crawled page results, each containing:
  - `metadata`: Page metadata (URL, title, description, status code, etc.)
  - `markdown`: Page content in markdown format
  - `html`: Processed HTML content
  - `rawHtml`: Original unprocessed HTML
  - `links`: Array of URLs found on the page
  - `screenshot`: Base64-encoded screenshot
  - `extract`: Structured data extracted from the page
  - `actions`: Record of automated actions performed
- **`next`** (string | null): URL for retrieving next batch of results (if response exceeds 10MB)
- **`warning`** (string | null): Warning message for non-fatal issues
- **`error`** (string | null): Error message if any occurred

## Usage Examples

### Basic Crawl

```typescript
import { request as requestFirecrawlCrawl } from '@/sdk/mcp-clients/68f0a290f81ae7b79782adc9/FIRECRAWL_CRAWL';

async function crawlWebsite() {
  try {
    const result = await requestFirecrawlCrawl({
      url: 'https://example.com',
      limit: 5
    });
    
    console.log(`Crawled ${result.completed} of ${result.total} pages`);
    console.log(`Credits used: ${result.creditsUsed}`);
    
    result.data.forEach(page => {
      console.log(`Page: ${page.metadata.sourceURL}`);
      console.log(`Title: ${page.metadata.title}`);
      console.log(`Content: ${page.markdown?.substring(0, 200)}...`);
    });
  } catch (error) {
    console.error('Crawl failed:', error);
  }
}
```

### Advanced Crawl with Filtering

```typescript
import { request as requestFirecrawlCrawl } from '@/sdk/mcp-clients/68f0a290f81ae7b79782adc9/FIRECRAWL_CRAWL';

async function crawlWithFilters() {
  try {
    const result = await requestFirecrawlCrawl({
      url: 'https://example.com',
      limit: 20,
      maxDepth: 2,
      includePaths: ['blog/.*', 'articles/.*'],
      excludePaths: ['admin/.*', 'private/.*'],
      scrapeOptions_formats: ['markdown', 'html'],
      scrapeOptions_onlyMainContent: true,
      scrapeOptions_excludeTags: ['nav', 'footer', 'aside'],
      delay: 500
    });
    
    console.log(`Status: ${result.status}`);
    console.log(`Pages crawled: ${result.completed}/${result.total}`);
    
    // Process crawled pages
    for (const page of result.data) {
      if (page.metadata.statusCode === 200) {
        console.log(`✓ ${page.metadata.sourceURL}`);
        // Process page.markdown or page.html
      } else {
        console.log(`✗ ${page.metadata.sourceURL} (${page.metadata.statusCode})`);
      }
    }
  } catch (error) {
    console.error('Advanced crawl failed:', error);
  }
}
```

### Crawl with Actions and JSON Extraction

```typescript
import { request as requestFirecrawlCrawl } from '@/sdk/mcp-clients/68f0a290f81ae7b79782adc9/FIRECRAWL_CRAWL';

async function crawlWithActions() {
  try {
    const result = await requestFirecrawlCrawl({
      url: 'https://example.com',
      limit: 10,
      scrapeOptions_formats: ['json', 'markdown'],
      scrapeOptions_actions: [
        { type: 'wait', milliseconds: 2000 },
        { type: 'click', selector: '.load-more-button' },
        { type: 'wait', milliseconds: 1000 }
      ],
      scrapeOptions_jsonOptions: {
        json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            publishDate: { type: 'string' },
            content: { type: 'string' }
          }
        }
      }
    });
    
    result.data.forEach(page => {
      if (page.extract) {
        console.log('Extracted data:', page.extract);
      }
    });
  } catch (error) {
    console.error('Crawl with actions failed:', error);
  }
}
```

## Error Handling

The function may throw errors in the following cases:

1. **Missing Required Parameter**: If the `url` parameter is not provided
2. **Invalid MCP Response**: If the MCP response format is invalid
3. **JSON Parse Error**: If the response cannot be parsed as JSON
4. **Tool Execution Failure**: If the MCP tool reports an unsuccessful execution
5. **Missing Data**: If the tool returns success but no data

Always wrap calls in try-catch blocks:

```typescript
try {
  const result = await requestFirecrawlCrawl({ url: 'https://example.com' });
  // Process result
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
  // Handle error appropriately
}
```

## Notes

- The crawl operation may take time depending on the number of pages and configured delay
- Use webhooks for real-time updates on long-running crawls
- Be mindful of the `limit` parameter to control costs (credits)
- Results expire after the time specified in `expiresAt`
- Use `next` URL to retrieve additional results if response exceeds 10MB
- Respect robots.txt and website terms of service when crawling