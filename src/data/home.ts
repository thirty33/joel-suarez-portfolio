/**
 * Everything the home page says, in one place. Contact data confirmed with the LinkedIn profile
 * (2026-10-12); the WhatsApp number was given by Joel the same day.
 */

export const CONTACT = {
	name: "Joel Suárez",
	role: "Arquitecto de software",
	city: "Mérida, Venezuela",
	whatsapp: "573227632472",
	email: "joelsuarez.1101@gmail.com",
	linkedin: "https://www.linkedin.com/in/thirty33/",
	github: "https://github.com/thirty33",
};

export const whatsappLink = (text: string): string => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const HELLO_MESSAGE = "Hola Joel, vi tu web y quiero conversar sobre un proyecto.";

/** Sections numbered like the brand design: the index on the right edge reads this list. */
export const SECTIONS = [
	{ id: "servicios", number: "01", label: "Servicios" },
	{ id: "casos", number: "02", label: "Casos" },
	{ id: "proceso", number: "03", label: "Proceso" },
	{ id: "stack", number: "04", label: "Stack" },
	{ id: "trayectoria", number: "05", label: "Trayectoria" },
	{ id: "paises", number: "06", label: "Países" },
	{ id: "contacto", number: "07", label: "Contacto" },
] as const;

export const ROTATING_VERBS = ["responde", "cobra", "factura", "vende", "trabaja"];

export const TAPE_ITEMS = [
	"Sistemas agénticos",
	"Agentes de IA para WhatsApp",
	"Pasarelas de pago",
	"Integraciones con tu ERP",
	"Arquitectura de software",
	"Software a medida",
	"SEO que posiciona",
	"AWS y DevOps",
];

export const METRICS = [
	{ value: 9, prefix: "", suffix: "+", label: "años construyendo software", note: "Desde 2017, siempre en sistemas en producción" },
	{ value: 28, prefix: "", suffix: "", label: "empresas convertidas desde WhatsApp", note: "Leads de Google Ads, Meta y la web que terminaron como clientes (Delicius, 2026)" },
	{ value: 10, prefix: "", suffix: "+", label: "integraciones ya construidas", note: "Pagos: Klap, Stripe, Authorize.net y Binance · IA: DeepSeek, MiniMax, OpenAI y Anthropic · WhatsApp y Defontana" },
	{ value: 4, prefix: "", suffix: "", label: "países con proyectos entregados", note: "Chile, Colombia, EE. UU. y Francia, y abierto al resto del mundo" },
];

export const FILM_STEPS = [
	{ title: "Tu cliente escribe", text: "Por WhatsApp, como siempre.", duration: 6200 },
	{ title: "La IA lo entiende", text: "Clasifica, asigna y crea el pedido.", duration: 5600 },
	{ title: "Cobras en línea", text: "Link de pago, reintentos y conciliación.", duration: 5400 },
	{ title: "Se factura solo", text: "Conectado a tu ERP y a tu inventario.", duration: 5400 },
	{ title: "Lo mides todo", text: "GA4, Pixel de Meta y Search Console.", duration: 5600 },
];

export type CaseShot = { src: string; small?: string; label: string; url: string; alt: string };

export type MainCase = {
	id: "backoffice" | "b2b" | "b2c";
	client: string;
	product: string;
	years: string;
	title: string;
	summary: string;
	modules?: { title: string; text: string }[];
	points?: string[];
	stats?: { value: string; label: string }[];
	stack: string;
	shots: CaseShot[];
	mobile?: string;
	link?: { label: string; href: string };
	cta: string;
};

