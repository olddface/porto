import { Fragment, computed, createBlock, createSSRApp, createTextVNode, createVNode, defineComponent, inject, mergeProps, onMounted, onUnmounted, openBlock, provide, ref, renderList, resolveComponent, toDisplayString, unref, useModel, useSSRContext, watch, withCtx } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { createClient as createClient$1 } from "@supabase/supabase-js";
import { RouterLink, RouterView, createMemoryHistory, createRouter, createWebHistory, useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import DOMPurify from "dompurify";
import EasyMDE from "easymde";
import { createHead } from "@unhead/vue/server";
var supabase = createClient$1("https://eoowsqkmeydfpukcdiqu.supabase.co", "sb_publishable_POwypyS98wvtCE1i8luGQg_3in9pUVD");
//#endregion
//#region src/composables/useAuth.ts
var authKey = Symbol("auth");
var sharedAuth = null;
function createAuthState() {
	const session = ref(null);
	const loading = ref(true);
	const initialized = ref(false);
	const user = computed(() => session.value?.user ?? null);
	async function init() {
		if (initialized.value) return;
		const { data } = await supabase.auth.getSession();
		session.value = data.session;
		loading.value = false;
		initialized.value = true;
		supabase.auth.onAuthStateChange((_event, newSession) => {
			session.value = newSession;
			loading.value = false;
		});
	}
	async function signIn(email, password) {
		loading.value = true;
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		loading.value = false;
		return { error: error?.message ?? null };
	}
	async function signOut() {
		loading.value = true;
		await supabase.auth.signOut();
		loading.value = false;
	}
	return {
		session,
		user,
		loading,
		initialized,
		init,
		signIn,
		signOut
	};
}
function getAuth() {
	if (!sharedAuth) sharedAuth = createAuthState();
	return sharedAuth;
}
function provideAuth() {
	const state = getAuth();
	provide(authKey, state);
	return state;
}
function useAuth() {
	const state = inject(authKey, null) ?? sharedAuth;
	if (!state) throw new Error("useAuth() must be used within a component that calls provideAuth()");
	return state;
}
//#endregion
//#region src/App.vue?vue&type=script&setup=true&lang.ts
var App_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "App",
	__ssrInlineRender: true,
	setup(__props) {
		provideAuth();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RouterView = resolveComponent("RouterView");
			_push(ssrRenderComponent(_component_RouterView, _attrs, null, _parent));
		};
	}
});
//#endregion
//#region src/App.vue
var _sfc_setup$22 = App_vue_vue_type_script_setup_true_lang_default.setup;
App_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
	return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
