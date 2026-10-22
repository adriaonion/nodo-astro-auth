let accessToken = null;
export function setToken(value) { accessToken = value; }
const configured = import.meta.env.PUBLIC_API_URL || import.meta.env.VITE_API_URL;
const endpoint = configured || (import.meta.env.DEV ? 'http://localhost:3000/graphql' : '/graphql');
export async function request(query, variables = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, { method:'POST', signal:controller.signal, headers:{'Content-Type':'application/json', ...(accessToken ? {Authorization:`Bearer ${accessToken}`} : {})}, body:JSON.stringify({query,variables}) });
    if (!response.ok) throw new Error(response.status === 429 ? 'Demasiados intentos. Espera un minuto.' : 'No se pudo consultar el servidor.');
    const result=await response.json();
    if(result.errors?.length) {
      const error=new Error(result.errors.map(e=>e.message).join(' '));
      error.unauthorized=result.errors.some(e=>e.extensions?.code==='UNAUTHENTICATED');
      throw error;
    }
    return result.data;
  } catch(error) {
    if(error.name==='AbortError'||error instanceof TypeError) throw new Error('No se pudo conectar con la API. Comprueba que el backend esté encendido.');
    throw error;
  } finally { clearTimeout(timeout); }
}
export const productFields='id name description priceCents stock categoryId category { id name }';
export const orderFields='id status totalCents createdAt items { productId name quantity priceCents }';
export const money = cents => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(cents/100);
