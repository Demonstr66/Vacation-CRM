function addModuleName(item, moduleName) {
  if (item.meta) {
    item.meta.module = moduleName
  }
  if (item.children) {
    item.children = item.children.map(child => addModuleName(child, moduleName))
  }
  return item
}

export function getNormalModuleRoutes(items, moduleName) {
  return items.map(item => addModuleName(item))
}

export function createRoute(path, component, options = {}) {

  const route = {
    path,
    meta: {
      layout: 'MainEmptyLayout',
      title: '',
      protected: {
        accessLevel: [2]
      }
    }
  }

  if (component) {
    route.component = component
    route.name = component.toString().split('(')[0].replace('function', '').trim()
  }

  if (options.layout) {
    route.meta.layout = options.layout
  }
  if (options.title) {
    route.meta.title = options.title
  }
  if (options.accessLevel) {
    route.meta.protected.accessLevel = options.accessLevel
  }
  if (options.redirect) {
    route.redirect = options.redirect
  }
  if (options.children) {
    route.children = options.children.map(child => {
      if (!child[2]) {
        child[2] = {}
      }
      if (!child[2].title) {
        child[2].title = options.title
      }

      return createRoute(child[0], child[1], child[2])
    })
  }

  return route
}