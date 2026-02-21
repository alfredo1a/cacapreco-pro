import { request as firecrawlSearch, type FirecrawlSearchData } from '@/sdk/mcp-clients/68f0a290f81ae7b79782adc9/FIRECRAWL_SEARCH';

export interface LiveSearchResult {
	id: string;
	productName: string;
	brand: string;
	price: number;
	originalPrice?: number;
	url: string;
	storeName: string;
	storeType: 'marketplace' | 'retailer';
	imageUrl?: string;
	rating?: number;
	reviewCount?: number;
	shipping?: {
		cost: number;
		time: string;
		free: boolean;
	};
	inStock: boolean;
	source: 'live' | 'cached';
}

export interface LiveSearchOptions {
	query: string;
	maxResults?: number;
	sources?: Array<'mercadolivre' | 'amazon' | 'magazineluiza' | 'americanas' | 'all'>;
}

/**
 * Extrai preço de strings brasileiras (R$ 1.234,56)
 */
function extractPrice(text: string): number | null {
	// Match patterns like: R$ 1.234,56 or R$1234,56 or 1.234,56
	const pricePattern = /R\$?\s?([\d.]+),(\d{2})/;
	const match = text.match(pricePattern);

	if (match) {
		const integerPart = match[1].replace(/\./g, ''); // Remove thousand separators
		const decimalPart = match[2];
		return parseFloat(`${integerPart}.${decimalPart}`);
	}

	return null;
}

/**
 * Extrai rating de texto (ex: "4.5 de 5 estrelas")
 */
function extractRating(text: string): number | null {
	const ratingPattern = /(\d+[.,]\d+)\s*(de\s*5|estrelas|stars)/i;
	const match = text.match(ratingPattern);

	if (match) {
		return parseFloat(match[1].replace(',', '.'));
	}

	return null;
}

/**
 * Parseia resultados do Mercado Livre
 */
function parseMercadoLivreResult(result: any, index: number): LiveSearchResult | null {
	const { title, description, url, markdown } = result;

	// Extrair preço do markdown ou description
	const priceText = markdown || description || title;
	const price = extractPrice(priceText);

	if (!price) return null;

	// Tentar extrair rating
	const rating = extractRating(priceText);

	return {
		id: `ml-${Date.now()}-${index}`,
		productName: title || 'Produto sem título',
		brand: 'Diversas Marcas',
		price,
		url,
		storeName: 'Mercado Livre',
		storeType: 'marketplace',
		rating: rating || undefined,
		inStock: true,
		source: 'live',
	};
}

/**
 * Parseia resultados da Amazon
 */
function parseAmazonResult(result: any, index: number): LiveSearchResult | null {
	const { title, description, url, markdown } = result;

	const priceText = markdown || description || title;
	const price = extractPrice(priceText);

	if (!price) return null;

	const rating = extractRating(priceText);

	return {
		id: `amz-${Date.now()}-${index}`,
		productName: title || 'Produto sem título',
		brand: 'Diversas Marcas',
		price,
		url,
		storeName: 'Amazon',
		storeType: 'marketplace',
		rating: rating || undefined,
		inStock: true,
		source: 'live',
	};
}

/**
 * Parseia resultados do Magazine Luiza
 */
function parseMagazineLuizaResult(result: any, index: number): LiveSearchResult | null {
	const { title, description, url, markdown } = result;

	const priceText = markdown || description || title;
	const price = extractPrice(priceText);

	if (!price) return null;

	const rating = extractRating(priceText);

	return {
		id: `magalu-${Date.now()}-${index}`,
		productName: title || 'Produto sem título',
		brand: 'Diversas Marcas',
		price,
		url,
		storeName: 'Magazine Luiza',
		storeType: 'marketplace',
		rating: rating || undefined,
		inStock: true,
		source: 'live',
	};
}

/**
 * Parseia resultados das Americanas
 */
