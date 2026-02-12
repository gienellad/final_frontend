export default defineNuxtRouteMiddleware((to, from) => {
  // Kunin ang cookie na 'auth_token'
  const token = useCookie('auth_token')

  // LOGIC: Kung walang token at susubukan pumasok sa kahit anong page 
  // maliban sa login (/), ibalik siya sa login page.
  if (!token.value && to.path !== '/') {
    return navigateTo('/')
  }
})