# vue2-todos-app

created_at: 2021/01/09

Use Vue@2.6.14 & BootstrapVue@2.21.2

## Component/instance Options Order

Component/instance options should be ordered consistently.

1. Side Effects (triggers effects outside the component)
   - `el`
2. Global Awareness (requires knowledge beyond the component)
   - `name`
   - `parent`
3. Component Type (changes the type of the component)
   - `functional`
4. Template Modifiers (changes the way templates are compiled)
   - `delimiters`
   - `comments`
5. Template Dependencies (assets used in the template)
   - `components`
   - `directives`
   - `filters`
6. Composition (merges properties into the options)
   - `extends`
   - `mixins`
7. Interface (the interface to the component)
   - `inheritAttrs`
   - `model`
   - `props`/`propsData`
8. Local State (local reactive properties)
   - `data`
   - `computed`
9. Events (callbacks triggered by reactive events)
   - `watch`
   - Lifecycle Events (in the order they are called)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeDestroy`
     - `destroyed`
10. Non-Reactive Properties (instance properties independent of the reactivity system)
    - `methods`
11. Rendering (the declarative description of the component output)
    - `template`/`render`
    - `renderError`
