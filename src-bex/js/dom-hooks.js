import detectQuasar from './dom/detect-quasar'

export default function attachDomHooks (bridge) {
  detectQuasar(bridge)
}
