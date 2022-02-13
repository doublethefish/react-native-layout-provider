import { Component, createElement } from 'react'
import shallowEqual from 'shallowequal'
import hoistStatics from 'hoist-non-react-statics'

interface Options {
  withRef?: boolean;
}

interface GetLayoutProps {
}

interface GetLayoutState {
}

const defaultMapLayoutToProps = (layout:GetLayoutState):GetLayoutProps => layout
const mergeProps = (contextProps:GetLayoutProps, props:GetLayoutProps) : GetLayoutProps=> ({
  ...contextProps,
  ...props,
})

const getDisplayName = (WrappedComponent:any) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component'

export default function getLayout(mapLayoutToProps = defaultMapLayoutToProps, options:Options = {}) {
  return (WrappedComponent:any): typeof Component => {
    class GetLayout extends Component<GetLayoutProps, GetLayoutState> {
      static displayName = `GetLayout(${getDisplayName(WrappedComponent)})`
      mergedProps: GetLayoutProps | {};
      props: GetLayoutProps;
      unsubscribe: (() => void) | null;

      constructor(props:GetLayoutProps) {
        super(props);
        this.mergedProps = {};
        this.unsubscribe = null;
        this.props = {};
      }

      UNSAFE_componentWillMount() {
        this.state = this.context.getLayoutProviderState()
        this.mergedProps = mergeProps(mapLayoutToProps(this.state), this.props)
        const { subscribeLayout: subscribe } = this.context
        if (!this.unsubscribe && subscribe) {
          this.unsubscribe = subscribe((state:GetLayoutState) => {
            this.mergedProps = mergeProps(mapLayoutToProps(state), this.props)
            this.setState(state)
          })
        }
      }

      UNSAFE_componentWillReceiveProps(
          nextProps:GetLayoutProps,
          nextContext: {
              getLayoutProviderState: (()=>GetLayoutState)
            }) {
        const { getLayoutProviderState: getState } = nextContext
        if (!this.unsubscribe && getState) {
          this.mergedProps = mergeProps(mapLayoutToProps(getState()), nextProps)
        } else {
          this.mergedProps = mergeProps(this.mergedProps, nextProps)
        }
      }

      shouldComponentUpdate(nextProps:GetLayoutProps, nextState:GetLayoutState) {
        return !shallowEqual(this.props, nextProps) ||
          !shallowEqual(this.state, nextState)
      }

      UNSAFE_componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe()
          this.mergedProps = {};
        }
      }

      render() {
        const renderProps = options.withRef ?
          { ...this.mergedProps, ref: 'wrapInstance' } :
          this.mergedProps
        return createElement(WrappedComponent, renderProps)
      }
    }

    const ret = hoistStatics<typeof GetLayout, typeof WrappedComponent>(GetLayout, WrappedComponent);
    return ret;
  }
}
