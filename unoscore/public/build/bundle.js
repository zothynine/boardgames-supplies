
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
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    function attribute_to_object(attributes) {
        const result = {};
        for (const attribute of attributes) {
            result[attribute.name] = attribute.value;
        }
        return result;
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
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
    let SvelteElement;
    if (typeof HTMLElement === 'function') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                const { on_mount } = this.$$;
                this.$$.on_disconnect = on_mount.map(run).filter(is_function);
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            disconnectedCallback() {
                run_all(this.$$.on_disconnect);
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
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
        };
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

    /* src/Card.webcomponent.svelte generated by Svelte v3.42.1 */

    const file$1 = "src/Card.webcomponent.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let form;
    	let fieldset0;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let input3;
    	let t3;
    	let input4;
    	let t4;
    	let input5;
    	let t5;
    	let input6;
    	let t6;
    	let input7;
    	let t7;
    	let input8;
    	let t8;
    	let input9;
    	let t9;
    	let input10;
    	let t10;
    	let input11;
    	let t11;
    	let input12;
    	let t12;
    	let input13;
    	let t13;
    	let input14;
    	let t14;
    	let input15;
    	let t15;
    	let input16;
    	let t16;
    	let input17;
    	let t17;
    	let input18;
    	let t18;
    	let input19;
    	let t19;
    	let fieldset1;
    	let div0;
    	let button0;
    	let span0;
    	let t21;
    	let button1;
    	let span1;
    	let t23;
    	let button2;
    	let span2;
    	let t25;
    	let button3;
    	let span3;
    	let t27;
    	let button4;
    	let span4;
    	let t29;
    	let div1;
    	let button5;
    	let span5;
    	let t31;
    	let button6;
    	let span6;
    	let t33;
    	let button7;
    	let span7;
    	let t35;
    	let button8;
    	let span8;
    	let t37;
    	let button9;
    	let span9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			form = element("form");
    			fieldset0 = element("fieldset");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			t3 = space();
    			input4 = element("input");
    			t4 = space();
    			input5 = element("input");
    			t5 = space();
    			input6 = element("input");
    			t6 = space();
    			input7 = element("input");
    			t7 = space();
    			input8 = element("input");
    			t8 = space();
    			input9 = element("input");
    			t9 = space();
    			input10 = element("input");
    			t10 = space();
    			input11 = element("input");
    			t11 = space();
    			input12 = element("input");
    			t12 = space();
    			input13 = element("input");
    			t13 = space();
    			input14 = element("input");
    			t14 = space();
    			input15 = element("input");
    			t15 = space();
    			input16 = element("input");
    			t16 = space();
    			input17 = element("input");
    			t17 = space();
    			input18 = element("input");
    			t18 = space();
    			input19 = element("input");
    			t19 = space();
    			fieldset1 = element("fieldset");
    			div0 = element("div");
    			button0 = element("button");
    			span0 = element("span");
    			span0.textContent = "1";
    			t21 = space();
    			button1 = element("button");
    			span1 = element("span");
    			span1.textContent = "2";
    			t23 = space();
    			button2 = element("button");
    			span2 = element("span");
    			span2.textContent = "3";
    			t25 = space();
    			button3 = element("button");
    			span3 = element("span");
    			span3.textContent = "4";
    			t27 = space();
    			button4 = element("button");
    			span4 = element("span");
    			span4.textContent = "5";
    			t29 = space();
    			div1 = element("div");
    			button5 = element("button");
    			span5 = element("span");
    			span5.textContent = "6";
    			t31 = space();
    			button6 = element("button");
    			span6 = element("span");
    			span6.textContent = "*";
    			t33 = space();
    			button7 = element("button");
    			span7 = element("span");
    			span7.textContent = "-1";
    			t35 = space();
    			button8 = element("button");
    			span8 = element("span");
    			span8.textContent = "+1";
    			t37 = space();
    			button9 = element("button");
    			span9 = element("span");
    			span9.textContent = "R";
    			this.c = noop;
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$1, 56, 12, 1445);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$1, 57, 12, 1499);
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$1, 58, 12, 1553);
    			attr_dev(input3, "type", "text");
    			add_location(input3, file$1, 59, 12, 1607);
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$1, 60, 12, 1661);
    			attr_dev(input5, "type", "text");
    			add_location(input5, file$1, 61, 12, 1715);
    			attr_dev(input6, "type", "text");
    			add_location(input6, file$1, 62, 12, 1769);
    			attr_dev(input7, "type", "text");
    			add_location(input7, file$1, 63, 12, 1823);
    			attr_dev(input8, "type", "text");
    			add_location(input8, file$1, 64, 12, 1877);
    			attr_dev(input9, "type", "text");
    			add_location(input9, file$1, 65, 12, 1931);
    			attr_dev(input10, "type", "text");
    			add_location(input10, file$1, 66, 12, 1985);
    			attr_dev(input11, "type", "text");
    			add_location(input11, file$1, 67, 12, 2040);
    			attr_dev(input12, "type", "text");
    			input12.disabled = true;
    			add_location(input12, file$1, 68, 12, 2095);
    			attr_dev(input13, "type", "text");
    			input13.disabled = true;
    			add_location(input13, file$1, 69, 12, 2159);
    			attr_dev(input14, "type", "text");
    			input14.disabled = true;
    			add_location(input14, file$1, 70, 12, 2223);
    			attr_dev(input15, "type", "text");
    			input15.disabled = true;
    			add_location(input15, file$1, 71, 12, 2287);
    			attr_dev(input16, "type", "text");
    			input16.disabled = true;
    			add_location(input16, file$1, 72, 12, 2351);
    			attr_dev(input17, "type", "text");
    			input17.disabled = true;
    			add_location(input17, file$1, 73, 12, 2415);
    			attr_dev(input18, "type", "text");
    			input18.disabled = true;
    			add_location(input18, file$1, 74, 12, 2479);
    			attr_dev(input19, "type", "text");
    			input19.disabled = true;
    			add_location(input19, file$1, 75, 12, 2543);
    			attr_dev(fieldset0, "class", "chain");
    			add_location(fieldset0, file$1, 55, 8, 1408);
    			add_location(span0, file$1, 79, 48, 2741);
    			attr_dev(button0, "type", "button");
    			button0.value = "1";
    			add_location(button0, file$1, 79, 16, 2709);
    			add_location(span1, file$1, 80, 48, 2813);
    			attr_dev(button1, "type", "button");
    			button1.value = "2";
    			add_location(button1, file$1, 80, 16, 2781);
    			add_location(span2, file$1, 81, 48, 2885);
    			attr_dev(button2, "type", "button");
    			button2.value = "3";
    			add_location(button2, file$1, 81, 16, 2853);
    			add_location(span3, file$1, 82, 48, 2957);
    			attr_dev(button3, "type", "button");
    			button3.value = "4";
    			add_location(button3, file$1, 82, 16, 2925);
    			add_location(span4, file$1, 83, 48, 3029);
    			attr_dev(button4, "type", "button");
    			button4.value = "5";
    			add_location(button4, file$1, 83, 16, 2997);
    			add_location(div0, file$1, 78, 12, 2687);
    			add_location(span5, file$1, 86, 48, 3138);
    			attr_dev(button5, "type", "button");
    			button5.value = "6";
    			add_location(button5, file$1, 86, 16, 3106);
    			add_location(span6, file$1, 87, 48, 3210);
    			attr_dev(button6, "type", "button");
    			button6.value = "*";
    			add_location(button6, file$1, 87, 16, 3178);
    			add_location(span7, file$1, 88, 53, 3287);
    			attr_dev(button7, "type", "button");
    			button7.value = "delete";
    			add_location(button7, file$1, 88, 16, 3250);
    			add_location(span8, file$1, 89, 50, 3362);
    			attr_dev(button8, "type", "button");
    			button8.value = "add";
    			add_location(button8, file$1, 89, 16, 3328);
    			add_location(span9, file$1, 90, 55, 3442);
    			attr_dev(button9, "type", "button");
    			add_location(button9, file$1, 90, 16, 3403);
    			add_location(div1, file$1, 85, 12, 3084);
    			attr_dev(fieldset1, "class", "buttons");
    			add_location(fieldset1, file$1, 77, 8, 2623);
    			add_location(form, file$1, 54, 4, 1393);
    			attr_dev(div2, "class", "card");
    			add_location(div2, file$1, 53, 0, 1370);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, form);
    			append_dev(form, fieldset0);
    			append_dev(fieldset0, input0);
    			set_input_value(input0, /*chain*/ ctx[0][0]);
    			append_dev(fieldset0, t0);
    			append_dev(fieldset0, input1);
    			set_input_value(input1, /*chain*/ ctx[0][1]);
    			append_dev(fieldset0, t1);
    			append_dev(fieldset0, input2);
    			set_input_value(input2, /*chain*/ ctx[0][2]);
    			append_dev(fieldset0, t2);
    			append_dev(fieldset0, input3);
    			set_input_value(input3, /*chain*/ ctx[0][3]);
    			append_dev(fieldset0, t3);
    			append_dev(fieldset0, input4);
    			set_input_value(input4, /*chain*/ ctx[0][4]);
    			append_dev(fieldset0, t4);
    			append_dev(fieldset0, input5);
    			set_input_value(input5, /*chain*/ ctx[0][5]);
    			append_dev(fieldset0, t5);
    			append_dev(fieldset0, input6);
    			set_input_value(input6, /*chain*/ ctx[0][6]);
    			append_dev(fieldset0, t6);
    			append_dev(fieldset0, input7);
    			set_input_value(input7, /*chain*/ ctx[0][7]);
    			append_dev(fieldset0, t7);
    			append_dev(fieldset0, input8);
    			set_input_value(input8, /*chain*/ ctx[0][8]);
    			append_dev(fieldset0, t8);
    			append_dev(fieldset0, input9);
    			set_input_value(input9, /*chain*/ ctx[0][9]);
    			append_dev(fieldset0, t9);
    			append_dev(fieldset0, input10);
    			set_input_value(input10, /*chain*/ ctx[0][10]);
    			append_dev(fieldset0, t10);
    			append_dev(fieldset0, input11);
    			set_input_value(input11, /*chain*/ ctx[0][11]);
    			append_dev(fieldset0, t11);
    			append_dev(fieldset0, input12);
    			set_input_value(input12, /*chain*/ ctx[0][12]);
    			append_dev(fieldset0, t12);
    			append_dev(fieldset0, input13);
    			set_input_value(input13, /*chain*/ ctx[0][13]);
    			append_dev(fieldset0, t13);
    			append_dev(fieldset0, input14);
    			set_input_value(input14, /*chain*/ ctx[0][14]);
    			append_dev(fieldset0, t14);
    			append_dev(fieldset0, input15);
    			set_input_value(input15, /*chain*/ ctx[0][15]);
    			append_dev(fieldset0, t15);
    			append_dev(fieldset0, input16);
    			set_input_value(input16, /*chain*/ ctx[0][16]);
    			append_dev(fieldset0, t16);
    			append_dev(fieldset0, input17);
    			set_input_value(input17, /*chain*/ ctx[0][17]);
    			append_dev(fieldset0, t17);
    			append_dev(fieldset0, input18);
    			set_input_value(input18, /*chain*/ ctx[0][18]);
    			append_dev(fieldset0, t18);
    			append_dev(fieldset0, input19);
    			set_input_value(input19, /*chain*/ ctx[0][19]);
    			append_dev(form, t19);
    			append_dev(form, fieldset1);
    			append_dev(fieldset1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, span0);
    			append_dev(div0, t21);
    			append_dev(div0, button1);
    			append_dev(button1, span1);
    			append_dev(div0, t23);
    			append_dev(div0, button2);
    			append_dev(button2, span2);
    			append_dev(div0, t25);
    			append_dev(div0, button3);
    			append_dev(button3, span3);
    			append_dev(div0, t27);
    			append_dev(div0, button4);
    			append_dev(button4, span4);
    			append_dev(fieldset1, t29);
    			append_dev(fieldset1, div1);
    			append_dev(div1, button5);
    			append_dev(button5, span5);
    			append_dev(div1, t31);
    			append_dev(div1, button6);
    			append_dev(button6, span6);
    			append_dev(div1, t33);
    			append_dev(div1, button7);
    			append_dev(button7, span7);
    			append_dev(div1, t35);
    			append_dev(div1, button8);
    			append_dev(button8, span8);
    			append_dev(div1, t37);
    			append_dev(div1, button9);
    			append_dev(button9, span9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[7]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[8]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[9]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[10]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[11]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[12]),
    					listen_dev(input10, "input", /*input10_input_handler*/ ctx[13]),
    					listen_dev(input11, "input", /*input11_input_handler*/ ctx[14]),
    					listen_dev(input12, "input", /*input12_input_handler*/ ctx[15]),
    					listen_dev(input13, "input", /*input13_input_handler*/ ctx[16]),
    					listen_dev(input14, "input", /*input14_input_handler*/ ctx[17]),
    					listen_dev(input15, "input", /*input15_input_handler*/ ctx[18]),
    					listen_dev(input16, "input", /*input16_input_handler*/ ctx[19]),
    					listen_dev(input17, "input", /*input17_input_handler*/ ctx[20]),
    					listen_dev(input18, "input", /*input18_input_handler*/ ctx[21]),
    					listen_dev(input19, "input", /*input19_input_handler*/ ctx[22]),
    					listen_dev(button9, "click", reset, false, false, false),
    					listen_dev(fieldset1, "click", /*onButtonClick*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chain*/ 1 && input0.value !== /*chain*/ ctx[0][0]) {
    				set_input_value(input0, /*chain*/ ctx[0][0]);
    			}

    			if (dirty & /*chain*/ 1 && input1.value !== /*chain*/ ctx[0][1]) {
    				set_input_value(input1, /*chain*/ ctx[0][1]);
    			}

    			if (dirty & /*chain*/ 1 && input2.value !== /*chain*/ ctx[0][2]) {
    				set_input_value(input2, /*chain*/ ctx[0][2]);
    			}

    			if (dirty & /*chain*/ 1 && input3.value !== /*chain*/ ctx[0][3]) {
    				set_input_value(input3, /*chain*/ ctx[0][3]);
    			}

    			if (dirty & /*chain*/ 1 && input4.value !== /*chain*/ ctx[0][4]) {
    				set_input_value(input4, /*chain*/ ctx[0][4]);
    			}

    			if (dirty & /*chain*/ 1 && input5.value !== /*chain*/ ctx[0][5]) {
    				set_input_value(input5, /*chain*/ ctx[0][5]);
    			}

    			if (dirty & /*chain*/ 1 && input6.value !== /*chain*/ ctx[0][6]) {
    				set_input_value(input6, /*chain*/ ctx[0][6]);
    			}

    			if (dirty & /*chain*/ 1 && input7.value !== /*chain*/ ctx[0][7]) {
    				set_input_value(input7, /*chain*/ ctx[0][7]);
    			}

    			if (dirty & /*chain*/ 1 && input8.value !== /*chain*/ ctx[0][8]) {
    				set_input_value(input8, /*chain*/ ctx[0][8]);
    			}

    			if (dirty & /*chain*/ 1 && input9.value !== /*chain*/ ctx[0][9]) {
    				set_input_value(input9, /*chain*/ ctx[0][9]);
    			}

    			if (dirty & /*chain*/ 1 && input10.value !== /*chain*/ ctx[0][10]) {
    				set_input_value(input10, /*chain*/ ctx[0][10]);
    			}

    			if (dirty & /*chain*/ 1 && input11.value !== /*chain*/ ctx[0][11]) {
    				set_input_value(input11, /*chain*/ ctx[0][11]);
    			}

    			if (dirty & /*chain*/ 1 && input12.value !== /*chain*/ ctx[0][12]) {
    				set_input_value(input12, /*chain*/ ctx[0][12]);
    			}

    			if (dirty & /*chain*/ 1 && input13.value !== /*chain*/ ctx[0][13]) {
    				set_input_value(input13, /*chain*/ ctx[0][13]);
    			}

    			if (dirty & /*chain*/ 1 && input14.value !== /*chain*/ ctx[0][14]) {
    				set_input_value(input14, /*chain*/ ctx[0][14]);
    			}

    			if (dirty & /*chain*/ 1 && input15.value !== /*chain*/ ctx[0][15]) {
    				set_input_value(input15, /*chain*/ ctx[0][15]);
    			}

    			if (dirty & /*chain*/ 1 && input16.value !== /*chain*/ ctx[0][16]) {
    				set_input_value(input16, /*chain*/ ctx[0][16]);
    			}

    			if (dirty & /*chain*/ 1 && input17.value !== /*chain*/ ctx[0][17]) {
    				set_input_value(input17, /*chain*/ ctx[0][17]);
    			}

    			if (dirty & /*chain*/ 1 && input18.value !== /*chain*/ ctx[0][18]) {
    				set_input_value(input18, /*chain*/ ctx[0][18]);
    			}

    			if (dirty & /*chain*/ 1 && input19.value !== /*chain*/ ctx[0][19]) {
    				set_input_value(input19, /*chain*/ ctx[0][19]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
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

    function addField(card) {
    	if (!card) return;
    	const nextField = card.querySelector("[disabled]");
    	if (nextField) nextField.removeAttribute("disabled");
    }

    function reset() {
    	const reset = confirm("Really reset?");

    	if (reset) {
    		window.location.reload();
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('uno-card', slots, []);
    	let { color = "white" } = $$props;

    	const chain = [
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
    		$$invalidate(0, chain[chainIndex - 1] = null, chain);
    		chainIndex -= 1;
    	}

    	function addToChain(val) {
    		$$invalidate(0, chain[chainIndex] = val, chain);
    		chainIndex++;
    		return val;
    	}

    	function onButtonClick(event) {
    		const card = event.target.offsetParent;
    		const nextInput = card.querySelectorAll(".chain input")[chainIndex];
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
    				!!nextInput && !nextInput.disabled && addToChain(val);
    				break;
    		}
    	}

    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<uno-card> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		chain[0] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input1_input_handler() {
    		chain[1] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input2_input_handler() {
    		chain[2] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input3_input_handler() {
    		chain[3] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input4_input_handler() {
    		chain[4] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input5_input_handler() {
    		chain[5] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input6_input_handler() {
    		chain[6] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input7_input_handler() {
    		chain[7] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input8_input_handler() {
    		chain[8] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input9_input_handler() {
    		chain[9] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input10_input_handler() {
    		chain[10] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input11_input_handler() {
    		chain[11] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input12_input_handler() {
    		chain[12] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input13_input_handler() {
    		chain[13] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input14_input_handler() {
    		chain[14] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input15_input_handler() {
    		chain[15] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input16_input_handler() {
    		chain[16] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input17_input_handler() {
    		chain[17] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input18_input_handler() {
    		chain[18] = this.value;
    		$$invalidate(0, chain);
    	}

    	function input19_input_handler() {
    		chain[19] = this.value;
    		$$invalidate(0, chain);
    	}

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({
    		color,
    		chain,
    		chainIndex,
    		deleteLast,
    		addField,
    		addToChain,
    		onButtonClick,
    		reset
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('chainIndex' in $$props) chainIndex = $$props.chainIndex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		chain,
    		onButtonClick,
    		color,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler,
    		input10_input_handler,
    		input11_input_handler,
    		input12_input_handler,
    		input13_input_handler,
    		input14_input_handler,
    		input15_input_handler,
    		input16_input_handler,
    		input17_input_handler,
    		input18_input_handler,
    		input19_input_handler
    	];
    }

    class Card_webcomponent extends SvelteElement {
    	constructor(options) {
    		super();

    		this.shadowRoot.innerHTML = `<style>.card{--bg-color:white;--border-radius:5px;--border:3px solid black;box-sizing:border-box;display:flex;flex-direction:column;height:100%;padding:16px 32px 32px;position:relative}fieldset{border:none;padding:0}fieldset+fieldset{padding-top:15px}.chain{--grid-template-units:calc(var(--width-basis, 25vw)/5 - 15px);align-self:center;display:grid;grid-template-columns:repeat(4, var(--grid-template-units));grid-template-rows:repeat(5, var(--grid-template-units));gap:10px;margin-top:10px
    }input{background-color:var(--bg-color);border:var(--border);border-radius:var(--border-radius);box-sizing:border-box;text-align:center;font-size:2rem;padding:0;pointer-events:none}.buttons div{display:flex;flex-direction:row;gap:3px}.buttons div+div{margin-top:10px}button{background-color:var(--bg-color);border:var(--border);border-radius:var(--border-radius);display:block;flex-basis:50px;height:50px;margin:0}button span{font-size:2rem}button[value="*"]{background-color:white;color:black}button[value="*"] span{font-size:3.5rem}button[value="delete"],button[value="add"]{background-color:black;color:white}[disabled]{background-color:transparent;border-style:dashed}</style>`;

    		init(
    			this,
    			{
    				target: this.shadowRoot,
    				props: attribute_to_object(this.attributes),
    				customElement: true
    			},
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{ color: 2 },
    			null
    		);

    		if (options) {
    			if (options.target) {
    				insert_dev(options.target, this, options.anchor);
    			}

    			if (options.props) {
    				this.$set(options.props);
    				flush();
    			}
    		}
    	}

    	static get observedAttributes() {
    		return ["color"];
    	}

    	get color() {
    		return this.$$.ctx[2];
    	}

    	set color(color) {
    		this.$$set({ color });
    		flush();
    	}
    }

    customElements.define("uno-card", Card_webcomponent);

    /* src/App.svelte generated by Svelte v3.42.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let em;
    	let t1;
    	let uno_card0;
    	let t2;
    	let uno_card1;
    	let t3;
    	let uno_card2;
    	let t4;
    	let uno_card3;

    	const block = {
    		c: function create() {
    			main = element("main");
    			em = element("em");
    			em.textContent = `${VERSION}`;
    			t1 = space();
    			uno_card0 = element("uno-card");
    			t2 = space();
    			uno_card1 = element("uno-card");
    			t3 = space();
    			uno_card2 = element("uno-card");
    			t4 = space();
    			uno_card3 = element("uno-card");
    			attr_dev(em, "class", "version svelte-nob158");
    			add_location(em, file, 7, 1, 93);
    			set_custom_element_data(uno_card0, "color", "blue");
    			set_style(uno_card0, "--card-color", "blue");
    			set_custom_element_data(uno_card0, "class", "svelte-nob158");
    			add_location(uno_card0, file, 8, 1, 129);
    			set_custom_element_data(uno_card1, "color", "red");
    			set_style(uno_card1, "--card-color", "red");
    			set_custom_element_data(uno_card1, "class", "svelte-nob158");
    			add_location(uno_card1, file, 9, 1, 182);
    			set_custom_element_data(uno_card2, "color", "orange");
    			set_style(uno_card2, "--card-color", "orange");
    			set_custom_element_data(uno_card2, "class", "svelte-nob158");
    			add_location(uno_card2, file, 10, 1, 233);
    			set_custom_element_data(uno_card3, "color", "green");
    			set_style(uno_card3, "--card-color", "green");
    			set_custom_element_data(uno_card3, "class", "svelte-nob158");
    			add_location(uno_card3, file, 11, 1, 290);
    			attr_dev(main, "class", "svelte-nob158");
    			add_location(main, file, 6, 0, 85);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, em);
    			append_dev(main, t1);
    			append_dev(main, uno_card0);
    			append_dev(main, t2);
    			append_dev(main, uno_card1);
    			append_dev(main, t3);
    			append_dev(main, uno_card2);
    			append_dev(main, t4);
    			append_dev(main, uno_card3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
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

    const VERSION = "1.0.2";

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ VERSION });
    	return [];
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

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
