/**
 * Everything that moves on the home page. Each behaviour is a small function, wired at the end.
 * The page reads fine without this file: it only adds motion and the contact form.
 */
import { whatsappLink } from "../data/home";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const desktop = window.matchMedia("(min-width: 64rem)");

const $ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T | null => root.querySelector<T>(selector);
const $$ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document): T[] => Array.from(root.querySelectorAll<T>(selector));
const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

/** Restarts the CSS animations hanging from a class: remove it, force a layout, add it again. */
function restartClass(element: HTMLElement, className: string): void {
	element.classList.remove(className);
	void element.offsetWidth;
	element.classList.add(className);
}

/* ---------- One animation frame for everything tied to the scroll ---------- */

const frameTasks: Array<() => void> = [];
let frameQueued = false;

function onFrame(task: () => void): void {
	frameTasks.push(task);
}

function runFrameTasks(): void {
	frameQueued = false;
	for (const task of frameTasks) {
		task();
	}
}

function queueFrame(): void {
	if (!frameQueued) {
		frameQueued = true;
		requestAnimationFrame(runFrameTasks);
	}
}

window.addEventListener("scroll", queueFrame, { passive: true });
window.addEventListener("resize", queueFrame, { passive: true });

/* ---------- Reveal on scroll and motion only on screen ---------- */

function initReveal(): void {
	const items = $$("[data-reveal]");
	if (reduceMotion || !("IntersectionObserver" in window)) {
		items.forEach((item) => item.classList.add("is-visible"));
		return;
	}
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: "0px 0px -8% 0px" },
	);
	items.forEach((item) => observer.observe(item));
}

function initMotionZones(): void {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				entry.target.classList.toggle("is-onscreen", entry.isIntersecting);
			}
		},
		{ rootMargin: "120px 0px" },
	);
	$$("[data-motion]").forEach((zone) => observer.observe(zone));
}

/* ---------- Header, reading progress and the mobile menu ---------- */

function initHeader(): void {
	const header = $("[data-header]");
	const progress = $("[data-progress]");
	if (!header) {
		return;
	}
	let lastY = window.scrollY;
	onFrame(() => {
		const y = window.scrollY;
		const delta = y - lastY;
		lastY = y;
		header.classList.toggle("is-scrolled", y > 24);
		const menuOpen = document.documentElement.classList.contains("menu-open");
		if (!menuOpen && delta > 2 && y > 640) {
			header.classList.add("is-hidden");
		} else if (delta < -2 || y <= 640) {
			header.classList.remove("is-hidden");
		}
		if (progress) {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : "0");
		}
	});
}

function initMenu(): void {
	const toggle = $<HTMLButtonElement>("[data-menu-toggle]");
	const sheet = $("[data-menu]");
	const header = $("[data-header]");
	if (!toggle || !sheet) {
		return;
	}
	const blocked = [$("main"), $("footer")].filter((element): element is HTMLElement => element !== null);

	const setOpen = (open: boolean): void => {
		sheet.classList.toggle("is-open", open);
		sheet.setAttribute("aria-hidden", String(!open));
		toggle.setAttribute("aria-expanded", String(open));
		toggle.setAttribute("aria-label", open ? "Cerrar el menú" : "Abrir el menú");
		header?.classList.toggle("is-menu-open", open);
		header?.classList.remove("is-hidden");
		document.documentElement.classList.toggle("menu-open", open);
		document.body.style.overflow = open ? "hidden" : "";
		blocked.forEach((element) => (element.inert = open));
	};

	toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
	$$("a", sheet).forEach((link) => link.addEventListener("click", () => setOpen(false)));
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && sheet.classList.contains("is-open")) {
			setOpen(false);
			toggle.focus();
		}
	});
	desktop.addEventListener("change", (event) => {
		if (event.matches) {
			setOpen(false);
		}
	});
}

/* ---------- Hero: rotating verb, photo parallax, pointer light ---------- */

