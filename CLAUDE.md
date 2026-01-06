# Claude Code - Lessons Learned

**Best practices:**
1. **Ask first, code second** - Use AskUserQuestion when unclear
2. **Read docs/MCP** - Check framework patterns before implementing (like Pinia + Nuxt SSR with `callOnce()`)
3. **Keep it minimal** - Only add what's explicitly needed
4. **Types in the right place** - Shared types in shared/, only local state interfaces in implementation files
5. **Leverage the framework** - Use Nuxt's SSR, auto-imports, and built-in composables

**Nuxt-specific:**
- Use `callOnce()` for SSR data fetching with Pinia
- Use `$fetch` and `useRequestURL()` for server-safe requests

**Mistakes to avoid:**
1. Don't recreate types that already exist or should exist in shared files
2. Don't add imports in Nuxt - trust auto-imports for defineStore, composables, and shared types
4. Don't use client-side fetching (onMounted) when SSR is available
5. Don't keep loading states when using SSR - data is fetched before render
