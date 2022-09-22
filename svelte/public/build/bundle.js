
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let app$1 = writable();
    let appTitle = writable();

    /* src/unodicegame/Card.svelte generated by Svelte v3.42.1 */

    const file$3 = "src/unodicegame/Card.svelte";

    function create_fragment$3(ctx) {
    	let div23;
    	let div22;
    	let div20;
    	let div0;
    	let t0_value = (/*chain*/ ctx[1][0] || "") + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = (/*chain*/ ctx[1][1] || "") + "";
    	let t2;
    	let t3;
    	let div2;
    	let t4_value = (/*chain*/ ctx[1][2] || "") + "";
    	let t4;
    	let t5;
    	let div3;
    	let t6_value = (/*chain*/ ctx[1][3] || "") + "";
    	let t6;
    	let t7;
    	let div4;
    	let t8_value = (/*chain*/ ctx[1][4] || "") + "";
    	let t8;
    	let t9;
    	let div5;
    	let t10_value = (/*chain*/ ctx[1][5] || "") + "";
    	let t10;
    	let t11;
    	let div6;
    	let t12_value = (/*chain*/ ctx[1][6] || "") + "";
    	let t12;
    	let t13;
    	let div7;
    	let t14_value = (/*chain*/ ctx[1][7] || "") + "";
    	let t14;
    	let t15;
    	let div8;
    	let t16_value = (/*chain*/ ctx[1][8] || "") + "";
    	let t16;
    	let t17;
    	let div9;
    	let t18_value = (/*chain*/ ctx[1][9] || "") + "";
    	let t18;
    	let t19;
    	let div10;
    	let t20_value = (/*chain*/ ctx[1][10] || "") + "";
    	let t20;
    	let t21;
    	let div11;
    	let t22_value = (/*chain*/ ctx[1][11] || "") + "";
    	let t22;
    	let t23;
    	let div12;
    	let t24_value = (/*chain*/ ctx[1][12] || "") + "";
    	let t24;
    	let t25;
    	let div13;
    	let t26_value = (/*chain*/ ctx[1][13] || "") + "";
    	let t26;
    	let t27;
    	let div14;
    	let t28_value = (/*chain*/ ctx[1][14] || "") + "";
    	let t28;
    	let t29;
    	let div15;
    	let t30_value = (/*chain*/ ctx[1][15] || "") + "";
    	let t30;
    	let t31;
    	let div16;
    	let t32_value = (/*chain*/ ctx[1][16] || "") + "";
    	let t32;
    	let t33;
    	let div17;
    	let t34_value = (/*chain*/ ctx[1][17] || "") + "";
    	let t34;
    	let t35;
    	let div18;
    	let t36_value = (/*chain*/ ctx[1][18] || "") + "";
    	let t36;
    	let t37;
    	let div19;
    	let t38_value = (/*chain*/ ctx[1][19] || "") + "";
    	let t38;
    	let t39;
    	let div21;
    	let button0;
    	let span0;
    	let t41;
    	let button1;
    	let span1;
    	let t43;
    	let button2;
    	let span2;
    	let t45;
    	let button3;
    	let span3;
    	let t47;
    	let button4;
    	let span4;
    	let t49;
    	let button5;
    	let span5;
    	let t51;
    	let button6;
    	let span6;
    	let t53;
    	let button7;
    	let span7;
    	let t55;
    	let button8;
    	let span8;
    	let t57;
    	let button9;
    	let span9;
    	let div23_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div23 = element("div");
    			div22 = element("div");
    			div20 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div4 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			div5 = element("div");
    			t10 = text(t10_value);
    			t11 = space();
    			div6 = element("div");
    			t12 = text(t12_value);
    			t13 = space();
    			div7 = element("div");
    			t14 = text(t14_value);
    			t15 = space();
    			div8 = element("div");
    			t16 = text(t16_value);
    			t17 = space();
    			div9 = element("div");
    			t18 = text(t18_value);
    			t19 = space();
    			div10 = element("div");
    			t20 = text(t20_value);
    			t21 = space();
    			div11 = element("div");
    			t22 = text(t22_value);
    			t23 = space();
    			div12 = element("div");
    			t24 = text(t24_value);
    			t25 = space();
    			div13 = element("div");
    			t26 = text(t26_value);
    			t27 = space();
    			div14 = element("div");
    			t28 = text(t28_value);
    			t29 = space();
    			div15 = element("div");
    			t30 = text(t30_value);
    			t31 = space();
    			div16 = element("div");
    			t32 = text(t32_value);
    			t33 = space();
    			div17 = element("div");
    			t34 = text(t34_value);
    			t35 = space();
    			div18 = element("div");
    			t36 = text(t36_value);
    			t37 = space();
    			div19 = element("div");
    			t38 = text(t38_value);
    			t39 = space();
    			div21 = element("div");
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "1";
    			t41 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "2";
    			t43 = space();
    			button2 = element("button");
    			span2 = element("span");
    			span2.textContent = "3";
    			t45 = space();
    			button3 = element("button");
    			span3 = element("span");
    			span3.textContent = "4";
    			t47 = space();
    			button4 = element("button");
    			span4 = element("span");
    			span4.textContent = "5";
    			t49 = space();
    			button5 = element("button");
    			span5 = element("span");
    			span5.textContent = "6";
    			t51 = space();
    			button6 = element("button");
    			span6 = element("span");
    			span6.textContent = "*";
    			t53 = space();
    			button7 = element("button");
    			span7 = element("span");
    			span7.textContent = "-1";
    			t55 = space();
    			button8 = element("button");
    			span8 = element("span");
    			span8.textContent = "+1";
    			t57 = space();
    			button9 = element("button");
    			span9 = element("span");
    			span9.textContent = "Reset";
    			attr_dev(div0, "class", "score svelte-kkqp4x");
    			add_location(div0, file$3, 56, 6, 1411);
    			attr_dev(div1, "class", "score svelte-kkqp4x");
    			add_location(div1, file$3, 57, 6, 1459);
    			attr_dev(div2, "class", "score svelte-kkqp4x");
    			add_location(div2, file$3, 58, 6, 1507);
    			attr_dev(div3, "class", "score svelte-kkqp4x");
    			add_location(div3, file$3, 59, 6, 1555);
    			attr_dev(div4, "class", "score svelte-kkqp4x");
    			add_location(div4, file$3, 60, 6, 1603);
    			attr_dev(div5, "class", "score svelte-kkqp4x");
    			add_location(div5, file$3, 61, 6, 1651);
    			attr_dev(div6, "class", "score svelte-kkqp4x");
    			add_location(div6, file$3, 62, 6, 1699);
    			attr_dev(div7, "class", "score svelte-kkqp4x");
    			add_location(div7, file$3, 63, 6, 1747);
    			attr_dev(div8, "class", "score svelte-kkqp4x");
    			add_location(div8, file$3, 64, 6, 1795);
    			attr_dev(div9, "class", "score svelte-kkqp4x");
    			add_location(div9, file$3, 65, 6, 1843);
    			attr_dev(div10, "class", "score svelte-kkqp4x");
    			add_location(div10, file$3, 66, 6, 1891);
    			attr_dev(div11, "class", "score svelte-kkqp4x");
    			add_location(div11, file$3, 67, 6, 1940);
    			attr_dev(div12, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div12, file$3, 68, 6, 1989);
    			attr_dev(div13, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div13, file$3, 69, 6, 2053);
    			attr_dev(div14, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div14, file$3, 70, 6, 2117);
    			attr_dev(div15, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div15, file$3, 71, 6, 2181);
    			attr_dev(div16, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div16, file$3, 72, 6, 2245);
    			attr_dev(div17, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div17, file$3, 73, 6, 2309);
    			attr_dev(div18, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div18, file$3, 74, 6, 2373);
    			attr_dev(div19, "class", "score extra disabled svelte-kkqp4x");
    			add_location(div19, file$3, 75, 6, 2437);
    			attr_dev(div20, "class", "scores svelte-kkqp4x");
    			add_location(div20, file$3, 55, 4, 1384);
    			attr_dev(span0, "class", "svelte-kkqp4x");
    			add_location(span0, file$3, 79, 38, 2596);
    			attr_dev(button0, "type", "button");
    			button0.value = "1";
    			attr_dev(button0, "class", "svelte-kkqp4x");
    			add_location(button0, file$3, 79, 6, 2564);
    			attr_dev(span1, "class", "svelte-kkqp4x");
    			add_location(span1, file$3, 80, 38, 2658);
    			attr_dev(button1, "type", "button");
    			button1.value = "2";
    			attr_dev(button1, "class", "svelte-kkqp4x");
    			add_location(button1, file$3, 80, 6, 2626);
    			attr_dev(span2, "class", "svelte-kkqp4x");
    			add_location(span2, file$3, 81, 38, 2720);
    			attr_dev(button2, "type", "button");
    			button2.value = "3";
    			attr_dev(button2, "class", "svelte-kkqp4x");
    			add_location(button2, file$3, 81, 6, 2688);
    			attr_dev(span3, "class", "svelte-kkqp4x");
    			add_location(span3, file$3, 82, 38, 2782);
    			attr_dev(button3, "type", "button");
    			button3.value = "4";
    			attr_dev(button3, "class", "svelte-kkqp4x");
    			add_location(button3, file$3, 82, 6, 2750);
    			attr_dev(span4, "class", "svelte-kkqp4x");
    			add_location(span4, file$3, 83, 38, 2844);
    			attr_dev(button4, "type", "button");
    			button4.value = "5";
    			attr_dev(button4, "class", "svelte-kkqp4x");
    			add_location(button4, file$3, 83, 6, 2812);
    			attr_dev(span5, "class", "svelte-kkqp4x");
    			add_location(span5, file$3, 85, 38, 2907);
    			attr_dev(button5, "type", "button");
    			button5.value = "6";
    			attr_dev(button5, "class", "svelte-kkqp4x");
    			add_location(button5, file$3, 85, 6, 2875);
    			attr_dev(span6, "class", "svelte-kkqp4x");
    			add_location(span6, file$3, 86, 38, 2969);
    			attr_dev(button6, "type", "button");
    			button6.value = "*";
    			attr_dev(button6, "class", "svelte-kkqp4x");
    			add_location(button6, file$3, 86, 6, 2937);
    			attr_dev(span7, "class", "svelte-kkqp4x");
    			add_location(span7, file$3, 87, 43, 3036);
    			attr_dev(button7, "type", "button");
    			button7.value = "delete";
    			attr_dev(button7, "class", "svelte-kkqp4x");
    			add_location(button7, file$3, 87, 6, 2999);
    			attr_dev(span8, "class", "svelte-kkqp4x");
    			add_location(span8, file$3, 88, 40, 3101);
    			attr_dev(button8, "type", "button");
    			button8.value = "add";
    			attr_dev(button8, "class", "svelte-kkqp4x");
    			add_location(button8, file$3, 88, 6, 3067);
    			attr_dev(span9, "class", "svelte-kkqp4x");
    			add_location(span9, file$3, 89, 59, 3185);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "reset svelte-kkqp4x");
    			add_location(button9, file$3, 89, 6, 3132);
    			attr_dev(div21, "class", "buttons svelte-kkqp4x");
    			add_location(div21, file$3, 78, 4, 2511);
    			attr_dev(div22, "class", "card svelte-kkqp4x");
    			add_location(div22, file$3, 54, 2, 1361);
    			attr_dev(div23, "class", div23_class_value = "panel " + /*bgColor*/ ctx[0] + " svelte-kkqp4x");
    			add_location(div23, file$3, 53, 0, 1329);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div23, anchor);
    			append_dev(div23, div22);
    			append_dev(div22, div20);
    			append_dev(div20, div0);
    			append_dev(div0, t0);
    			append_dev(div20, t1);
    			append_dev(div20, div1);
    			append_dev(div1, t2);
    			append_dev(div20, t3);
    			append_dev(div20, div2);
    			append_dev(div2, t4);
    			append_dev(div20, t5);
    			append_dev(div20, div3);
    			append_dev(div3, t6);
    			append_dev(div20, t7);
    			append_dev(div20, div4);
    			append_dev(div4, t8);
    			append_dev(div20, t9);
    			append_dev(div20, div5);
    			append_dev(div5, t10);
    			append_dev(div20, t11);
    			append_dev(div20, div6);
    			append_dev(div6, t12);
    			append_dev(div20, t13);
    			append_dev(div20, div7);
    			append_dev(div7, t14);
    			append_dev(div20, t15);
    			append_dev(div20, div8);
    			append_dev(div8, t16);
    			append_dev(div20, t17);
    			append_dev(div20, div9);
    			append_dev(div9, t18);
    			append_dev(div20, t19);
    			append_dev(div20, div10);
    			append_dev(div10, t20);
    			append_dev(div20, t21);
    			append_dev(div20, div11);
    			append_dev(div11, t22);
    			append_dev(div20, t23);
    			append_dev(div20, div12);
    			append_dev(div12, t24);
    			append_dev(div20, t25);
    			append_dev(div20, div13);
    			append_dev(div13, t26);
    			append_dev(div20, t27);
    			append_dev(div20, div14);
    			append_dev(div14, t28);
    			append_dev(div20, t29);
    			append_dev(div20, div15);
    			append_dev(div15, t30);
    			append_dev(div20, t31);
    			append_dev(div20, div16);
    			append_dev(div16, t32);
    			append_dev(div20, t33);
    			append_dev(div20, div17);
    			append_dev(div17, t34);
    			append_dev(div20, t35);
    			append_dev(div20, div18);
    			append_dev(div18, t36);
    			append_dev(div20, t37);
    			append_dev(div20, div19);
    			append_dev(div19, t38);
    			append_dev(div22, t39);
    			append_dev(div22, div21);
    			append_dev(div21, button0);
    			append_dev(button0, span0);
    			append_dev(div21, t41);
    			append_dev(div21, button1);
    			append_dev(button1, span1);
    			append_dev(div21, t43);
    			append_dev(div21, button2);
    			append_dev(button2, span2);
    			append_dev(div21, t45);
    			append_dev(div21, button3);
    			append_dev(button3, span3);
    			append_dev(div21, t47);
    			append_dev(div21, button4);
    			append_dev(button4, span4);
    			append_dev(div21, t49);
    			append_dev(div21, button5);
    			append_dev(button5, span5);
    			append_dev(div21, t51);
    			append_dev(div21, button6);
    			append_dev(button6, span6);
    			append_dev(div21, t53);
    			append_dev(div21, button7);
    			append_dev(button7, span7);
    			append_dev(div21, t55);
    			append_dev(div21, button8);
    			append_dev(button8, span8);
    			append_dev(div21, t57);
    			append_dev(div21, button9);
    			append_dev(button9, span9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button9, "click", /*reset*/ ctx[3], false, false, false),
    					listen_dev(div21, "click", /*onButtonClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chain*/ 2 && t0_value !== (t0_value = (/*chain*/ ctx[1][0] || "") + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*chain*/ 2 && t2_value !== (t2_value = (/*chain*/ ctx[1][1] || "") + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*chain*/ 2 && t4_value !== (t4_value = (/*chain*/ ctx[1][2] || "") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*chain*/ 2 && t6_value !== (t6_value = (/*chain*/ ctx[1][3] || "") + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*chain*/ 2 && t8_value !== (t8_value = (/*chain*/ ctx[1][4] || "") + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*chain*/ 2 && t10_value !== (t10_value = (/*chain*/ ctx[1][5] || "") + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*chain*/ 2 && t12_value !== (t12_value = (/*chain*/ ctx[1][6] || "") + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*chain*/ 2 && t14_value !== (t14_value = (/*chain*/ ctx[1][7] || "") + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*chain*/ 2 && t16_value !== (t16_value = (/*chain*/ ctx[1][8] || "") + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*chain*/ 2 && t18_value !== (t18_value = (/*chain*/ ctx[1][9] || "") + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*chain*/ 2 && t20_value !== (t20_value = (/*chain*/ ctx[1][10] || "") + "")) set_data_dev(t20, t20_value);
    			if (dirty & /*chain*/ 2 && t22_value !== (t22_value = (/*chain*/ ctx[1][11] || "") + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*chain*/ 2 && t24_value !== (t24_value = (/*chain*/ ctx[1][12] || "") + "")) set_data_dev(t24, t24_value);
    			if (dirty & /*chain*/ 2 && t26_value !== (t26_value = (/*chain*/ ctx[1][13] || "") + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*chain*/ 2 && t28_value !== (t28_value = (/*chain*/ ctx[1][14] || "") + "")) set_data_dev(t28, t28_value);
    			if (dirty & /*chain*/ 2 && t30_value !== (t30_value = (/*chain*/ ctx[1][15] || "") + "")) set_data_dev(t30, t30_value);
    			if (dirty & /*chain*/ 2 && t32_value !== (t32_value = (/*chain*/ ctx[1][16] || "") + "")) set_data_dev(t32, t32_value);
    			if (dirty & /*chain*/ 2 && t34_value !== (t34_value = (/*chain*/ ctx[1][17] || "") + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*chain*/ 2 && t36_value !== (t36_value = (/*chain*/ ctx[1][18] || "") + "")) set_data_dev(t36, t36_value);
    			if (dirty & /*chain*/ 2 && t38_value !== (t38_value = (/*chain*/ ctx[1][19] || "") + "")) set_data_dev(t38, t38_value);

    			if (dirty & /*bgColor*/ 1 && div23_class_value !== (div23_class_value = "panel " + /*bgColor*/ ctx[0] + " svelte-kkqp4x")) {
    				attr_dev(div23, "class", div23_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div23);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function addField(card) {
    	if (!card) return;
    	const nextField = card.querySelector(".disabled");
    	if (nextField) nextField.classList.remove("disabled");
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { bgColor } = $$props;

    	let chain = [
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null,
    		null
    	];

    	let chainIndex = 0;

    	function deleteLast() {
    		if (chainIndex === 0) return;
    		$$invalidate(1, chain[chainIndex - 1] = null, chain);
    		chainIndex -= 1;
    	}

    	function addToChain(val) {
    		$$invalidate(1, chain[chainIndex] = val, chain);
    		chainIndex++;
    		return val;
    	}

    	function onButtonClick(event) {
    		const card = event.target.closest(".card");
    		const nextInput = card.querySelectorAll(".scores .score")[chainIndex];
    		const val = event?.target?.closest("button")?.value;
    		if (!val) return;

    		switch (val) {
    			case "delete":
    				deleteLast();
    				break;
    			case "add":
    				addField(card);
    				break;
    			default:
    				!!nextInput && !nextInput.classList.contains("disabled") && addToChain(val);
    				break;
    		}
    	}

    	function reset() {
    		const reset = confirm("Really reset?");

    		if (reset) {
    			chainIndex = 0;
    			chain.forEach((item, index) => $$invalidate(1, chain[index] = null, chain));
    			document.querySelectorAll(".score.extra").forEach(item => item.classList.add("disabled"));
    		}
    	}

    	const writable_props = ['bgColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('bgColor' in $$props) $$invalidate(0, bgColor = $$props.bgColor);
    	};

    	$$self.$capture_state = () => ({
    		bgColor,
    		chain,
    		chainIndex,
    		deleteLast,
    		addField,
    		addToChain,
    		onButtonClick,
    		reset
    	});

    	$$self.$inject_state = $$props => {
    		if ('bgColor' in $$props) $$invalidate(0, bgColor = $$props.bgColor);
    		if ('chain' in $$props) $$invalidate(1, chain = $$props.chain);
    		if ('chainIndex' in $$props) chainIndex = $$props.chainIndex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bgColor, chain, onButtonClick, reset];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { bgColor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*bgColor*/ ctx[0] === undefined && !('bgColor' in props)) {
    			console.warn("<Card> was created without expected prop 'bgColor'");
    		}
    	}

    	get bgColor() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgColor(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/unodicegame/UnoDiceGame.svelte generated by Svelte v3.42.1 */
    const file$2 = "src/unodicegame/UnoDiceGame.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let card0;
    	let t0;
    	let card1;
    	let t1;
    	let card2;
    	let t2;
    	let card3;
    	let current;

    	card0 = new Card({
    			props: { bgColor: "blue" },
    			$$inline: true
    		});

    	card1 = new Card({
    			props: { bgColor: "red" },
    			$$inline: true
    		});

    	card2 = new Card({
    			props: { bgColor: "orange" },
    			$$inline: true
    		});

    	card3 = new Card({
    			props: { bgColor: "green" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(card0.$$.fragment);
    			t0 = space();
    			create_component(card1.$$.fragment);
    			t1 = space();
    			create_component(card2.$$.fragment);
    			t2 = space();
    			create_component(card3.$$.fragment);
    			attr_dev(main, "class", "svelte-1263jsg");
    			add_location(main, file$2, 6, 0, 128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(card0, main, null);
    			append_dev(main, t0);
    			mount_component(card1, main, null);
    			append_dev(main, t1);
    			mount_component(card2, main, null);
    			append_dev(main, t2);
    			mount_component(card3, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			transition_in(card3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			transition_out(card3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    			destroy_component(card3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UnoDiceGame', slots, []);
    	appTitle.set("Uno Dice Game");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UnoDiceGame> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ appTitle, Card });
    	return [];
    }

    class UnoDiceGame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UnoDiceGame",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Menu.svelte generated by Svelte v3.42.1 */
    const file$1 = "src/Menu.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			button = element("button");
    			button.textContent = "Uno Dice Game";
    			attr_dev(button, "class", "svelte-1t53tmq");
    			add_location(button, file$1, 6, 2, 125);
    			attr_dev(main, "class", "svelte-1t53tmq");
    			add_location(main, file$1, 5, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => app$1.set(UnoDiceGame);
    	$$self.$capture_state = () => ({ app: app$1, UnoDiceGame });
    	return [click_handler];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */
    const file = "src/App.svelte";

    // (13:0) {#if app !== Menu}
    function create_if_block(ctx) {
    	let header;
    	let button;
    	let t1;
    	let t2;
    	let em;
    	let mounted;
    	let dispose;
    	let if_block = /*title*/ ctx[0] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			button = element("button");
    			button.textContent = "Back";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			em = element("em");
    			em.textContent = `v${VERSION}`;
    			attr_dev(button, "class", "back");
    			attr_dev(button, "type", "button");
    			add_location(button, file, 14, 2, 300);
    			attr_dev(em, "class", "version");
    			add_location(em, file, 16, 2, 414);
    			add_location(header, file, 13, 0, 289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, button);
    			append_dev(header, t1);
    			if (if_block) if_block.m(header, null);
    			append_dev(header, t2);
    			append_dev(header, em);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(header, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:0) {#if app !== Menu}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if title}
    function create_if_block_1(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[0]);
    			add_location(h1, file, 15, 13, 390);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(16:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	let if_block = /*app*/ ctx[1] !== Menu && create_if_block(ctx);
    	var switch_value = /*app*/ ctx[1];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*app*/ ctx[1] !== Menu) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (switch_value !== (switch_value = /*app*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const VERSION = "1.0.11";

    function instance($$self, $$props, $$invalidate) {
    	let app;
    	let title;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	app$1.subscribe(value => $$invalidate(1, app = value));
    	appTitle.subscribe(value => $$invalidate(0, title = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, app = Menu);

    	$$self.$capture_state = () => ({
    		Menu,
    		storedApp: app$1,
    		appTitle,
    		VERSION,
    		title,
    		app
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('app' in $$props) $$invalidate(1, app = $$props.app);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, app = Menu);
    	$$invalidate(0, title = null);
    	return [title, app, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    if ('serviceWorker' in navigator) {
    	navigator.serviceWorker.register('./sw.js')
    	.then(reg => {
    		console.log('Registration succeeded.');
    		reg.update();
    	}).catch(error => {
    		console.log('Registration failed with ' + error);
    	});
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