function initRotator(): void {
	const rotator = $("[data-rotator]");
	if (!rotator) {
		return;
	}
	const words = $$(".rotator__word", rotator);
	if (words.length < 2) {
		return;
	}
	let index = 0;

	const fit = (): void => {
		const style = getComputedStyle(rotator);
		const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		rotator.style.width = `${words[index].offsetWidth + padding}px`;
	};

	if (reduceMotion) {
		words.forEach((word) => word.classList.remove("is-active"));
		index = words.length - 1;
		words[index].classList.add("is-active");
		fit();
		return;
	}

	const next = (): void => {
		if (document.hidden || !rotator.closest("[data-motion]")?.classList.contains("is-onscreen")) {
			return;
		}
		const leaving = words[index];
		index = (index + 1) % words.length;
		leaving.classList.remove("is-active");
		leaving.classList.add("is-leaving");
		words[index].classList.remove("is-leaving");
		words[index].classList.add("is-active");
		fit();
		window.setTimeout(() => leaving.classList.remove("is-leaving"), 700);
	};

	fit();
	document.fonts?.ready.then(fit);
	window.addEventListener("resize", fit, { passive: true });
	window.setInterval(next, 2600);
}

function initHeroScroll(): void {
	const hero = $("#inicio");
	const photo = $(".hero__photo", hero ?? document);
	if (reduceMotion || !hero || !photo) {
		return;
	}
	onFrame(() => {
		const y = window.scrollY;
		if (y > hero.offsetHeight) {
			return;
		}
		photo.style.translate = `0 ${(y * 0.3).toFixed(1)}px`;
	});
}

function initPointerEffects(): void {
	if (!finePointer || reduceMotion) {
		return;
	}

	const hero = $("[data-spotlight]");
	const floating = $$("[data-parallax]");
	if (hero) {
		let frame = 0;
		hero.addEventListener("pointermove", (event) => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const rect = hero.getBoundingClientRect();
				const x = (event.clientX - rect.left) / rect.width;
				const y = (event.clientY - rect.top) / rect.height;
				hero.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
				hero.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
				floating.forEach((card) => {
					const depth = Number(card.dataset.parallax) || 12;
					card.style.translate = `${((0.5 - x) * depth).toFixed(1)}px ${((0.5 - y) * depth).toFixed(1)}px`;
				});
			});
		});
		hero.addEventListener("pointerleave", () => floating.forEach((card) => (card.style.translate = "")));
	}

	document.addEventListener(
		"pointermove",
		(event) => {
			const card = (event.target as Element | null)?.closest<HTMLElement>("[data-spot]");
			if (!card) {
				return;
			}
			const rect = card.getBoundingClientRect();
			card.style.setProperty("--mx", `${(event.clientX - rect.left).toFixed(0)}px`);
			card.style.setProperty("--my", `${(event.clientY - rect.top).toFixed(0)}px`);
		},
		{ passive: true },
	);

	$$("[data-magnetic]").forEach((button) => {
		button.addEventListener("pointermove", (event) => {
			const rect = button.getBoundingClientRect();
			const x = event.clientX - rect.left - rect.width / 2;
			const y = event.clientY - rect.top - rect.height / 2;
			button.style.translate = `${(x * 0.2).toFixed(1)}px ${(y * 0.3).toFixed(1)}px`;
		});
		button.addEventListener("pointerleave", () => (button.style.translate = ""));
	});
}

/* ---------- Numbers that count up ---------- */