function parseAmericanasResult(result: any, index: number): LiveSearchResult | null {
	const { title, description, url, markdown } = result;

	const priceText = markdown || description || title;
	const price = extractPrice(priceText);

	if (!price) return null;

	const rating = extractRating(priceText);

	return {
		id: `ame-${Date.now()}-${index}`,
		productName: title || 'Produto sem título',
		brand: 'Diversas Marcas',
		price,
		url,
		storeName: 'Americanas',
		storeType: 'marketplace',
		rating: rating || undefined,
		inStock: true,
		source: 'live',
	};
}

/**
 * Parseia resultado genérico de qualquer marketplace
 */
function parseGenericResult(result: any, index: number, sourceName?: string): LiveSearchResult | null {
	const { title, description, url, markdown } = result;

	// Extrair preço do markdown ou description
	const priceText = markdown || description || title;
	const price = extractPrice(priceText);

	// Se não encontrar preço, ainda retorna o resultado mas com preço 0 para não perder informação
	const rating = extractRating(priceText);

	// Detectar marketplace pela URL
	let storeName = sourceName || 'Loja Online';
	let storeType: 'marketplace' | 'retailer' = 'marketplace';

	if (url) {
		if (url.includes('mercadolivre') || url.includes('mercadolibre')) {
			storeName = 'Mercado Livre';
		} else if (url.includes('amazon')) {
			storeName = 'Amazon';
		} else if (url.includes('magazineluiza') || url.includes('magalu')) {
			storeName = 'Magazine Luiza';
		} else if (url.includes('americanas')) {
			storeName = 'Americanas';
		} else if (url.includes('extra')) {
			storeName = 'Extra';
		} else if (url.includes('casasbahia')) {
			storeName = 'Casas Bahia';
		} else if (url.includes('pontofrio')) {
			storeName = 'Ponto Frio';
		} else if (url.includes('submarino')) {
			storeName = 'Submarino';
		} else if (url.includes('shopee')) {
			storeName = 'Shopee';
		} else if (url.includes('carrefour')) {
			storeName = 'Carrefour';
			storeType = 'retailer';
		}
	}

	return {
		id: `generic-${Date.now()}-${index}`,
		productName: title || 'Produto',
		brand: 'Diversas Marcas',
		price: price || 0,
		url,
		storeName,
		storeType,
		rating: rating || undefined,
		inStock: true,
		source: 'live',
	};
}

/**
 * Busca ao vivo em um marketplace específico
 */
async function searchMarketplace(
	marketplace: string,
	query: string,
	limit: number = 5
): Promise<LiveSearchResult[]> {
	try {
		// Múltiplas estratégias de busca para aumentar chances de sucesso
		const searchStrategies = [
			`${query} preço Brasil site:${marketplace}`,
			`${query} ${marketplace} Brasil preço`,
			`${query} comprar ${marketplace}`,
			`${query} ${marketplace.split('.')[0]}`, // Ex: mercadolivre.com.br -> mercadolivre
		];

		for (const searchQuery of searchStrategies) {
			console.log(`Searching ${marketplace} with strategy: ${searchQuery}`);

			try {
				const searchResults = await firecrawlSearch({
					q: searchQuery,
					country: 'br',
					lang: 'pt',
					limit,
					formats: ['markdown'],
					timeout: 30000,
				});

				console.log(`${marketplace} results for "${searchQuery}":`, searchResults);

				if (searchResults.web && searchResults.web.length > 0) {
					// Parsear resultados baseado no marketplace
					const results: LiveSearchResult[] = [];

					for (let i = 0; i < searchResults.web.length; i++) {
						const webResult = searchResults.web[i];
						let parsed: LiveSearchResult | null = null;

						// Tenta parser específico primeiro
						if (marketplace.includes('mercadolivre')) {
							parsed = parseMercadoLivreResult(webResult, i);
						} else if (marketplace.includes('amazon')) {
							parsed = parseAmazonResult(webResult, i);
						} else if (marketplace.includes('magazineluiza')) {
							parsed = parseMagazineLuizaResult(webResult, i);
						} else if (marketplace.includes('americanas')) {
							parsed = parseAmericanasResult(webResult, i);
						}

						// Se parser específico não funcionou, usa genérico
						if (!parsed) {
							parsed = parseGenericResult(webResult, i);
						}

						if (parsed) {
							console.log(`Parsed result from ${marketplace}:`, parsed);
							results.push(parsed);
						}
					}

					if (results.length > 0) {
						console.log(`${marketplace} returned ${results.length} valid results with strategy: ${searchQuery}`);
						return results;
					}
				}
			} catch (strategyError) {
				console.warn(`Strategy "${searchQuery}" failed for ${marketplace}:`, strategyError);
				// Continua para próxima estratégia
			}
		}

		console.warn(`All search strategies failed for ${marketplace}`);
		return [];
	} catch (error) {
		console.error(`Error searching ${marketplace}:`, error);
		// Não propaga erro para permitir que outros marketplaces continuem
		return [];
	}
}