var App_default = App_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/types/portfolio.ts
var NAV_ITEMS = [
	{
		label: "about",
		href: "#about"
	},
	{
		label: "experience",
		href: "#experience"
	},
	{
		label: "skills",
		href: "#skills"
	},
	{
		label: "projects",
		href: "#projects"
	},
	{
		label: "contact",
		href: "#contact"
	}
];
//#endregion
//#region src/components/SiteNav.vue?vue&type=script&setup=true&lang.ts
var SiteNav_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SiteNav",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const menuOpen = ref(false);
		const activeSection = ref("");
		const sectionIds = NAV_ITEMS.map((n) => n.href.replace("#", ""));
		function closeMenu() {
			menuOpen.value = false;
		}
		function isNavActive(href) {
			const id = href.replace("#", "");
			if (route.name === "project-detail" && id === "projects") return true;
			return activeSection.value === id;
		}
		let observer = null;
		function setupObserver() {
			observer?.disconnect();
			if (route.name !== "home") return;
			observer = new IntersectionObserver((entries) => {
				for (const entry of entries) if (entry.isIntersecting) activeSection.value = entry.target.id;
			}, {
				rootMargin: "-40% 0px -50% 0px",
				threshold: 0
			});
			for (const id of sectionIds) {
				const el = document.getElementById(id);
				if (el) observer.observe(el);
			}
		}
		onMounted(setupObserver);
		watch(() => route.name, () => {
			setupObserver();
		});
		onUnmounted(() => {
			observer?.disconnect();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "nav" }, _attrs))} data-v-e8ba0134><div class="container nav__inner" data-v-e8ba0134>`);
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/",
				class: "nav__prompt",
				"aria-label": "Home"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt" data-v-e8ba0134${_scopeId}><span class="prompt-user" data-v-e8ba0134${_scopeId}>guest</span><span class="prompt-symbol" data-v-e8ba0134${_scopeId}>@</span><span class="prompt-path" data-v-e8ba0134${_scopeId}>portfolio</span><span class="prompt-symbol" data-v-e8ba0134${_scopeId}>:~\$</span></span>`);
					else return [createVNode("span", { class: "prompt" }, [
						createVNode("span", { class: "prompt-user" }, "guest"),
						createVNode("span", { class: "prompt-symbol" }, "@"),
						createVNode("span", { class: "prompt-path" }, "portfolio"),
						createVNode("span", { class: "prompt-symbol" }, ":~$")
					])];
				}),
				_: 1
			}, _parent));
			_push(`<button class="nav__toggle"${ssrRenderAttr("aria-expanded", menuOpen.value)} aria-controls="nav-menu" aria-label="Toggle navigation" data-v-e8ba0134><span class="${ssrRenderClass([{ open: menuOpen.value }, "nav__toggle-icon"])}" data-v-e8ba0134></span></button><nav id="nav-menu" class="${ssrRenderClass([{ open: menuOpen.value }, "nav__links"])}" data-v-e8ba0134><!--[-->`);
			ssrRenderList(unref(NAV_ITEMS), (link) => {
				_push(ssrRenderComponent(unref(RouterLink), {
					key: link.href,
					to: {
						path: "/",
						hash: link.href
					},
					class: ["nav__link", { active: isNavActive(link.href) }],
					onClick: closeMenu
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="prompt-symbol" data-v-e8ba0134${_scopeId}>\$</span> ${ssrInterpolate(link.label)}`);
						else return [createVNode("span", { class: "prompt-symbol" }, "$"), createTextVNode(" " + toDisplayString(link.label), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></nav></div></header>`);
		};
	}
});
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/SiteNav.vue
var _sfc_setup$21 = SiteNav_vue_vue_type_script_setup_true_lang_default.setup;
SiteNav_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/SiteNav.vue");
	return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
};
var SiteNav_default = /*#__PURE__*/ _plugin_vue_export_helper_default(SiteNav_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e8ba0134"]]);
//#endregion
//#region src/api/portfolio.ts
function throwIfError$1(error) {
	if (error) throw new Error(error.message);
}
async function fetchPortfolioContent() {
	const [profileRes, socialsRes, experiencesRes, skillsRes, projectsRes] = await Promise.all([
		supabase.from("profiles").select("*").limit(1).single(),
		supabase.from("social_links").select("label, href").order("sort_order"),
		supabase.from("experiences").select("company, role, period, location, bullets").order("sort_order"),
		supabase.from("skill_groups").select("category, skills").order("sort_order"),
		supabase.from("projects").select("slug, name, description, body, highlights, stack, repo, demo").order("sort_order")
	]);
	throwIfError$1(profileRes.error);
	throwIfError$1(socialsRes.error);
	throwIfError$1(experiencesRes.error);
	throwIfError$1(skillsRes.error);
	throwIfError$1(projectsRes.error);
	if (!profileRes.data) throw new Error("No portfolio profile found in Supabase");
	const profile = profileRes.data;
	return {
		name: profile.name,
		title: profile.title,
		yearsExperience: profile.years_experience,
		location: profile.location,
		tagline: profile.tagline,
		about: profile.about,
		email: profile.email,
		resume: profile.resume,
		socials: socialsRes.data ?? [],
		experience: experiencesRes.data ?? [],
		skills: skillsRes.data ?? [],
		projects: projectsRes.data ?? []
	};
}
async function fetchProjectBySlug(slug) {
	const { data, error } = await supabase.from("projects").select("slug, name, description, body, highlights, stack, repo, demo").eq("slug", slug).maybeSingle();
	throwIfError$1(error);
	return data;
}
//#endregion
//#region src/composables/usePortfolio.ts
var portfolioKey = Symbol("portfolio");
function providePortfolio() {
	const content = ref(null);
	const loading = ref(true);
	const error = ref(null);
	function getProjectBySlug(slug) {
		return content.value?.projects.find((p) => p.slug === slug);
	}
	async function fetchProject(slug) {
		const cached = getProjectBySlug(slug);
		if (cached) return cached;
		return fetchProjectBySlug(slug);
	}
	async function load() {
		loading.value = true;
		error.value = null;
		try {
			content.value = await fetchPortfolioContent();
		} catch (e) {
			error.value = e instanceof Error ? e.message : "Failed to load portfolio content";
		} finally {
			loading.value = false;
		}
	}
	const state = {
		content,
		loading,
		error,
		getProjectBySlug,
		fetchProject
	};
	provide(portfolioKey, state);
	load();
	return state;
}
function usePortfolio() {
	const state = inject(portfolioKey);
	if (!state) throw new Error("usePortfolio() must be used within a component that calls providePortfolio()");
	return state;
}
//#endregion
//#region src/components/SiteFooter.vue?vue&type=script&setup=true&lang.ts
var SiteFooter_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SiteFooter",
	__ssrInlineRender: true,
	setup(__props) {
		const { content } = usePortfolio();
		const year = (/* @__PURE__ */ new Date()).getFullYear();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-fe38b5bf><div class="container footer__inner" data-v-fe38b5bf><p class="footer__text" data-v-fe38b5bf><span class="prompt-symbol" data-v-fe38b5bf>//</span> ${ssrInterpolate(unref(content).name)} · ${ssrInterpolate(unref(year))} · built with Vue 3 + Vite </p><p class="footer__status" data-v-fe38b5bf><span class="footer__dot" data-v-fe38b5bf></span> status: available </p></div></footer>`);
		};
	}
});
//#endregion
//#region src/components/SiteFooter.vue
var _sfc_setup$20 = SiteFooter_vue_vue_type_script_setup_true_lang_default.setup;
SiteFooter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/SiteFooter.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
var SiteFooter_default = /*#__PURE__*/ _plugin_vue_export_helper_default(SiteFooter_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-fe38b5bf"]]);
//#endregion
//#region src/layouts/PublicLayout.vue?vue&type=script&setup=true&lang.ts
var PublicLayout_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PublicLayout",
	__ssrInlineRender: true,
	setup(__props) {
		const { content, loading, error } = providePortfolio();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RouterView = resolveComponent("RouterView");
			_push(`<!--[--><a href="#main" class="skip-link" data-v-70167033>Skip to contents</a>`);
			if (unref(loading)) _push(`<div class="state-screen" data-v-70167033><div class="container" data-v-70167033><p class="state-screen__prompt prompt" data-v-70167033><span class="prompt-user" data-v-70167033>guest</span><span class="prompt-symbol" data-v-70167033>@</span><span class="prompt-path" data-v-70167033>portfolio</span><span class="prompt-symbol" data-v-70167033>:~\$</span> loading portfolio data<span class="cursor-blink" data-v-70167033></span></p></div></div>`);
			else if (unref(error)) _push(`<div class="state-screen" data-v-70167033><div class="container" data-v-70167033><p class="state-screen__prompt prompt" data-v-70167033><span class="prompt-user" data-v-70167033>guest</span><span class="prompt-symbol" data-v-70167033>@</span><span class="prompt-path" data-v-70167033>portfolio</span><span class="prompt-symbol" data-v-70167033>:~\$</span> fetch content </p><p class="state-screen__error" data-v-70167033>error: ${ssrInterpolate(unref(error))}</p><p class="state-screen__hint" data-v-70167033> Check <code data-v-70167033>VITE_SUPABASE_URL</code> and <code data-v-70167033>VITE_SUPABASE_PUBLISHABLE_KEY</code> are set, then run <code data-v-70167033>supabase/schema.sql</code> in the SQL Editor. </p></div></div>`);
			else if (unref(content)) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(SiteNav_default, null, null, _parent));
				_push(`<main id="main" data-v-70167033>`);
				_push(ssrRenderComponent(_component_RouterView, null, null, _parent));
				_push(`</main>`);
				_push(ssrRenderComponent(SiteFooter_default, null, null, _parent));
				_push(`<!--]-->`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/layouts/PublicLayout.vue
var _sfc_setup$19 = PublicLayout_vue_vue_type_script_setup_true_lang_default.setup;
PublicLayout_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/layouts/PublicLayout.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
var PublicLayout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(PublicLayout_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-70167033"]]);
//#endregion
//#region src/layouts/AdminLayout.vue?vue&type=script&setup=true&lang.ts
var AdminLayout_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminLayout",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const { user, signOut } = useAuth();
		const navItems = [
			{
				label: "dashboard",
				to: "/admin"
			},
			{
				label: "profile",
				to: "/admin/profile"
			},
			{
				label: "socials",
				to: "/admin/socials"
			},
			{
				label: "experience",
				to: "/admin/experience"
			},
			{
				label: "skills",
				to: "/admin/skills"
			},
			{
				label: "projects",
				to: "/admin/projects"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-shell" }, _attrs))} data-v-b30a4b23><aside class="admin-sidebar" data-v-b30a4b23><div class="admin-sidebar__header" data-v-b30a4b23>`);
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/admin",
				class: "admin-sidebar__brand"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-b30a4b23${_scopeId}>\$</span> admin `);
					else return [createVNode("span", { class: "prompt-symbol" }, "$"), createTextVNode(" admin ")];
				}),
				_: 1
			}, _parent));
			_push(`<p class="admin-sidebar__user" data-v-b30a4b23>${ssrInterpolate(unref(user)?.email)}</p></div><nav class="admin-sidebar__nav" data-v-b30a4b23><!--[-->`);
			ssrRenderList(navItems, (item) => {
				_push(ssrRenderComponent(unref(RouterLink), {
					key: item.to,
					to: item.to,
					class: ["admin-sidebar__link", { active: unref(route).path === item.to || item.to !== "/admin" && unref(route).path.startsWith(item.to) }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="prompt-symbol" data-v-b30a4b23${_scopeId}>&gt;</span> ${ssrInterpolate(item.label)}`);
						else return [createVNode("span", { class: "prompt-symbol" }, ">"), createTextVNode(" " + toDisplayString(item.label), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></nav><div class="admin-sidebar__footer" data-v-b30a4b23>`);
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/",
				class: "admin-sidebar__link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-b30a4b23${_scopeId}>\$</span> view site `);
					else return [createVNode("span", { class: "prompt-symbol" }, "$"), createTextVNode(" view site ")];
				}),
				_: 1
			}, _parent));
			_push(`<button type="button" class="btn btn--sm admin-sidebar__logout" data-v-b30a4b23> logout </button></div></aside><main class="admin-main" data-v-b30a4b23>`);
			_push(ssrRenderComponent(unref(RouterView), null, null, _parent));
			_push(`</main></div>`);
		};
	}
});
//#endregion
//#region src/layouts/AdminLayout.vue
var _sfc_setup$18 = AdminLayout_vue_vue_type_script_setup_true_lang_default.setup;
AdminLayout_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/layouts/AdminLayout.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
var AdminLayout_default = /*#__PURE__*/ _plugin_vue_export_helper_default(AdminLayout_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b30a4b23"]]);
//#endregion
//#region src/components/HeroSection.vue?vue&type=script&setup=true&lang.ts
var command = "whoami";
var HeroSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "HeroSection",
	__ssrInlineRender: true,
	setup(__props) {
		const { content } = usePortfolio();
		const typedText = ref("");
		const done = ref(false);
		onMounted(() => {
			let i = 0;
			const interval = setInterval(() => {
				if (i < 6) {
					typedText.value += command[i];
					i++;
				} else {
					done.value = true;
					clearInterval(interval);
				}
			}, 80);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "hero" }, _attrs))} data-v-bff6b136><div class="container" data-v-bff6b136><p class="hero__prompt prompt" data-v-bff6b136><span class="prompt-user" data-v-bff6b136>guest</span><span class="prompt-symbol" data-v-bff6b136>@</span><span class="prompt-path" data-v-bff6b136>portfolio</span><span class="prompt-symbol" data-v-bff6b136>:~\$</span><span class="hero__cmd" data-v-bff6b136>${ssrInterpolate(typedText.value)}`);
			if (!done.value) _push(`<span class="cursor-blink" data-v-bff6b136></span>`);
			else _push(`<span class="hero__cursor" data-v-bff6b136>▋</span>`);
			_push(`</span></p><h1 class="hero__name" data-v-bff6b136>${ssrInterpolate(unref(content).name)}</h1><p class="hero__title" data-v-bff6b136><span class="tag" data-v-bff6b136>${ssrInterpolate(unref(content).title)}</span><span class="hero__sep" data-v-bff6b136>·</span><span data-v-bff6b136>${ssrInterpolate(unref(content).yearsExperience)}</span><span class="hero__sep" data-v-bff6b136>·</span><span data-v-bff6b136>${ssrInterpolate(unref(content).location)}</span></p><p class="hero__tagline" data-v-bff6b136>${ssrInterpolate(unref(content).tagline)}</p><div class="hero__actions" data-v-bff6b136><a${ssrRenderAttr("href", unref(content).resume)} class="btn btn--filled" data-v-bff6b136>\$ cat resume.pdf</a><a href="#contact" class="btn" data-v-bff6b136>\$ ./contact.sh</a></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/HeroSection.vue