function initCounters(): void {
	const counters = $$("[data-count]");
	if (reduceMotion) {
		return;
	}
	const run = (element: HTMLElement): void => {
		const target = Number(element.dataset.count);
		const decimals = Number(element.dataset.decimals ?? 0);
		const duration = 1700;
		const start = performance.now();
		const tick = (now: number): void => {
			const progress = clamp((now - start) / duration);
			element.textContent = (target * (1 - Math.pow(1 - progress, 3))).toFixed(decimals).replace(".", ",");
			if (progress < 1) {
				requestAnimationFrame(tick);
			}
		};
		requestAnimationFrame(tick);
	};
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					run(entry.target as HTMLElement);
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.6 },
	);
	counters.forEach((counter) => {
		counter.textContent = "0";
		observer.observe(counter);
	});
}

/* ---------- The film: five scenes, story bars, steps and pause ---------- */

function initFilm(): void {
	const film = $("[data-film]");
	if (!film) {
		return;
	}
	const wrap = $("[data-film-wrap]");
	const scenes = $$("[data-scene]", film);
	const bars = $$<HTMLButtonElement>("[data-film-bar]", film);
	const steps = $$<HTMLButtonElement>("[data-film-step]");
	const toggle = $<HTMLButtonElement>("[data-film-toggle]", film);
	const durations = bars.map((bar) => parseFloat(bar.style.getPropertyValue("--scene-duration")) || 5500);

	let current = 0;
	let started = false;
	let inView = false;
	let userPaused = false;
	let running = false;
	let timer = 0;
	let remaining = durations[0];
	let startedAt = 0;

	const show = (index: number): void => {
		current = index;
		remaining = durations[index];
		scenes.forEach((scene, sceneIndex) => {
			const active = sceneIndex === index;
			scene.classList.toggle("is-active", active);
			scene.setAttribute("aria-hidden", String(!active));
			if (active) {
				restartClass(scene, "is-playing");
			} else {
				scene.classList.remove("is-playing");
			}
		});
		bars.forEach((bar, barIndex) => {
			bar.classList.toggle("is-done", barIndex < index);
			bar.classList.remove("is-running");
			bar.setAttribute("aria-current", barIndex === index ? "step" : "false");
			if (barIndex === index) {
				restartClass(bar, "is-running");
			}
		});
		steps.forEach((step, stepIndex) => {
			step.classList.remove("is-active");
			step.setAttribute("aria-current", stepIndex === index ? "step" : "false");
			if (stepIndex === index) {
				restartClass(step, "is-active");
			}
		});
	};

	const updateToggle = (): void => {
		toggle?.setAttribute("aria-pressed", String(userPaused));
		toggle?.setAttribute("aria-label", userPaused ? "Reproducir la animación" : "Pausar la animación");
	};

	if (reduceMotion) {
		film.classList.add("is-static");
		show(0);
		const jump = (index: number): void => show(index);
		bars.forEach((bar, index) => bar.addEventListener("click", () => jump(index)));
		steps.forEach((step, index) => step.addEventListener("click", () => jump(index)));
		return;
	}

	const schedule = (): void => {
		window.clearTimeout(timer);
		startedAt = performance.now();
		timer = window.setTimeout(() => {
			show((current + 1) % scenes.length);
			schedule();
		}, remaining);
	};

	/** Plays only when it has started, is on screen, the tab is visible and nobody paused it. */
	const sync = (force = false): void => {
		const shouldRun = started && inView && !userPaused && !document.hidden;
		if (shouldRun === running && !force) {
			return;
		}
		if (!shouldRun && running) {
			remaining = Math.max(120, remaining - (performance.now() - startedAt));
		}
		running = shouldRun;
		film.classList.toggle("is-paused", !shouldRun);
		wrap?.classList.toggle("is-paused", !shouldRun);
		window.clearTimeout(timer);
		if (shouldRun) {
			schedule();
		}
	};

	const jump = (index: number): void => {
		started = true;
		userPaused = false;
		running = false;
		show(index);
		updateToggle();
		sync(true);
	};

	bars.forEach((bar, index) => bar.addEventListener("click", () => jump(index)));
	steps.forEach((step, index) => step.addEventListener("click", () => jump(index)));
	toggle?.addEventListener("click", () => {
		userPaused = !userPaused;
		updateToggle();
		sync();
	});
	document.addEventListener("visibilitychange", () => sync());

	new IntersectionObserver(
		(entries) => {
			inView = entries[0]?.isIntersecting ?? false;
			if (inView && !started) {
				started = true;
				show(0);
			}
			sync();
		},
		{ threshold: 0.35 },
	).observe(film);

	updateToggle();
}