/** The three real systems built for Delicius Food (code is private: each one ends with a question to the visitor). */
export const MAIN_CASES: MainCase[] = [
	{
		id: "backoffice",
		client: "Delicius Food · Chile",
		product: "Backoffice y CRM",
		years: "2024 – hoy",
		title: "El backoffice que opera toda la empresa",
		summary:
			"Pedidos, producción, inventario, facturación y conversaciones de WhatsApp con IA en un solo sistema. Lo diseñé y lo desarrollo desde cero para una empresa de alimentación B2B.",
		modules: [
			{
				title: "Conversaciones con IA",
				text: "Bandeja de WhatsApp compartida por el equipo. Una encuesta con IA califica cada lead, lo etiqueta por origen (Google Ads, Meta o la web) y avisa al asesor; el bot se calla cuando una persona toma el chat.",
			},
			{ title: "Comercial", text: "Menús con fecha límite de pedido, listas de precio por empresa, reglas de pedido componibles, pedidos consolidados y carteras de vendedores." },
			{ title: "Producción", text: "Órdenes de producción por cuarto productivo, emplatados con sus ingredientes y etiquetas nutricionales con los sellos «ALTO EN»." },
			{ title: "Inventario", text: "Bodegas, materias primas, mezclas, movimientos y conteos." },
			{ title: "Facturación y pagos", text: "Facturas en Defontana, pagos con Klap, reportes configurables e importación y exportación masiva." },
			{ title: "Observabilidad", text: "Salud del sistema en vivo: invocaciones de IA, colas, integraciones y envíos de WhatsApp." },
		],
		stats: [
			{ value: "3.300+", label: "conversaciones de WhatsApp" },
			{ value: "28", label: "empresas convertidas desde el chat" },
			{ value: "250+", label: "clases de test" },
		],
		stack: "Laravel 12 · Filament · React · DDD · DeepSeek y MiniMax · AWS",
		shots: [
			{ src: "/images/cases/delicius-bo-conversaciones.webp", small: "/images/cases/delicius-bo-conversaciones-960.webp", label: "Conversaciones", url: "backoffice.pedidosdelicius.cl/conversations", alt: "Bandeja de conversaciones de WhatsApp con el tipo, la atención, la etapa y las etiquetas de origen que pone la IA (datos de clientes difuminados)" },
			{ src: "/images/cases/delicius-bo-salud.webp", small: "/images/cases/delicius-bo-salud-960.webp", label: "Salud del sistema", url: "backoffice.pedidosdelicius.cl/salud-del-sistema", alt: "Panel de salud del sistema con invocaciones de IA, colas, integraciones y envíos de WhatsApp de las últimas 24 horas" },
			{ src: "/images/cases/delicius-bo-produccion.webp", small: "/images/cases/delicius-bo-produccion-960.webp", label: "Producción", url: "backoffice.pedidosdelicius.cl/advance-orders", alt: "Listado de órdenes de producción con fechas de despacho y elaboración, estado y cantidad de productos" },
			{ src: "/images/cases/delicius-bo-menus.webp", small: "/images/cases/delicius-bo-menus-960.webp", label: "Menús", url: "backoffice.pedidosdelicius.cl/menus", alt: "Listado de menús por tipo de cliente y convenio, con fecha de despacho y hora límite de pedido" },
		],
		cta: "Hola Joel, vi en tu web el backoffice de Delicius y necesito un sistema así para mi negocio.",
	},
	{
		id: "b2b",
		client: "Delicius Food · Chile",
		product: "Tienda B2B",
		years: "2024 – hoy",
		title: "La tienda donde las empresas piden por día de entrega",
		summary:
			"Cafeterías, casinos y empresas con convenio eligen el día, ven el menú de ese día con sus precios y piden antes de la hora límite. Todo lo que ven se configura en el backoffice.",
		points: [
			"Menús por día de entrega, con fecha y hora límite de pedido.",
			"Categorías, buscador y la ficha de cada plato con su información nutricional.",
			"Precios y reglas de cada empresa: montos máximos, categorías obligatorias y despacho.",
			"Repetir el pedido anterior en un clic y seguir el estado de cada pedido.",
			"Hecha para el celular, con ayuda directa por WhatsApp.",
		],
		stack: "React · TypeScript · Tailwind · API en Laravel",
		shots: [
			{ src: "/images/cases/delicius-b2b-menu.webp", small: "/images/cases/delicius-b2b-menu-960.webp", label: "Menú del día", url: "pedidosdelicius.cl/menu/2353/categories", alt: "Menú del miércoles con las categorías a la izquierda y los platos preparados con foto, precio y botón para agregar" },
			{ src: "/images/cases/delicius-b2b-dias.webp", small: "/images/cases/delicius-b2b-dias-960.webp", label: "Día de entrega", url: "pedidosdelicius.cl", alt: "Selección del día de entrega: miércoles 14, jueves 15 y viernes 16 de octubre" },
			{ src: "/images/cases/delicius-b2b-detalle.webp", small: "/images/cases/delicius-b2b-detalle-960.webp", label: "Ficha del plato", url: "pedidosdelicius.cl/menu/2353/categories", alt: "Ficha de la lasaña florentina de pollo con descripción, precio, vida útil, peso neto e información nutricional" },
		],
		mobile: "/images/cases/delicius-b2b-movil.webp",
		cta: "Hola Joel, vi en tu web la tienda B2B de Delicius y necesito algo así para vender a empresas.",
	},
	{
		id: "b2c",
		client: "Delicius Food · Chile",
		product: "Tienda B2C y sitio web",
		years: "2026",
		title: "Tienda online de comida a domicilio con pagos y SEO",
		summary: "El sitio de la marca y su tienda para personas: boxes de comida preparada, pago con tarjeta y cada venta medida de punta a punta.",
		points: [
			"Boxes de comida preparada con despacho por comuna.",
			"Pago con tarjetas por Klap, con reintentos y reembolsos.",
			"Registro e ingreso con Google.",
			"Pixel de Meta, GA4 y Search Console: se sabe qué anuncio trajo cada venta.",
			"SEO técnico: +194 % de clics orgánicos en dos semanas.",
		],
		stack: "Astro · React · Klap · GA4 · Pixel de Meta · AWS",
		shots: [{ src: "/images/cases/delicius-full.webp", label: "Comida a domicilio", url: "deliciusfoodchile.cl/comida-preparada-a-domicilio", alt: "La tienda de Delicius Food: comida preparada a domicilio" }],
		mobile: "/images/cases/delicius-mobile.webp",
		link: { label: "Ver deliciusfoodchile.cl", href: "https://www.deliciusfoodchile.cl/comida-preparada-a-domicilio/" },
		cta: "Hola Joel, vi en tu web la tienda de Delicius y quiero vender en línea así.",
	},
];