/**
 * Busca genérica sem restrição de marketplace (fallback)
 */
async function searchGeneric(query: string, limit: number = 10): Promise<LiveSearchResult[]> {
	try {
		console.log(`Generic search for: ${query}`);

		// Tentar várias estratégias de busca
		const searchStrategies = [
			`${query} Brasil preço comprar online`,
			`${query} comprar Brasil`,
			`${query} preço loja online`,
			`${query} marketplace Brasil`,
		];

		for (const searchQuery of searchStrategies) {
			console.log(`Trying generic search strategy: ${searchQuery}`);

			const searchResults = await firecrawlSearch({
				q: searchQuery,
				country: 'br',
				lang: 'pt',
				limit,
				formats: ['markdown'],
				timeout: 30000,
			});

			console.log(`Generic search results for "${searchQuery}":`, searchResults);

			if (searchResults.web && searchResults.web.length > 0) {
				const results: LiveSearchResult[] = [];

				for (let i = 0; i < searchResults.web.length; i++) {
					const webResult = searchResults.web[i];
					const parsed = parseGenericResult(webResult, i);

					if (parsed) {
						console.log('Parsed generic result:', parsed);
						results.push(parsed);
					}
				}

				if (results.length > 0) {
					console.log(`Found ${results.length} results with strategy: ${searchQuery}`);
					return results;
				}
			}
		}

		console.warn('All generic search strategies returned 0 results');
		return [];
	} catch (error) {
		console.error('Error in generic search:', error);
		return [];
	}
}

/**
 * Busca ao vivo em múltiplos marketplaces brasileiros
 */