var _sfc_setup$17 = HeroSection_vue_vue_type_script_setup_true_lang_default.setup;
HeroSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/HeroSection.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
var HeroSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(HeroSection_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-bff6b136"]]);
//#endregion
//#region src/components/AboutSection.vue?vue&type=script&setup=true&lang.ts
var AboutSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AboutSection",
	__ssrInlineRender: true,
	setup(__props) {
		const { content } = usePortfolio();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "about",
				class: "section"
			}, _attrs))} data-v-ecf9a309><div class="container" data-v-ecf9a309><h2 class="section-label" data-v-ecf9a309>about</h2><div class="about" data-v-ecf9a309><!--[-->`);
			ssrRenderList(unref(content).about, (para, i) => {
				_push(`<p class="about__para" data-v-ecf9a309><span class="about__line-num" data-v-ecf9a309>${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span> ${ssrInterpolate(para)}</p>`);
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/AboutSection.vue
var _sfc_setup$16 = AboutSection_vue_vue_type_script_setup_true_lang_default.setup;
AboutSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/AboutSection.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
var AboutSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(AboutSection_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ecf9a309"]]);
//#endregion
//#region src/components/ExperienceSection.vue?vue&type=script&setup=true&lang.ts
var ExperienceSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ExperienceSection",
	__ssrInlineRender: true,
	setup(__props) {
		const { content } = usePortfolio();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "experience",
				class: "section"
			}, _attrs))} data-v-6080d9cf><div class="container" data-v-6080d9cf><h2 class="section-label" data-v-6080d9cf>experience</h2><div class="timeline" data-v-6080d9cf><!--[-->`);
			ssrRenderList(unref(content).experience, (job, i) => {
				_push(`<article class="timeline__item" data-v-6080d9cf><div class="timeline__marker" data-v-6080d9cf><span class="timeline__dot" data-v-6080d9cf></span>`);
				if (i < unref(content).experience.length - 1) _push(`<span class="timeline__line" data-v-6080d9cf></span>`);
				else _push(`<!---->`);
				_push(`</div><div class="timeline__body" data-v-6080d9cf><header class="timeline__header" data-v-6080d9cf><div data-v-6080d9cf><h3 class="timeline__role" data-v-6080d9cf>${ssrInterpolate(job.role)}</h3><p class="timeline__company" data-v-6080d9cf><span class="prompt-symbol" data-v-6080d9cf>@</span>${ssrInterpolate(job.company)}</p></div><div class="timeline__meta" data-v-6080d9cf><span class="tag" data-v-6080d9cf>${ssrInterpolate(job.period)}</span><span class="timeline__location" data-v-6080d9cf>${ssrInterpolate(job.location)}</span></div></header><ul class="timeline__bullets" data-v-6080d9cf><!--[-->`);
				ssrRenderList(job.bullets, (bullet, j) => {
					_push(`<li class="timeline__bullet" data-v-6080d9cf><span class="timeline__bullet-marker" data-v-6080d9cf>&gt;</span> ${ssrInterpolate(bullet)}</li>`);
				});
				_push(`<!--]--></ul></div></article>`);
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/ExperienceSection.vue
var _sfc_setup$15 = ExperienceSection_vue_vue_type_script_setup_true_lang_default.setup;
ExperienceSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ExperienceSection.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
var ExperienceSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(ExperienceSection_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6080d9cf"]]);
//#endregion
//#region src/components/SkillsSection.vue?vue&type=script&setup=true&lang.ts
var SkillsSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SkillsSection",
	__ssrInlineRender: true,
	setup(__props) {
		const { content } = usePortfolio();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "skills",
				class: "section"
			}, _attrs))} data-v-52afd394><div class="container" data-v-52afd394><h2 class="section-label" data-v-52afd394>skills</h2><div class="skills" data-v-52afd394><!--[-->`);
			ssrRenderList(unref(content).skills, (group) => {
				_push(`<div class="skills__group" data-v-52afd394><h3 class="skills__category" data-v-52afd394><span class="prompt-symbol" data-v-52afd394>\$</span> ls ${ssrInterpolate(group.category.toLowerCase())}/ </h3><div class="skills__tags" data-v-52afd394><!--[-->`);
				ssrRenderList(group.skills, (skill) => {
					_push(`<span class="tag" data-v-52afd394>${ssrInterpolate(skill)}</span>`);
				});
				_push(`<!--]--></div></div>`);
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/SkillsSection.vue
var _sfc_setup$14 = SkillsSection_vue_vue_type_script_setup_true_lang_default.setup;
SkillsSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/SkillsSection.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
var SkillsSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(SkillsSection_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-52afd394"]]);
//#endregion
//#region src/components/ProjectsSection.vue?vue&type=script&setup=true&lang.ts
var ProjectsSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ProjectsSection",
	__ssrInlineRender: true,
	setup(__props) {
		const { content } = usePortfolio();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "projects",
				class: "section"
			}, _attrs))} data-v-2b95be71><div class="container" data-v-2b95be71><h2 class="section-label" data-v-2b95be71>projects</h2><div class="projects" data-v-2b95be71><!--[-->`);
			ssrRenderList(unref(content).projects, (project) => {
				_push(ssrRenderComponent(unref(RouterLink), {
					key: project.slug,
					to: {
						name: "project-detail",
						params: { slug: project.slug }
					},
					class: "project"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<header class="project__header" data-v-2b95be71${_scopeId}><h3 class="project__name" data-v-2b95be71${_scopeId}><span class="prompt-symbol" data-v-2b95be71${_scopeId}>./</span>${ssrInterpolate(project.name)}</h3><span class="project__view" data-v-2b95be71${_scopeId}>[view]</span></header><p class="project__desc" data-v-2b95be71${_scopeId}>${ssrInterpolate(project.description)}</p><div class="project__stack" data-v-2b95be71${_scopeId}><!--[-->`);
							ssrRenderList(project.stack, (tech) => {
								_push(`<span class="tag" data-v-2b95be71${_scopeId}>${ssrInterpolate(tech)}</span>`);
							});
							_push(`<!--]--></div>`);
						} else return [
							createVNode("header", { class: "project__header" }, [createVNode("h3", { class: "project__name" }, [createVNode("span", { class: "prompt-symbol" }, "./"), createTextVNode(toDisplayString(project.name), 1)]), createVNode("span", { class: "project__view" }, "[view]")]),
							createVNode("p", { class: "project__desc" }, toDisplayString(project.description), 1),
							createVNode("div", { class: "project__stack" }, [(openBlock(true), createBlock(Fragment, null, renderList(project.stack, (tech) => {
								return openBlock(), createBlock("span", {
									key: tech,
									class: "tag"
								}, toDisplayString(tech), 1);
							}), 128))])
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/ProjectsSection.vue
var _sfc_setup$13 = ProjectsSection_vue_vue_type_script_setup_true_lang_default.setup;
ProjectsSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ProjectsSection.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var ProjectsSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(ProjectsSection_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2b95be71"]]);
//#endregion
//#region src/components/ContactSection.vue?vue&type=script&setup=true&lang.ts
var ContactSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ContactSection",
	__ssrInlineRender: true,
	setup(__props) {
		const { content } = usePortfolio();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "contact",
				class: "section"
			}, _attrs))} data-v-d26c0715><div class="container" data-v-d26c0715><h2 class="section-label" data-v-d26c0715>contact</h2><div class="contact" data-v-d26c0715><p class="contact__prompt prompt" data-v-d26c0715><span class="prompt-user" data-v-d26c0715>guest</span><span class="prompt-symbol" data-v-d26c0715>@</span><span class="prompt-path" data-v-d26c0715>portfolio</span><span class="prompt-symbol" data-v-d26c0715>:~\$</span> echo &quot;Let&#39;s build something.&quot; </p><p class="contact__msg" data-v-d26c0715>Let&#39;s build something.</p><p class="contact__sub" data-v-d26c0715> Open to full-time roles and interesting contract work. Drop a line — I actually read my inbox. </p><a${ssrRenderAttr("href", `mailto:${unref(content).email}`)} class="btn btn--filled contact__email" data-v-d26c0715> \$ mail ${ssrInterpolate(unref(content).email)}</a><div class="contact__socials" data-v-d26c0715><!--[-->`);
			ssrRenderList(unref(content).socials, (social) => {
				_push(`<a${ssrRenderAttr("href", social.href)} target="_blank" rel="noopener noreferrer" class="contact__social" data-v-d26c0715>${ssrInterpolate(social.label)}</a>`);
			});
			_push(`<!--]--></div></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/ContactSection.vue
var _sfc_setup$12 = ContactSection_vue_vue_type_script_setup_true_lang_default.setup;
ContactSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ContactSection.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
var ContactSection_default = /*#__PURE__*/ _plugin_vue_export_helper_default(ContactSection_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-d26c0715"]]);
//#endregion
//#region src/views/HomeView.vue?vue&type=script&setup=true&lang.ts
var HomeView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "HomeView",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(HeroSection_default, null, null, _parent));
			_push(ssrRenderComponent(AboutSection_default, null, null, _parent));
			_push(ssrRenderComponent(ExperienceSection_default, null, null, _parent));
			_push(ssrRenderComponent(SkillsSection_default, null, null, _parent));
			_push(ssrRenderComponent(ProjectsSection_default, null, null, _parent));
			_push(ssrRenderComponent(ContactSection_default, null, null, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/views/HomeView.vue
var _sfc_setup$11 = HomeView_vue_vue_type_script_setup_true_lang_default.setup;
HomeView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/HomeView.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var HomeView_default = HomeView_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/lib/markdown.ts
marked.setOptions({
	gfm: true,
	breaks: true
});
function renderMarkdown(markdown) {
	const html = marked.parse(markdown);
	return DOMPurify.sanitize(html);
}
//#endregion
//#region src/views/ProjectDetailView.vue?vue&type=script&setup=true&lang.ts
var ProjectDetailView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ProjectDetailView",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const { getProjectBySlug, fetchProject } = usePortfolio();
		const project = ref(null);
		const loading = ref(true);
		const renderedBody = computed(() => project.value?.body ? renderMarkdown(project.value.body) : "");
		async function loadProject(slug) {
			loading.value = true;
			project.value = getProjectBySlug(slug) ?? await fetchProject(slug);
			loading.value = false;
		}
		watch(() => route.params.slug, (slug) => {
			if (typeof slug === "string") loadProject(slug);
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "detail section" }, _attrs))} data-v-8e4a9ad6><div class="container" data-v-8e4a9ad6>`);
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/#projects",
				class: "detail__back"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-8e4a9ad6${_scopeId}>\$</span> cd ../projects `);
					else return [createVNode("span", { class: "prompt-symbol" }, "$"), createTextVNode(" cd ../projects ")];
				}),
				_: 1
			}, _parent));
			if (loading.value) _push(`<div class="detail__loading" data-v-8e4a9ad6><p class="detail__prompt prompt" data-v-8e4a9ad6><span class="prompt-user" data-v-8e4a9ad6>guest</span><span class="prompt-symbol" data-v-8e4a9ad6>@</span><span class="prompt-path" data-v-8e4a9ad6>portfolio</span><span class="prompt-symbol" data-v-8e4a9ad6>:~\$</span> cat ./${ssrInterpolate(unref(route).params.slug)}/README.md<span class="cursor-blink" data-v-8e4a9ad6></span></p></div>`);
			else if (project.value) {
				_push(`<!--[--><p class="detail__prompt prompt" data-v-8e4a9ad6><span class="prompt-user" data-v-8e4a9ad6>guest</span><span class="prompt-symbol" data-v-8e4a9ad6>@</span><span class="prompt-path" data-v-8e4a9ad6>portfolio</span><span class="prompt-symbol" data-v-8e4a9ad6>:~\$</span> cat ./${ssrInterpolate(project.value.slug)}/README.md </p><h1 class="detail__name" data-v-8e4a9ad6><span class="prompt-symbol" data-v-8e4a9ad6>./</span>${ssrInterpolate(project.value.name)}</h1><p class="detail__desc" data-v-8e4a9ad6>${ssrInterpolate(project.value.description)}</p><div class="detail__stack" data-v-8e4a9ad6><!--[-->`);
				ssrRenderList(project.value.stack, (tech) => {
					_push(`<span class="tag" data-v-8e4a9ad6>${ssrInterpolate(tech)}</span>`);
				});
				_push(`<!--]--></div><div class="detail__body" data-v-8e4a9ad6><h2 class="detail__heading" data-v-8e4a9ad6><span class="prompt-symbol" data-v-8e4a9ad6>//</span> overview </h2><div class="detail__body-content markdown-body" data-v-8e4a9ad6>${renderedBody.value ?? ""}</div><h2 class="detail__heading" data-v-8e4a9ad6><span class="prompt-symbol" data-v-8e4a9ad6>//</span> highlights </h2><ul class="detail__highlights" data-v-8e4a9ad6><!--[-->`);
				ssrRenderList(project.value.highlights, (item, i) => {
					_push(`<li class="detail__highlight" data-v-8e4a9ad6><span class="detail__marker" data-v-8e4a9ad6>&gt;</span> ${ssrInterpolate(item)}</li>`);
				});
				_push(`<!--]--></ul></div><div class="detail__actions" data-v-8e4a9ad6><a${ssrRenderAttr("href", project.value.repo)} target="_blank" rel="noopener noreferrer" class="btn" data-v-8e4a9ad6> \$ git clone [repo] </a>`);
				if (project.value.demo !== "#") _push(`<a${ssrRenderAttr("href", project.value.demo)} target="_blank" rel="noopener noreferrer" class="btn btn--filled" data-v-8e4a9ad6> \$ open demo </a>`);
				else _push(`<!---->`);
				_push(`</div><!--]-->`);
			} else {
				_push(`<div class="detail__not-found" data-v-8e4a9ad6><p class="detail__prompt prompt" data-v-8e4a9ad6><span class="prompt-user" data-v-8e4a9ad6>guest</span><span class="prompt-symbol" data-v-8e4a9ad6>@</span><span class="prompt-path" data-v-8e4a9ad6>portfolio</span><span class="prompt-symbol" data-v-8e4a9ad6>:~\$</span> cat ./${ssrInterpolate(unref(route).params.slug)}/README.md </p><p class="detail__error" data-v-8e4a9ad6>error: project not found</p>`);
				_push(ssrRenderComponent(unref(RouterLink), {
					to: "/#projects",
					class: "btn"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`\$ cd ../projects`);
						else return [createTextVNode("$ cd ../projects")];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			}
			_push(`</div></section>`);
		};
	}
});
//#endregion
//#region src/views/ProjectDetailView.vue
var _sfc_setup$10 = ProjectDetailView_vue_vue_type_script_setup_true_lang_default.setup;
ProjectDetailView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ProjectDetailView.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var ProjectDetailView_default = /*#__PURE__*/ _plugin_vue_export_helper_default(ProjectDetailView_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8e4a9ad6"]]);
//#endregion
//#region src/views/admin/AdminLoginView.vue?vue&type=script&setup=true&lang.ts
var AdminLoginView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminLoginView",
	__ssrInlineRender: true,
	setup(__props) {
		useRoute();
		useRouter();
		const { signIn, loading } = useAuth();
		const email = ref("");
		const password = ref("");
		const error = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RouterLink = resolveComponent("RouterLink");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "login" }, _attrs))} data-v-9a78bccb><div class="login__card" data-v-9a78bccb><p class="login__prompt prompt" data-v-9a78bccb><span class="prompt-user" data-v-9a78bccb>admin</span><span class="prompt-symbol" data-v-9a78bccb>@</span><span class="prompt-path" data-v-9a78bccb>portfolio</span><span class="prompt-symbol" data-v-9a78bccb>:~\$</span> auth login </p><h1 class="login__title" data-v-9a78bccb>Sign in</h1><p class="login__subtitle" data-v-9a78bccb>Supabase email + password. JWT session stored locally.</p><form class="admin-form" data-v-9a78bccb><div class="admin-field" data-v-9a78bccb><label for="email" data-v-9a78bccb>Email</label><input id="email"${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email" data-v-9a78bccb></div><div class="admin-field" data-v-9a78bccb><label for="password" data-v-9a78bccb>Password</label><input id="password"${ssrRenderAttr("value", password.value)} type="password" required autocomplete="current-password" data-v-9a78bccb></div>`);
			if (error.value) _push(`<p class="admin-message admin-message--error" data-v-9a78bccb>${ssrInterpolate(error.value)}</p>`);
			else _push(`<!---->`);
			_push(`<div class="admin-actions" data-v-9a78bccb><button type="submit" class="btn btn--filled"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-9a78bccb>${ssrInterpolate(unref(loading) ? "signing in..." : "$ login")}</button>`);
			_push(ssrRenderComponent(_component_RouterLink, {
				to: "/",
				class: "btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`\$ cd ../`);
					else return [createTextVNode("$ cd ../")];
				}),
				_: 1
			}, _parent));
			_push(`</div></form></div></div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminLoginView.vue
var _sfc_setup$9 = AdminLoginView_vue_vue_type_script_setup_true_lang_default.setup;
AdminLoginView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminLoginView.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var AdminLoginView_default = /*#__PURE__*/ _plugin_vue_export_helper_default(AdminLoginView_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-9a78bccb"]]);
//#endregion
//#region src/views/admin/AdminDashboardView.vue?vue&type=script&setup=true&lang.ts
var AdminDashboardView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminDashboardView",
	__ssrInlineRender: true,
	setup(__props) {
		const { user } = useAuth();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))} data-v-debafd32><header class="admin-page__header" data-v-debafd32><h1 class="admin-page__title" data-v-debafd32>Dashboard</h1><p class="admin-page__subtitle" data-v-debafd32>Logged in as ${ssrInterpolate(unref(user)?.email)}</p></header><div class="admin-list" data-v-debafd32>`);
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/admin/profile",
				class: "admin-card admin-card--link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-debafd32${_scopeId}>&gt;</span> Edit profile &amp; about `);
					else return [createVNode("span", { class: "prompt-symbol" }, ">"), createTextVNode(" Edit profile & about ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/admin/socials",
				class: "admin-card admin-card--link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-debafd32${_scopeId}>&gt;</span> Manage social links `);
					else return [createVNode("span", { class: "prompt-symbol" }, ">"), createTextVNode(" Manage social links ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/admin/experience",
				class: "admin-card admin-card--link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-debafd32${_scopeId}>&gt;</span> Manage experience `);
					else return [createVNode("span", { class: "prompt-symbol" }, ">"), createTextVNode(" Manage experience ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/admin/skills",
				class: "admin-card admin-card--link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-debafd32${_scopeId}>&gt;</span> Manage skills `);
					else return [createVNode("span", { class: "prompt-symbol" }, ">"), createTextVNode(" Manage skills ")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/admin/projects",
				class: "admin-card admin-card--link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span class="prompt-symbol" data-v-debafd32${_scopeId}>&gt;</span> Manage projects `);
					else return [createVNode("span", { class: "prompt-symbol" }, ">"), createTextVNode(" Manage projects ")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminDashboardView.vue
var _sfc_setup$8 = AdminDashboardView_vue_vue_type_script_setup_true_lang_default.setup;
AdminDashboardView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminDashboardView.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var AdminDashboardView_default = /*#__PURE__*/ _plugin_vue_export_helper_default(AdminDashboardView_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-debafd32"]]);
//#endregion
//#region src/api/admin.ts
function throwIfError(error) {
	if (error) throw new Error(error.message);
}
async function getProfileId() {
	const { data, error } = await supabase.from("profiles").select("id").limit(1).single();
	throwIfError(error);
	if (!data) throw new Error("No profile found");
	return data.id;
}
async function fetchProfile() {
	const { data, error } = await supabase.from("profiles").select("*").limit(1).single();
	throwIfError(error);
	if (!data) throw new Error("No profile found");
	return data;
}
async function fetchSocialLinks() {
	const { data, error } = await supabase.from("social_links").select("*").order("sort_order", { ascending: true });
	throwIfError(error);
	return data ?? [];
}
async function fetchExperiences() {
	const { data, error } = await supabase.from("experiences").select("*").order("sort_order", { ascending: true });
	throwIfError(error);
	return data ?? [];
}
async function fetchSkillGroups() {
	const { data, error } = await supabase.from("skill_groups").select("*").order("sort_order", { ascending: true });
	throwIfError(error);
	return data ?? [];
}
async function fetchProjects() {
	const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
	throwIfError(error);
	return data ?? [];
}
async function fetchProjectById(id) {
	const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
	throwIfError(error);
	return data;
}
//#endregion
//#region src/views/admin/AdminProfileView.vue?vue&type=script&setup=true&lang.ts
var AdminProfileView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminProfileView",
	__ssrInlineRender: true,
	setup(__props) {
		const loading = ref(true);
		const saving = ref(false);
		const error = ref(null);
		const success = ref(false);
		const profileId = ref("");
		const aboutText = ref("");
		const form = ref({
			name: "",
			title: "",
			years_experience: "",
			location: "",
			tagline: "",
			email: "",
			resume: ""
		});
		onMounted(async () => {
			try {
				const profile = await fetchProfile();
				profileId.value = profile.id;
				form.value = {
					name: profile.name,
					title: profile.title,
					years_experience: profile.years_experience,
					location: profile.location,
					tagline: profile.tagline,
					email: profile.email,
					resume: profile.resume
				};
				aboutText.value = profile.about.join("\n\n");
			} catch (e) {
				error.value = e instanceof Error ? e.message : "Failed to load profile";
			} finally {
				loading.value = false;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}><header class="admin-page__header"><h1 class="admin-page__title">Profile</h1><p class="admin-page__subtitle">Hero section, about, and contact info.</p></header>`);
			if (loading.value) _push(`<p class="admin-page__subtitle">Loading...</p>`);
			else {
				_push(`<form class="admin-form"><div class="admin-field"><label for="name">Name</label><input id="name"${ssrRenderAttr("value", form.value.name)} required></div><div class="admin-field"><label for="title">Title</label><input id="title"${ssrRenderAttr("value", form.value.title)} required></div><div class="admin-field"><label for="years">Years experience</label><input id="years"${ssrRenderAttr("value", form.value.years_experience)} required></div><div class="admin-field"><label for="location">Location</label><input id="location"${ssrRenderAttr("value", form.value.location)} required></div><div class="admin-field"><label for="tagline">Tagline</label><input id="tagline"${ssrRenderAttr("value", form.value.tagline)} required></div><div class="admin-field"><label for="email">Email</label><input id="email"${ssrRenderAttr("value", form.value.email)} type="email" required></div><div class="admin-field"><label for="resume">Resume URL</label><input id="resume"${ssrRenderAttr("value", form.value.resume)}></div><div class="admin-field"><label for="about">About paragraphs (blank line between paragraphs)</label><textarea id="about" rows="8">${ssrInterpolate(aboutText.value)}</textarea></div>`);
				if (error.value) _push(`<p class="admin-message admin-message--error">${ssrInterpolate(error.value)}</p>`);
				else _push(`<!---->`);
				if (success.value) _push(`<p class="admin-message admin-message--success">Profile saved.</p>`);
				else _push(`<!---->`);
				_push(`<div class="admin-actions"><button type="submit" class="btn btn--filled"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "saving..." : "$ save")}</button></div></form>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminProfileView.vue
var _sfc_setup$7 = AdminProfileView_vue_vue_type_script_setup_true_lang_default.setup;
AdminProfileView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminProfileView.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var AdminProfileView_default = AdminProfileView_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/views/admin/AdminSocialsView.vue?vue&type=script&setup=true&lang.ts
var AdminSocialsView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminSocialsView",
	__ssrInlineRender: true,
	setup(__props) {
		const loading = ref(true);
		const saving = ref(false);
		const error = ref(null);
		const success = ref(false);
		const profileId = ref("");
		const links = ref([]);
		onMounted(async () => {
			try {
				profileId.value = await getProfileId();
				const data = await fetchSocialLinks();
				links.value = data.map(({ id, label, href, sort_order }) => ({
					id,
					label,
					href,
					sort_order
				}));
			} catch (e) {
				error.value = e instanceof Error ? e.message : "Failed to load social links";
			} finally {
				loading.value = false;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}><header class="admin-page__header"><h1 class="admin-page__title">Social links</h1><p class="admin-page__subtitle">Links shown in hero and contact sections.</p></header>`);
			if (loading.value) _push(`<p class="admin-page__subtitle">Loading...</p>`);
			else {
				_push(`<form class="admin-form"><div class="admin-list"><!--[-->`);
				ssrRenderList(links.value, (link, i) => {
					_push(`<div class="admin-card"><div class="admin-card__header"><span class="admin-card__title">Link ${ssrInterpolate(i + 1)}</span><div class="admin-card__actions"><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === 0) ? " disabled" : ""}>↑</button><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === links.value.length - 1) ? " disabled" : ""}> ↓ </button><button type="button" class="btn btn--sm btn--danger">×</button></div></div><div class="admin-form"><div class="admin-field"><label>Label</label><input${ssrRenderAttr("value", link.label)} required></div><div class="admin-field"><label>URL</label><input${ssrRenderAttr("value", link.href)} required></div></div></div>`);
				});
				_push(`<!--]--></div><button type="button" class="btn">\$ add link</button>`);
				if (error.value) _push(`<p class="admin-message admin-message--error">${ssrInterpolate(error.value)}</p>`);
				else _push(`<!---->`);
				if (success.value) _push(`<p class="admin-message admin-message--success">Social links saved.</p>`);
				else _push(`<!---->`);
				_push(`<div class="admin-actions"><button type="submit" class="btn btn--filled"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "saving..." : "$ save")}</button></div></form>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminSocialsView.vue
var _sfc_setup$6 = AdminSocialsView_vue_vue_type_script_setup_true_lang_default.setup;
AdminSocialsView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminSocialsView.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var AdminSocialsView_default = AdminSocialsView_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/admin/ChipInput.vue?vue&type=script&setup=true&lang.ts
var ChipInput_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ChipInput",
	__ssrInlineRender: true,
	props: {
		"modelValue": { default: () => [] },
		"modelModifiers": {}
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const items = useModel(__props, "modelValue");
		const input = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-chip-input" }, _attrs))}><!--[-->`);
			ssrRenderList(items.value, (item, i) => {
				_push(`<span class="admin-chip">${ssrInterpolate(item)} <button type="button" aria-label="Remove">×</button></span>`);
			});
			_push(`<!--]--><input${ssrRenderAttr("value", input.value)} type="text" placeholder="Type and press Enter"></div>`);
		};
	}
});
//#endregion
//#region src/components/admin/ChipInput.vue
var _sfc_setup$5 = ChipInput_vue_vue_type_script_setup_true_lang_default.setup;
ChipInput_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/admin/ChipInput.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var ChipInput_default = ChipInput_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/views/admin/AdminExperienceView.vue?vue&type=script&setup=true&lang.ts
var AdminExperienceView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminExperienceView",
	__ssrInlineRender: true,
	setup(__props) {
		const loading = ref(true);
		const saving = ref(false);
		const error = ref(null);
		const success = ref(false);
		const profileId = ref("");
		const items = ref([]);
		onMounted(async () => {
			try {
				profileId.value = await getProfileId();
				const data = await fetchExperiences();
				items.value = data.map(({ id, company, role, period, location, bullets, sort_order }) => ({
					id,
					company,
					role,
					period,
					location,
					bullets,
					sort_order
				}));
			} catch (e) {
				error.value = e instanceof Error ? e.message : "Failed to load experience";
			} finally {
				loading.value = false;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}><header class="admin-page__header"><h1 class="admin-page__title">Experience</h1><p class="admin-page__subtitle">Work history entries and bullet points.</p></header>`);
			if (loading.value) _push(`<p class="admin-page__subtitle">Loading...</p>`);
			else {
				_push(`<form class="admin-form"><div class="admin-list"><!--[-->`);
				ssrRenderList(items.value, (item, i) => {
					_push(`<div class="admin-card"><div class="admin-card__header"><span class="admin-card__title">${ssrInterpolate(item.company || `Entry ${i + 1}`)}</span><div class="admin-card__actions"><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === 0) ? " disabled" : ""}>↑</button><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === items.value.length - 1) ? " disabled" : ""}> ↓ </button><button type="button" class="btn btn--sm btn--danger">×</button></div></div><div class="admin-form"><div class="admin-field"><label>Company</label><input${ssrRenderAttr("value", item.company)} required></div><div class="admin-field"><label>Role</label><input${ssrRenderAttr("value", item.role)} required></div><div class="admin-field"><label>Period</label><input${ssrRenderAttr("value", item.period)} required></div><div class="admin-field"><label>Location</label><input${ssrRenderAttr("value", item.location)} required></div><div class="admin-field"><label>Bullets</label>`);
					_push(ssrRenderComponent(ChipInput_default, {
						modelValue: item.bullets,
						"onUpdate:modelValue": ($event) => item.bullets = $event
					}, null, _parent));
					_push(`</div></div></div>`);
				});
				_push(`<!--]--></div><button type="button" class="btn">\$ add entry</button>`);
				if (error.value) _push(`<p class="admin-message admin-message--error">${ssrInterpolate(error.value)}</p>`);
				else _push(`<!---->`);
				if (success.value) _push(`<p class="admin-message admin-message--success">Experience saved.</p>`);
				else _push(`<!---->`);
				_push(`<div class="admin-actions"><button type="submit" class="btn btn--filled"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "saving..." : "$ save")}</button></div></form>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminExperienceView.vue
var _sfc_setup$4 = AdminExperienceView_vue_vue_type_script_setup_true_lang_default.setup;
AdminExperienceView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminExperienceView.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var AdminExperienceView_default = AdminExperienceView_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/views/admin/AdminSkillsView.vue?vue&type=script&setup=true&lang.ts
var AdminSkillsView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminSkillsView",
	__ssrInlineRender: true,
	setup(__props) {
		const loading = ref(true);
		const saving = ref(false);
		const error = ref(null);
		const success = ref(false);
		const profileId = ref("");
		const items = ref([]);
		onMounted(async () => {
			try {
				profileId.value = await getProfileId();
				const data = await fetchSkillGroups();
				items.value = data.map(({ id, category, skills, sort_order }) => ({
					id,
					category,
					skills,
					sort_order
				}));
			} catch (e) {
				error.value = e instanceof Error ? e.message : "Failed to load skills";
			} finally {
				loading.value = false;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}><header class="admin-page__header"><h1 class="admin-page__title">Skills</h1><p class="admin-page__subtitle">Skill groups and tags.</p></header>`);
			if (loading.value) _push(`<p class="admin-page__subtitle">Loading...</p>`);
			else {
				_push(`<form class="admin-form"><div class="admin-list"><!--[-->`);
				ssrRenderList(items.value, (item, i) => {
					_push(`<div class="admin-card"><div class="admin-card__header"><span class="admin-card__title">${ssrInterpolate(item.category || `Group ${i + 1}`)}</span><div class="admin-card__actions"><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === 0) ? " disabled" : ""}>↑</button><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === items.value.length - 1) ? " disabled" : ""}> ↓ </button><button type="button" class="btn btn--sm btn--danger">×</button></div></div><div class="admin-form"><div class="admin-field"><label>Category</label><input${ssrRenderAttr("value", item.category)} required></div><div class="admin-field"><label>Skills</label>`);
					_push(ssrRenderComponent(ChipInput_default, {
						modelValue: item.skills,
						"onUpdate:modelValue": ($event) => item.skills = $event
					}, null, _parent));
					_push(`</div></div></div>`);
				});
				_push(`<!--]--></div><button type="button" class="btn">\$ add group</button>`);
				if (error.value) _push(`<p class="admin-message admin-message--error">${ssrInterpolate(error.value)}</p>`);
				else _push(`<!---->`);
				if (success.value) _push(`<p class="admin-message admin-message--success">Skills saved.</p>`);
				else _push(`<!---->`);
				_push(`<div class="admin-actions"><button type="submit" class="btn btn--filled"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "saving..." : "$ save")}</button></div></form>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminSkillsView.vue