/** Products built inside other companies' teams: public product links, private code. */
export const OTHER_PROJECTS = [
	{
		id: "loanofficer",
		company: "Novateva · EE. UU.",
		years: "2022 – 2024",
		name: "loanofficer.ai",
		title: "CRM para oficiales de crédito hipotecario",
		text: "Contactos, pipeline de préstamos, campañas por SMS y correo y facturación por suscripción para equipos de crédito en Estados Unidos.",
		points: [
			"Facturación mensual con Authorize.net: suscripciones, transacciones en revisión y empresas inactivas.",
			"Cargas masivas de contactos optimizadas y avisos por SMS (Twilio) y correo (SendGrid).",
			"Autoescalado en AWS con EventBridge y APIs serverless con FastAPI.",
			"Con TDD, los errores de la facturación mensual bajaron 95 %.",
		],
		stack: "Laravel · AWS · Authorize.net · Twilio · SendGrid · Jenkins",
		links: [{ label: "app.loanofficer.ai", href: "https://app.loanofficer.ai/" }],
		cta: "Hola Joel, vi en tu web el CRM de loanofficer.ai y necesito una solución así para mi negocio.",
	},
	{
		id: "skouting",
		company: "ST37 Sport et Technologie · Francia",
		years: "2024 – 2025",
		name: "Skouting y Engarde",
		title: "Esgrima con análisis de video por IA",
		text: "Plataformas para clubes y atletas de esgrima: videos de competencias, análisis con IA y gestión de torneos.",
		points: [
			"Búsqueda avanzada con IA en lenguaje natural, en francés, inglés y español.",
			"Créditos para el análisis con IA, cobro por consumo y suscripciones con Stripe.",
			"API para la app móvil con notificaciones push, canales, shorts y comentarios.",
			"Skouting integrado dentro de Engarde.",
		],
		stack: "Laravel · MongoDB · Stripe · AWS · Firebase",
		links: [
			{ label: "app.skouting.com", href: "https://app.skouting.com/" },
			{ label: "engarde-service.com", href: "https://engarde-service.com/organism/st37" },
		],
		cta: "Hola Joel, vi en tu web Skouting y Engarde y necesito una solución así para mi negocio.",
	},
];