/* ---------- Scroll-linked pieces: ghost words, stacked cases, rails, index ---------- */

function initGhosts(): void {
	if (reduceMotion) {
		return;
	}
	const ghosts = $$("[data-ghost]");
	onFrame(() => {
		const viewport = window.innerHeight;
		for (const ghost of ghosts) {
			const rect = ghost.getBoundingClientRect();
			if (rect.bottom < -200 || rect.top > viewport + 200) {
				continue;
			}
			const progress = (rect.top + rect.height / 2) / viewport;
			ghost.style.setProperty("--shift", `${((progress - 0.5) * 110).toFixed(1)}px`);
		}
	});
}

function initCaseStack(): void {
	const cards = $$("[data-case]");
	if (cards.length < 2 || reduceMotion) {
		return;
	}
	const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
	const baseTops = cards.map((card) => parseFloat(card.style.getPropertyValue("--stick")) * rem || 88);

	/** A card taller than the screen sticks only once its bottom is visible, so its end is never hidden. */
	const placeTops = (): void => {
		cards.forEach((card, index) => {
			const fit = window.innerHeight - card.offsetHeight - 24;
			card.style.setProperty("--stick", `${Math.round(Math.min(baseTops[index], fit))}px`);
		});
		queueFrame();
	};
	placeTops();
	window.addEventListener("resize", placeTops, { passive: true });
	if ("ResizeObserver" in window) {
		const observer = new ResizeObserver(placeTops);
		cards.forEach((card) => observer.observe(card));
	}

	onFrame(() => {
		if (!desktop.matches) {
			cards.forEach((card) => {
				card.style.removeProperty("--scale");
				card.style.removeProperty("--dim");
			});
			return;
		}
		const viewport = window.innerHeight;
		cards.forEach((card, index) => {
			const next = cards[index + 1];
			if (!next) {
				return;
			}
			const stick = parseFloat(getComputedStyle(next).top) || 0;
			const progress = clamp((viewport - next.getBoundingClientRect().top) / Math.max(1, viewport - stick));
			card.style.setProperty("--scale", (1 - progress * 0.06).toFixed(4));
			card.style.setProperty("--dim", (1 - progress * 0.32).toFixed(3));
		});
	});
}

function initRails(): void {
	const rails = $$("[data-process]");
	onFrame(() => {
		const viewport = window.innerHeight;
		const line = viewport * 0.58;
		for (const rail of rails) {
			const rect = rail.getBoundingClientRect();
			if (rect.bottom < -viewport || rect.top > viewport * 2) {
				continue;
			}
			$("[data-process-fill]", rail)?.style.setProperty("--fill", clamp((line - rect.top) / rect.height).toFixed(4));
			$$("[data-process-step]", rail).forEach((step) => step.classList.toggle("is-reached", step.getBoundingClientRect().top < line));
		}
	});
}