var _sfc_setup$3 = AdminSkillsView_vue_vue_type_script_setup_true_lang_default.setup;
AdminSkillsView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminSkillsView.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var AdminSkillsView_default = AdminSkillsView_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/views/admin/AdminProjectsView.vue?vue&type=script&setup=true&lang.ts
var AdminProjectsView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminProjectsView",
	__ssrInlineRender: true,
	setup(__props) {
		const loading = ref(true);
		const error = ref(null);
		const projects = ref([]);
		const deletingId = ref(null);
		async function load() {
			loading.value = true;
			error.value = null;
			try {
				projects.value = await fetchProjects();
			} catch (e) {
				error.value = e instanceof Error ? e.message : "Failed to load projects";
			} finally {
				loading.value = false;
			}
		}
		onMounted(load);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))}><header class="admin-page__header"><h1 class="admin-page__title">Projects</h1><p class="admin-page__subtitle">Manage portfolio projects and markdown write-ups.</p></header><div class="admin-actions" style="${ssrRenderStyle({ "margin-bottom": "1.5rem" })}">`);
			_push(ssrRenderComponent(unref(RouterLink), {
				to: "/admin/projects/new",
				class: "btn btn--filled"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`\$ new project`);
					else return [createTextVNode("$ new project")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if (loading.value) _push(`<p class="admin-page__subtitle">Loading...</p>`);
			else _push(`<!---->`);
			if (error.value) _push(`<p class="admin-message admin-message--error">${ssrInterpolate(error.value)}</p>`);
			else {
				_push(`<div class="admin-list"><!--[-->`);
				ssrRenderList(projects.value, (project, i) => {
					_push(`<div class="admin-card"><div class="admin-card__header"><div><span class="admin-card__title">${ssrInterpolate(project.name)}</span><p class="admin-page__subtitle">/${ssrInterpolate(project.slug)}</p></div><div class="admin-card__actions"><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === 0) ? " disabled" : ""}>↑</button><button type="button" class="btn btn--sm"${ssrIncludeBooleanAttr(i === projects.value.length - 1) ? " disabled" : ""}> ↓ </button>`);
					_push(ssrRenderComponent(unref(RouterLink), {
						to: `/admin/projects/${project.id}`,
						class: "btn btn--sm"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`edit`);
							else return [createTextVNode("edit")];
						}),
						_: 2
					}, _parent));
					_push(`<button type="button" class="btn btn--sm btn--danger"${ssrIncludeBooleanAttr(deletingId.value === project.id) ? " disabled" : ""}>${ssrInterpolate(deletingId.value === project.id ? "..." : "delete")}</button></div></div><p class="admin-page__subtitle">${ssrInterpolate(project.description)}</p></div>`);
				});
				_push(`<!--]-->`);
				if (!projects.value.length) _push(`<p class="admin-page__subtitle">No projects yet.</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminProjectsView.vue