export async function searchLive(options: LiveSearchOptions): Promise<LiveSearchResult[]> {
	const { query, maxResults = 10, sources = ['all'] } = options;

	if (!query || query.trim().length === 0) {
		throw new Error('Por favor, digite um termo de busca');
	}

	console.log('=== INICIANDO BUSCA AO VIVO ===');
	console.log('Query:', query);
	console.log('Max results:', maxResults);
	console.log('Sources:', sources);

	let combinedResults: LiveSearchResult[] = [];

	// ESTRATÉGIA 1: Busca ultra-simples primeiro (mais rápido e confiável)
	console.log('🔍 ESTRATÉGIA 1: Busca simples e direta');
	try {
		const simpleSearch = await firecrawlSearch({
			q: `${query} comprar Brasil`,
			country: 'br',
			lang: 'pt',
			limit: maxResults,
			formats: ['markdown'],
			timeout: 30000,
		});

		console.log('Resultados da busca simples:', simpleSearch);

		if (simpleSearch.web && simpleSearch.web.length > 0) {
			for (let i = 0; i < simpleSearch.web.length; i++) {
				const parsed = parseGenericResult(simpleSearch.web[i], i);
				if (parsed) {
					combinedResults.push(parsed);
					console.log(`✅ Produto encontrado: ${parsed.productName} - R$ ${parsed.price}`);
				}
			}
		}

		if (combinedResults.length > 0) {
			console.log(`✅ Busca simples retornou ${combinedResults.length} resultados!`);
		}
	} catch (simpleError) {
		console.error('❌ Erro na busca simples:', simpleError);
	}

	// ESTRATÉGIA 2: Se busca simples não funcionou, tenta marketplaces específicos
	if (combinedResults.length === 0) {
		console.log('🔍 ESTRATÉGIA 2: Buscando em marketplaces específicos');

		const marketplaces: Record<string, string> = {
			mercadolivre: 'mercadolivre.com.br',
			amazon: 'amazon.com.br',
			magazineluiza: 'magazineluiza.com.br',
			americanas: 'americanas.com.br',
		};

		let selectedMarketplaces: string[] = [];

		if (sources.includes('all')) {
			selectedMarketplaces = Object.values(marketplaces);
		} else {
			selectedMarketplaces = sources.map(s => marketplaces[s]).filter(Boolean);
		}

		if (selectedMarketplaces.length > 0) {
			const resultsPerMarketplace = Math.ceil(maxResults / selectedMarketplaces.length);

			const searchPromises = selectedMarketplaces.map(marketplace =>
				searchMarketplace(marketplace, query, resultsPerMarketplace).catch(error => {
					console.error(`Failed to search ${marketplace}:`, error);
					return [];
				})
			);

			const allResults = await Promise.all(searchPromises);
			combinedResults = allResults.flat();

			console.log(`Marketplaces retornaram ${combinedResults.length} resultados`);
		}
	}

	// ESTRATÉGIA 3: Busca genérica com variações
	if (combinedResults.length === 0) {
		console.log('🔍 ESTRATÉGIA 3: Busca genérica com variações');
		const genericResults = await searchGeneric(query, maxResults * 2);
		combinedResults = genericResults;
		console.log(`Busca genérica retornou ${combinedResults.length} resultados`);
	}

	// ESTRATÉGIA 4: Busca ultra-ampla (último recurso)
	if (combinedResults.length === 0) {
		console.log('🔍 ESTRATÉGIA 4: Busca ultra-ampla (último recurso)');
		try {
			const ultraBroadSearch = await firecrawlSearch({
				q: query,
				country: 'br',
				lang: 'pt',
				limit: maxResults,
				formats: ['markdown'],
				timeout: 30000,
			});

			if (ultraBroadSearch.web && ultraBroadSearch.web.length > 0) {
				for (let i = 0; i < ultraBroadSearch.web.length; i++) {
					const parsed = parseGenericResult(ultraBroadSearch.web[i], i);
					if (parsed) {
						combinedResults.push(parsed);
					}
				}
				console.log(`Busca ultra-ampla encontrou ${combinedResults.length} resultados`);
			}
		} catch (ultraError) {
			console.error('Erro na busca ultra-ampla:', ultraError);
		}
	}

	// Resultado final
	if (combinedResults.length === 0) {
		console.error('❌ TODAS AS ESTRATÉGIAS FALHARAM - Nenhum resultado encontrado');
		console.error('Tentativas realizadas: 1) Busca simples 2) Marketplaces 3) Genérica 4) Ultra-ampla');
		throw new Error(
			'Nenhum resultado encontrado. A busca foi realizada em múltiplos sites mas não encontramos produtos. Tente usar a Busca Rápida para produtos em nosso catálogo.'
		);
	}

	console.log(`✅ SUCESSO! Total de ${combinedResults.length} produtos encontrados`);

	// Limitar resultados
	combinedResults = combinedResults.slice(0, maxResults);

	// Ordenar por preço (menor primeiro), mas produtos sem preço vão para o final
	combinedResults.sort((a, b) => {
		if (a.price === 0 && b.price === 0) return 0;
		if (a.price === 0) return 1;
		if (b.price === 0) return -1;
		return a.price - b.price;
	});

	console.log(`Returning ${combinedResults.length} final results`);
	return combinedResults;
}

/**
 * Busca genérica na web (sem filtro de marketplace)
 */
export async function searchWeb(query: string, limit: number = 10): Promise<FirecrawlSearchData> {
	return await firecrawlSearch({
		q: `${query} Brasil preço`,
		country: 'br',
		lang: 'pt',
		limit,
		formats: ['markdown'],
		timeout: 30000,
	});
}