/** Own products and experiments, linked to their repository when it is public. */
export const SIDE_PROJECTS = [
	{ name: "Atomic Habits", text: "SaaS de hábitos con un coach de IA que lee y escribe tus datos, planes de pago y arquitectura DDD.", tag: "SaaS · IA", repo: "https://github.com/thirty33/atomic-habits-manager" },
	{ name: "DDD Diagram Editor", text: "Dibuja la arquitectura capa por capa antes de programar; el agente de IA la lee por MCP y la respeta.", tag: "IA · MCP", repo: "https://github.com/thirty33/ddd-diagram-editor" },
	{ name: "Verbo", text: "Práctica de gramática inglesa donde una IA corrige cada respuesta.", tag: "IA · Educación", repo: "https://github.com/thirty33/grammar-exercises" },
	{ name: "enhanceBrainSkills", text: "Entrenamiento de memoria, lectura rápida y agilidad mental, con corrección por IA.", tag: "Laravel 13 · Livewire 4", repo: null },
];

/** Public LinkedIn recommendations, quoted word for word. */
export const TESTIMONIALS = [
	{
		quote: "Ha sido un pilar fundamental en el crecimiento y evolución de la plataforma Skouting y Engarde. Su capacidad para abordar problemas complejos, desarrollar nuevas APIs y optimizar funcionalidades ha sido clave en la consolidación de nuestra infraestructura tecnológica.",
		name: "Jesús León Cordero",
		role: "Mi Tech Lead en ST37 y compañero en Linktic",
	},
	{
		quote: "Joel es un desarrollador de software excepcional. Su enfoque directo y su capacidad para ejecutar tareas de manera precisa hacen que sea un recurso valioso para cualquier proyecto.",
		name: "Victor Rojas",
		role: "Director de Tecnología y fundador de Novateva",
	},
	{
		quote: "Joel is one of the best developers I've had the honor to work with, not only because of their top-level skills but also his sense of responsibility.",
		name: "Gustavo Mejía",
		role: "Líder técnico en Novateva",
	},
];

export const EDUCATION = {
	school: "Platzi",
	years: "2016 – 2018",
	text: "77 cursos certificados: React, Laravel, TDD, AWS, Serverless, infraestructura como código, TypeScript, SEO e inglés (B1).",
};

export const PROCESS = [
	{ title: "Diagnóstico", text: "Entiendo tu operación: qué se hace a mano, dónde se pierde tiempo o dinero y qué conviene automatizar primero." },
	{ title: "Diseño", text: "Dibujo la arquitectura por capas y los casos de uso antes de escribir código. Tú ves el plano y lo apruebas." },
	{ title: "Construcción con pruebas", text: "Avances pequeños y visibles, con pruebas automáticas: lo que funciona hoy sigue funcionando mañana." },
	{ title: "Lanzamiento y medición", text: "Despliegue en la nube, monitoreo y métricas para decidir con datos, no con intuición." },
];

export const STACK_ROWS = [
	["laravel", "Laravel"], ["php", "PHP 8.4"], ["react", "React"], ["vuedotjs", "Vue"], ["astro", "Astro"], ["typescript", "TypeScript"],
	["tailwindcss", "Tailwind"], ["nodedotjs", "Node.js"], ["filament", "Filament"], ["livewire", "Livewire"], ["vite", "Vite"], ["vitest", "Vitest"],
] as const;

export const STACK_ROWS_2 = [
	["mysql", "MySQL"], ["postgresql", "PostgreSQL"], ["redis", "Redis"], ["mongodb", "MongoDB"], ["docker", "Docker"], ["githubactions", "GitHub Actions"],
	["serverless", "Serverless"], ["claude", "Claude"], ["anthropic", "Anthropic"], ["deepseek", "DeepSeek"], ["ollama", "Ollama"], ["whatsapp", "WhatsApp API"],
	["stripe", "Stripe"], ["binance", "Binance Pay"], ["googleanalytics", "GA4"], ["googletagmanager", "Tag Manager"], ["meta", "Pixel de Meta"],
] as const;