var _sfc_setup$2 = AdminProjectsView_vue_vue_type_script_setup_true_lang_default.setup;
AdminProjectsView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminProjectsView.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var AdminProjectsView_default = AdminProjectsView_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/admin/MarkdownEditor.vue?vue&type=script&setup=true&lang.ts
var MarkdownEditor_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "MarkdownEditor",
	__ssrInlineRender: true,
	props: {
		"modelValue": { default: "" },
		"modelModifiers": {}
	},
	emits: ["update:modelValue"],
	setup(__props) {
		const model = useModel(__props, "modelValue");
		const textareaRef = ref(null);
		let editor = null;
		onMounted(() => {
			if (!textareaRef.value) return;
			editor = new EasyMDE({
				element: textareaRef.value,
				initialValue: model.value,
				spellChecker: false,
				status: ["lines", "words"],
				minHeight: "200px",
				toolbar: [
					"bold",
					"italic",
					"heading",
					"|",
					"quote",
					"unordered-list",
					"ordered-list",
					"|",
					"link",
					"code",
					"horizontal-rule",
					"|",
					"preview",
					"side-by-side",
					"fullscreen"
				]
			});
			editor.codemirror.on("change", () => {
				model.value = editor?.value() ?? "";
			});
		});
		watch(model, (value) => {
			if (editor && editor.value() !== value) editor.value(value);
		});
		onUnmounted(() => {
			editor?.toTextArea();
			editor?.cleanup();
			editor = null;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "markdown-editor" }, _attrs))}><textarea></textarea></div>`);
		};
	}
});
//#endregion
//#region src/components/admin/MarkdownEditor.vue
var _sfc_setup$1 = MarkdownEditor_vue_vue_type_script_setup_true_lang_default.setup;
MarkdownEditor_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/admin/MarkdownEditor.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var MarkdownEditor_default = MarkdownEditor_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/views/admin/AdminProjectFormView.vue?vue&type=script&setup=true&lang.ts
var AdminProjectFormView_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AdminProjectFormView",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		useRouter();
		const isNew = computed(() => route.name === "admin-project-new");
		const projectId = computed(() => typeof route.params.id === "string" ? route.params.id : "");
		const loading = ref(true);
		const saving = ref(false);
		const error = ref(null);
		const success = ref(false);
		const profileId = ref("");
		const form = ref({
			slug: "",
			name: "",
			description: "",
			body: "",
			highlights: [],
			stack: [],
			repo: "",
			demo: "#"
		});
		onMounted(async () => {
			try {
				profileId.value = await getProfileId();
				if (!isNew.value) {
					const project = await fetchProjectById(projectId.value);
					if (!project) {
						error.value = "Project not found";
						return;
					}
					form.value = {
						slug: project.slug,
						name: project.name,
						description: project.description,
						body: project.body,
						highlights: [...project.highlights],
						stack: [...project.stack],
						repo: project.repo,
						demo: project.demo
					};
				}
			} catch (e) {
				error.value = e instanceof Error ? e.message : "Failed to load project";
			} finally {
				loading.value = false;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RouterLink = resolveComponent("RouterLink");
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "admin-page",
				style: { "max-width": "56rem" }
			}, _attrs))}><header class="admin-page__header"><h1 class="admin-page__title">${ssrInterpolate(isNew.value ? "New project" : "Edit project")}</h1><p class="admin-page__subtitle">Markdown body renders on the public project detail page.</p></header>`);
			if (loading.value) _push(`<p class="admin-page__subtitle">Loading...</p>`);
			else {
				_push(`<form class="admin-form"><div class="admin-field"><label for="name">Name</label><input id="name"${ssrRenderAttr("value", form.value.name)} required></div><div class="admin-field"><label for="slug">Slug</label><input id="slug"${ssrRenderAttr("value", form.value.slug)} required pattern="[a-z0-9-]+"></div><div class="admin-field"><label for="description">Short description</label><textarea id="description" rows="3" required>${ssrInterpolate(form.value.description)}</textarea></div><div class="admin-field"><label>Stack</label>`);
				_push(ssrRenderComponent(ChipInput_default, {
					modelValue: form.value.stack,
					"onUpdate:modelValue": ($event) => form.value.stack = $event
				}, null, _parent));
				_push(`</div><div class="admin-field"><label>Highlights</label>`);
				_push(ssrRenderComponent(ChipInput_default, {
					modelValue: form.value.highlights,
					"onUpdate:modelValue": ($event) => form.value.highlights = $event
				}, null, _parent));
				_push(`</div><div class="admin-field"><label for="repo">Repo URL</label><input id="repo"${ssrRenderAttr("value", form.value.repo)} required></div><div class="admin-field"><label for="demo">Demo URL</label><input id="demo"${ssrRenderAttr("value", form.value.demo)}></div><div class="admin-field"><label>Body (markdown)</label>`);
				_push(ssrRenderComponent(MarkdownEditor_default, {
					modelValue: form.value.body,
					"onUpdate:modelValue": ($event) => form.value.body = $event
				}, null, _parent));
				_push(`</div>`);
				if (error.value) _push(`<p class="admin-message admin-message--error">${ssrInterpolate(error.value)}</p>`);
				else _push(`<!---->`);
				if (success.value) _push(`<p class="admin-message admin-message--success">Project saved.</p>`);
				else _push(`<!---->`);
				_push(`<div class="admin-actions"><button type="submit" class="btn btn--filled"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "saving..." : "$ save")}</button>`);
				_push(ssrRenderComponent(_component_RouterLink, {
					to: "/admin/projects",
					class: "btn"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`\$ back`);
						else return [createTextVNode("$ back")];
					}),
					_: 1
				}, _parent));
				_push(`</div></form>`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/views/admin/AdminProjectFormView.vue
var _sfc_setup = AdminProjectFormView_vue_vue_type_script_setup_true_lang_default.setup;
AdminProjectFormView_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/admin/AdminProjectFormView.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AdminProjectFormView_default = AdminProjectFormView_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/router/index.ts
var router = createRouter({
	history: createWebHistory("/"),
	routes: [
		{
			path: "/",
			component: PublicLayout_default,
			children: [{
				path: "",
				name: "home",
				component: HomeView_default
			}, {
				path: "projects/:slug",
				name: "project-detail",
				component: ProjectDetailView_default
			}]
		},
		{
			path: "/admin/login",
			name: "admin-login",
			component: AdminLoginView_default,
			meta: { guestOnly: true }
		},
		{
			path: "/admin",
			component: AdminLayout_default,
			meta: { requiresAuth: true },
			children: [
				{
					path: "",
					name: "admin-dashboard",
					component: AdminDashboardView_default
				},
				{
					path: "profile",
					name: "admin-profile",
					component: AdminProfileView_default
				},
				{
					path: "socials",
					name: "admin-socials",
					component: AdminSocialsView_default
				},
				{
					path: "experience",
					name: "admin-experience",
					component: AdminExperienceView_default
				},
				{
					path: "skills",
					name: "admin-skills",
					component: AdminSkillsView_default
				},
				{
					path: "projects",
					name: "admin-projects",
					component: AdminProjectsView_default
				},
				{
					path: "projects/new",
					name: "admin-project-new",
					component: AdminProjectFormView_default
				},
				{
					path: "projects/:id",
					name: "admin-project-edit",
					component: AdminProjectFormView_default
				}
			]
		}
	],
	scrollBehavior(to) {
		if (to.hash) return {
			el: to.hash,
			behavior: "smooth"
		};
		return { top: 0 };
	}
});
//#endregion
//#region node_modules/vite-ssg/dist/shared/vite-ssg.ETIvV-80.mjs
var ClientOnly = defineComponent({ setup(props, { slots }) {
	const mounted = ref(false);
	onMounted(() => mounted.value = true);
	return () => {
		if (!mounted.value) return slots.placeholder && slots.placeholder({});
		return slots.default && slots.default({});
	};
} });
//#endregion
//#region node_modules/vite-ssg/dist/index.mjs
function ViteSSG(App, routerOptions, fn, options) {
	const { transformState, registerComponents = true, useHead = true, rootContainer = "#app" } = options ?? {};
	async function createApp$1(routePath) {
		const app = createSSRApp(App);
		let head;
		if (useHead) app.use(head = createHead());
		const router = createRouter({
			history: createMemoryHistory(routerOptions.base),
			...routerOptions
		});
		const { routes } = routerOptions;
		if (registerComponents) app.component("ClientOnly", ClientOnly);
		const appRenderCallbacks = [];
		const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
		const triggerOnSSRAppRendered = () => {
			return Promise.all(appRenderCallbacks.map((cb) => cb()));
		};
		const context = {
			app,
			head,
			isClient: false,
			router,
			routes,
			onSSRAppRendered,
			triggerOnSSRAppRendered,
			initialState: {},
			transformState,
			routePath
		};
		await fn?.(context);
		app.use(router);
		let entryRoutePath;
		let isFirstRoute = true;
		router.beforeEach((to, from, next) => {
			if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
				isFirstRoute = false;
				entryRoutePath = to.path;
				to.meta.state = context.initialState;
			}
			next();
		});
		{
			const route = context.routePath ?? "/";
			router.push(route);
			await router.isReady();
			context.initialState = router.currentRoute.value.meta.state || {};
		}
		const initialState = context.initialState;
		return {
			...context,
			initialState
		};
	}
	return createApp$1;
}
//#endregion
//#region src/main.ts
var auth = getAuth();
router.beforeEach(async (to) => {
	if (!auth.initialized.value) await auth.init();
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	const guestOnly = to.matched.some((record) => record.meta.guestOnly);
	if (requiresAuth && !auth.session.value) return {
		name: "admin-login",
		query: { redirect: to.fullPath }
	};
	if (guestOnly && auth.session.value) return { name: "admin-dashboard" };
});
var createServer = ViteSSG(App_default, { routes: router.getRoutes() });
var createClient = ViteSSG(App_default, { routes: router.getRoutes() });
//#endregion
export { createClient, createServer };
