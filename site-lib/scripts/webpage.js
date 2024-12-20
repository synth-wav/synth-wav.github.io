"use strict";
(() => {
    var t = (t, e, i) => {
            if (!e.has(t)) throw TypeError("Cannot " + i)
        },
        e = (e, i, s) => (t(e, i, "read from private field"), s ? s.call(e) : i.get(e)),
        i = (t, e, i) => {
            if (e.has(t)) throw TypeError("Cannot add the same private member more than once");
            e instanceof WeakSet ? e.add(t) : e.set(t, i)
        },
        s = (e, i, s, n) => (t(e, i, "write to private field"), n ? n.call(e, s) : i.set(e, s), s),
        n = (e, i, s) => (t(e, i, "access private method"), s);
    async function o(t) {
        return new Promise((e => setTimeout(e, t)))
    }
    async function a(t, e = 100) {
        for (; !t();) await o(e)
    }

    function r(t, e) {
        const i = document.createElement("div");
        i.style.position = "absolute", i.style.visibility = "hidden", i.style.width = t, e.appendChild(i);
        const s = i.offsetWidth;
        return e.removeChild(i), s
    }
    var h = class {
            get width() {
                return this.right - this.left
            }
            set width(t) {
                this.right = this.left + t
            }
            get height() {
                return this.bottom - this.top
            }
            set height(t) {
                this.bottom = this.top + t
            }
            get center() {
                return new c(this.left + this.width / 2, this.top + this.height / 2)
            }
            get min() {
                return new c(this.left, this.top)
            }
            set min(t) {
                this.left = t.x, this.top = t.y
            }
            set position(t) {
                this.min = t
            }
            get max() {
                return new c(this.right, this.bottom)
            }
            set max(t) {
                this.right = t.x, this.bottom = t.y
            }
            get size() {
                return new c(this.width, this.height)
            }
            set size(t) {
                this.width = t.x, this.height = t.y
            }
            constructor(t, e, i, s) {
                this.left = t, this.top = e, this.right = t + i, this.bottom = e + s
            }
            containsPoint(t) {
                return t.x >= this.left && t.x <= this.right && t.y >= this.top && t.y <= this.bottom
            }
            containsBounds(t) {
                return t.left >= this.left && t.right <= this.right && t.top >= this.top && t.bottom <= this.bottom
            }
            encapsulate(t) {
                return this.left = Math.min(this.left, t.left), this.top = Math.min(this.top, t.top), this.right = Math.max(this.right, t.right), this.bottom = Math.max(this.bottom, t.bottom), this
            }
            encapsulatePoint(t) {
                if (!t.isUndefined) return this.left = Math.min(this.left, t.x), this.top = Math.min(this.top, t.y), this.right = Math.max(this.right, t.x), this.bottom = Math.max(this.bottom, t.y), this
            }
            expand(t) {
                return this.left -= t, this.right += t, this.top -= t, this.bottom += t, this
            }
            translate(t) {
                return this.left += t.x, this.right += t.x, this.top += t.y, this.bottom += t.y, this
            }
            scale(t) {
                let e = this.width,
                    i = this.height;
                return this.left += e * (1 - t) / 2, this.right -= e * (1 - t) / 2, this.top += i * (1 - t) / 2, this.bottom -= i * (1 - t) / 2, this
            }
            overlaps(t) {
                return this.left < t.right && this.right > t.left && this.top < t.bottom && this.bottom > t.top
            }
            static fromElement(t) {
                const e = t.getBoundingClientRect();
                return new h(e.x, e.y, e.width, e.height)
            }
            static get screenBounds() {
                return new h(0, 0, window.innerWidth, window.innerHeight)
            }
        },
        l = class {
            constructor(t, e) {
                this.x = t, this.y = e
            }
            add(t) {
                return new l(this.x + t.x, this.y + t.y)
            }
            sub(t) {
                return new l(this.x - t.x, this.y - t.y)
            }
            scale(t) {
                return new l(this.x * t, this.y * t)
            }
            divide(t) {
                return new l(this.x / t, this.y / t)
            }
            get isUndefined() {
                return isNaN(this.x) || isNaN(this.y)
            }
            get magnitude() {
                return Math.sqrt(this.sqrMagnitude)
            }
            get sqrMagnitude() {
                return this.x * this.x + this.y * this.y
            }
            get normalized() {
                const t = this.magnitude;
                return new l(this.x / t, this.y / t)
            }
            get inverse() {
                return new l(-this.x, -this.y)
            }
            static distance(t, e) {
                return t.sub(e).magnitude
            }
            static dot(t, e) {
                return t.x * e.x + t.y * e.y
            }
        },
        c = l;
    c.Undefined = new l(NaN, NaN);
    var d = class {
        constructor(t) {
            this.callbacks = [], this.targetFPS = t, this.measuredFPS = t, this._lastTime = performance.now(), this._deltaTime = 1 / t, this._time = this._lastTime
        }
        get deltaTime() {
            return this._deltaTime / 1e3
        }
        get time() {
            return this._time
        }
        async start() {
            for (;;) {
                this._time = performance.now(), requestAnimationFrame((() => {
                    for (let t of this.callbacks) t(this.deltaTime)
                }));
                const t = this._time - this._lastTime;
                let e = t - 1e3 / this.targetFPS;
                this._lastTime = this._time + Math.max(e, 0), await o(Math.max(0, e)), this._deltaTime = Math.min(t + Math.max(e, 0), 1e3 / this.targetFPS * 3), this.measuredFPS = 1 / this.deltaTime * .1 + .9 * this.measuredFPS
            }
        }
        add(t) {
            this.callbacks.push(t)
        }
    };

    function u(t, e = 500) {
        "none" !== t.style.display && (t.style.transitionProperty = "height, margin, padding", t.style.transitionTimingFunction = "ease-in-out", t.style.transitionDuration = e + "ms", t.style.boxSizing = "border-box", t.style.height = t.offsetHeight + "px", t.offsetHeight, t.style.overflow = "hidden", t.style.height = "0", t.style.paddingTop = "0", t.style.paddingBottom = "0", t.style.marginTop = "0", t.style.marginBottom = "0", window.setTimeout((async () => {
            t.style.display = "none", t.style.removeProperty("height"), t.style.removeProperty("padding-top"), t.style.removeProperty("padding-bottom"), t.style.removeProperty("margin-top"), t.style.removeProperty("margin-bottom"), t.style.removeProperty("overflow"), t.style.removeProperty("transition-duration"), t.style.removeProperty("transition-property")
        }), e))
    }

    function p(t, e = 500) {
        if ("none" !== window.getComputedStyle(t).display) return;
        t.style.removeProperty("display");
        let i = window.getComputedStyle(t).display;
        "none" === i && (i = "block"), t.style.display = i;
        const s = t.offsetHeight;
        t.style.overflow = "hidden", t.style.height = "0", t.style.paddingTop = "0", t.style.paddingBottom = "0", t.style.marginTop = "0", t.style.marginBottom = "0", t.offsetHeight, t.style.boxSizing = "border-box", t.style.transitionProperty = "height, margin, padding", t.style.transitionTimingFunction = "ease-in-out", t.style.transitionDuration = e + "ms", t.style.height = s + "px", t.style.removeProperty("padding-top"), t.style.removeProperty("padding-bottom"), t.style.removeProperty("margin-top"), t.style.removeProperty("margin-bottom"), window.setTimeout((async () => {
            t.style.removeProperty("height"), t.style.removeProperty("overflow"), t.style.removeProperty("transition-duration"), t.style.removeProperty("transition-property")
        }), e)
    }

    function m(t) {
        const e = t instanceof TouchEvent ? Array.from(t.touches) : [],
            i = e.length > 0 && t instanceof TouchEvent ? e.reduce(((t, e) => t + e.clientX), 0) / e.length : t.clientX,
            s = e.length > 0 && t instanceof TouchEvent ? e.reduce(((t, e) => t + e.clientY), 0) / e.length : t.clientY;
        return new c(i, s)
    }

    function g(t) {
        return {
            x: t.clientX,
            y: t.clientY
        }
    }

    function f(t, e, i) {
        let s = 2 * (i /= 2) * (1 - i) + .5;
        return s -= .5, s *= 2, t + (e - t) * s
    }

    function b(t, e, i, s, n) {
        return function(t, e, i) {
            return Math.max(e, Math.min(t, i))
        }(function(t, e, i, s, n) {
            return s + (n - s) * (t - e) / (i - e)
        }(t, e, i, s, n), s, n)
    }
    var y = class {
            constructor(t, e) {
                this.isFocused = !1, this.canvas = t, this.nodeEl = e, this.nodeEl.nodeObj = this, this.labelEl = e.querySelector(".canvas-node-label"), this.containerEl = e.querySelector(".canvas-node-container"), this.contentEl = e.querySelector(".canvas-node-content");
                const i = this.contentEl.classList;
                if (i.contains("image-embed") ? this.type = "image" : i.contains("video-embed") ? this.type = "video" : i.contains("audio-embed") ? this.type = "audio" : i.contains("markdown-embed") && i.contains("external-markdown-embed") ? this.type = "external-markdown" : i.contains("markdown-embed") ? this.type = "markdown" : i.contains("canvas-embed") ? this.type = "canvas" : "IFRAME" === this.contentEl.firstElementChild?.tagName ? this.type = "website" : this.nodeEl.classList.contains("canvas-node-group") ? this.type = "group" : this.type = "none", "external-markdown" == this.type) {
                    const e = this.contentEl.querySelector(".obsidian-document");
                    console.log(e);
                    const i = t.document.children.find((t => t.documentEl == e));
                    i ? this.document = i : console.error("Failed to find document object for external markdown node", this)
                }
                this.initEvents()
            }
            get size() {
                return new c(parseFloat(this.nodeEl.style.width.replace("px", "")), parseFloat(this.nodeEl.style.height.replace("px", "")))
            }
            set size(t) {
                this.nodeEl.style.width = t.x + "px", this.nodeEl.style.height = t.y + "px", this.nodeEl.style.setProperty("--canvas-node-width", t.x + "px"), this.nodeEl.style.setProperty("--canvas-node-height", t.y + "px")
            }
            get position() {
                const t = this.nodeEl.style.transform.match(/translate\(([^,]+)px, ([^,]+)px\)/),
                    e = this.nodeEl.style.translate.match(/([^,]+)px ([^,]+)px/);
                let i = 0,
                    s = 0;
                return t && (i += parseFloat(t[1]), s += parseFloat(t[2])), e && (i += parseFloat(e[1]), s += parseFloat(e[2])), new c(i, s)
            }
            set position(t) {
                this.nodeEl.style.transform = `translate(${t.x}px, ${t.y}px)`
            }
            get bounds() {
                let t = new h(0, 0, 0, 0),
                    e = this.size.scale(this.canvas.scale),
                    i = this.position.scale(this.canvas.scale).add(this.canvas.position);
                return t.position = i, t.size = e, t
            }
            get label() {
                return this.labelEl.textContent ?? ""
            }
            set label(t) {
                this.labelEl.textContent = t
            }
            get isScrollable() {
                return !!this.document && this.document?.documentEl.scrollHeight > this.document?.documentEl.clientHeight
            }
            get scrollContainer() {
                return this.document?.documentEl
            }
            focus(t = !0) {
                this.isFocused && t || (this.canvas.focusedNode != this && this.canvas.focusedNode?.focus(!1), this.nodeEl.classList.toggle("is-focused", t), this.canvas.focusedNode = t ? this : null, this.isFocused = t)
            }
            initEvents() {
                const t = this;

                function e() {
                    console.log("leave"), t.focus(!1), t.nodeEl.removeEventListener("mouseleave", e), t.nodeEl.removeEventListener("touchend", e)
                }
                this.nodeEl.addEventListener("dblclick", (e => {
                    t.fitToView(!1)
                })), this.nodeEl.addEventListener("pointerenter", (function(i) {
                    t.focus(!0), t.nodeEl.addEventListener("mouseleave", e), t.nodeEl.addEventListener("touchend", e), i.stopPropagation()
                }))
            }
            fitToView(t = !1) {
                this.canvas.fitToBounds(this.bounds, .9, t)
            }
        },
        E = class {
            constructor(t) {
                this.hiddenNodes = [], this.focusedNode = null, this._renderScale = 1, this._minScale = .1, this._maxScale = 5, this._targetScale = 1, this._scale = 1, this._targetPosition = new c(0, 0), this._position = new c(0, 0), this._backgroundBaseScale = 20, this._invisibleBackgroundScale = 2, this._backgroundScale = this._backgroundBaseScale, this._backgroundDotSize = 1, this._backgroundPosition = new c(0, 0), this.lastTime = 0, this.document = t, this.nodes = Array.from(t.documentEl.querySelectorAll(".canvas-node")).map((t => new y(this, t))), this.document.documentEl.style.position = "absolute", this.document.documentEl.style.width = "100%", this.document.documentEl.style.height = "100%", this.document.documentEl.style.overflow = "hidden", this.document.documentEl.style.top = "0", this.document.documentEl.style.left = "0", this.canvasEl = t.documentEl.querySelector(".canvas"), this.wrapperEl = t.documentEl.querySelector(".canvas-wrapper"), this.backgroundEl = t.documentEl.querySelector(".canvas-background pattern"), this.backgroundDotEl = this.backgroundEl?.querySelector("circle"), this.canvasEl.setAttribute("style", "translate: 0px 1px; scale: 1;"), this.backgroundScale = this._backgroundScale, this.backgroundDotSize = this._backgroundDotSize, this.renderScale = this._renderScale;
                const e = h.fromElement(this.canvasEl).min.sub(this.nodeBounds.min);
                Array.from(this.canvasEl.children).forEach((t => {
                    t.style.translate = `${e.x}px ${e.y}px`
                })), this.forcePosition = this.nodeBounds.min.sub(this.wrapperBounds.min), requestAnimationFrame(this.updateScale.bind(this)), this.initEvents(), this.wrapperEl.style.transition = "opacity 0.0s", this.wrapperEl.classList.add("hide"), this.wrapperEl.style.transition = "opacity 3s", this.wrapperEl.classList.remove("hide"), this.fitToBounds(this.nodeBounds, 3, !0), setTimeout((() => {
                    this.fitToBounds(this.nodeBounds, .9, !1)
                }), 100)
            }
            get renderScale() {
                return this._renderScale
            }
            set renderScale(t) {
                this._renderScale = t, this.canvasEl.style.zoom = 100 * t + "%", this.scale = this._scale, this.position = this._position
            }
            get nodeBounds() {
                if (0 == this.nodes.length) return new h(0, 0, 0, 0);
                const t = this.nodes[0].bounds;
                for (const e of this.nodes) t.encapsulate(e.bounds);
                return t
            }
            get wrapperBounds() {
                return h.fromElement(this.wrapperEl)
            }
            get minScale() {
                return this._minScale
            }
            get maxScale() {
                return this._maxScale
            }
            get targetScale() {
                return this._targetScale
            }
            set targetScale(t) {
                t = Math.min(Math.max(t, this.minScale), this.maxScale), this._targetScale = t
            }
            get scale() {
                return this._scale
            }
            set scale(t) {
                let e = t / this._scale;
                this._scale = t;
                const i = (t / this.renderScale).toString() ?? "1";
                this.canvasEl.style.scale = i;
                const s = (1 / Math.sqrt(t)).toString() ?? "1";
                this.wrapperEl.style.setProperty("--zoom-multiplier", s), this.canvasEl.classList.toggle("small-scale", this.scale < .15), this.backgroundScale = this.backgroundScale * e
            }
            get targetPosition() {
                return this._targetPosition
            }
            set targetPosition(t) {
                this._targetPosition = t
            }
            get position() {
                return this._position
            }
            set position(t) {
                this._position = t;
                let e = t.divide(this.renderScale);
                this.canvasEl.style.translate = `${e.x}px ${e.y}px`, this.backgroundPosition = this.position
            }
            set forcePosition(t) {
                this.targetPosition = t, this.position = t
            }
            get forcePosition() {
                return this.position
            }
            get backgroundScale() {
                return this._backgroundScale
            }
            set backgroundScale(t) {
                const e = t.toString() ?? "20";
                this.backgroundEl?.setAttribute("width", e), this.backgroundEl?.setAttribute("height", e), this._backgroundScale = t, this.backgroundEl?.parentElement && (this.backgroundEl.parentElement.style.opacity = (1 - b(this._backgroundScale, this._backgroundBaseScale / 2, this._invisibleBackgroundScale, 0, 1)).toString())
            }
            get backgroundDotSize() {
                return this._backgroundDotSize
            }
            set backgroundDotSize(t) {
                const e = t.toString() ?? "0.7";
                this.backgroundDotEl?.setAttribute("r", e), this.backgroundDotEl?.setAttribute("cx", e), this.backgroundDotEl?.setAttribute("cy", e), this._backgroundDotSize = t
            }
            get backgroundPosition() {
                return this._backgroundPosition
            }
            set backgroundPosition(t) {
                this.backgroundEl && (this.backgroundEl?.setAttribute("x", t.x.toString()), this.backgroundEl?.setAttribute("y", t.y.toString()), this._backgroundPosition = t)
            }
            updateScale(t) {
                0 == this.lastTime && (this.lastTime = t);
                const e = (t - this.lastTime) / 1e3;
                var i, s, n;
                this.lastTime = t, Math.abs(this.targetScale - this.scale) > 1e-4 && (this.scale = f(this.scale, this.targetScale, 6 * e)), this.targetPosition.sub(this.position).magnitude > .001 && (this.position = (i = this.position, s = this.targetPosition, n = 6 * e, new c(f(i.x, s.x, n), f(i.y, s.y, n))));
                let o = h.screenBounds;
                this.hiddenNodes.sort(((t, e) => {
                    const i = t.bounds.center,
                        s = e.bounds.center;
                    return i.sub(o.center).magnitude - s.sub(o.center).magnitude
                }));f
                for (let t = 0; t < 50 && !(t >= this.hiddenNodes.length); t++) {
                    const e = this.hiddenNodes[t];
                    if (!e) {
                        this.hiddenNodes.splice(t, 1);
                        continue
                    }
                    const i = e.bounds.expand(100).overlaps(o);
                    e.nodeEl.style.display = i ? "" : "none", i && this.hiddenNodes.splice(t, 1)
                }
                requestAnimationFrame(this.updateScale.bind(this))
            }
            initEvents() {
                const t = new IntersectionObserver((t => {
                    t.forEach((t => {
                        t.target.style.display = t.isIntersecting ? "" : "none", t.isIntersecting || this.hiddenNodes.push(t.target.nodeObj)
                    }))
                }), {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0
                });
                this.nodes.forEach((e => t.observe(e.nodeEl)));
                const e = this,
                    i = navigator.userAgent.includes("Windows");

                function s(t, e, i) {
                    const s = i?.scrollContainer;
                    if (s) {
                        if (0 != s.scrollTop && t < 0 && Math.abs(t / (e + .01)) > 2) return !1;
                        if (s.scrollHeight - s.scrollTop > s.clientHeight + 1 && t > 0 && Math.abs(t / (e + .01)) > 2) return !1;
                        if (0 != s.scrollLeft && e < 0 && Math.abs(e / (t + .01)) > 2) return !1;
                        if (s.scrollWidth - s.scrollLeft > s.clientWidth + 1 && e > 0 && Math.abs(e / (t + .01)) > 2) return !1
                    }
                    return !0
                }
                this.backgroundEl.parentElement?.addEventListener("dblclick", (() => {
                    console.log("fitting to bounds"), e.fitToBounds(this.nodeBounds, .9, !1)
                })), this.wrapperEl.addEventListener("pointerdown", (function(t) {
                    if ("mouse" != t.pointerType && "pen" != t.pointerType) return;
                    const s = m(t),
                        n = e.position,
                        o = e.focusedNode;

                    function a(t) {
                        if (i && o?.isScrollable && 4 == t.buttons) return;
                        t.preventDefault();
                        const a = m(t).sub(s);
                        e.forcePosition = n.add(a)
                    }
                    document.body.addEventListener("mousemove", a), document.body.addEventListener("mouseup", (function t(e) {
                        document.body.removeEventListener("mousemove", a), document.body.removeEventListener("mouseup", t)
                    }))
                })), this.wrapperEl.addEventListener("wheel", (function(t) {
                    if (!s(t.deltaY, t.deltaX, e.focusedNode)) return;
                    let i = 1;
                    i -= t.deltaY / 700 * i, e.scaleAround(i, m(t))
                }), {
                    passive: !0
                });
                let n = !1;
                this.wrapperEl.addEventListener("touchstart", (function(t) {
                    if (n) return;
                    n = !0;
                    const i = t.touches;

                    function o(t) {
                        const e = new c(t[0].clientX, t[0].clientY),
                            i = 2 == t.length ? new c(t[1].clientX, t[1].clientY) : null,
                            s = i ? e.add(i).scale(.5) : e;
                        return {
                            touch1: e,
                            touch2: i,
                            center: s,
                            distance: i ? c.distance(e, i) : 0
                        }
                    }
                    let a = o(i),
                        r = 2 == i.length;
                    const h = e.focusedNode;

                    function l(t) {
                        const i = t.touches,
                            n = o(i);
                        if (2 == i.length) {
                            r || (a = o(i), r = !0);
                            const t = (n.distance - a.distance) / a.distance;
                            e.scaleAround(1 + t, n.center)
                        }
                        const l = n.center.sub(a.center);
                        r || s(-l.y, l.x, h) ? (t.preventDefault(), e.targetPosition = e.targetPosition.add(l), a = o(i)) : a = o(i)
                    }
                    document.body.addEventListener("touchmove", l), document.body.addEventListener("touchend", (function t(e) {
                        document.body.removeEventListener("touchmove", l), document.body.removeEventListener("touchend", t), n = !1
                    }))
                }))
            }
            scaleAround(t, e, i = !1) {
                const s = this.targetScale;
                let n = s * t;
                n = Math.min(Math.max(n, this.minScale), this.maxScale), t = n / s;
                const o = e.sub(this.targetPosition).scale(t).add(this.targetPosition),
                    a = e.sub(o);
                return i ? (this.scale *= t, this.targetScale = this.scale, this.forcePosition = this.forcePosition.add(a)) : (this.targetScale *= t, this.targetPosition = this.targetPosition.add(a)), a
            }
            setScaleAround(t, e, i = !1) {
                this.scaleAround(t / this.targetScale, e, i)
            }
            fitToBounds(t = this.nodeBounds, e = .9, i = !1) {
                this.hideNodesOutsideBounds(t.scale(2));
                const s = this.document.containerEl.clientWidth,
                    n = this.document.containerEl.clientHeight,
                    o = s / t.width,
                    a = n / t.height,
                    r = e * Math.min(o, a);
                this.scaleAround(r, t.center, i), this.centerView(t.center, i)
            }
            hideNodesOutsideBounds(t) {
                for (const e of this.nodes) t.overlaps(e.bounds) || (e.nodeEl.style.display = "none", this.hiddenNodes.push(e))
            }
            centerView(t, e = !1) {
                const i = this.wrapperBounds.center.sub(t);
                e ? this.forcePosition = this.forcePosition.add(i) : this.targetPosition = this.targetPosition.add(i)
            }
        },
        w = (t => (t.Before = "before", t.After = "after", t.Start = "start", t.End = "end", t))(w || {}),
        v = class {
            constructor(t = "#right-sidebar-content", e = "start") {
                this.selector = "#right-sidebar-content", this.type = "start", this.info_selector = new S({
                    show: !0,
                    description: "CSS selector for an element. The feature will be placed relative to this element."
                }), this.info_type = new S({
                    show: !0,
                    description: "Will this feature be placed before, after, or inside (at the beggining or end).",
                    dropdownTypes: w
                }), this.selector = t, this.type = e
            }
        },
        S = class {
            constructor(t) {
                this.show = !0, this.name = "", this.description = "", this.placeholder = "", this.fileInputOptions = void 0, this.dropdownOptions = void 0, t && (this.show = t.show, this.name = t.name, this.description = t.description, this.placeholder = t.placeholder, this.fileInputOptions = t.fileInputOptions, this.dropdownOptions = t.dropdownTypes)
            }
        },
        k = class {
            constructor() {
                this.featureId = "feature", this.enabled = !0
            }
        },
        L = class extends k {
            constructor(t) {
                super(), this.displayTitle = "Feature", this.featurePlacement = new v, this.info_displayTitle = new S({
                    show: !0,
                    description: "Descriptive title to show above the feature"
                }), this.info_featurePlacement = new S({
                    show: !0,
                    description: "Where to place this feature on the page. Multiple values will be tried in order until one succeeds. Multiple values will not insert this feature multiple times."
                }), Object.assign(this, t)
            }
            insertFeature(t, e) {
                let i = t.querySelector(this.featurePlacement.selector);
                if (i) switch (this.featurePlacement.type) {
                    case "before":
                        return i.before(e), !0;
                    case "after":
                        return i.after(e), !0;
                    case "start":
                        return i.prepend(e), !0;
                    case "end":
                        return i.append(e), !0;
                    default:
                        return !1
                }
                return !1
            }
        },
        x = class {
            get options() {
                return this._options
            }
            set options(t) {
                this._options = t
            }
            constructor(t, e) {
                this.options = new L(t), console.log("Feature options", this.options), this.featureEl = e;
                const i = this.featureEl?.querySelector("." + t.featureId + "-content");
                i && (this.contentEl = i);
                const s = this.featureEl?.querySelector(".feature-header");
                s && (this.headerEl = s);
                const n = this.featureEl?.querySelector(".feature-title");
                n && (this.titleEl = n), this.featureEl || (this.featureEl = document.createElement("div"), this.featureEl.id = t.featureId, this.featureEl.classList.add("hide"), setTimeout((() => this.featureEl.classList.remove("hide")), 0)), this.contentEl || (this.contentEl = document.createElement("div"), this.contentEl.classList.add(t.featureId + "-content"), this.featureEl.appendChild(this.contentEl)), this.headerEl || (this.headerEl = document.createElement("div"), this.headerEl.classList.add("feature-header"), this.featureEl.prepend(this.headerEl)), (this._options.displayTitle || "").length > 0 && (this.titleEl || (this.titleEl = document.createElement("div"), this.titleEl.classList.add("feature-title"), this.headerEl.prepend(this.titleEl)), this.titleEl.innerText = this._options.displayTitle), this.options.insertFeature(document.body, this.featureEl)
            }
        },
        _ = class {
            get url() {
                return this._url
            }
            constructor(t, e) {
                this.targetData = ObsidianSite.getWebpageData(e), this.targetData ? (this._url = e, this.backlinkEl = document.createElement("a"), this.backlinkEl.href = e, this.backlinkEl.classList.add("backlink"), t.appendChild(this.backlinkEl), this.backlinkIconEl = document.createElement("div"), this.backlinkIconEl.classList.add("backlink-icon"), this.backlinkIconEl.innerHTML = this.targetData.icon, this.backlinkEl.appendChild(this.backlinkIconEl), this.backlinkTitleEl = document.createElement("div"), this.backlinkTitleEl.classList.add("backlink-title"), this.backlinkTitleEl.innerText = this.targetData.title, this.backlinkEl.appendChild(this.backlinkTitleEl), this.backlinkEl.addEventListener("click", (t => {
                    t.preventDefault(), ObsidianSite.loadURL(this.url)
                }))) : console.error("Failed to find target for backlink", e)
            }
        },
        C = class extends x {
            constructor(t) {
                super(ObsidianSite.metadata.featureOptions.backlinks), this.backlinks = t.map((t => new _(this.contentEl, t)))
            }
        },
        T = class {
            constructor(t, e = !0) {
                this._collapsed = !1, this.calloutEl = t, this.titleEl = t.querySelector(".callout-title-inner"), this.contentEl = t.querySelector(".callout-content"), this.iconEl = t.querySelector(".callout-icon"), this.foldIconEl = t.querySelector(".callout-fold");
                switch (t.getAttribute("data-callout-fold")) {
                    case "+":
                        this.foldType = 0, this._collapsed = !1;
                        break;
                    case "-":
                        this.foldType = 1, this._collapsed = !0;
                        break;
                    default:
                        this.foldType = 2, this._collapsed = !1
                }
                this.type = t.getAttribute("data-callout") ?? "", this.metadata = t.getAttribute("data-callout-metadata") ?? "", e && this.init()
            }
            get title() {
                return this.titleEl?.textContent ?? ""
            }
            set title(t) {
                this.titleEl.textContent = t
            }
            get collapsed() {
                return this._collapsed
            }
            set collapsed(t) {
                this.toggle(t)
            }
            toggle(t) {
                2 != this.foldType && (void 0 === t && (t = !this._collapsed), this.calloutEl?.classList.toggle("is-collapsed", t), this.foldIconEl?.classList.toggle("is-collapsed", t), t ? u(this.contentEl, 150) : p(this.contentEl, 150), this._collapsed = t)
            }
            collapse() {
                this.toggle(!0)
            }
            expand() {
                this.toggle(!1)
            }
            init() {
                this.foldIconEl && this.foldIconEl.addEventListener("click", (() => {
                    this.toggle()
                }))
            }
        },
        P = class {
            constructor(t) {
                this._children = [], t.tagName.startsWith("H") && t.parentElement?.classList.contains("heading-wrapper") && (t = t.parentElement), t.tagName.startsWith("H") && t.parentElement?.classList.contains("header") && t.parentElement.parentElement && (this._childContainer = t.parentElement.parentElement), t.classList.contains("heading-wrapper") && (this._wrapperElement = t, this._childContainer = t.querySelector(".heading-children"), this._headerElement = t.querySelector("h1, h2, h3, h4, h5, h6")), t.tagName.startsWith("H") && (this._headerElement = t), this._headerElement ? (this._collapseIndicatorElement = this._headerElement.querySelector(".heading-collapse-indicator"), this.collapseIndicatorElement && this.collapseIndicatorElement.addEventListener("click", (() => {
                    this.collapseIndicatorElement.classList.toggle("is-collapsed"), this.wrapperElement?.classList.toggle("is-collapsed")
                })), this._id = this.headerElement.id, this._level = parseInt(this.headerElement.tagName.replace("H", "")), this._childContainer && this.initializeChildren()) : console.error("Header element not found in wrapper element", t)
            }
            get id() {
                return this._id
            }
            get text() {
                return this.headerElement.textContent ?? ""
            }
            set text(t) {
                this.headerElement.textContent = t
            }
            get level() {
                return this._level
            }
            get headerElement() {
                return this._headerElement
            }
            get wrapperElement() {
                return this._wrapperElement
            }
            get collapseIndicatorElement() {
                return this._collapseIndicatorElement
            }
            get children() {
                return this._children
            }
            initializeChildren() {
                let t = this._childContainer.firstElementChild;
                for (; t;) t.classList.contains("heading-wrapper") && this._children.push(new P(t)), t = t.nextElementSibling
            }
            scrollTo(t = {
                behavior: "smooth",
                block: "start"
            }) {
                this.headerElement.scrollIntoView(t)
            }
            find(t) {
                if (t(this)) return this;
                for (const e of this.children) {
                    const i = e.find(t);
                    if (i) return i
                }
            }
            findByID(t) {
                return t.startsWith("#") && (t = t.substring(1)), this.find((e => e.id == t))
            }
        },
        R = class {
            static initializeLinks(t) {
                console.log("Initializing links on element", t), t?.querySelectorAll(".internal-link, a.tag, a.tree-item-self, a.footnote-link").forEach((function(t) {
                    t.addEventListener("click", (function(e) {
                        let i = t.getAttribute("href");
                        if (e.preventDefault(), e.stopPropagation(), !i) return void console.log("No target found for link");
                        const s = ObsidianSite.document.pathname.split("#")[0].split("?")[0];
                        (i.startsWith("#") || i.startsWith("?")) && (i = s + i), ObsidianSite.loadURL(i)
                    }))
                }))
            }
            static getPathnameFromURL(t) {
                return "" == t || "/" == t || "\\" == t ? "/index.html" : t.startsWith("#") || t.startsWith("?") ? ObsidianSite.document.pathname + t : t.split("?")[0].split("#")[0]
            }
            static getHashFromURL(t) {
                return (t.split("#")[1] ?? "").split("?")[0] ?? ""
            }
            static getQueryFromURL(t) {
                return t.split("?")[1] ?? ""
            }
        },
        O = class {
            constructor(t, e) {
                this.parent = void 0, this.collapsible = !1, this.collapseEl = void 0, this.line = 0, this.itemEl = t, this.parent = e, this.line = parseInt(this.itemEl.getAttribute("data-line") ?? "0"), this.collapseEl = Array.from(this.itemEl.children).find((t => t.classList.contains("list-collapse-indicator")));
                const i = this.itemEl.querySelector("ol, ul");
                if (i && (this.child = new A(i, this), this.collapseEl)) {
                    this.collapsible = !0;
                    const t = this;
                    this.collapseEl.addEventListener("click", (function(e) {
                        t.isCollapsed = !t.isCollapsed, e.stopPropagation()
                    }))
                }
            }
            get isChecked() {
                return this.itemEl.classList.contains("is-checked")
            }
            get isCollapsed() {
                return this.itemEl.classList.contains("is-collapsed")
            }
            set isCollapsed(t) {
                this.itemEl.classList.toggle("is-collapsed", t), this.collapseEl && this.collapseEl.classList.toggle("is-collapsed", t)
            }
            get textContent() {
                return Array.prototype.filter.call(this.itemEl.childNodes, (t => t.nodeType === Node.TEXT_NODE)).map((t => t.textContent)).join("").trim()
            }
            get htmlContent() {
                return this.itemEl.innerHTML
            }
        },
        A = class {
            constructor(t, e) {
                if (this.children = [], this.parent = void 0, "OL" != t.tagName && "UL" != t.tagName) throw new Error("Invalid list element");
                this.listType = "OL" == t.tagName ? "ordered" : t.classList.contains("contains-task-list") ? "checklist" : "unordered", this.listEl = t, this.parent = e;
                Array.from(this.listEl.children).filter((t => "LI" == t.tagName)).forEach((t => {
                    this.children.push(new O(t, this))
                }))
            }
            get linearList() {
                let t = [];
                return this.children.forEach((e => {
                    t.push(e), e.child && (t = t.concat(e.child.linearList))
                })), t
            }
        },
        F = class {
            constructor(t, e = 5e3) {
                this.message = t, this.duration = e, this.show()
            }
            show() {
                F.container || (F.container = document.createElement("div"), F.container.classList.add("notice-container"), F.container.style.top = "0", F.container.style.right = "0", document.body.appendChild(F.container)), this.notification = document.createElement("div"), this.notification.classList.add("notice"), this.notification.innerHTML = this.message, F.container.appendChild(this.notification), this.notification.style.opacity = "0", this.notification.style.transform = "translateX(350px)", this.notification.style.transition = "all 0.5s", setTimeout((() => {
                    this.notification.style.opacity = "1", this.notification.style.transform = "translateX(0)", this.notification.style.height = this.notification.scrollHeight + "px"
                }), 100), setTimeout((() => {
                    this.dismiss()
                }), this.duration), this.notification.addEventListener("click", (() => {
                    this.dismiss()
                }), {
                    once: !0
                })
            }
            dismiss() {
                this.notification && (this.notification.style.opacity = "0", this.notification.style.height = "0", this.notification.style.margin = "0", this.notification.style.padding = "0", setTimeout((() => {
                    this.notification.remove()
                }), 500))
            }
        },
        N = class extends x {
            constructor(t) {
                super(ObsidianSite.metadata.featureOptions.tags), this.tagNames = t, this.tagElements = [];
                for (let e of t) {
                    const t = document.createElement("a");
                    t.classList.add("tag"), t.setAttribute("href", `?query=tag:${e.replace("#","")}`), t.innerText = e, this.contentEl.appendChild(t), this.tagElements.push(t)
                }
            }
        },
        M = class {
            constructor(t, e) {
                this._path = "", this.collapseAnimationLength = 150, this._oldAnimationLength = this.collapseAnimationLength, this.root = this instanceof z ? this : e?.root ?? (e instanceof z ? e : void 0), this.parent = e;
                let i = this instanceof z;
                this.itemEl = t, this.selfEl = i ? t : t.querySelector(".tree-item-self"), this.collapseIconEl = i ? t : this.selfEl.querySelector(".collapse-icon"), this.innerEl = i ? t : this.selfEl.querySelector(".tree-item-inner"), this.childrenEl = i ? t : t.querySelector(".tree-item-children");
                const s = this.selfEl.getAttribute("href");
                s && (this.path = s), this.children = [];
                if (Array.from(this.childrenEl.children).filter((t => t.classList.contains("tree-item"))).forEach((t => {
                        this.children.push(new M(t, this))
                    })), this._isFolder = this.itemEl.classList.contains("nav-folder"), this._isLink = "A" == this.selfEl.tagName, this._isCollapsible = this.itemEl.classList.contains("mod-collapsible"), this.collapsed = this.itemEl.classList.contains("is-collapsed"), this._isCollapsible) {
                    (this.isLink ? this.collapseIconEl ?? this.selfEl : this.selfEl).addEventListener("click", (t => {
                        this.collapsed = !this.collapsed, t.preventDefault(), t.stopPropagation()
                    }))
                }
                this._checkAnyChildrenOpen()
            }
            get path() {
                return this._path
            }
            set path(t) {
                this.root.pathToItem && (this.root.pathToItem.delete(this._path), this.root.pathToItem.set(t, this)), this._path = t, this.selfEl.setAttribute("href", t)
            }
            get title() {
                return this.innerEl.innerHTML
            }
            set title(t) {
                this.innerEl.innerHTML = t
            }
            get isFolder() {
                return this._isFolder
            }
            get isLink() {
                return this._isLink
            }
            get collapsable() {
                return this._isCollapsible
            }
            get collapsed() {
                return this._collapsed
            }
            set collapsed(t) {
                this.collapsed != t && (!t && this.parent instanceof M && this.parent.collapsed && (this.parent.collapsed = !1), this._collapsed = t, this.itemEl.classList.toggle("is-collapsed", t), this.collapseIconEl?.classList.toggle("is-collapsed", t), t ? u(this.childrenEl, this.collapseAnimationLength) : p(this.childrenEl, this.collapseAnimationLength), this.parent?._checkAnyChildrenOpen())
            }
            get collapsedRecursive() {
                return this._collapsedRecursive
            }
            set collapsedRecursive(t) {
                this.collapsedRecursive != t && (this._collapsedRecursive = t, this.children.forEach((e => {
                    e.collapsed = t, e.collapsedRecursive = t
                })))
            }
            get anyChildrenOpen() {
                return this._anyChildrenOpen
            }
            _checkAnyChildrenOpen() {
                return this._anyChildrenOpen = this.children.some((t => !t.collapsed && t.collapsable)), this._collapsedRecursive = !this._anyChildrenOpen, this._anyChildrenOpen
            }
            forAllChildren(t) {
                this.children.forEach((e => {
                    t(e), e.forAllChildren(t)
                }))
            }
            overrideAnimationLength(t) {
                this._oldAnimationLength = this.collapseAnimationLength, this.collapseAnimationLength = t, this.children.forEach((e => {
                    e.overrideAnimationLength(t)
                }))
            }
            restoreAnimationLength() {
                this.collapseAnimationLength = this._oldAnimationLength, this.children.forEach((t => {
                    t.restoreAnimationLength()
                }))
            }
            setActive() {
                this.root.activeItem && this.root.activeItem.selfEl.classList.remove("is-active"), this.root.activeItem = this, this.selfEl.classList.add("is-active")
            }
            setFiltered(t) {
                t ? this.itemEl.classList.add("filtered-out") : (this.itemEl.classList.remove("filtered-out"), this.parent?.setFiltered(!1))
            }
            filter(t) {
                this.overrideAnimationLength(0), this.itemEl.classList.add("filtered"), this.collapsedRecursive = !1, this.forAllChildren((t => {
                    t.setFiltered(!0)
                })), t.forEach((t => {
                    const e = this.findByPath(t);
                    e && e.setFiltered(!1)
                }))
            }
            async unfilter() {
                this.itemEl.classList.remove("filtered"), this.forAllChildren((t => {
                    t.setFiltered(!1)
                })), this.collapsedRecursive = !0, this.restoreAnimationLength()
            }
            sort(t) {
                this.itemEl.classList.add("sorted"), this.children.sort(t), this.children.forEach((e => {
                    e.sort(t)
                })), this.children.forEach((t => {
                    this.childrenEl.appendChild(t.itemEl)
                }))
            }
            unsort() {
                this.itemEl.classList.remove("sorted"), this.sort(((t, e) => (ObsidianSite.getWebpageData(t.path)?.treeOrder ?? 0) - (ObsidianSite.getWebpageData(e.path)?.treeOrder ?? 0)))
            }
            find(t) {
                if (t(this)) return this;
                for (const e of this.children) {
                    const i = e.find(t);
                    if (i) return i
                }
            }
            findByPath(t) {
                return this.root.pathToItem.get(t)
            }
        },
        W = class extends M {
            constructor(t) {
                const e = t.classList.contains("tree-container") ? t : t.querySelector(".tree-container");
                if (null == e) throw new Error("Invalid tree container");
                super(e, void 0), this.pathToItem = new Map, this.rootEl = e, this.childrenEl = this.rootEl, this.selfEl = this.rootEl, this.innerEl = this.rootEl, this.collapseAllEl = this.rootEl.querySelector(".tree-collapse-all");
                const i = this.collapseAllEl?.querySelector("svg");
                i && (i.innerHTML = "<path d></path><path d></path>", this.collapsePath1 = i.querySelector("path"), this.collapsePath2 = i.querySelector("path:last-child")), this.forAllChildren((t => {
                    "" != t.path && this.pathToItem.set(t.path, t)
                })), this.collapseAllEl?.addEventListener("click", (() => {
                    this.setCollapseIcon(!this.collapsedRecursive), this.collapsedRecursive = !this.collapsedRecursive
                })), R.initializeLinks(this.rootEl), this.setCollapseIcon(!this.anyChildrenOpen)
            }
            _checkAnyChildrenOpen() {
                const t = super._checkAnyChildrenOpen();
                return this.setCollapseIcon(!t), t
            }
            setCollapseIcon(t) {
                t ? (this.collapsePath1?.setAttribute("d", W.collapsePaths[0]), this.collapsePath2?.setAttribute("d", W.collapsePaths[1])) : (this.collapsePath1?.setAttribute("d", W.uncollapsePaths[0]), this.collapsePath2?.setAttribute("d", W.uncollapsePaths[1]))
            }
            revealPath(t) {
                const e = this.findByPath(t);
                e && (e.collapsed = !1)
            }
        },
        z = W;
    z.collapsePaths = ["m7 15 5 5 5-5", "m7 9 5-5 5 5"], z.uncollapsePaths = ["m7 20 5-5 5 5", "m7 4 5 5 5-5"];
    var I = class {
            constructor(t) {
                if (this.title = "", this.headers = [], this.callouts = [], this.lists = [], this.children = [], this.initialized = !1, this._exists = !1, !window?.location) return;
                if ((t = t.trim()).startsWith("http") || t.startsWith("www") || t.startsWith("/") || t.startsWith("\\")) return void console.error("Please use a relative path from the root of the wesite to load a webpage");
                "" != t && "/" != t && "\\" != t || (t = "/index.html"), (t.startsWith("#") || t.startsWith("?")) && (t = ObsidianSite.document.pathname + t), this.pathname = R.getPathnameFromURL(t);
                const e = new URL(window?.location?.origin + "/" + t);
                if (this.hash = e.hash, this.query = e.search, this.queryParameters = e.searchParams, this.info = ObsidianSite.getWebpageData(this.pathname), !this.info) return new F("This page does not exist yet."), void console.warn("This page does not exist yet.", this.pathname);
                this._exists = !0, this.documentType = this.info.type, console.log("Document type", this.documentType, this.info.type), this.title = this.info.title
            }
            get isRootDocument() {
                return null == this.parent
            }
            get bounds() {
                return h.fromElement(this.documentEl)
            }
            get exists() {
                return this._exists
            }
            findHeader(t) {
                for (const e of this.headers) {
                    let i = e.find(t);
                    if (i) return i
                }
                return null
            }
            scrollToHeader(t) {
                const e = this.findHeader((e => e.id == t));                
                e && e.scrollTo()
            }
            findElements() {
                this.sizerEl = this.containerEl.querySelector(".markdown-sizer"), this.documentEl = this.containerEl.querySelector(".obsidian-document"), this.headerEl = this.containerEl.querySelector(".header"), this.footerEl = this.containerEl.querySelector(".footer")
            }
            async init() {
                return this.pathname && !this.initialized && this.exists ? (this.initialized = !0, this.containerEl || (this.containerEl = ObsidianSite.centerContentEl), this.findElements(), this.isRootDocument && (R.initializeLinks(this.sizerEl ?? this.documentEl ?? this.containerEl), this.createHeaders(), this.createCallouts(), this.createLists()), this) : this
            }
            async setAsActive() {
                if (ObsidianSite.document) {
                    let t = this.pathname;
                    "index.html" == t && (t = ""), ObsidianSite.isHttp || (t = null), history.pushState({
                        pathname: t
                    }, this.title, t)
                }
                await (ObsidianSite.graphView?.showGraph([this.pathname])), ObsidianSite.fileTree?.findByPath(this.pathname)?.setActive(), ObsidianSite.fileTree?.revealPath(this.pathname), ObsidianSite.graphView?.setActiveNodeByPath(this.pathname), ObsidianSite.document = this
            }
            async load(t = null, e = ObsidianSite.centerContentEl) {
                if (!this.pathname || !this.exists) return this;
                if (!t && ObsidianSite.document.pathname == this.pathname) return console.log("Already on this page"), new F("This page is already open.", 2e3), ObsidianSite.document;
                let i = ObsidianSite.document;
                await ObsidianSite.showLoading(!0, e), this.parent = t, this.containerEl = e, this.isRootDocument && await this.setAsActive();
                const s = await ObsidianSite.fetch(this.pathname);
                if (s?.ok) {
                    const i = await s.text(),
                        n = (new DOMParser).parseFromString(i, "text/html");
                    let o = n.querySelector(".obsidian-document"),
                        a = n.querySelector("#outline");
                    if (o) {
                        o = document.adoptNode(o);
                        const t = e.querySelector(".obsidian-document");
                        t ? t.replaceWith(o) : e.appendChild(o)
                    }!t && a && (a = document.adoptNode(a), document.querySelector("#outline")?.replaceWith(a), ObsidianSite.outlineTree = new z(a)), await this.postLoadInit(), await this.loadChildDocuments(), this.initialized = !1
                } else new F("This document could not be loaded."), console.error("Failed to load document", this.pathname), i?.setAsActive();
                return await ObsidianSite.showLoading(!1, e), this
            }
            async postLoadInit() {
                return this.findElements(), this.isRootDocument && ObsidianSite.metadata.featureOptions.backlinks.enabled && this.createBacklinks(), this.isRootDocument && ObsidianSite.metadata.featureOptions.tags.enabled && this.createTags(), "canvas" == this.documentType && (this.canvas = new E(this)), this
            }
            createHeaders() {
                const t = this.documentEl.querySelector(".header .heading");
                let e = [];
                e = t ? [t] : Array.from(this.documentEl.querySelectorAll(":is(h1, h2, h3, h4, h5, h6):not(:is(.heading-wrapper . heading-wrapper :is(h1, h2, h3, h4, h5, h6)))")), this.headers = [];
                for (const t of e) this.headers.push(new P(t))
            }
            createCallouts() {
                const t = Array.from(this.documentEl.querySelectorAll(".callout"));
                this.callouts = [];
                for (const e of t) this.callouts.push(new T(e))
            }
            createLists() {
                const t = Array.from(this.documentEl.querySelectorAll(":is(ul, ol):not(:is(ul, ol) :is(ul, ol))"));
                this.lists = [];
                for (const e of t) this.lists.push(new A(e, void 0))
            }
            createBacklinks() {
                const t = this.info.backlinks?.filter((t => t != this.pathname));
                t && 0 != t.length && (this.backlinkList = new C(t))
            }
            createTags() {
                const t = [];
                ObsidianSite.metadata.featureOptions.tags.showInlineTags && this.info.inlineTags && t.push(...this.info.inlineTags), ObsidianSite.metadata.featureOptions.tags.showFrontmatterTags && this.info.frontmatterTags && t.push(...this.info.frontmatterTags), 0 != t.length && (this.tags = new N(t))
            }
            async loadChildDocuments() {
                let t = this,
                    e = 0;
                for (; t;) t = t.parent, e++;
                if (e > 4) return;
                const i = Array.from(this.documentEl.querySelectorAll("link[itemprop='include-document']")),
                    s = [];
                for (const t of i) {
                    const e = t.getAttribute("href");
                    if (!e) continue;
                    const i = new I(e).load(this, t.parentElement);
                    s.push(i), console.log("Loading child", e), t.remove()
                }
                const n = (await Promise.all(s)).map((t => t.init()));
                let o = await Promise.all(n);
                console.log("Loaded child documents", o), this.children.push(...o)
            }
            getMinReadableWidth() {
                return 30 * parseFloat(getComputedStyle(this.sizerEl).fontSize)
            }
        },
        q = class {};
    q.libFolderName = "site-lib", q.mediaFolderName = "media", q.scriptsFolderName = "scripts", q.cssFolderName = "styles", q.fontFolderName = "fonts", q.htmlFolderName = "html", q.metadataFileName = "metadata.json", q.searchIndexFileName = "search-index.json";
    var D, H, B, V, G, U, $, j, X, Y, J, Q, K, Z = class {
            search(t, e = 7) {
                if (0 == t.length) return void this.clear();
                this.input.value = t, this.input.style.color = 7 != e ? "var(--text-accent)" : "";
                const i = [];
                0 & e && i.push("title"), 1 & e && i.push("aliases"), 2 & e && i.push("headers"), 3 & e && i.push("tags"), 4 & e && i.push("path"), 5 & e && i.push("content");
                const s = this.index.search(t, {
                    prefix: !0,
                    fuzzy: .2,
                    boost: {
                        title: 2,
                        aliases: 1.8,
                        headers: 1.5,
                        tags: 1.3,
                        path: 1.1
                    },
                    fields: i
                });
                s.length > 50 && s.splice(50);
                const n = [],
                    o = [];
                for (const e of s) {
                    if (e.score < .3 * s[0].score && n.length > 4 || e.score < .1 * s[0].score) break;
                    n.push(e.path);
                    const i = [];
                    let a = !1;
                    for (const s in e.match) {
                        if (e.match[s].includes("headers"))
                            for (const n of e.headers)
                                if (n.toLowerCase().includes(s.toLowerCase()) && (i.includes(n) || i.push(n), t.toLowerCase() != s.toLowerCase())) {
                                    a = !0;
                                    break
                                } if (a) break
                    }
                    o.push(i)
                }
                if (ObsidianSite.fileTree?.filter(n), ObsidianSite.fileTree?.sort(((t, e) => t && e ? n.findIndex((e => t.path == e)) - n.findIndex((t => e.path == t)) : 0)), !ObsidianSite.fileTree) {
                    const e = document.createElement("div");
                    s.filter((t => t.path.endsWith(".html"))).slice(0, 20).forEach((i => {
                        const s = document.createElement("div");
                        s.classList.add("search-result");
                        const n = document.createElement("a");
                        n.classList.add("tree-item-self");
                        const o = i.path + "?mark=" + encodeURIComponent(t);
                        n.setAttribute("href", o), n.appendChild(document.createTextNode(i.title)), s.appendChild(n), e.append(s)
                    })), this.dedicatedSearchResultsList.replaceChildren(e), this.container.after(this.dedicatedSearchResultsList), R.initializeLinks(this.dedicatedSearchResultsList)
                }
            }
            clear() {
                this.container?.classList.remove("has-content"), this.input.value = "", this.clearCurrentDocumentSearch(), ObsidianSite.fileTree?.unfilter()
            }
            async init() {
                if (this.input = document.querySelector('input[type="search"]'), this.container = this.input?.closest("#search-container"), !this.input || !this.container) return;
                const t = await ObsidianSite.fetch(q.libFolderName + "/search-index.json");
                if (!t?.ok) return void console.error("Failed to fetch search index");
                const e = await t.text();
                try {
                    this.index = MiniSearch.loadJSON(e, {
                        fields: ["title", "path", "tags", "headers"]
                    })
                } catch (t) {
                    return void console.error("Failed to load search index: ", t)
                }
                const i = document.querySelector("#search-clear-button");
                return i?.addEventListener("click", (t => {
                    this.clear()
                })), this.input.addEventListener("input", (t => {
                    const e = t.target?.value ?? "";
                    0 != e.length ? this.search(e) : this.clear()
                })), ObsidianSite.fileTree || (this.dedicatedSearchResultsList = document.createElement("div"), this.dedicatedSearchResultsList.setAttribute("id", "search-results")), this
            }
            async searchCurrentDocument(t) {
                this.clearCurrentDocumentSearch();
                (function(t) {
                    const e = [],
                        i = document.createTreeWalker(t, NodeFilter.SHOW_TEXT, null);
                    let s;
                    for (; s = i.nextNode();) e.push(s);
                    return e
                })(ObsidianSite.document.sizerEl).forEach((async e => {
                    const i = e.nodeValue,
                        s = i?.replace(new RegExp(t, "gi"), (t => `<mark>${t}</mark>`));
                    if (s && s !== i) {
                        const t = document.createElement("div");
                        t.innerHTML = s;
                        Array.from(t.childNodes).forEach((t => {
                            t.nodeType != Node.TEXT_NODE && t?.setAttribute("class", "search-mark"), e?.parentNode?.insertBefore(t, e)
                        })), e?.parentNode?.removeChild(e)
                    }
                }));
                const e = document.querySelector(".search-mark");
                setTimeout((() => {
                    e && ObsidianSite.scrollTo(e)
                }), 500)
            }
            clearCurrentDocumentSearch() {
                document.querySelectorAll(".search-mark").forEach((t => {
                    t.outerHTML = t.innerHTML
                }))
            }
        },
        tt = class {
            constructor(t) {
                if (this.minWidthEm = 15, !t.classList.contains("sidebar")) throw new Error("Invalid sidebar container");
                this.containerEl = t, this.contentEl = t.querySelector(".leaf-content"), this.topbarEl = t.querySelector(".sidebar-topbar"), this.collapseEl = t.querySelector(".sidebar-collapse-icon"), this.topbarContentEl = t.querySelector(".topbar-content"), this.resizeHandleEl = t.querySelector(".sidebar-handle") ?? void 0, this._isLeft = "left-sidebar" == t.id, this._sidebarID = t.id, this.collapseEl.addEventListener("click", (() => {
                    this.collapsed = !this.collapsed
                })), this.minResizeWidth = parseFloat(getComputedStyle(this.resizeHandleEl.parentElement ?? this.resizeHandleEl).fontSize) * this.minWidthEm, this.collapseWidth = this.minResizeWidth / 4, this.setupSidebarResize()
            }
            get sidebarID() {
                return this._sidebarID
            }
            get isLeft() {
                return this._isLeft
            }
            get resizing() {
                return this._resizing
            }
            get collapsed() {
                return this._collapsed
            }
            set collapsed(t) {
                this._collapsed = t, !t && this.floating && document.body.addEventListener("click", this.clickOutsideCollapse), t && document.body.removeEventListener("click", this.clickOutsideCollapse), this.containerEl.classList.toggle("is-collapsed", t)
            }
            get floating() {
                return this._floating
            }
            set floating(t) {
                this._floating = t, this.containerEl.classList.toggle("floating", t)
            }
            get width() {
                return this.containerEl.offsetWidth
            }
            set width(t) {
                const e = `min(max(${t}px, ${this.minWidthEm}em), 40vw)`;
                t < this.collapseWidth ? (this.collapsed = !0, this.containerEl.style.removeProperty("transition-duration")) : (this.collapsed = !1, this.containerEl.style.setProperty("--sidebar-width", e), t > this.minResizeWidth && (this.containerEl.style.transitionDuration = "0s")), ObsidianSite.graphView && ObsidianSite.graphView.graphRenderer.autoResizeCanvas()
            }
            setupSidebarResize() {
                if (!this.resizeHandleEl) return;
                const t = localStorage.getItem(`${this.sidebarID}-width`);
                t && this.containerEl.style.setProperty("--sidebar-width", t);
                const e = this;

                function i(t) {
                    if (!e.resizing) return;
                    const i = e.isLeft ? t.clientX : window.innerWidth - t.clientX;
                    e.width = i
                }
                this.resizeHandleEl.addEventListener("pointerdown", (function(t) {
                    e._resizing = !0, e.containerEl.classList.add("is-resizing"), document.addEventListener("pointermove", i), document.addEventListener("pointerup", (function() {
                        document.removeEventListener("pointermove", i);
                        const t = getComputedStyle(e.containerEl).getPropertyValue("--sidebar-width");
                        localStorage.setItem(`${e.sidebarID}-width`, t), e.containerEl.classList.remove("is-resizing"), e.containerEl.style.removeProperty("transition-duration")
                    }))
                })), this.resizeHandleEl.addEventListener("dblclick", (function(t) {
                    e.resetWidth()
                }))
            }
            resetWidth() {
                this.containerEl.style.removeProperty("transition-duration"), this.containerEl.style.removeProperty("--sidebar-width"), localStorage.removeItem(`${this.sidebarID}-width`), setTimeout((() => {
                    console.log("Resizing canvas"), ObsidianSite.graphView && (ObsidianSite.graphView.graphRenderer.autoResizeCanvas(), ObsidianSite.graphView.graphRenderer.centerCamera())
                }), 500)
            }
            clickOutsideCollapse(t) {
                t.target?.closest(".sidebar") || (this.collapsed = !0)
            }
        },
        et = class {
            constructor() {
                this.nodeCount = 0, this.linkCount = 0, this.hoveredNode = -1, i(this, D, 0), i(this, H, 0), i(this, B, 0), i(this, V, 0), i(this, G, 0), this.startPositions = new Float32Array(0), this.linkSources = new Int32Array(0), this.linkTargets = new Int32Array(0), this.radii = new Float32Array(0), this.maxRadius = 0, this.averageRadius = 0, this.minRadius = 0
            }
            init(t, i) {
                if (this.free(), this.graphView = t, this.nodeCount = t.nodeCount, this.linkCount = t.linkCount, i?.length != 2 * this.nodeCount) throw new Error("Invalid positions array length");
                this.radii = new Float32Array(t.radii), this.linkSources = new Int32Array(t.linkSources), this.linkTargets = new Int32Array(t.linkTargets), this.maxRadius = this.radii.reduce(((t, e) => Math.max(t, e))), this.averageRadius = this.radii.reduce(((t, e) => t + e)) / this.radii.length, this.minRadius = this.radii.reduce(((t, e) => Math.min(t, e))), this.startPositions = new Float32Array(2 * this.nodeCount), this.startPositions = this.generatePositions(i), s(this, D, Module._malloc(this.startPositions.byteLength)), s(this, H, this.startPositions.byteLength), s(this, B, Module._malloc(this.radii.byteLength)), s(this, V, Module._malloc(this.linkSources.byteLength)), s(this, G, Module._malloc(this.linkTargets.byteLength)), Module.HEAP32.set(new Int32Array(this.startPositions.buffer), e(this, D) / this.startPositions.BYTES_PER_ELEMENT), Module.HEAP32.set(new Int32Array(this.radii.buffer), e(this, B) / this.radii.BYTES_PER_ELEMENT), Module.HEAP32.set(new Int32Array(this.linkSources.buffer), e(this, V) / this.linkSources.BYTES_PER_ELEMENT), Module.HEAP32.set(new Int32Array(this.linkTargets.buffer), e(this, G) / this.linkTargets.BYTES_PER_ELEMENT), Module._Init(e(this, D), e(this, B), e(this, V), e(this, G), this.nodeCount, this.linkCount, t.batchFraction, t.ticker.deltaTime, t.options.attractionForce, t.options.linkLength, t.options.repulsionForce, t.options.centralForce)
            }
            get positions() {
                return Module.HEAP32.buffer.slice(e(this, D), e(this, D) + e(this, H))
            }
            get positionsF() {
                return new Float32Array(this.positions)
            }
            generatePositions(t) {
                let e = new Float32Array(t ?? new Array(2 * this.nodeCount).fill(0));
                const i = 2 * this.averageRadius * Math.sqrt(this.nodeCount) * 2;
                for (let t = 0; t < this.nodeCount; t++) {
                    const s = e[2 * t];
                    if (0 != s && !isNaN(s) && null != s) continue;
                    const n = (1 - this.radii[t] / this.maxRadius) * i;
                    e[2 * t] = Math.cos(t / this.nodeCount * 7.41 * 2 * Math.PI) * n, e[2 * t + 1] = Math.sin(t / this.nodeCount * 7.41 * 2 * Math.PI) * n
                }
                return e
            }
            getBounds() {
                let t = new h(0, 0, 0, 0);
                const e = new Float32Array(this.positions);
                for (let i = 0; i < this.nodeCount - 1; i += 2) {
                    const s = new c(e[i], e[i + 1]);
                    t.encapsulatePoint(s.scale(2))
                }
                const i = t.center,
                    s = i.magnitude;
                return t = t.expand(50 + s), t.translate(i.inverse), t
            }
            update(t, e, i) {
                this.hoveredNode = Module._Update(t.x, t.y, e, i)
            }
            free() {
                Module._free(e(this, D)), Module._free(e(this, B)), Module._free(e(this, V)), Module._free(e(this, G)), Module._FreeMemory()
            }
            set batchFraction(t) {
                Module._SetBatchFractionSize(t)
            }
            set attractionForce(t) {
                Module._SetAttractionForce(t)
            }
            set repulsionForce(t) {
                Module._SetRepulsionForce(t)
            }
            set centralForce(t) {
                Module._SetCentralForce(t)
            }
            set linkLength(t) {
                Module._SetLinkLength(t)
            }
            set dt(t) {
                Module._SetDt(t)
            }
            set settleness(t) {
                Module._SetSettleness(t)
            }
        };
    D = new WeakMap, H = new WeakMap, B = new WeakMap, V = new WeakMap, G = new WeakMap;
    var it = class {
        constructor(t) {
            i(this, U), i(this, j), i(this, Y), i(this, Q), this.graph = t, this.canvas = document.querySelector("#graph-canvas"), this.canvasSidebar = this.canvas.closest(".sidebar"), console.log("Creating graph worker");
            try {
                this.view = this.canvas.transferControlToOffscreen()
            } catch (t) {
                console.log("Failed to transfer control to offscreen canvas")
            }
            this.worker = new Worker(new URL(`${ObsidianSite.document.info.pathToRoot}/${q.libFolderName}/${q.scriptsFolderName}/graph-render-worker.js`, window.location.href).pathname), this._cameraOffset = new c(0, 0), this._cameraScale = 1, this._hoveredNode = -1, this._grabbedNode = -1, this._colors = {
                background: 0,
                link: 0,
                node: 0,
                outline: 0,
                text: 0,
                accent: 0
            }, this._width = 0, this._height = 0, this.cameraOffset = new c(this.canvas.width, this.canvas.height).scale(.5), this.cameraScale = 1, this.hoveredNode = -1, this.grabbedNode = -1, this.resampleColors(), n(this, U, $).call(this, !0), this.width = this.canvas.width, this.height = this.canvas.height, this.autoResizeCanvas()
        }
        get cameraOffset() {
            return this._cameraOffset
        }
        set cameraOffset(t) {
            this._cameraOffset = t, n(this, Y, J).call(this, t, this.cameraScale)
        }
        get cameraScale() {
            return this._cameraScale
        }
        set cameraScale(t) {
            this._cameraScale = t, n(this, Y, J).call(this, this.cameraOffset, t)
        }
        get hoveredNode() {
            return this._hoveredNode
        }
        set hoveredNode(t) {
            this._hoveredNode = t, n(this, j, X).call(this, t, this._grabbedNode)
        }
        get grabbedNode() {
            return this._grabbedNode
        }
        set grabbedNode(t) {
            this._grabbedNode = t, n(this, j, X).call(this, this._hoveredNode, t)
        }
        get colors() {
            return this._colors
        }
        set colors(t) {
            this._colors = t, n(this, Q, K).call(this, t)
        }
        get width() {
            return this._width
        }
        set width(t) {
            this._width = t, this.resizeCanvas(t, this._height)
        }
        get height() {
            return this._height
        }
        set height(t) {
            this._height = t, this.resizeCanvas(this._width, t)
        }
        set activeNode(t) {
            this.worker.postMessage({
                type: "set_active",
                active: t
            })
        }
        updateData(t) {
            this.graph = t, n(this, U, $).call(this)
        }
        sampleColor(t) {
            const e = document.createElement("div");
            document.body.appendChild(e), e.style.setProperty("display", "none"), e.style.setProperty("color", "var(" + t + ")");
            const i = getComputedStyle(e).color,
                s = getComputedStyle(e).opacity;
            e.remove();
            const n = function(t) {
                const e = t.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);
                return e ? {
                    red: parseInt(e[1]),
                    green: parseInt(e[2]),
                    blue: parseInt(e[3]),
                    alpha: 1
                } : null
            }(i);
            return {
                a: parseFloat(s) * (n?.alpha ?? 1),
                rgb: (n?.red ?? 8912896) << 16 | (n?.green ?? 34816) << 8 | (n?.blue ?? 136)
            }
        }
        resampleColors() {
            this.colors = {
                background: this.sampleColor("--background-secondary").rgb,
                link: this.sampleColor("--graph-line").rgb,
                node: this.sampleColor("--graph-node").rgb,
                outline: this.sampleColor("--graph-line").rgb,
                text: this.sampleColor("--graph-text").rgb,
                accent: this.sampleColor("--interactive-accent").rgb
            }
        }
        draw(t) {
            this.worker.postMessage({
                type: "draw",
                positions: t
            }, [t])
        }
        resizeCanvas(t, e) {
            this.worker.postMessage({
                type: "resize",
                width: t,
                height: e
            }), this._width = t, this._height = e
        }
        autoResizeCanvas() {
            let t = this.canvas.offsetWidth,
                e = this.canvas.offsetHeight;
            this.width == t && this.height == e || (this.centerCamera(), this.resizeCanvas(t, e))
        }
        centerCamera() {
            this.cameraOffset = new c(this.width, this.height).scale(.5)
        }
        toScreenSpace(t, e, i = !0) {
            let s = t * this.cameraScale + this.cameraOffset.x,
                n = e * this.cameraScale + this.cameraOffset.y;
            return i && (s = Math.floor(s), n = Math.floor(n)), new c(s, n)
        }
        vecToScreenSpace(t, e = !0) {
            return this.toScreenSpace(t.x, t.y, e)
        }
        toWorldspace(t, e) {
            const i = (t - this.cameraOffset.x) / this.cameraScale,
                s = (e - this.cameraOffset.y) / this.cameraScale;
            return new c(i, s)
        }
        vecToWorldspace(t) {
            return this.toWorldspace(t.x, t.y)
        }
        setCameraCenterWorldspace(t) {
            this.cameraOffset = new c(this.width / 2 - t.x * this.cameraScale, this.height / 2 - t.y * this.cameraScale)
        }
        getCameraCenterWorldspace() {
            return this.toWorldspace(this.width / 2, this.height / 2)
        }
    };
    U = new WeakSet, $ = function(t = !1) {
        const {
            width: e,
            height: i
        } = this.view;
        let s = {
                width: e,
                height: i,
                view: this.view
            },
            n = [this.view];
        t || (s = {
            width: e,
            height: i
        }, n = []), this.worker.postMessage({
            type: "init",
            linkCount: this.graph.graphSim.linkCount,
            linkSources: this.graph.graphSim.linkSources,
            linkTargets: this.graph.graphSim.linkTargets,
            nodeCount: this.graph.graphSim.nodeCount,
            radii: this.graph.graphSim.radii,
            labels: this.graph.labels,
            linkLength: this.graph.options.linkLength,
            edgePruning: this.graph.options.edgePruning,
            options: s
        }, n)
    }, j = new WeakSet, X = function(t, e) {
        const i = {
            type: "update_interaction",
            hoveredNode: t,
            grabbedNode: e
        };
        this.worker.postMessage(i)
    }, Y = new WeakSet, J = function(t, e) {
        this.worker.postMessage({
            type: "update_camera",
            cameraOffset: t,
            cameraScale: e
        })
    }, Q = new WeakSet, K = function(t) {
        this.worker.postMessage({
            type: "update_colors",
            colors: t
        })
    };
    var st = class extends x {
            constructor(t) {
                super(ObsidianSite.metadata.featureOptions.graphView, t), this.batchFraction = 1, this.graphExpanded = !1, this._paused = !1, this._isGlobalGraph = !1, this.eventsInitialized = !1, this.updateRunning = !1, this.mouseWorldPos = new c(0, 0), this.scrollVelocity = 0, this.firstUpdate = !0, this.drawLastTime = 0, this.graphSim = new et, this.graphContainer = document.querySelector(".graph-view-container"), this.globalGraphButton = document.querySelector(".graph-global.graph-icon"), this.expandGraphButton = document.querySelector(".graph-expand.graph-icon"), this.ticker = new d(60), this.ticker.add(this.update.bind(this)), this.ticker.start(), requestAnimationFrame(this.draw.bind(this))
            }
            set options(t) {
                this._options = t, this.graphSim && (this.graphSim.attractionForce = t.attractionForce, this.graphSim.centralForce = t.centralForce, this.graphSim.linkLength = t.linkLength, this.graphSim.repulsionForce = t.repulsionForce / this.batchFraction)
            }
            get options() {
                return this._options
            }
            set attractionForce(t) {
                t != this.options.attractionForce && (this.options.attractionForce = t, this.graphSim && (this.graphSim.attractionForce = t, this.graphSim.settleness = 1))
            }
            get attractionForce() {
                return this.options.attractionForce
            }
            set centralForce(t) {
                t != this.options.centralForce && (this.options.centralForce = t, this.graphSim && (this.graphSim.centralForce = t, this.graphSim.settleness = 1))
            }
            get centralForce() {
                return this.options.centralForce
            }
            set linkLength(t) {
                t != this.options.linkLength && (this.options.linkLength = t, this.graphSim && (this.graphSim.linkLength = t, this.graphSim.settleness = 1))
            }
            get linkLength() {
                return this.options.linkLength
            }
            set repulsionForce(t) {
                t != this.options.repulsionForce && (this.options.repulsionForce = t, this.graphSim && (this.graphSim.repulsionForce = t / this.batchFraction, this.graphSim.settleness = 1))
            }
            get repulsionForce() {
                return this.options.repulsionForce
            }
            get paused() {
                return this._paused
            }
            set paused(t) {
                this._paused = t
            }
            get isGlobalGraph() {
                return this._isGlobalGraph
            }
            set isGlobalGraph(t) {
                this._isGlobalGraph = t
            }
            initEvents() {
                const t = this;

                function e(e) {
                    const i = t.graphRenderer.canvas.getBoundingClientRect(),
                        s = m(e);
                    return new c(s.x - i.left, s.y - i.top)
                }
                let i = new c(0, 0),
                    s = new c(0, 0),
                    n = new c(0, 0),
                    o = new c(0, 0),
                    a = 0,
                    r = !1,
                    h = !1,
                    l = new c(0, 0),
                    d = -1,
                    u = !1;
                const p = this.graphContainer,
                    f = this.graphRenderer;
                this.graphRenderer.canvas.addEventListener("pointerenter", (function(m) {
                    let b = 0,
                        y = !1;

                    function E(a) {
                        i = e(a), t.mouseWorldPos = f.vecToWorldspace(i), n = new c(i.x - s.x, i.y - s.y), s = i, -1 != f.grabbedNode && (o = new c(i.x - l.x, i.y - l.y)), r && -1 != f.hoveredNode && -1 == f.grabbedNode && f.hoveredNode != f.grabbedNode && (f.grabbedNode = f.hoveredNode), r && -1 == f.hoveredNode && -1 == f.grabbedNode || h ? f.cameraOffset = new c(f.cameraOffset.x + n.x, f.cameraOffset.y + n.y) : -1 != f.hoveredNode ? f.canvas.style.cursor = "pointer" : f.canvas.style.cursor = "default"
                    }

                    function w(o) {
                        if (1 == o.touches?.length) return y && (s = e(o), y = !1), void E(o);
                        if (2 == o.touches?.length) {
                            const a = g(o.touches[0]),
                                r = g(o.touches[1]);
                            i = e(o), n = new c(i.x - s.x, i.y - s.y), s = i;
                            const h = Math.sqrt(Math.pow(a.x - r.x, 2) + Math.pow(a.y - r.y, 2));
                            y || (y = !0, b = h, n = new c(0, 0), t.mouseWorldPos = c.Undefined, f.grabbedNode = -1, f.hoveredNode = -1);
                            const l = (h - b) / b;
                            t.scaleAround(f.vecToWorldspace(i), 1 + l, .15, 15), f.cameraOffset = new c(f.cameraOffset.x + n.x, f.cameraOffset.y + n.y), b = h
                        }
                    }

                    function v(e) {
                        document.removeEventListener("pointerup", v);
                        const i = Date.now();
                        setTimeout((() => {
                            r && -1 != f.hoveredNode && Math.abs(o.x) <= 4 && Math.abs(o.y) <= 4 && i - a < 300 && t.navigateToNode(f.hoveredNode), r && -1 != f.grabbedNode && (f.grabbedNode = -1), 0 == e.button && (r = !1), "touch" == e.pointerType && d == e.pointerId && (d = -1, r = !1), 1 == e.button && (h = !1), u || (document.removeEventListener("mousemove", E), document.removeEventListener("touchmove", w))
                        }), 0)
                    }

                    function S(e) {
                        document.addEventListener("pointerup", v), t.mouseWorldPos = f.vecToWorldspace(i), o = new c(0, 0), 0 == e.button && (r = !0), "touch" == e.pointerType && -1 == d && (d = e.pointerId, r = !0), 1 == e.button && (h = !0), l = i, a = Date.now()
                    }
                    i = e(m), t.mouseWorldPos = f.vecToWorldspace(i), s = e(m), u = !0, document.addEventListener("mousemove", E), document.addEventListener("touchmove", w), p.addEventListener("pointerdown", S), p.addEventListener("pointerleave", (function e(i) {
                        setTimeout((() => {
                            u = !1, r || (document.removeEventListener("mousemove", E), document.removeEventListener("touchmove", w), t.mouseWorldPos = c.Undefined), p.removeEventListener("pointerdown", S), p.removeEventListener("pointerleave", e)
                        }), 1)
                    }))
                })), this.expandGraphButton?.addEventListener("click", (e => {
                    e.stopPropagation(), t.toggleExpandedGraph()
                })), this.globalGraphButton?.addEventListener("click", (e => {
                    e.stopPropagation(), t.isGlobalGraph ? t.showGraph([ObsidianSite.document.pathname]) : t.showGraph()
                })), p.addEventListener("wheel", (function(e) {
                    const i = .065;
                    e.deltaY > 0 ? (t.scrollVelocity >= -.065 && (t.scrollVelocity = -.065), t.scrollVelocity *= 1.16) : (t.scrollVelocity <= i && (t.scrollVelocity = i), t.scrollVelocity *= 1.16)
                })), p.addEventListener("dblclick", (function(e) {
                    t.fitToNodes()
                })), document.querySelector(".theme-toggle-input")?.addEventListener("change", (t => {
                    setTimeout((() => f.resampleColors()), 0)
                }))
            }
            async generate(t) {
                this.paths = t, this.nodeCount = this.paths.length, this.linkSources = [], this.linkTargets = [], this.labels = [], this.radii = [], this.colors = [];
                const e = [];
                for (let t = 0; t < this.nodeCount; t++) e.push(0);
                let i = 0;
                for (const t of this.paths) {
                    const s = ObsidianSite.getWebpageData(t);
                    if (!s) continue;
                    this.labels.push(s.title);
                    const n = s.links.map((t => R.getPathnameFromURL(t))).concat(s.attachments).concat(s.backlinks);
                    let o = [...new Set(n)];
                    o.push(t);
                    for (const t of o) {
                        const s = this.paths.indexOf(t); - 1 != s && (this.linkSources.push(s), this.linkTargets.push(i), e[i]++, e[s]++)
                    }
                    i++
                }
                const s = Math.max(...e);
                this.radii = e.map((t => f(this.options.minNodeRadius, this.options.maxNodeRadius, Math.min(t / (.8 * s), 1)))), this.linkCount = this.linkSources.length
            }
            async showGraph(t) {
                this.paused = !0;
                let e = [];
                if (t) {
                    for (const i of t) {
                        const t = ObsidianSite.getWebpageData(i);
                        t?.backlinks && e.push(...t.backlinks), t?.links && e.push(...t.links.map((t => R.getPathnameFromURL(t)))), t?.attachments && e.push(...t.attachments)
                    }
                    e.push(...t)
                } else e = ObsidianSite.metadata.allFiles;
                if (e.length == ObsidianSite.metadata.allFiles.length ? this.isGlobalGraph = !0 : this.isGlobalGraph = !1, e = e.filter((t => {
                        let e = ObsidianSite.getWebpageData(t);
                        return !!(e?.backlinks && e?.links && e?.type) && (0 == e.backlinks.length && console.log("No backlinks for", t), !(!this.options.showOrphanNodes && 0 == e.backlinks.length && 0 == e.links.length) && !!(this.options.showAttachments || "attachment" != e.type && "media" != e.type && "other" != e.type))
                    })), 0 == e.length) return void console.log("No nodes to display.");
                const i = [...new Set(e)],
                    s = new Array(2 * i.length).fill(0);
                if (this.paths?.length > 0) {
                    const t = this.graphSim.positionsF;
                    for (let e = 0; e < i.length; e++) {
                        const n = i[e],
                            o = this.paths.indexOf(n); - 1 != o && (s[2 * e] = t[2 * o], s[2 * e + 1] = t[2 * o + 1])
                    }
                }
                await this.generate(i), this.graphSim.init(this, s), this.graphRenderer ? this.graphRenderer.updateData(this) : this.graphRenderer = new it(this), this.fitToNodes(), this.eventsInitialized || (this.initEvents(), this.eventsInitialized = !0), this.paused = !1;
                this.globalGraphButton.innerHTML = this.isGlobalGraph ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-circle-dot"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-git-fork"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>', this.setActiveNodeByPath(ObsidianSite.document.pathname)
            }
            fitToNodes() {
                this.graphRenderer.centerCamera(), this.graphRenderer.cameraScale = 1 / Math.sqrt(this.nodeCount) * this.graphRenderer.canvas.width / 200, this.graphSim.settleness = 1
            }
            update(t) {
                !this.paused && this.graphRenderer && this.graphSim && (this.firstUpdate && (setTimeout((() => this.graphRenderer?.canvas?.classList.remove("hide")), 500), this.firstUpdate = !1), this.graphSim.dt = t, this.graphSim.update(this.mouseWorldPos, this.graphRenderer.grabbedNode, this.graphRenderer.cameraScale), this.graphSim.hoveredNode != this.graphRenderer.hoveredNode && (this.graphRenderer.hoveredNode = this.graphSim.hoveredNode, this.graphRenderer.canvas.style.cursor = -1 == this.graphSim.hoveredNode ? "default" : "pointer"))
            }
            async draw(t) {
                if (!this.graphRenderer || !this.graphSim || 0 == this.paths.length) return;
                const e = (t - this.drawLastTime) / 1e3;
                this.drawLastTime = t, this.graphRenderer.draw(this.graphSim.positions), 0 != this.scrollVelocity && (Math.abs(this.scrollVelocity) < .001 && (this.scrollVelocity = 0), this.zoomAround(this.mouseWorldPos, this.scrollVelocity), this.scrollVelocity *= 1 - 15 * e), requestAnimationFrame(this.draw.bind(this))
            }
            zoomAround(t, e, i = .15, s = 15) {
                const n = this.graphRenderer.getCameraCenterWorldspace();
                if (this.graphRenderer.cameraScale = Math.max(Math.min(this.graphRenderer.cameraScale + e * this.graphRenderer.cameraScale, s), i), this.graphRenderer.cameraScale != i && this.graphRenderer.cameraScale != s && this.scrollVelocity > 0 && !this.mouseWorldPos.isUndefined) {
                    const i = new c(t.x - n.x, t.y - n.y),
                        s = new c(n.x + i.x * e, n.y + i.y * e);
                    this.graphRenderer.setCameraCenterWorldspace(s)
                } else this.graphRenderer.setCameraCenterWorldspace(n)
            }
            scaleAround(t, e, i = .15, s = 15) {
                const n = this.graphRenderer.getCameraCenterWorldspace(),
                    o = this.graphRenderer.cameraScale;
                this.graphRenderer.cameraScale = Math.max(Math.min(e * this.graphRenderer.cameraScale, s), i);
                const a = (o - this.graphRenderer.cameraScale) / o;
                if (this.graphRenderer.cameraScale != i && this.graphRenderer.cameraScale != s && 0 != e) {
                    const e = new c(t.x - n.x, t.y - n.y),
                        i = new c(n.x - e.x * a, n.y - e.y * a);
                    this.graphRenderer.setCameraCenterWorldspace(i)
                } else this.graphRenderer.setCameraCenterWorldspace(n)
            }
            async navigateToNode(t) {
                if (t < 0 || t >= this.nodeCount) return;
                this.graphExpanded && this.toggleExpandedGraph();
                const e = this.paths[t];
                await ObsidianSite.loadURL(e)
            }
            toggleExpandedGraph() {
                const t = this.graphContainer.clientWidth,
                    e = this.graphContainer.clientHeight;
                this.graphContainer.classList.add("scale-down");
                const i = this.graphContainer.animate({
                        opacity: 0
                    }, {
                        duration: 100,
                        easing: "ease-in",
                        fill: "forwards"
                    }),
                    s = this;

                function n(t) {
                    s.graphExpanded && (t.composedPath().includes(s.graphContainer) ? document.addEventListener("pointerdown", n, {
                        once: !0
                    }) : s.toggleExpandedGraph())
                }
                i.addEventListener("finish", (function() {
                    s.graphContainer.classList.toggle("expanded"), s.graphRenderer.autoResizeCanvas(), s.graphRenderer.centerCamera();
                    const i = s.graphContainer.clientWidth,
                        n = s.graphContainer.clientHeight;
                    s.graphRenderer.cameraScale *= (i / t + n / e) / 2, s.graphContainer.classList.remove("scale-down"), s.graphContainer.classList.add("scale-up");
                    s.graphContainer.animate({
                        opacity: 1
                    }, {
                        duration: 200,
                        easing: "ease-out",
                        fill: "forwards"
                    }).addEventListener("finish", (function() {
                        s.graphContainer.classList.remove("scale-up")
                    }))
                })), this.graphExpanded = !this.graphExpanded, this.graphExpanded ? document.addEventListener("pointerdown", n, {
                    once: !0
                }) : document.removeEventListener("pointerdown", n), this.graphRenderer.autoResizeCanvas()
            }
            getNodeByPath(t) {
                return this.paths.indexOf(t)
            }
            setActiveNode(t) {
                t < 0 || t >= this.nodeCount || (this.graphRenderer.activeNode = t)
            }
            setActiveNodeByPath(t) {
                this.setActiveNode(this.getNodeByPath(t))
            }
        },
        nt = class {
            constructor() {
                this.themeToggle = document.querySelector(".theme-toggle-input"), this.themeToggle?.addEventListener("change", (t => {
                    this.switchTheme()
                }))
            }
            switchTheme() {
                let t = "light" == localStorage.getItem("theme") ? "dark" : "light";
                this.setTheme(t, !1)
            }
            setTheme(t, e = !1) {
                let i = "light" == t;
                this.themeToggle.checked = i;
                let s = "";
                e && (s = document.body.style.transition, document.body.style.transition = "none"), !this.themeToggle.classList.contains("is-checked") && i ? this.themeToggle.classList.add("is-checked") : this.themeToggle.classList.contains("is-checked") && !i && this.themeToggle.classList.remove("is-checked"), i ? (document.body.classList.contains("theme-dark") && document.body.classList.remove("theme-dark"), document.body.classList.contains("theme-light") || document.body.classList.add("theme-light")) : (document.body.classList.contains("theme-light") && document.body.classList.remove("theme-light"), document.body.classList.contains("theme-dark") || document.body.classList.add("theme-dark")), e && setTimeout((function() {
                    document.body.style.transition = s
                }), 100), localStorage.setItem("theme", i ? "light" : "dark")
            }
        };
    window && window.location && (window.ObsidianSite = new class {
        constructor() {
            this.isLoaded = !1, this.isHttp = "file:" != window.location.protocol, this.fileTree = void 0, this.outlineTree = void 0, this.search = void 0, this.leftSidebar = void 0, this.rightSidebar = void 0, this.graphView = void 0, this.onloadCallbacks = [], this.cachedWebpageDataMap = new Map, this.cachedFileDataMap = new Map, this.lastScreenWidth = void 0, this.isResizing = !1, this.checkStillResizingTimeout = void 0, this.deviceSize = "large-screen"
        }
        onDocumentLoad(t) {
            this.onloadCallbacks.push(t)
        }
        async init() {
            window.addEventListener("load", (() => ObsidianSite.onInit())), !this.isHttp || (this.metadata = await this.loadWebsiteData(), this.metadata) || console.error("Failed to load website data.")
        }
        async onInit() {
            if (!this.isHttp && (this.metadata = await this.loadWebsiteData(), !this.metadata)) return void console.error("Failed to load website data.");
            await a((() => null != this.metadata)), console.log("Website init"), "file:" != window.location.protocol && await loadIncludes(), this.theme = new nt, this.bodyEl = document.body, this.websiteEl = document.querySelector("#layout"), this.centerContentEl = document.querySelector("#center-content");
            const t = document.querySelector("#file-explorer"),
                e = document.querySelector("#outline"),
                i = document.querySelector(".sidebar#left-sidebar"),
                s = document.querySelector(".sidebar#right-sidebar");
            this.createLoadingEl(), t && (this.fileTree = new z(t)), e && (this.outlineTree = new z(e)), i && (this.leftSidebar = new tt(i)), s && (this.rightSidebar = new tt(s)), this.search = await (new Z).init();
            const n = document.querySelector("meta[name='pathname']")?.getAttribute("content") ?? "unknown";
            this.entryPage = n, this.document = await new I(n).init(), await this.document.loadChildDocuments(), await this.document.postLoadInit(), ObsidianSite.metadata.featureOptions.graphView.enabled && this.loadGraphView().then((() => this.graphView?.showGraph([n]))), this.initEvents(), this.isLoaded = !0, this.onloadCallbacks.forEach((t => t(this.document)))
        }
        initEvents() {
            window.addEventListener("popstate", (async t => {
                if (console.log("popstate", t), !t.state) return;
                const e = t.state.pathname;
                ObsidianSite.loadURL(e)
            }));
            let t = this;
            window.addEventListener("resize", (e => {
                t.onResize()
            })), this.onResize(!0)
        }
        async loadURL(t) {
            const e = R.getHashFromURL(t);
            if (t = R.getPathnameFromURL(t), console.log("Loading URL", t), this.document.pathname == t) return e && this.document.scrollToHeader(e), console.log("loading header", e), this.document;
            if (!ObsidianSite.getWebpageData(t))
                return new F("This page does not exist yet."), void console.warn("Page does not exist", t);
            else
                document.title = ObsidianSite.getWebpageData(t).title;
            let i = await (await new I(t).load()).init();
            return this.onloadCallbacks.forEach((t => t(this.document))), i
        }
        async fetch(t) {
            if (t = R.getPathnameFromURL(t), this.isHttp || t.startsWith("http")) {
                const e = await fetch(t);
                return e.ok ? e : void console.error("Failed to fetch", t)
            } {
                let e = this.getFileData(t);
                return e?.data ? new Response(e.data, {
                    status: 200
                }) : void console.error("Failed to fetch", t)
            }
        }
        async loadWebsiteData() {
            if (!this.isHttp) {
                const t = document.querySelector("data#website-metadata");
                if (!t) return;
                return JSON.parse(decodeURI(t.getAttribute("value") ?? ""))
            }
            try {
                const t = await fetch(q.libFolderName + "/metadata.json");
                if (t.ok) return await t.json();
                console.log("Failed to load website metadata.")
            } catch (t) {
                console.log("Failed to load website metadata.", t)
            }
        }
        async loadGraphView() {
            const t = document.querySelector(".graph-view-wrapper");
            if (!t) return;
            const e = this;
            waitLoadScripts(["pixi", "graph-render-worker", "graph-wasm"], (() => {
                console.log("scripts loaded"), Module.onRuntimeInitialized = () => {
                    console.log("Wasm loaded"), async function() {
                        console.log("Initializing graph view");
                        const i = new st(t);
                        e.graphView = i, console.log("Graph view initialized")
                    }()
                }, run()
            })), await a((() => null != this.graphView))
        }
        getWebpageData(t) {
            if (!this.isHttp) {
                if (this.cachedWebpageDataMap.has(t)) return this.cachedWebpageDataMap.get(t);
                {
                    const e = document.querySelector(`data[id='${encodeURI(t)}']`);
                    if (!e) return {};
                    const i = JSON.parse(decodeURI(e.getAttribute("value") ?? ""));
                    return this.cachedWebpageDataMap.set(t, i), i
                }
            }
            if (this.metadata) {
                const e = this.metadata.webpages[t];
                if (e) return e
            }
            return {}
        }
        getFileData(t) {
            if (!this.isHttp) {
                if (this.cachedFileDataMap.has(t)) return this.cachedFileDataMap.get(t);
                {
                    const e = document.querySelector(`data[id='${encodeURI(t)}']`);
                    if (!e) return {};
                    const i = JSON.parse(decodeURI(e.getAttribute("value") ?? ""));
                    return this.cachedFileDataMap.set(t, i), i
                }
            }
            if (this.metadata) {
                const e = this.metadata.fileInfo[t];
                if (e) return e
            }
            return {}
        }
        scrollTo(t) {
            t.scrollIntoView()
        }
        async showLoading(t, e = this.centerContentEl) {
            if (e.style.transitionDuration = "", e.classList.toggle("hide", t), this.loadingEl.classList.toggle("show", t), t) {
                const t = h.fromElement(e);
                this.loadingEl.style.left = t.center.x - this.loadingEl.offsetWidth / 2 + "px", this.loadingEl.style.top = t.center.y - this.loadingEl.offsetHeight / 2 + "px"
            }
            await o(200)
        }
        createLoadingEl() {
            this.loadingEl = document.createElement("div"), this.loadingEl.classList.add("loading-icon"), document.body.appendChild(this.loadingEl), this.loadingEl.innerHTML = "<div></div><div></div><div></div><div></div>"
        }
        get documentBounds() {
            return h.fromElement(this.centerContentEl)
        }
        onEndResize() {
            this.graphView?.graphRenderer?.autoResizeCanvas(), document.body.classList.toggle("resizing", !1)
        }
        onStartResize() {
            document.body.classList.toggle("resizing", !0)
        }
        onResize(t = !1) {
            this.isResizing || (this.onStartResize(), this.isResizing = !0);
            let e = this;

            function i(t, i) {
                let s = window.innerWidth;
                return s > t && s < i && null == e.lastScreenWidth || s > t && s < i && ((e.lastScreenWidth ?? 0) <= t || (e.lastScreenWidth ?? 0) >= i)
            }

            function s(t) {
                let i = window.innerWidth;
                return i > t && null == e.lastScreenWidth || i > t && (e.lastScreenWidth ?? 0) < t
            }

            function n(t) {
                let i = window.innerWidth;
                return i < t && null == e.lastScreenWidth || i < t && (e.lastScreenWidth ?? 0) > t
            }
            let o = this.metadata.featureOptions.document.documentWidth,
                a = this.metadata.featureOptions.sidebar.leftDefaultWidth,
                h = this.metadata.featureOptions.sidebar.rightDefaultWidth,
                l = r(o, this.centerContentEl),
                c = this.leftSidebar ? r(a, this.leftSidebar?.containerEl) : 0,
                d = this.rightSidebar ? r(h, this.rightSidebar?.containerEl) : 0;
            s(l + c + d) || s(1025) ? (this.deviceSize = "large-screen", document.body.classList.toggle("floating-sidebars", !1), document.body.classList.toggle("is-large-screen", !0), document.body.classList.toggle("is-small-screen", !1), document.body.classList.toggle("is-tablet", !1), document.body.classList.toggle("is-phone", !1), this.leftSidebar && (this.leftSidebar.collapsed = !1), this.rightSidebar && (this.rightSidebar.collapsed = !1)) : i(l + c, l + c + d) || i(769, 1024) ? (this.deviceSize = "small screen", document.body.classList.toggle("floating-sidebars", !1), document.body.classList.toggle("is-large-screen", !1), document.body.classList.toggle("is-small-screen", !0), document.body.classList.toggle("is-tablet", !1), document.body.classList.toggle("is-phone", !1), this.leftSidebar && this.rightSidebar && !this.leftSidebar.collapsed && (this.rightSidebar.collapsed = !0)) : i(c + d, l + c) || i(481, 768) ? (this.deviceSize = "tablet", document.body.classList.toggle("floating-sidebars", !0), document.body.classList.toggle("is-large-screen", !1), document.body.classList.toggle("is-small-screen", !1), document.body.classList.toggle("is-tablet", !0), document.body.classList.toggle("is-phone", !1), this.leftSidebar && this.rightSidebar && !this.leftSidebar.collapsed && (this.rightSidebar.collapsed = !0)) : (n(c + d) || n(480)) && (this.deviceSize = "phone", document.body.classList.toggle("floating-sidebars", !0), document.body.classList.toggle("is-large-screen", !1), document.body.classList.toggle("is-small-screen", !1), document.body.classList.toggle("is-tablet", !1), document.body.classList.toggle("is-phone", !0), this.leftSidebar && (this.leftSidebar.collapsed = !0), this.rightSidebar && (this.rightSidebar.collapsed = !0)), this.lastScreenWidth = window.innerWidth, null != this.checkStillResizingTimeout && clearTimeout(this.checkStillResizingTimeout);
            let u = window.innerWidth;
            this.checkStillResizingTimeout = setTimeout((function() {
                window.innerWidth == u && (e.checkStillResizingTimeout = void 0, e.isResizing = !1, e.onEndResize())
            }), 200)
        }
    }, ObsidianSite = window.ObsidianSite, window.WebpageDocument = I, window.Canvas = E, window.Bounds = h, window.Vector2 = c, window.LinkHandler = R, window.Search = Z, ObsidianSite.init())
})()