/** Case screenshots: tabs switch them, and they rotate by themselves while on screen. */
function initSlides(): void {
	$$("[data-slides]").forEach((root) => {
		const slides = $$<HTMLImageElement>("[data-slide]", root);
		const tabs = $$<HTMLButtonElement>("[data-slide-tab]", root);
		const url = $("[data-slide-url]", root);
		if (slides.length < 2) {
			return;
		}
		let index = 0;
		let timer = 0;

		const show = (next: number): void => {
			index = next;
			slides.forEach((slide, slideIndex) => {
				slide.classList.toggle("is-active", slideIndex === index);
				slide.setAttribute("aria-hidden", String(slideIndex !== index));
			});
			tabs.forEach((tab, tabIndex) => {
				tab.classList.toggle("is-active", tabIndex === index);
				tab.setAttribute("aria-selected", String(tabIndex === index));
			});
			if (url) {
				url.textContent = slides[index].dataset.url ?? "";
			}
		};

		const stop = (): void => window.clearInterval(timer);
		const play = (): void => {
			stop();
			if (reduceMotion) {
				return;
			}
			timer = window.setInterval(() => {
				if (document.hidden || !root.closest("[data-motion]")?.classList.contains("is-onscreen")) {
					return;
				}
				show((index + 1) % slides.length);
			}, 4800);
		};

		tabs.forEach((tab, tabIndex) =>
			tab.addEventListener("click", () => {
				show(tabIndex);
				play();
			}),
		);
		root.addEventListener("pointerenter", stop);
		root.addEventListener("pointerleave", play);
		show(0);
		play();
	});
}

function initShots(): void {
	const shots = $$("[data-shot]");
	const update = (): void => shots.forEach((shot) => shot.style.setProperty("--viewport-h", `${shot.clientHeight}px`));
	update();
	if ("ResizeObserver" in window) {
		const observer = new ResizeObserver(update);
		shots.forEach((shot) => observer.observe(shot));
	}
}

function initSectionIndex(): void {
	const index = $("[data-section-index]");
	const current = $("[data-index-current]");
	const links = $$<HTMLAnchorElement>("[data-index-link]");
	const navLinks = $$<HTMLAnchorElement>("[data-nav-link]");
	const sections = links.map((link) => document.getElementById(link.dataset.indexLink ?? "")).filter((section): section is HTMLElement => section !== null);
	const themed = $$("[data-theme]");
	let activeId: string | null = null;

	onFrame(() => {
		const middle = window.innerHeight / 2;
		const crossing = sections.find((section) => {
			const rect = section.getBoundingClientRect();
			return rect.top <= middle && rect.bottom > middle;
		});
		const nextId = crossing?.id ?? null;
		if (nextId !== activeId) {
			activeId = nextId;
			links.forEach((link) => link.classList.toggle("is-active", link.dataset.indexLink === activeId));
			navLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.navLink === activeId));
			const activeLink = links.find((link) => link.dataset.indexLink === activeId);
			if (current && activeLink) {
				current.textContent = activeLink.dataset.indexLabel ?? "";
			}
		}
		const under = themed.find((block) => {
			const rect = block.getBoundingClientRect();
			return rect.top <= middle && rect.bottom > middle;
		});
		index?.classList.toggle("on-light", under?.dataset.theme === "light");
		index?.classList.toggle("is-shown", activeId !== null);
	});
}

/* ---------- Contact: the form writes the message and WhatsApp sends it ---------- */

function initContactForm(): void {
	const form = $<HTMLFormElement>("[data-contact-form]");
	if (!form) {
		return;
	}
	const status = $("[data-contact-status]", form);
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}
		const data = new FormData(form);
		const field = (name: string): string => String(data.get(name) ?? "").trim();
		const company = field("company");
		const country = field("country");
		const service = field("service");
		const intro = `Hola Joel, soy ${field("name")}${company ? ` de ${company}` : ""}${country ? ` (${country})` : ""}.`;
		const body = [intro, `Necesito: ${service}.`, "", field("message")].join("\n");
		window.open(whatsappLink(body), "_blank", "noopener");
		if (status) {
			status.textContent = "Abriendo WhatsApp con el mensaje listo…";
		}
	});
}

initReveal();
initMotionZones();
initHeader();
initMenu();
initRotator();
initHeroScroll();
initPointerEffects();
initCounters();
initFilm();
initGhosts();
initCaseStack();
initRails();
initShots();
initSlides();
initSectionIndex();
initContactForm();
runFrameTasks();