export const STACK_GROUPS = [
	{ title: "Backend", items: "Laravel · PHP 8.4 · Node.js · Python y FastAPI · APIs REST · colas · MySQL · PostgreSQL · Redis · MongoDB" },
	{ title: "Frontend", items: "React · Vue · Angular · Astro · TypeScript · Tailwind · Filament · Livewire" },
	{ title: "Inteligencia artificial", items: "laravel/ai · agentes con herramientas · MCP · DeepSeek · MiniMax · OpenAI · Anthropic · Ollama · Whisper" },
	{ title: "Nube y DevOps", items: "AWS (EC2, RDS, SQS, S3, CloudFront, Lambda, EventBridge) · CloudFormation · Docker · GitHub Actions · Jenkins" },
	{ title: "Pagos e integraciones", items: "WhatsApp Cloud API · Klap · Stripe · Authorize.net · Binance · Defontana · Twilio · SendGrid · GA4 · GTM · Pixel de Meta" },
	{ title: "Calidad", items: "PHPUnit · Laravel Dusk · Playwright · Vitest · TDD · DDD y arquitectura hexagonal" },
];

export const JOURNEY: { years: string; company: string; place: string; flag: "co" | "cl" | "ve" | "us" | "fr"; role: string; text: string }[] = [
	{ years: "2024 – hoy", company: "Delicius Food", place: "Chile · remoto", flag: "cl", role: "Arquitectura y desarrollo de software", text: "Diseñé y desarrollo el sistema completo: backoffice en Laravel 12 y Filament, tienda B2B en React, tienda B2C y sitio en Astro sobre AWS, con WhatsApp y agentes de IA, Klap y Defontana. DDD y más de 250 clases de test." },
	{ years: "2024 – 2025", company: "ST37 Sport et Technologie", place: "Francia · remoto", flag: "fr", role: "Desarrollador de software", text: "Skouting y Engarde, plataformas de esgrima: búsqueda con IA en lenguaje natural, créditos por consumo de IA, suscripciones con Stripe y API para la app móvil." },
	{ years: "2022 – 2024", company: "Novateva", place: "California, EE. UU.", flag: "us", role: "DevOps, desarrollador y líder técnico", text: "loanofficer.ai: CI/CD, autoescalado en AWS y APIs serverless. Con TDD, los errores de la facturación mensual bajaron 95 %, y la refactorización redujo cerca de 60 % el uso de la base de datos." },
	{ years: "2022", company: "Tech4Tms", place: "Chicago, EE. UU.", flag: "us", role: "Ingeniero de software", text: "CRM de inventarios desde cero para empresas de logística." },
	{ years: "2021 – 2022", company: "Linktic", place: "Bogotá, Colombia · remoto", flag: "co", role: "Desarrollador de software", text: "Logística de las elecciones presidenciales de 2022 en Colombia: más de 100.000 usuarios y 10 millones de solicitudes al día, con 99,3 % de éxito." },
	{ years: "2019 – 2021", company: "Siesa", place: "Valle del Cauca, Colombia", flag: "co", role: "Desarrollador de software", text: "Tiendas B2B y B2C para empresas colombianas e integraciones con pasarelas de pago y transportadoras; el referente del equipo en integraciones." },
	{ years: "2017 – 2019", company: "Independiente", place: "Colombia", flag: "co", role: "Desarrollador web", text: "Sitios y tiendas para pequeñas empresas." },
];

export const COUNTRIES: { code: "co" | "cl" | "ve"; name: string; payments: string; erp: string; proof: string }[] = [
	{
		code: "co",
		name: "Colombia",
		payments: "Wompi · PSE · Nequi · PayU · ePayco · Bold",
		erp: "Siigo · Alegra · facturación electrónica DIAN",
		proof: "Experiencia: Siesa y Linktic (elecciones de 2022)",
	},
	{
		code: "cl",
		name: "Chile",
		payments: "Webpay · Klap · Flow · Mercado Pago",
		erp: "Defontana · Bsale · SII",
		proof: "En producción: Klap y Defontana (Delicius)",
	},
	{
		code: "ve",
		name: "Venezuela",
		payments: "Pago Móvil · C2P · Binance · Zelle · multimoneda",
		erp: "Sistemas administrativos con proveedor homologado por el SENIAT",
		proof: "Ya integré cobros con Binance (Atomic Habits)",
	},
];

export const SERVICE_OPTIONS = [
	"Agente de IA o WhatsApp",
	"Sistema agéntico para mis procesos",
	"Pasarela de pago",
	"Integración con mi ERP",
	"Software a medida",
	"Posicionamiento SEO o tienda online",
	"Nube o arquitectura",
	"Otro",
];
